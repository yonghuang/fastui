/**
 * @class fastDev.Data.DataSet
 * @extends fastDev.Core.Base
 * @author 袁刚
 * 数据集实现类，实现了数据增、删、改、查、排序、统计等方面的功能
 */

fastDev.define("fastDev.Data.DataSet", {
	extend : "fastDev.Core.Base",
	alias : "DataSet",
	_options : {
		/**
		 * 字段配置信息
		 * @type {Array}
		 */
		fields : null,
		/**
		 * 静态数据
		 * @type {String}
		 */
		data : null,
		/**
		 * 数据映射配置，指定后台Json数据与前台控件需要数据格式的映射
		 * @type {JsonObject}
		 */
		mapper : null,
		/**
		 * 此数据集是否做原始数据备份
		 * @type {Boolean}
		 */
		backup : false,
		/**
		 * 数据结构类型 (normal|Tree)
		 * @type {String}
		 */
		structure : "normal",
		/**
		 * 更新界面所使用的渲染器
		 */
		renderer : null,
		/**
		 * 远程数据根节点
		 */
		root : null,
		/**
		 * 代理数据请求完成事件
		 * @event
		 * @private
		 */
		onAfterLoad : fastDev.noop
	},
	ready : function(options) {
		// 静态数据存储结束索引，正常操作下数据集会维护从0到此索引值的数据
		this.retain = options.data ? options.data.length : 0;
		// 数据存储对象
		this.records = [];
		// 备份存储对象
		this.backups = [];
		// 数据读取器
		this.reader = fastDev.Data.Reader;
	},
	/**
	 *  数据集构造
	 *  @param {JsonObject} options 配置信息
	 *  @param {JsonObject} global 组件内全局空间
	 * @protected
	 */
	construct : function(options) {
		// 创建数据模型对象
		this.model = fastDev.create("Model", {
			fields : options.fields,
			mapper : options.mapper
		});
		// 创建结构化数据
		if(options.structure === "Tree") {
			this.structure = fastDev.create("S_Tree", this.model.fields);
		}
	},
	/**
	 *  数据集初始化
	 *  @param {JsonObject} options 配置信息
	 *  @param {JsonObject} global 组件内全局空间
	 * @protected
	 */
	init : function(options) {
		// 将静态数据读入数据集
		if(options.data) {
			this.load(options.data, options.backup);
		}
	},
	/**
	 *  数据加载
	 * @param {JsonObject} data 数据
	 * @param {Boolean} backup=false 是否备份数据
	 * @param {Boolean} renderview=false 是否用最新数据渲染界面
	 */
	load : function(data, backup, renderer) {

		var options = this._options;
		// 重置数据集，保留初始静态数据
		this.reset();

		if(options.root) {
			data = this.reader.readDataSegment(data, options.root);
		}
		// 填充动态数据
		this.fill(data, backup, true, renderer);

	},
	/**
	 *  批量增加数据至数据集
	 * @param {Array[JsonObject]} data 数据数组
	 * @param {Boolean} [backup=false] 是否备份当前数据
	 * @param {Boolean} [objectify=true] 是否对象化当前数据
	 * @param {Boolean} [renderview=false] 是否用最新数据渲染界面
	 */
	fill : function(data, backup, objectify, renderview) {
		if(!(data && data.splice)) {
			return fastDev.warn("DataSet", "fill", "数据集填充数据错误,传入的数据格式不合法,数据集只支持数组格式数据",fastDev.Util.JsonUtil.parseString(data));
		}

		for(var i = 0, len = data.length; i < len; i += 1) {
			this.insert(data[i], backup, objectify);
		}

		if(this.structure) {
			this.structure.initNodes();
		}

		if(renderview === true) {
			this._options.renderer();
		}
	},
	/**
	 * 新增数据至数据集
	 * @param {JsonObject} data 数据
	 * @param {Boolean} [backup=false] 是否备份当前数据
	 * @param {Boolean} [objectify=true] 是否对象化当前数据
	 */
	insert : function(data, backup, objectify) {
		// 将数据按照数据模型中的描述进行格式化
		if(objectify !== false) {
			this.model.objectify(data);
		}
		//  将数据添加至数据集
		this.records.push(data);
		// 处理数据备份
		if(backup === true) {
			this.backups.push(data);
		}

		if(this.structure) {
			this.add(data);
		}
	},
	/**
	 * 删除数据集中符合条件的记录
	 * @param {Function} fn 自定义匹配函数
	 */
	remove : function() {
		return this.correctParam(arguments, "removeImpl");
	},
	/**
	 * 删除数据集中符合条件的静态记录
	 * @param {Function} fn 自定义匹配函数
	 */
	removeStaticData : function(fn) {
		return this.correctParam(arguments, "removeStaticImpl");
	},
	/**
	 * 更新数据集中的记录
	 * @param {Function} fn 自定义匹配函数,如果返回数据则按数据修改当前项
	 */
	update : function() {
		return this.correctParam(arguments, "updateImpl");
	},
	/**
	 *  查询数据集中符合条件的数据
	 * @param {Function} fn 自定义匹配函数,返回true/false通知结果集是否记录当前数据
	 * @return {Array}
	 */
	select : function() {
		return this.correctParam(arguments, "selectImpl");
	},
	/**
	 * 重置当前数据集为初始状态,此方法保留静态数据
	 */
	reset : function() {
		this.records = this.records.slice(0, this.retain);
		this.backups = this.backups.slice(0, this.retain);
		if(this.structure) {
			this.structure.clean();
			for(var i = 0, item; item = this.records[i]; i < this.retain) {
				this.add(item);
			}
			this.structure.initNodes();
		}
	},
	/**
	 * 清除当前数据集中的所有数据
	 */
	clean : function() {
		// 重置记录集与备份
		this.records = [];
		this.backups = [];
		if(this.structure) {
			this.structure.clean();
		}
	},
	/**
	 * 获取记录集数据长度
	 * @return {Number}
	 */
	getSize : function() {
		return this.records.length;
	},
	/**
	 * 获取记录集中指定下标的数据对象
	 * @return {JsonObject}
	 */
	get : function(index) {
		return this.records[index];
	},
	/**
	 * 对数据中的数据进行排序
	 * @param {String} fieldname 字段名称
	 * @param {String} sortord 排序规则(asc/desc)
	 */
	sort : function(fieldname, sortord) {
		var records = this.records, len = records.length, cond = -1, change = false;
		if(sortord === "desc") {
			cond *= -1;
		}
		for(var i = 0; i < len - 1; i++) {
			for(var j = len - 1; j >= 1; j--) {
				var currRecord = records[j];
				var targetRecord = records[j - 1];
				if(fastDev.comparator(currRecord[fieldname], targetRecord[fieldname]) === cond) {
					records[j] = targetRecord;
					records[j - 1] = currRecord;
					change = true;
				}
			}
		}
		return change;
	},
	/**
	 * 统计函数---数据量统计
	 */
	count : function() {
		return this.getSize();
	},
	/**
	 * 统计函数---求和统计
	 * @param {String} fieldname 字段名称
	 */
	sum : function(fieldname) {
		var sum = 0;
		for(var i = 0; i < this.records.length; i++) {
			var value = this.records[i][fieldname];
			if(/^\d*(\.\d+)?$/.test(value)) {
				sum += (value * 1);
			}
		}
		return sum;
	},
	/**
	 * 统计函数---平局值统计
	 * @param {String} fieldname 字段名称
	 */
	avg : function(fieldname) {
		var value = this.sum(fieldname);
		return value / this.count(fieldname);
	},
	/**
	 * 统计函数---最大值统计
	 * @param {String} fieldname 字段名称
	 */
	max : function(fieldname) {
		this.sort(fieldname, "desc");
		return this.records[0][fieldname];
	},
	/**
	 * 统计函数---最小值统计
	 * @param {String} fieldname 字段名称
	 */
	min : function(fieldname) {
		this.sort(fieldname, "asc");
		return this.records[0][fieldname];
	},
	/**
	 * 是对数据集的数据修改无效化并并从备份中读取数据重新填充数据集
	 * 如果备份中没有数据则只会清空当前数据集
	 */
	rollback : function() {
		// 清除当前数据集数据
		this.records = this.backups.slice();
	},
	/**
	 * 读取数据集中的指定数据段,按分页规则逻辑执行
	 * @param {Number} page 数据页数
	 * @param {Number} num 每页数据行数
	 */
	selectByPage : function(page, num) {
		var start = page * num;
		return this.records.slice(start, start + num);
	},
	/**
	 * 模板查询方法
	 * @param {String} text 文本
	 * @param {String} [fieldname] 数据字段名称
	 * @return {Array[JsonObject]}
	 */
	fuzzySelect : function(text, fieldname, objectify) {
		if(!text) {
			return [];
		}

		if(fieldname) {
			return this.select(function(index, data) {
				return (data[fieldname] + "").indexOf(text) !== -1;
			});
		}

		var datastr, records = this.records.slice(), match = RegExp(text, "g"), result = [];

		for(var i = 0, record; record = records[i]; i++) {
			datastr = fastDev.Util.JsonUtil.parseString(record).replace(/\w+\"?(?=:)/g, "");
			if(match.test(datastr) === true) {
				result.push(records.splice(i--,1)[0]);
				match.lastIndex = 0;
			}
		}
		return result;
	},
	/**
	 * 改变制定数据行索引
	 * @param {Number} index 数据行索引
	 * @param {Number} targetIndex 数据行目标索引
	 */
	changeIndex : function(index, targetIndex) {
		// 当前索引与目标索引一致时做无效化处理
		if(index === targetIndex) {
			return;
		}
		var record, records = this.records;

		// 修成源数据索引值
		if(index === "last") {
			index = records.length - 1;
		} else if(index < this.retain) {
			index = this.retain;
		}
		// 将源数据从数据集中移除
		record = records.splice(index, 1);
		// 修正目标索引值
		targetIndex = targetIndex < this.retain ? this.retain : targetIndex;
		// 将源数据插入到目标索引位置
		records.splice(targetIndex, 0, record);
	},
	/**
	 * 增加数据至数据结构
	 */
	add : function(data) {
		this.structure.addNode(data);
	},
	/**
	 * 设置远程数据根节点
	 * @param {String} root 根节点路径
	 */
	setRoot : function(root) {
		this._options.root = root;
	},
	correctParam : function(args, name) {
		args = [].slice.call(args);
		var fn = args.shift(), records = this.records, len = records.length;

		args = [null, null].concat(args);

		return this[name](fn, args, len, records);
	},
	removeImpl : function(fn, args, len, records) {
		if(!fastDev.isFunction(fn)) {
			this.clean();
		}

		var retain = this.retain;

		for(var i = 0; i < len; i++) {
			args[0] = i;
			args[1] = records[i];
			if(fn.apply(window, args)) {
				records.splice(i--, 1);
				len--;
				if(i <= retain && i > 0) {
					retain--;
				}
			}
		}
		this.retain = retain;
	},
	removeStaticImpl : function(fn, args, len, records) {
		if(!fastDev.isFunction(fn)) {
			records.splice(0, this.retain);
			this.retain = 0;
			return;
		}

		for(var i = 0; i < this.retain; i++) {
			args[0] = i;
			args[1] = records[i];

			if(fn.apply(window, args)) {
				records.splice(i--, 1);
				this.retain--;
			}
		}
	},
	updateImpl : function(fn, args, len, records) {
		// 更新符合条件的数据
		if(!fastDev.isFunction(fn)) {
			return;
		}

		for(var i = 0, data; i < len; i++) {
			args[0] = i;
			args[1] = records[i];
			if( data = fn.apply(window, args)) {
				data = fastDev.apply({}, records[i], data);
				records[i] = this.model.objectify(data);
			}
		}
	},
	selectImpl : function(fn, args, len, records) {
		if(!fastDev.isFunction(fn)) {
			return this.records.slice();
		}
		for(var i = 0, result = []; i < len; i++) {
			args[0] = i;
			args[1] = records[i];
			if(fn.apply(window, args)) {
				result.push(records[i]);
			}
		}
		return result;
	}
});


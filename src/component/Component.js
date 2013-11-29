/**
 * 所有组件的父类，内部做了组件的通用属性定义以及通用方法实现
 * @class fastDev.Ui.Component
 * @extends fastDev.Core.Base
 * @singleton
 */
fastDev.define("fastDev.Ui.Component", {
	extend : "fastDev.Core.Base",
	_options : {
		/**
		 * Id属性值
		 * @type {String}
		 */
		id : "",
		/**
		 * Name属性值
		 * @type {String}
		 */
		name : "",
		/**
		 * 是否显示控件
		 * @type {Boolean}
		 */
		display : true,
		/**
		 * 组件宽度
		 * @type {String}
		 */
		width : "",
		/**
		 * 组件高度
		 * @type {String}
		 */
		height : "",
		/**
		 * 组件X坐标值
		 * @type {String}
		 * @private
		 */
		left : "",
		/**
		 * 组件Y坐标值
		 * @type {String}
		 * @private
		 */
		top : "",
		/**
		 * 控件样式类名,默认最上层的容器classname
		 * @type {String}
		 * @private
		 */
		cls : "",
		/**
		 * 控件样式属性,默认最上层的容器style
		 * @type {JsonObject}
		 * @private
		 */
		style : null,
		/**
		 * 宽高是否自适应容器
		 * @type {Boolean}
		 * @private
		 */
		autoFit : false,
		/**
		 * 初始数据源地址，此属性一般用来设置控件的初始值
		 * @type {String}
		 */
		initSource : "",
		/**
		 * 值来源数据源地址，此属性一般用来设置控件的当前值
		 * @type {String}
		 */
		dataSource : "",
		/**
		 * 控件的值
		 * @type {String|JsonObject}
		 */
		value : "",
		/**
		 * 指定控件所属容器
		 * @type {String}
		 */
		container : "",
		/**
		 * 是否保存控件实例
		 */
		saveInstance : false,
		/**
		 * 是否保存队列实例
		 */
		saveQueue : false,
		/**
		 * 当前控件所使用的队列
		 */
		queue : "",
		/**
		 * 数据映射配置，指定后台Json数据与前台控件需要数据格式的映射
		 * 数据集相关配置之一
		 * @type {JsonObject}
		 */
		mapper : null,
		/**
		 * 设定数据集是否默认备份数据
		 * 数据集相关配置之一
		 * @private
		 * @type {Boolean}
		 */
		backup : false,
		/**
		 * 数据结构类型
		 * 数据集相关配置之一
		 * @type {String}
		 * @private
		 */
		structure : "normal",
		/**
		 * 组件静态数据
		 * @type {Array}
		 */
		items : null,
		/**
		 * 数据自动加载
		 * @type {Boolean}
		 * @private
		 */
		autoLoad : true,
		/**
		 * 是否启用数据集
		 * @private
		 */
		enableDataSet : true,
		/**
		 * 是否启用数据代理(用于辅助加载initSource)
		 * @type {Boolean}
		 * @private
		 */
		enableInitProxy : true,
		/**
		 * 是否启用数据代理(用于辅助加载dataSource)
		 * @type {Boolean}
		 * @private
		 */
		enableDataProxy : true,
		/**
		 * 定义模式
		 * @type {String}
		 * @private
		 */
		defineMode : "js",
		/**
		 * 自动渲染
		 * @type {Boolean}
		 * @private
		 */
		autoRenderer : true,
		/**
		 * InitSource数据返回后回调触发
		 * @event
		 */
		onAfterLoadInit : fastDev.noop,
		/**
		 * DataSource数据返回后回调触发
		 * @event
		 */
		onAfterLoadData : fastDev.noop,
		/**
		 *  InitSource数据被控件处理完成后触发
		 * @event
		 */
		onAfterInitRender : fastDev.noop,
		/**
		 *	DataSource数据被控件处理完成后触发
		 * @event
		 */
		onAfterDataRender : fastDev.noop
	},
	/**
	 * 组件通用准备方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	ready : function(options, global) {
		// 初始化容器
		var container = options.container;
		if(fastDev.isString(container) && container.length > 0) {
			container = fastDev("#" + container);
		} else {
			container = fastDev(container);
		}
		options.container = container;
		this.elems = [];
	},
	/**
	 * 组件通用构造方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	construct : function(options, global) {
		// 是否启用数据集
		var enableInitProxy = options.enableInitProxy,
		// 是否启用数据代理
		enableDataProxy = options.enableDataProxy,
		// 是否启用数据集
		enableDataSet = options.enableDataSet,
		// 静态数据
		items = options.items,
		// 静态值
		value = options.value,
		// 组件初始化数据地址
		initSource = options.initSource,
		// 组件当前值数据地址
		dataSource = options.dataSource,
		// 组件初始化数据数据模型
		fields = this.fields, queue;

		if(enableDataSet === true) {
			this.dataset = fastDev.create("DataSet", {
				fields : fields,
				data : items,
				mapper : options.mapper,
				structure : options.structure,
				backup : options.backup,
				renderer : fastDev.setFnInScope(this, this.onAfterLoadInit)
			});
		}

		if(enableInitProxy === true || enableDataProxy === true) {

			if(options.queue) {
				global.queue = fastDev.isString(options.queue) ? fastDev.getQueue(options.queue) : options.queue;
			}
			// initSource与DataSource共用一个队列，保证initSource先加载
			queue = global.queue = global.queue ? global.queue : fastDev.Queue.getInstance();

			// 检测是否启用数据集
			if(enableInitProxy === true) {
				this.initProxy = fastDev.create("Proxy", {
					url : initSource,
					queue : queue,
					method : "post",
					dataset : this.dataset
				});
			}
			// 检测是否启用数据代理
			if(enableDataProxy === true) {
				this.dataProxy = fastDev.create("Proxy", {
					url : dataSource,
					queue : queue,
					data : value,
					onAfterLoad : fastDev.setFnInScope(this, this.onAfterLoadData)
				});
			}
		}
		// 初始化模板
		var me = this, tplParam = this.tplParam, params = {};
		// 初始化模板所需参数
		if(tplParam) {
			for(var i = 0, name; name = tplParam[i]; i++) {
				value = options[name];
				params[name] = value === undefined ? global[name] : value;
			}
		}

		global.params = params;

		// 使用模板函数
		if(this.staticTemplate) {
			this._renderStaticHtml(params);
			return;
			// 使用模板字符串
		} 
		
		if(fastDev.isArray(this.template)) {
			this.template = this.constructor.prototype.template = fastDev.create("Template", {
				content : this.template,
				name : this.alias
			});
		}
		
		if(this.template && this.template.alias === "Template"){
			// 渲染组件静态展现部分至页面
			this.renderStaticHtml();
		}
	},
	/**
	 * 组件通用初始化方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	init : function(options, global) {
		// 加载系统任务至对应的代理中，并删除临时配置
		var initProxy = this.initProxy, dataProxy = this.dataProxy;

		// 保存控件示例
		if(options.saveInstance === true) {
			fastDev.saveInstance(options.id, this);
		}

		// 保存控件所在队列
		if(options.saveQueue === true) {
			fastDev.saveQueue(options.id, global.queue);
		}

		if(!initProxy || !initProxy.load()) {
			this.onAfterLoadInit();
		}

		if(!dataProxy || !dataProxy.load()) {
			if(global.queue) {
				global.queue.add({
					type : "normal",
					handle : fastDev.setFnInScope(this, this.onAfterLoadData)
				});
			} else {
				this.onAfterLoadData(options.value);
			}
		}
	},
	/**
	 * 将Dom元素合并至当前Dom元素集
	 * @param {Element} elem Dom元素
	 * @private
	 */
	merge : function(elem) {
		if(!elem) {
			return this;
		}
		if(elem.nodeType) {
			this.elems.push(elem);
		} else if(fastDev.isArray(elem)) {
			this.elems = this.elems.concat(elem);
		} else if(elem.elems) {
			this.merge(elem.elems);
		}
		return this;
	},
	/**
	 * 渲染到指定目标
	 * @param {fastDev.Core.DomObject} container 指定容器目标
	 * @return {fastDev.Core.DomObject}
	 */
	renderTo : function(container) {
		return container.append(this.elems);
	},
	/**
	 * 传入指定数据更新数据集
	 * @param {JsonObject} config 更新参数
	 * @param {Array} config.data 更新使用到的数据
	 * @param {Boolean} [config.backup=false] 是否备份当前传入数据
	 * @param {Boolean} [config.renderer=false] 是否使用更新后的数据渲染界面
	 * @param {Boolean} [config.overwrite=true] 是否覆盖已有数据
	 */
	refreshDataSet : function(config) {
		if(config.overwrite !== false) {
			this.dataset.reset();
		}

		this.dataset.fill(config.data, config.backup, true, config.renderer);
	},
	/**
	 * initSource数据源刷新，如果传入url参数值，则用url参数值替代配置的initSource值进行刷新
	 * @param {JsonObject/String} [config] 刷新参数({@link fastDev.Data.Proxy})/刷新地址 
	 */
	initRefresh : function(config) {
		this.initProxy.setOptions(config);
		this.initProxy.load();
	},
	/**
	 * dataSource数据源刷新，如果传入href参数值，则用href参数值替代配置的dataSource值进行刷新
	 * @param {JsonObject/String} [config] 刷新参数/刷新地址
	 */
	dataRefresh : function(config) {
		if(fastDev.isValid(config) && fastDev.isPlainObject(config)) {
			this.dataProxy.setOptions(config);
		}
		this.dataProxy.load();
	},
	/**
	 * 设置控件ID属性值
	 * @param {String} id ID属性值
	 */
	setID : function(id) {
		fastDev(this.elems[0]).prop("id", id);
		return this;
	},
	/**
	 * 获取控件ID属性值
	 * @return {String}
	 */
	getID : function() {
		return fastDev(this.elems[0]).prop("id");
	},
	/**
	 * 显示控件
	 */
	show : function() {
		fastDev(this.elems).show();
		return this;
	},
	/**
	 * 隐藏控件
	 */
	hide : function() {
		fastDev(this.elems).hide();
		return this;
	},
	/**
	 * 判断控件是否显示状态
	 * @return {Boolean}
	 * @private
	 */
	isShow : function() {
		return fastDev(this.elems).isShow();
	},
	/**
	 * 在当前对象Dom集中查找满足指定条件的元素
	 * @param {String} selector 条件
	 * @return {fastDev.Core.DomObject}
	 */
	find : function(selector) {
		var result = fastDev.Query.find(selector, this.elems);
		result = result.concat(fastDev.Query.filter(selector, this.elems));
		return fastDev(result);
	},
	/**
	 * 销毁当前对象Dom集
	 */
	destroy : function() {
		fastDev(this.elems).remove();
	},
	/**
	 * 渲染组件静态显示部分至容器中
	 */
	renderStaticHtml : function() {
		var template = this.template, 
			options = this._options, 
			container = options.container, 
			domobj = template.buildStaticTemplate(this._global.params);
			
		// 将静态Dom合并至当前组件中
		this.merge(domobj);
		try {
			// 渲染当前静态Dom至页面容器中
			if(container && container.append && options.autoRenderer) {
				container.append(this);
			}
		} catch(e) {
			fastDev.addError(this.alias, "renderStaticHtml", "构建静态模板异常：" + e.message);
		}
	},
	_renderStaticHtml : function(params) {

		var options = this._options, container = options.container, html = this.staticTemplate(params), elem;
		if(html === "") {
			return;
		}
		elem = fastDev(html);
		this.merge(elem);
		if(container && container.append && options.autoRenderer) {
			container.append(this);
		}
	},
	/**
	 * 初始化动态模板
	 * @param {String} [name] 模板名称
	 * @param {Array[fastDev.Data.Record]} [dataList] 数据记录集
	 */
	initDynamicHtml : function(name, dataList) {
		try {
			dataList = dataList || this.dataset.select();
			return this.template.initDynamic(dataList, name).fragment;
		} catch(e) {
			fastDev.addError(this.alias, "initDynamicHtml", e.message);
		}
	},
	/**
	 * 渲染动态模板(覆盖上次渲染)
	 * @param {DomObject} container 容器
	 * @param {String} [name] 模板名称，默认返回第一个动态模板
	 * @param {Window} [context] 全局作用域，默认为当前window对象
	 * @param {Array} [data] 渲染模板所使用的数据，默认获取数据集中所有数据
	 * @param {Boolean} [overwirte=true] 是否重写容器内容，设置为false则不会清空容器内容
	 * @private
	 */
	renderDynamicHtml : function() {
		var container, name, context, data, overwrite, domobj,
		// 生成模板所需参数
		params = this._global.params,
		// 为方便做参数修正，将参数列表转为数组
		args = [].slice.apply(arguments);
		// 容器无效时，当次动态模板渲染终止
		container = args[0];
		if(!container || !container.append || !container.empty) {
			fastDev.addError(this.alias, "renderDynamicHtml", "未指定动态模板容器，无法渲染动态模板");
		}

		// 修正模板名称
		if(!fastDev.isString(args[1])) {
			args.splice(1, 0, "");
		}

		if(!fastDev.isWindow(args[2])) {
			args.splice(2, 0, window);
		}

		if(!fastDev.isArray(args[3])) {
			args.splice(3, 0, this.dataset.select());
		}

		if(!fastDev.isBoolean(args[4])) {
			args.splice(4, 0, true);
		}

		name = args[1];
		context = args[2];
		data = args[3];
		overwrite = args[4];
		
		domobj = this.template.buildDynamicTemplate(name, params, data, context);
		//domobj = this.template.initDynamic(data, name).fragment;

		if(overwrite === true) {
			container.empty();
		}
		container.append(domobj);

		return domobj;
	},
	/**
	 * 生成动态模板内容并渲染至指定容器中
	 * @param {DomObject} container 容器
	 * @param {String} [name] 模板名称
	 * @param {Array} [data] 指定渲染模板用的数据
	 * @param {Boolean} [merge] 是否将生成的内容托管给所属控件
	 * @param {Window} [context] 当前动态模板所属窗口(跨级时使用，其他时候不需要设置此参数)
	 * @param {Boolean} [empty] 是否清空容器内已有的内容
	 */
	_renderDynamicHtml : function() {
		var name, data, merge, context, empty, args = [].slice.call(arguments), container = args[0];
		name = fastDev.isString(args[1]) ? args[1] : args.splice(1, 0, null) && "dynamicTemplate";
		data = fastDev.isArray(args[2]) ? args[2] : args.splice(2, 0, null) && this.dataset.select();
		merge = fastDev.isBoolean(args[3]) ? args[3] : args.splice(3, 0, null) && false;
		context = fastDev.isWindow(args[4]) ? args[4] : args.splice(4, 0, null) && window;
		empty = fastDev.isBoolean(args[5]) ? args[5] : true;

		var elem = context.fastDev(this[name](this._global.params, data));
		if(merge) {
			this.merge(elem);
		}
		if(container && container.append) {
			if(empty === true) {
				container.empty();
			}
			container.append(elem);
		}
	},
	/**
	 * 渲染动态模板(追加至上次渲染之后)
	 * @param {DomObject} container 容器
	 * @param {String} [name] 模板名称，默认返回第一个动态模板
	 * @param {Window} [context] 全局作用域，默认为当前window对象
	 * @param {Array} [data] 渲染模板所使用的数据，默认获取数据集中所有数据
	 * @private
	 */
	appendDynamicHtml : function(container, name, context, data) {
		var args = [].slice.call(arguments);
		// 修正模板名称
		if(!fastDev.isString(args[1])) {
			args.splice(1, 0, "");
		}

		if(!fastDev.isWindow(args[2])) {
			args.splice(2, 0, window);
		}

		if(!fastDev.isArray(args[3])) {
			args.splice(3, 0, this.dataset.select());
		}
		
		args[4] = false;
		
		this.renderDynamicHtml.apply(this, args);
	},
	/**
	 * 保存HTML字符串数组为模板原型
	 * @param {Array} template 字符串数组
	 */
	setTemplate : function(template) {
		this.constructor.prototype.template = template;
	},
	/**
	 * 将value值保存至配置中
	 * @param {Object} value
	 * @protected
	 */
	loadAndSetValue : function(data) {
		data = this.proxy.readerDate(data);
		this.setValue(data);
	},
	/**
	 * initProxy加载完成回调句柄
	 * @private
	 */
	onAfterLoadInit : function() {
		// initSource数据加载完成回调
		fastDev.fire(this._options.onAfterLoadInit, this);
		// 构建控件数据部分界面
		this.constructItems();
		// 设置当前控件显示状态
		if(this._options.display === false) {
			this.hide();
		}
		// 控件数据部分界面构建完成回调
		fastDev.fire(this._options.onAfterInitRender, this);
	},
	/**
	 * dataProxy加载完成回调句柄
	 * @private
	 */
	onAfterLoadData : function(data) {
		data = data || this._options.value;
		// 控件当前值加载完成回调
		fastDev.fire(this._options.onAfterLoadData, this);
		// 设置控件当前值
		if(fastDev.isValid(data)) {
			this.setValue(data);
		}
		// 控件值设置完成回调
		fastDev.fire(this._options.onAfterDataRender, this);
	},
	/**
	 * 子类构造动态模板的接口
	 * @protected
	 */
	constructItems : fastDev.noop,
	/**
	 * 子类设置当前组件值的接口
	 * @protected
	 */
	setValue : fastDev.noop,
	/**
	 * 重设initSource的请求参数
	 * @param {JsonObject} param
	 */
	setInitReqParam : function(param) {
		if(this.initProxy) {
			this.initProxy.setParam(param);
		}
	},
	/**
	 * 增加initSource的请求参数
	 * @param {JsonObject} param
	 */
	addInitReqParam : function(param) {
		if(this.initProxy) {
			this.initProxy.addParam(param);
		}
	},
	/**
	 * 重设dataSource的请求参数
	 * @param {JsonObject} param
	 */
	setDataReqParam : function(param) {
		if(this.dataProxy) {
			this.dataProxy.setParam(param);
		}
	},
	/**
	 * 增加dataSource的请求参数
	 * @param {JsonObject} param
	 */
	addDataReqParam : function(param) {
		if(this.dataProxy) {
			this.dataProxy.addParam(param);
		}
	}
});

fastDev.apply({
	/**
	 * 是否组件对象
	 * @param {Object} value
	 * @return {Boolean}
	 * @member fastDev
	 */
	isComponent : function(value) {
		return fastDev.Ui.Component.isPrototypeOf(value);
	}
});

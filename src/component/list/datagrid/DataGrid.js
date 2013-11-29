/**
 * @class fastDev.Ui.DataGrid
 * @extends fastDev.Ui.Component
 * 表格控件，提供后台数据通过表格的方式进行展现，方便用户浏览数据，支持拖动列宽、排序、分页等常用操作<p>
 * 作者：袁刚
 *
 *		<div itype="DataGrid" initSource="../../data/griddata.json" pagePosition="none" showSeqColumn=true>
 *			<div width="10%" name="empno" text="员工工号"></div>
 *			<div width="12%" name="department" text="所属部门"></div>
 *			<div width="8%" name="isuse" text="是否可用"></div>
 *			<div width="15%" name="position" text="职位"></div>
 *			<div width="10%" name="pay" text="薪资"></div>
 *			<div width="10%" name="datesemployed" text="入职时间"></div>
 *			<div width="15%" name="birthday" text="生日" defaultValue="1985-01-01"></div>
 *		</div>
 */

fastDev.define("fastDev.Ui.DataGrid", {
	extend : "fastDev.Ui.Component",
	alias : "DataGrid",
	_options : {
		/**
		 * 表格列配置信息
		 * @type {JsonObject}
		 */
		columns : null,
		/**
		 * 是否允许调整列宽
		 * @type {Boolean}
		 */
		allowResizeColumn : false,
		/**
		 * 是否显示CheckBox列
		 * @type {Boolean}
		 */
		showCheckColumn : false,
		/**
		 * 是否显示RadioBox列
		 * @type {Boolean}
		 */
		showRadioColumn : false,
		/**
		 * 是否显示序号列
		 * @type {Boolean}
		 */
		showSeqColumn : false,
		/**
		 * 工具栏配置信息，参见ToolBar组件Api
		 */
		toolBar : null,
		/**
		 * 分页栏位置设置 top(顶部放置分页栏)、bottom(底部放置分页栏)、all(顶部和底部都放置分页栏)、none(不带分页栏)
		 * @type {String}
		 */
		pagePosition : "bottom",
		/**
		 * 分页栏中的下拉选项设置
		 * @type {Array[JsonObject]}
		 */
		pageSizeList : null,
		/**
		 * 每页显示条数设置
		 * @type {Number}
		 */
		pageSize : 10,
		/**
		 * 当前页码设置
		 * @type {Number}
		 */
		pageCurrent : 1,
		/**
		 * 分页工具栏的附加子项，常用于在分页对象上添加自定义功能按钮
		 * @type {Array{JsonObject}}
		 */
		pageItems : null,
		/**
		 * 当数据行数不够默认的行数时，是否自动填充行
		 * @type {Boolean}
		 */
		allowAutoFillRow : true,
		/**
		 * 是否允许鼠标拖动列重新排列
		 * @type {Boolean}
		 */
		allowMoveColumn : false,
		/**
		 * 是否允许值相同单元格合并
		 * @type {Boolean}
		 */
		allowCellMerge : false,
		/**
		 * 为client时,开启客户端排序(单页排序);为server时,开启服务端排序;默认为"none",不进行排序.
		 * @type {String}
		 */
		sort : "none",
		/**
		 * 排序规则 asc为升序;desc为降序
		 * @type {String}
		 */
		sortby : "asc",
		/**
		 * 排序依赖字段
		 * @type {String}
		 */
		sortField : "",
		/**
		 * 行内信息配置
		 * @type {String}
		 */
		rowDetail : "",
		/**
		 * 记录修改信息，用户取消用户对当前DataGrid数据的修改，值为false时，rollbackModify方法无效
		 *  @type {Boolean}
		 */
		allowRollback : false,
		/**
		 * 统计显示模板定义
		 * @type {String}
		 */
		summaryTpl : null,
		/**
		 * 数据修改后的保存地址
		 */
		action : "",
		/**
		 * 主键列名
		 * @type {String}
		 */
		keyword : "",
		/**
		 * 是否延时加载数据(大数据量不分页，或每页展示行数过大时使用)
		 * @type {Boolean}
		 */
		allowDelayLoad : false,
		/**
		 * @private
		 */
		backup : true,
		/**
		 * @private
		 */
		enableDataProxy : false,
		/**
		 * 行内编辑限定函数，返回true则当前单元格不能编辑
		 * @param {Number} rowIndex 行索引
		 * @param {Number} cellIndex 列索引
		 * @param {String} value 单元格的真实值
		 */
		editCellLimit : fastDev.noop,
		/**
		 * @event
		 * 保存数据后回调事件
		 */
		onAfterSave : fastDev.noop,
		/**
		 * 单击行事件
		 * @event
		 * @param {Event} event 事件对象
		 * @param {Number} rowindex 行索引
		 * @param [JsonObject] data 包含当前行所有列数据的对象
		 */
		onRowClick : fastDev.noop,
		/**
		 * 双击行事件
		 * @event
		 * @param {Event} event 事件对象
		 * @param {Number} rowindex 行索引
		 * @param [JsonObject] data 包含当前行所有列数据的对象
		 */
		onRowDblClick : fastDev.noop,
		/**
		 * 单击列事件
		 * @event
		 * @param {Event} event 事件对象
		 * @param {Number} cellindex 列索引
		 * @param {String} content 当前列内容
		 */
		onCellClick : fastDev.noop,
		/**
		 * 双击列事件
		 * @event
		 * @param {Event} event 事件对象
		 * @param {Number} cellindex 列索引
		 * @param {String} content 当前列内容
		 */
		onCellDblClick : fastDev.noop
	},
	_global : {
		rowspan : 1,
		summaryInfo : null,
		innerPage : 1,
		bodyScroll : false
	},
	tplParam : ["bodyWidth", "colWidthTpl", "colTitleTpl", "colSplitTpl", "colContentTpl", "moveCell", "width", "buildRowDetail", "colspan"],
	/**
	 * 组件参数准备方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	ready : function(options, global) {
		// 初始化数据字段配置
		this.fields = [];
		// 内置用于保存修改信息字段，新增以及修改DataGrid数据时用
		this.fields.push({
			name : "gird_modify",
			type : "String"
		});

		if(options.showCheckColumn === true || options.showRadioColumn === true) {
			this.fields.push({
				name : "gird_checked",
				type : "Boolean",
				defaultValue : false
			});
			// 选择框互斥处理
			if(options.showCheckColumn === options.showRadioColumn) {
				options.showRadioColumn = false;
			}
		}
		global.displayJobs = [];
		global.logs = [];
		// 判断是否需要生成行内信息结构
		global.buildRowDetail = !!options.rowDetail;
		// 系统生成列占用宽度值
		global.systemWidth = this.parseQuickConfig(options, global);
		// 容器宽度
		global.containerWidth = options.container.width();
		global.containerHeight = options.container.height();
		// 获取DataGrid宽度配置，没有则取容器宽度
		// 初始化静态模板
		this.initTemplate(options.columns, this.calculateWidth(options.width || global.containerWidth, true));
		this.setTemplate(global);
	},
	/**
	 * 组件构造方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	construct : function(options, global) {
		global.dataContainer = this.find(".ui-datagrid-body");
		global.headerContainer = this.find(".ui-datagrid-header");
		global.topToolbar = this.find("div [name='ui-top-toolbar']");
		global.bottomToolbar = this.find("div [name='ui-bottom-toolbar']");
		var reqParams = {}, pageSize = options.pageSize, pagePosition = options.pagePosition;
		// 设定数据根节点
		this.dataset.setRoot("data");
		// 如果开启允许回滚修改操作功能则设置数据集对应参数开启此功能
		//this.dataset.setBackup(options.allowRollback);
		// 设置DataGrid的数据提交地址
		this.initProxy.setAction(options.action);

		// 初始化头部工具栏
		if(fastDev.isValid(options.toolBar)) {
			options.toolBar.container = global.topToolbar;
			fastDev.create("Toolbar", options.toolBar);
		}

		// 初始化分页栏设置
		if(pagePosition !== "none") {
			var position, config = this.buildPageBarConfig(options);
			if(pagePosition !== "all") {
				position = pagePosition;
			} else {
				position = "bottom";
				config.container = global.topToolbar;
				global.clonePageBar = fastDev.create("Toolbar", config);
			}

			config.container = position === "bottom" ? global.bottomToolbar : global.topToolbar;
			global.pageBar = fastDev.create("Toolbar", config);
			// 给代理添加一个任务解析分页信息

			this.initProxy.bindAfterLoad(fastDev.setFnInScope(this, this.initPageBar));

			this.dataset.setOptions({
				pageSize : pageSize,
				replenish : options.allowAutoFillRow
			});
		} else {
			pageSize = options.pageSize = 999999;
		}
		reqParams.page = 1;
		reqParams.pageSize = pageSize;

		if(!fastDev.isEmptyObject(this._global.summaryInfo)) {
			this.buildSummaryCol(options, global);
		}

		this.initProxy.setParam(reqParams);

	},
	/**
	 * 组件初始化方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	init : function(options, global) {
		this.listeningScroll();

		if(options.sort !== "none") {
			this.initSortColumn(options);
		}

		this.initEditInline();
		this.initEvent(options, global);

	},
	/**
	 * 初始化组件静态Dom事件
	 * @private
	 */
	initEvent : function(options, global) {

		if(!fastDev.isNoop(options.onCellClick) || !fastDev.isNoop(options.onRowClick) || global.buildRowDetail) {
			var dataGridBodyClick = fastDev.setFnInScope(this, this.dataGridBodyClick);
			global.dataContainer.bind("click", dataGridBodyClick);

		}

		if(!fastDev.isNoop(options.onCellDblClick) || !fastDev.isNoop(options.onRowDblClick)) {
			var dataGridBodyDblClick = fastDev.setFnInScope(this, this.dataGridBodyDblClick);
			global.dataContainer.bind("dblclick", dataGridBodyDblClick);
		}

		// 鼠标滑过行高亮事件
		var trMouseover = fastDev.setFnInScope(this, this.trMouseoverHandle),
		// 行内编辑输入结束事件
		entryComplete = fastDev.setFnInScope(this, this.entryCompleteHandle);
		global.dataContainer.bind("mouseover", trMouseover).bind("keyup", entryComplete);
	},
	/**
	 * 回车结束行内编辑
	 * @private
	 */
	entryCompleteHandle : function(event) {
		if(event.keyCode === 13) {
			this.writeBackCell(true);
		}
	},
	/**
	 * 鼠标滑过行高亮
	 * @private
	 */
	trMouseoverHandle : function(event) {
		var trDom = fastDev(event.target).parents("tr:eq(0)");
		if(trDom.hasClass("ui-datagrid-row")) {
			this.find(".ui-datagrid-row-selected").removeClass("ui-datagrid-row-selected");
			trDom.addClass("ui-datagrid-row-selected");
		}
	},
	/**
	 * 构造组件数据
	 * @private
	 */
	constructItems : function() {
		var options = this._options, global = this._global, data, reset = false;
		// 开启了数据动态渲染功能时，会自动计算当前的显示数据块
		if(options.allowDelayLoad) {
			data = this.dataset.selectByPage(global.innerPage,50);
		}

		// 当数据小于每页显示行数设置时，开启自动填充空白数据会临时补充空白行至数据集中，界面渲染完成时删除临时数据
		if(options.allowAutoFillRow) {
			reset = this.addBlankRow(this._options.pageSize);
		}

		this.renderDynamicHtml(global.headerContainer.find("[name='header']"),"header");
		
		
		global.bodyScroll = false;
		this.renderDynamicHtml(global.dataContainer,"body", data);
		
		if(reset) {
			this.removeBlankData();
		}
		
		global.lockRefresh = false;
		
		if(this.dataset.getSize() === 0){
			return;
		}
		
		// 调用渲染器渲染整体表格
		this.processingGrid();
		// 计算内容部分高度并使表头适应当前高度(滚动条问题)
		if(options.height && !global.bodyHeight) {
			this.caculateHeight(options.height);
		}

		// 调整列宽功能
		if(this._options.allowResizeColumn === true) {
			this.initResizeColumn(global);
		}

		// 表格融合功能
		if(this._options.allowCellMerge === true) {
			this.mergeCell();
		}

		// 复选框全选功能
		if(this._options.showCheckColumn === true) {
			this.initSelectAll();
		}
	},
	/**
	 * 增加空白行
	 * @private
	 */
	addBlankRow : function(pagesize) {
		
		var length = this.dataset.getSize();
		
		if(length === pagesize || pagesize === 999999) {
			return false;
		}
		
		var i = 0 , field, data = {
			inner_invalid : true
		};
		
		for( ; field = this.fields[i] ; i++){
			data[ field.name ] = "";
		}

		for( i = length ; i < pagesize; i++) {
			this.dataset.insert(data, false, false);
		}
		return true;
	},
	/**
	 * 删除补充空白行产生的临时数据
	 * @private 
	 */
	removeBlankData : function(){
		this.dataset.rollback();	
	},
	/**
	 * 初始化组件模板
	 * @param {Array[Jsonobject]} columns 列配置信息数组
	 * @param {Number} effectiveWidth 各列可用总宽度
	 * @private
	 */
	initTemplate : function(columns, effectiveWidth) {
		var options = this._options, global = this._global,
		// 调整列宽配置
		allowResizeColumn = options.allowResizeColumn,
		// 第一列的样式有所不同
		firstTdCls = " ui-datagrid-cell-special ui-datagrid-cell-first",
		// 宽度限制列模板
		colWidthTplList = [],
		// 内容列模板
		colContentTplList = [],
		// 列宽调整的感应区域模板
		colSplitTplList = [],
		// 最后一个显示列索引
		index = 0,
		// 列数，IE6下隐藏列不占列索引
		colNum = 0;
		// 剩余宽度
		global.surplus = effectiveWidth;
		// 如果配置了多表头，则从配置列中寻找真实的列配置
		if(this.buildTitleTpl(columns.slice(0)) === true) {
			this.correctColumns(columns);
		}
		// 寻找最后一个显示列索引值，在所有列宽加起来小于总宽的情况下，做宽度补足
		index = this.getRepairColIndex(columns);
		// 生成数据行展现模板
		for(var i = 0, len = columns.length; i < len; i++) {
			var column = columns[i], cls = "",
			// 如果配置为隐藏列则设置对应样式
			hidden = column.hidden === true ? "display:none" : "";
			// 处理IE6、7下隐藏列不占索引位置问题
			
			colNum++;
			
			if(hidden && !(fastDev.Browser.isIE8 || fastDev.Browser.isIE9 || fastDev.Browser.isIE10)){
				colNum--;
			}
			// 计算宽度限制列的宽度
			// 计算最后一个显示列宽度时会将剩余宽度传入与当前宽度进行比较
			colWidthTplList.push(this.buildColWidthTpl(column, effectiveWidth, i === index ? global.surplus : 0));
			// 设置第一个显示列的样式
			if(firstTdCls && !hidden) {
				cls = firstTdCls;
				firstTdCls = "";
			}
			colContentTplList.push(this.parseColumn(column, cls, hidden));
			// 如果开启了列宽调整功能，则生成该功能感应区域
			// 感应区域个数为显示列个数-1
			if(allowResizeColumn === true && i !== 0 && column.hidden !== true) {
				colSplitTplList.push('<div class="ui-datagrid-splitter" id="' + i + '"style="height:23px;"></div>');
			}
		}
		// 配置了行内信息时，记录行内信息所需要合并的列数
		if(global.buildRowDetail) {
			global.colspan = colNum || len;
		}

		// 保存各部分模板
		fastDev.apply(global, {
			colWidthTpl : colWidthTplList.join(""),
			colSplitTpl : colSplitTplList.join(""),
			colContentTpl : colContentTplList.join("")
		});
	},
	/**
	 *  Grid显示处理
	 * @private
	 */
	processingGrid : function() {
		var handle, i = 0, displayJobs = this._global.displayJobs;
		for(; handle = displayJobs[i]; i++) {
			handle.call(this);
		}
		fastDev.Core.ControlBus.compile(null, this.elems);
	},
	/**
	 * 刷新数据
	 * @param {JsonObject} config 刷新参数
	 * @private
	 */
	initRefresh : function(config) {
		var options = this._options, global = this._global;
		if(global.lockRefresh !== true) {
			global.lockRefresh = true;
		} else {
			return;
		}

		if(options.sort === "server") {
			config = config || {};
			fastDev.apply(config, {
				sortField : options.sortField,
				sortBy : options.sortby
			});
		}
		
		if(config && config.urlParam){
			config.urlParam.page = this.getPageBarInfo("page");
			config.urlParam.pageSize = this.getPageBarInfo("pageSize");
		}

		fastDev.Ui.DataGrid.superClass.initRefresh.call(this, config);

		if(options.sort === "server" && global.sortHandle) {
			global.queue.add(global.sortHandle);
		}
	},
	/**
	 * 列/行单击事件句柄
	 * @param {Event} event
	 * @private
	 */
	dataGridBodyClick : function(event) {
		var dom = fastDev(event.target), options = this._options, type = event.type;
		if(type === "click") {
			this.fireBodyEvent(dom, options, event, type, "Click");
		} else {
			this.fireBodyEvent(dom, options, event, type, "DblClick");
		}
	},
	/**
	 *  列/行双击事件句柄
	 * @param {Event} event
	 * @private
	 */
	dataGridBodyDblClick : function(event) {
		this.dataGridBodyClick(event);
	},
	/**
	 * 执行单击/双击事件
	 * @private
	 */
	fireBodyEvent : function(dom, options, event, type, method) {
		if(!fastDev.isNoop(options["onCell" + method])) {
			this.execCellEvent(dom, options, event, type);
		}

		if(!fastDev.isNoop(options["onRow" + method])) {
			this.execRowEvent(dom, options, event, type);
		}

		if(this._global.buildRowDetail && method === "Click") {
			this.execRowDetailEvent(dom, options);
		}
	},
	/**
	 * 执行列的单击/双击事件
	 * @private
	 */
	execCellEvent : function(dom, options, event, type) {
		var td = dom.parents("td:eq(0)");
		if(!td.isEmpty()) {
			// 获取当前列数据
			var value = dom.attr("newValue") || dom.attr("value"),
			// 获取当前列的索引值
			cellIndex = td.prop("cellIndex");
			// 触发用户绑定事件
			options["onCell" + (type === "click" ? "Click" : "DblClick")].call(this, event, cellIndex, value);
		}
	},
	/**
	 * 执行行的单击/双击事件
	 * @private
	 */
	execRowEvent : function(dom, options, event, type) {
		var tr = dom.parents("tr:eq(0)");
		if(!tr.isEmpty()) {
			// 获取当前行数据
			var data = this.getValueImpl(tr),
			// 获取当前行索引值
			rowIndex = tr.prop("rowIndex");
			// 触发用户绑定事件
			options["onRow" + (type === "click" ? "Click" : "DblClick")].call(this, event, rowIndex, data);
		}
	},
	execRowDetailEvent : function(dom, options) {
		var tr = dom.parents("tr:eq(0)");
		if(!tr.isEmpty()) {
			// 获取当前时间目标样式
			var className = dom.getClass(),
			// 获取当前行数据
			data = this.getValueImpl(tr);
			// 行内信息的展开与收缩处理
			if(/ui-datagrid-node/.test(className)) {
				this.processRowDetail(className, dom, tr, options, data);
			}
		}
	},
	/**
	 * 获取行对象
	 * @private
	 */
	getTr : function(elem) {
		if(fastDev.isElement(elem)) {
			if(elem.tagName === "TR") {
				elem = fastDev(elem);
			} else {
				elem = fastDev(elem).parents("tr:eq(0)");
			}
		} else if(fastDev.isDomObject(elem) || fastDev.isComponent(elem)) {
			return this.getTr(elem.elems[0]);
		} else {
			elem = this.find("[name='dg_choose']:checked").parents("tr");
		}
		return elem;
	},
	/**
	 * 不传参是获取选中数据，传入事件源的话，如果事件源Element是在表格行内则可获得那一行的数据
	 * @param {Element} [elem] 事件发生所在元素
	 */
	getValue : function(elem) {
		var values = [], elems = this.getTr(elem).elems;
		for(var i = 0; elem = elems[i]; i++) {
			values.push(this.getValueImpl(fastDev(elem)));
		}
		return values;
	},
	/**
	 * 根据指定行索引获取行数据
	 * @param {Number} index 索引值，从1开始
	 */
	getValueByIndex : function(index) {
		return this.getValueImpl(this._global.dataContainer.find("tr:eq(" + index + ")"));
	},
	/**
	 * 根据指定文本查找行数据
	 * @param {String} text 文本
	 * @param {String} [fieldname] 数据列名
	 * @return {Array[JsonObject]}
	 */
	getValueByText : function(text, fieldname) {
		return this.dataset.fuzzySelect(text, fieldname);
	},
	/**
	 * 获得指定行对象的数据
	 * @private
	 */
	getValueImpl : function(dom) {
		var columns = this._options.columns, i = this._global.dataColStart, data = {}, tds = dom.find("td").elems;
		for(var column; column = columns[i]; i++) {
			if(!column.name) {
				continue;
			}
			var value, div = fastDev(tds[i]).find("div");
			if(column.itype === "control") {
				var id = div.prop("id");
				value = fastDev.getInstance(id).getValue();
			} else {
				value = div.attr("newValue");
				value = !fastDev.isValid(value) ? div.attr("value") : value;
			}
			data[column.name] = value;
		}
		return data;
	},
	/**
	 * 获取当前页所有数据
	 */
	getAllValue : function() {
		var trList = this._global.dataContainer.find("tr:gt(0)").elems, values = [], len = this.dataset.getSize();
		for(var i = 0; i < len; i++) {
			values.push(this.getValueImpl(fastDev(trList[i])));
		}
		return values;
	},
	/**
	 * 新增一行数据(必须配置keyword属性才可使用)
	 * @param {JsonObject} data 行数据
	 * @param {Boolean} [modify=true] 是否添加修改样式
	 * @param {Number} index 数据行目标位置索引
	 */
	addRow : function(data, modify, index, renderer) {
		if(!this.writeBackCell()){
			fastDev.alert("当前行内编辑还未结束", "信息", "tip");
			return;
		}
		data = data || {};
		data[this._options.keyword] = data[this._options.keyword] || "grid_keyword_" + fastDev.getID();
		data.gird_modify = modify !== false ? "all" : "";

		this.dataset.insert(data);
		this.dataset.changeIndex("last", fastDev.isNumber(index) ? index : "last");
		if(renderer !== false) {
			this.renderDynamicHtml(this._global.dataContainer,"body");
			this.processingGrid();
		}
	},
	/**
	 * 新增多行行数据(必须配置keyword属性才可使用)
	 * @param {Array[JsonObject]} data 行数据
	 * @param {Boolean} [modify=true] 是否添加修改样式
	 * @param {Number} index 数据行目标位置索引
	 */
	addRows : function(data, modify, index) {
		if(!fastDev.isArray(data)) {
			data = [data];
		}
		var len = data.length, renderer = false;

		for(var i = 0; i < len; i++) {
			if(i === len - 1) {
				renderer = true;
			}
			this.addRow(data[i], modify, index, renderer);
		}
		return this;
	},
	/**
	 * 增加一行数据至表格首行(必须配置keyword属性才可使用)
	 * @param {JsonObject} data 行数据
	 * @param {Boolean} [modify=true] 是否添加修改样式
	 */
	addFirstRow : function(data, modify) {
		this.addRow(data, modify, 0);
	},
	/**
	 * 增加一行数据至表格末行(必须配置keyword属性才可使用)
	 * @param {JsonObject} data 行数据
	 * @param {Boolean} [modify=true] 是否添加修改样式
	 */
	addLastRow : function(data, modify) {
		this.addRow(data, modify);
	},
	/**
	 * 修改一行数据((必须配置keyword属性才可使用))
	 * @param {JsonObject} data 行数据
	 * @param {Boolean} renderer 是否立即显示修改内容
	 */
	updateRow : function(newdata, renderer) {
		// 为防止当前正处于行内编辑状态导致数据丢失，先调用数据回写
		if(!this.writeBackCell()){
			fastDev.alert("当前行内编辑还未结束", "信息", "tip");
			return;
		}
		// 得到当前主键列名
		var keywordName = this._options.keyword, 
		// 得到当前数据主键值
		keyword = newdata[keywordName];
		// 删除数据主键，因为数据集中的主键列只读
		delete newdata[keywordName];
		
		// 如果数据主键无效则当次数据更新无效
		if(!fastDev.isValid(keyword)) {
			return;
		}
		
		// 根据当前数据主键查询数据集中地记录
		var olddata = this.dataset.select(function(index, data){
			return data[keywordName] === keyword;
		})[0],
		gird_modify = olddata.gird_modify;
		
		// 如果数据集中不存在当前主键值得数据则当前数据更新无效
		if(!olddata){
			return;
		}
		
		// 比对数据修改前与修改后的状态值，生成新的状态值
		for(var key in newdata){
			if(!RegExp("all|" + key).test(gird_modify)) {
				gird_modify = gird_modify ? key + "," : "," + key + ",";
			}
		}
		// 保存数据状态值
		newdata.gird_modify = gird_modify;
		
		// 更新数据集
		this.dataset.update(function(index,data){
			if(data[keywordName] === keyword){
				return newdata;
			}
		});
		// 如果更新数据后补需要立即显示到界面，则放弃重新生成
		if(renderer === false){
			return;
		}
		// 重新生成数据界面
		this.renderDynamicHtml(this._global.dataContainer,"body");
		// 重新处理数据界面
		this.processingGrid();
		return this;
	},
	/**
	 * 修改多行数据((必须配置keyword属性才可使用))
	 * @param {Array[JsonObject]} data 行数据数组
	 */
	updateRows : function(data) {
		if(!fastDev.isArray(data)) {
			data = [data];
		}
		var len = data.length, renderer = false;

		for(var i = 0; i < len; i++) {
			if(i === len - 1) {
				renderer = true;
			}
			this.updateRow(data[i], renderer);
		}
		return this;
	},
	/**
	 * 删除一行数据(必须配置keyword属性才可使用)
	 * @param {String} keyword 主键值
	 */
	delRow : function(keyword, renderer) {
		if(!this.writeBackCell()){
			fastDev.alert("当前行内编辑还未结束", "信息", "tip");
			return;
		}
		var keywordName = this._options.keyword;
		if(fastDev.isValid(keyword)) {
			if(keywordName) {
				this.dataset.remove(function(index,data){
					return data[keywordName] === keyword;
				});
				//this.dataset.remove(keywordName + "=" + keyword);
				this.addLog("delete", keywordName, keyword);
			}
		}
		if(renderer !== false) {
			this.renderDynamicHtml(this._global.dataContainer,"body");
			this.processingGrid();
		}
		return this;
	},
	delRows : function(keyword) {
		var keys = (keyword || "").split(","), renderer = false;
		for(var i = 0, len = keys.length; i < len; i++) {
			if(i === len - 1) {
				renderer = true;
			}
			this.delRow(keys[i], renderer);
		}
		return this;
	},
	/**
	 * 删除当前所有数据(必须配置keyword属性才可使用)
	 */
	clean : function() {
		var records = this.dataset.select();
		var keywordName = this._options.keyword;
		if(fastDev.isValid(keywordName)) {
			for(var i = 0, record; record = records[i]; i++) {
				this.addLog("delete", keywordName, record.get(keywordName));
			}
			this.dataset.remove();
		}
		this.renderDynamicHtml(this._global.dataContainer,"body");
		this.processingGrid();
	},
	/**
	 * 删除选中行数据
	 */
	delSelectedRow : function() {
		if(!this.writeBackCell()){
			fastDev.alert("当前行内编辑还未结束", "信息", "tip");
			return;
		}
		var elem, elems = this.find("[name='dg_choose']:checked").elems;
		while( elem = elems.shift()) {
			var keywordName = this._options.keyword, row = fastDev(elem).parents("tr"), keyword = this.getValueImpl(row)[keywordName];
			
			this.dataset.remove(this.removeData,keywordName,keyword);
			
			if(/grid_keyword_/.test(keyword)) {
				continue;
			}
			this.addLog("delete", keywordName, keyword);
		}
		this.renderDynamicHtml(this._global.dataContainer,"body");
		this.processingGrid();
		return this;
	},
	removeData : function(index, data, keywordname, keyword){
		return data[keywordname] === keyword;
	},
	/**
	 * 回滚当前未保存值至上一次加载状态(需配置allowRollback属性为true)
	 */
	rollbackModify : function() {
		var reset;
		if(!this.writeBackCell()){
			fastDev.alert("当前行内编辑还未结束", "信息", "tip");
			return;
		}
		this.dataset.rollback();
		if(this._options.allowAutoFillRow) {
			reset = this.addBlankRow(this._options.pageSize);
		}
		this.renderDynamicHtml(this._global.dataContainer,"body");
		if(reset) {
			this.removeBlankData();
		}
		this.processingGrid();
		this._global.logs = [];
	},
	/**
	 * 增加一条数据操作日志
	 * @private
	 */
	addLog : function(oper, keywordName, keyword, data) {
		var log = {};
		log.oper = oper;
		fastDev.each(data, function(key, value) {
			log[key] = value;
		});
		log[keywordName] = keyword;
		this._global.logs.push(log);
	},
	/**
	 * 保存当前修改数据至服务器(需配置action属性)
	 */
	saveToServer : function() {
		if(!this.writeBackCell()){
			fastDev.alert("当前行内编辑还未结束", "信息", "tip");
			return;
		}
		var data = this.getAllModifyInfo();
		this.initProxy.save(data, this._options.onAfterSave, true, true);
		this._global.logs = [];
		this.refreshData();
	},
	/**
	 * 获取当前修改值
	 * @param {Element} elem 数据容器
	 * @param {JsonObject} rowdata 行数据对象
	 * @param {Array{JsonObject}} columns 列配置
	 * @private
	 */
	getModify : function(elem, rowdata, columns) {
		var cell = fastDev(elem), name = columns[cell.parents("td").prop("cellIndex")].name, value = cell.attr("newValue");
		value = !fastDev.isValid(value) ? cell.attr("value") : value;
		rowdata[name] = value;
	},
	/**
	 * 获取当前数据修改信息(自行提交DataGrid修改信息时使用)
	 */
	getAllModifyInfo : function(reset) {
		var i = 0, logs = this._global.logs;
		if(reset === true) {
			var log, len = logs.length;
			for(; log = logs[i]; i++) {
				if(/insert|update/.test(log.oper)) {
					logs.splice(i--, 1);
				}
			}
		}

		var rows = this._global.dataContainer.find("tr:gt(0)").elems, rowdata, keyword, keywordName, row;
		for( i = 0; row = rows[i]; i++) {
			keywordName = this._options.keyword;
			rowdata = this.getValueImpl(fastDev(row));
			keyword = rowdata[keywordName];
			if(/grid_keyword_/.test(keyword)) {
				this.addLog("insert", keywordName, keyword, rowdata);
				continue;
			}
			var changeCells = fastDev(row).find(".ui-datagrid-change-cell"), columns = this._options.columns;
			if(changeCells.hasElem()) {
				rowdata = {};
				fastDev(row).find(".ui-datagrid-change-cell").each(this.getModify, rowdata, columns);
				this.addLog("update", keywordName, keyword, rowdata);
			}
		}
		return this._global.logs;
	},
	/**
	 * 根据值取消选中行，若值为空，清除所有选中行
	 * @param {String} [values] 某列数据,可多个格式为(value1,value2)
	 */
	cleanSelected : function(values) {
		if(!fastDev.isValid(values)) {
			this.find("[name='dg_choose']:checked").prop("checked", false);
		} else {
			this.findChooseBox(values).prop("checked", false);
		}
	},
	/**
	 * 根据值设置选中行(如果值不是唯一，选中可能会有误)
	 * @param {String} values 某列数据,可多个格式为(value1,value2)
	 */
	setSelected : function(values) {
		this.findChooseBox(values).prop("checked", true);
	},
	/**
	 * 根据值禁用选择框
	 * @param {String} values 某列数据,可多个格式为(value1,value2)
	 */
	disableChooseBox : function(values) {
		this.findChooseBox(values).prop("disabled", true);
	},
	/**
	 * 根据值启用选择框
	 * @param {String} values 某列数据,可多个格式为(value1,value2)
	 */
	enableChooseBox : function(values) {
		this.findChooseBox(values).removeProp("disabled");
	},
	/**
	 * 根据指定值查找当前行选择框
	 * @param {String} values 某列数据,可多个格式为(value1,value2)
	 * @private
	 */
	findChooseBox : function(values) {
		var selector = "div ", conds = [];
		values = values.split(",");
		while(values[0]) {
			conds.push("[value='" + values.shift() + "']");
		}
		selector += conds.join(",");
		return this.find(selector).parents("tr").find("[name='dg_choose']");
	},
	/**
	 * @param {Element} elem
	 * @param {String} type
	 * @param {String} method
	 * @private
	 */
	move : function(elem, type, method) {
		var target, domList = this.getTr(elem).elems;
		if(type === "next") {
			domList.reverse();
		}
		fastDev.each(domList, function(i, dom) {
			dom = fastDev(dom);
			target = dom[type]();
			if(type === "prev" && target.prop("rowIndex") === 0) {
				return;
			}
			dom[method](target);
			if(fastDev.Browser.isIE6) {
				dom.find("[name='dg_choose']").prop("checked", true);
			}
		});
	},
	/**
	 * 将选中行向上移动
	 * @param {Object} elem
	 */
	moveUp : function(elem) {
		this.move(elem, "prev", "insertBefore");
	},
	/**
	 * 将选中行向下移动
	 * @param {Object} elem
	 */
	moveDown : function(elem) {
		this.move(elem, "next", "insertAfter");
	},
	/**
	 * 计算DataGrid各部分宽度值
	 * @param {Number} width
	 * @private
	 */
	calculateWidth : function(width, inner) {
		var options = this._options, global = this._global, effectiveWidth;
		// DataGrid总宽度
		options.width = fastDev.Util.StringUtil.stripUnits(width, global.containerWidth);
		// 第二层容器的边框宽度2
		global.bodyWidth = options.width - 2;
		// 配置列可用宽度为总宽度-内置功能列宽度-纵向滚动条预留宽度
		effectiveWidth = global.bodyWidth - global.systemWidth - 19;

		if(inner === true) {
			return effectiveWidth;
		}
		// 重新计算列宽
		var columnWidths = [], colWidthTplList = [], columns = options.columns, limit = columns.length, index = this.getRepairColIndex(columns);
		global.surplus = effectiveWidth;
		for(var i = 0, column; column = columns[i]; i++) {
			var ret = this.buildColWidthTpl(column, effectiveWidth, i === index ? global.surplus : 0, true);
			columnWidths.push(ret[0]);
			colWidthTplList.push(ret[1]);
		}
		//this.template.setParam({
			//colWidthTpl : global.colWidthTpl = colWidthTplList.join("")
		//});
		global.colWidthTpl = colWidthTplList.join("");
		// 重设宽度限制列宽
		var elem, elems = this.find("[name='colwidthlimit'] td").elems;
		for( i = 0; elem = elems[i]; i++) {
			// 表头和表内容的宽度限制列都需要更改
			index = i >= limit ? i - limit : i;
			fastDev(elem).width(columnWidths[index]);
		}
	},
	/**
	 * 计算DataGrid内容部分高度值
	 * @param {Number} height
	 * @private
	 */
	caculateHeight : function(height) {
		var options = this._options, 
			global = this._global, 
			bodyHeight = options.height = fastDev.Util.StringUtil.stripUnits(height, global.containerHeight);
			
		// DataGrid内容部分高度 = 总高度 - 标题行高度 - 头部工具栏高度 - 底部工具栏高度
		bodyHeight = parseInt(options.height, 10) - (global.headerContainer.height() + global.topToolbar.height() + global.bottomToolbar.height());
		// 重设DataGrid内容部分高度
		global.dataContainer.css("height", bodyHeight);
		// 修改标题行宽度以适应DataGrid内容显示不全时出现的滚动条占位问题
		this.adaptWidth(global, bodyHeight);
		global.bodyHeight = bodyHeight;
	},
	/**
	 * 重设DataGrid宽度
	 * @param {Number} width 目标宽度值
	 */
	setWidth : function(width) {
		width = this._options.width = fastDev.Util.StringUtil.stripUnits(width, this._global.containerWidth);
		// 重设DataGrid总宽度
		fastDev(this.elems).width(width);
		// 重设DataGrid二层容器宽度
		this.find(".ui-datagrid-panel").width(width - 2).children().width(width - 2);
		// 重设DataGrid限制列宽度
		this.calculateWidth(width);
		// 重设DataGrid标题表格总宽度
		this._global.headerContainer.find("table").width(width - 2);
		if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7) {
			// 重设DataGrid内容表格总宽度
			this._global.dataContainer.find("table").width(width - 2);
		}
		return this;
	},
	/**
	 * 重设DataGrid高度
	 * @param {Number} height 目标高度值
	 */
	setHeight : function(height) {
		this.caculateHeight(height);
		return this;
	},
	/**
	 * 重设DataGrid宽高
	 * @param {Number} width 目标宽度值
	 * @param {Number} height 目标高度值
	 */
	resize : function(width, height) {
		return this.setWidth(width).setHeight(height);
	},
	/**
	 * 静态查询当前页显示数据
	 * @param {String} text 文本
	 * @param {String} [fieldname] 数据列名
	 */
	filterData : function(text, fieldname) {
		var data = this.dataset.fuzzySelect(text, fieldname, true);
		this.renderDynamicHtml(this._global.dataContainer,"body", data);
	},
	/**
	 * 获取当前有效记录数(填充空行数不计算在内)
	 */
	getSize : function(){
		return this.dataset.getSize();
	}
});

/**
 * @class fastDev.Ui.DataGrid
 * @extends fastDev.Ui.Component
 * 表格控件，提供后台数据通过表格的方式进行展现，方便用户浏览数据，支持拖动列宽、排序、分页等常用操作<p>
 * 作者：袁刚
 * 
 *		<div itype="DataGrid" initSource="../../data/griddata.json" pagePosition="none" showSeqColumn=true>
 * 			<div width="10%" name="empno" text="员工工号"></div>
 * 			<div width="10%" name="empno" text="员工工号"></div>
 * 			<div width="12%" name="department" text="所属部门"></div>
 * 			<div width="8%" name="isuse" text="是否可用"></div>
 * 			<div width="15%" name="position" text="职位"></div>
 * 			<div width="10%" name="pay" text="薪资"></div>
 * 			<div width="10%" name="datesemployed" text="入职时间"></div>
 * 			<div width="15%" name="birthday" text="生日" defaultValue="1985-01-01"></div>
 * 		</div>
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
		 * 分页栏位置设置 top、bottom、all、none
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
		 * @event
		 * 保存数据后回调事件
		 */
		onAfterSave : fastDev.noop,
		enabledDataProxy : false,
		/**
		 * 单击行事件
		 * @event
		 */
		onRowClick : fastDev.noop
	},
	_global : {
		rowspan : 1,
		summaryInfo : null,
		innerPage : 1
	},
	template : [
		'<div class="ui-datagrid" style="width: #{width};">',
			'<div class="ui-datagrid-panel ui-datagrid-box" style="width:#{bodyWidth}">',
				'<div name="ui-top-toolbar"></div><div></div>',
				'<div class="ui-datagrid-header" style="width: #{bodyWidth}; ">',
					'<tpl dynamic name=header>',
						'<table class="ui-datagrid-table" cellspacing="0" cellpadding="0" style="width: #{theadWidth}; ">',
							'<tbody>',
								'<tr name="colwidthlimit">',
									// 宽度设定列
									'#{colWidthTpl}',
								'</tr>',
								//'<tr>',
									// 标题列
									//'#{colTitleTpl}',
								//'</tr>',
								'#{colTitleTpl}',
							'</tbody>',
						'</table>',
					'</tpl>',
					'<div class="ui-datagrid-splitters">',
						// 调整列宽的感应区域
						'#{colSplitTpl}',
					'</div>',
				'</div>',
				'<div class="ui-datagrid-body" style="width: #{bodyWidth};height:100% ">',
					'<tpl dynamic name=body>',
						'<table class="ui-datagrid-table" cellspacing="0" cellpadding="0">',
							'<tbody>',
								'<tr name="colwidthlimit">',
									// 宽度设定列
									'#{colWidthTpl}',
								'</tr>',
								'<tpl each>',
									'<tr class="ui-datagrid-row',
									'<tpl if({row_id}%2===0)>',
										' ui-datagrid-row-alt',
									'</tpl>',
										'">',
										// 数据内容列
										'#{colContentTpl}',
									'</tr>',
									'<tpl if(#{buildRowDetail})>',
										'<tr style="display:none"><td class="ui-datagrid-cell" colSpan="#{colspan}"><div class="ui-datagrid-cell-content"></div></td></tr>',
									'</tpl>',
								'</tpl>',
							'</tbody>',
						'</table>',
					'</tpl>',
				'</div>',
				'<div class="ui-datagrid-count" style="width: #{bodyWidth}; display:none"></div>',
				'<div name="ui-bottom-toolbar"></div>',
			'</div>',
		'</div>'
	],
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
		// 选择框互斥处理
		// if(options.showCheckColumn === true && options.showRadioColumn === true) {
		// options.showRadioColumn = false;
		// }
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
			if(options.showCheckColumn === options.showRadioColumn) {
				options.showRadioColumn = false;
			}
		}
		global.displayJobs = [];
		global.logs = [];
		// 判断是否需要生成行内信息结构
		global.buildRowDetail = !!options.rowDetail;
		// 解析配置信息补充列配置
		var totalWidth = this.parseQuickConfig(options, global),
		// 获取宽度配置，没有则取容器宽度
		width = options.width || options.container.width();
		// 设置宽度
		width = fastDev.Util.StringUtil.stripUnits(width,options.container.width());
		//width = parseInt(width, 10);
		// 第二层容器的边框宽度2
		var bodyWidth = width - 2;
		// 配置列可用宽度为总宽度-内置功能列宽度-纵向滚动条预留宽度
		totalWidth = bodyWidth - totalWidth - 18;
		// 回写总宽度值
		options.width = width + "px";
		// 保存内容宽度值
		global.bodyWidth = bodyWidth + "px";
		// 初始化静态模板
		this.initTemplate(options.columns, totalWidth);
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
		this.initSysJob.root = "data";
		this.dataset.setModify(options.allowRollback);
		this.initProxy.setAction(options.action);

		// 初始化头部工具栏
		if(options.toolBar != null) {
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
			this.initProxy.addJob({
				name : "exec",
				object : fastDev.setFnInScope(this, this.initPageBar),
				root : "info"
			});
			this.dataset.setOptions({
				pageSize : pageSize,
				replenish : options.allowAutoFillRow
			});
		} else {
			pageSize = options.pageSize = 999999;
		}
		this.dataset.setModify(true);
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
		if(!fastDev.isNoop(options.onRowClick) || !fastDev.isNoop(options.onCellClick)) {
			var dataGridBodyClick = fastDev.setFnInScope(this, this.dataGridBodyClick);
			global.dataContainer.bind("click", dataGridBodyClick);
		}
		var trMouseover = fastDev.setFnInScope(this,this.trMouseoverHandle);
		global.dataContainer.bind("mouseover", trMouseover);
	},
	/**
	 * 鼠标滑过行高亮 
	 */
	trMouseoverHandle : function(event){
		var trDom = fastDev(event.target).parents("tr:eq(0)");
		if(trDom.hasClass("ui-datagrid-row")) {
			this.find(".ui-datagrid-row-selected").removeClass("ui-datagrid-row-selected");
			trDom.addClass("ui-datagrid-row-selected");
		}	
	},
	/**
	 * 构造组件数据
	 */
	constructItems : function() {
		var options = this._options,global=this._global,data;
	
		if(options.allowDelayLoad){
			data = this.dataset.selectByPage(global.innerPage);
		}
		
		this.renderDynamicHtml("header");
		// 渲染数据主界面
		this.renderDynamicHtml("body",data);
		// 加工数据主界面
		this.processingGrid();

		if(options.height) {
			var height = global.headerContainer.height() + global.topToolbar.height() + global.bottomToolbar.height();
			height = parseInt(this._options.height, 10) - height;
			global.dataContainer.css("height", height);
			this.adaptWidth(global,height);
		}

		if(this._options.allowResizeColumn === true) {
			this.initResizeColumn(global);
		}

		if(this._options.allowCellMerge === true) {
			this.mergeCell();
		}

		if(this._options.showCheckColumn === true) {
			this.initSelectAll();
		}

	},
	/**
	 * 初始化组件模板
	 * @private
	 */
	initTemplate : function(columns, totalWidth) {
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
		index = 0;
		// 剩余宽度
		global.surplus = totalWidth;
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
			// 计算宽度限制列的宽度
			// 计算最后一个显示列宽度时会将剩余宽度传入与当前宽度进行比较
			colWidthTplList.push(this.buildColWidthTpl(column, totalWidth, i === index ? global.surplus : 0, hidden));
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
			global.colspan = len;
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

		if(options.sort === "server") {
			config = config || {};
			fastDev.apply(config, {
				sortField : options.sortField,
				sortBy : options.sortby
			});
		}

		fastDev.Ui.DataGrid.superClass.initRefresh.call(this, config);

		if(options.sort === "server" && global.sortHandle) {
			options.queue.add(global.sortHandle);
		}
	},
	/**
	 * 数据表单击事件
	 * @param {Object} event
	 * @private
	 */
	dataGridBodyClick : function(event) {
		var dom = fastDev(event.target), parent = dom.parents("tr");
		if(parent.elems.length) {
			var index = parent.prop("rowIndex"), data = this.getValueImpl(parent), className = dom.getClass(), options = this._options;
			options.onRowClick.call(this, event, index, data);
			if(/ui-datagrid-node/.test(className)) {
				this.processRowDetail(className, dom, parent, options, data);
			}
		}
	},
	/**
	 * 不传参是获取选中数据，传入事件源的话，如果事件源Element是在表格行内则可获得那一行的数据
	 * @param {Element} [elem] 事件发生所在元素
	 */
	getValue : function(elem) {
		if(elem == null) {
			var values = [], elems = this.find("[name='dg_choose']:checked").elems;
			for(var i = 0; elem = elems[i]; i++) {
				values.push(this.getValue(elem));
			}
			return values;
		} else {
			var dom;
			if(elem.tagName === "TR") {
				dom = fastDev(elem);
			} else {
				dom = fastDev(elem).parents("tr");
			}
			return this.getValueImpl(dom);
		}
	},
	/**
	 * 根据指定行索引获取行数据
	 * @param {Number} index 索引值，从1开始
	 */
	getValueByIndex : function(index) {
		return this.getValueImpl(this._global.dataContainer.find("tr:eq("+index+")"));
	},
	/**
	 * 根据指定文本查找行数据
	 * @param {String} text 文本
	 * @param {String} [fieldname] 数据列名
	 * @return {Array[JsonObject]}
	 */
	getValueByText : function(text,fieldname){
		return this.dataset.fuzzySelect(text,fieldname);
	},
	/**
	 * 获得指定行对象的数据
	 * @private
	 */
	getValueImpl : function(dom) {
		var columns = this._options.columns, i = this._global.dataColStart, data = {}, tds = dom.find("td").elems;
		for(var column; column = columns[i]; i++) {
			if(!column.name){
				continue;
			}
			var value,div = fastDev(tds[i]).find("div");
			if(column.itype==="control"){
				var id = div.prop("id");
				value = fastDev.getInstance(id).getValue();
			}else{
				value = div.attr("newValue");
				value = value == null ? div.attr("value") : value;
			}
			data[column.name] = value;
		}
		return data;
	},
	/**
	 * 获取当前页所有数据
	 */
	getAllValue : function() {
		var trList = this._global.dataContainer.find("tr:gt(0)").elems,
		values = [], len = this.dataset.getRealSize();
		for(var i = 0; i < len; i++) {
			values.push(this.getValueImpl(fastDev(trList[i])));
		}
		return values;
	},
	/**
	 * 根据传入数据新增一行必须配置keyword属性才可使用
	 * @param {JsonObject} data 行数据
	 */
	addRow : function(data,modify) {
		if(this._global.activeControl != null) {
			this.writeBackCell();
		}
		data = data || {};
		data[this._options.keyword] = data[this._options.keyword] || "grid_keyword_" + fastDev.getID();
		data.gird_modify = (modify == null ? "all" : "");

		this.dataset.insert(data);
		this.renderDynamicHtml("body");

		this.processingGrid();
	},
	/**
	 * 修改一行数据,必须配置keyword属性才可使用(传入参数中必须包含主键值)
	 * @param {JsonObject} data 行数据
	 */
	updateRow : function(data) {
		var keywordName = this._options.keyword, keyword = data[keywordName];
		delete data[keywordName];
		if(keyword == null) {
			return;
		}
		var updateFields = [];
		fastDev.each(data, function(key, value) {
			updateFields.push(key + "=" + value);
		});
		this.dateset.update(updateFields.join(","), keywordName + "=" + keyword);
	},
	/**
	 * 删除一行数据,必须配置keyword属性才可使用
	 * @param {String} keyword 主键值
	 */
	delRow : function(keyword) {
		if(this._global.activeControl != null) {
			this.writeBackCell();
		}
		var keywordName = this._options.keyword;
		if(keywordName) {
			this.dataset.remove(keywordName + "=" + keyword);
			this.renderDynamicHtml("body");
			this.addLog("delete", keywordName, keyword);
		}
		return this;
	},
	/**
	 * 删除选中行数据
	 */
	delSelectedRow : function() {
		if(this._global.activeControl != null) {
			this.writeBackCell();
		}
		var elem, elems = this.find("[name='dg_choose']:checked").elems;
		while( elem = elems.shift()) {
			var keywordName = this._options.keyword, row = fastDev(elem).parents("tr"), keyword = this.getValueImpl(row)[keywordName];
			this.dataset.remove(keywordName + "=" + keyword);
			if(/grid_keyword_/.test(keyword)) {
				continue;
			}
			this.addLog("delete", keywordName, keyword);
		}
		this.renderDynamicHtml("body");
		this.processingGrid();
		return this;
	},
	/**
	 * 回滚当前未保存值至上一次加载状态(需配置allowRollback属性为true)
	 */
	rollbackModify : function() {
		this.dataset.rollback();
		this.renderDynamicHtml("body");
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
		if(this._global.activeControl != null) {
			this.writeBackCell();
		}
		var data = this.getAllModifyInfo();
		this.initProxy.save(data, this._options.onAfterSave);
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
		value = value == null ? cell.attr("value") : value;
		rowdata[name] = value;
	},
	/**
	 * 获取当前数据修改信息
	 */
	getAllModifyInfo : function() {
		var rows = this._global.dataContainer.find("tr:gt(0)").elems, rowdata, keyword, keywordName;
		for(var i = 0, row; row = rows[i]; i++) {
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
		if(values == null) {
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
	}
});

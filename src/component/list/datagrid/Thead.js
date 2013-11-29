fastDev.apply(fastDev.Ui.DataGrid, {
	/**
	 * 标题列生成
	 * @param {Array{JsonObject}} columns 列配置数组
	 * @param [Array[String]] colTitleTplList 标题列行模板数组
	 * @return {Boolean} 是否多表头
	 * @private
	 */
	buildTitleTpl : function(columns, colTitleTplList) {
		colTitleTplList = colTitleTplList || [];
		var global = this._global, index = colTitleTplList.length,
		// 当前行元素数组
		list = ["<tr>"], column, cols = [], mergeTitle = false;
		// 获取配置中的最大合并行数
		var maxRowSpan = this.getMaxRowSpan(columns, true);
		if(maxRowSpan > 1 && !fastDev.isValid(global.cloneColumns)) {
			global.cloneColumns = columns.slice(0);
		}
		// 生成当前行表头
		while( column = columns.shift()) {
			var colSpan = 1, rowSpan = 1, splitter = 'name="splitter-cell"';
			// 如果需要合并表头则获取当前列的跨行跨列数
			if(maxRowSpan > 1) {
				colSpan = this.getColSpan(column);
				column.hidden = colSpan === 0;
				rowSpan = this.getRowSpan(column);
				if(rowSpan === 0) {
					rowSpan = maxRowSpan - this.getRowSpan(column);
				} else {
					rowSpan = 1;
					splitter = "";
				}
			}

			list.push(this.buildColTitleTpl(column, column.hidden !== true, rowSpan || 1, colSpan, splitter));
			// 如果当前为多表头模式则将下一行表头加入待处理数组
			if(column.columns) {
				cols = cols.concat(column.columns);
			}

		}
		list.push("</tr>");
		colTitleTplList[index] = list.join("");
		// 如果检测到还有表头未生成则继续生成
		if(cols.length > 0) {
			this.buildTitleTpl(cols, colTitleTplList);
			mergeTitle = true;
		}
		// 将表头所有行连接为字符串等待填入模板
		global.colTitleTpl = colTitleTplList.join("");
		return mergeTitle;
	},
	/**
	 * 多表头时使用，获取最大合并行数
	 * @param {Array{JsonObject}} columns 列配置数组
	 * @param {Boolean} flag 外部调用标识
	 * @return {Number} 最大合并行数
	 * @private
	 */
	getMaxRowSpan : function(columns, flag) {
		var rowSpan = 1;
		for(var i = 0, column; column = columns[i]; i++) {
			if(column.columns) {
				// 外部调用比较，内部调用数字累加
				rowSpan = flag === true ? Math.max(rowSpan, this.getMaxRowSpan(column.columns) + 1) : rowSpan += this.getMaxRowSpan(column.columns);
			}
		}
		return rowSpan;
	},
	/**
	 * 多表头时使用，获取当前合并列数
	 * @param {JsonObject} 列配置信息
	 * @return {Number} 当前跨列数
	 * @private
	 */
	getColSpan : function(column) {
		var colSpan = 1, columns;
		if( columns = column.columns) {
			colSpan = 0;
			for(var i = 0; column = columns[i]; i++) {
				colSpan += this.getColSpan(column);
			}
		}
		return (column && column.hidden) === true ? 0 : colSpan;
	},
	/**
	 * 多表头时使用，获取当前合并行数
	 * @param {JsonObject} 列配置信息
	 * @return {Number} 当前跨行数
	 * @private
	 */
	getRowSpan : function(column, inner) {
		var rowSpan = 0, columns;
		if( columns = column.columns) {
			for(var i = 0; column = columns[i]; i++) {
				rowSpan += this.getRowSpan(column, true);
			}
		}
		return inner ? ( columns ? columns.length : 1) : rowSpan;
	},
	/**
	 * 生成标题列模板
	 * @param {JsonObject} column 列配置信息
	 * @param {Boolean} display 是否显示
	 * @param {Number} rowSpan 跨行数
	 * @param {Number} colSpan 跨列数
	 * @return {String} 模板字符串
	 * @private
	 */
	buildColTitleTpl : function(column, display, rowspan, colSpan, splitter) {
		var content, renderer = "", cls = "";
		display = display === false ? 'style="display:none"' : "";
		switch(column.itype) {
			case "checkbox":
				content = '<input name="dg_checkbox_all" type="checkbox"/>';
				break;
			case "radio":
				content = '';
				break;
			default :
				content = (column.text || "") + '<span class="ui-datagrid-sorticon"></span>';
		}

		if(column.titleStyle) {
			var processid = fastDev.getID();
			renderer = ' dg_renderer="' + processid + '"';
			this._global.displayJobs.push(function() {
				this._global.headerContainer.find("[dg_renderer='" + processid + "']").css(column.titleStyle);
			});
		}

		if(column.titleCls) {
			cls = " " + column.titleCls;
		}

		return '<td class="ui-datagrid-headercell" ' + display + ' rowSpan="' + rowspan + '" colSpan="' + colSpan + '" ' + splitter + '>' + '<div class="ui-datagrid-cell-inner' + cls + '" ' + renderer + '>' + content + '</div>' + '</td>';
	},
	/**
	 * 初始化列宽调整功能
	 * @private
	 */
	initResizeColumn : function(global) {
		// 调整列宽开始事件
		var columnResizeStart = global.columnResizeStart || fastDev.setFnInScope(this, this.columnResizeStart);
		// 调整列宽时移动事件
		global.columnResizeMove = global.columnResizeMove || fastDev.setFnInScope(this, this.columnResizeMove);
		// 调整列宽结束时间
		global.columnResizeEnd = global.columnResizeEnd || fastDev.setFnInScope(this, this.columnResizeEnd);
		// 禁止选中文本
		global.unSelectFn = global.unSelectFn ||
		function() {
			return false;
		};
		// 绑定调整列宽开始事件
		this.find(".ui-datagrid-splitters").bind("mousedown", columnResizeStart);
		// 定位调整列宽感应区域
		this.positionSplitter();
	},
	/**
	 * 初始化列数据排序
	 * @private
	 */
	initSortColumn : function() {
		var sortHandle = fastDev.setFnInScope(this, this.sortColumn);
		this._global.headerContainer.bind("click", sortHandle);
	},
	/**
	 * 定位改变列宽的鼠标感应区域
	 * @private
	 */
	positionSplitter : function() {
		// 获取感应元素
		var splitters = this.find(".ui-datagrid-splitter").elems;
		// 获取标题列
		var trs = this._global.headerContainer.find("tr:gt(0)"), theads = [], splittersCell = [];
		if(trs.elems.length === 1) {
			splittersCell = trs.find("td").elems;
		} else {
			trs.each(function(elem) {
				theads.push(fastDev(elem).find("td").elems);
			});

			this.loadTheads(0, theads, splittersCell, theads.length, 0, 1);
		}

		//根据标题列位置计算并设置感应区域位置
		for(var i = 0, cell; cell = splittersCell[i + 1]; i++) {
			var info = fastDev.Dom.position(cell);
			if(splitters[i]) {
				fastDev(splitters[i]).css({
					"left" : info.left - 2,
					"top" : info.top,
					"height" : fastDev.Dom.height(cell)
				});
			}
		}
	},
	/**
	 * 当表格为多表头且需要改变列宽功能时，定位改变列宽的感应区域所对应的表头列
	 * @private
	 */
	loadTheads : function(index, theads, splitters, maxRowSpan, count, colCount) {
		var td, tds = theads[index];

		while( td = tds[0]) {
			var rowSpan = td.rowSpan;
			if(colCount > 0 && (rowSpan === maxRowSpan || (rowSpan + count) === maxRowSpan)) {
				splitters.push(td);
				colCount--;
			} else {
				if(colCount === 0) {
					break;
				}
				this.loadTheads(index + 1, theads, splitters, maxRowSpan, count + rowSpan, td.colSpan);
			}
			tds.shift();
		}
	},
	/**
	 * 调整列宽功能开始
	 * @private
	 */
	columnResizeStart : function(event) {
		var global = this._global;
		// 记录起始坐标值
		global.colResizeX = event.pageX || event.x;
		// 禁止页面选中文字干扰拖动
		fastDev("body").bind("selectstart", global.unSelectFn).addClass("unselect");
		// 绑定拖动结束监听事件
		this.find(".ui-datagrid").bind("mouseup", global.columnResizeEnd);
		// 绑定拖动过程显示事件
		this.find(".ui-datagrid").bind("mousemove", global.columnResizeMove);
		//
		global.resizeCellIndex = (event.target.id * 1 - 1);
		// 初始化参照线
		var top = global.headerContainer.offset().top;
		var height = global.headerContainer.height() + global.dataContainer.height();
		// 参照先存在则定位参照先，不存在则创建参照线
		global.currLine = global.currLine ? global.currLine.css("left", event.pageX).show() : fastDev('<div style="width:1px; height:' + height + 'px; background:#000; position:absolute;top:' + top + 'px; left:' + event.pageX + 'px;"></div>').appendTo(document.body).bind("mouseup", global.columnResizeEnd);
	},
	/**
	 * 调整列宽功能运行
	 * @private
	 */
	columnResizeMove : function(event) {
		if(!fastDev.isValid(this._global.resizeCellIndex)) {
			return;
		}
		this._global.limitLeft = this.find("[name='colwidthlimit']:eq(1)").find("td:eq(" + this._global.resizeCellIndex + ")").offset().left + 30;
		// 当前坐标可用则移动提示线
		if(event.pageX >= this._global.limitLeft) {
			this._global.currLine.css("left", event.pageX);
		}
	},
	/**
	 * 调整列宽功能结束
	 * @private
	 */
	columnResizeEnd : function(event) {
		var global = this._global, cellIndex = global.resizeCellIndex;

		if(!fastDev.isValid(cellIndex)) {
			return;
		}
		// 取消监听拖动结束
		this.find(".ui-datagrid").unbind("mouseup", global.columnResizeEnd);
		// 取消拖动过程显示事件
		this.find(".ui-datagrid").unbind("mousemove", global.columnResizeMove);
		// 取消禁止页面选中文字
		fastDev("body").unbind("selectstart", global.unSelectFn).removeClass("unselect");

		// 获取值的对应正负形态，往右调整时，参照列的前一列宽度增加，往左调整时，参照列前一列宽度减少，参照列宽度增加
		var num = (global.colResizeX - Math.max(event.pageX || event.x, global.limitLeft)) * -1;
		if(num > 0) {
			num = "+" + num;
			//cellIndex -= 1;
		} else {
			this.find("[name='colwidthlimit'] td:nth-child(" + (cellIndex + 2) + ")").width("+" + Math.abs(num));
			num += "";
		}
		cellIndex++;
		this.find("[name='colwidthlimit'] td:nth-child(" + (cellIndex || 1) + ")").width(num);
		// 重新定位感应区与
		this.positionSplitter();
		// 调整结束时重置参照列
		global.resizeCellIndex = null;
		// 隐藏参照线
		global.currLine.hide();
	},
	/**
	 * 根据列名以及排序规则对表格进行排序显示
	 * @param {Object} event
	 * @private
	 */
	sortColumn : function(event) {
		// 清除上次排序的图标
		this.find(".ui-datagrid-sort-asc").removeClass("ui-datagrid-sort-asc");
		this.find(".ui-datagrid-sort-desc").removeClass("ui-datagrid-sort-desc");

		var options = this._options, sortby = options.sortby, td = event.target.tagName === "TD" ? fastDev(event.target) : fastDev(event.target).parents("td");
		// 如果上次是正序排列，当前则为倒序排列
		options.sortby = sortby = sortby === "asc" ? "desc" : "asc";
		// 获取排序列索引
		var index = td.prop("cellIndex");
		// 判断是客户端排序还是服务端排序
		if(options.sort === "client") {
			this.sortByClient(options.columns[index].name, sortby, td);
		} else {
			this.sortByServer(options.columns[index].name, sortby, index);
		}

	},
	/**
	 * 客户端排序
	 * @param {String} name 排序字段名
	 * @param {String} sortby 排序规则
	 * @private
	 */
	sortByClient : function(name, sortby, td) {
		if(this.dataset.sort(name, sortby)) {
			var reset = this.addBlankRow(this._options.pageSize);
			this.renderDynamicHtml(this._global.dataContainer,"body");
			if(reset) {
				this.removeBlankData();
			}
		}
		td.addClass("ui-datagrid-sort-" + sortby);
	},
	/**
	 * 服务端排序
	 * @param {String} name 排序字段名
	 * @param {String} sortby 排序规则
	 * @private
	 */
	sortByServer : function(name, sortby, index) {
		var me = this;

		this._options.sortField = name;

		this._global.sortHandle = {
			type : "normal",
			handle : function() {
				me.find(".ui-datagrid-headercell:eq(" + index + ")").addClass("ui-datagrid-sort-" + sortby);
			}
		};

		this.refreshData();
	},
	/**
	 * 调整表头适应表数据的滚动条
	 * @param {Object} height
	 * @private
	 */
	adaptWidth : function(global, bodyHeight) {
		global = global || this._global;
		bodyHeight = bodyHeight || global.bodyHeight;
		
		if(global.dataContainer.find("table").height() > bodyHeight) {
			if(global.bodyScroll === false){
				this._global.headerContainer.find("table").width("-17");
				if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7) {
					this._global.dataContainer.find("table").width("-17");
				}
			}
			global.bodyScroll = true;
		}else{
			if(global.bodyScroll === true){
				this._global.headerContainer.find("table").width("+17");
				if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7) {
					this._global.dataContainer.find("table").width("+17");
				}
			}
			global.bodyScroll = false;
		}
		
	},
	/**
	 * 全选所有数据
	 * @private
	 */
	initSelectAll : function() {
		var me = this;
		this._global.headerContainer.bind("click", function(event) {
			if(event.target.name === "dg_checkbox_all") {
				var checked = me.find("[name='dg_checkbox_all']").prop("checked");
				me.find("[name='dg_choose']:enabled").prop("checked", checked);
			}
		});
	}
});

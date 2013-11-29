fastDev.apply(fastDev.Ui.DataGrid, {
	/**
	 * 处理行内信息展开/收缩
	 * @param {String} className 当前行内信息图标样式
	 * @param {fastDev.Core.DomObject} dom 行内信息图标对象
	 * @param {fastDev.Core.DomObject} parent 行内信息图标所在行对象
	 * @param {JsonObject} options DataGrid配置信息
	 * @param {JsonObject} rowData 当前行数据
	 * @private
	 */
	processRowDetail : function(className, dom, parent, options, rowData) {
		var rowDetailStr = options.rowDetail, 
			detailRow = parent.next(),
			queue = this._global.queue;
		// 如果是展开状态则收缩，否则展开
		if(/ui-datagrid-node-close/.test(className)) {
			this.expandRowDetail(detailRow, rowDetailStr, rowData, parent.width(), queue);
		} else {
			this.collapseRowDetail(detailRow);
		}
		
		if(options.height >0){
			queue.add({
				type : "normal",
				handle : fastDev.setFnInScope(this, this.adaptWidth)
			});
		}
		// 切换图标样式
		dom.toggleClass("ui-datagrid-node-close,ui-datagrid-node-open");
	},
	/**
	 * 展开行内信息
	 * @param {fastDev.Core.DomObject} detailRow 行内信息所在行对象
	 * @param {String} rowDetailInfo 行内信息定义
	 * @param {JsonObject} rowData 当前行数据
	 * @param {Number} width 行内信息所在行宽度
	 * @private
	 */
	expandRowDetail : function(detailRow, rowDetailInfo, rowData, width, queue) {
		detailRow.show();
		// 判断当前行内信息是否被初始化过，如果初始化过则直接显示，否则初始化行内信息
		if(detailRow.attr("init") !== "true") {
			// 处理数据占位符
			rowDetailInfo = this.processRowDetailInfo(rowDetailInfo, rowData);
			// 左右边距20
			detailRow.find("div").append(fastDev.Dom.createByHTML(rowDetailInfo));
			// 设置初始化状态
			detailRow.attr("init", true);
			// 调用HTML模式代码编译，保证用户行内信息定义中的控件HTML代码正常执行
			fastDev.Core.ControlBus.compile(null, detailRow.elems[0], queue);
		}
	},
	/**
	 * 收缩行内信息
	 * @param {fastDev.Core.DomObject} detailRow 行内信息所在行对象
	 * @private
	 */
	collapseRowDetail : function(rowDetail) {
		// 隐藏行内信息行
		rowDetail.hide();
	},
	/**
	 * 处理行内信息定义中的数据占位符
	 * @param {String} rowDetailInfo 行内信息定义
	 * @param {JsonObject} rowData 当前行数据
	 * @private
	 */
	processRowDetailInfo : function(rowDetailInfo, rowData) {
		fastDev.each(rowData, function(key, value) {
			rowDetailInfo = rowDetailInfo.replace(RegExp("{" + key + "}"), value);
		});
		return rowDetailInfo;
	}
}); 
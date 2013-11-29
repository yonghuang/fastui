fastDev.apply(fastDev.Ui.DataGrid, {
	/**
	 * 生成分页栏配置信息
	 * @member fastDev.Ui.DataGrid
	 * @private
	 */
	buildPageBarConfig : function(options) {
		// 跳转至首页按钮事件
		var pageFirst = fastDev.setFnInScope(this, this.pageFirst),
		// 跳转至上一页按钮事件
		pagePrev = fastDev.setFnInScope(this, this.pagePrev),
		// 跳转至下一页按钮事件
		pageNext = fastDev.setFnInScope(this, this.pageNext),
		// 跳转至最后一个按钮事件
		pageLast = fastDev.setFnInScope(this, this.pageLast),
		// 改变每页显示行数事件
		onChange = fastDev.setFnInScope(this, this.changePageSize),
		// 刷新数据按钮事件
		refreshData = fastDev.setFnInScope(this, this.refreshData),
		// 每页显示行数选择框默认值
		pageSizeList = options.pageSizeList || [{
			value : "5",
			text : "5条"
		}, {
			value : "10",
			text : "10条"
		}, {
			value : "20",
			text : "20条"
		}, {
			value : "50",
			text : "50条"
		}],
		// 分页工具栏配置
		pageBarItems = [{
			cls : "ui-button-page",
			iconCls : "icon-pagefirst",
			id : "pagefirst",
			onclick : pageFirst
		}, {
			cls : "ui-button-page",
			iconCls : "icon-pageprev",
			id : "pageprev",
			onclick : pagePrev
		}, "|", "第", {
			itype : "textbox",
			width : "20px",
			id : "page"
		}, {
			text : "页,共1页",
			itype : "text",
			id : "total"
		}, '|', {
			cls : "ui-button-page",
			iconCls : "icon-pagenext",
			id : "pagenext",
			onclick : pageNext
		}, {
			cls : "ui-button-page",
			iconCls : "icon-pagelast",
			id : "pagelast",
			onclick : pageLast
		}, "|", {
			cls : "ui-button-page",
			iconCls : "icon-refresh",
			id : "refresh",
			onclick : refreshData
		}, ">", {
			itype : "select",
			width : "50px",
			id : "pageSize",
			onchange : onChange,
			items : pageSizeList,
			enableInitProxy : false,
			enableDataProxy : false,
			value : this._options.pageSize
		}, "|", {
			text : "共1条",
			itype : "text",
			id : 'records'
		}],
		// 如果用户在分页工具栏上配置了自定义按钮，则读取用户配置追加至分页工具栏配置
		pageItems = options.pageItems;
		if(fastDev.isArray(pageItems)) {
			pageItems.splice(0, 0, "|");
			for(var i = 0, len = pageItems.length; i < len; i++) {
				pageBarItems.splice(11 + i, 0, pageItems[i]);
			}
		}
		// 返回分页栏配置信息
		return {
			cls : "ui-pagebar ui-pagebar-bg",
			items : pageBarItems
		};
	},
	/**
	 * 初始化分页栏数据
	 * @param {JsonObject} info 分页信息
	 * @member fastDev.Ui.DataGrid
	 * @private
	 */
	initPageBar : function(data) {
		var info = fastDev.Data.Reader.readDataSegment(data, "info") || {};
		fastDev.each("pageBar clonePageBar".split(" "), function(index, item) {
			var pageBar = this._global[item], page = info.page || 1, total = info.total || 1;
			if(!fastDev.isValid(pageBar)) {
				return false;
			}

			if(page === 1) {
				pageBar.getItem("pagefirst").disable();
				pageBar.getItem("pageprev").disable();
			}

			if(page === total) {
				pageBar.getItem("pagenext").disable();
				pageBar.getItem("pagelast").disable();
			}

			pageBar.getItem("page").setValue(page);
			pageBar.getItem("total").setText("页,共" + total + "页");
			pageBar.getItem("pageSize").setValue(info.pageSize || this._options.pageSize);
			pageBar.getItem("records").setText("共" + (info.records || 0) + "条");
		}, this);
	},
	/**
	 * 跳转至首页
	 * @member fastDev.Ui.DataGrid
	 */
	pageFirst : function() {
		this.jumpPage("first");
	},
	/**
	 * 跳转至上一页
	 * @member fastDev.Ui.DataGrid
	 */
	pagePrev : function() {
		this.jumpPage("prev");
	},
	/**
	 * 跳转至下一页
	 * @member fastDev.Ui.DataGrid
	 */
	pageNext : function() {
		this.jumpPage("next");
	},
	/**
	 * 跳转至最后一个
	 * @member fastDev.Ui.DataGrid
	 */
	pageLast : function() {
		this.jumpPage();
	},
	/**
	 * 跳转至指定页
	 * @param {Number} 目标页
	 * @member fastDev.Ui.DataGrid
	 */
	jumpPage : function(target) {

		var pageBar = this._global.pageBar,
		// 当前页
		page = +(pageBar?pageBar.getItem("page").getValue(page) : 1),
		// 每页显示行数
		pageSize = this._options.pageSize,
		// 数据总页数
		total = pageBar ? /[^\d]*(\d*)[^\d]*/.exec(pageBar.getItem("total").getText())[1] : 1;
		// 根据跳转目标计算目标页数
		switch(target) {
			case "first":
				page = 1;
				break;
			case "prev":
				page -= 1;
				break;
			case "next":
				page += 1;
				break;
			case "refresh":
				break;
			default :
				page = target || total;
		}

		// 跳转页数无效时返回
		if(page < 0 || page > total) {
			return;
		}
		// 设置分页栏跳转按钮状态
		fastDev.each("pageBar clonePageBar".split(" "), function(index, item) {
			pageBar = this._global[item];
			if(!fastDev.isValid(pageBar)) {
				return false;
			}
			// 获取4个跳转按钮，在页数改变时同时改变它们的状态
			var firstBtn = pageBar.getItem("pagefirst"), prevBtn = pageBar.getItem("pageprev"), nextBtn = pageBar.getItem("pagenext"), lastBtn = pageBar.getItem("pagelast");

			if(page === 1) {
				firstBtn.disable();
				prevBtn.disable();
			} else {
				firstBtn.enable();
				prevBtn.enable();
			}

			if(page === total) {
				nextBtn.disable();
				lastBtn.disable();
			} else {
				nextBtn.enable();
				lastBtn.enable();
			}
		}, this);
		// 设置后台分页依赖参数至代理中
		this.initProxy.addParam({
			page : page,
			pageSize : pageSize
		});

		// 调用刷新方法
		this.initRefresh();
	},
	/**
	 * 更改每页显示数据条数
	 * @member fastDev.Ui.DataGrid
	 * @private
	 */
	changePageSize : function(value) {
		this._options.pageSize = value;
		this.jumpPage(1);
	},
	/**
	 * 刷新数据方法
	 * 参数为布尔类型时定义当前显示是否回到第一页
	 * 参数为Json对象类型时，设置当前刷新操作请求参数并强制回到第一页显示
	 * @member fastDev.Ui.DataGrid
	 * @param {Boolean/Jsonobject} reset 刷新参数
	 */
	refreshData : function(reset) {
		var target = "refresh", setParam;

		if(reset === true || ( setParam = fastDev.isPlainObject(reset))) {
			target = 1;
			if(setParam === true) {
				this.initProxy.setParam(reset);
			}
		}
		this.jumpPage(target);
	},
	/**
	 * 获取分页栏信息 
	 * @param {String} name 分页信息名称 page(当前页)/total(总页数)/pageSize(每页显示条目数)/records(总记录数)
	 */
	getPageBarInfo : function(name){
		var info, match, 
			pageBar = this._global.pageBar;
		switch(name){
			case "page" :
				info = (pageBar && pageBar.getItem("page").getValue()) || 1;
				break;
			case "total" :
				info = pageBar.getItem("total").getText();
				match = /共(.+)页/.exec(info);
				info = match[1];
				break;
			case "pageSize" : 
				info = (pageBar && pageBar.getItem("pageSize").getValue()) || this._options.pageSize;
				break;
			case "records" :
				info = pageBar.getItem("records").getText();
				match = /共(.+)条/.exec(info);
				info = match[1];
				break; 
		}
		return +info;
	}
});

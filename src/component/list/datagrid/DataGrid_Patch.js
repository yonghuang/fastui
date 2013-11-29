// datagrid兼容子类
fastDev.define("fastDev.Patch.DataGrid", {
	extend : "fastDev.Ui.DataGrid",
	alias : "Patch.DataGrid",
	mapping : {
		"rows" : "pageSize",
		"fields" : "columns",
	},
	// datagrid兼容属性属性解析
	parseAttr : function(config) {
		var config = fastDev.parseMapping(config, this.mapping);

		// 自带复选框或单选框配置兼容
		if(config.multiple != null) {
			if(config.multiple === true) {
				config.showCheckColumn = true;
			} else {
				config.showRadioColumn = true;
			}
			config.multiple = null;
			delete config.multiple;
		}
		//
		if(config.checkboxCallBack) {
			config.onRowClick = function(event, index, data) {
				if(event.target.name === "dg_choose") {
					this._options.checkboxCallBack.call(this, data);
				}
			};
		}

		if(config.buttons) {
			config.toolBar = {
				items : this.buildToolBar(config.buttons)
			}
		}
		
		if(config.sort != null){
			if(config.sort === true){
				config.sort = "server";
			}else{
				config.sort = "client";
			}
		}

		fastDev.create("Patch.DataGrid", config);
	},
	construct : function(options) {
		// 处理rows与pageSize兼容(提交时)
		this.initProxy.setParam({
			rows : options.pageSize
		});
	},
	// 处理rows与pageSize兼容(获取时)
	initPageBar : function(info) {
		var records = info.total;
		info.total = info.records;
		info.records = records;
		info.pageSize = info.rows;
		this.superClass.initPageBar.call(this, info);
	},
	changePageSize : function(value) {
		var pageBar = this._global.pageBar, page = pageBar.getItem("page").getValue(page);
		this.dataset.setPageSize(value);
		this.initProxy.setParam({
			page : page,
			pageSize : value,
			rows : value
		});
		this.initRefresh();
	},
	buildToolBar : function(buttons) {
		var button,items=[];
		while( button = buttons.shift()) {
			switch(button) {
				case "new" :
					items.push({plain:true,text:"新增",iconCls:"icon-add"});
					break;
				case "del" :
					items.push({plain:true,text:"删除",iconCls:"icon-delete"});
					break;
				case "save" :
					items.push({plain:true,text:"保存",iconCls:"icon-save"});
					break;
				case "cancel" :
					items.push({plain:true,text:"取消"});
					break;
				case "refresh" :
					items.push({plain:true,text:"保存",iconCls:"icon-refresh"});
					break;
				case "moveup-down" :
					items.push({plain:true,text:"上移"});
					items.push({plain:true,text:"下移"});
					break;
			}
		}
		return items;
	}
});

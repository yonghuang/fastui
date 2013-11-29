/**
 * @class fastDev.Ui.Toolbar
 * @author liuRuiTao
 * @extends fastDev.Ui.Component
 * 工具栏控件，支持定义文本、按钮、输入框、下拉框等控件<p>
 * 作者：袁刚
 * 
 *		<div itype="Toolbar">
 *			<div itype="text" text="工具栏文本"></div>
 *			<div itype="spacer"></div>
 *			<div plain=true text="增加" iconCls="icon-add"></div>
 *			<div itype="separator"></div>
 *			<div plain=true text="修改" iconCls="icon-edit"></div>
 *			<div itype="separator"></div>
 *			<div plain=true text="保存" iconCls="icon-save"></div>
 *			<div itype="separator"></div>
 *			<div plain=true text="删除" iconCls="icon-delete"></div>
 *			<div itype="end"></div>
 *			<div iconCls="icon-search" text="搜索"></div>
 *			<div itype="separator"></div>
 *			<div iconCls="icon-print" text="打印"></div>
 *		</div>
 */
fastDev.define("fastDev.Ui.Toolbar", {
	extend : "fastDev.Ui.Component",
	alias : "Toolbar",
	_options : {
		enableDataSet  : false,
		enableInitProxy : false,
		enableDataProxy : false,
		/**
		 * 内容项
		 * @property {Array[JsonObject]/String} items 子项配置数组
		 * @property {String} [items.itype="button"] 子项的类型
		 *  "text" : 文本
		 *  "button" : 按钮
		 *  "textbox" : 文本框
		 *  "select" : 下拉框
		 *  "spacer(-)" : 空格分隔符
		 *  "separator(|)" : 竖线分隔符
		 *  "end(>)" ： 左侧布局结束符
		 * @since 1.4
		 */
		items : null
	},
	_global : {
		width : "100%"
	},
	// 工具栏子项构造器
	_itemCtor : {
		"text" : function(item) {
			return fastDev('<span class="ui-button-text">' + item.text + '</span>').appendTo(item.container);
		},
		"button" : function(item) {
			return fastDev.create("Button", item);
		},
		"textbox" : function(item) {
			return fastDev.create("TextBox", item);
		},
		"select" : function(item) {
			return fastDev.create("Select", item);
		},
		"spacer" : function(item) {
			return fastDev("<span class='ui-space'></span>").appendTo(item.container);
		},
		"separator" : function(item) {
			return fastDev("<span class='ui-toolbar-line'></span>").appendTo(item.container);
		}
	},
	staticTemplate : function(params) {
		return [
			'<div class="ui-toolbar ui-toolbar-bg ' + params.cls + '" style="width: ' + params.width + '">', 
				'<div class="ui-left"></div>', 
				'<div class="ui-right"></div>', 
			'</div>'
		].join('');
	},
	tplParam : ["width", "cls"],
	ready : function() {
		this._itemMap = {};
	},
	construct : function(options, global) {
		// 默认子项容器为左侧
		global.shell = this.find(".ui-left");
	},
	/**
	 * 初始化控件
	 * @param {Array} options公共属性
	 * @param {Array} global全局变量
	 * @since 1.4
	 * @private
	 */
	init : function(options, global) {
		// 构造子项
		this.constructItems(options.items);
	},
	/**
	 * 构建控件项
	 * @param {Array} items项数据
	 * @since 1.4
	 * @private
	 */
	constructItems : function(items) {
		// 子项配置校验
		if(!fastDev.isArray(items)) {
			return;
		}

		var container = this._global.shell;

		for(var i = 0, item; item = items[i]; i++) {
			this.addItem(item, container);
		}
	},
	/**
	 * 处理items为标准模式
	 * @private
	 */
	parseItem : function(item) {
		// 子项默认类型为按钮
		if(!fastDev.isString(item)) {
			item.itype = item.itype || "button";
			return;
		}
		
		// js定义时子项的简写解析
		switch(item) {
			case "-":
				return {
					itype : "spacer"
				};
			case "|":
				return {
					itype : "separator"
				};
			case ">":
				return {
					itype : "end"
				};
			default :
				return {
					itype : "text",
					text : item
				};
		}
	},
	/**
	 * 解析单个标签
	 * @private
	 */
	constructItem : function(item, container) {
		// 子项类型
		var type = item.itype,
		// 子项构造器
		ctor = this._itemCtor[type], 
		// 子项ID
		id = item.id;
		// 如果找不到构造器则切换容器至右侧，如果值合法的情况下只有end标识会找不到构造器
		if(ctor) {
			item.container = container;
			item = ctor(item);
			if(fastDev.isValid(id)) {
				this._itemMap[id] = item;
			}
		} else {
			this._global.shell = container = this.find(".ui-right");
		}
	},
	/**
	 * 添加一个Item
	 * @since 1.4
	 * @param {Object} options item控件属性
	 * @param {String} pos 控件位置left或者right 默认为right
	 */
	addItem : function(options, container) {
		// 子项容器校验
		if(fastDev.isString(container)) {
			container = this.find(".ui-" + container);
		} else {
			container = this._global.shell;
		}

		if(container.isEmpty()) {
			return;
		}
		
		// 解析子项
		options = this.parseItem(options) || options;
		// 创建子项
		this.constructItem(options, container);
		return this;
	},
	/**
	 * 删除工具栏子项 
	 * @param {String} id 子项ID
	 */
	removeItem : function(id){
		if(this._itemMap[id]) {
			this._itemMap[id].destroy();
			this._itemMap[id] = null;
			delete this._itemMap[id];
		}
	},
	/**
	 * 启用工具栏子项
	 * @param {String} id 子项ID
	 */
	enable : function(id) {
		if(this._itemMap[id]) {
			this._itemMap[id].enable();
		}
	},
	/**
	 * 禁用工具栏子项
	 * @param {String} id 子项ID
	 */
	disable : function(id) {
		if(this._itemMap[id]) {
			this._itemMap[id].disable();
		}
	},
	/**
	 * 获取子项对象 
	 * @param {String} id 子项ID
	 */
	getItem : function(id){
		return this._itemMap[id];
	}
});

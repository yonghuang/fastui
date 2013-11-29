/**
 * @class fastDev.Core.ControlBus
 * @extends fastDev.Core.Base
 * @singleton
 * 控件总线，输入控制层的一部分，负责做管理控件库的总体，如逻辑异常处理、HTML模式定义的编译以及控件的实例
 */
fastDev.define("fastDev.Core.ControlBus", {
	extend : "fastDev.Core.Base",
	_options : {
		/**
		 * 检测Session过期的服务地址
		 * @type {String}
		 */
		action : "",
		/**
		 * 检测Session过期完成后的回调方法
		 * @type {Function}
		 */
		checkComplete : fastDev.noop
	},
	_instanceMap : {},
	_queueMap : {},
	/**
	 * 检测Session是否过期，页面如果没有与后台交互的代码可以调用此方法检查Session，否则无需调用
	 * @param {String} url 检测服务地址
	 * @param {Function} checkComplete 检测完成后回调函数
	 */
	checkSession : function(url, checkComplete) {
		// 无Session过期检测服务
		if(!url && !this._options.action) {
			return;
		}
		// 修正服务地址
		if(url && url !== this._options.action) {
			this._options.action = url;
		} else {
			url = this._options.action;
		}
		if(fastDev.isFunction(checkComplete)) {
			this._options.checkComplete = checkComplete;
		}

		// 开始检测
		this.sessionProxy = (this.sessionProxy ? this.sessionProxy.setAction(url) : fastDev.create("Proxy", {
			url : url
		})).load();

		// 锁定队列
		this._options.lockQueue = true;
	},
	/**
	 * 保存控件实例
	 * @param {String} id 实例ID
	 * @param {Object} instance 实例对象
	 */
	saveInstance : function(id, instance) {
		if(!id || !instance) {
			return;
		}
		fastDev.Core.ControlBus._instanceMap[id] = instance;
	},
	/**
	 * 获取控件实例
	 * @param {String} id
	 * @return {Object} 实例对象
	 */
	getInstance : function(id) {
		if(fastDev.isString(id) && id.replace(/\s/g, "").length > 0) {
			return fastDev.Core.ControlBus._instanceMap[id];
		}
	},
	/**
	 * 保存队列实例
	 * @param {String} id 实例ID
	 * @param {Object} instance 队列对象
	 */
	saveQueue : function(id, queue) {
		if(!id || !queue) {
			return;
		}
		fastDev.Core.ControlBus._queueMap[id] = queue;
	},
	/**
	 * 获取队列实例
	 * @param {String} id
	 * @return {Object} 队列对象
	 */
	getQueue : function(id) {
		if(fastDev.isString(id) && id.replace(/\s/g, "").length > 0) {
			return fastDev.Core.ControlBus._queueMap[id];
		}
	},
	/**
	 * 编译HTML模式代码
	 * @param {String} [key=itype] html模式关键字
	 * @param {Element} [context] 编译范围
	 */
	compile : function(key, context, queue) {
		fastDev("[itype]", context).each( this.parseHtml, key || "itype", queue );
	},
	/**
	 * 解析关键HTML描述
	 * @param {Element} elem 用于描述的Dom节点
	 * @private
	 */
	parseHtml : function(elem, key, queue) {
		// 获取控件类型
		var config, type = (elem.attributes.getNamedItem("itype") || {}).nodeValue;
		if(!fastDev.isValid(type) || (key === "itype" && fastDev(elem).attr("compile") === "false")) {
			return;
		}
		key = "itype";

		if(/template|control|boolean|normal|number|date|text|spacer|separator|end|button/.test(type)) {
			return;
		}

		var specialParse = fastDev.Core.ControlBus.specialParse[type];
		// 删除节点上的itype属性
		elem.attributes.removeNamedItem(key);
		// 解析描述节点的配置属性
		config = fastDev.Core.ControlBus.parseConfig(elem, type);
		config.container = config.container || fastDev(elem).parent();
		config.defineMode = "html";
		config.queue = queue;
		
		// 处理特殊控件的描述
		if(fastDev.isValid(specialParse)) {
			specialParse(config, elem);
		}
		// 清除浏览器自动绑定的事件
		fastDev.Core.ControlBus.cleanSysEvent(elem);
		
		// 创建控件
		var control = fastDev.create(type, config);
		// 替换描述节点
		if(/form/i.test(type) ) {
			return ;
		}
		
		fastDev(control.elems).replace(elem);
	},
	/**
	 * 解析HTML属性配置（IE）
	 * @param {Element} elem
	 * @private
	 */
	parseConfig_IE : function(elem) {
		var str = elem.outerHTML, innerStr = elem.innerHTML;
		str = str.replace(innerStr, "");

		var key, value, config = {}, index = str.indexOf(" "), begin, end, len = str.length, match = /\s(disabled|readonly|selected|multiple|checked)|\s+([^=]*)=/gi;
		for(; index < len; index = end) {
			match.lastIndex = index;
			var m = match.exec(str);

			if(!fastDev.isValid(m)) {
				break;
			}
			if(m[1]) {
				key = m[1].toLowerCase();
				value = true;
				end = m.index + key.length;
			} else {

				begin = m.index;
				key = m[2];

				key = fastDev.Browser.isIE && !fastDev.Browser.isIE10 ? key : (fastDev.Core.ControlBus.ATTR[key] || key);

				value = (elem.attributes[key] || {}).nodeValue || "";

				end = match.lastIndex + (value + "").length;
				value = this.formatValue(key, value);

			}

			config[key] = value;
		}
		return config;
	},
	cleanSysEvent : function(elem) {
		fastDev.each(["onchange", "onsubmit", "onreset", "onselect", "onblur", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onclick", "ondblclick", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup"], function(index, eventname) {
			elem[eventname] = null;
		});
	},
	/**
	 * 解析HTML属性配置（除IE外其他）
	 * @param {Element} elem
	 * @private
	 */
	parseConfig_Other : function(elem, type) {
		if(!fastDev.isValid(type)) {
			return this.parseConfig_IE(elem);
		}

		var clazz = fastDev.Core.ClassManager.getClass(type), option, node, value, config = {};
		if(clazz) {
			option = clazz._options;
			fastDev.each(option, function(key, value) {
				if( node = elem.attributes[key]) {
					value = this.formatValue(key, node.nodeValue);
					config[key] = value;
				}
			}, this);
		}
		return config;
	},
	/**
	 * 特殊值解析
	 * @param {String} key 属性键
	 * @param {String} value 属性值
	 * @return {Object}
	 * @private
	 */
	formatValue : function(key, value) {
		var m;
		if( m = /(.*)(?=\(\)$)|^#\{(.*)\}|^(true|false)$/i.exec(value)) {
			if(m[1] || m[2]) {
				value = m[1] || m[2];
				value = value.indexOf(".") !== -1 ? fastDev.Util.ObjectUtil.parseObject("return window."+value)() : window[value];
			} else if(m[3]) {
				value = value === "true";
			}
		}

		if(/style/i.test(key)) {
			var css, style = value.split(/;/);
			value = {};
			while(style[0]) {
				css = style.shift().split(/:/);
				value[css[0]] = css[1];
			}
		}
		return value;
	},
	/**
	 * 解析子项描述
	 * @param {JsonObject} config 配置对象
	 * @param {Array[Element]} elems 子项描述节点
	 * @private
	 */
	gatherInfo : function(elems) {
		var items = [];
		fastDev.each(elems, function(i, elem) {
			items.push(fastDev.Core.ControlBus.parseConfig(elem));
		});
		return items.length ? items : null;
	},
	/**
	 * 保存子项Dom内容
	 * @private
	 */
	gatherInfoparseContent : function(elems) {
		var items = [], childs;
		fastDev.each(elems, function(i, elem) {
			items.push(fastDev.Core.ControlBus.parseConfig(elem));
			childs = fastDev(elem).children();
			if(childs.elems.length > 0) {
				items[items.length - 1].content = childs;
			}
		});
		return items.length ? items : null;
	},
	/**
	 * 常用Div子项解析
	 * @private
	 */
	parseItems : function(config, elem) {
		var elems = fastDev(elem).children("div").elems;
		if(fastDev.isValid(config)) {
			config.items = fastDev.Core.ControlBus.gatherInfo(elems);
		} else {
			return fastDev.Core.ControlBus.gatherInfo(elems);
		}
	},
	/**
	 * Accordion、Tabs子项解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseContent : function(config, elem) {
		var elems = fastDev(elem).children("div").elems;
		if(fastDev.isValid(config)) {
			config.items = fastDev.Core.ControlBus.gatherInfoparseContent(elems);
		} else {
			return fastDev.Core.ControlBus.gatherInfoparseContent(elems);
		}
	},
	/**
	 * 按钮子项解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseSubItems : function(config, elem) {
		var elems = fastDev(elem).children("div").elems;
		config.subItems = fastDev.Core.ControlBus.gatherInfo(elems);
	},
	/**
	 * DataGrid列解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseColumns : function(config, elem) {
		var elems = fastDev(elem).children("div").elems;
		var columns = [];
		fastDev.each(elems, function(i, elem) {
			var dom = fastDev(elem), name = dom.attr("name");

			switch (name) {
				case "top-toolbar":
					var toolBar = fastDev.Core.ControlBus.parseConfig(elem);
					fastDev.Core.ControlBus.parseItems(toolBar, elem);
					config.toolBar = toolBar;
					break;
				case "bottom-toolbar":
					config.pageItems = fastDev.Core.ControlBus.parseItems(null, elem);
					break;
				case "pageSizeList":
					config.pageSizeList = fastDev.Core.ControlBus.parseItems(null, elem);
					break;
				case "controlCfg":
					var type = config.editby || config.controlType;
					if(fastDev.isValid(type)) {
						var controlCfg = fastDev.Core.ControlBus.parseConfig(elem, type), specialParse = fastDev.Core.ControlBus.specialParse[type];
						if(fastDev.isValid(specialParse)) {
							specialParse(controlCfg, elem);
						}
						config.controlCfg = controlCfg;
					}
					break;
				case "rowDetail":
					config.rowDetail = elem.innerHTML;
					break;
				default:
					var column = fastDev.Core.ControlBus.parseConfig(elem), items = dom.children("div").elems;
					if(items.length) {
						fastDev.Core.ControlBus.parseColumns(column, elem);
					}
					columns.push(column);
			}

		});
		config.columns = columns.length ? columns : null;
	},
	/**
	 * Panel内容解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parsePanelContent : function(config, elem) {
		config.htmlContent = fastDev(elem).children();
	},
	/**
	 * AutoComplete子项解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseAutoCompleteItems : function(config, elem) {
		var fields = ( elem = fastDev(elem)).children("div[name='fields']");
		if(fields.hasElem()) {
			config.fields = fastDev.Core.ControlBus.gatherInfo(fields.children("div").elems);
		}
		fields.remove();
		var items = elem.children("div");
		if(items.hasElem()) {
			config.items = fastDev.Core.ControlBus.gatherInfo(items.elems);
		}
	},
	/**
	 * DatePicker表达式组解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseDataPickerExpressions : function(config, elem) {
		elem = fastDev(elem);
		var element, exp;
		fastDev.each(["includes", "excludes"], function(i, name) {
			if(( element = elem.children("div[name='" + name + "']")).hasElem()) {
				config[name] = [];
				exp = name.slice(0, 7);
				fastDev.each(fastDev.Core.ControlBus.gatherInfo(element.children("div").elems) || [], function(i, expr) {
					if(expr[exp]) {
						config[name].push(expr[exp]);
					}
				});
			}
		});
	},
	/**
	 * FileUpload按钮解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseFileUploadBtns : function(config, elem) {
		var elems = fastDev(elem);
		fastDev.each(["chooseBtn", "uploadBtn"], function(idx, name) {
			if( elem = elems.find("div[name='" + name + "']").elems[0]) {
				config[name] = fastDev.Core.ControlBus.gatherInfo([elem])[0];
			}
		});
	},
	/**
	 * ChooseList items、widget和buttons解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseChooseListContent : function(config, elem) {
		elem = fastDev(elem);
		var buttons = elem.children("div[name='buttons']");
		if(buttons.hasElem()) {
			config.buttons = fastDev.Core.ControlBus.gatherInfo(buttons.children("div").elems) || [];
		}
		var items = elem.children("div[name='items']");
		if(items.hasElem()) {
			config.items = fastDev.Core.ControlBus.gatherInfo(items.children("div").elems);
		}
		var fields = elem.children("div[name='fields']");
		if(fields.hasElem()) {
			config.fields = fastDev.Core.ControlBus.gatherInfo(fields.children("div").elems);
		}
		fastDev.each(["leftTop", "leftBottom", "rightTop", "rightBottom"], function(i, name) {
			var template = elem.children("div[name='" + name + "']");
			if(template.hasElem()) {
				config[name] = "";
				config[name + "Height"] = template.attr("height") || template.outerHeight(true);
				config[name + "Element"] = template.children();
			}
		});
		elem.children("div[name$='Widget']").each(function(element) {
			var name = ( element = fastDev(element)).attr("name").match(/^(left|right)Widget/), widget;
			if(!!name) {
				name = name[1];
				widget = config[name + "Widget"] = fastDev.Core.ControlBus.gatherInfo(element.elems)[0] || {};
				widget.name = name;
				if(( element = element.children("div")).hasElem()) {
					fastDev.apply(widget, {
						mode : "html",
						type : element.attr("itype"),
						widgetElement : element,
						isNotDefaultContainer : !! element.attr("container"),
						options : fastDev.Core.ControlBus.parseConfig(element.elems[0], element.attr("itype")) || {}
					});
					fastDev.each(fastDev.Ui.ChooseList.initPredefine(config, widget), function(name, value) {
						if(!!value) {
							element.attr(name, value);
						}
					});
				}
			}
		});
	},
	/**
	 * TextBox value值解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseTextBoxValue : function(config, elem) {
		if(config.type === "textarea") {
			config.value = fastDev.isValid(config.value) ? config.value + "" : elem.innerHTML;
		}
	},
	/**
	 * Select 子项解析
	 * @param {Object} config
	 * @param {Object} elem
	 * @private
	 */
	parseOption : function(config, elem) {
		var elems = fastDev(elem).children("option").elems, items = [];
		if(!elems.length) {
			elems = fastDev(elem).children("div").elems;
		}
		fastDev.each(elems, function(index, option) {
			items.push({
				value : /value=/.test(option.outerHTML) ? fastDev.Dom.prop(option, "value") || fastDev.Dom.attr(option, "value") : null,
				text : (option.attributes.text || {}).nodeValue || option.innerHTML || "",
				selected : /selected/.test(option.outerHTML)
			});
		});
		if(fastDev.isArray(config.items)){
			items = items.concat(config.items);
		}
		config.items = items;
	},
	/**
	 * 绑定Session过期检查完成后的回调句柄
	 * @param {Function} handle 函数句柄
	 */
	bindCheckComplete : function(handle) {
		this._options.checkComplete = handle;
	},
	/**
	 * 触发Session过期检查完成后的回调句柄
	 * @param {String} msg Session信息
	 * @private
	 */
	fireTimeout : function(msg) {
		this._options.checkComplete(msg);
	}
});

fastDev.apply(fastDev.Core.ControlBus, {
	specialParse : {
		// 手风琴
		"Accordion" : fastDev.Core.ControlBus.parseContent,
		// 复选框组
		"CheckBoxGroup" : fastDev.Core.ControlBus.parseItems,
		// 面包屑
		"BreadCrumb" : fastDev.Core.ControlBus.parseItems,
		// 按钮
		"Button" : fastDev.Core.ControlBus.parseSubItems,
		// 表格
		"DataGrid" : fastDev.Core.ControlBus.parseColumns,
		// 单选框组
		"RadioGroup" : fastDev.Core.ControlBus.parseItems,
		"Tabs" : fastDev.Core.ControlBus.parseContent,
		"Toolbar" : fastDev.Core.ControlBus.parseItems,
		"Select" : fastDev.Core.ControlBus.parseOption,
		"Panel" : fastDev.Core.ControlBus.parsePanelContent,
		"AutoComplete" : fastDev.Core.ControlBus.parseAutoCompleteItems,
		"FileUpload" : fastDev.Core.ControlBus.parseFileUploadBtns,
		"SWFFileUpload" : fastDev.Core.ControlBus.parseFileUploadBtns,
		"ChooseList" : fastDev.Core.ControlBus.parseChooseListContent,
		"DatePicker" : fastDev.Core.ControlBus.parseDataPickerExpressions,
		"TextBox" : fastDev.Core.ControlBus.parseTextBoxValue
	},
	parseConfig : fastDev.Browser.isIE && !fastDev.Browser.isIE10 ? fastDev.Core.ControlBus.parseConfig_IE : fastDev.Core.ControlBus.parseConfig_Other,
	ATTR : {
		"saveinstance" : "saveInstance",
		// Column
		"truetext" : "trueText",
		"falsetext" : "falseText",
		"defaultvalue" : "defaultValue",
		"controltype" : "controlType",
		"summarytype" : "summaryType",
		"summarytext" : "summaryText",
		"summaryrenderer" : "summaryRenderer",
		"titlestyle" : "titleStyle",
		"titlecls" : "titleCls",
		"idcolumn" : "idColumn",
		// DataGrid
		"summarytpl" : "summaryTpl",
		// ToolBar
		"iconcls" : "iconCls",
		// SelectTree
		"initsource" : "initSource",
		"asyncdatasource" : "asyncDataSource",
		"topparentid" : "topParentid",
		"openfloor" : "openFloor",
		"treetype" : "treeType",
		"showline" : "showLine",
		"showico" : "showIco",
		"rootvalue" : "rootValue",
		"currentId" : "currentId",
		"onlyselectedleaf" : "onlySelectedLeaf",
		"partchkvalue" : "partchkValue",
		"onlyleafvalue" : "onlyLeafValue",
		"customfields" : "customFields",
		"onnodeclick" : "onNodeClick",
		"onafterload" : "onAfterLoad",
		//tabs
		"allowcache" : "allowCache",
		"showclosebtn" : "showCloseBtn",
		"iconstyle" : "iconStyle",
		"iframewidth" : "iframeWidth",
		"iframeheight" : "iframeHeight",
		//chooselist
		"textfield" : "textField",
		"valuefield" : "valueField",
		"onlyleaf" : "onlyLeaf",
		"iscopy" : "isCopy",
		"ongetselecteditems" : "onGetSelectedItems",
		"ongetallitems" : "onGetAllItems",
		"onremoveitems" : "onRemoveItems",
		"onadditems" : "onAddItems",
		"ongettext" : "onGetText",
		"ongetvalue" : "onGetValue",
		"ongetitems" : "onGetItems",
		"onrefresh" : "onRefresh"
	}

});

fastDev.apply(fastDev, {
	/**
	 * 保存控件实例
	 * @method
	 * @param {String} id 实例ID
	 * @param {Object} instance 实例对象
	 * @member fastDev
	 */
	saveInstance : fastDev.Core.ControlBus.saveInstance,
	/**
	 * 获取控件实例
	 * @method
	 * @param {String} id
	 * @return {Object} 实例对象
	 * @member fastDev
	 */
	getInstance : fastDev.Core.ControlBus.getInstance,
	/**
	 * 保存队列实例
	 * @method
	 * @param {String} id 实例ID
	 * @param {Object} instance 队列对象
	 * @member fastDev
	 */
	saveQueue : fastDev.Core.ControlBus.saveQueue,
	/**
	 * 获取队列实例
	 * @method
	 * @param {String} id
	 * @return {Object} 队列对象
	 * @member fastDev
	 */
	getQueue : fastDev.Core.ControlBus.getQueue
}); 
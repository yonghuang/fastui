/**
 * @class fastDev.Ui.Select
 * @extends fastDev.Ui.Box
 * 下拉框组件，采用内置input和ul实现页面信息的录入、展现等功能，支持多选、单选。<p>
 * 注意事项：HTML定义下拉框控件时时，结构跟跟原生的标签一样，唯一不同的是子项文本定义不是&lt;option&gt;文本&lt;/option&gt;而是&lt;option text="文本"&gt;&lt;/option&gt;<p>
 * 作者：袁刚
 *
 *		<select itype="Select">
 *			<option value="data1">本地数据1</option>
 *			<option value="data2" selected>本地数据2</option>
 *			<option value="data3">本地数据3</option>
 *			<option value="data4">本地数据4</option>
 *		</select>
 */

/**
 * @event onBoxBlur
 * @private
 */
fastDev.define("fastDev.Ui.Select", {
	extend : "fastDev.Ui.Box",
	alias : "Select",
	_options : {
		/**
		 * @property {String} iwidth
		 * @private
		 */
		width : "150px",
		/**
		 * 下拉列表中可见选项的数目
		 * @type {Number}
		 */
		size : 1,
		/**
		 * 是否可选择多个选项
		 * @type {Boolean}
		 */
		multiple : false,
		/**
		 * 下拉列表的数据
		 * @type {JsonObject}
		 */
		items : null,
		/**
		 * 下拉列表默认选择值
		 * @type {String}
		 */
		value : "",
		/**
		 * 规定禁用该下拉列表
		 * @type {Boolean}
		 */
		disabled : false,
		/**
		 * 设定禁止的下拉列表值，用逗号隔开
		 * @type {Boolean}
		 */
		disabledItems : "",
		/**
		 * 下拉选项内容宽度
		 * @type {String}
		 */
		panelWidth : "auto",
		/**
		 * 是否只读
		 * @type {Boolean}
		 */
		readonly : false,
		/**
		 * 下拉选项内容层级
		 * @type {Number}
		 */
		zIndex : 200,
		/**
		 * 是否在当前Window作用域中显示下拉面板(改成false会将面板弹出至顶级窗口显示)
		 * @type {Boolean}
		 */
		inside : true,
		/**
		 * 下面面板弹出方向(auto、up、down) 
		 */
		direction : "auto",
		/**
		 * 下拉选项双击事件
		 * @event
		 * @param {Event} event
		 */
		onItemDblclick : fastDev.noop,
		enableDataSet : true,
		enableInitProxy : true,
		enableDataProxy : true
	},
	_global : {
		initFinish : false
	},
	template : [
		// 感应与显示区域模板
		'<tpl if(#{expand} != true)>', 
			'<div style="width:#{width}" class="ui-form">', 
				'<div class="ui-form-wrap ui-select">', 
					'<input type="text" id="#{id}" readonly="readonly" class="ui-form-field ui-form-input">', 
					'<div class="ui-form-trigger"><div class="ui-select-icon"></div></div>', 
				'</div>', 
			'</div>', 
		'</tpl>',
		// 下拉项容器模板
		'<tpl dynamic name=panel>', 
			'<div class="ui-select-list #{panelCls}" style="height: #{height}; z-index: #{zIndex}; width: #{panelWidth}; min-width: #{minWidth}; display:#{show}"></div>', 
		'</tpl>',
		// 下拉项内容模板
		'<tpl dynamic name=content>', 
			'<div class="ui-selectlist-list-ct">', 
				'<ul>', 
					'<tpl each>', 
						'<li class="ui-list-item" ivalue="{value}">{text}</li>', 
					'</tpl>', 
				'</ul>', 
			'</div>', 
		'</tpl>'
	],
	tplParam : ["id", "width", "height", "panelWidth", "minWidth", "expand", "show", "zIndex", "panelCls"],
	fields : [{
		name : "value",
		type : "String",
		defaultValue : "_empty"
	}, "text", {
		name : "selected",
		type : "Boolean",
		defaultValue : false
	}],
	/**
	 * 组件参数准备方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	ready : function(options, global) {
		var match, panelCls = "", width = options.width, panelWidth = options.panelWidth;
		// size属性大于1时，下拉框使用展开形态，展开形态下默认显示面板
		if(global.expand = options.size > 1) {
			global.show = "block";
			// 计算面板高度，每个下拉项高度为20px
			options.height = options.size * 20 + "px";
			panelWidth = panelWidth === "auto" ? width : panelWidth;
			options.inside = true;
			// 初始化当前选中节点
		} else {
			global.show = "none";
			// 下拉框需要面板浮动以及背景，下拉列表不要
			panelCls = "ui-layer ui-shadow";
		}
		global.currItems = {};
		global.panelCls = panelCls;

		// 计算面板宽度以及最小宽度
		width = (( match = /((?:\d*\.|)\d+(%?))/.exec(width)) ? match[1] : "150");

		options.width = match[2] ? width : width + "px";
		if(!match[2]) {
			if( match = /((?:\d*\.|)\d+)/.exec(panelWidth)) {
				global.minWidth = options.panelWidth = (+match[1] - 2) + "px";
			} else if(panelWidth === "auto") {
				global.minWidth = (width - 2) + "px";
			} else {
				global.minWidth = options.panelWidth = (width - 2) + "px";
			}
		}
		// 如果当前window对象就是顶层window，则不做跨级
		// 设定面板上下文
		global.panelContext = (options.inside = (options.inside === false && window.top === window) ? true : options.inside) ? window : window.top;
	},
	construct : function(options, global) {
		var container, domobj, context = global.panelContext;
		// 判断跨级时，顶级页面是否引用控件库
		// 如果没引用则取消跨级
		if(!context.fastDev) {
			global.panelContext = context = window;
			fastDev.log("Select", "construct", "顶层页面未加载控件库");
		}

		// 设定面板所在容器
		container = global.expand ? options.container : fastDev(context.document.body);
		// 根据面板模板生成DomObject对象
		global.panel = this.renderDynamicHtml(container, "panel", context, false);
		// 将面板归入当前控件统一管理
		this.merge(global.panel);
		// 修正面板索引，反正外部append方法改变面板所属容器
		this.correctElems(global);
	},
	/**
	 * 组件初始化方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	init : function(options, global) {
		// 下拉框不是展开形态则初始化感应区域
		if(!global.expand) {
			// 下拉框出面板感应区域
			global.inducArea = this.find(".ui-select");
			// 下拉框下拉图标
			global.icon = this.find(".ui-form-trigger");

			if(options.disabled === true) {
				// 暂时修改成相反用作判断，在disable方法中会被修正
				options.disabled = false;
				this.disable();
			} else {
				// 激活感应区域事件
				this.bindInducAreaEvent(global, options);
			}
		}

		// 失去焦点隐藏面板
		global.htmlClickHandle = fastDev.setFnInScopeByParam(this, this.htmlClickHandle, options, global);
		// 在当前窗体增加失去焦点隐藏面板功能
		fastDev("html").bind("click", global.htmlClickHandle);
		// 当下拉面板被弹出到顶层时，需要在顶层添加失去焦点隐藏面板事件
		if(options.inside === false) {
			// 在顶层窗体中增加失去焦点隐藏面板功能
			global.panelContext.fastDev("html").bind("click", global.htmlClickHandle);
			var unloadHandle = fastDev.setFnInScope(this, function() {
				global.panelContext.fastDev("html").unbind("click", global.htmlClickHandle);
				this.destroy();
			});
			// 下拉框主体被销毁时需要注销顶层窗口中绑定的失去焦点事件
			fastDev(window).bind("unload", unloadHandle);
		}
	},
	/**
	 * 绑定感应区域及其相关事件
	 * @private
	 */
	bindInducAreaEvent : function(global, options) {
		// 单击感应区域弹出下拉面板
		global.inducAreaClickHandle = fastDev.setFnInScope(this, this.showPanel);
		global.inducArea.bind("click", global.inducAreaClickHandle);
	},
	/**
	 * 解绑感应区域及其相关事件
	 * @private
	 */
	unbindInducAreaEvent : function(global) {
		global.inducArea.unbind("click", global.inducAreaClickHandle);
		fastDev("html").unbind("click", global.htmlClickHandle);
	},
	/**
	 * 绑定下拉面板事件
	 * @private
	 */
	bindPanelEvent : function(global, options) {
		if(options.disabled === true || options.readonly === true || global.panelEventReady === true) {
			return;
		}

		var panel = global.panel;
		// 下拉项双击事件
		global.panelDblclickHandle = fastDev.setFnInScopeByParam(this, this.panelDblclickHandle, options.onItemDblclick);
		// 鼠标悬停下拉项高亮事件
		global.panelMouseoverHandle = fastDev.setFnInScope(this, this.panelMouseoverHandle);
		// 单击选择下拉想事件
		global.panelClickHandle = fastDev.setFnInScope(this, this.panelClickHandle);
		if(!fastDev.isNoop(options.onItemDblclick)) {
			panel.bind("dblclick", global.panelDblclickHandle);
		}

		// 禁用处理
		if(options.disabled === true) {
			panel.addClass("ui-selectlist-disabled");
		} else {
			panel.bind("mouseover", global.panelMouseoverHandle);
			// 只读处理
			if(options.readonly === false) {
				panel.bind("click", global.panelClickHandle);
			}
		}
		global.panelEventReady = true;
	},
	/**
	 * 解绑下拉面板事件
	 * @private
	 */
	unbindPanelEvent : function(global) {
		var panel = global.panel;
		panel.unbind("dblclick", global.panelDblclickHandle);
		panel.unbind("mouseover", global.panelMouseoverHandle);
		panel.unbind("click", global.panelClickHandle);
		global.panelEventReady = false;
	},
	/**
	 * 单击非感应区域隐藏下拉面板
	 * @private
	 */
	htmlClickHandle : function(event, options, global) {
		if(global.expand === false && (global.inducArea.contains(event.target) || !fastDev.isValid(global.panel))) {
			return;
		}
		this.onSelectBlur(event, options.onblur, global);
	},
	/**
	 * 双击选择项事件
	 * @private
	 */
	panelDblclickHandle : function(event, handle) {
		if(event.target.tagName === "LI") {
			var item = fastDev(event.target);
			if(this._options.multiple === true &&this._global.expand === true){
				this._global.currItems[item.attr("ivalue")] = item;
			}else{
				this._global.currItems = {};
				this._global.currItems[item.attr("ivalue")] = item;
			}
			item.addClass("ui-list-selected");
			handle.call(this, event);
		}
	},
	/**
	 * 鼠标滑过下拉项高亮事件
	 * @private
	 */
	panelMouseoverHandle : function(event) {
		if(event.target.tagName === "LI") {
			this.find(".ui-list-over").removeClass("ui-list-over");
			var target = fastDev(event.target);
			if(!target.hasClass("ui-list-selected")) {
				target.addClass("ui-list-over");
			}
		}
	},
	/**
	 * 点击选择项事件
	 * @private
	 */
	panelClickHandle : function(event) {
		if(event.target.tagName === "LI") {
			var target = fastDev(event.target);
			if(target.hasClass("ui-list-disabled")) {
				return;
			}
			this.setValue(target.attr("ivalue"), true);
			this._global.focusState = true;
			if(!this._global.expand) {
				this.hidePanel();
			}
		}
	},
	/**
	 * 构造下拉项界面以及初始化相关属性和事件
	 * @private
	 */
	constructItems : function() {
		// 下拉框是展开形态时，下拉项面板容器由用户指定，否则下拉项容器为当前文档Body
		var value,
			options = this._options, 
			global = this._global, 
			initFinish = global.initFinish;
		
		if(fastDev.Browser.isIE8){
			value = ","+options.value + ",";
			this.dataset.update(function(index,data){
				if(value.indexOf(data.value) !== -1){
					return {selected : true};
				}
			});
		}
		
		// 调用父类方法构建下拉内容
		this.renderDynamicHtml(global.panel, "content", global.panelContext, true);
		// 绑定下拉面板事件
		if(options.disabledItems) {
			this.disableItems(options.disabledItems);
		}
		
		value = [];
		var selectedList = this.dataset.select(function(i, data) {
			return data.selected === true;
		});
		if(selectedList.length) {
			if(options.multiple === true) {
				for(var i = 0, item; item = selectedList[i]; i++) {
					value.push(item.value);
				}
			} else {
				value.push(selectedList.pop().value);
			}
			options.value = value.join(",");
			this.setValue(options.value);
		} else if(global.expand === false) {
			this.selectedDefault();
		}
		this.bindPanelEvent(global, options);
	},
	/**
	 * 修正动态模板创建的元素位置
	 * @private
	 */
	correctElems : function(global) {
		if(!global.initFinish && !global.expand) {
			this.elems[2] = this.elems[1];
			this.elems[1] = "none";
			global.initFinish = true;
		}
	},
	/**
	 * 显示内容面板
	 * @private
	 */
	showPanel : function(event) {
		var global = this._global, panel = global.panel, icon = global.icon, inducArea = global.inducArea;

		if(fastDev.isFunction(this._options.onclick)) {
			this._options.onclick.call(this, event);
		}
		// 定位下拉项面板
		this.fixedPosition();

		if(panel.isShow()) {
			return this.hidePanel();
		} else {
			panel.show();
			inducArea.addClass("ui-form-focus");
		}
		// 下拉图标高亮
		icon.addClass("ui-form-trigger-over");
		global.focusState = true;
	},
	/**
	 * 定位下拉面板
	 * @private
	 */
	fixedPosition : function() {
		var options = this._options, global = this._global, panelCss = {},
		// 获取面板高度
		panelHeight = parseInt(options.height, 10) || global.panel.height();

		if(!global.minWidth) {
			global.minWidth = fastDev(this.elems[0]).width() - 2 + "px";
			panelCss["min-width"] = global.minWidth;
		}

		if(fastDev.Browser.isIE6 && global.panel.width() < parseFloat(global.minWidth)) {
			panelCss.width = global.minWidth;
		}

		if(panelHeight < 20) {
			panelCss.height = "80px";
		}

		global.panel.css(panelCss);
		fastDev.Util.position.locate(global.panel, global.inducArea, global.panelContext,null,null,options.direction);
	},
	/**
	 * 隐藏内容面板
	 * @private
	 */
	hidePanel : function() {
		var global = this._global,
		// 下拉图标
		icon = global.icon,
		// 下拉项内容Div
		panel = global.panel;
		// 重置高亮为当前选中项
		panel.find(".ui-list-over").removeClass("ui-list-over");

		panel.hide();
		// 去除下拉图标高亮
		icon.removeClass("ui-form-trigger-over");
		global.inducArea.removeClass("ui-form-focus");
	},
	/**
	 * 获取当前选中项的值或者文本
	 * @private
	 */
	getProp : function(getValue) {
		var global = this._global, items = global.currItems, value = [];
		for(var p in items) {
			value.push(p === "_empty" ? "" : getValue ? p : items[p].getText());
		}
		value = value.join(",");
		return value === "_empty" ? "" : value;
	},
	/**
	 * 获取当前选中项的实际值
	 */
	getValue : function() {
		return this.getProp(true);
	},
	/**
	 * 获取当前选中项的文本值
	 */
	getText : function() {
		return this.getProp();
	},
	/**
	 * 设置当前选中项
	 * @param {String} values 下拉项实际值 (value / value1,value2,...)
	 */
	setValue : function(value, useChange) {
		var global = this._global, options = this._options, change = false, currItems = global.currItems;
		value = value || options.value;
		// 下拉项内容
		var panel = global.panel, valueList = (value + "").split(",");
		while(fastDev.isValid(( value = valueList.shift()))) {
			// 获取当前选中项对象
			var item = panel.find("[ivalue='" + value + "']"), highlight = true;
			if(item.isEmpty()) {
				continue;
			}
			// 移除鼠标滑过样式
			item.removeClass("ui-list-over");

			if(options.multiple === true && global.expand === true) {
				// 多选处理
				// 如果当前项已经被选中则判断此次操作为取消选中
				if(item.hasClass("ui-list-selected")) {
					item.removeClass("ui-list-selected");
					delete currItems[value];
					highlight = false;
				}
			} else {
				// 单选处理
				if(item.hasClass("ui-list-selected")) {
					continue;
				}
				// 移除上次选中项
				panel.find(".ui-list-selected").removeClass("ui-list-selected");
				for(var p in currItems) {
					delete currItems[p];
				}
				this.superClass.setValue.call(this, item.getText(), true);
			}
			if(highlight === true) {
				// 选中项高亮
				item.addClass("ui-list-selected");
				currItems[value] = item;
			}
			change = true;
		}
		// 值被鼠标操作改变时触发事件
		if(useChange === true) {
			if(change === useChange) {
				if(!fastDev.isNoop(options.onchange) && fastDev.isFunction(options.onchange)) {
					options.onchange.call(this, this.getValue(), this.getText());
				}
			}
			this.fire("focus");
		}

		return this;
	},
	/**
	 * 改变当前组件禁用/启用状态
	 * @private
	 */
	changeState : function(oper, method, disable) {
		var global = this._global, options = this._options, state = disable ? "disable" : "enable";

		// 目标状态与当前状态一致则当前操作无效
		if(options.disabled === disable) {
			return;
		}
		options.disabled = !options.disabled;

		if(global.expand) {
			this[oper+"PanelEvent"](global, options);
			global.panel[method]("ui-selectlist-disabled");
		} else {
			this[oper+"InducAreaEvent"](global, options);
			this.superClass[state].call(this);
		}
		fastDev("html")[oper]("click", global.htmlClickHandle);
		return this;
	},
	/**
	 * 启用当前组件(当组件被禁用时有效)
	 */
	enable : function() {
		return this.changeState("bind", "removeClass", false);
	},
	/**
	 * 禁用当前组件(当组件被启用时有效)
	 */
	disable : function() {
		return this.changeState("unbind", "addClass", true);
	},
	/**
	 * 设置当前组件是否只读
	 * @param {Boolean} [readonly=true] 是否只读
	 */
	setReadonly : function(readonly) {
		var global = this._global, options = this._options;
		// 目标状态与当前状态一致或者组件被禁用则当前操作无效
		if(options.readonly === ( readonly = readonly === false ? false : true) || options.disabled === true) {
			return;
		}

		options.readonly = readonly;
		var method = "bind";

		if(readonly) {
			method = "unbind";

		}
		global.panel[method]("click", global.panelClickHandle);
		return this;
	},
	/**
	 * 改变当前组件下拉项禁用/启用状态
	 * @param {String} values 待改变下拉项实际值
	 * @param {String} method 样式改变方法名称
	 * @private
	 */
	changeItemState : function(values, method) {
		var panel = this._global.panel;
		values = values.split(",");
		for(var i = 0, value; value = values[i]; i++) {
			panel.find("[ivalue='"+value+"']")[method]("ui-list-disabled");
		}
	},
	/**
	 * 禁用指定值的下拉项(下拉想被启用时有效)
	 * @param {String} values 待改变下拉项实际值 ( value / value1,value2,... )
	 */
	disableItems : function(values) {
		this.changeItemState(values, "addClass");
	},
	/**
	 * 启用指定值的下拉项(下拉想被禁用时有效)
	 * @param {String} values 待改变下拉项实际值 ( value / value1,value2,... )
	 */
	enableItems : function(values) {
		this.changeItemState(values, "removeClass");
	},
	/**
	 * 增加下拉项
	 * @param {JsonObject/Array[JsonObject]} items
	 */
	addItems : function(items) {
		// 数据兼容性处理
		if(!fastDev.isArray(items)) {
			items = [items];
		}
		var value = this.getValue();
		// 保存数据至数据集
		this.dataset.fill(items);
		// 重新初始化动态模板内容
		this.constructItems();
		// 重新设置当前选中项
		this.setValue(value);
	},
	/**
	 * 根据指定值删除下拉项
	 * @param {String} values 下拉项实际值 (value / value1,value2,...)
	 */
	removeItems : function(values) {
		var options = this._options, global = this._global, value, panel = global.panel, item;
		values = values.split(",");
		var currItems = global.currItems;

		while( value = values.shift()) {
			item = panel.find("[ivalue='" + value + "']");
			if(item.isEmpty()) {
				continue;
			}
			delete currItems[value];

			this.dataset.remove(this.removeData, value);

			if(options.multiple === false && item.hasClass("ui-list-selected")) {
				this.selectedDefault();
			}
			item.remove();
		}
	},
	/**
	 * @private
	 */
	removeData : function(index, data, value) {
		return data.value === value;
	},
	/**
	 * 获取所有子项
	 * @return {Array{JsonObject}}
	 */
	getItems : function() {
		return this.dataset.select();
	},
	/**
	 * 获取选中选项
	 * @return {Array{JsonObject}}
	 */
	getSelectedItem : function() {
		var result = [], items = this._global.currItems;
		for(var p in items) {
			result.push({
				value : p,
				text : items[p].getText()
			});
		}
		return result;
	},
	/**
	 * 清除当前可选项
	 * @type {Boolean} all 清除所有选项包括静态配置的选项
	 */
	clean : function(all) {
		// 重置数据集
		this.dataset.reset();
		
		if(all === true) {
			this.dataset.removeStaticData(function(i, item) {
				return item.value !== "_empty";
			});
		}
		
		// 删除当前选中值
		var global = this._global;
		global.currItems = {};
		if(!global.expand){
			global.panel.removeCss("height");
		}
		// 重新构建下拉项
		this.constructItems();
		return this;
	},
	/**
	 * 重置下拉框为空值状态
	 */
	reset : function() {
		this._global.currItems = {};
		this.find(".ui-list-selected").removeClass("ui-list-selected");
		if(!this._global.expand) {
			this.selectedDefault();
		}
	},
	/**
	 * 初始化默认选中项
	 * @private
	 */
	selectedDefault : function() {
		var record = this.dataset.get(0);
		this.setValue( record ? record.value : "");
	},
	/**
	 * 下拉框失去焦点事件
	 * @param {Function} handle
	 * @private
	 */
	onSelectBlur : function(event, handle, global) {
		var target = event.target, clickPanel = global.panel.contains(target), clickInducArea = global.expand ? false : global.inducArea.contains(target);

		if(global.focusState !== true) {
			return;
		} else if(global.focusState === true && !clickInducArea && !clickPanel) {
			if(!global.expand) {
				this.hidePanel();
			}
			handle.call(this, event);
			global.focusState = false;
		}
	},
	/**
	 * 控件销毁方法
	 */
	destroy : function() {
		fastDev("html").unbind("click", this._global.htmlClickHandle);
		this.superClass.destroy.call(this);
	},
	/**
	 * 子项上下移动的实现方法
	 * @private
	 */
	move : function(item, method, position) {
		if(fastDev.isValid(item)) {
			return item[method](item[position]());
		}

		var items = this._global.currItems;
		for(var p in items) {
			this.move(items[p], method, position);
		}
		return this;
	},
	/**
	 * 将当前选中项上移一位
	 */
	moveUp : function() {
		return this.move(null, "insertBefore", "prev");
	},
	/**
	 * 将当前选中项下移一位
	 */
	moveDown : function() {
		return this.move(null, "insertAfter", "next");
	},
	bind : function(type, handle, cover) {
		var m;
		if( m = /(change|blur|click)/.exec(type)) {
			if(cover !== false) {
				this._options["on" + m[1]] = handle;
			}
		} else {
			this.superClass.bind.call(this, type, handle);
		}
		return this;
	},
	/**
	 * 获取焦点时记录标志位
	 * @private
	 */
	onSelectFocus : function() {
		this._global.focusState = true;
	}
});

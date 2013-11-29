/**
 * @class fastDev.Ui.Button
 * @extends fastDev.Ui.Component
 * 按钮控件，支持链接按钮、图片按钮，图文按钮、文本按钮、下拉按钮等展示形式。继承自component基类，表单类控件。<p>
 * 作者：姜玲
 *
 *		 <div itype="Button" text="添加" iconCls="icon-add"></div>
 */
fastDev.define("fastDev.Ui.Button", {
	extend : "fastDev.Ui.Component",
	alias : "Button",
	_options : {
		/**
		 * 按钮文本
		 * @type {String}
		 */
		text : "",
		/**
		 * 按钮提示文本
		 * @type {String}
		 */
		tips:"",
		/**
		 * 按钮图标样式名，有常用添、删、改、查、打印样式，也可自行写其他样式
		 * @type {String}
		 * <p>icon-search、icon-add、icon-edit、icon-delete、icon-print为可选内置添、删、改、查、打印样式</p>
		 */
		iconCls : "",
		/**
		 * 按钮图标样式，如果只有一个样式，直接写“键:值”字符串，多个样式写json格式
		 * @type {String|jsonObj} 
		 */
		iconStyle : "",
		/**
		 * 图标位置left/top
		 * @type {String}
		 */
		iconPosition : "left",
		/**
		 * 超链接地址
		 * @type {String}
		 */
		href : "",
		/**
		 * 超链接弹出方式
		 * @type {String}
		 */
		target : "",
		/**
		 * 背景透明
		 * @type {Boolean}
		 */
		plain : false,
		/**
		 * 宽度
		 * @type {String}
		 */
		width : "",
		/**
		 * 是否禁用
		 * @type {Boolean}
		 */
		disabled:false,		
		/**
		 * 定义下拉条目，如果没定义则为普通的按钮
		 * @type {Object}
		 */
		subItems : null,
		/**
		 * 带下拉按钮在鼠标滑过出来时即弹出，否则点击按钮出来弹出
		 * @type {Boolean}
		 */
		showMenuOnMouseover : false,
		/**
		 * 按钮点击事件
		 * @event
		 */
		onclick : fastDev.noop,
		enableInitProxy : false,
		enableDataProxy : false
	},
	_global : {
		button : null,
		buttonText : null,
		buttonListText : null,
		btnBind:false
	},
	staticTemplate : function(params){
		var html = [], cls, textcls = "";
		if(params.plain){
			cls = "ui-button-plain ui-button-radius ";
		}else if(params.text === ""){
			cls = "ui-button-plain ui-button-radius";
			textcls = "ui-button-text-no";
		}else{
			cls = "ui-button-bg ui-button-radius ";
		}
		cls +=" "+ params.cls;
		html.push('<a class="ui-button ' + cls + '" id="'+params.id+'"><em class="ui-button-em"><span class="ui-button-text '+textcls+'" title="'+params.tips+'">'+params.text+'</span>');
		
		if(params.subItems){
			html.push('<span class="icon-arrow"></span>');
		}
		html.push('</em></a>');
		
		if(params.subItems){
			html.push('<div class="ui-button-list ui-shadow ui-hidden"></div>');
		}
		
		return html.join('');
	},
	dynamicTemplate : function(params,data){
		var html = [];
		for(var i=0,item;item=data[i];i++){
			html.push('<a><span class="ui-button-list-text">'+item.text+'</span></a>');
		}
		return html.join('');
	},
	tplParam : ["text","tips", "subItems", "plain","cls","width","id"],
	fields : ["text"],
	/**
	 * 参数准备
	 * @protected
	 */
	ready : function(options,global){
		if(options.subItems){
			options.enabledInitProxy = true;
		}	
	},
	/**
	 * 初始化方法
	 * @protected
	 */
	init : function(options, global) {
		var items = options.subItems;
		// 将外部配置的子项读入数据集并渲染至动态模板中
		if(items) {
			//this.dataset.setObjectify(false);	
			this.dataset.load(items);
			this._renderDynamicHtml(this.find(".ui-button-list"));
		}
		// 缓存常用Dom，避免重复查询
		var btn= this.find(".ui-button");
		this._global.button =btn;
		this._global.buttonText = this.find("[class^='ui-button-text']");
		this._global.buttonListText = this.find(".ui-button-list-text");
		// 样式功能初始化
		this.setIcon(options,global);
		this.setHref(options,global);
		if(options.width){
			 btn.children(".ui-button-em").css("width",options.width);
		}
		this.bindEvent(options,global);
		if(options.disabled){
			//options.disabled=false;
			this.disable();
		}
	},
	/**
	 * 设置图片
	 * @private
	 */
	setIcon : function(options,global) {
		var buttonText = global.buttonText, button = global.button;
		if(options.text && (options.iconCls || options.iconStyle)){
			buttonText.addClass("ui-button-icon");
		}
		if(options.iconCls){
			buttonText.addClass(options.iconCls);
		} 
		if(options.iconStyle){
			buttonText.css(options.iconStyle);
		}
		if(options.iconPosition === "top"){
			button.addClass("ui-button-ico-top");
		}
		if(options.style){
			button.css(options.style);
		}
	},
	/**
	 * 设置链接
	 * @private
	 */
	setHref : function(options,global) {
		var button = global.button;
		if(options.href){
			button.prop("href", options.href);
		}
		if(options.target){
			button.prop("target", options.target);
		}
	},
	/**
	 * 设置链接
	 * @param {string}
	 */
	setText : function(text){
		var button =this._global.buttonText;
		if(text){
			button.setText(text);
		}
	},
	/**
	 * 展示下拉按钮
	 * @private
	 */
	showButtonList : function(button, buttonList) {
		var offset = button.offset();
		buttonList.css("top", offset.top + button.outerHeight() - 1);
		buttonList.css("left", offset.left);
		buttonList.css("width", button.width());
		if(buttonList.isShow() === false){
			buttonList.show();
		}
	},
	/**
	 * 按钮事件
	 * @private
	 */
	bindEvent : function(options,global) {
		var me=this,buttonText = global.buttonText, button = global.button, buttonList = me.find(".ui-button-list"), buttonListText = global.buttonListText, buttonArrow = me.find(".icon-arrow"),overCls="ui-button-over",
		items = options.subItems, buttonem = global.button.find(".ui-button-em");
		if(items) {
			var itemlen = items.length;
			for(var i = 0; i < itemlen; i++) {
				var item = items[i];
				if(item.onclick){
					fastDev(buttonListText.elems[i]).bind("click", item.onclick);
				}
			}
		}
		if(options.iconPosition === "top"){
			overCls="ui-button-ico-top-over";
		}else if(options.cls!==""){
			var clsarr=options.cls.split(' ');
			var len=clsarr.length;
			if(len===1){
				overCls=options.cls+"-over";
			}else{
				overCls=clsarr[len-1]+"-over";
			}
		}
		//按钮鼠标滑入滑出样式改变事件
		var btnMouseOver = function(event) {
			//如果有子按钮，则将子按钮列表显示出来
			if(options.subItems && options.showMenuOnMouseover){
				me.showButtonList(button, buttonList);
			}
			if(button.hasClass(overCls) === false){
				button.addClass(overCls);
			}
		};
		var btnMouseOut = function(event) {
			if(!(options.subItems && buttonList.isShow())) {
				button.removeClass(overCls);
			}
		};
		button.bind("mouseover", btnMouseOver).bind("mouseout", btnMouseOut);
		// 下拉按钮鼠标滑入滑出样式改变事件
		var btnListTextMouseOver = function(event) {
			fastDev(event.target).addClass("ui-button-list-over");
		};
		var btnListTextMouseOut = function(event) {
			fastDev(event.target).removeClass("ui-button-list-over");
		};
		var bodyClick = function(event) {
			var target = fastDev(event.target);
			var btnanniu=fastDev(me.elems[0]);
			var tkey= target.parents("[eventkey]:first").attr("eventkey");
			var akey= btnanniu.attr("eventkey");
			if(tkey!==akey){
				button.removeClass(overCls);
				if(buttonList.isShow()){
					buttonList.hide();
				}
			}
		};
		if(options.onclick!== fastDev.noop){
			 global.btnBind=true;
		}
		var btnemClick=function(event){
			 options.onclick.call(me,event);			
		};		
		//按钮鼠标滑入滑出样式改变事件
		var btnClick = function(event) {
			//如果有子按钮，则将子按钮列表显示出来
			if(options.subItems){
				me.showButtonList(button, buttonList);
			}
		};		
		var body =fastDev(window);
		if(fastDev.Browser.isIE){
			 body =fastDev("body");
		}
		body.bind("click", bodyClick);
		if(options.subItems) {			
			if(global.btnBind) {
				buttonArrow.bind("click", btnClick);		
			} else {
				button.bind("click", btnClick);	
			}
			buttonText.bind("click", btnemClick);	
			buttonListText.bind("mouseover", btnListTextMouseOver).bind("mouseout", btnListTextMouseOut);
		}else{
			if(options.onclick!== fastDev.noop){
				buttonem.bind("click", btnemClick);
			}		
		}
	},
	/**
	 * 启用按钮
	 */
	enable : function() {
		var options=this._options;
		if(options.disable){
			var global=this._global, button = global.button, iconPosition = options.iconPosition,disabledCls="ui-button-disabled";
			if(iconPosition === "top") {
				disabledCls="ui-button-ico-top-disabled";
			} else if(options.cls!=="") {
				disabledCls=options.cls+"-disabled";
			}			
			if(button.hasClass(disabledCls)){
				button.removeClass(disabledCls);
			}			
			this.bindEvent(options,global);
			this._options.disable=false;
		}
	},
	/**
	 * 禁用控件
	 */
	disable : function() { 
		var options=this._options;
		if(!options.disable){
			var button = this._global.button, iconPosition = options.iconPosition,disabledCls="ui-button-disabled";
			if(iconPosition === "top") {
				disabledCls="ui-button-ico-top-disabled";
			} else if(options.cls!=="") {
				disabledCls=options.cls+"-disabled";
			}	
			if(!button.hasClass(disabledCls)){
				button.addClass(disabledCls);
			}	
			this.unbindClick();		
			options.disable=true;
		}
	},
	/**
	 * 解绑按钮事件
	 * @private
	 */
	unbindClick : function() {
		var options = this._options,global=this._global, items = options.subItems, buttonem = global.button.find(".ui-button-em"),buttonText=global.buttonText, buttonListText = global.buttonListText;
		if(options.onclick!== fastDev.noop){
		     buttonem.unbind("click");
			 buttonText.unbind("click");
		}		
		// 优化同bindClick方法
		if(items) {
			var itemlen = items.length;
			for(var i = 0; i < itemlen; i++) {
				var item = items[i];
				if(item.onclick){
					fastDev(buttonListText.elems[i]).unbind("click", item.onclick);
				}
			}
		}
	}
});

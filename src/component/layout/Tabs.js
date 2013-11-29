/**
 * @class fastDev.Ui.Tabs
 * @extends fastDev.Ui.Component
 * 选项卡控件，可ajax,iframe,div等三种模式展示选项卡内容。继承自component，导航类控件。<p>
 * 作者：姜玲
 *
 *		<div itype="Tabs" id="aaa" width="900px" saveInstance="true" height="350px" >
 *         <div title="baidu" url="http://www.baidu.com" showCloseBtn=true></div>
 *         <div title="Ajax" url="aa.html" type="ajax" showCloseBtn=true></div>
 *         <div title="Iframe" url="bb.html" showCloseBtn=true></div>
 *       </div>
 */
fastDev.define("fastDev.Ui.Tabs", {
	extend : "fastDev.Ui.Component",
	alias : "Tabs",
	_options : {
		/**
		 * 合法的json数据源
		 * @type {Json}
		 * title:"",--必须项
		 * url:"",id:"",selected:false,type:"iframe",allowCache:false,content:"",
		 * showCloseBtn:false,iconCls:"",iconStyle:"",iframeWidth,iframeHeight,width:88px
		 */
		items : "",
		/**
		 * 控件初始化合法的json数据源url
		 * @type {String}
		 */
		initSource : "",
		/**
		 * 控件id
		 * @type {String}
		 */
		id : "tab",
		/**
		 * 宽
		 * @type {String}
		 */
		width : "100%",
		/**
		 * 高
		 * @type {String}
		 */
		height : "100%",
		/**
		 * 右键菜单(暂未实现)
		 * @type {Array}
		 */
		tabMenu : null,
		/**
		 * 右侧工具栏
		 * @type {Array}
		 */
		tools : null,
		/**
		 * tab标题文本的对齐方式left/center/right/fit
		 * @type {String}
		 */
		tabAlign : "left",
		/**
		 * tab头部标题栏的定位方式left/right/top/bottom
		 * @type {String}
		 */
		tabPosition : "top",
		/**
		 * 是否允许双击关闭
		 * @type {Boolean}
		 */
		allowDblClickToClose : false,
		/**
		 * 是否允许拖动时改变tab项的位置
		 * @type {Boolean}
		 */
		allowDND : false,
		/**
		 * 选项卡的总宽度超长后的处理模式，有滚动和列表两种scroll/list模式 （暂未实现）
		 * @type {String}
		 */
		overWidthMode : "scroll",
		/**
		 * 默认打开第几个链接
		 * @type {Number}
		 */
		activeIndex : 0,
		/**
		 * 默认选中节点title
		 * @type {String}
		 */
		currentTitle : "",
		/**
		 * 控件内容展示方式iframe,ajax,div
		 * @type {String}[type="iframe"]
		 */
		type : "iframe",
		/**
		 * 允许缓存
		 * @type {Boolean}
		 */
		allowCache : false,
		/**
		 * 是否显示tab头，只保留body部分。
		 * @type {String}
		 */
		showHeader : true,
		/**
		 * true显示关闭按钮，允许tab关闭
		 * @type {Boolean}
		 */
		showCloseBtn : false,
		/**
		 * 标题图标样式类
		 * @type {String}
		 */
		iconCls : "",
		/**
		 * 控件在ie6下的显示模式控制，分iframe和tabs两种。如果为iframe，页面在同一个iframe中打开，没有tab的标签头，如果为tabs，则有标签头。在ie6下，tabs控件只有一个iframe。
		 * @type {String}
		 */
		ie6Mode : "iframe",
		/**
		 * 标题图标样式
		 * @type {String}
		 */
		iconStyle : "",
		defineMode : "js",
		autoRenderer : true,
		/**
		 * @event onTabClick
		 * 自定义点击事件
		 * @param {Object} 所点击的数据对象
		 */
		onTabClick : fastDev.noop,
		/**
		 * @event onBeforeClose
		 * 关闭前事件，可以通过return false阻止操作
		 * @param {Object} 所点击的数据对象
		 */
		onBeforeClose : fastDev.noop,
		/**
		 * @event onClose
		 * 关闭后事件
		 * @param {Object} 所点击的数据对象
		 */
		onClose : fastDev.noop,
		/**
		 * @event onTabMenu
		 * 右键弹出事件 暂未实现
		 * @param {Object} 所点击的数据对象
		 */
		onTabMenu : fastDev.noop,
		/**
		 * @event onTabLoad
		 * Tabs的initSource数据源请求加载完成后
		 */
		onTabLoad : fastDev.noop,
		/**
		 * @event onAdd
		 * 添加后
		 * @param {Object} 所添加的数据对象
		 */
		onAdd : fastDev.noop,
		/**
		 * @event onUpdate
		 * 更新后
		 * @param {Object} 所更新的数据对象
		 */
		onUpdate : fastDev.noop,
		/**
		 * @event onBeforeSelect
		 * 面板切换前发生，可以通过return false阻止操作
		 * @param {Object} 所点击的数据对象
		 */
		onBeforeSelect : fastDev.noop,
		/**
		 * @event onAfterSelect
		 * 面板切换完发生
		 * @param {Object} 所点击的数据对象
		 */
		onAfterSelect : fastDev.noop
	},
	_global : {
		bgclass : "",
		liobj : null,
		ie6Iframe : false
	},
	/* template: [
	 '<tpl dynamic>',
		'<table id="#{id}" border="0" cellpadding="0" cellspacing="0" class="ui-tab-table ui-tab-position-#{tabPosition}  ui-tab-align-#{tabAlign} #{bgclass}" style="width:#{width}; height:#{height}">',
		'<tpl if("#{tabPosition}"=="left" || "#{tabPosition}"=="right")>',	
			'<tr><td colspan="2" class="ui-tab-align"></td></tr>',
		'</tpl>',	
			'<tr>',
		'<tpl if("#{tabPosition}"=="bottom" || "#{tabPosition}"=="right")>',	
			'<td class="ui-tab-align ui-tab-other">',
			'<div class="ui-tab-content">',			 
			  '<tpl each>', 
				'<div id="{id}" class="ui-tab-panel" title="{title}" url="{url}" type="{type}" allowCache="{allowCache}" style="width: {iframeWidth}; height:{iframeHeight};',
				 '<tpl if({selected}!="true")>',	
				'display:none',
				'</tpl>',		
				  '">',
				  '<tpl if({type}=="iframe")>',
					'<iframe frameborder="0"></iframe>',
					'</tpl>',
				'</div>',		 
				'</tpl>',				
			 '</div>',			
			'</td>', 
		'</tpl>',		
		'<tpl if("#{tabPosition}"=="bottom")>',
			'</tr><tr>',
		'</tpl>',	
			'<td class="ui-tab-align">',
				'<div class="ui-tab-wrap" style="margin-left: 0px; margin-right: 0px;', 
				'<tpl if(!#{showHeader})>',	
				'display:none;',
				'</tpl>',					
		  '"><div class="ui-tab-scroller-left" style="display:none"></div>',
		  '<div class="ui-tab-scroller-right" style="display:none"></div>',
		  '<ul class="ui-tab ui-tab-bg">',	
		  '<tpl each>', 
			// 这些循环中的判断提出去放在ready方法中做掉
			'<li name="{id}" order="{row_id}" url="{url}" type="{type}" txt="{title}"',
			 '<tpl if({selected}=="true")>',	
				' class="ui-tab-selected"',
			  '</tpl>',
			'>',
			  '<a class="ui-tab-inner">',
			   '<tpl if({iconCls} || {iconStyle})>',
			     '<span class="ui-tab-icon {iconCls}" style="{iconStyle}"></span>',
			   '</tpl>',   
			  '<span class="ui-tab-text">{title}</span>',	  
			  '<tpl if({showCloseBtn}==true)>',
				 '<span class="ui-tab-close"></span>',
			  '</tpl>',
			  '</a>',			 
			  '<div class="ui-tab-left"></div>',
			  '<div class="ui-tab-right"></div>',
			'</li>',			
			'</tpl>',			
		  '</ul>',
		  '<div class="ui-tab-tool" id="ui-tab-tool_#{id}" style="display:none"></div>',
		'</div>',
			'</td>', 
		'<tpl if("#{tabPosition}"=="top")>',	
			'</tr><tr>',
		'</tpl>',		
		'<tpl if("#{tabPosition}"=="top" || "#{tabPosition}"=="left")>',	
			'<td class="ui-tab-align ui-tab-other">',
			'<div class="ui-tab-content">',
			  '<tpl each>',
				'<div id="{id}" class="ui-tab-panel" title="{title}" url="{url}" type="{type}" allowCache="{allowCache}" style="width: {iframeWidth}; height:{iframeHeight};',
				 '<tpl if({selected}!="true")>',	
				'display:none',
				'</tpl>',
				  '">',				  
				  '<tpl if({type}=="iframe")>', 
					'<iframe frameborder="0"></iframe>',
					'</tpl>',
				'</div>',		 
				'</tpl>',
			 '</div>',		
			'</td>', 
		'</tpl>',			
		'</tr></table>',	
		'</tpl>'
    ],*/
	tplParam : ["width", "height", "id", "tabPosition", "tabAlign", "showHeader", "type", "bgclass"],
	fields : ["title", {
		name : "url",
		defaultValue : ""
	}, {
		name : "type"
	}, {
		name : "allowCache"
	}, {
		name : "showCloseBtn"
	}, {
		name : "iconCls"
	}, {
		name : "iconStyle"
	}, {
		name : "id",
		defaultValue : ""
	}, {
		name : "selected",
		defaultValue : false
	}, {
		name : "iframeWidth",
		defaultValue : "100%"
	}, {
		name : "iframeHeight",
		defaultValue : "100%"
	}, {
		name : "width",
		defaultValue : "88px"
	}, "content"],
	staticTemplate : function(params) {
	 // return '<table id="'+params.id+'" border="0" cellpadding="0" cellspacing="0" class="ui-tab-table ui-tab-position-'+params.tabPosition+' ui-tab-align-'+params.tabAlign+' '+params.bgclass+'" style="width:'+params.width+'; height:'+params.height+'"></table>';
	 return '<div class="ui-tab-div-content"></div>';
	},
	dynamicTemplate : function(params,data){
		var html = [];
		html.push('<table id="'+params.id+'" border="0" cellpadding="0" cellspacing="0" class="ui-tab-table ui-tab-position-'+params.tabPosition+' ui-tab-align-'+params.tabAlign+' '+params.bgclass+'" style="width:'+params.width+'; height:'+params.height+'">');
		if(params.tabPosition==="left" || params.tabPosition==="right"){
			html.push('<tr><td colspan="2" class="ui-tab-align"></td></tr>');
		}
			html.push('<tr>');
		if(params.tabPosition==="bottom" || params.tabPosition==="right"){
			html.push('<td class="ui-tab-align ui-tab-other">');
			html.push('<div class="ui-tab-content">');
			  for(var i=0,item;item=data[i];i++){ 
				html.push('<div id="'+item.id+'" class="ui-tab-panel" title="'+item.title+'" url="'+item.url+'" type="'+item.type+'" allowCache="'+item.allowCache+'" style="width: '+item.iframeWidth+'; height:'+item.iframeHeight+';');
				 if(item.selected!=true){
				 html.push('display:none');
				 }
				  html.push('">');
				  if(item.type==="iframe"){
					html.push('<iframe frameborder="0"></iframe>');
				  }
				html.push('</div>');		 
				}
			 html.push('</div>');
			html.push('</td>');
		}		
		if(params.tabPosition==="bottom"){
			html.push('</tr><tr>');
		}
			html.push('<td class="ui-tab-align">');
				html.push('<div class="ui-tab-wrap" style="margin-left: 0px; margin-right: 0px;');
				if(!params.showHeader){	
				html.push('display:none;');
				}
		  html.push('"><div class="ui-tab-scroller-left" style="display:none"></div>');
		  html.push('<div class="ui-tab-scroller-right" style="display:none"></div>');
		  html.push('<ul class="ui-tab ui-tab-bg">');
		  for(var i=0,item;item=data[i];i++){
			html.push('<li name="'+item.id+'" order="'+i+'" url="'+item.url+'" type="'+item.type+'" txt="'+item.title+'"');
			 if(item.selected==true){
				html.push(' class="ui-tab-selected"');
			 }
			html.push('>');
			  html.push('<a class="ui-tab-inner">');
			   if(!!item.iconCls || !!item.iconStyle){
			     html.push('<span class="ui-tab-icon '+item.iconCls+'" style="'+item.iconStyle+'"></span>');
			   }
			  html.push('<span class="ui-tab-text">'+item.title+'</span>');
			  if(item.showCloseBtn==true){
				 html.push('<span class="ui-tab-close"></span>');
			  }
			  html.push('</a>');
			  html.push('<div class="ui-tab-left"></div>');
			  html.push('<div class="ui-tab-right"></div>');
			html.push('</li>');
		}
		  html.push('</ul>');
		  html.push('<div class="ui-tab-tool" id="ui-tab-tool_'+params.id+'" style="display:none"></div>');
		html.push('</div>');
			html.push('</td>');
		if(params.tabPosition==="top"){
			html.push('</tr><tr>');
		}
		if(params.tabPosition==="top" || params.tabPosition==="left"){
			html.push('<td class="ui-tab-align ui-tab-other">');
			html.push('<div class="ui-tab-content">');
			  for(var i=0,item;item=data[i];i++){
				html.push('<div id="'+item.id+'" class="ui-tab-panel" title="'+item.title+'" url="'+item.url+'" type="'+item.type+'" allowCache="'+item.allowCache+'" style="width: '+item.iframeWidth+'; height:'+item.iframeHeight+';');
				 if(item.selected!=true){
				 html.push('display:none');
				 }
				  html.push('">');
				    if(item.type==="iframe"){ 
					html.push('<iframe frameborder="0"></iframe>');
					}
				html.push('</div>');
				}
			 html.push('</div>');
			html.push('</td>');
		}
		html.push('</tr></table>');
		return html.join('');
	},
	addDynamicTemplateTitle:function(params,data){
		var html = [],i=this.dataset.select().length-1,item=data[0];
		html.push('<li name="'+item.id+'" order="'+i+'" url="'+item.url+'" type="'+item.type+'" txt="'+item.title+'" class="ui-tab-selected">');
		html.push('<a class="ui-tab-inner">');
		if(!!item.iconCls || !!item.iconStyle){
		    html.push('<span class="ui-tab-icon '+item.iconCls+'" style="'+item.iconStyle+'"></span>');
		}
		html.push('<span class="ui-tab-text">'+item.title+'</span>');
		if(item.showCloseBtn==true){
			html.push('<span class="ui-tab-close"></span>');
		}
		html.push('</a>');
		html.push('<div class="ui-tab-left"></div>');
		html.push('<div class="ui-tab-right"></div>');
		html.push('</li>');
		return html.join('');
	},
	addDynamicTemplateContent:function(params,data){
		var html = [],item=data[0];
		html.push('<div id="'+item.id+'" class="ui-tab-panel" title="'+item.title+'" url="'+item.url+'" type="'+item.type+'" allowCache="'+item.allowCache+'" style="width: '+item.iframeWidth+'; height:'+item.iframeHeight+';">');
		if(item.type==="iframe"){
			html.push('<iframe frameborder="0"></iframe>');
		}
		html.push('</div>');
		return html.join('');
	},
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {
		for(var i = 2; i < 6; i++) {
			this.fields[i].defaultValue = options[this.fields[i].name];
		}
		if(options.tabAlign === "left" && options.tabPosition === "top") {
			global.bgclass = "ui-tab-headerbg";
		}
		if(options.defineMode === "html") {
			options.autoRenderer = false;
		}
	},
	/**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	constructItems : function() {
		var options = this._options, data = this.dataset.select(function(i, item) {
			return item.type === "iframe";
		});
		if(fastDev.Browser.isIE6 && options.ie6Mode === "iframe" && data.length > 0) {
			this.createIframe();
		} else {
			////this.renderDynamicHtml();
			this._renderDynamicHtml(this.find(".ui-tab-div-content"));
			options.onTabLoad.call(this);
			this.setContent();
			this.setConstruct();
		}
	},
	createIframe : function() {
		var data = this.dataset.select(function(i, item) {
			return item.type === "iframe";
		});
		if(data.length === 0) {
			data = this.dataset.select(function(i, item) {
				return item.url !== "";
			});
		}
		var url = data[0].url, options = this._options, container = options.container;
		var height = options.height || container.height() + "px", width =options.width || container.width() + "px";
		var htmlStr = "<div id=\"" + options.id + "\"><iframe id=\"iframe" + options.id + "\" name=\"iframe" + options.id + "\" frameborder=\"0\" src=\"" + url + "\" style=\"width:" + width + "; height:" + height + ";\"></iframe></div>";
		var iframe = fastDev.Dom.createByHTML(htmlStr);
		container.children().remove();
		container.append(iframe);
		this._global.ie6Iframe = true;
	},
	getNameByUrl : function(url){
		var urls = url.split('/'),len=urls.length,
		urlname=urls[len-1].split('.')[0],lastml="";
		if(len>=2){
			lastml=urls[len-2];
		}
		return lastml+urlname;
	},
	/**
	 * 设置控件内容
	 * @private
	 */
	setContent : function() {
		var items = this.dataset.select(function(i, item) {
			return item.type === "div";
		}), len = items.length;
		for(var i = 0; i < len; i++) {
			this.find("[class='ui-tab-panel'][title='" + items[i].title + "']").append(items[i].content);
		}
	},
	/**
	 * 设置控件属性
	 * @private
	 */
	setConstruct : function() {
		var options = this._options;
		this.setSelected(options);
		this.createTools(options);
		this.setHeightWidth(options);
		this.setType();
		this.bindEvent();
	},
	/**
	 * 设置类型ajax的页面加载
	 * @private
	 */
	setType : function() {
		var divs = this.find("div.ui-tab-panel[type='ajax']").elems, len = divs.length, div, url, allowCache, completefc = function(rsp) {
			div.append(fastDev("<div>" + rsp.text + "</div>"));
		};
		for(var i = 0; i < len; i++) {
			div = fastDev(divs[i]);
			url = div.attr("url");
			allowCache = div.attr("allowCache");
			if(allowCache === "true" || div.children().elems.length < 1) {
				fastDev.Ajax.doGet(url, {
					complete : completefc
				});
			}
		}
	},
	/**
	 * 得到标题栏的总宽度
	 * @private
	 */
	getAllTitleWidth : function() {
		var data = this.dataset.select(), len = data.length, width = 2;
		for(var i = 0; i < len; i++) {
			width += parseFloat(data[i].width) + 2;
		}
		return width;
	},
	/**
	 * 设置宽高
	 * @private
	 */
	setHeightWidth : function(options) {
		var fn = fastDev.Util.StringUtil.stripUnits, parent = fastDev(options.container), paWidth = parent.width(),
		//pWidth =options.width,
		pHeight = parent.height(),
		//pHeight=options.height,
		wwidth = fastDev(window).width(), pWidth = Math.min(paWidth, wwidth), width = fn(options.width, pWidth),
		//html模式，先执行了创建操作，而非先将控件创建到页面上。。。所以无法得到titleHeight titleWidth
		titleHeight = (this.find("li:first").height() || 23) + 2, titleWidth = parseFloat(this.find("div.ui-tab-wrap").width()) || this.getAllTitleWidth(), height = fn(options.height, pHeight), divwidth = width, divheight = height;
		//		if(width===wwidth && fastDev.Browser.isIE6 ){
		//			width=width-10;
		//		}
		this.find("table.ui-tab-table").css({
			"width" : width + "px",
			"height" : height + "px"
		});

		if(options.tabPosition === "top" || options.tabPosition === "bottom") {
			divheight = height - parseFloat(titleHeight);
			this.find("div.ui-tab-wrap").css("width", width + 2 + "px");
			this.find("ul.ui-tab").css("height", "25px");
			//titleHeight
		} else {
			if(width > titleWidth) {
				divwidth = width - titleWidth;
				this.find("div.ui-tab-wrap .ui-tab-inner").css("width", titleWidth - 1 + "px");
			} else {
				divwidth = width - 68;
				this.find("div.ui-tab-wrap .ui-tab-inner").css("width", "68px");
			}
		}

		//this.find("ul.ui-tab").css("height","24px");
		if(options.tabAlign === "left" && options.tabPosition === "top") {
			var ulWidth = titleWidth;
			//this.getUlWidth();
			if(ulWidth > width) {
				this.find("ul.ui-tab").css("width", ulWidth + "px");
				this.find("div[class^='ui-tab-scroller-']").attr("show-scroller", "1");
			}
		}
		if(divheight > 0) {
			this.find("div.ui-tab-panel").css({
				"width" : divwidth + "px",
				"height" : divheight + "px"
			});
			this.find("iframe").css({
				"width" : divwidth + "px",
				"height" : divheight + "px"
			});
		}
	},
	/**
	 * 得到ui总宽度
	 * @private
	 */
	getUlWidth : function() {
		var liobj = this.find("li"), items = this.getliItemsAndSetLiLeft(liobj), width = 0, len = items.length;
		for(var i = 0; i < len; i++) {
			width = width + items[i].width + 4;
		}
		return width;
	},
	/**
	 * 得到tab的右边距，宽度，并设置li的右边局
	 * @private
	 */
	getliItemsAndSetLiLeft : function(liobj) {
		var li, A = liobj.elems, n = A.length, items = [];
		for(var k = 0; k < n; k += 1) {
			li = fastDev(A[k]);
			var item = {};
			item.order = li.attr("order");
			item.left = li.offset().left;
			li.css("left", item.left + "px");
			item.width = li.width();
			items = items.slice(0).concat(item);
		}
		liobj.css("position", "absolute");
		return items;
	},
	/**
	 * 创建工具栏
	 * @private
	 */
	createTools : function(options) {
		if(options.tools) {
			//var div = this.find("#ui-tab-tool_" + options.id);
			var div = this.find("div[id='ui-tab-tool_" + options.id + "']");
			for(var i = 0; i < options.tools.length; i++) {
				fastDev.create("Button", {
					container : div,
					text : options.tools[i].text,
					iconCls : options.tools[i].iconCls,
					onclick : options.tools[i].onclick
				});
			}
			this.find("div.ui-tab-tool").show();
		}
	},
	/**
	 * 设置选中项。数据里的 selected优先，currentTitle 次之，activeIndex最低。
	 * @private
	 */
	setSelected : function(options) {
		var selectedli = this.find("li.ui-tab-selected");
		if(selectedli.elems.length === 0) {
			if(options.currentTitle) {
				var currnode = this.find("li[txt='" + options.currentTitle + "']");
				if(currnode) {
					currnode.addClass("ui-tab-selected");
					this.find("div.ui-tab-panel[title='" + options.currentTitle + "']").css("display", "block");
				} else if(options.activeIndex > -1) {
					this.find("li:eq(" + options.activeIndex + ")").addClass("ui-tab-selected");
					this.find("div.ui-tab-panel:eq(" + options.activeIndex + ")").css("display", "block");
				}
			} else if(options.activeIndex > -1) {
				this.find("li:eq(" + options.activeIndex + ")").addClass("ui-tab-selected");
				this.find("div.ui-tab-panel:eq(" + options.activeIndex + ")").css("display", "block");
			}
		} else if(selectedli.elems.length > 1) {
			this.find("li.ui-tab-selected:gt(0)").removeClass("ui-tab-selected");
			this.find("div.ui-tab-panel:visible:gt(0)").css("display", "none");
		}
		//还要做点击后的url赋值操作
		var sedtxt = this.find("li.ui-tab-selected").attr("txt");
		this.setSrcByTxt(sedtxt);
	},
	/**
	 * 设置iframe的src
	 * @private
	 */
	setIframeSrc : function(iframe, iframesrc) {
		if(iframe.elems.length > 0 && !!iframesrc) {
			var src = iframe.attr("src");
			this.find("div.ui-tab-panel:visible").css("display", "none");
			iframe.parent("div").css("display", "block");
			if(src !== iframesrc) {
				iframe.prop("src", iframesrc);
				if(!iframe.attr("id")){
					var nameurl=this.getNameByUrl(iframesrc);
					iframe.attr("name",nameurl);				
					iframe.attr("id",nameurl);
				}
				//this.find(".ui-tab-panel").hide();
				//iframe.parent("div").show();
			}
		}
	},
	/**
	 * 根据title设置iframe的url
	 * @param {String} title
	 * @param {String} url
	 */
	setUrlByTitle : function(title, url) {
		if(this._global.ie6Iframe) {
			var iframe = fastDev("#" + this._options.id).find("iframe");
			var src = iframe.attr("src");
			if(src !== url) {
				iframe.prop("src", url);
			}
		} else {
			var panel = this.find("li[type='iframe'][txt='" + title + "']");
			if(panel.elems.length > 0) {
				panel.attr("url", url);
				this.setSrcByTxt(title);
			}
		}
	},
	/**
	 * 根据txt设置iframe的url
	 * @private
	 */
	setSrcByTxt : function(txt) {
		var panel = this.find("li[type='iframe'][txt='" + txt + "']"), iframe, iframesrc = panel.attr("url");
		if(panel.elems.length === 1) {
			if(fastDev.Browser.isIE6) {
				iframe = this.find("iframe:first");
				this.setIframeSrc(iframe, iframesrc);
			} else if(fastDev.Browser.isIE7) {
				var iframeNum = this.find("iframe").elems.length;
				if(iframeNum > 3) {
					iframe = this.find("iframe:first");
					this.setIframeSrc(iframe, iframesrc);
				} else {
					iframe = this.find("div.ui-tab-panel[type='iframe'][title='" + txt + "']").children("iframe");
					this.setIframeSrc(iframe, iframesrc);
				}
			} else {
				iframe = this.find("div.ui-tab-panel[type='iframe'][title='" + txt + "']").children("iframe");
				this.setIframeSrc(iframe, iframesrc);
			}
		}
	},
	/**
	 * 绑定事件
	 * @private
	 */
	bindEvent : function() {
		var me = this, liobj = this.find("li"), uldiv = fastDev(me.elems[0]), options = this._options;

		var closeMouseOver = function(event) {
			var evobj = fastDev(event.target);
			if(evobj.hasClass("ui-tab-close")) {
				evobj.addClass("ui-tab-close-over");
			}
		};
		var closeMouseOut = function(event) {
			var evobj = fastDev(event.target);
			if(evobj.hasClass("ui-tab-close")) {
				evobj.removeClass("ui-tab-close-over");
			}
		};
		this.find("[class^='ui-tab-close']").bind("mouseover", closeMouseOver).bind("mouseout", closeMouseOut);
		this.dargliEvent(options, liobj);
		this.scrollerliEvent(options, liobj);

		var liClick = function(event) {
			var evobj = fastDev(event.target), li = evobj.parents("li:first") || evobj, txt = li.attr("txt");
			if(evobj.hasClass("ui-tab-close")) {
				me.removeTab(txt);
			} else {
				me.find("li.ui-tab-selected").removeClass("ui-tab-selected");
				li.addClass("ui-tab-selected");
				me.find("div.ui-tab-panel:visible").css("display", "none");
				me.find("div.ui-tab-panel[title='" + txt + "']").css("display", "block");
				me.setSrcByTxt(txt);
				options.onTabClick.call(this, event, txt);
			}
		};
		var liDblclick = function(event) {
			var evobj = fastDev(event.target), li = evobj.parents("li:first") || evobj, txt = li.attr("txt");
			me.removeTab(txt);
		};
		//liobj.unbind("click");
		liobj.bind("mousedown", liClick);
		if(options.allowDblClickToClose) {
			liobj.bind("dblclick", liDblclick);
		}
	},
	/**
	 * 得到li最大的 right
	 * @private
	 */
	getMaxRight : function() {
		var con = this.find("li:last");
		//.elems;
		//var maxRight=0,len=liobj.length,con,firstLeft=0;
		//for(var i=0;i<len;i++){
		//con=fastDev(liobj[i]);
		var maxRight = con.position().left + con.width();
		//}
		return maxRight;
	},
	/**
	 * 左右两本的《》的事件
	 * @private
	 */
	scrollerliEvent : function(options, liobj) {
		// < >按钮鼠标滑入滑出样式改变事件
		var me = this, uileft, maxliright, uileft, move, scroller = me.find("div[show-scroller='1']"), scr1 = fastDev(scroller.elems[0]), scr2 = fastDev(scroller.elems[1]), tabsWidth = me.find("div.ui-tab-wrap").width();
		if(scroller.elems.length > 0) {
			var disabledScroller = function() {
				uileft = me.find("ul.ui-tab").position().left;
				maxliright = me.getMaxRight();
				//如果ul的left是负数，那么左边的可以点，否则不可以点
				if(uileft < 0) {
					scr1.removeClass("ui-tab-scroller-left-disabled");
				} else {
					scr1.addClass("ui-tab-scroller-left-disabled");
				}
				//如果最后一个的right大于整个的left，那么右边的可以点，否则不可以点
				if(maxliright + uileft > tabsWidth) {
					scr2.removeClass("ui-tab-scroller-right-disabled");
				} else {
					scr2.addClass("ui-tab-scroller-right-disabled");
				}
			};
			var scrollerMouseOver = function() {
				disabledScroller();
				me.find("li").removeCss("z-index");
				var src1disabled = scr1.hasClass("ui-tab-scroller-left-disabled");
				var scr2disabled = scr2.hasClass("ui-tab-scroller-right-disabled");
				if(!src1disabled || !scr2disabled) {
					scroller.css("display", "block");
					//if (options.allowDND === false) {
					//    options.allowDND = true;
					//    me.dargliEvent(options, me.find("li"));
					//}
				}
			};
			var scrollerMouseOut = function() {
				scroller.hide();
			};
			this.find("div.ui-tab-wrap").bind("mouseover", scrollerMouseOver).bind("mouseout", scrollerMouseOut);
			var li = me.find("ul.ui-tab>li").elems, lilen = li.length, moveWidth = 4;
			var move1 = function() {
				//<<每次移动值为 left大于ui-tab-wrap宽度-2的第一个li的left+width+4
				moveWidth = 92;
				//me.getMoveWidth(false);
				uileft = me.find("ul.ui-tab").position().left;
				if(moveWidth > 0 && uileft < 0) {
					scr2.removeClass("ui-tab-scroller-right-disabled");
					move = (uileft + moveWidth) > 0 ? 0 : (uileft + moveWidth);
					// me.find(".ui-tab").css("left",move+"px");
					me.find("ul.ui-tab").animate({
						left : move
					}, 200, "quad-easeInOut");
				} else {
					scr1.addClass("ui-tab-scroller-left-disabled");
					scrollerStop1();
				}
			};
			var move2 = function() {
				//>>每次移动值为 left大于0的第一个li的left+width+4
				moveWidth = 92;
				//me.getMoveWidth(true);
				uileft = me.find("ul.ui-tab").position().left;
				maxliright = me.getMaxRight();
				if(moveWidth > 0 && maxliright + uileft > tabsWidth) {
					scr1.removeClass("ui-tab-scroller-left-disabled");
					move = (uileft - moveWidth) > (tabsWidth - maxliright - 4) ? (uileft - moveWidth) : (tabsWidth - maxliright - 4);
					//  me.find(".ui-tab").css("left",move+"px");
					me.find("ul.ui-tab").animate({
						left : move
					}, 200, "quad-easeInOut");
				} else {
					scr2.addClass("ui-tab-scroller-right-disabled");
					scrollerStop2();
				}
			};
			var sMove1, sMove2;
			var scrollerMove1 = function() {
				move1();
				sMove1 = setInterval(move1, 500);
			};
			var scrollerMove2 = function() {
				move2();
				sMove2 = setInterval(move2, 500);
			};
			var scrollerStop1 = function() {
				clearInterval(sMove1);
			};
			var scrollerStop2 = function() {
				clearInterval(sMove2);
			};
			scr1.bind("mousedown", scrollerMove1).bind("mouseup", scrollerStop1);
			scr2.bind("mousedown", scrollerMove2).bind("mouseup", scrollerStop2);
		}
	},
	/**
	 * 得到移动区域的总宽度
	 * @private
	 */
	getMoveWidth : function(isLast) {
		//每次移动值为 left大于0或总宽度值的第一个li的left+width+4
		var liitems = this.getliItems(this.find("li")), li;
		var lileft, moveWidth = 4, tempWidth = 0, lileft;
		if(isLast) {
			tempWidth = this.find("div.ui-tab-wrap").width() - 2;
		}
		for(var i = 0; i < liitems.length; i++) {
			lileft = liitems[i].left;
			if((lileft + liitems[i].width) >= tempWidth) {
				li = liitems[i];
				break;
			}
		}
		if(li) {
			if(isLast) {
				moveWidth = lileft + li.width + 4 - tempWidth - 1;
			} else {
				moveWidth = Math.abs(lileft) + 4;
			}
			return moveWidth > 50 ? moveWidth : 50;
		} else {
			return 50;
		}
	},
	/**
	 * 得到某个li的left值
	 * @private
	 */
	getLeft : function(obj) {
		return parseInt(obj.css("left")) || fastDev(obj).offset().left;
	},
	/**
	 * 拖拽事件
	 * @private
	 */
	dargliEvent : function(options, liobj) {
		// var me = this,
		// liobj = this.find("li");
		if(options.allowDND && (options.tabPosition === "top" || options.tabPosition === "bottom")) {
			var liobj = this.find("li");
			fastDev.create("Draggable", {
				element : liobj,
				axis : "x",
				inside : true,
				ghost : false,
				oncreate : function() {
					for(var i = 0, elem, position; elem = liobj.elems[i++]; ) {
						( elem = fastDev(elem)).css({
							left : ( position = elem.position()).left,
							top : position.top
						});
					}
					liobj.css("position", "absolute");
				},
				onstart : function(event) {
					var firstTab = this.parent().find("li:first");
					this.elems[0]._tabWidth = this.outerWidth(true);
					this.elems[0]._minTabPosition = firstTab.elems[0]._tabPosition || firstTab.position();
					//this.elems[0]._tabWrapWidth = this.parent().parent().width();
					this.parent().parent().find("div[show-scroller='1']").hide();
				},
				ondrag : function(event, offsetX, offsetY) {
					var position = this.position(), nextTab = this.next("li"), prevTab = this.prev("li"), width = this.elems[0]._tabWidth, prevOffset = prevTab.position(), nextOffset = nextTab.position(), prevWidth = prevTab.outerWidth(true), nextWidth = nextTab.outerWidth(true), nextPosition = nextTab.hasElem() ? nextTab.elems[0]._tabPosition || nextOffset : {
						left : prevOffset.left + prevWidth
					}, prevPosition = prevTab.hasElem() ? prevTab.elems[0]._tabPosition || prevOffset : {
						left : this.elems[0]._minTabPosition.left
					};
					if(position.left < prevPosition.left + prevWidth / 2) {
						(prevTab.insertAfter(this).animate({
						left: position.left = nextPosition.left - (nextTab.hasElem() ? prevWidth : 0)
						}, 200, "quad-easeInOut").elems[0] || "")._tabPosition = position;
					} else if(position.left + width > nextPosition.left + nextWidth / 2) {
						(nextTab.insertBefore(this).animate({
						left: position.left = prevPosition.left + prevWidth
						}, 200, "quad-easeInOut").elems[0] || "")._tabPosition = position;
					}
				},
				onstop : function() {
					var nextTab = this.next("li"), prevTab = nextTab.hasElem() ? null : this.prev("li"), position = {};
					this.animate({
					left: position.left = Math.max(nextTab.hasElem() ? (nextTab.elems[0]._tabPosition || nextTab.position()).left - this.elems[0]._tabWidth : (prevTab.elems[0]._tabPosition || prevTab.position()).left + prevTab.outerWidth(true), this.elems[0]._minTabPosition.left)
					}, 200, "quad-easeInOut").elems[0]._tabPosition = position;
					return false;
				}
			});
		}
	},
	/**
	 * 得到li的left,width和order
	 * @private
	 */
	getliItems : function(liobj) {
		var li, A = liobj.elems, n = A.length, items = [];
		for(var k = 0; k < n; k += 1) {
			li = fastDev(A[k]);
			var item = {};
			item.order = li.attr("order");
			item.left = this.getLeft(li);
			item.width = li.width();
			items = items.slice(0).concat(item);
		}
		return items;
	},
	/**
	 * 重新加载
	 */
	reLoad : function(config, data) {
		this.initRefresh(config, data);
		this.setConstruct();
	},
	/**
	 * 得到当前title
	 * @return  {String} title
	 */
	getCurrentTitle : function() {
		var sed = this.find("li.ui-tab-selected"), title = "";
		if(sed.elems.length > 0) {
			title = sed.attr("txt");
		}
		return title;
	},
	/**
	 * 设置当前活动的title
	 * @param {String} title
	 */
	setActiveTabByTitle : function(title) {
		this.find("li.ui-tab-selected").removeClass("ui-tab-selected");
		this.find("div.ui-tab-panel").css("display", "none");
		var currnode = this.find("li[txt='" + title + "']");
		if(currnode) {
			currnode.addClass("ui-tab-selected");
			//if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7) {
				this.find("div.ui-tab-panel[title='" + title + "']").css("display", "block");
				this.setSrcByTxt(title);
			//} else {
				//this.find("div.ui-tab-panel[title='" + title + "']").css("display", "block");
			//}

		}
	},
	/**
	 * 添加选项卡
	 * @param {json} item
	 */
	addTab : function(item) {		
		var me = this, options = this._options;
		var tempds = this.dataset.select(function(i, data) {
			return data.title === item.title;
		});
		if(tempds.length > 0) {
			throw "“" + item.title + "”已经存在，不能重复添加。";
		}
		if(this._global.ie6Iframe || (fastDev.Browser.isIE6 && options.ie6Mode === "iframe")) {
			if(item.type !== "ajax" && item.type !== "div") {
				item.type = "iframe";
				this.dataset.remove(function(i, data) {
					return data.type === "iframe";
				});
				this.dataset.insert(item);
				var datalen = this.dataset.select().length;
				if(datalen === 1) {
					this.createIframe();
				}
				return;
			}
		}
		var currentTitle=item.title;
		options.currentTitle = currentTitle;
		this.dataset.insert(item);
		//这个是重新构建整个tabs,缺陷是首先打开的tab缓存没了，每次只打开了当前页面的iframe
		//this.constructItems();
		//这个才是添加
		var dataSet= this.dataset.select(function(i,item){
			return item.title===currentTitle;
		});
		var titleul = this.find("ul.ui-tab");		
		this._renderDynamicHtml(titleul,"addDynamicTemplateTitle",dataSet,false,window,false);
		var contentdiv=this.find("div.ui-tab-content");
		this._renderDynamicHtml(contentdiv,"addDynamicTemplateContent",dataSet,false,window,false);		
		this.setConstruct();
		this.setActiveTabByTitle(currentTitle);
		this._options.onAdd.call(me, currentTitle);
	},
	/*
	 * 获取指定选项卡数据
	 * @param {String} id
	 * @return  {Json} item
	 */
	getTabById : function(id) {
		var items = this.dataset.select(function(i,item){
			return item.id===id;
		});
		return items;
	},
	/*
	 * 获取指定选项卡数据
	 * @param {String} title
	 * @return  {Json} item
	 */
	getTabByTitle : function(title) {
		var items = this.dataset.select(function(i,item){
			return item.title===title;
		});
		if(items && items.length>0){
		return items[0];
		}
	},
	/*
	 * 更新指定选项卡
	 * @param {String} title
	 * @param {json} item
	 */
	updateTab : function(title, item) {
		var me = this;
		this.removeTab(title);
		this.addTab(item);
		this._options.onUpdate.call(me, item.title);
	},
	/*
	 * 清空指定选项卡的内容
	 * @param {String} title
	 */
	cleanContentByTitle : function(title) {
		var iframediv = this.find("div.ui-tab-panel[title='" + title + "']");
		if(iframediv.elems.length > 0) {
			var children = iframediv.children();
			children.remove();
		}
	},
	/*
	 * 得到指定选项卡（iframe类型）的iframe的id
	 * @param {String} title
	 */
	getIframeIDByTitle : function(title){
		var iframe=fastDev(".ui-tab-panel[title='"+title+"']").children("iframe");
		if(iframe.elems.length>0){
		return iframe.attr("id");
		}else{
		return "";
		}
	},
	/*
	 * 刷新指定选项卡（iframe类型）的页面内容
	 * @param {String} title
	 */
	refreshTabByTitle:function(title){
		var iframe=fastDev(".ui-tab-panel[title='"+title+"']").children("iframe");
		if(iframe.elems.length>0){
		  var src=iframe.attr("src"),url,id=fastDev.getID();
		  if(src.indexOf("?")>-1){
		  	  url=src+"&sj_"+id+"=1";
			}else{
			  url=src+"?sj_"+id+"=1";
			}			
			var panel = this.find("li[type='iframe'][txt='" + title + "']"); 
			panel.attr("url",url);
			iframe.attr("src",url);
		}
	},
	/*
	 * 添加指定选项卡的内容
	 * @param {String} title
	 * @param {String} content
	 */
	addContentByTitle : function(title, content) {
		var iframediv = this.find("div.ui-tab-panel[title='" + title + "']");
		if(iframediv.elems.length > 0) {
			var dom = fastDev.Dom.createByHTML(content);
			iframediv.append(dom);
		}
	},
	/*
	 * 设置指定选项卡的内容
	 * @param {String} title
	 * @param {String} content
	 */
	setContentByTitle : function(title, content) {
		var iframediv = this.find("div.ui-tab-panel[title='" + title + "']");
		if(iframediv.elems.length > 0) {
			var children = iframediv.children();
			children.remove();
			var dom = fastDev.Dom.createByHTML(content);
			iframediv.append(dom);
		}
	},
	/*
	 * 关闭指定选项卡项
	 * @param {String} title
	 */
	removeTab : function(title) {
		var options = this._options;
		if(fastDev.Browser.isIE6 && options.ie6Mode === "iframe"){
			if(options.onBeforeClose.call(this, title) !== false) {
				this.dataset.remove(function(i, data) {
					return data.title === title;
				});				
				try{
				document.getElementById("iframe"+options.id).src="about:blank";
				}catch(e){}
				try{
				document.getElementById("iframe"+options.id).location.href="about:blank";
				}catch(e){}
				options.onClose.call(this, title);
				return;
			}
		}
		if(this.find("li[txt='" + title + "']>a>.ui-tab-close").elems.length === 0) {
			return false;
		}
		if(options.onBeforeClose.call(this, title) !== false) {
			var prevTitle = this.find("li[txt='" + title + "']").prev("li").attr("txt");
			if(prevTitle === "") {
				prevTitle = this.find("li[txt='" + title + "']").next("li").attr("txt");
			}
			this.find("li[txt='" + title + "']").remove();
			//this.dataset.remove("title=" + title);
			this.dataset.remove(function(i, data) {
					return data.title === title;
				});
				
			this.find("div.ui-tab-panel[title='" + title + "']>iframe").attr("src", "");
			this.find("div.ui-tab-panel[title='" + title + "']").remove();
			!!prevTitle && this.setActiveTabByTitle(prevTitle);
			var liobj = this.find("li");
			liobj.removeAttr("style");
			this.dargliEvent(options, liobj);
			options.onClose.call(this, title);
		}
	},
	/*
	 * 关闭全部选项卡
	 */
	removeAll : function() {
		this.find("li").remove();
		this.find("div.ui-tab-panel").remove();
	},
	/*
	 * 关闭所有选项卡除当前
	 * @param {String} title
	 */
	removeAllBut : function(title) {
		if(!title) {
			title = this.getCurrentTitle();
		}
		if(title) {
			this.find("li[txt!='" + title + "']").remove();
			this.find("div.ui-tab-panel[title!='" + title + "']").remove();
			this.find("div.ui-tab-panel[title='" + title + "']").show();
		}
	},
	/*
	 * 设置容器大小
	 * @param {String} width
	 * @param {String} height
	 */
	resize : function(width, height) {
		var options = this._options;
		if(width) {
			options.width = width;
		}
		if(height) {
			options.height = height;
		}
		this.setHeightWidth(options);
	},
	/*
	 * 是否存在指定选项卡项
	 * @param {String} title
	 * @return  {Boolean}
	 */
	exists : function(title) {
		return this.find("li[txt='" + title + "']").elems.length > 0;
	}
}); 
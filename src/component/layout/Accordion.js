/**
 * @class fastDev.Ui.Accordion
 * @extends fastDev.Ui.Component
 * 手风琴控件是一个提供多个收缩展开功能的控件。由数个标题和及其具体内容组成。点击标题可以收缩或展开其内容。继承自Component，导航类控件。<p>
 * 作者：姜玲
 *
 *		<div itype="Accordion" >
 *			<div id="accordion1" text="文本">
 *                我们的名字...
 *			</div>
 *			<div id="accordion2" text="列表">
 *				<ul><li>第1条数据</li><li>第2条数据</li><li>第3条数据</li><li>第4条数据</li></ul>
 *			</div>
 *			<div id="accordion4" text="树">
 *			 <div itype="Tree"  initSource="data1.txt" showIco="true" topParentid="0" openFloor=2 ></div>
 *			</div>
 *		</div>
 */
fastDev.define("fastDev.Ui.Accordion", {
	extend : "fastDev.Ui.Component",
	alias : "Accordion",
	_options : {
		/**
		 * 合法的json数据源
		 * @type {Json}
		 * <p>手风琴:[{id:"accordion1",text:"1级菜单",content:"内容"},{id:"accordion2",text:"2级菜单"}]</p>
		 */
		items : null,
		/**
		 * 控件初始化合法的json数据源url
		 * @type {String}
		 */
		initSource : "",
		/**
		 * 默认选中节点id
		 * @type {String}
		 */
		currentNode : null,
		/**
		 * 是否展开所有节点
		 * @type {Boolean}
		 */
		showAll : false,
		/**
		 * 手风琴单击节点时每次打开一个节点，关闭其他的节点，设置此属性为true时不能同时设置showAll为true
		 * @type {Boolean}
		 */
		showOne : true,
		/**
		 * 高度
		 * @type {String}
		 */
		height : "100%",
		/**
		 * 宽度
		 * @type {String}
		 */
		width : "100%",
		/**
		 * 模式分最大内容高度模式和最小内容高度模式(maxContent/minContent)，只对手风琴控件有效。
		 * @type {String}
		 */
		mode : "maxContent",
		/**
		 * 默认打开第几个项,索引从0开始，代表第1个链接，-1为不打开
		 * @type {number}
		 */
		activeIndex : 0,
		/**
		 * @event onExpand
		 * 自定义展开事件
		 * @param {String} id
		 */
		onExpand : fastDev.noop,
		/**
		 * @event onCollect
		 * 自定义收缩事件 手风琴 导航
		 * @param {String} id
		 */
		onCollect : fastDev.noop,
		/**
		 * @event onItemClick
		 * 选中一个节点后触发
		 * @param {String} id
		 */
		onItemClick : fastDev.noop,
		/**
		 * @event onAdd
		 * 添加一个节点后触发
		 * @param {json}
		 */
		onAdd : fastDev.noop,
		/**
		 * @event onBeforeRemove
		 * 移除一个节点前，返回false不执行删除
		 * @param {String} id
		 */
		onBeforeRemove : fastDev.noop,
		/**
		 * @event onRemove
		 * 移除一个一个节点后
		 * @param {String} id
		 */
		onRemove : fastDev.noop
	},
	_global : {
		selected : "",
		isdisplay : "none",
		itemHeight : "",
		titleAllHeight : ""
	},
	/*template : [
		'<div class="ui-nav ui-accordion" style="width:#{width}; height:auto; float:left;">',
			'<div class="ui-nav-panle" style="width:#{width};">',
			'<tpl dynamic>',
			'<tpl each>',
				'<div class="ui-nav-item" name="{id}"><a class="#{selected}" style="height:26px;margin:0;padding:0;" >',
					'<div class="ui-nav-header">',
						'<div class="ui-nav-title" >{text}</div>',
						'<div class="ui-nav-header-ico"></div>',
						'<span class="ui-nav-arrow"></span>',
					'</div>',
				'</a>',
				'<div class="ui-nav-content" id="{id}" style="display: #{isdisplay};">',
				//'{content}',
				'</div>',
				'</div>',
			'</tpl>',
			'</tpl>',
			'</div>',
		'</div>'
		],*/		
	staticTemplate : function(params) {
	  return '<div class="ui-nav ui-accordion" style="width:'+params.width+'; height:auto; float:left;"><div class="ui-nav-panle" style="width:'+params.width+';"></div></div>';
	},
	dynamicTemplate : function(params,data){
		var html = [];
		for(var i=0,item;item=data[i];i++){
			html.push('<div class="ui-nav-item" name="'+item.id+'"><a class="'+params.selected+'" style="height:26px;margin:0;padding:0;" >');
					html.push('<div class="ui-nav-header">');
						html.push('<div class="ui-nav-title" >'+item.text+'</div>');
						html.push('<div class="ui-nav-header-ico"></div>');
						html.push('<span class="ui-nav-arrow"></span>');
					html.push('</div>');
				html.push('</a>');
				html.push('<div class="ui-nav-content" id="'+item.id+'" style="display: '+params.isdisplay+';">');
				//'{content}',
				html.push('</div>');
				html.push('</div>');
		}
		return html.join('');
	},
	tplParam : ["height", "selected", "isdisplay", "width"],
	fields : ["id", "text", "content"],
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {
		if(options.mode === "maxContent") {
			global.isdisplay = "block";
		}
		if(options.showAll) {
			global.selected = "ui-nav-selected";
			global.isdisplay = "block";
		}

	},
	/**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	constructItems : function() {
		//this.renderDynamicHtml();ui-nav-panle
		this._renderDynamicHtml(this.find(".ui-nav-panle"));	
		this.setContent();
		this.setConstruct();
		this.bindEvent();
	},
	/**
	 * 设置控件内容
	 * @private
	 */
	setContent : function() {
		var items = this.dataset.select(), len = items.length;
		this._global.titleAllHeight = len * 26;
		for(var i = 0; i < len; i++) {
			this.find("[class='ui-nav-content'][id='" + items[i].id + "']").append(items[i].content);
		}
	},
	/**
	 * 设置控件属性
	 * @private
	 */
	setConstruct : function() {
		var options = this._options, global = this._global, currentNode;
		this.setLastCls();
		//currentNode 优先。在currentNode没有值的情况下，才用活动索引。
		if(!options.showAll) {
			if(options.currentNode) {
				currentNode = this.find("div[name='" + options.currentNode + "']");
			} else if(options.activeIndex > -1) {
				currentNode = this.find(".ui-nav-item:eq(" + options.activeIndex + ")");
			}
			if(("" + options.height).indexOf("%") > 0) {
				var pHeight = fastDev(options.container).height();
				if(pHeight === 0) {
					pHeight = fastDev(window).height() - fastDev(options.container).offset().top;
				}
				options.height = fastDev.Util.StringUtil.stripUnits(options.height, pHeight - 1);
			}
			global.itemHeight = (parseFloat(options.height)) - global.titleAllHeight;
			if(currentNode) {
				this.setExpandCollect(currentNode, true);
			}
		}
	},
	/**
	 * 给尾部设置样式
	 * @private
	 */
	setLastCls : function() {
		this.find(".ui-nav-last").removeClass(".ui-nav-last");
		this.find(".ui-nav-item:last>a>.ui-nav-header").addClass("ui-nav-last");
	},
	/**
	 * 得到A
	 * @private
	 */
	getNavA : function(event) {
		var navA, evobj = fastDev(event.target);
		var className = evobj.getClass();
		if(evobj.hasClass("ui-nav-a") || evobj.hasClass("ui-nav-text")) {
			navA = evobj;
		} else if(evobj.hasClass("ui-nav-header")) {
			navA = evobj.parent("a");
		} else if(evobj.hasClass("ui-nav-item") || evobj.hasClass("ui-nav-inner")) {
			navA = evobj.children("a");
		} else if(/\sui-nav-(title|header-ico|arrow|arrow-default)\s/.test(" " + className + " ")) {
			navA = evobj.parent("div").parent("a");
		}
		return navA;
	},
	/**
	 * 设置div展开收缩与选中或没选中的样式
	 * @private
	 */
	setExpandCollect : function(divin, selected) {
		if(divin.hasClass("ui-nav-item") === false) {
			return false;
		}
		var options = this._options, itemHeight = this._global.itemHeight;
		if(selected) {
			if(!options.showAll && options.showOne) {
				var pdiv = divin.parent();
				if(options.mode === "maxContent") {
					//debugger;
					//var narh= fastDev(pdiv).find(".ui-nav-content[style!='display: block; height: 0px;']");
					//if(narh.elems.length===1){
					//	narh.animate({height : 0}, 200, "quad-easeInOut");
					//}else{
					//if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7 ){
					//	fastDev(pdiv).find(".ui-nav-content").css("height","0px");
					//	fastDev(pdiv).find(".ui-nav-content").css("display","none");
					//}else{
					fastDev(pdiv).find(".ui-nav-content").animate({
						height : 0
					}, 200, "expo-easeOut");
					//}
					//}
					//fastDev(pdiv).find(".ui-nav-content").css("height","0px");
				} else {
					fastDev(pdiv).find(".ui-nav-content").css("display", "none");
				}
				fastDev(pdiv).find(".ui-nav-selected").removeClass("ui-nav-selected");
				fastDev(pdiv).find(".ui-nav-inner-seleted").removeClass("ui-nav-inner-seleted");
			}
			if(options.mode === "maxContent" && !options.showAll) {
				//debugger;
				//divin.find(".ui-nav-content:first").css("display","block");
				//divin.find(".ui-nav-content:first").css({"height":"0px"});
				//divin.find(".ui-nav-content:first").css({"height":itemHeight+"px"});
				//if(){
				///	divin.find(".ui-nav-content:first").css({"height":itemHeight+"px"});
				//	divin.find(".ui-nav-content:first").css("display","block");
				//}else{
				divin.find(".ui-nav-content:first").animate({
					height : itemHeight
				}, 200, "expo-easeOut");
				//}
			} else {
				divin.find(".ui-nav-content:first").css("display", "block");
			}
			divin.find("a:first").addClass("ui-nav-selected");
			options.onExpand.call(this, divin.attr("name"));
		} else {
			if(options.mode === "maxContent" && !options.showAll) {
				//debugger;
				divin.find(".ui-nav-content:first").animate({
					height : 0
				}, 200, "expo-easeOut");
				//divin.find(".ui-nav-content:first").css("display","none");
			} else {
				divin.find(".ui-nav-content:first").css("display", "none");
			}
			divin.find("a:first").removeClass("ui-nav-selected");
			options.onCollect.call(this, divin.attr("name"));
		}
	},
	/**
	 * 绑定事件
	 * @private
	 */
	bindEvent : function() {
		var me = this, navPanle = fastDev(me.elems[0]);
		var navPanleClick = function(event) {
			var anchor = me.getNavA(event);
			if(anchor) {
				var divin = anchor.parent("div");
				var divcon = anchor.next();
				me.setDivClick(divcon, divin, event);
			}
		};
		navPanle.unbind("click");
		navPanle.bind("click", navPanleClick);
	},
	/**
	 * 设置项的点击事件
	 * @private
	 */
	setDivClick : function(divcon, divin, event) {
		//debugger;
		var displayEx = true;
		if(this._options.mode === "maxContent" && !this._options.showAll) {
			displayEx = false;
		}
		if((displayEx && divcon.isShow()) || (!displayEx && divcon.parent().find(".ui-nav-content").css("height") !== "0px")) {
			this.setExpandCollect(divin, false);
		} else {
			this.setExpandCollect(divin, true);
		}
		this._options.onItemClick.call(this, event, divin.attr("name"));
	},
	/**
	 *得到当前展开的节点,返回选择节点ID（需showOne=true时）
	 */
	getSelected : function() {
		var options = this._options, currentid = "";
		if(options.showOne) {
			currentid = this.find(".ui-nav-selected").parent().attr("name");
		}
		return currentid;
	},
	/**
	 * 手风琴添加一个节点
	 * @param {Array} item
	 */
	addItem : function(item) {
		var tempds = this.dataset.select(function(i, data) {
			return data.id === item.id;
		});
		if(tempds.length > 0) {
			fastDev.error("Accordion", "addItem", "id为" + item.id + "的数据已经存在");
			return;
		}
		if(item.content) {
			item.content = fastDev("<div>" + item.content + "</div>");
		}
		this.dataset.insert(item);
		var dataSet = this.dataset.select(function(i, data) {
			return data.id === item.id;
		});
		if(dataSet.length > 0) {
			//var fragment = this.initDynamicHtml(null, dataSet);
			//var fragment = this.appendDynamicHTML
			var iddiv = this.find(".ui-nav-panle");
			this._renderDynamicHtml(iddiv,"dynamicTemplate",dataSet,false,window,false);
			//this.appendDynamicHTML(null,dataSet);
			//var iddiv = this.find(".ui-nav-panle");
			//iddiv.append(fragment);
			this._options.currentNode = item.id;
			this.setContent();
			this.setConstruct();
			////this.constructItems();
			this._options.onAdd.call(this, item);
		}
	},
	/**
	 * 手风琴移除一个节点
	 * @param {String} id
	 */
	removeItem : function(id) {
		var options = this._options;
		//if(options.onBeforeRemove!==fastDev.noop){
		if(options.onBeforeRemove.call(this, id) === false) {
			return false;
		}
		//}
		this.dataset.remove(function(i, data) {
			return data.id === id;
		});
		this.find("[name='" + id + "']").remove();
		this.setLastCls();
		options.onRemove.call(this, id);
	},
	/**
	 * 重新加载
	 */
	reLoad : function(config, data) {
		this.initRefresh(config, data);
	}
});

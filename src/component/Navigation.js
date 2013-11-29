/**
 * @class  fastDev.Ui.Navigation
 * @extends fastDev.Ui.Accordion
 * 导航控件是支持多级功能导航控件，设计最多支持5级，手风琴主要是内容的收缩、展开显示的功能，导航控件主要是应用与左侧纵向的功能导航。继承自Accordion，导航类控件。<p>
 * 作者：姜玲
 *
 *			<div itype="Navigation" width="260px" activeIndex=2 initSource="data.txt"  target="main"></div>
 */
fastDev.define("fastDev.Ui.Navigation", {
	extend : "fastDev.Ui.Accordion",
	alias : "Navigation",
	_options : {
		/**
		 * 合法的json数据源 
		 * @type {Json}
		 * <p>纵向导航:[{id:"1","pid":"-1","text":"1级菜单可收缩","ico":"classname"},{id:"12","pid":"1","text":"12级菜单","url":"http://www.baidu.com","target":"_blank"}]</p>
		 */
		items : null,
		/**
		 * 所以链接指向哪儿的打开方式，同a标记的target属性
		 * @type {String}
		 */
		target : null,
		/**
		 * 顶级节点的Group值
		 * @type {String}
		 */
		topGroup : "-1",
		/**
		 * 自定义数据属性,不能和原有属性名相同
		 * @type {String}多个用,分隔
		 */
		customFields:"",		
		/**
		 * 是否打开当前或第一个链接页面
		 * @type {Boolean}
		 */
		autoOpenPage : false
	},
	_global : {
		level:1,
		idAllChild:false,
		selected:"",
		isdisplay:"none",
		newData:[]
	},
	/*template : [
		'<div class="ui-nav" style="width:#{width}; height:auto; float:left;">',
			'<div class="ui-nav-panle" style="width:#{width};">',
				'<tpl dynamic>', 
					'<tpl each>',
						'<tpl if(#{idAllChild})>',
							'<div class="ui-nav-inner" name="{id}">',
								'<a class="ui-nav-text',
								'<tpl if({ico}!="")>',
								' ui-nav-ico {ico}',
								'</tpl>',
								'"',
								'<tpl if({url})>',
								 ' href="{url}" target="{target}"',
								 '</tpl>',	
								 '>{text}</a>',
				             '</div>',
						'<tpl else>',
						    '<div class="ui-nav-item',
							'<tpl if(#{level}&gt;1)>',	
								' ui-nav-#{level}thstage',
							'</tpl>',				
							'" name="{id}">', 
							  '<a class="#{selected}" ',
								'<tpl if({url})>',
								 ' href="{url}" target="{target}"',
								 '</tpl>',	
								 '>',
							'<div class="ui-nav-header">',
								'<div class="ui-nav-title" >{text}</div>',
								'<div class="ui-nav-header-ico {ico}"></div>', 
								'<span class="ui-nav-arrow"></span>', 
							'</div>', 
							'</a>',
							'<div class="ui-nav-content" id="{id}" style="display: #{isdisplay};width:#{width};">',									
							'</div>',
						'</tpl>',
						'</div>',
					'</tpl>',
				'</tpl>',
			'</div>',
		'</div>'	
	],*/
	tplParam : ["height","width","selected","isdisplay"],
	fields : ["id","pid","text",{name:"url",defaultValue:""},{name:"target",defaultValue:""},{name:"ico",defaultValue:""}],	
	staticTemplate : function(params) {
	  return '<div class="ui-nav" style="width:'+params.width+'; height:auto; float:left;"><div class="ui-nav-panle" style="width:'+params.width+';"></div></div>';
	},
	dynamicTemplate : function(params,data){
		var html = [],idAllChild=this._global.idAllChild,level=this._global.level;
		for(var i=0,item;item=data[i];i++){
			if(idAllChild){
							html.push('<div class="ui-nav-inner" name="'+item.id+'">');
								html.push('<a class="ui-nav-text');
								if(!!item.ico){
								 html.push(' ui-nav-ico '+item.ico+'');
							    }
								html.push('"');
								if(!!item.url){
								 html.push(' href="'+item.url+'" target="'+item.target+'"');
								}	
								html.push('>'+item.text+'</a>');
				             html.push('</div>');
				            }else{
						    html.push('<div class="ui-nav-item');							
							if(level>1){	
								html.push(' ui-nav-'+level+'thstage');
							}											
							html.push('" name="'+item.id+'">');
							  html.push('<a class="'+params.selected+'" ');
								if(!!item.url){
								 html.push(' href="'+item.url+'" target="'+item.target+'"');
								}
								 html.push('>');
							html.push('<div class="ui-nav-header">');
								html.push('<div class="ui-nav-title" >'+item.text+'</div>');
								html.push('<div class="ui-nav-header-ico '+item.ico+'"></div>');
								html.push('<span class="ui-nav-arrow"></span>'); 
							html.push('</div>'); 
							html.push('</a>');
							html.push('<div class="ui-nav-content" id="'+item.id+'" style="display: '+params.isdisplay+';width:'+params.width+';">');									
							html.push('</div>');		
							html.push('</div>');				
						}
				
		}
		return html.join('');
	},
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {		
		if(options.mode==="maxContent"){
			global.isdisplay="none";
		}
		if(options.showAll){
			global.selected="ui-nav-selected";
			global.isdisplay="block";	
		}		
		if(options.customFields){			
			this.fields =this.fields.slice(0).concat(options.customFields.split(','));
		}		
	},
	/**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	constructItems : function() {
		var me = this,options=this._options;
		//var dataSet=this.dataset.select("pid="+options.topGroup);
		var dataSet = this.dataset.select(function(i, data) {
			return data.pid === options.topGroup;
		});
		
		//this.renderDynamicHtml(null,dataSet);
		this._renderDynamicHtml(this.find(".ui-nav-panle"),dataSet);
		var level=this._global.level;
		for(var i=0;i<dataSet.length;i++){
			me.constructSubItem(dataSet[i].id,level+1);
		}
		this.setConstruct();
		this.bindEvent();
	},
	/**
	 * 创建纵向导航的子项
	 * @private
	 */
	constructSubItem : function(id,level){		
		var me=this,global=this._global,//dataSet=this.dataset.select("pid="+id);
		dataSet = this.dataset.select(function(i, data) {
			return data.pid === id;
		});
		if(dataSet && dataSet.length>0){
			//this.template._options.params.level=level;
			//this.template._options.params.idAllChild=this.getIdAllChild(dataSet);
			//var fragment = this.initDynamicHtml(null,dataSet);
			global.level=level;
			global.idAllChild=this.getIdAllChild(dataSet);
			//var fragment =this.dynamicTemplate(tplParam,dataSet);
			var iddiv = this.find("#"+id);
			this._renderDynamicHtml(iddiv,dataSet);
			//iddiv.append(fragment);
			if(!global.idAllChild){
				var divlist=iddiv.find(".ui-nav-content").elems;
				for(var i=0;i<divlist.length;i++){
					me.constructSubItem(fastDev(divlist[i]).prop("id"),level+1);
				}
			}
		}
	},
	/**
	 * 得到是否全部都是带链接的子级
	 * @private
	 */
	getIdAllChild:function(dataSet){	
		var len=0,len2=0,length=0,ds;
		for(var i=0;i<dataSet.length;i++) {
			if(!dataSet[i].url){
				len+=1;
			}
			ds = this.dataset.select(function(j, data) {
			return data.pid === dataSet[i].id;
		    });
		    length=ds.length;
			if(length===0){
				len2+=1;
			}
		}	
		if((len+len2)===0 || len===0){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 给尾部设置样式
	 * @private
	 */	
	setLastCls:function(){
		this.find(".ui-nav-last").removeClass(".ui-nav-last");
		this.find(".ui-nav-panle>a>.ui-nav-item:last>a>.ui-nav-header").addClass("ui-nav-last");
	},
	/**
	 * 设置控件属性
	 * @private
	 */
	setConstruct : function() {
		var options = this._options;		
		this.setLastCls();
		//currentNode 优先。在currentNode没有值的情况下，才用活动索引。
		if(options.currentNode){
			this.find("div[name='"+options.currentNode+"']").attr("current","1");
		}else if(options.activeIndex>-1){
			this.find(".ui-nav-text:eq("+options.activeIndex+")").parent("div").attr("current","1");					
		}	
		if(options.target){
			this.find("a[href!=''][target='']").prop("target",options.target);
		}
		if(options.autoOpenPage){
			this.openCurrentPage();
		}
		//设置节点的展开收缩
		if(!options.showAll){
			this.setCurrentExpand();
		}
		this.find(".ui-nav-content:empty").height("0px");
		this.find(".ui-nav-content:empty").prev("a").find(".ui-nav-arrow").attr("class",".ui-nav-kong");
	},
	/**
	 * 打开当前节点的链接
	 * @private
	 */
	openCurrentPage:function(){
		var ec = this.find("[current='1']");
		var href = ec.find("a:first").prop("href");
		var target = ec.find("a:first").prop("target");
		if(href && href !== "" && target) {
			window.open(href, target);
		}
	},
	/**
	 * 设置div展开收缩与选中或没选中的样式
	 * @private
	 */
	setExpandCollect:function(divin,selected){
		if(divin.hasClass("ui-nav-item")===false){
			return false;
		}
		var options=this._options,itemHeight=this._global.itemHeight;
		if(selected){
			if(!options.showAll && options.showOne){
				var pdiv=divin.parent();
				fastDev(pdiv).find(".ui-nav-content").css("display","none");
				fastDev(pdiv).find(".ui-nav-selected").removeClass("ui-nav-selected");
				fastDev(pdiv).find(".ui-nav-inner-seleted").removeClass("ui-nav-inner-seleted");
				if(options.mode==="maxContent"){
					 divin.find(".ui-nav-content:first").css({"height":itemHeight+"px"});
				}
			}
			divin.find(".ui-nav-content:first").css("display","block");
			divin.find("a:first").addClass("ui-nav-selected");			 
			options.onExpand.call(this,divin.attr("name"));
		}else{
			divin.find(".ui-nav-content:first").css("display","none");
			divin.find("a:first").removeClass("ui-nav-selected");
			options.onCollect.call(this,divin.attr("name"));
		}	
	},	
	/**
	 * 设置项的点击事件
	 * @private
	 */
	setDivClick:function(divcon,divin,event){		
		var me=this;								
		if(divcon.isShow()){						
			this.setExpandCollect(divin,false);
		}else{						
			this.setExpandCollect(divin,true);
		}
		var content=divin.find(".ui-nav-content:first");
		var len=content.elems.length,len2=0;
		if(len>0){
			len2=content.children().elems.length;
		}
		if(len===0 || len2===0){
			if(this._options.onItemClick.call(me,event,divin.attr("name"))===false){
				divin.children("a").removeAttr("href");
				return false;
			}
		}
	},
	/**
	 * 设置当前节点的展开
	 * @private
	 */
	setCurrentExpand:function(){		
		var currentdiv=this.find("[current='1']").elems;
		if(currentdiv.length>0){
			var currdiv=fastDev(currentdiv);
			if(currdiv.hasClass("ui-nav-inner")){
				currdiv.addClass("ui-nav-inner-seleted");
			}
			currdiv.parents(".ui-nav-content").show();
			currdiv.parents(".ui-nav-content").prev().addClass("ui-nav-selected");
		}
		this.find("[current='1']").removeAttr("current");
	},		
	/**
	 * 得到ui-nav-inner
	 * @private
	 */
	getNavInner : function(event) {
			var navInner, evobj = fastDev(event.target);
			if(evobj.hasClass("ui-nav-text")) {
				navInner = evobj.parent("div");
			} else if(evobj.hasClass("ui-nav-inner")) {
				navInner = evobj;
			}
			return navInner;
	},		
	/**
	 * 绑定事件
	 * @private
	 */
	bindEvent : function() {
		var me = this,navinner=this.find(".ui-nav-inner"),navPanle=this.find(".ui-nav-panle");
		//按钮鼠标滑入滑出样式改变事件
		var navInnerMouseOver = function(event) {
			var navInner = me.getNavInner(event);
			if(navInner && navInner.hasClass("ui-nav-inner-over") === false){
				navInner.addClass("ui-nav-inner-over");
			}
		};
		var navInnerMouseOut = function(event) {
			var navInner = me.getNavInner(event);
			if(navInner){
				navInner.removeClass("ui-nav-inner-over");
			}
		};
		navinner.unbind("mouseover");
		navinner.unbind("mouseout");
		navinner.bind("mouseover", navInnerMouseOver).bind("mouseout", navInnerMouseOut);		
		var navPanleClick = function(event) {
			var anchor = me.getNavA(event);
			if(anchor) {
				var divin=anchor.parent("div");		
				if(anchor.hasClass("ui-nav-text")){
					me.find(".ui-nav-inner-seleted").removeClass("ui-nav-inner-seleted");
					divin.addClass("ui-nav-inner-seleted");
					if(me._options.onItemClick.call(me,event,divin.attr("name"))===false){
						anchor.removeAttr("href");
						return false;
					}
				}else{
				    var divcon=anchor.next();
					me.setDivClick(divcon,divin,event);
				}
			}
		};		
		navPanle.unbind("click");		
		navPanle.bind("click", navPanleClick);
	},
	/**
	 * 得到当前展开的节点,返回选择节点ID(必须是showOne=true时)
	 * @return {String}
	 */
	getSelected:function(){
		var options= this._options,currentid="";
		if(options.showOne){
			var ca=this.find(".ui-nav-inner-seleted");
			if(ca.elems.length>0){
				currentid=ca.attr("name");
			}else{
				currentid=this.find(".ui-nav-selected:last").parent().attr("name");
			}
		}
		return currentid;
	},
	/**
	 * 据ID设置当期活动的Item
	 * @param {String} id
	 */
	setActiveItem : function(id) {
		var options= this._options;
		this.find(".ui-nav-selected").removeClass("ui-nav-selected");
		this.find(".ui-nav-inner-seleted").removeClass("ui-nav-inner-seleted");
		this.find(".ui-nav-content").hide();
		this.find("div[name='"+id+"']").attr("current","1");
		if(options.autoOpenPage){
			this.openCurrentPage();
		}
		if(!options.showAll){
			this.setCurrentExpand();
		}
	},
	/**
	 * 通过id得到节点数据
	 * @param {String} id
	 * @return  {Object}
	 * @private
	 */
	_getItemById : function(id) {
		//return  this.dataset.select("id="+id);
		var ds = this.dataset.select(function(i, data) {
			return data.id === id;
		});
		return ds;
	},
	/**
	 * 通过id得到节点数据
	 * @param {String} id
	 * @return  {Json}
	 */
	getItemById : function(id) {
		var data=this._getItemById(id);
		if(data.length>0){
			return data[0];
		}else{
			return null;
		}
	},
	/**
	 * 添加一个节点
	 * @param {Array} item
	 */
	addItem:function(item){
		//var tempds=this.dataset.select("id="+item.id);
		var tempds=this._getItemById(item.id);
		if(tempds.length>0){
			throw "id为"+item.id+"的数据已经存在";
		}
		this.dataset.insert(item);
		var dataSet=this._getItemById(item.id);//this.dataset.select("id="+item.id);
		if(dataSet && dataSet.length>0){
			this._global.idAllChild=true;
			//var fragment = this.initDynamicHtml(null,dataSet);
			var iddiv = this.find("#"+item.pid);
			//这里会替换而不是追加
			this._renderDynamicHtml(iddiv,"dynamicTemplate",dataSet,false,window,false);
			//this.appendDynamicHTML(iddiv,dataSet);
			//iddiv.append(fragment);
			this._options.onAdd(item);
		}		
	},
	/**
	 * 重新加载
	 */
	reLoad : function(config,data) {	
		this._global.idAllChild=false;
		this._global.level=1;
		this.initRefresh(config,data);
		this.setConstruct();
	},
	/**
	 * 根据id得到group
	 * @param {String} id
	 * @return  {String}节点group
	 */
	getPidById : function(id) {
		var items = this._getItemById(id);
		if(items.length>0){
			return items[0].pid;
		}else{
			return null;
		}
	},
	/**
	 * 得到全部节点数据
	 * @return  {Json}
	 */
	getAllItems : function() {
		return this.dataset.select();
	},
	/**
	 * 得到指定节点的所有父祖先级节点
	 * @param {String} id
	 * @return  {Array}
	 */
	getParentItems : function(id) {
		var node = this._getItemById(id);		
		var itemsall = this.getPNode(node);
		return itemsall;
	},
	/**
	 * 递归得到指定节点的父祖先级节点
	 * @param {String} id
	 * @return  {Array}
	 * @private
	 */
	getPNode:function(node){		
		var pnode=this._global.newData.slice(0).concat(node),ppnode;
		if(node){ 
			ppnode = this._getItemById(node[0].pid);
			if(ppnode){
				this.getPNode(ppnode);
			}
		}	
		return pnode;
	},
	/**
	 * 得到当前节点的父级节点
	 * @return  {Object}
	 */
	getCurrParentItem : function() {
		var items, id = this.getSelected();
		if(id){
			 var node = this.getItemById(id);
			 if(node){
				 items=this.getItemById(node.pid);
			 }
		}
		return items;
	}
});

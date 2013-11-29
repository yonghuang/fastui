/**
 * @class fastDev.Ui.Tree
 * @extends fastDev.Ui.Component
 * 树控件 提供主流树控件的绝大多数功能，形式有普通树，多选树和单选树。继承自Component。导航类控件。<p>
 * 主要事项：数据量超大时，openFloor设置较小性能较好。
 * 作者：姜玲<p>
 *
 *		<div itype="Tree"  initSource="data.txt" showIco="true" topParentid="0" openFloor=2></div>
 */
fastDev.define("fastDev.Ui.Tree",{
	extend : "fastDev.Ui.Component",
	alias : "Tree",
	_options : {
		/**
		 * 合法的json数据源，必须有[val，id，pid]复选树加chk[值为true，part，false]，单选树加radio[值同chk]，异步树加asyn[值为true,false] font:文本样式 ico:图标样式 disabled:复选框或单选框禁用 nocheck:节点无复选框或单选框 readonly:文本只读
		 * @type {Json}
		 */
		items : "",
		/**
		 * 控件初始化合法的json数据源url
		 * @type {String}
		 */
		initSource : "",
		/**
		 * 异步的数据源
		 * @type {String}
		 */
		asyncDataSource : "",
		/**
		 * 顶级节点id
		 * @type {String} [topParentid="0"]
		 */
		topParentid : "0",
		/**
		 * 默认打开层数
		 * @type {Number} [openFloor=1]
		 */
		openFloor : 1,
		/**
		 * 节点文本的默认长度,默认10个汉字或20个英文，超过长度的截取...，文本悬停有提示
		 * @type {Number} 
		 */
		textMaxLength:20,
		/**
		 * 树类型，必须是normal;multitree;radiotree其一
		 * @type {String} [treeType="normal"]
		 */
		treeType : "normal",
		/**
		 * 是否显示树的连接线
		 * @type {Boolean} [showLine=true]
		 */
		showLine : true,
		/**
		 * 是否显示小图标
		 * @type {Boolean}
		 */
		showIco : false,
		/**
		 * 默认选中的节点id
		 * @type {String}
		 */
		currentId : "",		
		/**
		 * 根节点的文本值（非数据中的根节点）
		 * @type {String}
		 */
		rootValue : null,
		/**
		 * 高度
		 * @type {String}
		 */
		height:"100%",
		/**
		 * 宽度
		 * @type {String}
		 */
		width:"100%",
		/**
		 * 是否隐藏
		 * @type {Boolean} [hide=false]
		 */
		hide : false,
		/**
		 * 是否禁用
		 * @type {Boolean} [disabled=false]
		 */
		disabled : false,
		/**
		 * 是否开启节点右键菜单的添删改功能
		 * @type {Boolean} [nodeEdit=false]
		 */
		nodeEdit : false,
		/**
		 * 鼠标右键点击到节点上的菜单内容项
		 * @type {String}
		 */
		rightMenu : null,		
		/**
		 * 复选框树显示多选框
		 * @type {Boolean} [mTreeShowCkb=true]
		 */
		mTreeShowCkb : true,
		/**
		 *  只能选中叶子节点的文本
		 * @type {Boolean} [onlySelectLeaf=true]
		 */
		onlySelectedLeaf : false,
		/**
		 * 单选框树显示单选框
		 * @type {Boolean} [mTreeShowCkb=true]
		 */
		mTreeShowRadio : true,
		/**
		 * 根据多选树的叶子节点的选中状况勾选或半勾选其父节点
		 * @type {Boolean}
		 */
		chkedByLeaf : false,
		/**
		 *  单选勾选分组范围有,分"同一级内"level，"整棵树内"all两种
		 * @type {String} [radioType="level"]
		 */
		radioType : "level",
		/**
		 * 复选框是否要半选状态的值
		 * @type {Boolean}
		 */
		partchkValue : true,	
		/**
		 * 单选框是否要半选状态的值
		 * @type {Boolean}
		 */
		partradioValue:true,	
		/**
		 * 多选树或单选树是否仅仅要叶节点的值
		 * @type {Boolean} [onlyLeafValue=false]
		 */
		onlyLeafValue : false,
		/**
		 * 自定义数据配置数据字段名
		 * @type {string} 多个用逗号分割
		 */
		customFields : "",
		/**
		 * 是否拖拽 
		 * @type {Boolean}
		 */
		nodeDrag :false,
		/**
		 * 数据结构类型
		 * @private 
		 */
		structure : "Tree",
		/**
		 * 数据映射，格式{"parentid":"pid","text":"val"}
		 * @private 
		 */
		mapping : {'parentid':'pid','text':'val'},
		/**
		 * @event onBeforeDrag
		 * 拖拽之前的事件  ,返回为false则取消
		 * @param {String} id
		 * @return {Boolean}
		 */
		onBeforeDrag : fastDev.noop,	
		/**
		 * @event onAfterDrag
		 * 拖拽之后的事件
		 * @param {String} id
		 * @param {String} newpid
		 */
		onAfterDrag : fastDev.noop,
		/**
		 * @event onBeforeAdd
		 * 节点添加前的自定义事件(如果添加方法没调用此方法则js生成随机的id添加) ,返回为false则取消
		 * @param {String} pid
		 * @return {String} newid 或者false
		 */
		onBeforeAdd: fastDev.noop,
		/**
		 * @event onBeforeEdit
		 * 节点编辑前的自定义事件,返回为false则取消编辑
		 * @param {String} id
		 * @return {Boolean}
		 */
		onBeforeEdit : fastDev.noop,
		/**
		 * @event onBeforeDel
		 * 节点删除前的自定义事件,返回为false则取消删除
		 * @param {String} id
		 * @return {Boolean}
		 */
		onBeforeDel: fastDev.noop,
		/**
		 * @event onAfterAdd
		 * 节点添加后的自定义事件
		 * @param {json} item
		 */
		onAfterAdd: fastDev.noop,
		/**
		 * @event onAfterEdit
		 * 节点编辑后的自定义事件
		 * @param {json} item
		 */
		onAfterEdit: fastDev.noop,
		/**
		 * @event onAfterDel
		 * 节点删除后的自定义事件
		 * @param {String} id
		 */
		onAfterDel: fastDev.noop,
		/**
		 * @event onNodeClick
		 * 自定义点击事件
		 * @param {String} id
		 */
		onNodeClick: fastDev.noop,
		/**
		 * @event onNodeClick
		 * 自定义复选框点击事件
		 * @param {String} id
		 */
		onCheckClick: fastDev.noop,
		/**
		 * @event onNodeClick
		 * 自定义单选框点击事件
		 * @param {String} id
		 */
		onRadioClick: fastDev.noop,
		/**
		 * @event onNodeDblClick
		 * 自定义双击事件
		 * @param {String} id
		 */
		onNodeDblClick: fastDev.noop,
		/**
		 * @event onExpand
		 * 自定义展开事件
		 * @param {String} id
		 */
		onExpand: fastDev.noop,
		/**
		 * @event onCollect
		 * 自定义收缩事件
		 * @param {String} id
		 */
		onCollect: fastDev.noop,
		/**
		 * @event onAfterLoad
		 * 数据加载之后
		 */
		onAfterLoad : fastDev.noop,
		/**
		 * @event onBeforeLoad
		 * 数据加载之前
		 */
		onBeforeLoad:fastDev.noop
	},
	_global : {		
		items : "",
		ulCls:"ui-tree",
		thistree:null,
		treeTypeCls:"",
		findItems:[],
		allItems:[],
		allBraIds:"",
		parentItems:[],
		collectspan:[]
	},
	tplParam : ["id","height","width","ulCls","treeTypeCls","showIco","itemsLen","asyncDataSource"],
	fields : [{name:"id"},{name:"parentid"},{name:"text"},{name : "chk",defaultValue : "false"},{name : "radio",defaultValue : "false"},{name : "asyn",defaultValue : "false"},{name:"font",defaultValue : ""},{name:"ico",defaultValue : ""},{name:"readonly",defaultValue : "false"},{name:"disabled",defaultValue : "false"},{name:"nocheck",defaultValue : "false"}],	
	staticTemplate : function(params) {
	  return '<div id="'+params.id+'" class="ui-tree-panel" style="height:'+params.height+';"></div>';
	},	
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {		
		if(!options.showLine){
			global.ulCls="ui-tree ui-tree-noline";
		}
		if(options.treeType==="multitree" && options.mTreeShowCkb===true){
			global.treeTypeCls="checkbox";
		}else if(options.treeType==="radiotree" && options.mTreeShowRadio===true){
			global.treeTypeCls="radio";
		}
		if(options.id===""){
			options.id=fastDev.getID();
		}
		if(options.customFields){			
			this.fields =this.fields.slice(0).concat(options.customFields.split(','));
		}
		if(!!options.mapping){
			var mapping=options.mapping;
			if(fastDev.isString(options.mapping)){
				mapping=fastDev.Util.JsonUtil.parseJson(options.mapping);
			}	
			for (var p in mapping){
				for(var i=0,field;(field=this.fields[i]);i++){
					if(field.name===p){
					this.fields[i].mapping=mapping[p];
					this.fields =this.fields.slice(0).concat(mapping[p]);
					break;
					}	
				}
			}
		}
	},
	/**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	constructItems : function() {
		var me = this,options=this._options,global=this._global,dataSet,len;
		global.allBraIds="";
		options.onBeforeLoad();
		dataSet=this.dataset.structure.getNode(options.topParentid);
		if(!!dataSet){
			dataSet=dataSet.children;
		}else{
		var topitems = {
			parentid : "",
			id : options.topParentid,
			text : ""+options.rootValue
		};
		this.dataset.structure.addNode(topitems);
		this.dataset.structure.initNodes();
		
		if(!!options.rootValue) {
			dataSet=[this.dataset.structure.getRoot()];
		}else{
			dataSet=this.dataset.structure.getRoot().children;
		}
		}
		len=dataSet.length;			
		if(len===0){
			return;
		}
		var html =this.dynamicTemplate(dataSet,1,false,false,options,global);
		var div=fastDev(this.elems[0]);
		div.append(fastDev(html.join('')));
		global.thistree=div;
		this.setConstruct(options,global);
		this.bindEvent(options,global);		
		options.onAfterLoad.call(this);		
	},
	/**
	 * 创建节点
	 * @param {Object} children 节点数据
	 * @param {Number} level 现在展开的层次
	 * @param {Boolean} isnotRoot 是否顶级节点
	 * @param {Boolean} isonlyli 是否仅仅创建li
	 * @private
	 */
	dynamicTemplate : function(children,level,isnotRoot,isonlyli,options,global){
		var len=children.length,openClose="",text="",emptyObj,html,asyn=false;
		isonlyli ? html=[] : html = ['<ul class="'+(isnotRoot ? "ui-line" : global.ulCls)+'">'];
				for(var i=0;i<len && level<=options.openFloor;i++){
					var node=children[i];
					html.push('<li id="'+node.id+'"');
					emptyObj=!fastDev.isEmptyObject(node.children);
					if(options.asyncDataSource!=="" && (node.asyn==="true" || node.asyn==="1" || node.asyn===true || node.asyn===1) && emptyObj===false){
						asyn=true;
						html.push(' asyn="1" ');
					}else{
						asyn=false;
					}					
					if(emptyObj && level==options.openFloor){
						html.push(' yc="1" ');
					}					
					html.push('><div class="ui-tree-node"><span class="ico-node');
					if(emptyObj || asyn){
						(asyn ||level==options.openFloor)?openClose="-close":openClose="-open";
						html.push(openClose);
					}else{
						openClose="";
					}
					if(len===1 && isnotRoot===false){
						html.push('-last');//end
					}else if(i===len-1){
						html.push('-last');
					}else if(i===0 && isnotRoot===false && emptyObj){
						html.push('-first');
					}
					html.push('"></span>');

					if(global.treeTypeCls!==""){
						html.push('<span class="ico-'+global.treeTypeCls);
						if(node.chk==="true" || node.radio==="true"){
							html.push('-checked');
						}else if(node.chk==="part" || node.radio==="part"){
							html.push('-half');
						}	
						if(node.disabled==="true"){
							html.push('-disabled');
						}
						if(node.nocheck==="true"){
						html.push('-nocheck');
						}
						html.push('"></span>');
					}
					
					html.push('<span class="ui-tree-content">');
					
					if(options.showIco){
						html.push('<span class="ico-');
						!!openClose ? html.push('folder'+openClose) : html.push('file');
						!!node.ico ? html.push(' '+node.ico+openClose+'" ico="'+node.ico+'"') : html.push('"');
						html.push('></span>');
					}
                    html.push('<span class="ui-tree-text');
					if(node.readonly==="true"){
						html.push('-readonly');			
					}
					html.push(' '+node.font+'"');
					text=node.text;
					if(text.length*2>options.textMaxLength){
						if(fastDev.Util.StringUtil.getChLength(text)>options.textMaxLength && text.indexOf('<')===-1){
						html.push(' title="'+text+'"');
						text=text.substr(0,(options.textMaxLength-4)/2)+"...";
						}
					}					
					html.push('>'+text+'</span></span></div>');
					if(emptyObj){
						html = html.concat(arguments.callee(node.children,level+1,true,false,options,global));						
					}
					html.push('</li>');
				}
				if(isonlyli===false){
				html.push('</ul>');
				}
				return html;
	},	
	/**
	 * 设置控件属性
	 * @private
	 */
	setConstruct : function(options,global) {
		this.setTreeCls();
		if(options.hide){
			 this.hide();
		}
		if(options.currentId) {
			this.setCurrentId(options.currentId);
		}
	},
	/**
	 * 设置树的图标样式
	 * @private
	 */
	setTreeCls : function(li){
		var lastuls =this._global.thistree.find("ul>li:last-child>ul");
		lastuls.addClass("ui-line-no");
		if(lastuls.elems.length===0){
			this._global.thistree.find("ul.ui-line-no").removeClass("ui-line-no");
		}
		if(li){
		var lastdivs= li.find("ul>li:last-child>div");
		lastdivs.find("span.ico-node").setClass("ico-node-last");
		lastdivs.find("span.ico-node-close").setClass("ico-node-close-last");
		lastdivs.find("span.ico-node-open").setClass("ico-node-open-last");	
		}
	},
	/**
	 * 事件注册
	 * @private
	 */
	bindEvent : function(options,global) {
		//事件注册 展开收缩事件，复选框点击事件，文本点击事件
		var that = this,treeobj=global.thistree,id,checked;
		var treeClick=function(e) {
		    var clickTg = fastDev(e.target);
			var ctgclass = clickTg.attr("class");		
			if(	ctgclass === undefined){
				return;
			}
			if(ctgclass.indexOf("ico-checkbox") > -1) {
				that.chkclick(clickTg);
				if(options.onCheckClick!==fastDev.noop &&  ctgclass.indexOf("-disabled")===-1){
					id=clickTg.parents("li:first").attr("id");
					checked=ctgclass.indexOf("ico-checkbox-checked") > -1?false:true;
				    options.onCheckClick.call(that,e,id,checked);
				}
			} else if(ctgclass.indexOf("ico-radio") > -1) {
				that.radioclick(clickTg);
				if(options.onRadioClick!==fastDev.noop && ctgclass.indexOf("-disabled")===-1){
					id=clickTg.parents("li:first").attr("id");
					checked=ctgclass.indexOf("ico-radio-checked") > -1?false:true;
					options.onRadioClick.call(that,e,id,checked);
				}
			} else if(ctgclass.indexOf("ico-node-open") > -1) {
				that.collect(clickTg);
			} else if(ctgclass.indexOf("ico-node-close") > -1) {
				that.expand(clickTg);
			} else if(ctgclass.indexOf("ui-tree-content") > -1) {
				that.textClick(clickTg,e);
			} else if(/(ui-tree|icon)-(file|text|folder-open|folder-close)/.test(ctgclass)){
				that.textClick(clickTg.parent("span"),e);
			}				
		};
		treeobj.unbind("click");
		treeobj.bind("click", treeClick);				
		var mouseOver = function(event) {
			var span = fastDev(event.target);
			treeobj.find(".ui-tree-over").removeClass("ui-tree-over");	
			var cls=span.getClass();			
			if(cls.indexOf("-disabled")>0 || cls.indexOf("-readonly")>0){
			}else if(span.hasClass("ui-tree-content")){
				var txt=span.children(".ui-tree-text-readonly").elems;
				if(txt.length===0){
					span.addClass("ui-tree-over");
				}
			}else if(/ico-(checkbox|radio)(-(checked|half))?/.test(cls)){				
				if(cls.indexOf("-over")===-1) {
					span.setClass(cls+"-over");
				}
			}else if(/(ui-tree|icon)-(file|text|folder-open|folder-close)/.test(cls)){
				span.parent("span.ui-tree-content").addClass("ui-tree-over");
			}
		};
		var mouseOut = function(event) {
			var span = fastDev(event.target);
			treeobj.find("span.ui-tree-over").removeClass("ui-tree-over");
			var cls=span.getClass();
			span.setClass(cls.replace("-over",""));	
		};
		treeobj.bind("mouseover", mouseOver).bind("mouseout", mouseOut);
			var treeDblClick=function(e){
				var clickTg = fastDev(e.target);
				var li=clickTg.parents("li:first");
				var id=li.attr("id");
				var val=that.getValByid(id);				
				if(id){					
					var lidiv=li.children("div");
					var opennode=lidiv.find("[class^='ico-node-open']");
					var closenode=lidiv.find("[class^='ico-node-close']");
					if(opennode.elems.length>0){
						that.collect(opennode);
					}else if(closenode.elems.length>0){
						that.expand(closenode);
					}
					if(options.onNodeDblClick!==fastDev.noop){	
						options.onNodeDblClick.call(that,e,id,val);
					}
				}
			};
			treeobj.bind("dblclick", treeDblClick);	
		/*if(options.nodeDrag !==fastDev.noop) {//拖拽事件
			this.nodeDragEvent();
		}
		if(options.rightMenu){ 
			this.showRightMenu()
		}
		if(options.nodeEdit){
			this.showNodeEdit();
		}*/
	},	
	/**
	 *  文本选中事件
	 * @param {Object} span
	 * @private
	 */ 
	textClick : function(span,e){
		var options=this._options;
		var txt=span.children("span.ui-tree-text-readonly").elems;
		if(txt.length>0){
			return false;
		}
		if(options.onlySelectedLeaf){
			  var node=span.prev("span.ico-node").elems;
			  var nodelast=span.prev("span.ico-node-last").elems;
			  if((node.length+nodelast.length)===0){
				  return false;
			  }
		}
		if(options.treeType==="multitree" && options.mTreeShowCkb===false){
			if(span.hasClass("ui-tree-selected")){
				span.removeClass("ui-tree-selected");
			}else{
				span.addClass("ui-tree-selected");
			}
		}else if(options.treeType==="radiotree" && options.mTreeShowRadio===false && options.radioType==="level"){
			var parentUl=span.parents("ul:first");
			var xdradio=parentUl.children("li").children("div").find("span.ui-tree-content");
			xdradio.removeClass("ui-tree-selected");
			span.addClass("ui-tree-selected");
		}else{		
			this._global.thistree.find("span.ui-tree-selected").removeClass("ui-tree-selected");
			span.addClass("ui-tree-selected");
		}
		if(options.onNodeClick!==fastDev.noop){
			var id=span.parent("div").parent("li").attr("id");
			var val=this.getValByid(id) || span.children("span.ui-tree-text").getText();
			options.onNodeClick.call(this,e,id,val);
		}
	},
	/**
	 * 设置复选框的样式
	 * @private
	 */
	setChkCls : function(chklist,cls){
		var len=chklist.length;
		for(var i=0;i<len;i++){
			var chk=fastDev(chklist[i]);
			var oldcls=chk.getClass();
			if(oldcls.indexOf("-disabled")===-1 && oldcls.indexOf("-nocheck")===-1){
				chk.attr("class", cls);
			}
		}
	},
	/**
	 *  复选框选中事件
	 * @param {Object} span
	 * @private
	 */
	chkclick : function(clickTg){
		//复选框选中事件	
		var options = this._options;
		var clickclass = clickTg.attr("class");
		if(clickclass.indexOf("disabled")>0){
			return false;
		}		
		var tgclass = clickclass.indexOf("ico-checkbox-checked")>-1 ? "ico-checkbox" : "ico-checkbox-checked";
		//上面选中下面一起选中
		var chkdiv= clickTg.parent("div");
		var li=chkdiv.parent("li");
		var id =li.attr("id");
		var chkdivul=chkdiv.next("ul");
		if(li.attr("yc")==="1" || li.find("[yc]").elems.length>0){
			var span=clickTg.prev("span");
			var cls=span.getClass();
			this.setAllExpandByPid(id,true);
			if(cls.indexOf("ico-node-close")>-1){
				this.collect(span);
			}
			chkdivul=chkdiv.next("ul");
		}
		var chkchilds = chkdivul.find("[class^='ico-checkbox']");
		var chkdischilds=chkdivul.find("[class^='ico-checkbox'][class$='disabled']");
		if(chkdischilds.elems.length===0){
			chkchilds.attr("class", tgclass);
		}else{
			this.setChkCls(chkchilds.elems,tgclass);
		}
		clickTg.attr("class", tgclass);
		//下面都选中的话，上面也选中,递归
		
		//父节点下所有的节点复选框
		var pli = li.parents("li:first");
		if(pli.elems.length===0){
			return;
		}
		var pid=pli.attr("id");
		var pchk = pli.children("div").children("span:eq(1)");			
		var pdiv=pli.children("ul").children("li").children("div");
		var xd = pdiv.find("[class^='ico-checkbox']");		
		var xdchked = pdiv.find("[class^='ico-checkbox-checked']");
		var xdchkhalfed = pdiv.find("[class^='ico-checkbox-checked'],[class^='ico-checkbox-half']");	
		var pchkclass = pchk.attr("class");		
		if(xd.elems.length===xdchked.elems.length){
			//兄弟全部选中	
			this.setChkCls(pchk.elems,"ico-checkbox");
			this.chkclick(pchk);
		}else if(xdchkhalfed.elems.length===0){
			//兄弟全部没选中
			this.setChkCls(pchk.elems,"ico-checkbox-checked");
			this.chkclick(pchk);
		}else{
			//兄弟部分选中
			this.setChkCls(pchk.elems,"ico-checkbox-half");
			var ppdiv=pchk.parents("li").children("div");
			var ppchk = ppdiv.find("[class^='ico-checkbox']");			
			var ppchkdis=ppdiv.find("[class^='ico-checkbox'][class$='disabled']");
			if(ppchkdis.elems.length===0){
				ppchk.attr("class", "ico-checkbox-half");
			}else{
				this.setChkCls(ppchk.elems,"ico-checkbox-half");
			}	
		}
	},
	/**
	 *  单选框选中事件
	 * @param {Object} span
	 * @private
	 */
	radioclick : function(clickTg){
		var options = this._options, tgclass, pa, childsameparentchbs,thistree=this._global.thistree;
		var clickclass = clickTg.attr("class");
		if(clickclass.indexOf("disabled")>0){
			return false;
		}
		//得到当前节点状态
		tgclass =clickclass.indexOf("ico-radio-checked")>-1 ? "ico-radio" : "ico-radio-checked";
		//	1.单选勾选分组范围有"同一级内"和"整棵树"内两种
		if(options.radioType === "level") {
			//兄弟节点选中的单选框为未选中状态
			pa = clickTg.parents("li:first").parent("ul");
			childsameparentchbs = pa.children("li").children("div").children(".ico-radio-checked");
			childsameparentchbs.attr("class", "ico-radio");
			//选中节点
			clickTg.attr("class", tgclass);
			//清除所有半选中状态
			thistree.find("span.ico-radio-half").attr("class", "ico-radio");
			//得到所有选中节点，并给这些节点的直系父祖辈未选中的节点赋半选中状态
			var allsedradio = thistree.find(".ico-radio-checked,ico-radio-checked-over");
			allsedradio.parents("li").children("div").children(".ico-radio").attr("class", "ico-radio-half");
		} else if(options.radioType === "all") {
			//整棵树：
			//设置所有节点都为未选状态。
			thistree.find("[class^='ico-radio']").attr("class", "ico-radio");
			//如果当前节点选中的话，直系父祖辈节点变为半选中状态。
			if(tgclass === "ico-radio-checked") {
				clickTg.parents("li").children("div").children(".ico-radio").attr("class", "ico-radio-half");
			}
			clickTg.attr("class", tgclass);
		}
	},
	/**
	 *  收缩
	 * @param {Object} span
	 * @private
	 */ 
	collect:function(span){
		var sclass = span.attr("class"),
		closecls= sclass.replace("-open","-close"),			
		div=span.parent("div"),
		folderSpan = div.find("span.ico-folder-open"),
		li=div.parent("li"),
		id=li.attr("id");				
		span.attr("class",closecls);	
		folderSpan.attr("class","ico-folder-close");			
		var ul=li.children("ul");		
		ul.css("display", "none");	
		var icoCls=folderSpan.attr("ico");
		if(icoCls){
			folderSpan.addClass(icoCls+"-close");
		}			
		this._options.onCollect.call(this,id);
	},
	addNodeByPid : function(pid,options,global){
		    options.openFloor=1;
			var dataSet=this.dataset.structure.getNode(pid),			
			iddiv =global.thistree.find("li[id='"+pid+"']"),
			idul=iddiv.children("ul"),
			onlyli=idul.elems.length>0;
			if(pid===options.topParentid && !options.rootValue){
			idul =this._global.thistree.find("ul:first");
			onlyli=true;
		    }
			var html =this.dynamicTemplate(dataSet.children,1,true,onlyli,options,global);
			onlyli?idul.append(fastDev(html.join(''))):iddiv.append(fastDev(html.join('')));			
	},
	addNodeById : function(id,options,global){
		    options.openFloor=1;
			var dataSet=this.dataset.structure.getNode(id),
			pid=dataSet.parentid;
			iddiv =global.thistree.find("li[id='"+pid+"']"),
			idul=iddiv.children("ul"),
			onlyli=idul.elems.length>0;
			if(pid===options.topParentid && !options.rootValue){
			idul =this._global.thistree.find("ul:first");
			onlyli=true;
		    }
			var html =this.dynamicTemplate([dataSet],1,true,onlyli,options,global);
			onlyli?idul.append(fastDev(html.join(''))):iddiv.append(fastDev(html.join('')));			
	},
	/**
	 *  展开
	 * @param {Object} span
	 * @private
	 */ 
	expand:function(span){
		var options=this._options,
		global=this._global,
		that=this,
		sclass = span.attr("class"),
		closecls= sclass.replace("-close","-open"),
		div=span.parent("div"),	
		folderSpan = div.find("span.ico-folder-close"),
		li=div.parent("li"),
		id=li.attr("id");		
		span.attr("class",closecls);			
		folderSpan.attr("class","ico-folder-open");		
		if(li.attr("yc")==="1"){
			this.addNodeByPid(id,options,global);
			li.removeAttr("yc");
			this.setTreeCls(li);			
			this.setPart(li);
		}
		if(li.attr("asyn")==="1"){
			var asyncurl=options.asyncDataSource,url="",that = this;	
			if(asyncurl.indexOf("?")>0){
			  url=asyncurl+"&id="+id;	
			}else{
			  url=asyncurl+"?id="+id;
			}		   
		   var createNode = function(item) {
			this.dataset.fill(item,false,true);	
			that.addNodeByPid(id,options,global);
			li.removeAttr("asyn");
			that.setTreeCls(li);
		  };
		  var asynProxy= fastDev.create("Proxy", {
				url : url,
				queue : global.queue,
				onAfterLoad : fastDev.setFnInScope(this, createNode)
		  });
		  asynProxy.load();
		}		
		var ul=li.children("ul");		
		ul.css("display", "block");
		var icoCls=folderSpan.attr("ico");
		if(icoCls){
			folderSpan.addClass(icoCls+"-open");
		}
		this._options.onExpand.call(this,id);
	},
	/**
	 * 把所有展开的节点全部收缩
	 */
	setAllCollect:function(){
		var opennode=this._global.thistree.find("[class^='ico-node-open']");
		var len=opennode.elems.length;
		for(var i=0;i<len;i++){
			this.collect(fastDev(opennode.elems[i]));
		}
	},
	/**
	 * 把所有展开的节点全部展开
	 */
	setAllExpand:function(){
		this.setAllExpandByPid(this._options.topParentid);
	},
	/**
	 * 把pid下的所有节点全部展开
	 * param {String} pid
	 */
	setAllExpandByPid:function(pid,isoldstate){
		var closenode,global=this._global;
		if(pid===this._options.topParentid){
			closenode=global.thistree.find("[class^='ico-node-close']");
		}else{
			closenode=global.thistree.find("li[id='"+pid+"'] [class^='ico-node-close']");
		}		
		var len=closenode.elems.length,span,spancls,collectspan=global.collectspan;
		for(var i=0;i<len;i++){
			span=fastDev(closenode.elems[i]);
			spancls=span.getClass();
			this.expand(span);
			if(spancls.indexOf("ico-node-close")>-1 && isoldstate===true){
				collectspan.push(span);
			}
			if(pid===this._options.topParentid){
			closenode=global.thistree.find("[class^='ico-node-close']");
			}else{
			closenode=global.thistree.find("li[id='"+pid+"'] [class^='ico-node-close']");
			}
			if(closenode.elems.length>0){
				this.setAllExpandByPid(pid);
			}else{
				return;
			}
		}
		var slen=collectspan.length;
		for(var j=0;j<slen;j++){
			this.collect(collectspan[j]);
		}
	},
	/**
	 * 给选中的节点的父级节点给半选值
	 * param {String} leafs
	 */
	setPart : function(leafs) {
		//给选中的节点的父级节点给半选值	
		var options=this._options;
		if(options.treeType==="radiotree" || options.treeType==="multitree" ){
			var chked,type="checkbox";
			if(options.treeType==="radiotree"){
				type="radio";
			}
			if(leafs) {
				chked = leafs.children("div").children("span.ico-"+type+"-checked").elems;
			} else {
				chked = this._global.thistree.find("span.ico-"+type+"-checked").elems;
			}
			var chklength = chked.length;
			for(var i = 0; i < chklength; i += 1) {
				this.chkState(chked[i],type);
			}
		}
	},
	/**
	 * 如果当前节点是选中状态，那么其子孙节点全部选中
	 * @private
	 */
	chkState : function(clickTg,type) {
		//如果当前节点是选中状态，那么其子孙节点全部选中
		var chkchilds = fastDev(clickTg).parent("div").next("ul").find("span[class^='ico-"+type+"']");
		var tgclass = fastDev(clickTg).getClass();
		if(chkchilds.elems.length > 0 && tgclass === "ico-"+type+"-checked") {
			chkchilds.attr("class", tgclass);
		}
	},
	/**
	 *   判断id是否父节点
	 * @param {String} id
	 * @return {Boolean}
	 */
	isBranch : function(id) {
		//是否父节点--根据原始数据源判断		
		if(!!this._options.asyncDataSource){
			var asyn=this.getNodeByid(id).asyn;
			if(asyn==="true" || asyn==="1" || asyn===true || asyn===1){
				return true;
			}
		}
		var node=this.getItemsBypid(id);
		if(!node || node.length===0){
			return false;
		}else{
			return true;
		}
	},
	/**
	 * 得到传入id的父id
	 * @param {String} id
	 * @return {String} pid
	 */
	getParentid : function(id) {
		// 得到传入id的父id
		var pid,node=this.getNodeByid(id);
		if(node){
		   pid=node.parentid;
		}
		return pid;
	},
	/**
	 * 得到节点id的文本
	 * @param {String} id
	 * @return {String}
	 */
	getValByid : function(id) {
		var val,node=this.getNodeByid(id);
		if(node){
		   val=node.text;
		}
		return val;
	},
	/**
	 * 查找所有的节点对象
	 * @return {Json}
	 */
	getItems : function(){
		var items=this.dataset.select();
		return items;
	},
	/**
	 * 查找指定id的节点对象
	 * @param {String} id
	 * @return {Object}
	 */
	getNodeByid : function(id) {
		return this.getItemsByid(id);
	},
	/**
	 * 得到某个节点的数据
	 * @private
	 */
	getItemsByid : function(id){
		return this.dataset.structure.getNode(id);
	},
	getItemsBypid : function(pid){
		return this.dataset.structure.getNode(pid).children;
	},	
	/**
	 * 查找指定id数组的节点文本数组
	 * @param {String} ids
	 * @return {String}
	 */
	getValsByids : function(ids) {
		var vals = "";
		var idssz = ids.split(',');
		var idssz_length = idssz.length;
		for(var i = 0; i < idssz_length; i += 1) {
			if(i === idssz_length - 1) {
				vals += this.getValByid(idssz[i]);
			} else {
				vals += this.getValByid(idssz[i]) + ",";
			}
		}
		return vals;
	},	
	/**
	 * 得到多选框获得值的类型
	 * @return {String}
	 * @private
	 */
	getValueType : function() {
		var options = this._options;
		if(options.onlyLeafValue) {
			return "onlyLeafValue";
		} else {
			if(options.treeType==="multitree"){
				return options.partchkValue?"partchkValue":"allchkValue";				
			}else{
				return options.partradioValue?"partradioValue":"allradioValue";
			}
		}
	},
	/**
	 *  根据参数获取复选框选中值
	 * @param {String} type 有onlyLeafValue、partchkValue、allchkValue三种
	 * @return {Array}
	 */
	getChkedIds : function(type) {
		//获取复选框选中值
		//1.得到所有看得见的构建好的节点的选中值
		var ids = "";
		if(type === "onlyLeafValue") {
			ids = this.getChkLeafVal("checkbox");
		} else if(type === "partchkValue") {
			ids = this.getChkPartAllVal("checkbox");
		} else if(type === "allchkValue") {
			ids = this.getChkAllVal("checkbox");
		}
		// var time=new Date();		
		//var noleafs = this._global.thistree.find("li[yc]");
		var hasyc = this.elems[0].innerHTML.indexOf(" yc=")>0;
		// alert(new Date()-time);
		if(!hasyc){
			return ids;
		}
		//2.得到所有没构建子节点的父节点
		var items = this.getItems();//dataset.select();
		//var noleafs =this._global.thistree.find("li[yc]");
		if(hasyc) {
			if(ids !== "") {
				ids += ",";
			}
			//3.得到2中所有选中节点
			//var nolchilddiv=noleafs.children("div");
			var allchk = this._global.thistree.find("li[yc]>div>[class^='ico-checkbox-checked']").elems;
			//4.得到2中所有半选中节点
			var partchk = this._global.thistree.find("li[yc]>div>[class^='ico-checkbox-half']").elems;
			//5.得到3中节点的所有子孙级节点，全算选中
			var allchklen = allchk.length;
			var idtemp = "";
			for(var i = 0; i < allchklen; i += 1) {
				//var id = fastDev(allchk[i]).parent("div").parent("li").prop("id");
				var id = allchk[i].parentNode.parentNode.id
				if(id !== "") {
					idtemp = this.getIdsByItems(this._findNodesByPid(id));
					if(type === "onlyLeafValue") {//叶子节点
						var idta = idtemp.split(',');
						var tlen = idta.length;
						for(var j = 0; j < tlen; j++) {
							if(idta[j] && (this.isBranch(idta[j]) === false)) {
								ids += idta[j] + ",";
							}
						}
					} else {
						ids += idtemp + ",";
					}
				}
			}
			//6.得到4中节点的所有子孙级节点在数据源中的选中节点
			var partchklen = partchk.length;
			for(var i = 0; i < partchklen; i += 1) {
				var id = fastDev(partchk[i]).parent("div").parent("li").attr("id");
				if(id !== "") {
					ids += this.getChkedIdsByDataType(id, type) + ",";
				}
			}
			if(ids && ids.length > 0) {
				ids = ids.substring(0, ids.length - 1);
			}
		}
		return ids;
	},
	/**
	 *  根据参数获取单选框选中值
	 * @param {String} type 有onlyLeafValue、partradioValue、allradioValue三种
	 * @return {Array}
	 */
	getRadioedIds : function(type) {
		//获取单选框选中值
		//1.得到所有看得见的构建好的节点的选中值
		var ids = "";
		if(type === "onlyLeafValue") {
			ids = this.getChkLeafVal("radio");
		} else if(type === "partradioValue") {
			ids = this.getChkPartAllVal("radio");
		} else if(type === "allradioValue") {
			ids = this.getChkAllVal("radio");
		}
		var noleafs =this._global.thistree.find("li[yc]");
		if(noleafs.elems.length===0){
			return ids;
		}
		//2.得到所有没构建子节点的父节点
		
		if(noleafs.length > 0) {
			if(ids !== "") {
				ids += ",";
			}
			var nolchilddiv=noleafs.children("div");
			//3.得到2中所有选中节点
			var allradio = nolchilddiv.children("[class=^'ico-radio-checked']").elems;
			//4.得到2中所有半选中节点
			var partradio = nolchilddiv.children("[class=^'ico-radio-half']").elems;
			//5.得到3中节点的所有子孙级节点，全算选中
			var allradiolen = allradio.length;
			for(var i = 0; i < allradiolen; i += 1) {
				//var id = fastDev(allradio[i]).parent("div").parent("li").prop("id");
				var id = allradio[i].parentNode.parentNode.id;
				if(id !== "") {
					ids += this.getIdsByItems(this._findNodesByPid(id)) + ",";
				}
			}
			//6.得到4中节点的所有子孙级节点在数据源中的选中节点
			var partradiolen = partradio.length;
			for(var i = 0; i < partradiolen; i += 1) {
				//var id = fastDev(partradio[i]).parent("div").parent("li").prop("id");
				var id = partradio[i].parentNode.parentNode.id;
				if(id !== "") {
					ids += this.getRadioedIdsByDataType(id, type) + ",";
				}
			}
			if(ids && ids.length > 0) {
				ids = ids.substring(0, ids.length - 1);
			}
		}
		return ids;
	},
	/**
	 * 根据dom得到复选框的所有选中值
	 * @return {Array}
	 * @private
	*/
	getChkAllVal : function(type) {
		// 得到复选框的所有选中值 页面上的
		var chked = this._global.thistree.find("span[class^='ico-"+type+"-checked']").elems;
		var chkvals = "";
		var chkedlength = chked.length,li,id;
		if(chked && chkedlength > 0) {
			for(var i = 0; i < chkedlength; i += 1) {
				//li=fastDev(chked[i]).parent("div").parent("li");
				//if(li.elems.length>0){
				//chkvals = chkvals +li.prop("id") + ",";
				chkvals = chkvals +chked[i].parentNode.parentNode.id + ",";
				//}
			}
			chkvals = chkvals.substring(0, chkvals.length - 1);
		}
		return chkvals;
	},
	/**
	 * 根据得到复选框的所有选中节点包括半选中节点的选中id值
	 * @return {Array}
	 * @private
	 */
	getChkPartAllVal : function(type) {
		//得到复选框的所有选中节点包括半选中节点的选中id值ui-tree-chk-part		 页面上的
		var chked = this._global.thistree.find("span[class^='ico-"+type+"-checked']").elems;
		var chkhalfed = this._global.thistree.find("span[class^='ico-"+type+"-half']").elems;
		var chkvals = "";
		var chkedlength = chked.length;
		var chkhalfedlen = chkhalfed.length,li,li2;
		for(var i = 0; i < chkedlength; i += 1) {
			//li= fastDev(chked[i]).parent("div").parent("li");
			//if(li.elems.length>0){
			//chkvals = chkvals +li.prop("id") + ",";
			chkvals = chkvals +chked[i].parentNode.parentNode.id + ",";
			//}
		}	
		for(var i = 0; i < chkhalfedlen; i += 1) {
			//li2=fastDev(chkhalfed[i]).parent("div").parent("li");
			//if(li2.elems.length>0){
			//chkvals = chkvals +li2.prop("id") + ",";
			chkvals = chkvals +chkhalfed[i].parentNode.parentNode.id+ ",";
			//}
		}			
		chkvals = chkvals.substring(0, chkvals.length - 1);
		return chkvals;
	},
	/**
	 * 根据得到复选框的所有叶节点的选中值
	 * @return {Array}
	 * @private
	 */
	getChkLeafVal : function(type) {		
		// 得到复选框的所有叶节点的选中值
		/*var leafvalue =  this._global.thistree.find("[class='ico-node'],[class='ico-node-last']");
		var chkvals = "";
		if(leafvalue && leafvalue.elems.length > 0) {
			var chked =leafvalue.parent("div").find("[class^='ico-"+type+"-checked']").elems;
			var chkedlength = chked.length,li;
			if(chked && chkedlength > 0) {
				for(var i = 0; i < chkedlength; i += 1) {
					//li= fastDev(chked[i]).parent("div").parent("li");
					//if(li.elems.length>0){
					//	chkvals = chkvals +li.prop("id") + ",";
					chkvals = chkvals +chked[i].parentNode.parentNode.id + ",";
					//}
				}
				chkvals = chkvals.substring(0, chkvals.length - 1);
			}
		}*/
		var chkallvals=this.getChkAllVal(type).split(","),len=chkallvals.length,chkvals="";
		for(var i=0;i<len;i++){
			if(!this.isBranch(chkallvals[i])){
				chkvals = chkvals + chkallvals[i]+ ",";
			}
		} 
		chkvals = chkvals.substring(0, chkvals.length - 1);
		return chkvals;
	},
	/**
	 * 是否延迟加载
	 * @return {Boolean}
	 * @private
	 */
	isYanchi : function() {
		//是否延迟加载
		return this._global.thistree.find("li[yc]").elems.length>0?true:false;
	},
	/**
	 * 根据数据集得到ids
	 * @param {Array} items 数据集
	 * @return {String}
	 * @private
	 */
	getIdsByItems : function(items) {
		var ids = "";
		for(var i = 0; i < items.length; i += 1) {
			ids += items[i].id + ",";
		}
		if(ids && ids.length > 0) {
			ids = ids.substring(0, ids.length - 1);
		}
		return ids;
	},
	/**
	 * 查找指定pid的所有子孙节点
	 * @param {String} pid
	 * @return {Array}
	 */
	findNodesByPid : function(pid) {
		//查找指定pid的所有子孙节点
		this._global.findItems=[];	
		var items=this.getNodesByPidItems(pid);
		return items;//this.getJsonByData(items);
	},
	/**
	 * 查找指定pid的所有子孙节点
	 * @private
	 */
	_findNodesByPid : function(pid) {
		//查找指定pid的所有子孙节点
		this._global.findItems=[];
		var items=this.getNodesByPidItems(pid);
		return items;
	},
	/**
	 * 得到父节点下的子节点
	 * @private
	 */
	getNodesByPidItems : function(pid){		
		//var im = this.dataset.select("pid="+pid),len=im.length;
		//if(len===0){
			var im=this.getItemsBypid(pid),len=im.length;
		//}
		for(var i = 0; i < len; i += 1) {
			 var id =im[i].id;
			 this._global.findItems = this._global.findItems.slice(0).concat(im[i]);
			 if(this.isBranch(id)){				
				 this.getNodesByPidItems(id);
			 }
		}
		return  this._global.findItems;
	},	
	/**
	 * 查找指定pid的节点
	 * @param {String} pid
	 * @return {Array}
	 */
	getNodesByPid : function(pid) {
		//查找指定pid的节点
		return this.getItemsBypid(pid);
	},	
	/**
	 * 得到所有叶子节点
	 * @return {Array}
	 */
	getAllLeafItems : function(){
		//var items = this.dataset.select(),newitems=[],n=0;		
		var items = this.getItems(),newitems=[],n=0;
		for(var i = 0; i < items.length; i++) {
			var im = items[i];
			if(this.isBranch(im.id) === false) {
				newitems[n]= im;
				n+=1;
			}
		}		
		//return this.getJsonByData(newitems);
		return newitems;
	},	
	/**
	 * 根据数据源数据得到所有选中状态的节点id
	 * @param {String} pid
	 * @param {String} type
	 * @return {Array}
	 * @private
	 */
	getChkedIdsByDataType : function(pid, type) {
		//根据数据源数据得到所有选中状态的节点id
		var ids = "", items = [];
		if(pid) {
			items = this._findNodesByPid(pid);
		} else {
			items = this.getItems();//dataset.select();
		}
		if(type === "onlyLeafValue") {//仅仅叶节点值
			for(var i = 0; i < items.length; i++) {
				var im = items[i];
				if(im) {
					if(this.isBranch(im.id) === false && "" + im.chk === "true") {
						ids += im.id + ",";
					}
				}
			}
		} else if(type === "partchkValue") {//全选和半选状态值
			for(var i = 0; i < items.length; i++) {
				var im = items[i];
				if(im) {
					var chk = "" + im.chk;
					if(chk === "true" || chk === "part") {
						ids += im.id + ",";
					}
				}
			}
		} else if(type === "allchkValue") {//全选值
			for(var i = 0; i < items.length; i++) {
				var im = items[i];
				var chk = "" + im.chk;
				if(chk === "true") {
					ids += im.id + ",";
				}
			}
		}
		if(ids && ids.length > 0) {
			ids = ids.substring(0, ids.length - 1);
		}
		return ids;
	},
	/**
	 * 根据数据源得到所有选中状态的值
	 * @param {Array} items
	 * @return {Array}
	 * @private
	 */
	getAllCheckedByData : function(items) {
		//根据数据源得到所以选中状态的值
		var len = items.length, nodes = [];
		for(var i = 0; i < len; i++) {
			var im = items[i];
			if(im && "" + im.chk === "true") {
				nodes = nodes.slice(0).concat(items[i]);
			}
		}
		return nodes;
	},
	/**
	 * 根据数据源数据得到所有选中状态的节点id
	 * @param {String} pid
	 * @param {String} type
	 * @return {Array}
	 * @private
	 */
	getRadioedIdsByDataType : function(pid, type) {
		//根据数据源数据得到所有选中状态的节点id
		var ids = "", items = [];
		if(pid) {
			items = this._findNodesByPid(pid);
		} else {
			items = this.getItems();//dataset.select();
		}
		if(type === "onlyLeafValue") {//仅仅叶节点值
			for(var i = 0; i < items.length; i++) {
				var im = items[i];
				if(im) {
					if(this.isBranch(im.id) === false && "" + im.radio === "true") {
						ids += im.id + ",";
					}
				}
			}
		} else if(type === "partradioValue") {//全选和半选状态值
			for(var i = 0; i < items.length; i++) {
				var im = items[i];
				if(im) {
					var radio = "" + im.radio;
					if(radio === "true" || radio === "part") {
						ids += im.id + ",";
					}
				}
			}
		} else if(type === "allradioValue") {//全选值
			for(var i = 0; i < items.length; i++) {
				var im = items[i];
				var radio = "" + im.radio;
				if(radio === "true") {
					ids += im.id+ ",";
				}
			}
		}
		if(ids && ids.length > 0) {
			ids = ids.substring(0, ids.length - 1);
		}
		return ids;
	},
	/**
	 * 是否父节点
	 * @param {String} id
	 * @param {Array} items 数据集
	 * @return {Boolean}
	 * @private
	 */
	isBranchByData : function(id, items) {
		//是否父节点--根据原始数据源判断		
		var allbraids=this.getAllBranchIds();
		if(allbraids.indexOf(","+id+",")>-1){
			return true;
		}else{			
			return false;
		}
	},
	/**
	 * 得到所有父节点
	 * @return {String}
	 * @private
	 */
	getAllBranchIds : function(){
		if(this._global.allBraIds!==""){
			return this._global.allBraIds;
		}else{
		var items=this.getItems(),len=items.length,ids=",";
		for(var i = 0; i < len; i += 1) {
			if(ids.indexOf(","+items[i].parentid+",")===-1){
				ids+=items[i].parentid+",";
			}
		}
		this._global.allBraIds=ids;
		}
		return ids;
	},
	/**
	 * 判断某个id的节点是否叶节点
	 * @param {String} id
	 * @return {Boolean}
	 */
	isLeaf : function(id) {
		return this.isBranch(id)===false?true:false;
	},
	/**
	 * 判断某个id的节点是否选中
	 * @param {String} id
	 * @return {Boolean}
	 */
	isChecked : function(id) {
		//是否选中
		var li = this._global.thistree.find("li[id='" + id + "']");
		var options = this._options;
		if(li.elems.length > 0) {
			if(options.treeType === "radiotree") {
				return li.children("div").find("[class^='ico-radio-checked']").elems.length>0 ? true : false;
			} else {
				return li.children("div").find("[class^='ico-checkbox-checked']").elems.length>0? true : false;
			}
		} else {
			//var items = this.dataset.select(), items_length = items.length;
			var items = this.getItems(), items_length = items.length;
			if(!items) {
				return null;
			}
			for(var i = 0; i < items_length; i += 1) {
				if("" +items[i].id === id) {
					if(options.treeType === "radiotree") {
						return "" + items[i].radio === "true" ? true : false;
					} else {
						return "" + items[i].chk === "true" ? true : false;
					}
				}
			}
		}
	},
	/**
	 * 清空复选树的值
	 */
	clearCheck : function() {
		//清空
		 this._global.thistree.find("span.ico-checkbox-half").attr("class", "ico-checkbox");
		 this._global.thistree.find("span.ico-checkbox-checked").attr("class", "ico-checkbox");
	},
	/**
	 * 清空某个复选树的值
	 * @param {String} id
	 */
	unCheckedById : function(id) {
		//清空
		var options = this._options;
		var currli=	this._global.thistree.find("li[id='" + id + "']");	
		if(currli.elems.length === 0) {
			this.createNodeByChildId(id);
		}
		currli = this._global.thistree.find("li[id='" + id + "']");
		if(currli.elems.length === 0) {
			return;
		}
		var li=currli.children("div");		
		if(options.treeType === "multitree" ){
			//li.find(".ico-checkbox-half").attr("class", "ico-checkbox");
			//li.find(".ico-checkbox-checked").attr("class", "ico-checkbox");
			var chk= li.children("span.ico-checkbox-checked");
			this.chkclick(chk);
		}else if(options.treeType === "radiotree"){
			//li.find(".ico-radio-half").attr("class", "ico-radio");
			//li.find(".ico-radio-checked").attr("class", "ico-radio");
			var chk= li.children("span.ico-radio-checked");
			this.radioclick(chk);
		}
	},
	/**
	 * 选中某个复选树的值
	 * @param {String} id
	 */
	checkedById : function(id) {		
		var options = this._options;	
		var currli=	this._global.thistree.find("li[id='" + id + "']");	
		if(currli.elems.length === 0) {
			this.createNodeByChildId(id);
		}
		currli = this._global.thistree.find("li[id='" + id + "']");
		if(currli.elems.length === 0) {
			return;
		}
		var li=currli.children("div");	
		///var li=this._global.thistree.find("[id='"+id+"']").children("div");
		if(options.treeType === "multitree" ){
			//li.find(".ico-checkbox-half").attr("class", "ico-checkbox");
			//li.find(".ico-checkbox-checked").attr("class", "ico-checkbox");
			var chk= li.children(".ico-checkbox");
			this.chkclick(chk);
		}else if(options.treeType === "radiotree"){
			//li.find(".ico-radio-half").attr("class", "ico-radio");
			//li.find(".ico-radio-checked").attr("class", "ico-radio");
			var chk= li.children(".ico-radio");
			this.radioclick(chk);
		}
	},
	/**
	 * 清空单选树的值
	 */
	clearRadio : function() {
		//清空
		 this._global.thistree.find(".ico-radio-half").attr("class", "ico-radio");
		 this._global.thistree.find(".ico-radio-checked").attr("class", "ico-radio");
	},	
	/**
	 * 设置树的值
	 * @param {String}
	 */
	setValue : function(ids) {
		var options = this._options;
		if(ids==="" || ids===options.topParentid){
			return;
		}	
		if(options.treeType === "multitree" || options.treeType === "radiotree") {
			//多选树就给选中节点打钩
			if(typeof ids === "string"){
				if(ids.indexOf(',')>0){
					ids=ids.split(',');
				}else{
					ids = [ids];
				}				
			}
			var idslen = ids.length;
			var txt = "",type="checkbox";
			if(options.treeType === "radiotree"){
				type="radio";
				this.clearRadio();
			}else{
				this.clearCheck();
			}
			this._global.thistree.find(".ui-tree-selected").removeClass("ui-tree-selected");
			for(var i = 0; i < idslen; i += 1) {
				var currli = this._global.thistree.find("li[id='" + ids[i] + "']");
				if(currli.elems.length === 0) {
					this.createNodeByChildId(ids[i]);
				}
				currli = this._global.thistree.find("li[id='" + ids[i] + "']");
				if(currli.elems.length === 0) {
					break;
				}
				if((type === "checkbox" && options.mTreeShowCkb === false) || (type=== "radio" && options.mTreeShowRadio === false)) { 
					currli.find(".ui-tree-content").addClass("ui-tree-selected");
				}else{
					currli.find(".ico-"+type+",.ico-"+type+"-half").attr("class", "ico-"+type+"-checked");
				}
			}			
		} else {
				this.setCurrentId(ids);			
		}
	},
	/**
	 * 设置当前id
	 * @param {String}
	 */
	setCurrentId : function(id){
		if(typeof id !== "string" || id===""){
			return;
		}
		this._global.thistree.find("span.ui-tree-selected").removeClass("ui-tree-selected");
		var currli = this._global.thistree.find("li[id='" + id + "']");
		if(currli.elems.length === 0) {
			this.createNodeByChildId(id);
			currli = this._global.thistree.find("li[id='" + id + "']");
		}
		if(currli.elems.length > 0) {
			currli.children("div").children(".ui-tree-content").addClass("ui-tree-selected");
			var currparentsul = currli.parents("ul:hidden");
			if(currparentsul && currparentsul.elems.length > 0) {
				currparentsul.css("display", "block");
			}
		}
	},
	/**
	 * 得到树的值
	 * @return {String}或数组
	 */
	getValue : function() {
		var value, options = this._options,ids;
		if(options.treeType === "multitree") {
			ids = this.getChkedIds(this.getValueType());
			value = ids.split(',');
		} else if(options.treeType === "radiotree") {
			ids = this.getRadioedIds(this.getValueType());
			value = ids.split(',');
		} else {
			value =  this.getCurrentId();
		}
		return value;
	},
	/**
	 * 得到当前id
	 * @return {String}
	 */
	getCurrentId : function() {
		// 得到当前id
		var curr = this._global.thistree.find(".ui-tree-selected");
		var id = "";
		if(curr && curr.elems.length > 0) {
			id = curr.parent("div").parent("li").attr("id");
		}
		return id;
	},
	/**
	 * 得到多选树的选中节点的id
	 * @return {String}
	 */
	getSelectedIds : function() {
		// 得到当前id
		var curr = this._global.thistree.find(".ui-tree-selected").elems;
		var id = [],len=curr.length;
		//id = curr.parent("div").parent("li").attr("id");
		for(var i=0;i<len;i++){
			//id[i]=fastDev(curr[i]).parent("div").parent("li").attr("id");
			id[i]=curr[i].parentNode.parentNode.id;
		}
		return id;
	},
	/**
	 * 得到是否有选中节点
	 * @return {Boolble}
	 */
	isSelected:function(){
		var ids=this.getSelectedIds();
		return ids.length>0?true:false;
	},
	/**
	 * 得到当前文本
	 * @return {String}
	 */
	getCurrentTxt : function() {
		// 得到当前文本
		var curr =  this._global.thistree.find(".ui-tree-selected");
		var txt = "";
		if(curr && curr.elems.length > 0) {
			txt = curr.children(".ui-tree-text").getText();
			if(txt.lastIndexOf('...')>0){
				txt = curr.children(".ui-tree-text").attr("title") || txt;
			}
		}
		return txt;
	},
	/**
	 * 得到传入枚举的值太多请具体看例子
	 * @param {String} type
	 * @return {Array} values
	 */
	getValues : function(type) {
		var value=[];
		switch(type) {
			case  "chkedNodes":
				// 当前选中的所有节点id
				var ids = this.getChkedIds("allchkValue");
				if(ids === "") {
					return null;
				}
				value = ids.split(',');
				break;
			case  "chkedLeafNodes":
				// 当前选中的所有叶节点id
				var ids = this.getChkedIds("onlyLeafValue");
				if(ids === "") {
					return null;
				}
				value = ids.split(',');
				break;
			case  "chkedPNodes":
				// 当前选中和半选中的所有节点id
				var ids = this.getChkedIds("partchkValue");
				if(ids === "") {
					return null;
				}
				value = ids.split(',');
				break;
			case  "chkedNodesIdVal":
				// 当前选中的所有节点IdVal
				var ids = this.getChkedIds("allchkValue");
				if(ids === "") {
					return null;
				}				
				//var values = "[";
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					var val = this.getValByid(id);
					//if(i === idslen - 1) {
						//values += "{id:'" + id + "',val:'" + val + "'}";
					//} else {
						//values += "{id:'" + id + "',val:'" + val + "'},";
					//}
					value.push({id:id,val:val});
				}
				//values += "]";
				//value = [].concat(eval(values));
				break;
			case  "chkedPNodesIdVal":
				// 当前选中和半选中的所有节点IdVal
				var ids = this.getChkedIds("partchkValue");
				if(ids === "") {
					return null;
				}
				//var values = "[";
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					var val = this.getValByid(id);
					//if(i === idslen - 1) {
					//	values += "{id:'" + id + "',val:'" + val + "'}";
					//} else {
					//	values += "{id:'" + id + "',val:'" + val + "'},";
					//}
					value.push({id:id,val:val});
				}
				//values += "]";
				//value = [].concat(eval(values));
				break;
			case  "chkedLeafNodesIdVal":
				// 当前选中的所有叶节点IdVal
				var ids = this.getChkedIds("onlyLeafValue");
				if(ids === "") {
					return null;
				}
				//var values = "[";
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					var val = this.getValByid(id);
					//if(i === idslen - 1) {
					//	values += "{id:'" + id + "',val:'" + val + "'}";
					//} else {
					//	values += "{id:'" + id + "',val:'" + val + "'},";
					//}
					value.push({id:id,val:val});
				}
				//values += "]";
				//value = [].concat(eval(values));
				break;
			case  "chkedNodesArray":
				// 当前选中的所有节点node
				var ids = this.getChkedIds("allchkValue");
				if(ids === "") {
					return null;
				}
				//var values = [];
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					//values = values.concat(this.getNodeByid(id));
					value.push(this.getNodeByid(id));
				}
				//value = values;
				break;
			case  "chkedPNodesArray":
				// 当前选中和半选中的所有节点node
				var ids = this.getChkedIds("partchkValue");
				if(ids == "") {
					return null;
				}
				//var values = [];
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					//values = values.concat(this.getNodeByid(id));
					value.push(this.getNodeByid(id));
				}
				//value = values;
				break;
			case  "chkedLeafNodesArray":
				// 当前选中的所有叶节点node
				var ids = this.getChkedIds("onlyLeafValue");
				if(ids == "") {
					return null;
				}
				//var values = [];
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					//values = values.concat(this.getNodeByid(id));
					value.push(this.getNodeByid(id));
				}
				//value = values;
				break;
			case  "radioedNodes":
				// 当前选中的所有节点id
				var ids = this.getRadioedIds("allradioValue");
				if(ids == "") {
					return null;
				}
				value = ids.split(',');
				break;
			case  "radioedLeafNodes":
				// 当前选中的所有叶节点id
				var ids = this.getRadioedIds("onlyLeafValue");
				if(ids == "") {
					return null;
				}
				value = ids.split(',');
				break;
			case  "radioedPNodes":
				// 当前选中和半选中的所有节点id
				var ids = this.getRadioedIds("partradioValue");
				if(ids == "") {
					return null;
				}
				value = ids.split(',');
				break;
			case  "radioedNodesIdVal":
				// 当前选中的所有节点IdVal
				var ids = this.getRadioedIds("allradioValue");
				if(ids == "") {
					return null;
				}
				//var values = "[";
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					var val = this.getValByid(id);
					//if(i === idslen - 1) {
					//	values += "{id:'" + id + "',val:'" + val + "'}";
					//} else {
					//	values += "{id:'" + id + "',val:'" + val + "'},";
					//}
					value.push({id:id,val:val});
				}
				//values += "]";
				//value = [].concat(eval(values));
				break;
			case  "radioedPNodesIdVal":
				// 当前选中和半选中的所有节点IdVal
				var ids = this.getRadioedIds("partradioValue");
				if(ids == "") {
					return null;
				}
				//var values = "[";
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					var val = this.getValByid(id);
					//if(i === idslen - 1) {
					//	values += "{id:'" + id + "',val:'" + val + "'}";
					//} else {
					//	values += "{id:'" + id + "',val:'" + val + "'},";
					//}
					value.push({id:id,val:val});
				}
				//values += "]";
				//value = [].concat(eval(values));
				break;
			case  "radioedLeafNodesIdVal":
				// 当前选中的所有叶节点IdVal
				var ids = this.getRadioedIds("onlyLeafValue");
				if(ids == "") {
					return null;
				}
				//var values = "[";
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					var val = this.getValByid(id);
					//if(i === idslen - 1) {
					//	values += "{id:'" + id + "',val:'" + val + "'}";
					//} else {
					//	values += "{id:'" + id + "',val:'" + val + "'},";
					//}
					value.push({id:id,val:val});
				}
				//values += "]";
				//value = [].concat(eval(values));
				break;
			case  "radioedNodesArray":
				// 当前选中的所有节点node
				var ids = this.getRadioedIds("allradioValue");
				if(ids == "") {
					return null;
				}
				//var values = [];
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					//values = values.concat(this.getNodeByid(id));
					value.push(this.getNodeByid(id));
				}
				//value = values;
				break;
			case  "radioedPNodesArray":
				// 当前选中和半选中的所有节点node
				var ids = this.getRadioedIds("partradioValue");
				if(ids == "") {
					return null;
				}
				//var values = [];
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					//values = values.concat(this.getNodeByid(id));
					value.push(this.getNodeByid(id));
				}
				//value = values;
				break;
			case  "radioedLeafNodesArray":
				// 当前选中的所有叶节点node
				var ids = this.getRadioedIds("onlyLeafValue");
				if(ids == "") {
					return null;
				}
				//var values = [];
				var idslist = ids.split(',');
				var idslen = idslist.length;
				for(var i = 0; i < idslen; i += 1) {
					var id = idslist[i];
					//values = values.concat(this.getNodeByid(id));
					value.push(this.getNodeByid(id));
				}
				//value = values;
				break;
			default:
				value = this.getCurrentId() && this.getNodeByid(this.getCurrentId());
		}
		return value;
	},
	/**
	 * 判断id是否树的节点id
	 * @param {String} id
	 * @return {Boolean}
	 */
	isRealData : function(id) {
		//是否真实数据
		return !this.getNodeByid(id)?false:true;
	},
	/**
	 * 判断数据是否是树的真实节点(有pid)
	 * @param {Json} item
	 * @return {Boolean}
	 */
	isData : function(items) {
		//是否有跟节点
		return !this.dataset.structure.getRoot()?false:true;
	},
	/**
	 * 创建某id的所有未构建的直系父节点和兄弟节点
	 * @private
	 */
	createNodeByChildId : function(id) {
		//创建某id的所有未构建的直系父节点和兄弟节点
		if(this.isRealData(id)) {
			var pitem=  this.getParentNodebyId(id);
			var len=pitem.length;
			for(var i=len-1;i>-1;i--){
				var li=this._global.thistree.find("li[id='" +pitem[i] + "']");
				if(li.elems.length>0){
				var span=li.children("div").find("[class^='ico-node']");
				if(span.elems.length>0){
					this.expand(span);
				}
				}
			}
		}
	},
	/**
	 * 得到某id的所有未构建的直系父节点和兄弟节点
	 * @param {String} id
	 * @return {Array}
	 * @private
	 */
	getParentNodebyId : function(id) {
		//得到某id的所有未构建的直系父节点和兄弟节点
		//1.是否id的节点有构建
		
		var li = this._global.thistree.find("li[id='" + id + "']").elems;
		//2.没有构建的话，将此pid的子节点保存在递归ids变量中，重复1开始。
		if(li.length === 0) {
			//3.找到当前节点的pid
			var pid = this.getParentid(id);
			this._global.parentItems = this._global.parentItems.slice(0).concat(pid);			
			this.getParentNodebyId(pid);
		}
		return this._global.parentItems;
	},
	/* 添加树节点
	 * @param {json} item 一个树节点数据json数据字符串
	 * @return {Boolean}
	 */
	addNode : function(items) {
		fastDev.isArray(items) || ( items = [items]);
		var itemslen=items.length,options=this._options,global=this._global;
		for(var i=0;i<itemslen;i++){
			var item=items[i];
			var id=item.id;
			var tempds=this.getItemsByid(id);//dataset.select("id="+id);
			if(!!tempds){
				throw "id为"+id+"的数据已经存在，无法添加。";
				return;
			}
			this.dataset.insert(item,false,true);	
			var pid=this.dataset.structure.getNode(id).parentid;
			//var pitem=this.getItemsByid(pid);//dataset.select("id="+pid);
			var li=global.thistree.find("[id='"+pid+"']");
			if(li.elems.length===0 && pid!==options.topParentid){
				this.dataset.structure.removeNode(id);
				throw "没有父节点为"+pid+"的数据存在，无法添加。";				
				return;
			}
			if(options.onBeforeAdd.call(this,item)===false){
				return false;
			}
			//如果父节点是展开状态，那么创建一个节点
			
			if(pid===options.topParentid){
				li=global.thistree;
			}
			var spancls=li.children("div").children("span:first").getClass();
			var hasul=li.children("ul").elems.length;
			if(spancls.indexOf('ico-node-close')===-1 || pid==options.topParentid || hasul>0){
				this.addNodeById(id,options,global);
				this.showNode(id);
				this.changeLeafCls(li);
				this.setTreeCls(li);
				this.setPart(li);
			}
			options.onAfterAdd.call(this,item);
		}
		return true;
	},
	/**
	 * 将叶子节点变成枝节点
	 * @private
	 */
	changeLeafCls : function(li){
		li.removeAttr("yc");
		var div=li.children("div");
		div.find(".ico-file").setClass("ico-folder-open");
		div.find(".ico-node-last").setClass("ico-node-open-last");
		div.find(".ico-node").setClass("ico-node-open");
	},	
	/**
	 * 删除树节点
	 * @param {String} id
	 * @return {Boolean}
	 */
	delNode : function(id) {
		var tempds=this.getItemsByid(id);//dataset.select("id="+id);
		if(!tempds){
			throw "id为"+id+"的数据不存在，无法删除。";
			return;
		}
		if(this._options.onBeforeDel.call(this,id)===false){
			return false;
		}
		var pid=this.getParentid(id);
		this.removeNodeByid(id);
		this.delNodeByDom(id,pid);
		this._options.onAfterDel.call(this,id);		
		return true;
	},
	delNodeByDom : function(id,pid){
		if(!pid){
			pid=this.getParentid(id);
		}
		var li = this._global.thistree.find("[id='"+id+"']");
		var pli=this._global.thistree.find("[id='"+pid+"']");
		if(li.elems.length>0){
			li.remove();			
			this.setTreeCls(pli);
		}//else{
			var xds=this.getItemsBypid(pid);//dataset.select("pid="+pid);
			if(xds.length===0){				
				this.changeBranchCls(pli);
			}
	},
	removeNodeByid : function(id) {
		this.dataset.remove(function(i, data) {
			return data.id === id;
		});
	},
	/**
	 * 将枝节点变成叶子节
	 * @private
	 */
	changeBranchCls : function(li){
		li.removeAttr("yc");
		var div=li.children("div");
		div.find(".ico-folder-open").setClass("ico-file");
		div.find(".ico-node-open-last").setClass("ico-node-last");
		div.find(".ico-node-open").setClass("ico-node");
		div.find(".ico-folder-close").setClass("ico-file");
		div.find(".ico-node-close-last").setClass("ico-node-last");
		div.find(".ico-node-close").setClass("ico-node");
	},
	/**
	 * 禁用某个复选框
	 * @param {String} id
	 */
	disableChk : function(id){
		var li=this._global.thistree.find("[id='"+id+"']>div");
		var chk= li.find("[class^='ico-checkbox']");
		var oldcls=chk.getClass();
		if(oldcls.indexOf("-disabled")===-1){
		chk.setClass(oldcls+"-disabled");
		}
	},
	/**
	 * 启用某个复选框
	 * @param {String} id
	 */
	enableChk : function(id){
		var li=this._global.thistree.find("[id='"+id+"']>div");	
		var chk= li.find("[class^='ico-checkbox']");
		var oldcls=chk.getClass();
		if(oldcls.indexOf("-disabled")>-1){
			chk.setClass(oldcls.replace("-disabled",""));	
		}
	},
	/**
	 * 隐藏树节点
	 * @param {String} id
	 */
	hideNode : function(id){		
		var li=this._global.thistree.find("[id='"+id+"']");		
		if(li.elems.length===0){
			this.createNodeByChildId(id);
			li = this._global.thistree.find("li[id='" + id + "']");
		}		
			li.find(".ui-tree-selected").removeClass("ui-tree-selected");
			li.hide();
			this.setLast(li);		
	},
	/**
	 * 是否隐藏节点
	 * @param {String} id
	 * @return {Boolean}
	 */
	isHideNode : function(id){
		var li=this._global.thistree.find("[id='"+id+"']");		
		var lishow=this._global.thistree.find("[id='"+id+"'][style!='display: none;']");		
		if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7){
			 lishow=this._global.thistree.find("[id='"+id+"']:visible");
		}
		if(li.elems.length===0){
			return false;
		}else{
			return lishow.elems.length>0?false:true;
		}
	},
	/**
	 * 显示树节点
	 * @param {String} id
	 */
	showNode : function(id){
		var li=this._global.thistree.find("[id='"+id+"']");
		li.show();
		this.setLast(li);
	},
	/**
	 * 设置末端数据样式
	 * @private
	 */
	setLast : function(li){
		var lastlen=li.children("div").find("[class$='-last']").elems.length;
		//if(lastlen>0){
			var pli=li.parents("li:first");
			if(pli.elems.length===0){
				pli =this._global.thistree;
		    }
			var div= pli.find("ul>li:visible>div").elems;			
			var len=div.length;
			var lastdivs=fastDev(div[len-1]);
			var lastprevdivs=fastDev(div[len-2]);
			lastdivs.find(".ico-node").setClass("ico-node-last");
			lastdivs.find(".ico-node-close").setClass("ico-node-close-last");
			lastdivs.find(".ico-node-open").setClass("ico-node-open-last");
			lastprevdivs.find(".ico-node-last").setClass("ico-node");
			lastprevdivs.find(".ico-node-close-last").setClass("ico-node-close");
			lastprevdivs.find(".ico-node-open-last").setClass("ico-node-open");						
		//}
	},
	/**
	 * 编辑树节点
	 * @param  {json} itemstr 一个树节点数据json数据字符串，id不能变
	 * @return {Boolean}
	 */
	editNode : function(item) {
		var id=item.id,options=this._options,global=this._global;
		var tempds=this.getItemsByid(id);//dataset.select("id="+id);
		if(!tempds){
			throw "id为"+id+"的数据不存在，无法修改。";
			return;
		}
		if(options.onBeforeEdit.call(this,item)===false){
			return false;
		}
		var pid=item.parentid || item.pid;
		var val=item.text || item.val;
		var oldpid=tempds.parentid;
		this.dataset.structure.updateNode(item);
		//先改文本
		var li=global.thistree.find("[id='"+id+"']");
		var preid=li.prev("li").attr("id");
		li.children("div").find(".ui-tree-text").setText(val);
		if(pid!==oldpid){
			//改父节点位置
			var iddiv =global.thistree.find("li[id='"+pid+"']"),
			idul=iddiv.children("ul"),
			onlyli=idul.elems.length>0;
			if(pid===options.topParentid && !options.rootValue){
				idul =global.thistree.find("ul:first");
				onlyli=true;
		    }
			if(!onlyli){
				idul=fastDev.Dom.createByHTML("<ul class=\"ui-line\"></ul>");
				iddiv.append(idul);
				idul=iddiv.children("ul");
			}
			idul.append(li);
			if(!onlyli){	
				this.changeLeafCls(iddiv);
			}
			this.showNode(id);
			this.showNode(preid);
			this.setTreeCls(iddiv);
			this.setPart(iddiv);
		}
		this._options.onAfterEdit.call(this,item);
		return true;
	},
	/**
	 * 重新加载
	 */
	reLoad : function(config) {
		this._global.thistree && this._global.thistree.children(".ui-tree").remove();
		if(!!config && !!config.data){
			config.renderer=true;
			this.refreshDataSet(config);
		}else{
			this.initRefresh(config);
		}
	},	
	/**
	 * 将节点收缩的展开或展开
	 * param {String} id
	 */
	setCollect : function(id) {
		var li = this._global.thistree.find("li[id='" + id + "']");
		var spanfh = li.children("div").children(":first");
		this.collect(spanfh);
	},
	/**
	 * 将节点展开
	 * param {String} id
	 */
	setExpand : function(id) {
		var li = this._global.thistree.find("li[id='" + id + "']");
		var spanfh = li.children("div").children(":first");
		this.expand(spanfh);
	},
	//	/**
//	 * 通过叶子节点选中状态的数据给其父祖辈枝节点赋选中与半选值
//	 * @param {Array} item
//	 * @return {Array}
//	 * @private
//	 */
//	getAllChkByData : function(items) {
//		//通过叶子节点选中状态的数据给其父祖辈枝节点赋选中与半选值
//		var allChk = this.getAllCheckedByData(items);
//		this.getAllChkByItem(allChk, items);
//		return items;
//	},
//	/**
//	 * 通过叶子节点选中状态的数据给其父祖辈枝节点赋选中与半选值
//	 * @param {Array} chkitems
//	 * @param {Array} item
//	 * @return {Array}
//	 * @private
//	 */
//	getAllChkByItem : function(chkitems, items) {
//		//通过叶子节点选中状态的数据给其父祖辈枝节点赋选中与半选值
//		var len = chkitems.length, ilen = items.length, id, pid, xditems, pnode, piditems = [], reitems = [], options = this._options;
//		for(var i = 0; i < len; i++) {
//			//1.得到第一个节点的父id
//			pid = chkitems[i]["pid"];
//			if(pid === options.topParentid || this.existNodeByItems(pid, piditems) === true) {
//				continue;
//			}
//			//2.根据父id得到兄弟节点id
//			xditems = this.getNodesByPid(pid);
//			//3.判断是否兄弟节点都被选中
//			for(var j = 0; j < ilen; j++) {
//				if(items[j]["id"] === pid) {
//					pnode = items[j];
//					if(this.allchked(xditems)) {
//						//4.如果都被选中，则父节点选中，否则父节点半选中。
//						pnode["chk"] = "true";
//					} else {
//						pnode["chk"] = "part";
//					}
//					//5.保存此父节点
//					if(this.existNodeByItems(pnode["id"], piditems) === false) {
//						piditems = piditems.slice(0).concat(pnode);
//					}
//					break;
//				}
//			}
//		}
//		//6.得到4里所有节点，递归1-4
//		if(len == 0) {
//			return items;
//		} else {
//			this.getAllChkByItem(piditems, items);
//		}
//	},
//	/**
//	 * id是否存在与数据集中
//	 * @param {String} id
//	 * @param {Array} item
//	 * @return {Boolean}
//	 * @private
//	 */
//	existNodeByItems : function(id, items) {
//		//数据里存在这个节点
//		var len = items.length;
//		for(var i = 0; i < len; i++) {
//			if(items[i]["id"] == id) {
//				return true;
//			}
//		}
//		return false;
//	},
//	/**
//	 * 是否都被选中
//	 * @param {Array} item
//	 * @return {Boolean}
//	 * @private
//	 */
//	allchked : function(items) {
//		//是否都被选中
//		var chked = "", nochk = "", len = items.length;
//		for(var i = 0; i < len; i++) {
//			if("" + items[i]["chk"] === "true") {
//				chked += "k";
//			} else {
//				nochk += "k";
//			}
//		}
//		if(nochk == "") {
//			return true;
//		} else {
//			return false;
//		}
//	},
//	/**
//	 * 隐藏右键菜单
//	 */
//	hideReghtMenu : function() {
//		var options = this._options;
//		if(options.rightMenu) {
//			var obj = options.rightMenu;
//			obj && $("#" + obj).hide();
//		}
//		//if(options.rightMenuNotAtNode) {
////			var obj = options.rightMenuNotAtNode;
////			obj && $(this[0]).find("#" + obj).hide();
////		}
//		if(options.nodeEdit) {
//			$(this[0]).find(".right_mouse_menu").hide();
//		}
//	},
//	/**
//	 * 右键节点编辑功能
//	 * @private
//	 */
//	showNodeEdit : function() {
//		var options = this._options;
//		var that = this;
//		var div1 = talkweb.BaseControl.Div({
//			className : "right_mouse_menu shadow"
//		});
//		div1.hide();
//		var addNode = function() {
//			div1.hide();
//			var pid = that.getCurrentId();
//			var id = "";
//			if(options.onBeforeAdd) {
//				id = options.onBeforeAdd(pid);
//				if(!id)
//					return false;
//			} else {
//				id = that.GetRndId(pid);
//			}
//			var item = "[{pid:'" + pid + "',id:'" + id + "',val:'新节点" + id + "'}]";
//			that.addNode(item) && options.onAfterAdd && options.onAfterAdd(item);
//		};
//		var addNode2 = function() {
//			div1.hide();
//			var pid =that.getParentid(that.getCurrentId());
//			var id = "";
//			if(options.onBeforeAdd) {
//				id = options.onBeforeAdd(pid);
//				if(!id)
//					return false;
//			} else {
//				id = that.GetRndId(pid);
//			}
//			var item = "[{pid:'" + pid + "',id:'" + id + "',val:'新节点" + id + "'}]";
//			that.addNode(item) && options.onAfterAdd && options.onAfterAdd(item);
//		};
//		var editNode = function() {
//			div1.hide();
//			var id = that.getCurrentId();
//			if(options.onBeforeEdit) {
//				var editval = options.onBeforeEdit(id);
//				if(!editval)
//					return false;
//			}
//			var val = that.getCurrentTxt();
//			//创建一个文本框并把文本值赋进去
//			var spantxt = $(that[0]).find("li[id='" + id + "']").children("div").children(":last");
//			var spanwidth = $(spantxt).width();
//			spantxt.html("");
//			var txt = talkweb.BaseControl.Text({
//				value : val,
//				width : spanwidth + "px"
//			});
//			spantxt.html(txt[0]);
//			$(txt[0]).focus();
//			//失去焦点提交修改
//			$(txt[0]).blur(function(e) {
//				var id = that.getCurrentId();
//				var pid = that.getParentid(id);
//				var newval = $(this).val();
//				if(newval != "") {
//					var item = "[{pid:'" + pid + "',id:'" + id + "',val:'" + newval + "'}]";
//					if(that.editNode(item)) {
//						$(this).parent().html(newval);
//						options.onAfterEdit && options.onAfterEdit(item);
//					}
//				}
//			});
//		};
//		var delNode = function() {
//			div1.hide();
//			var id = that.getCurrentId();
//			//得到当前节点id
//			if(options.onBeforeDel) {
//				var delval = options.onBeforeDel(id);
//				if(!delval)
//					return false;
//			}
//			that.delNode(id) && options.onAfterDel && options.onAfterDel(id);
//		};
//		this.addrightMouse("add", "添加子节点", addNode, div1);
//		this.addrightMouse("add", "添加平级节点", addNode2, div1);
//		this.addrightMouse("edit", "编辑节点", editNode, div1);
//		this.addrightMouse("del", "删除节点", delNode, div1);
//		//this.showRightMenu(div1, div2);
//		this.showRightMenu(div1);
//	},
//	//var div2 = talkweb.BaseControl.Div({
////			className : "right_mouse_menu shadow"
////		});
////		var addNode2 = function() {
////			div2.hide();
////			var pid = options.topParentid;
////			var id = "";
////			if(options.onBeforeAdd) {
////				id = options.onBeforeAdd(pid);
////				if(!id)
////					return false;
////			} else {
////				id = that.GetRndId(pid);
////			}
////			var item = "[{pid:'" + pid + "',id:'" + id + "',val:'新节点" + id + "'}]";
////			that.addNode(item) && options.onAfterAdd && options.onAfterAdd(item);
////		};
////		this.addrightMouse("add", "添加跟节点", addNode2, div2);
//	/**
//	 * 右键鼠标事件
//	 * @private
//	 */
//	addrightMouse : function(type, zw, events, con) {
//		var rma = talkweb.BaseControl.Anchor({
//			href : "#",
//			container : con,
//			click : events
//		});
//		var rmd1 = talkweb.BaseControl.Div({
//			className : "right_mouse_menu_item"
//		});
//		rma.append(rmd1);
//		var rmd2 = talkweb.BaseControl.Div({
//			className : "right_mouse_menu_text"
//		});
//		var rms1 = talkweb.BaseControl.Span({
//			value : zw
//		});
//		rmd2.append(rms1);
//		var rmd3 = talkweb.BaseControl.Div({
//			className : "right_mouse_menu_icon right_mouse_icon_" + type
//		});
//		rmd1.append(rmd2).append(rmd3);
//		return rma;
//	},
//	/**
//	 * 右键弹出
//	 * @private
//	 */
//	showRightMenu : function(div1) {
//		//先禁止自带的鼠标右键菜单
//		var that = this, objmenu;
//		document.onmouseup = function(e) {
//			//2.触发鼠标的左键按下的事件
//			var ev = e || window.event || that.getEvent();
//			//只允许通过鼠标左键进行拖拽,鼠标左键为2
//			if(ev.button != 2) {
//				$('body').removeAttr("oncontextmenu");
//				return;
//			}
//			//屏蔽鼠标右键
//			$(document).bind("contextmenu", function(e) {
//				return false;
//			});
//			var options = that._options;
//			var clickTg = $(ev.target || ev.srcElement), ctgclass = $(clickTg).attr("class"), node, id, curr, movePos = that.getMousePos(ev);
//			that.hideReghtMenu();
//			if(ctgclass.indexOf("i-tree-s-text") > 0 || ctgclass.indexOf("i-tree-chk") > 0 || ctgclass.indexOf("i-tree-radio") > 0 || ctgclass.indexOf("i-tree-span-ico-") > 0) {
//				//得到拖拽的容器
//				node = clickTg.parent("div");
//				id = $(node).parent("li").attr("id");
//				//curr=$(node).children(":last");
//				$(that[0]).find(".ui-tree-s-text-current").removeClass("ui-tree-s-text-current");
//				$(node).attr("class", "ui-tree-s-text-current");
//				if(options.rightMenu) {
//					objmenu = options.rightMenu;
//					//在弹出传过来的菜单
//					$("#" + objmenu).css("left", movePos.x + 15 + "px");
//					$("#" + objmenu).css("top", movePos.y - 8 + "px");
//					$("#" + objmenu).show();
//				} else if(div1) {
//					div1.setStyle({
//						"left" : movePos.x + 15 + "px",
//						"top" : movePos.y - 8 + "px"
//					});
//					$(that[0]).parent().append(div1[0]);
//					div1.show();
//				}
//			} //else {
//				//if(options.rightMenuNotAtNode) {
////					objmenu = options.rightMenuNotAtNode;
////					//在弹出传过来的菜单
////					$(that[0]).find("#" + objmenu).css("left", movePos.x + 15 + "px");
////					$(that[0]).find("#" + objmenu).css("top", movePos.y - 8 + "px");
////					$(that[0]).find("#" + objmenu).show();
////				} else if(div2) {
////					div2.setStyle({
////						"left" : movePos.x + 15 + "px",
////						"top" : movePos.y - 8 + "px"
////					});
////					$(that[0]).parent().append(div2[0]);
////					div2.show();
////				} else {
////					return false;
////				}
//			//}
//		}
//	},
//	/**
//	 * 节点拖动事件
//	 * @private
//	 */
//	nodeDragEvent : function() {
//		var opacity = 50, originDragDiv = null, dragDiv, id, isBranchNode, collflag = true, clickTg, tmpX = 0, tmpY = 0, moveable = false, that = this;
//		//1.当可拖动区域触发鼠标的onmousedown事件时
//		$(this[0]).attr("unselectable", "on");
//		$(this[0]).attr("onselectstart", "return false;");
//		$(this[0]).css("-moz-user-select", "none");
//		document.body.onselectstart = function() {
//			return false;
//		};
//		$(this[0]).mousedown(function(e) {
//			var clickTg = $(e.target), ctgclass = $(clickTg).attr("class");
//			if(ctgclass.indexOf("i-tree-s-text") > 0 || ctgclass.indexOf("i-tree-chk") > 0 || ctgclass.indexOf("i-tree-radio") > 0 || ctgclass.indexOf("i-tree-span-ico-") > 0) {
//				//得到拖拽的容器
//				dragDiv = clickTg.parent("div");
//				id = $(dragDiv).parent("li").attr("id");
//			} else {
//				return false;
//			}
//			//可拖动区域
//			var o = that._options, nw = $(clickTg).width() + (o.showIco ? 18 : 0) + (o.treeType == "multitree" ? 18 : 0) + (o.treeType == "radiotree" ? 18 : 0), ev = e || window.event || that.getEvent();
//			//2.触发鼠标的左键按下的事件
//			//只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
//			if(!(that.isIE && ev.button == 1 || !that.isIE && ev.button == 0))
//				return false;
//			//3.创建一个div，复制可拖动区域内容在里面。
//			originDragDiv = talkweb.BaseControl.Div();
//			originDragDiv.setClass("ui-tree-drag-node");
//			originDragDiv.setWidth((nw + 4) + "px");
//			originDragDiv.setHeight("18px");
//			var temphtml = $(dragDiv).clone();
//			$(temphtml).children(":first-child").hide();
//			$(originDragDiv).html($(temphtml).html());
//			moveable = true;
//			//得到拖动区域的zindex
//			that.SetOpacity(originDragDiv, opacity);
//			var dragbfalg = true, dragevent = true;
//			//移动事件
//			document.onmousemove = function(e) {
//				if(moveable) {
//					if(dragbfalg && o.onBeforeDrag) {
//						dragbfalg = false;
//						if(!o.onBeforeDrag(id)) {
//							dragevent = false;
//							return false;
//						}
//					}
//					if(dragevent == false) {
//						return false;
//					}
//					//拖动的半透明节点随鼠标移动
//					var ev = e || window.event || that.getEvent(), movePos = that.getMousePos(ev);
//					$(originDragDiv).css("left", movePos.x - 8 + "px");
//					$(originDragDiv).css("top", movePos.y - 8 + "px");
//					$(that[0]).parent().prepend(originDragDiv);
//					//如果原节点是枝节点，那么其子节点收缩
//					isBranchNode = that.isBranch(id);
//					if(isBranchNode && collflag) {
//						var spanfh = $(dragDiv).children(":first");
//						that.expandCollect(spanfh);
//						collflag = false;
//					}
//				}
//			};
//			//鼠标松开事件
//			document.onmouseup = function(e) {
//				if(dragevent == false) {
//					return false;
//				}
//				moveable = false;
//				//如果底下是有效位置，则添加新的，删除老的
//				e = e || window.event;
//				var ovn = $((e.target || e.srcElement)), ovc = $(ovn).attr("class"), newpid, val, newnodedata;
//				if(ovc.indexOf("i-tree-s-text") > 0 || ovc.indexOf("i-tree-chk") > 0 || ovc.indexOf("i-tree-radio") > 0 || ovc.indexOf("i-tree-span-ico-") > 0) {
//					//得到拖拽到位置的id
//					newpid = ovn.parent("div").parent("li").attr("id");
//					if(newpid && newpid != id) {
//						val = that.getValByid(id);
//						newnodedata = "[{pid:'" + newpid + "',id:'" + id + "',val:'" + val + "'}]";
//						//还有其他属性。。。
//						that.editNode(newnodedata);
//						$(originDragDiv).remove();
//						//如果是枝节点，那么展开
//						if(isBranchNode) {
//							var spanfh = $(dragDiv).children(":first");
//							that.expandCollect(spanfh);
//						}
//						o.onAfterDrag && o.onAfterDrag(id, newpid);
//					}
//				} else {
//					$(originDragDiv).remove();
//					return false;
//				}
//			};
//		});
//	},
//	/**
//	 * 得到事件
//	 * @private
//	 */
	/**
	 * 设置id
	 * param {String} id
	 */
	setID : function(id) {
		if(!id) {
			id = talkweb.ControlBus.getID();
		}
		this._global.thistree.attr("id", id);
	}
});

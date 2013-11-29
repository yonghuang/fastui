/**
* @class fastDev.Ui.SelectTree
* @extends fastDev.Ui.Box 
* 下拉树控件 包括下拉树和下拉多选树，封装树控件，可以结合表单使用。继承自Box。<p>
*  注意事项：下拉树内的相关树配置和树一致。<p>
* 作者：姜玲<p>
*
*		<div itype="SelectTree" initSource="data.txt" rootValue="-请选择-" topParentid="0" openFloor=2>
*		</div>
*/
fastDev.define("fastDev.Ui.SelectTree", {
	extend : "fastDev.Ui.Box",
	alias : "SelectTree",
	_options : {
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
		 * 根节点的文本值（非数据中的根节点）
		 * @type {String}
		 */
		rootValue : null,
		/**
		 * 复选框树显示多选框
		 * @type {Boolean} [mTreeShowCkb=true]
		 */
		mTreeShowCkb : true,
		/**
		 *  只能选中叶子节点的文本
		 * @type {Boolean} 
		 */
		onlySelectedLeaf : false,
		/**
		 *  节点的文本最大长度
		 * @type {number} 
		 */
		textMaxLength:20,
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
		tree:null,
		/**
		 * 下拉树点击之后再加载显示数据
		 * @type {Boolean} [sTreeClickAfterShow=true]
		 */
		sTreeClickAfterShow : true,
		/**
		 * 默认选中的节点id
		 * @type {String}
		 */
		currentId : "",
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
		 * 下拉树的zindex在多个下拉框在一个页面上时可以把下面的设置小些
		 * @type {String} [zindex=0]
		 */		
		zIndex:"200",
		/**
		 * 下拉树的宽度
		 * @type {String} 
		 */
		width:"150px",
		/**
		 * 下拉树弹出层的高度
		 * @type {String} 
		 */
		height:"300px",
		/**
		 * 下面面板弹出方向(auto、up、down) 
		 */
		direction : "auto",
		/**
		 * 初始化下拉树的文本框的显示值
		 * @type {String} 
		 */
		inputValue : "-请选择-",
		/**
		 * 初始化下拉树的隐藏域的值
		 * @type {String}
		 */
		hiddenValue : "",
		/**
		 * 下拉树的文本框的name
		 * @type {String} [inputName="input1"]
		 */
		inputName : "input1",
		/**
		 * 隐藏域的name
		 * @type {String} [hiddenName="hidden1"]
		 */
		hiddenName : "hidden1",
		/**
         * 是否在当前页面展现
         * <p>此属性为false值时，面板将尝试跨出当前子页面展现
         * @type {Boolean}
         */
        inside: true,
        enableDataSet : false,
		enableInitProxy : false,
		enableDataProxy : false,
		/**
		 * @event onBlur
		 * 失去焦点事件
		 * @param {Object}  返回action请求结果
		 */
		onblur:fastDev.noop,
		/**
		 * @event onclick
		 * 点击事件
		 * @param {Object}  
		 */
		onclick:fastDev.noop,
		/**
		 * @event onchange
		 * 选项单击时触发事件
		 * @param {Object}  
		 */
		onchange:fastDev.noop
	},
	_global : {
		treeOptions:",asyncDataSource,initSource,dataSource,currentId,value,topParentid,openFloor,treeType,showLine,showIco,textMaxLength,rootValue,mTreeShowCkb,onlySelectedLeaf,mTreeShowRadio,chkedByLeaf,radioType,partchkValue,partradioValue,onlyLeafValue,onAfterLoadInit,onAfterInitRender,onAfterLoadData,customFields,",
		hasButton:"",
		setToped:false,
		bodyClick:null,
		textClick:null,
		inputDiv:null,
		treeDiv:null,
		tree:null,
		initFinish : false,
		infocus:false,
		inbody:true
	},
	staticTemplate : function(params) {
	  return '<div style="width: '+params.width+';" class="ui-form" ><div id="'+params.id+'" class="ui-form-wrap ui-select"><input type="text" autocomplete="off" readonly="readonly" class="ui-form-field ui-form-input" value="'+params.inputValue+'" name="'+params.inputName+'"/><input type="hidden" value="'+params.hiddenValue+'" name="'+params.hiddenName+'" /><div class="ui-form-trigger" ><div class="ui-select-icon"></div></div></div></div>';
	},
	panelTemplate : function(params) {		
		if(params.hasButton){
			return '<div id="tree_'+params.id+'" class="ui-select-tree" maxdivheight="'+params.height+'" style="width:'+params.width+';z-index:'+params.zIndex+';display:none"><div id="treediv_'+params.id+'"></div><div class="ui-tree-button" id="treebtn_'+params.id+'"><a class="ui-button ui-button-bg" id="ok"><em class="ui-button-em"><span class="ui-button-text">确定</span></em></a><a class="ui-button ui-button-bg" id="cancel"><em class="ui-button-em"><span class="ui-button-text">取消</span></em></a></div></div>';
		}else{
			return '<div id="tree_'+params.id+'" class="ui-select-tree" maxdivheight="'+params.height+'" style="width:'+params.width+';z-index:'+params.zIndex+';display:none"><div id="treediv_'+params.id+'"></div></div>';
		}
	},	
	tplParam : ["id","width","zIndex","inputValue","hiddenValue","inputName","hiddenName","hasButton","height","inside","inbody"],	
	fields : ["id","pid","val",{name : "chk",defaultValue : "false"},{name : "radio",defaultValue : "false"},{name : "asyn",defaultValue : "false"},{name:"font",defaultValue : ""},{name:"ico",defaultValue : ""},{name:"readonly",defaultValue : "false"},{name:"disabled",defaultValue : "false"},{name:"nocheck",defaultValue : "false"}],
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {
		var width;
		if (width = /^(-?\d+\.?\d+|-?\d)(px|%|em|cm)?$/.exec(fastDev.Util.StringUtil.trim(options.width + ""))) {
            options.width = width[1] + (width[2] || "px");
        } else {
            options.width = "150px";
        }
		if(options.id===""){
			options.id=fastDev.getID();
		}
		if(options.value!==""){
			options.currentId=options.value;
		}
		if(options.currentId!==""){
			options.value=options.currentId;
		}
		if(options.customFields){			
			this.fields =this.fields.slice(0).concat(options.customFields.split(','));
		}
		var treeOptions=global.treeOptions;
		if(fastDev.isEmptyObject(options.tree)){
			options.tree={};
		}
		for(var o in options){			
			if(treeOptions.indexOf(","+o+",")>-1 && !options.tree[o] && options[o]!==""){				
				options.tree[o]=options[o];
			}						
		}
		options.tree.id="t_"+options.id;
		if(options.tree.treeType==="multitree" || options.tree.treeType==="radiotree"){
			global.hasButton="true";
		}
		fastDev.apply(options, {
			 inside:fastDev.Util.position.top.fastDev === fastDev || !! options.inside
        });
		// 如果当前window对象就是顶层window，则不做跨级
		// 设定面板上下文
		global.panelContext = (options.inside = (options.inside === false && window.top === window) ? true : options.inside) ? window : window.top;
	},
	/**
     * 构造控件
     * @param {Object} options
     * @param {Object} global
     * @protected
     */
    construct: function (options, global) {
		var context = global.panelContext,
		// 设定面板所在容器
		container = fastDev(global.panelContext.document.body);
		// 创建面板至容器
		global.panel = context.fastDev(this.panelTemplate(global.params)).appendTo(container);
		var items,me=this;
		if(options.items){
			if(typeof options.items==="string"){
				items=fastDev.Util.JsonUtil.parseJson(options.items);
			}else{
				items=options.items;
			}
			options.tree.items=items;
		}
		options.tree.container =global.panel.find("div[id='treediv_"+options.id+"']");//this.find("div[id='treediv_"+options.id+"']");
		options.tree.onNodeClick=function(event,id,val){
			me.treeNodeClick(event,id,val);
		};
		options.tree.onAfterDataRender=function(){
			var value= this.getValue();	
			var tv=me.getValue();
			me.setValue(value);
			if(!tv){
			options.onAfterDataRender.call(me);
			}
		};
		if(options.sTreeClickAfterShow===false || !!options.tree.currentId || !!options.tree.dataSource){
			var tree=global.panelContext.fastDev.create("Tree", options.tree);
			global.tree=tree;
		}		
		this.setConstruct(options,global);
		this.bindEvent(options,global);
	},
	/**
	 * 设置控件属性
	 * @private
	 */
	setConstruct : function(options,global) {
		global.inputDiv=this.find("div[id='"+options.id+"']");		
		global.treeDiv=global.panel;
		global.box = global.inputDiv.find("input:text");
	},
	/**
	 * 修正动态模板创建的元素位置
	 * @private
	 */
	fixedPosition : function(global) {
				var treediv=global.treeDiv;//fastDev(this.elems[2]);
				var optionheight=parseInt(treediv.attr("maxdivheight"),10);
				treediv.height(optionheight);
				treediv.width(global.inputDiv.width()+21);
				treediv.removeCss("top");
				treediv.removeCss("left");
				treediv.css("overflow","auto");
				//fastDev.Util.position.locate(treediv, global.inputDiv,global.panelContext);
		fastDev.Util.position.locate(treediv, global.inputDiv, global.panelContext,null,null,this._options.direction);
				var treedivtop=parseInt(treediv.css("top"),10);
				if(treedivtop<global.inputDiv.offset().top){
					treediv.css("border-top","1px solid #98C0F4");
				}
	},
	/**
	 * 设置当前组件是否只读
	 * @param {Boolean} [readonly=true] 是否只读
	 */
	setReadonly : function(readonly) {
		var global = this._global, options = this._options;
		// 目标状态与当前状态一致或者组件被禁用则当前操作无效
		if(options.readonly === (readonly = readonly === false ? false : true) || options.disabled === true) {
			return;
		}
		options.readonly = readonly;
		var method = "bind";
		if(readonly) {
			method = "unbind";
			global.inputDiv.addClass("ui-form-disabled");
		}else{
			global.inputDiv.removeClass("ui-form-disabled");			
		}
		global.inputDiv[method]("click", global.textClick);
		return this;
	},
	/*
	 * 事件注册
	 * @private
	*/
	bindEvent : function(options,global) {
		var me=this,inputDiv=global.inputDiv,treeDiv=global.treeDiv;
		var textClick=function(event){
			global.infocus=true;
			var text = treeDiv.find("div.ui-tree-panel").elems;
			me.fixedPosition(global);
			if(text.length === 0) {	
				treeDiv.removeCss("display");				
				global.tree=global.panelContext.fastDev.create("Tree", options.tree);
			}else{
				treeDiv.removeCss("display");			
			}
			 options.onclick.call(this,event);
		};	
		global.textClick =textClick;
		inputDiv.unbind("click");
		if(options.readonly===false){
			inputDiv.bind("click", textClick);
		}
		 if(options.tree.treeType==="multitree" || options.tree.treeType==="radiotree"){			
			var btnCancel=treeDiv.find("a[id='cancel']");
			var btnOk=treeDiv.find("a[id='ok']");
			var okClick=function(){
			    var tree=global.tree,texts,vType=tree.getValueType();
				var ids = options.tree.treeType === "radiotree" ? tree.getRadioedIds(vType) : tree.getChkedIds(vType);
				if(ids) {
					texts = tree.getValsByids(ids);
				}else{
					texts="";
				}
				treeDiv.hide();
				inputDiv.find("input:text").prop("value",texts);
				inputDiv.find("input[type='hidden']").prop("value",ids);
			};
			var cancelClick=function(){
				treeDiv.hide();
			};
			btnOk.bind("click", okClick);
			btnCancel.bind("click", cancelClick);
	    }
		var bodyClick=function(event){
			  var target = event.target,
			  clickTg = fastDev(target),
			  ctgclass = clickTg.getClass(),
			  targetInTreeDiv=clickTg.parents("div.ui-select-tree").elems.length>0?true:false,
			  treedct=treeDiv.contains(target),
			  inputdct=inputDiv.contains(target);
			   if((!targetInTreeDiv || !treedct) && !inputdct){
				   treeDiv.hide();
				   //inputDiv.find(".ui-form-input").removeClass("ui-form-focus");
				   //fastDev(me.elems[0]).removeClass("ui-form-focus");
				   fastDev(me.elems[0]).find(".ui-form-wrap.ui-select").removeClass("ui-form-focus");
				   inputDiv.find("div.ui-form-trigger").removeClass("ui-form-trigger-over");
				   var txt=me.getText();
				   if(options.inputValue===txt){
				      inputDiv.find("input[type='hidden']").prop("value",options.hiddenValue);
				   }
				   if(!fastDev.isNoop(options.onblur) && global.infocus){
						global.infocus=false;
						me.onSelectTreeBlur(event,options.onblur);
				   }				
			 }else{
				if(inputdct){
					global.infocus=true;
					//inputDiv.find(".ui-form-input").addClass("ui-form-focus");
					fastDev(me.elems[0]).find(".ui-form-wrap.ui-select").addClass("ui-form-focus");					
					inputDiv.find("div.ui-form-trigger").addClass("ui-form-trigger-over");
				}else if(treedct){
					//inputDiv.find(".ui-form-input").removeClass("ui-form-focus");
					fastDev(me.elems[0]).find(".ui-form-wrap.ui-select").removeClass("ui-form-focus");
					inputDiv.find("div.ui-form-trigger").removeClass("ui-form-trigger-over");
					  if(options.onchange!==fastDev.noop && ctgclass.indexOf("ui-tree-text")>-1){
						  var li=clickTg.find("li:first");
						  if(li.elems.length===0){
							li= clickTg.parents("li:first");
						  }
						  if(li.elems.length>0){
							var id=li.attr("id");
							var val=global.tree.getValByid(id);//;li.find(".ui-tree-text ").getText();
							if(id===options.topParentid){
								id="";
								val="";
							}
							var spanReadonly=li.find("span.ui-tree-text-readonly").elems.length;
							if(spanReadonly===0){						
								options.onchange.call(this,id,val);
							}
						  }
					  }
				  }
			  }
		};
		global.bodyClick=bodyClick;
		//fastDev("body").bind("click",bodyClick);
		
		// 在当前窗体增加失去焦点隐藏面板功能
		fastDev("html").bind("click", global.bodyClick);
		if(options.inside === false) {
			// 在顶级窗体中增加失去焦点隐藏面板功能	
			global.panelContext.fastDev("html").bind("click", global.bodyClick);
			var unloadHandle = fastDev.setFnInScope(this,function(){
				global.panelContext.fastDev("html").unbind("click", global.bodyClick);
				treeDiv.hide();
				this.destroy();
			});
			fastDev(window).bind("unload",unloadHandle);
		}
		
	},
	/**
	 * 控件销毁方法
	 */
	destroy : function() {
		fastDev("html").unbind("click",this._global.bodyClick);
		this.superClass.destroy.call(this);
	},
	/*
	 * 节点点击事件
	 * @private
	*/
	treeNodeClick:function(event,id,val){
		var global=this._global,inputDiv=global.inputDiv,treeDiv=global.treeDiv;
		var div=treeDiv;//fastDev(this.elems[0]).parent().parent();
	    if(div.find(".ui-button").elems.length>0){
		   return;
	    }
		div.hide();
		var divparent=inputDiv;//div.parent();
		if(!!val){
		divparent.find("input:text").prop("value",val);
		divparent.find("input[type='hidden']").prop("value",id);
		}else{
			divparent.find("input:text").prop("value",this._options.inputValue);
			divparent.find("input[type='hidden']").prop("value",this._options.hiddenValue);
		}	
		//this._options.onchange.call(this,id,val);
		//this.find("input[type='hidden']").dblclick();	
		this.fire("focus");
	},
	/*
	 * 失去焦点事件
	 * @private
	*/
	onControlBlur : function(handle){		
		this.onBlur(handle);
	},
	/**
     * 绑定事件
     * @param {String} type 事件类型
     * @param {Function} handle 事件句柄 
     * @private 
     */
    bind: function (type, handle) {
        if (type === "blur") {
            this._options.onblur = handle;
        } else {
            this.superClass.bind.apply(this, arguments);
        }
        return this;
    },
	onBlur : function(handle){
		this._options.onblur = handle;
		return this;
	},
	onSelectTreeBlur : function(event,handle) {	
			handle.call(this, event);	
	},
	/**
	 * 清空下拉框树的文本框与隐藏域中的值
	 */
	clean: function() {
		var global=this._global,options=this._options,inputDiv=global.inputDiv,treeDiv=global.treeDiv;
		if(!!inputDiv){
		inputDiv.find("input:text").prop("value",options.inputValue);
		inputDiv.find("input[type='hidden']").prop("value",options.hiddenValue);
		if(global.tree){
			global.tree._options.currentId = "";
		}
		this._options.currentId = "";
		treeDiv.find("span.ui-tree-selected").removeClass("ui-tree-selected");
		treeDiv.find(".ico-checkbox-checked,.ico-checkbox-half").setClass("ico-checkbox");
		}
	},
	/**
	 * initSource数据源刷新
	 * @param {JsonObject/String} [config] 刷新参数/刷新地址
	 */
	initRefresh : function(config){
		var options=this._options,global=this._global;
		this.clean();
		this._global.treeDiv.find("div.ui-tree-panel").children().remove();
		if(this._options.items && !config){
			config={};
			config.data=this._options.items;
		}
		if(!!config.url || !!config.data){
			 this._global.tree.dataset.clean();
		}		
		this._global.tree.reLoad(config);
	},
	/**
	 * 设置选中的id值
	 * @param {String} id
	 */
	setValue : function(id){
		if(id===""){
			this.clean();
			return;
		}
		if(typeof id === "number"){
			id=""+id;
		}
		var global=this._global,options=this._options,inputDiv=global.inputDiv,treeDiv=global.treeDiv,falg=false,value,oldid;
		if(options.tree.treeType==="normal"){
			if(global.tree===null){
				options.tree.currentId = id;
				//options.tree.value = id;
				//alert(options.tree.initSource);
				global.tree=global.panelContext.fastDev.create("Tree", options.tree);
				falg=true;
			}
			value=global.tree.getValByid(id);
			
			if(value){
				if(falg===false){
					global.tree.setCurrentId(id);
				}
				inputDiv.find("input:text").prop("value",value);
				oldid=inputDiv.find("input[type='hidden']").prop("value");
				inputDiv.find("input[type='hidden']").prop("value",id);
				
			}
		}else{
			if(global.tree===null){
				//options.tree.currentId = id;
				options.tree.value = id;
				//alert(options.tree.initSource);
				global.tree=global.panelContext.fastDev.create("Tree", options.tree);
				falg=true;
			}
			value=global.tree.getValsByids(id);
			
			if(value){
				//if(falg===false){
				//	global.tree.setCurrentId(id);
				//}
				inputDiv.find("input:text").prop("value",value);
				oldid=inputDiv.find("input[type='hidden']").prop("value");
				inputDiv.find("input[type='hidden']").prop("value",id);
				
			}
		}
		if(!!oldid && oldid!==id){
				if(options.onchange!==fastDev.noop){
					if(id===options.topParentid){
						id="";
						value="";
					}
					options.onchange.call(this,id,value);
				}
		}
	},
	/**
	 * 设置下拉树文本框和隐藏域的值
	 * @param {String} id
	 * @param {String} text
	 */
	setTextAndValue : function(id,text){
		this._global.inputDiv.find("input[type='hidden']").prop("value",id);
		this._global.inputDiv.find("input:text").prop("value",text);
	},
	/**
	 * 获取选中的id值
	 * @return {String}
	 */
	getValue : function(){
		var value=this._global.inputDiv.find("input[type='hidden']").prop("value");
		if(value===this._options.topParentid){
			return "";
		}
		return value;
	},
	/**
	 * 获取选中的文本值
	 * @return {String}
	 */
	getText : function(){	
		var text=this._global.inputDiv.find("input:text").prop("value");
		if(text===this._options.inputValue){
			return "";
		}
		return text;
	}
});

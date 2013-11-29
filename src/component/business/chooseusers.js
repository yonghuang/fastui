/**
 * @class fastDev.Ui.Chooseusers
 * @extends fastDev.Ui.Component
 * 选人控件。主要是这对工作流审批页面中的流程过程、人员选择的组件封装。依赖树，下拉框，按钮，表单组件<p>
 * 注意事项：选人控件若放在表单容器内使用时，表单必须要能得的到实例，也就是要有id和saveInstance为true<p>
 * 作者：姜玲
 *
 *		<div itype="Chooseusers" name="chooseusers1" id="chooseusers1"  saveInstance="true"  
   selectInitSource="selectuser2.jsp" treeInitSource="usertree2.jsp" beforeSubmit="submitbefore()"></div>
 */
fastDev.define("fastDev.Ui.Chooseusers", {
	extend : "fastDev.Ui.Component",
	alias : "Chooseusers",
	_options : {
		 /**
		 * 第一个下拉框的数据源url
		 * @type {String}
		 */
		selectInitSource : "", 
		/**
		 * 用户下拉列表的数据源url
		 * @type {String}
		 */
		userInitSource : "", 
		/**
		 * 树数据源url
		 * @type {String}
		 */
		treeInitSource : "", 
		/**
		 * 节点文本的默认长度,默认50个汉字或100个英文，超过长度的截取...，文本悬停有提示
		 * @type {Number} 
		 */
		textMaxLength:100,
		/**
		 * 异步的树数据源url
		 * @type {String}
		 */
		treeAsyncSource : "", 
		/**
		 * 提交action
		 * @type {String}
		 */
		action : null,
		 /**
		 * 参数名
		 * @type {String}
		 */
		param1name : "s1",
		/**
		 * 是否提交提交后禁用表单元素
		 * @type {Boolean}
		 */
		isSubmitDisabled : true,
		/**
		 * 名称
		 * @type {String}
		 */
		name : "",
		/**
		 * 提交之后的自定义事件
		 * @event
		 */
		submitCallback : null,
		/**
		 * 提交之前的事件
		 * @event
		 */
		beforeSubmit : null,		
		enableDataSet : false,
		enableInitProxy : false,
		enableDataProxy : false
	},
	_global : {
		select1 : null,
		usetree : null,
		button1 : null,
		button2 : null,
		button3 : null,
		button4 : null,
		multiple : null,
		submitBtn : null,
		multdata : "",
		formid : ""
	},
	/*template : [
		'<div id="#{id}" name="#{name}" class="ui-chooseuser-div">', 
			'<div class="ui-chooseuser-l-div1">', 
				'<span class="ui-chooseuser-title">处理步骤</span>',
			'</div>',
			'<div class="ui-chooseuser-l-div2">', 
				'<span class="ui-chooseuser-title">选择用户</span>',
				'<div class="ui-chooseuser-tree"></div>',				
			'</div>',
			'<div class="ui-chooseuser-l-div3">', 
			'</div>',
			'<div class="ui-chooseuser-l-div4">', 
				'<span class="ui-chooseuser-title">用户列表</span>',
			'</div>',
			'<div class="ui-chooseuser-l-div5">',
			'</div>',
		'</div>'
	],*/
	tplParam : ["id","name"],
	staticTemplate : function(params) {
	  return '<div id="'+params.id+'" name="'+params.name+'" class="ui-chooseuser-div"><div class="ui-chooseuser-l-div1"><span class="ui-chooseuser-title">处理步骤</span></div><div class="ui-chooseuser-l-div2"><span class="ui-chooseuser-title">选择用户</span><div class="ui-chooseuser-tree"></div></div><div class="ui-chooseuser-l-div3"></div><div class="ui-chooseuser-l-div4"><span class="ui-chooseuser-title">用户列表</span></div><div class="ui-chooseuser-l-div5"></div></div>';
	},
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {		
		if(!options.id) {
			options.id = fastDev.getID();
		}
		options.saveInstance=true;
	},
	/**
	 * 构建控件
	 * @protected
	 */
	construct : function(options, global) {		
		var that = this,div1 = this.find(".ui-chooseuser-l-div1"),div2 = this.find(".ui-chooseuser-l-div2"),div3 = this.find(".ui-chooseuser-l-div3"),
		div4 = this.find(".ui-chooseuser-l-div4"),div5 = this.find(".ui-chooseuser-l-div5"),divtree=this.find(".ui-chooseuser-tree");
		var select1,usetree,button1,button2,button3,button4,multiple,submitBtn;
		select1 =fastDev.create("Select", {
			container : div1,
			width:"100%",
			initSource : options.selectInitSource,
			onchange : function(){
				 that.changTreeEvent();
			}
		});
		button1 = fastDev.create("Button",{
			container : div3,
			width : "40px",
			onclick:function(){
				that.addUsers();
			},
			text : ">>"
		});
		button2 = fastDev.create("Button",{
			container : div3,
			text : "<<",
			width : "40px",
			onclick:function(){
				that.delUsers();
			},
			disabled : true
		});
		button3 = fastDev.create("Button",{
			container : div3,
			text : "∧",
			width : "40px",
			onclick:function(){
				 that.upUsers();
			},
			disabled : true
		});
		button4 = fastDev.create("Button",{
			container : div3,
			text : "∨",
			width : "40px",
			onclick:function(){
				 that.downUsers();
			},
			disabled : true
		});		
		multiple = fastDev.create("Select",{
			container : div4,
			multiple : true,
			width : "90%",
			initSource : options.userInitSource,
			onItemDblclick:function(e){
				that.delUsers(e);
			},
			onAfterLoadData : function(){
				  var items=this.getItems();
				  var multdata = ".,";
				  for(var i = 0; i < items.length; i += 1) {
					  multdata += items[i].value + ",";
				  }
				  global.multdata = multdata;
			},
			size : 7
		});	
		//if(options.treeInitSource !== "") {
			usetree =fastDev.create("Tree",{
				container : divtree,
				initSource : options.treeInitSource,
				asyncDataSource : options.treeAsyncSource,				
				treeType : "multitree",
				openFloor:2,
				textMaxLength:options.textMaxLength,
				onlySelectedLeaf:true,
				mTreeShowCkb : false,
				onAfterLoad : function(){
					 that.addUserByItems();
				},
				onNodeDblClick :  function(e,id,val){
					that.addUser(id,val);
				}
			});
		//}		
		submitBtn = fastDev.create("Button",{
			container : div5,
			iconPosition:"top",
			iconCls:"icon-procedure",
			onclick: function(){		
				var id=fastDev(this.elems[0]).parents("form:first").attr("id");		
				global.formid=id;
				if(id) {
				  that.submitForm();
				} else {
				  that.submitUsers();
				}
			},
			text : "流程处理"
		});		
		this.setGlobal({
			select1 : select1,
			usetree : usetree,
			button1 : button1,
			button2 : button2,
			button3 : button3,
			button4 : button4,
			multiple : multiple,
			submitBtn : submitBtn
		});		
	},
	/**
	 * 重新加载树数据源
	 * @param {string}treeInitSource
	 * @param {string}treeAsyncSource 可选
	 */
	reloadTree:function(treeInitSource,treeAsyncSource){
			var tree=this._global.usetree;
			if(tree){
			this.find(".ui-tree").remove();
			if(!!treeInitSource){
				if(!!treeAsyncSource){
				tree.setOptions({
					asyncDataSource:treeAsyncSource
				});
				}
				tree.reLoad({url:treeInitSource});
			}else{
			tree.reLoad();
			}
			}
			this.delOldUsers();
	},
	/**
	 * 如果只有一个用户就自动添加
	 * @private
	 */
	addUserByItems : function() {
		//
		//得不到表单实例
		var global = this._global;
		var multiple = global.multiple;
		var usetree = global.usetree;
		var user = usetree.getAllLeafItems();
		if(user.length===1){
			user=user[0];
		var id,val;		
		if(user.id){
			id = user.id;
			val = user.val;
			usetree.hideNode(id);
			this.delOldUsers();
			multiple.addItems({
				value : id,
				text : val
			});
			var btn1 = global.button1;
			var btn2 = global.button2;
			var btn3 = global.button3;
			var btn4 = global.button4;
			btn1.enable();
			btn2.enable();
			btn3.enable();
			btn4.enable();
		}
		}
	},
	 /**
	 * 重新加载
	 */
	reload : function() {
		var thisdom=fastDev(this.elems[0]);
		 thisdom.find(".ui-select-list ").remove();
		 thisdom.find(".ui-chooseuser-l-div1").children(".ui-form").remove();
		 thisdom.find(".ui-chooseuser-tree").children("div").remove();
		 thisdom.find(".ui-button").remove();
		 this.construct(this._options,this._global);
	},
	/**
	 * 第一个下拉框值改变事件
	 * @private
	 */
	changTreeEvent : function() {
		//第一个下拉框改变值事件
		var select1 = this._global.select1;
		var s1Value = select1.getValue();
		s1Value=s1Value.split('^')[0];
		var options = this._options;
		var treeInitSource = options.treeInitSource;
		var fh = (treeInitSource.indexOf("?") > 0) ? "&" : "?";
		var url = treeInitSource + fh + options.param1name + "=" + s1Value;
		var tree = this._global.usetree;
		this.find(".ui-tree").remove();
		this.delOldUsers();
		tree.reLoad({url:url});
	},
	/**
	 * 改变按钮是否禁用
	 * @private
	 */
	chandbtndisabled : function() {
		//改变按钮是否禁用
		var global=this._global;
		var multiple = global.multiple;
		var len=multiple.getItems().length;
		if(len > 0) {
			var btn2 = global.button2;
			btn2.enable();
			if(len > 1) {
				var btn3 = global.button3;
				var btn4 = global.button4;
				btn3.enable();
				btn4.enable();
			}
		}
	},
	/**
	 * 树节点双击添加节点到下拉列表事件
	 * @private
	 */
	addUser : function(id, val) {
		//树节点双击事件
		var global=this._global;
		var usetree = global.usetree;	
		if(usetree.isLeaf(id)===false || val===undefined){
			return ;
		}
		var multiple = global.multiple;
		if(this.onemen()) {
			var mitem = multiple.getItems();
			if(mitem && mitem.length > 0) {
				return false;
			}
		}	
			var select1=global.select1,s1Value = select1.getValue(),newid,newval;
			var userlist=this.getUserlist();
				if(s1Value.indexOf("^2")>0){
					newid=s1Value+"："+id;
					newval=select1.getText()+"："+val;					
					if(userlist.indexOf(s1Value+"：")>0){
						return;
					}					
					multiple.addItems({value:newid,text:newval});	
				}else if(s1Value.indexOf("^3")>0){
					newid=s1Value+"："+id;
					newval=select1.getText()+"："+val;					
					if(userlist.indexOf(newid)>0){
						return;
					}
					multiple.addItems({value:newid,text:newval});	
				}else{
					if(userlist.indexOf(id)>0){
						return;
					}
					multiple.addItems({value:id,text:val});			
				}
				usetree.hideNode(id);
				this.chandbtndisabled();
		
	
	},	
	/**
	 * >>按钮点击事件
	 * @private
	 */
	addUsers : function(e) {
		//>>
		var global=this._global;
		var usetree = global.usetree;
		var treenodes = usetree.getSelectedIds();
		if(!treenodes) {
			return false;
		}
		var values = "";
		var multiple = global.multiple;
		if(this.onemen()) {
			var mitem = multiple.getItems();
			if(mitem && mitem.length > 0) {
				return false;
			}
		}
		var select1=global.select1;		
		var s1Value = select1.getValue();		
		var s1Text=select1.getText();
			
		for(var i = 0; i < treenodes.length; i += 1) {
			var tid = treenodes[i],val=usetree.getValByid(tid),userlist=this.getUserlist(),newid,newval;
			if(s1Value.indexOf("^2")>0){
				newid=s1Value+"："+tid;
				newval=s1Text+"："+val;						
				if(userlist.indexOf(s1Value+"：")>0){
				   continue;
				}
				values={"value":newid,"text":newval};
			}else if(s1Value.indexOf("^3")>0){
				newid=s1Value+"："+tid;
				newval=s1Text+"："+val;						
				if(userlist.indexOf(newid)>0){
				   continue;
				}
				values={"value":newid,"text":newval};
			}else{
				if(userlist.indexOf(tid)>0){
				   continue;
				}					
				values={"value":tid,"text":val};
			}
			usetree.hideNode(tid);
			multiple.addItems(values);
			if(this.onemen()){break;}
		}
		this.chandbtndisabled();
	},
	/**
	 * 是否只要一个人
	 * @private
	 */
	onemen : function() {
		var select1 = this._global.select1;
		var s1Value = select1.getValue();
		var onemen = s1Value.lastIndexOf("^0") > 0 ? true : false;
		return onemen;
	},
	/**
	 * 删除老的用户
	 * @private
	 */
	delOldUsers : function() {
		var global=this._global;
		var multdata = global.multdata;
		var multiple = global.multiple;
		var items = multiple.getItems();
		for(var i = 0; i < items.length; i += 1) {
			var id = "" + items[i].value;
			if((multdata === "" || multdata.indexOf("," + id + ",") < 0) && id.indexOf("：")===-1){
				multiple.removeItems(id);
			}
		}
	},
	/**
	 * <<按钮事件，删除用户
	 * @private
	 */
	delUsers : function(e) {
		//<<
		var global=this._global,id,text,value,
		multiple=global.multiple,
		multdata=global.multdata,
		usetree=global.usetree,
		select1=global.select1,	
		items=multiple.getSelectedItem();
		if(items.length===0 && e){
			text=fastDev(e.target).getText();	
			value=fastDev(e.target).attr("ivalue");
			items={"value":value,"text":text};
			items=[].concat(items);	
		}		
		var s1Value = select1.getValue();						
		for(var i=0;i<items.length;i+=1){
			id=items[i].value,value=items[i].value;
			if(value.indexOf("：")>-1){
				id=value.split('：')[1];
				if(s1Value!==value.split('：')[0]){
					continue;
				}
			}
			if(multdata==="" || multdata.indexOf(","+id+",")<0){
				text=items[i].text;
				if(text.indexOf("：")>-1){
					text=text.split('：')[1];
				}					
				multiple.removeItems(value);
				if(value.indexOf("：")>-1){
					var treediv=this.find(".ui-chooseuser-tree");
					var treeli=treediv.find("li[id='"+id+"']");
					if(treeli.length>0){
						continue;
					}
				}
				//var pid=usetree.getParentid(id);	
				//usetree.addNode('[{pid:"'+pid+'",id:"'+id+'",val:"'+text+'"}]');
				usetree.showNode(id);
			}
		}			
		//树增加节点
		this.chandbtndisabled();
	},
	/**
	 * 上移按钮事件，上移用户
	 * @private
	 */
	upUsers : function(e) {
		//上移		
		var multiple = this._global.multiple;
		multiple.moveUp();
	},
	/**
	 * 下移按钮事件，下移用户
	 * @private
	 */
	downUsers : function(e) {
		//下移
		var multiple = this._global.multiple;
		multiple.moveDown();
	},
	/**
	 * 提交流程处理
	 * @private
	 */
	submitUsers : function(e) {
		//流程处理	
		var options = this._options;
		var data = this.getUserlist();
		if(!data) {
			return false;
		}
		if(!!options.beforeSubmit) {
			if(!options.beforeSubmit(data))
				return false;
		}
		this.disabledSubmitBtn();
		data=  "data={" + data + "}";
		this.initProxy.setAction(options.action);
		this.initProxy.save(data,options.submitCallback);	
		return false;
	},
	/**
	 * 提交表单
	 * @private
	 */
	submitForm : function(e) {		
		var options = this._options,global= this._global;
		var multiple = global.multiple;
		var data = multiple.getItems();
		if(!data) {
			return false;
		}
		if(!!options.beforeSubmit) {
			if(!options.beforeSubmit(data))
				return false;
		}
		this.disabledSubmitBtn();
		var form = fastDev.getInstance(global.formid);
		form.submit();
	},
	/**
	 * 提交按钮启用
	 */
	unDisabledSubmitBtn : function() {	
		var submitBtn = this._global.submitBtn;
		submitBtn.enable();
	},
	/**
	 * 提交按钮禁用
	 */
	disabledSubmitBtn : function() {
		var options = this._options;
		if(options.isSubmitDisabled) {
			var submitBtn = this._global.submitBtn;
			submitBtn.disable();
		}
	},
	/**
	 * 得到选择的用户
	 * @private
	 */
	getUserlist : function() {
		var options = this._options;
		var multiple = this._global.multiple;
		var data = multiple.getItems();
		if(!data) {
			return false;
		}
		var values = "[";
		for(var i = 0; i < data.length; i += 1) {
			var value = data[i].value;
			var text = data[i].text;
			values += "{value:'" + value + "',text:'" + text + "'},";
			//values+=value+",";
		}
		if(data.length > 0) {
			values = values.substr(0, values.length - 1);
		}
		values += "]";
		return values;
	},
	/**
	 * 得到值
	 * @return {String}
	 */
	getValue : function() {		
		var usersdata = this.getUserlist();
		var select1 = this._global.select1;
		var value = "";
		var select1data = select1.getValue();
		var stepname = select1.getText();
		if(select1data) {
			value = "{stepdata:'" + select1data.split('^')[0] + "',stepname:'" + stepname + "',userdata:" + usersdata + "}";
		}
		return value;
	},
	/**
	 * 获取控件name
	 * @return {String}
	 * @private
	 */
	getName : function() {
		return this._options.name;
	}	
});

/**
* @class fastDev.Ui.Form
* @extends fastDev.Ui.Component 
* 此控件用于表单操作,对表单的加载、提交以及验证三大功能做了封装，继承自Component，表单类控件。<p>
* 注意事项：本版本的表单只有html模式，表单里的布局自由控制。如想实现类似之前js布局，可用表格布局，在table上加样式ui-form-table，放文本的td加样式ui-form-table-dt，放控件的td加样式ui-form-table-dd即可。<p>
* 作者：姜玲<p>
*
*		<form itype="Form" action="example_submit.jsp" id="form1" initSource="example_1_init.jsp" dataSource="example_1_load.jsp" requestType="post" saveInstance="true" onSubmitSuccess="submitSuccess()">
*			<!--表单内的各个控件...-->
*		</form>
*/
fastDev.define("fastDev.Ui.Form", {
	extend : "fastDev.Ui.Component",
	alias : "Form",
	_options : {
		/**
		 * 表单控件初始化数据来源URL地址
		 * @type {String}
		 */
		initSource : null,
		/**
		 * 表单控件的值来源URL地址
		 * @type {String}
		 */
		dataSource : null,
		/**
		 * 表单控件初始化静态数据（有initSource数据源的话，会覆盖此静态数据源）
		 * @type {json}
		 */
		items:null,
		/**
		 * 表单控件的值（有dataSource数据源的话，会覆盖此静态数据值）
		 * @type {json}
		 */
		value:null,
		/**
		 * 表单提交目标URL地址
		 * @type {String}
		 */
		action : null,		
		/**
		 * 表单提交方式"get"、"post"，默认"get"
		 * @type {String}[requestType="get"]
		 */
		requestType : "get",		
		/**
		 * 是否提交Json格式数据，默认true
		 * @type {Boolean}[submitJson=true]
		 */
		submitJson : true,	
		/**
		 * 追加提交的数据
		 * @type {Json}[{"name":"控件名1","value":"控件值1"},{"name":"控件名1","value":"控件值1"},...]或者{"控件名1":"值一","控件名2":"值二",...}
		 */	
		otherSubmitData : "",
		/**
		 * 验证信息配置.json文件地址
		 * @type {String}
		 */
		errorFile : null,
		/**
		 * 是否开启验证，默认true
		 * @type {Boolean}
		 */
		validate : true,
		/**
		 * 是否验证已经隐藏掉的控件，默认true
		 * @type {Boolean}
		 */
		isValidHidden : true,
		/**
		 * 是否设置为实例，默认true
		 * @type {Boolean}
		 */
		saveInstance: true,
		/**
		 * 验证提示信息
		 * @type {json}
		 */
		errorMsg : null,
		/**
		 * 清空数据,如设false重置到表单的dataSource值，默认true
		 * @type {Boolean}[resetToBlank=true]
		 */
		resetToBlank : true,
		enableDataSet : false,
		enableInitProxy : true,
		enableDataProxy : true,
		/**
		 * @event onDisplayError
		 * 自定义错误显示处理  
		 * @param {Array} errorArray
		 */
		onDisplayError : fastDev.noop,
		/**
		 * @event onBeforeInitalize
		 * 表单初始化之前的回调方法
		 */
		onBeforeInitalize : fastDev.noop,
		/**
		 * @event onAfterLoadData
		 * 表单加载完成时的回调方法
		 */
		onAfterLoadData : fastDev.noop,
		/**
		 * @event onSubmitSuccess
		 * 提交之后的回调事件
		 * @param {Object}  返回action请求结果
		 */
		onSubmitSuccess : fastDev.noop,
		/**
		 * @event onAfterLoadInit
		 * initSource数据返回后回调触发。继承自基类
		 * @param {Object}  返回action请求结果
		 */
		onAfterLoadInit:fastDev.noop,
			/**
		 * @event onBeforeSubmit
		 * 提交之前的方法，返回"false"阻止提交。
		 * @param {Boolean}  
		 */
		onBeforeSubmit:fastDev.noop,
		/**
		 * @event onSubmitError
		 * 提交失败的回调事件(未实现)
		 * @param {Object}  返回action请求结果
		 */
		onSubmitError:fastDev.noop
	},
	_global : {
		controlMap : {},
		ids:[],
		errorConfig : null,
		cacheValue : null,
		errorMsg:"",
		reloadinitSource:false,
		form:null,
		formDataValue:null,
		initData:null,
		formchild:null
	},	
	fields : ["id","data"],
	/**
	 * 面板参数准备
	 * @protected
	 */
	 ready : function(options,global){
		 if(options.id===""){
			options.id=fastDev.getID();
		}
	 },
	 /**
	 * 控件创建
	 * @protected
	 */
	construct : function(options,global){
		if(options.errorFile){
			this.initErrorConfig();
		}
		options.onBeforeInitalize.call(this);		
		var form=fastDev("form[id='"+options.id+"']"),that=this;
		global.form=form;
		var formchild=form.find("[itype][id]");
		global.formchild=formchild;
		formchild.attr("compile","false");
		var fchild=formchild.elems,len=fchild.length,ids=[],child;
		for(var i=0;i<len;i++){
			child=fastDev(fchild[i]);
			child.attr("saveInstance","true");
			if(child.attr("itype")==="SelectTree"){
				child.attr("sTreeClickAfterShow","false");
			}
			ids[i]=child.prop("id");
		}
		global.ids=ids;	
		fastDev.Core.ControlBus.compile("ftype",form.elems[0]);
		this.saveControlInstance();
		if(!!options.items){
			global.initData =options.items;
		}
		//这里就创建没有数据的空控件并得到实例
		this.initProxy.bindAfterLoad(fastDev.setFnInScope(this,this.saveData));
	},
	saveData : function(data){
		this._global.initData =data;
		this.onAfterLoadInit();
	},
	 /**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	constructItems : function() {
		//这个里面得到数据后再用控件实例重新加载数据
	    var options=this._options, global=this._global;
		if(global.reloadinitSource){
			return this.reloadItems();
		}
		var form=global.form;//fastDev("form[id='"+options.id+"']");
		if(form.elems.length===0){
			return;
		}
		this.initProxy.setAction(options.action);
		form.bind("submit",this.submit);
		var fchild=global.formchild.elems,len=fchild.length,id,data,child,control,type;
		for(var i=0;i<len;i++){
			child=fastDev(fchild[i]);
			id=child.prop("id");
			data=this.getDataByid(id);
			if(data && data.length>0){				
				control=fastDev.getInstance(id);
				if(control.alias==="SelectTree"){
					control.getGlobal().tree.dataset.fill(data,false,true,true);
				}else{
					if(!!control.dataset){
					control.dataset.fill(data,false,true,true);
					}
				}
			}
		}
	},
	saveControlInstance : function(){
		var global=this._global,ids=global.ids;
		global.controlMap={};
		var controlMap=global.controlMap,ilen=ids.length,tempControl;
		for(var i=0;i<ilen;i++){
			tempControl=fastDev.getInstance(ids[i]);
			if(tempControl){				
				controlMap[ids[i]] = tempControl;
			}
		}	
	},	
	/**
	 * 通过id查找数据
	 */
	getDataByid : function(id){
		//var data=this.dataset.select("id="+id);that._global.initData 
		//var data = this.dataset.select(function(i, data) {
		//	return data.id === id;
		//});
		var dataset=this._global.initData,data;
		if(!dataset){
			return null;
		}
		if(dataset[0] && dataset[0].cacheData){
			dataset=dataset[0].cacheData;
		}
		var len =dataset.length;
		if(len>0){
			for(var i=0;i<len;i++){
				if(dataset[i].id===id){
					return dataset[i].data;
				}
			}
		}else{			
			data=dataset[id];			
			if(data && data.data){
				data=data.data;
			}
			return data;
		}
	},
	/**
	 * 表单提交
	 */
	submit : function() {
		// 调用controlMap中各控件验证并封装数据
		var sdata = {},data={}, options = this._options;
		if(options.onBeforeSubmit.call(this)===false){
			return false;
		}
		data = this.getItems();
		this.initProxy.setAction(options.action);		
		if(options.otherSubmitData){
			data= this.addData(data);
		}
		if(!data) {
			return false;
		}
		var msg= this._global.errorMsg;
		if(options.onDisplayError!==fastDev.noop){			
			options.onDisplayError.call(this,msg);
		}
		if(!fastDev.isEmptyObject(msg)){
			return false;
		}		
		this.initProxy.save(data,options.onSubmitSuccess,true,options.submitJson);
		return false;
	},
	/**
	 * 追加表单提交的数据
	 * @private
	 */
	addData:function (data) {
		var options = this._options;
		var otherData=options.otherSubmitData;
		if("string" === typeof otherData){
			otherData=(new Function("return " + otherData))();
		}
		if(!!otherData.length){
		for(var i=0;i<otherData.length;i++){
			var p=otherData[i].name;
			var result=otherData[i].value;
			if(p && result){
				data[p]=result;
			}
		}
		}else{
			for(var o in otherData){
				data[o]=otherData[o];
			}
		}			
		return data;
	},
	/**
	 * 获取当前表单的控件集合
	 * @return {Object} 
	 */
	getControlMap : function(){
		return this._global.controlMap;
	},
	/**
	 * 获取当前表单的值集合
	 * @return {String} values控件值集合
	 */
	getValues : function(type){
		var value, data = {}, validation = true, options = this._options, controlMap = this._global.controlMap,errorMsg={},result;
		for(var p in controlMap) {
			result="";
			if(controlMap[p]) {
				if(controlMap[p].getValue) {
					result=controlMap[p].getValue();
				}
				if(controlMap[p].validate) {
					if((!options.isValidHidden && controlMap[p].isShow()) || options.isValidHidden){
					var errmsg=controlMap[p].validate();
					if(!!errmsg){
						errorMsg[p]=errmsg;
						continue;
					}
					}
				}	
				data[p] = fastDev.Util.StringUtil.trim(result);
			}
		}	
		this._global.errorMsg=errorMsg;
		return data;
	},
	/**
	 * 获取当前表单的值集合的键值对的对象
	 * @return {Object} values控件集的键值对集合
	 */
	getItems : function() {
		return this.getValues("map");
	},
	/**
	 * 获取当前表单的InitSource获得的值
	 * @return {Json}
	 */
	getInitData : function(){
		var data=this.dataset.select();
		return fastDev.Util.JsonUtil.getJsonByData(data);
	},
	/**
	 * 获取当前表单的DataSource获得的值
	 * @return {Json}
	 */
	getDataValue : function(){
		return this._global.formDataValue;
	},
	/**
	 * 设置表单的值
	 * @param {Object} value控件的json格式键值对对象
	 * <p>- 此方法不能在onAfterLoadData方法内使用</p>
	 */
	setValue : function(value) {
		var options = this._options,global=this._global, controlMap =global.controlMap,cacheValue={};
		if(value){
			if(value[0] && value[0].cacheData){
				value=value[0].cacheData;
			}
			global.formDataValue=value;
		}
		for(var p in value) {
			if(controlMap[p]){
				controlMap[p].setValue(value[p]);
			}
		}
		if(!global.cacheValue){
			for(var o in controlMap) {
				if(!!controlMap[o].getValue){
				cacheValue[o]=controlMap[o].getValue();
				}
			}
			global.cacheValue=cacheValue;
		}
	},
	/**
	 * 设置表单的值
	 * @param {Object} value控件的json格式键值对对象
	 */
	setValues : function(value) {
		var options = this._options,global=this._global, controlMap =global.controlMap;
		for(var p in value) {
			if(controlMap[p]){
				controlMap[p].setValue(value[p]);
			}
		}
	},
	/**
	 * 清空表单
	 */
	cleanData:function(){
		var controlMap=this._global.controlMap;
		for(var p in controlMap){					
			 if(controlMap[p].reset){
				 controlMap[p].reset();
			 }
		}
	},
	/**
	 * 重置表单（给表单控件赋上原来的值）
	 */
	resetData:function(){
		this.cleanData();
		var value=this._global.cacheValue;
		this.setValue(value);
	},
	/**
	 * 重置initsource数据
	 * private
	 */
	reloadItems :function(){		
		var controlMap=this._global.controlMap;
		for(var p in controlMap) {
			if(controlMap[p]) {					
				var tdata=this.getDataByid("id="+p);
				if(!fastDev.isEmptyArray(tdata)){
					controlMap[p].clean();
					var items=tdata;//[0]._options.data.data;
					if(!fastDev.isArray(items)) {
						items = [items];
					}
					if(controlMap[p].addItems){
						controlMap[p].addItems(items);
					}
				}
			}
		}
	},
	/**
	 * 刷新数据(刷新initSource数据)
	 * @param {String}可选参数 url，不传刷新原来的initSource
	 */
	refreshData : function(urlstr) {
		if(urlstr){			
			this.initRefresh(urlstr);			
		}else{
			this.initRefresh();
		}
	},
	/**
	 * 刷新数据
	 * @private
	 */
	initRefresh : function(urlstr){		
		this._global.reloadinitSource=true;
		this.superClass.initRefresh.call(this,{url:urlstr});
	},
	/**
	 * 初始化验证错误配置信息
	 * @private
	 */
	initErrorConfig : function() {
		var that = this, options = this._options;
		var errorProxy= fastDev.create("Proxy", {
				url : options.errorFile,
				queue : this._global.queue,
				onAfterLoad : fastDev.setFnInScope(this, this.saveErrorConfig)
		 });		
		errorProxy.load();		
	},
	/**
	 * 验证错误配置信息
	 * @private
	 */
	saveErrorConfig:function(data){
		this._global.errorConfig =data;
		//得到控件实例并设置进去...4-3
		var controlMap=this._global.controlMap;
		for(var i = 0, tempControl; tempControl = controlMap[i]; i++) {
			this.setErrorConfig(tempControl);
		}
	},
	/**
	 * 表单是否验证通过
	 */
	isValid:function(){
		this.getValues();
		return fastDev.isEmptyObject(this._global.errorMsg);
	},
	/**
	 * 设置控件验证配置
	 * @param {Object} control控件实例
	 * @return {Object}
	 * @private
	 */
	setErrorConfig : function(control){		
		var options=this._options,cOptions=control._options,rule=cOptions.rule,errorConfig=cOptions.errorConfig,validateMode=cOptions.validateMode,id=cOptions.id;
		if(rule && (options.validate || validateMode!=='none')){
			control._options.errorConfig=this.getErrorList(rule,errorConfig,id);
		}
	},
	/**
	 * 得到验证配置
	 * @param {String} rule错误类型
	 * @param {String} errorConfig错误配置
	 * @param {String} id控件id
	 * @return {Object}
	 * @private
	 */
	getErrorList : function(rule,errorConfig,id){
		var me = this, rules = rule.split(";"), errorList = {},len=rules.length,type;
		for(var i=0;i<len;i++){
			type=rules[i];
			if(errorConfig && errorConfig[type]){
				errorList[type]=errorConfig[type];
			}else{
				errorList[type]=this.getErrorConfig(id,type);
			}
		}
		return errorList;
	},
	getErrConfig : function(){
		var errorConfig=this._global.errorConfig,i,me=this,tout1,tou2;
		var setErr=function(){
			errorConfig = me._global.errorConfig;
			if(errorConfig){	
				return errorConfig;
			}
		};	
		if(errorConfig===null){							
			tout1=setTimeout(setErr,500);
		}		
		if(errorConfig===null){
			tout1=setTimeout(setErr,1000);
			//errorConfig={"defaultInfo": {"required": "不能为空","IsEmail": "邮件地址不合法",
        //"IsCode": "邮编不合法","IsIdCard": "不是有效的身份证","IsIp": "非法IP地址",
        //"IsNumber": "不是数字","isEqual": "不一致","SelfRegular": "格式验证不通过",
        //"IsTel": "不是电话","MinLength": "长度只能在#{MinLength}以上","IsMobile":"必须是手机号码",
        //"MaxLength": "长度只能在#{MaxLength}以内","lenEqual": "长度只能是#{lenEqual}"}	};
		}        
		return errorConfig;
	},
	/**
	 * 得到验证配置
	 * @param {String} name控件名称
	 * @param {String} type错误类型
	 * @return {Object}
	 * @private
	 */
	getErrorConfig : function(id, type) {		
		var msg="",errorConfig = this._global.errorConfig;		
		var loadDefault = false;
		if(errorConfig===null){
			errorConfig=this.getErrConfig();
		}
		if(errorConfig) {
			if(errorConfig[id]) {
				if(errorConfig[id][type]) {
					msg = errorConfig[id][type];
				} else {
					loadDefault = true;
				}
			} else {
				loadDefault = true;
			}
			if(loadDefault && errorConfig.defaultInfo) {
				if(errorConfig.defaultInfo[type]) {
					msg = errorConfig.defaultInfo[type];
				}
			}
		}
		return msg;
	}	
});
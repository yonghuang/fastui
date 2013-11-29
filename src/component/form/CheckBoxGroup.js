/**
 * @class fastDev.Ui.CheckBoxGroup
 * @extends fastDev.Ui.Component
 * 复选框组控件，继承自component，表单类组件。<p>
 * 作者： 姜玲
 *
 *		<div itype="CheckBoxGroup"  id="check2">
 *		  <div value="1" text="足球" checked=true></div>			
 *		  <div value="2" text="排球" checked=true></div>
 *		  <div value="3" text="羽毛球"></div>
 *		  <div value="4" text="乒乓球"></div>
 *		</div>
 */
fastDev.define("fastDev.Ui.CheckBoxGroup", {
	extend : "fastDev.Ui.Component",
	alias : "CheckBoxGroup",
	_options : {
		/**
		 * 每行或每列有几个复选框
		 * @type {Number}
		 */
		repeatItems : null,
		/**
		 * 每列的宽度
		 * @type {String}
		 */
		itemWidth : "",
		/**
		 * 每列的高度
		 * @type {String}
		 */
		itemHeight : "",
		/**
		 * 布局的方式vertical:竖向排列, horizontal横向排列
		 * @type {String}
		 */
		repeatDirection : "horizontal",
		/**
		 * 用于设置控件的初始项
		 * @type {String}
		 */
		items : null,
		/**
		 * 控件名称
		 * @type {String}
		 */
		name : "",
		/**
		 * 设置是否禁用，默认false
		 * @type {Boolean}
		 */
		disabled : false,
		/**
		 * 设置是否隐藏，默认false
		 * @type {Boolean}
		 */
		hide : false,
		/**
		 * 设置选中值
		 * @type {String}
		 */
		value : "",
		/**
		 * 是否允许多选
		 * @type {Boolean}
		 */
		allowMultiSelect : true,
		/**
		 * 值改变时发生
		 * @event
		 */
		onchange : fastDev.noop,
		onfocus:fastDev.noop,
		onblur:fastDev.noop,
		/**
		 * 验证模式: blur(失去焦点验证),none(无验证)
		 * @type {String}
		 */
		validateMode:"none",
		/**
		 * 校验的规则，支持是否为空一种 required
		 * @type {String}
		 */
		rule:"",
		/**
		 * 验证错误的提示消息配置
		 * @type {String}
		 */
		errorConfig : null,
		/**
		 * 验证前发生
		 * @event
		 */
		onBeforeValidation : fastDev.noop,
		/**
		 * 验证后发生
		 * @event
		 */
		onAfterValidation : fastDev.noop
	},
	_global : {
		type : "checkbox",
		condiv:null,
		box:null,
		bodyClick:null,
		infocus:false
	},
	/*template : [
		'<div id="#{id}" class="ui-fakeborder #{cls}">', 
			'<tpl dynamic>', 
				'<tpl each>',
					'<tpl if("#{repeatDirection}"=="vertical" && #{repeatItems}&gt;1 && ({row_id}==1 || {row_id}%#{repeatItems}==1))>', 
						'<div class="ui-labelgroup">', 
					'</tpl>', 
						'<div class="ui-form ui-#{type} ui-label-item"><label>',
					'<tpl if({checked})>',
						'<div class="ui-label-ico ui-label-checked" name="#{name}" value="{value}" text="{text}"></div>', 
					'<tpl else>', 
						'<div class="ui-label-ico" name="#{name}" value="{value}" text="{text}"></div>', 
					'</tpl>', 
					'<div class="ui-label-text">{text}</div></label></div>', 
					'<tpl if("#{repeatDirection}"=="vertical" && #{repeatItems}&gt;1 && ({row_id}==#{itemsLen} || {row_id}%#{repeatItems}==0))>', 
						'</div>', 
					'</tpl>', 
				'</tpl>', 
			'</tpl>', 
		'</div>'
	],*/
	staticTemplate : function(params) {
	  return '<div id="'+params.id+'" class="ui-fakeborder '+params.cls+'"></div>';
	},
	dynamicTemplate : function(params,data){
		var html = [];
		for(var i=0,item;item=data[i];i++){
			if(params.repeatDirection==="vertical" && params.repeatItems>1 && (i===0 || (i+1)%params.repeatItems===1)){
				html.push('<div class="ui-labelgroup">');				
			}
			html.push('<div class="ui-form ui-'+params.type+' ui-label-item"><label>');
			html.push('<div class="ui-label-ico');
			if(item.checked){
				html.push(' ui-label-checked');
			}
			html.push('" name="'+params.name+'" value="'+item.value+'" text="'+item.text+'"></div>');
			html.push('<div class="ui-label-text">'+item.text+'</div></label></div>');	
			if(params.repeatDirection==="vertical" && params.repeatItems>1 && (i===data.length-1 || (i+1)%params.repeatItems===0)){
				html.push('</div>');
			}
		}
		return html.join('');
	},
	/**
	 * 错误提示信息模板
	 * @private
	 */
	errorTemplate : ['<div class="ui-tips-text ui-radius ui-shadow"></div>'],
	tplParam : ["type", "name", "repeatDirection", "repeatItems", "itemsLen","id","cls"],
	fields : ["value", "text", {
		name : "checked",
		type:"Boolean",
		defaultValue : false
	}],
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {
		if(!options.name){
			(options.name = "chk" + fastDev.getID());
		}
		//!options.repeatItems && (options.repeatDirection == "vertical" && (options.repeatItems = 1) || (options.repeatItems = 0));
		if(!options.repeatItems){
			 if(options.repeatDirection === "vertical"){
				options.repeatItems = 1;
			 }else{
				options.repeatItems = 0;
			 }
		}
		if(!options.allowMultiSelect){
			global.type = "radio";
		}
	},
	/**
	 * 控件创建
	 * @protected
	 */
	construct : function(options,global){
		if(!!this.proxyConfig){
			this.proxyConfig.reader = {type:"json"};
		}
	},	
	/**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	constructItems : function(items) {
		//this._global.itemsLen = this.dataset.getSize();
		//this.renderDynamicHtml();
		this._renderDynamicHtml(this.find(".ui-fakeborder"));	
		this.setConstruct();
	},
	/**
	 * 设置控件属性
	 * @private
	 */
	setConstruct : function() {
		var options = this._options, condiv = this.find(".ui-form"),width=options.itemWidth;
		this._global.condiv=condiv;
		// 样式功能初始化		
		if(options.repeatDirection === "horizontal"){
			this.setHorizontal();
		}else{
			this.setVertical();	
		}
		if(width===""){			
			width=this.getMaxWidth(condiv.elems);
		}
		if(parseInt(width,10) > 0){
			condiv.css("width",width);
		}
		if(options.itemHeight){
			condiv.css("height", options.itemHeight);
		}
		if(options.disabled){
			this.disabled();
		}
		if(options.hide){
			this.hide();
		}				
		if(options.value || options.value===0){
			this.addValue(options.value);
		}
		fastDev(this.elems[0]).removeCss("width");
		var maxright=this.getMaxRight(condiv.elems);
		if(parseInt(maxright,10) > 15){
		fastDev(this.elems[0]).width(maxright);
		}	
		this.bindEvent();
	},
	/**
	 * 得到最大right值
	 * @private
	 */
	getMaxRight : function(condiv){
		var maxRight=0,len=condiv.length,con,firstLeft=0;
		for(var i=0;i<len;i++){			
			con=fastDev(condiv[i]);
			if(i===0){
				firstLeft=con.offset().left;
			}
			maxRight=Math.max(maxRight,con.offset().left+con.width());
		}
		return maxRight-firstLeft+15+"px";
	},
	/**
	 * 得到最大宽度
	 * @private
	 */
	getMaxWidth : function(condiv){
		var maxWidth=0,len=condiv.length,con;
		for(var i=0;i<len;i++){
			con=fastDev(condiv[i]);
			maxWidth=Math.max(maxWidth,con.width());
		}
		return maxWidth+"px";
	},
	/**
	 * 得到label
	 * @private
	 */
	getLabel : function(event) {
			var target = event.target, label, evobj = fastDev(target);
			if(evobj.hasClass("ui-label-text") || evobj.hasClass("ui-label-ico")) {
				label = evobj.parent("label");
			} else if(evobj.hasClass("ui-form")) {
				label = evobj.children();
			} else {
				label = evobj;
			}
			if(label.find(".ui-label-disable").elems.length > 0 || label.find(".ui-label-checked-disable").elems.length > 0) {
				return null;
			}
			return label;
	},
	/**
	 * 绑定事件
	 * @private
	 */
	bindEvent : function() {
		var me = this, options = this._options, condiv = this._global.condiv;
		//按钮鼠标滑入滑出样式改变事件
		var condivMouseOver = function(event) {
			var label = me.getLabel(event);
			if(label && label.hasClass("ui-label-over") === false){
				label.addClass("ui-label-over");
			}
		};
		var condivMouseOut = function(event) {
			var label = me.getLabel(event);
			if(label){
				label.removeClass("ui-label-over");
			}
		};
		var condivClick = function(event) {
			var label = me.getLabel(event), item = {};
			if(label) {
				me._global.infocus=true;
				var input = label.find(".ui-label-ico");
				if(input.hasClass("ui-label-checked")) {
					input.removeClass("ui-label-checked");
					item.checked = false;
				} else {
					if(options.allowMultiSelect) {
						input.addClass("ui-label-checked");
					} else {
						me.find(".ui-label-ico").removeClass("ui-label-checked");
						input.addClass("ui-label-checked");
					}
					item.checked = true;
				}
				if(options.onchange !== fastDev.noop) {
					item.value = input.attr("value");
					item.text = input.attr("text");
					options.onchange.call(this,event,item);					
					//options.onfocus.call(this,item);
					me.onFocus();
				}
			}
		};
		condiv.bind("mouseover", condivMouseOver).bind("mouseout", condivMouseOut);
		condiv.bind("click", condivClick);
		if(options.validateMode !== "none") {
			this.onBlur(fastDev.setFnInScope(me, me.validate));
		}
	},
	/**
	 * 得到焦点
	 * @param {Function} handle
	 */
	onFocus:function(handle){
		return this;
	},
	/**
	 * 失去焦点
	 * @param {Function} handle
	 */
	onBlur:function(handle){
		//绑定失去焦点事件
		var me = this;
		if(handle){			
			var bodyClick=function(event){
				var target = event.target;
				if(!fastDev(me.elems[0]).contains(target) && me._global.infocus){
					me._global.infocus=false;
					//options.onblur.call(this,event);
					me.blur(event,handle);
				}
			};
			this._global.bodyClick=bodyClick;
			fastDev("body").bind("click",bodyClick);			
		}
		return this;
	},
	/**
	 * 执行失去焦点
	 * @private
	 */
	blur:function(event,handle){
		//让控件失去焦点
		handle(event);
		return this;
	},
	/**
	 * 执行得到焦点
	 * @private
	 */
	focus:function(){
		return this;
	},
	/**
	 * 合并控件的值
	 * @param {Array} value 值
	 * @private
	 */
	addValue : function(value) {
		if(value) {			
			if(fastDev.isString(value)){
				if(value.indexOf(",")>0){
					value=value.replace("[","").replace("]","");
					value=value.replace(/"/g,"");
					value=value.split(',');
				}else{
					value = [value];
				}
			}
			if(fastDev.isNumber(value)){
				value = [value];
			}			
			var controlList = this.find(".ui-label-ico").elems,con;
			while(value.length > 0) {
				var v = value.pop();
				for(var i = 0; i < controlList.length; i += 1) {
					con=fastDev(controlList[i]);
					if(con.attr("value") === "" + v) {
						if(!this._options.allowMultiSelect) {
							this.unCheck();
							if(this._options.disabled){
								con.addClass("ui-label-checked-disable");
							}else{
								con.addClass("ui-label-checked");
							}
							break;
						} else {
							if(this._options.disabled){
								con.addClass("ui-label-checked-disable");
							}else{
								con.addClass("ui-label-checked");
							}
						}
					}
				}
			}
		}
	},
	/**
	 * 设置控件的值，会先清空
	 * @param {Array} value 值
	 */
	setValue : function(value) {
		var control = this.find(".ui-label-ico"),len= control.elems.length;
		if(len===1 && typeof value === "boolean"){
			if(value){
				control.addClass("ui-label-checked");
			}else{
				control.removeClass("ui-label-checked");
			}
		}else{
			if(typeof value==="number"){
				value=""+value;
			}
			if(value.length>0){
				this.unCheck();
				this.addValue(value);
			}
		}
	},
	/**
	 * 获取控件选中项的值
	 * @return {Array}
	 */
	getValue : function() {		
		var controlList = this.find(".ui-label-ico").elems, result =[],con,n=0,len= controlList.length;
		if(len===1){
			con=fastDev(controlList[0]);
			return con.hasClass("ui-label-checked");
		}else{
			for(var i = 0; i < len; i += 1) {
				con=fastDev(controlList[i]);
				if(con.hasClass("ui-label-checked") || con.hasClass("ui-label-checked-disable") ) {
					result[n]=con.attr("value");
					n+=1;
				}
			}
			if(this._options.allowMultiSelect) {
				return result.length > 0 ?  result :"";
			}else{
				return result.length > 0 ?  result[0] :"";
			}
		}
	},
	/**
	 * 获取控件选中项的值
	 * @return {String}
	 */
	getValueStr : function() {		
		var value, controlList = this.find(".ui-label-ico").elems, result = "",con;
		for(var i = 0; i < controlList.length; i += 1) {
			con=fastDev(controlList[i]);
			if(con.hasClass("ui-label-checked") === true) {
				value = '"' + con.attr("value") + '"';
				if(result.length > 0){
					result += "," + value;
				}else{
					result += value;
				}
			}
		}
		return result.length > 0 ?  result :"";
	},
	/**
	 * 设置为竖向排列
	 * @private
	 */
	setVertical : function() {
		var options = this._options, cdiv = this.find(".ui-labelgroup"), condiv = this._global.condiv;
		if(options.itemWidth) {
			cdiv.css("width", options.itemWidth);
		} else if(options.repeatItems) {
			var lastWidth = this.getItemWidth(options);
			cdiv.css("width", lastWidth);
			condiv.css("width", "100%");
		}
	},
	/**
	 * 增加选项
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
	 * 算出项宽度
	 * @private
	 */
	getItemWidth:function(options){
		  var width = (100 / options.repeatItems);
		  var containerWidth = fastDev(options.container).width();
		  var lastWidth = fastDev.Util.StringUtil.stripUnits(width + "%", containerWidth) -11;//每个都有10px的外边距，为防止除法四舍五入时有误差，多减去1
		  if(fastDev.Browser.isIE6){
			lastWidth = width - 1 + "%";
		  }
		  return lastWidth;
	},
	/**
	 * 设置为横向排列
	 * @private
	 */
	setHorizontal : function() {
		var options = this._options, div = fastDev(this.elems[0]), condiv =this._global.condiv;
		condiv.addClass("ui-label-inline");
		if(options.repeatItems) {
			var lastWidth = this.getItemWidth(options);
			condiv.css("width", lastWidth);
		}
	},
	/**
	 * 设置每个复选框的宽度
	 * @param {String} width宽度
	 */
	setItemsWidth : function(width) {
		var condiv =this._global.condiv;
		condiv.css("width", width);
	},
	/**
	 * 获取控件选中项的值和文本
	 * @return {Array}
	 */
	getCheckedItems : function(isjson) {
		var value, text, data, controlList = this.find(".ui-label-ico").elems, result = "",con;
		for(var i = 0; i < controlList.length; i += 1) {
			con=fastDev(controlList[i]);
			if(con.hasClass("ui-label-checked") === true) {
				value = con.attr("value");
				text = con.attr("text");
				data = "{value:\"" + value + "\",text:\"" + text + "\"}";
				if(result.length > 0){
					result += "," + data;
				}else{
					result += data;
				}
			}
		}
		if(isjson){
			return  (new Function("return [" + result + "]"))();
		}else{
			return "[" + result + "]";
		}
	},
	/**
	 * 禁用控件
	 */
	disabled : function() {
		this.find(".ui-label-ico").addClass("ui-label-disable");
		this.find(".ui-label-ico.ui-label-checked").removeClass("ui-label-checked").addClass("ui-label-checked-disable");
	},
	/**
	 * 清空方法
	 */
	unCheck : function() {
		this.find(".ui-label-ico.ui-label-checked").removeClass("ui-label-checked");
	},
	/**
	 * 清空选项方法
	 */
	clean : function(){
		this.reset();
		this.dataset.remove();
		this.constructItems();
		return this;
	},
	/**
	 * 清空值方法
	 */
	reset : function(){
		this.unCheck();
	},
	/**
	 * 全选方法　
	 */
	allCheck : function() {
		this.find(".ui-label-ico").addClass("ui-label-checked");
	},
	/**
	 * 反选方法
	 */
	invertCheck : function() {
		this.find("[class='ui-label-ico']").addClass("ui-label-checked1");
		this.find(".ui-label-ico.ui-label-checked").removeClass("ui-label-checked");
		this.find(".ui-label-checked1").removeClass("ui-label-checked1").addClass("ui-label-checked");
	},
	/**
	 * 启用控件
	 */
	unDisabled : function() {
		this.find(".ui-label-disable").removeClass("ui-label-disable");
		this.find(".ui-label-ico.ui-label-checked-disable").removeClass("ui-label-checked-disable").addClass("ui-label-checked");
	},
	/**
	 * 启用控件
	 */
	enable : function(){
		this.unDisabled();
	},
	/**
	 * 销毁当前对象Dom集
	 */
	destroy : function() {
		fastDev(this.elems).remove();
		var bodyClick=this._global.bodyClick;
		fastDev("body").unbind("click",bodyClick);
	},
	bind : function(){
		return this;
	},
	fire : function(){
		return this;
	},
	/**
	 * 是否验证不通过
	 */
	hasError : function(){
		return fastDev(this.elems[0]).hasClass("ui-tips-text-err");
	},
	/**
	 * 调用配置中的验证规则对输入值进行验证
	 * @return {String}
	 */
	validate : function() {		
		var options = this._options, errorMsg="";
		if(options.rule){
			var value = this.getValue(), validation = fastDev.Core.Validation;
			var box=fastDev(this.elems[0]);
			var height=box.children().height();
			//box.css("height",height);
			this._global.box=box;
			var errorConfig=options.errorConfig;
			errorMsg = fastDev.Core.Validation.validate(options.rule, value, errorConfig);
			if(errorMsg) {
				this.initError(errorMsg);
			} else {
				this.destroyError();
			}	
		}
		return errorMsg;
	},
	/**
	 *  初始化错误提示
	 * @param {Object} errorMsg 错误信息
	 * @private
	 */
	initError : function(errorMsg) {
		var global = this._global,
		// 输入框
		box = global.box,
		// 错误提示框
		errorDiv = global.errorDiv = fastDev(this.errorTemplate.join("")),
		// 鼠标滑入输入框事件
		boxMouseoverHandle = global.boxMouseoverHandle,
		// 鼠标滑出输入框事件
		boxMouseoutHandle = global.boxMouseoutHandle;
		if(!boxMouseoverHandle) {
			boxMouseoverHandle = global.boxMouseoverHandle = function(event) {
				if(box.hasClass("ui-tips-text-err")){
				errorDiv.css({
					left : event.pageX + 10 + "px",
					top : event.pageY + 10 + "px"
				}).show();
				}
			};
			boxMouseoutHandle = global.boxMouseoutHandle = function() {
				errorDiv.hide();
			};
		}
		// 渲染错误提示框并隐藏
		errorDiv.setText(errorMsg).css({
			position : "absolute"
		}).hide().appendTo(document.body);
		box.addClass("ui-tips-text-err");
		box.bind("mouseover", boxMouseoverHandle).bind("mouseout", boxMouseoutHandle);
	},
	/**
	 * 销毁错误提示
	 * @private
	 */
	destroyError : function() {
		var global = this._global, errorDiv = global.errorDiv;
		if(!errorDiv) {
			return;
		}
		var box = global.box, textMouseoverHandle = global.textMouseoverHandle, textMouseoutHandle = global.textMouseoutHandle;
		box.removeClass("ui-tips-text-err");
		//box.removeClass("ui-fakeborder");
		box.unbind("mouseover", textMouseoverHandle).unbind("mouseout", textMouseoutHandle);
		errorDiv.remove();
	}
});

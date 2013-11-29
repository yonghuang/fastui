// CheckBoxGroup兼容子类 
fastDev.namespace("talkweb.Components");
fastDev.define("fastDev.Patch.Form",{
	extend : "fastDev.Ui.Form",
	alias : "Patch.Form",
	_options : {
		items : null,		
		autoBuild : true,		
		blurValidate : true,		
		autoBuildBlurValidate : false,		
		submitText : "提交",		
		resetText : "重置",
		haveSubmitBtn :  true,
		haveResetBtn :  true,
		isSubmitDisabled : true,		
		itemWidth : "33%",
		notesWidth : "100px",		
		displayError:null
	},
	_global : {
	 validation : true,
	 data : "",
 	 errorMsgDiv : null,
 	 excuteCI : true,
  	 loadSeq : 0,
	 reItem:null,
	 items : null,
	 cacheid_init : null,
	 cacheid_load : null,
	 changeEvent : null,
	 submitBtn : null
	},
	mapping :{
		"haveSpecialCode" : "hasSpecialCode",
		"beforeInitialize" : "onBeforeInitalize",	
		"afterLoad" : "onAfterLoadData",
		"submitCallback" : "onSubmitSuccess"
	},
	// Form兼容属性属性解析
	parseAttr : function(config){
	  return fastDev.create("Patch.Form",fastDev.parseMapping(config,this.mapping));
	},
	/**
	 * 构建控件
	 * @param {Array} options公共属性
	 * @param {Array} global全局变量
	 * @private
	 */
	construct : function(options, global) {
		if(options.isOnlyData && options.id) {
			this.constructFormData();
		} else {
			var items = this.getAllitems();
			if(options.autoBuild === false) {
				this.reConstruct();
			} else {
				var path, item, control, form = talkweb.BaseControl.Form().onSubmit(this.bindEventlistener(this, this.submit));
				this.storage(form[0]);
				this.constructFormItem(items);
			}
		}
	},
	/**
	 * 构建表单项
	 * @param {Array} items
	 * @private
	 */
	constructFormItem : function(items) {
		var controlMap = {};
		var shell = talkweb.BaseControl.Div({
			container : this,
			className : "form formborder"
		});
		if(items && items.length && items.length > 0) {
			var options = this._options;
			talkweb.BaseControl.Div({
				container : shell,
				className : "clearfix"
			});
			this.buildControlAndLaout(items, controlMap, shell);
			talkweb.BaseControl.Div({
				container : shell,
				className : "clearfix"
			});
			this._global.controlMap = controlMap;
			var divb, resetbutton, submitbutton;
			if(options.hasSubmitBtn || options.hasResetbtn) {
				divb = talkweb.BaseControl.Div({
					container : this,
					className : "formbuttonlayout"
				});
			}
			if(options.hasSubmitBtn) {
				submitbutton = talkweb.BaseControl.Button({
					container : divb,
					saveInstance : false,
					type : "submit",
					value : options.submitText,
					className : "button_inline"
				});
				this._global.submitBtn = submitbutton;
			}
			if(options.hasResetbtn) {
				resetbutton = talkweb.BaseControl.Button({
					container : divb,
					saveInstance : false,
					type : "button",
					value : options.resetText,
					className : "button_inline"
				});
				if(options.resetToBlank){
					resetbutton.onClick(this.bindEventlistener(this, this.cleanData));
				}else{
					resetbutton.onClick(this.bindEventlistener(this, this.resetData));
				}
			}
		}
	},
	constructForm : function(){
		if(fastDev("form[id='"+options.id+"']").elems.length===0){
			var formHtmlStr="<form id=\""+options.id+"\" method=\""+options.requestType+"\" action=\""+options.action+"\" ></form>";
			var form =fastDev.Dom.createByHTML(formHtmlStr);
			var thisCon=fastDev("#"+options.container);
			thisCon.append(dom);		
		}		
	},
	/**
	 * 构建表单数据（合并多个js里的表单时使用）
	 * @private
	 */
	constructFormData : function() {
		var options = this._options;		
		var otherform = fastDev.getInstance(options.id);
		if(otherform) {
			var ofloadSeq = otherform._global.loadSeq;
			var allofloadSeq = ofloadSeq.slice(0).concat(options.loadSeq);
			var ofitems = otherform._global.items;
			var allitems = allofloadSeq.length > 2 ? ofitems.concat([options.items]) : [ofitems].concat([options.items]);
			this.setGlobal({
				loadSeq : allofloadSeq,
				items : allitems
			});	
			otherform.setID("old_" + options.id);
			this.destory("old_" + options.id);
		} else {
			this.setGlobal({
				loadSeq : [].concat(options.loadSeq),
				items : [].concat(options.items)
			});
		}
	},
	/**
	 * 构建控件
	 * @param {Object} items数据集
	 * @param {Object} controlMap控件集
	 * @param {Object} shell容器
	 * @private
	 */
	buildControlAndLaout : function(items, controlMap, shell) {
		var classPath, item, options = this._options, global = this._global, tempItems;
		var changeEvent = global.changeEvent || this.bindEventlistener(this, this.validate);
		for(var i = 0; i < items.length; i += 1) {
			item = items[i];
			classPath = talkweb.Tools.analyticClassPath(item.classPath);
			try {
				item.options.items = options.d_cache[item.options.name].data;
			} catch (e) {
				item.options || (item.options = {});
			}
			if(/FieldSet/g.test(item.classPath)) {
				item.options.formWidth = this.getWidth();
				item.options.dtWidth = item.dtWidth || options.notesWidth;
				item.options.form = this;
			};			
			if(/Tree|Datepicker/g.test(item.classPath)) {
				item.options.form = this;
			};
			item.options.width || (item.options.width = "100%");
			control = classPath(item.options);
			control.addControl && control.addControl(controlMap);
			control.addItems && ( tempItems = control.addItems(tempItems || []));
			var requires = false;
			if(item.options.name) {
				//options.validate && options.blurValidate && control.onBlur && control.onBlur(changeEvent);
				if(options.validate && options.blurValidate) {
					if(control.getClass && control.getClass() === "select-input") {
						item.options.validateItems && item.options.validateItems.requires && control.onChange && control.onChange(changeEvent);
					} else {
						control.onBlur && control.onBlur(changeEvent);
					}
				}
				controlMap[item.options.name] = control;
				item.options.validateItems && item.options.validateItems.requires && ( requires = true);
			}
			if(/Editor/g.test(item.classPath)) {
				control = control[0];
			};
			if(/TextArea/g.test(item.classPath)) {
				item.options.height = item.options.height || "62px";
			};
			talkweb.BaseControl.Dl({
				container : shell,
				head : item.options.notes,
				body : control,
				width : /^(\d{1,2}|100)%$/.test(item.width) ? item.width : options.itemWidth,
				height : item.options.height,
				requires : requires,
				className : item.className || "",
				ddClassName : item.ddClassName || "",
				dtWidth : item.dtWidth || options.notesWidth || options.dtWidth,
				formWidth : this.getWidth ? this.getWidth() : options.formWidth
			})
		}
		this._options.items = options.items.concat(tempItems);
		this._global.changeEvent = changeEvent;
	},
	/**
	 * 得到所以表单项的数据集
	 * @return {Object}
	 * @private
	 */
	getAllitems : function() {
		var options = this._options;
		if(options.id) {
			var otherform = talkweb.ControlBus.getInstance(options.id);
			if(otherform) {
				var ofloadSeq = otherform._global.loadSeq;
				var allofloadSeq = ofloadSeq.slice(0).concat(options.loadSeq);
				var ofitems = otherform._global.items;
				var allitems = allofloadSeq.length > 2 ? ofitems.concat([options.items]) : [ofitems].concat([options.items]);
				this.setGlobal({
					loadSeq : allofloadSeq,
					items : allitems
				});
				otherform.setID("old_" + options.id);
				this.destory("old_" + options.id);
				// 合并options完毕，按指定顺序组合items
				var count = 0, t, ta, flag, newsitems = [], A = allofloadSeq, n = allofloadSeq.length, items = allitems;
				for(var i = 0; i < n - 1; i += 1) {
					flag = 0;
					for(var j = 0; j < n - i; j += 1) {
						if(A[j + 1] <= A[j]) {
							t = items[j];
							items[j] = items[j + 1];
							items[j + 1] = t;
							ta = A[j];
							A[j] = A[j + 1];
							A[j + 1] = ta;
							flag = 1;
						}
					}
					if(flag == 0)
						break;
				}
				for(var k = 0; k < A.length; k += 1) {
					newsitems = newsitems.slice(0).concat(items[k]);
				}
				this._options.items = newsitems;
				return newsitems;
			}
		}
		var items = options.items;
		return items;
	},	
	/*
	 * 重置
	 * @param {Boolean} [toBlank=false] true重置到空值，false重置到dataSource所赋予的默认值
	 */
	resetClick : function(toBlank) {
		var options = this._options, toBlank = toBlank || options.resetToBlank;
		if(toBlank === true) {
			this.cleanData();
		} else {
			this.resetData();
		}
	},
	/**
	 * Description:根据数据集构建控件 Param:items:数据集 Return:none
	 */
	constructItems : function(items) {
		var options = this.getOptions(), controlMap = options.controlMap;
		for(var p in items) {
			var data = items[p].data;
			controlMap[p] && controlMap[p].constructItems(data);
		}
		if(!options.dataSource) {
			options.afterLoad && options.afterLoad.call(this);
		}
	},	
	 /*#
	 *  @name unDisabledSubmitBtn,
	 *  @explain 表单提交按钮启用
	 *  @type ------
	 *  @return ------
	 #*/
	unDisabledSubmitBtn : function() {
		var submitBtn = this.getGlobal().submitBtn;
		submitBtn && submitBtn.unDisabled();
	},
	 /*#
	 *  @name disabledSubmitBtn,
	 *  @explain 表单提交按钮启用禁用（用以防止表单多次提交）
	 *  @type ------
	 *  @return ------
	 #*/
	disabledSubmitBtn : function() {
		var options = this.getOptions();
		if(options.isSubmitDisabled && options.haveSubmitBtn) {
			var submitBtn = this.getGlobal().submitBtn;
			submitBtn && submitBtn.disabled();
		}
	},
	getStringByObj : function(item){
		var htmlStr="";
		for (var p in item){	
			htmlStr+=p+"=\""+item[p]+"\" ";
		}
		return htmlStr;
	},
	 reConstruct : function() {
		    var body =fastDev("body"), options=this._options,global=this._global,items = options.items;		    
            var elements,control,name,conOptions={},element,len;
            form = body.find("form[id='" + options.id+"']");
            if(form.elems.length===0) {
                form = body.find("form[name='" + options.name+"']");
				 if(form.elems.length===0) {
                	return false;
          		 }
            }
            elements = form.find("input,select,textarea,label").elems,len=elements.length;
            for(var i = 0; i <len; i += 1) { 				
				conOptions.class=this.getClassByElement(elements[i]);
				if(conOptions.class==="TextBox"){
					conOptions.type=this.getTextType(elements[i]);
				}
				control  = fastDev(elements[i]);
				name= elements[i].name || elements[i].getAttribute("name");
                conOptions.name=name;
                if(name==="") {
                    continue;
                }
				  //把js代码和html里的属性获取到全部翻译成html,再丢给现在的html模式解析		
		//表单Form
		//文本框TextBox  type text, password, textarea
		//单选框RadioGroup
		//复选框CheckBoxGroup
		//下拉框Select
		//下拉树SelectTree
		//日历DatePicker
		//智能提示框AutoComplete
		//按钮Button
				//单复选框组不重复构建
                if(!reItem[name]){
                    element = form.find("[name='"+name+"']").elems;
					//从表单js的items里获得控件的属性
                    var option = this.getOptionsByName(items,conOptions);
					//从dom里获得控件的属性
					option = this.getOptionsByElement(element,option);
					//根据属性重构dom
					this.createDom(option);
                    reItem[name] = true;
                }
            }           
        },
		getTextType : function(elem){
			var textType,tagName=elem.tagName.toLowerCase();			
			 if(tagName==="textarea"){
				textType="textarea"
			 }else{
				 textType=elem.getAttribute("type") || elements[i].type;
				 if(textType!=""){
					textType=textType.toLowerCase();
				}else{
					textType="text";
				}
			 }
			 return textType;
		},
		getClassByElement : function(elem){
			var tagName=elem.tagName.toLowerCase();		
			if(tagName==="select"){
				controlClass="Select";
			}else if(tagName==="label"){
				controlClass="Label";
			}else if(tagName==="textarea"){
				controlClass="TextBox";
			}else{
				textType=elements[i].getAttribute("type") || elements[i].type;					
				textType!=""?textType=textType.toLowerCase():controlClass="TextBox";
				switch(type) {
				  case  "password":					  
					  controlClass="TextBox";
					  break;
				  case  "text":
					 controlClass="TextBox";
					  break;
				  case  "radio":					  
					  controlClass="RadioGroup";
					  break;
				  case  "checkbox":
					 controlClass="CheckBoxGroup";
					  break;
				   case  "tree":					  
					  controlClass="SelectTree";
					  break;
				  case  "datepicker":
					 controlClass="DatePicker";
					  break;
				  case  "autocomplete":
					 controlClass="AutoComplete";
					  break;
				  case  "button":
					 controlClass="Button";
					  break;
				}
			}
			return controlClass;
		},
        getOptionsByElement : function(element, option) {
			var len=element.length,items=[];
			for(var i=0;i<len;i++){			
				var attributes = element[i].attributes;
				for(var j = 0; j< attributes.length; j++) {
					var attName = attributes[j].nodeName;
					/class/.test(attName) && ( attName = "className");
					attributes[j].nodeValue && (options[attName] = attributes[j].nodeValue);
				}
			}
            return option;
        },
        getOptionsByName : function(items, conOptions) {
            if(items) {
                for(var i = 0; i < items.length; i++) {
                    if(items[i].options && items[i].options["name"] && items[i].options["name"] === conOptions.name) {
                        return items[i].options;
                    }
                }
            }
            return {};
        },
        getWidth : function() {

            return this.getOptions().container.getCss("width") || 0;
        },
});
talkweb.Components.Form = function(config){
	return fastDev.Patch.Form.parseAttr(config);
}

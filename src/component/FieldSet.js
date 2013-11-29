//此控件1.5版本没有了
fastDev.define("fastDev.Ui.FieldSet", {
	extend : "fastDev.Ui.Component",
	alias : "FieldSet",
	_options : {	
				/*! @name items,
                 *  @explain 数据源
                 *  @description 合法的json数据源
                 *  @default ------
                 !*/
				items : null,			
				data : "",
				/*! @name title,
                 *  @explain 主题
                 *  @description String型
                 *  @default ------
                 !*/
				title : null,				
				controlMap : null,
				/*! @name hide,
                 *  @explain 隐藏
                 *  @description Boolean型
                 *  @default false
                 !*/
				hide : false,
				/*! @name height,
                 *  @explain 总高度
                 *  @description 合法的高度字符串
                 *  @default 100%
                 !*/
				height : "100%",
				/*! @name width,
                 *  @explain 总宽度
                 *  @description 合法的宽度字符串
                 *  @default 100%
                 !*/
				width : "100%",
				/*! @name itemWidth,
                 *  @explain 项宽度百分比
                 *  @description 百分比字符串
                 *  @default 33%
                 !*/
				itemWidth : "33%",
				/*! @name defaultShow,
                 *  @explain 默认展开
                 *  @description Boolean型
                 *  @default false
                 !*/
				defaultShow : false,
				/*! @name formWidth,
                 *  @explain 表单宽度
                 *  @description 合法的宽度字符串
                 *  @default 0px
                 !*/
				formWidth : "0px",
				/*! @name dtWidth,
                 *  @explain dt的宽度
                 *  @description 合法的宽度字符串
                 *  @default 100px
                 !*/
				dtWidth : "100px",
				/*! @name validate,
                 *  @explain 验证
                 *  @description Boolean型
                 *  @default true
                 !*/
				validate : true							
		},
		 /*# 
         *  @name setID,
         *  @explain 设置id　
         *  @type String型
         *  @return ------
         #*/
		setID : function(id) {
			if(!id) {
				id = talkweb.ControlBus.getID();
			}
			this.attr("id", id);
		},
		/*
		 * Description:构建控件
		 * Param:none
		 * Return:控件对象
		 */
		construct : function(options, global) {
			var path, item, control, titlespan, contentdiv,  items = options.items, controlMap = {}, div = talkweb.BaseControl.Div({
				className : "fieldset"
			});
			if(options.hide) {
				div.setStyle({
					"display" : "none"
				});
			}
			this.storage(div[0]);
			var spanclass = "fieldset-title-collect";
			var divclass = "fieldset-content-collect";
			if(options.defaultShow) {
				spanclass = "fieldset-title-expand";
				divclass = "fieldset-content-expand";
			}
			if(options.title) {
				titlespan = talkweb.BaseControl.Span({
					className : spanclass,
					value : options.title,
					container : this
				});
				titlespan.onClick(this.bindEventlistener(this, this.expandCollect));
				titlespan.setStyle({
					"width" : options.width
				});
			}
			contentdiv = talkweb.BaseControl.Div({
				className : divclass,
				container : this
			});
			contentdiv.setStyle({
				"height" : options.height,
				"width" : options.width
			});
			var shell = talkweb.BaseControl.Div({
				container : contentdiv,
				className : "fieldsetForm"
			});
			talkweb.BaseControl.Div({
				container : shell,
				className : "clearfix"
			});
			talkweb.Components.Form.Class.buildControlAndLaout.call(this, items, controlMap, shell);
			talkweb.BaseControl.Div({
				container : shell,
				className : "clearfix"
			});
			this.setOptions({
				controlMap : controlMap
			});
		},
		addControl : function(controlMap) {
			var name, options = this.getOptions(), items = options.items;
			for(var i = 0; i < items.length; i += 1) {
				name = items[i].options.name;
				controlMap[name] = options.controlMap[name];
			}
		},
		addItems : function(items) {
			var c_items = this.getOptions().items;
			return items.concat(c_items);
		},
		 /*# 
         *  @name expandCollect,
         *  @explain 展开或关闭　
         *  @type ------
         *  @return ------
         #*/
		expandCollect : function(e) {
			var span = $(this[0]).find("[class^='fieldset-title-']");
			if($(span).attr("class") === "fieldset-title-expand") {
				$(span).attr("class", "fieldset-title-collect");
				$(span).parent("div").children(".fieldset-content-expand").attr("class", "fieldset-content-collect");
			} else {
				$(span).attr("class", "fieldset-title-expand");
				$(span).parent("div").children(".fieldset-content-collect").attr("class", "fieldset-content-expand");
			}
		},
		/*
		 * Description:根据数据集构建控件
		 * Param:items:数据集
		 * Return:none
		 */
		constructItems : function(items) {
			var options = this.getOptions(), controlMap = options.controlMap;
			for(var p in items) {
				var data = items[p].data;
				controlMap[p] && controlMap[p].constructItems(data);
			}
		},
		getValue : function() {
			return "";
		},
		validate : function(event) {
			return talkweb.Components.Form.Class.validate.call(this, event);
		},
		saveErrorMsg : function(name, result) {
			talkweb.Components.Form.Class.saveErrorMsg.call(this, name, result);
		},
		getErrorConfig : function(name, msg, type) {
			var options = this.getOptions();
			return talkweb.Components.Form.Class.getErrorConfig.call(options.form, name, msg, type);
		},
		bindErrorEvent : function(control) {
			talkweb.Components.Form.Class.bindErrorEvent.call(this, control);
		},
		displayError : function(event) {
			talkweb.Components.Form.Class.displayError.call(this, event);
		},
		removeError : function(name) {
			talkweb.Components.Form.Class.removeError.call(this, name);
		},
		removeErrorMsg : function(name) {
			talkweb.Components.Form.Class.removeErrorMsg.call(this, name);
		},
		initError : function(name) {
			var options = this.getOptions();
			this.setOptions({
				displayError : options.form.getOptions().displayError
			});
			talkweb.Components.Form.Class.initError.call(this, name);
		},
		displayError : function(event) {
			var options = this.getOptions();
			if(options.displayError) {
				var errorMsg = options.form.parseError(options.form.getOptions(), options.errorMsg);
				
			} 
			options.displayError ? options.form.getOptions().displayError(errorMsg) : options.form.displayError.call(this,event);
		}
});

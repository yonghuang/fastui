(function() {

	fastDev.define("talkweb.BaseControl.SimpleControl", {
		extend : "fastDev.Core.Base",
		_options : {
			id : null,
			name : null,
			className : null,
			value : null,
			width : null,
			height : null,
			disabled : false,
			readonly : false,
			hide : false,
			validateItems : {
				requires : false,
				maxLength : false,
				minLength : false,
				lengthEqual : false,
				isNumber : false,
				mixNumber : false,
				maxNumber : false,
				isEqual : false,
				isEmail : false,
				isCode : false,
				isIdcard : false,
				isMobile : false,
				isTel : false,
				isIp : false,
				selfRegular : false
			},
			click : null,
			dblclick : null,
			keyup : null,
			focus : null,
			blur : null,
			change : null,
			mouseover : null,
			mouseout : null,
			mouseenter : null,
			mouseleave : null
		},
		init : function() {
			var options = this.getOptions();
			this.setID(options.id);
			this.setName(options.name);
			this.setValue(options.value);
			this.setClass(options.className);
			this.setWidth(options.width);
			this.setHeight(options.height);
			if(options.hide === true) {
				this.hide();
			}
			this.regEvent();
			options.disabled === true && this.disabled();
			this.setReadOnly(options.readonly);
			if(options.saveInstance === true) {
				fastDev.Core.ControlBus.setInstance(this.getID(), this);
			}
			this.applyContainer();
		},
		getID : function() {
			return this.attr("id");
		},
		setID : function(id) {
			var options = this.getOptions();
			if(options.saveInstance === true) {
				id = id || talkweb.ControlBus.getID();
			}
			id && this.attr("id", id);
		},
		disabled : function() {
			this.attr("disabled", true);
		},
		unDisabled : function() {
			this.enable();
		},
		enable : function() {
			this.removeAttr("disabled");
		},
		setReadOnly : function(readOnly) {
			readOnly === true ? this.attr("readOnly", readOnly) : this.removeAttr("readOnly");
		},
		setWidth : function(width) {
			/^(\d+px)|(\d+\%)$/.test(width) && this.setStyle({
				width : width
			});
			return this;
		},
		getWidth : function() {
			return this.getStyle("width");
		},
		setHeight : function(height) {
			/^(\d+px)|(\d+\%)$/.test(height) && this.setStyle({
				height : height
			});
			return this;
		},
		getHeight : function() {
			return this.getStyle("height");
		},
		getName : function() {
			return this.attr("name");
		},
		setName : function(param) {
			param && this.attr("name", param);
		},
		setClass : function(className) {
			if(!this[0]){
				return;
			}
			className && (className === "none" ? this[0].className = "" : this[0].className = className);
			return this;
		},
		getClass : function() {
			return this[0].className;
		},
		getStyle : function(name) {
			return this.getCss(name);
		},
		setStyle : function(style) {
			return this.setCss(style);
		},
		setValue : function(param) {
			(param === "" || param === 0 || param) && this.attr("value", param);
		},
		getValue : function() {
			return this.attr("value");
		},
		setText : function(text) {
			var textNode, global = this.getGlobal();
			text === "&none;" && ( text = "　");
			global.textNode ? ((global.textNode.nodeValue = text) && this[0].childNodes.length === 0 && this.append(global.textNode)) : (( textNode = this.createText(text)) && this.append(textNode) && this.setGlobal({
				textNode : textNode
			}));
		},
		getText : function() {
			var global = this.getGlobal();
			return global.textNode ? global.textNode.nodeValue : undefined;
		},
		offset : function() {
			var box;
			try {
				box = this[0].getBoundingClientRect();
			} catch(e) {
				box = {
					top : this[0].offsetTop,
					bottom : this[0].offsetBottom,
					left : this[0].offsetLeft,
					right : this[0].offsetRight
				}
			}
			return {
				top : box.top,
				bottom : box.bottom,
				left : box.left,
				right : box.right
			}
		},
		height : function() {
			var offset = this.offset();
			return offset.bottom - offset.top;
		},
		width : function() {
			var offset = this.offset();
			return offset.right - offset.left;
		},
		regEvent : function() {
			var options = this.getOptions();
			options.blur && this.onBlur(options.blur);
			options.keyup && this.onKeyup(options.keyup);
			options.focus && this.onFocus(options.focus);
			options.click && this.onClick(options.click);
			options.change && this.onChange(options.change);
			options.mouseout && this.onMouseout(options.mouseout);
			options.mouseover && this.onMouseover(options.mouseover);
			options.dblclick && this.onDblClick(options.dblclick);
			options.mouseenter && this.onMouseenter(options.mouseenter);
			options.mouseleave && this.onMouseleave(options.mouseleave);
		},
		onKeyup : function(handle) {
			$(this[0]).keyup(handle);
			return this;
		},
		focus : function() {
			$(this[0]).focus();
			return this;
		},
		onFocus : function(handle) {
			$(this[0]).focus(handle);
			return this;
		},
		onBlur : function(handle) {
			$(this[0]).blur(handle);
			return this;
		},
		click : function() {
			$(this[0]).click();
			return this;
		},
		onClick : function(handle) {
			$(this[0]).click(handle);
			return this;
		},
		dblclick : function() {
			$(this[0]).dblclick();
			return this;
		},
		onDblClick : function(handle) {
			$(this[0]).dblclick(handle);
			return this;
		},
		change : function() {
			$(this[0]).change();
		},
		onChange : function(handle) {
			$(this[0]).change(handle);
			return this;
		},
		onMousemove : function(handle) {
			$(this[0]).mousemove(handle);
			return this;
		},
		mouseover : function() {
			$(this[0]).mouseover();
			return this;
		},
		onMouseover : function(handle) {
			$(this[0]).mouseover(handle);
			return this;
		},
		onMouseout : function(handle) {
			$(this[0]).mouseout(handle);
			return this;
		},
		onMouseenter : function(handle) {
			$(this[0]).mouseenter(handle);
			return this;
		},
		onMouseleave : function(handle) {
			$(this[0]).mouseleave(handle);
			return this;
		},
		onMousedown : function(handle) {
			$(this[0]).mousedown(handle);
			return this;
		},
		onMouseup : function(handle) {
			$(this[0]).mouseup(handle);
			return this;
		},
		removeEvent : function(type, fn) {
			if(type && fn) {
				$(this[0]).unbind(type, fn);
			} else if(type) {
				$(this[0]).unbind(type);
			} else {
				$(this[0]).unbind();
			}
		},
		show : function() {
			this.setStyle({
				"display" : "block"
			});
			return this;
		},
		hide : function() {
			this.setStyle({
				"display" : "none"
			});
			return this;
		},
		isShow : function() {
			return this.getStyle("display") !== "none";
		},
		validate : function() {
			var validateItem, validate = true, result = this.getValue() || "", options = this.getOptions(), validateItems = options.validateItems, errorMsg = {};
			for(var p in validateItems) {
				validateItem = validateItems[p];
				if(validateItem === false) {
					continue;
				}

				if(p == "requires") {
					if(!result || !result.replace(/(^\s*)|(\s*$)/g, "")) {
						validate = false;
						errorMsg.requires = "不能为空";
					}
				} else {
					if(validateItems.requires || (!validateItems.requires && result)) {
						switch(p) {
							case "maxLength" :
								if(result.replace(/[^\x00-\xff]/g, '..').length > validateItem) {
									validate = false;
									errorMsg.maxLength = "长度只能在#{minLength}以上";
								}
								break;
							case "minLength":
								if(result.replace(/[^\x00-\xff]/g, '..').length < validateItem) {
									validate = false;
									errorMsg.minLength = "长度只能在#{maxLength}以内";
								}
								break;
							case "lengthEqual"	:
								if(result.length != validateItem) {
									validate = false;
									errorMsg.lengthEqual = "长度只能是#{lengthEqual}";
								}
								break;
							case "isNumber":
								var regNum = /^[-\+]?\d+\.?\d*$/;
								var isNumber = regNum.test(result);
								if(!isNumber) {
									validate = false;
									errorMsg.isNumber = "必须是数字";
								}
								break;
							case "mixNumber":
								var regNum = /^[-\+]?\d+\.?\d*$/;
								var isNumber = regNum.test(result);
								if(!isNumber) {
									validate = false;
									errorMsg.mixNumber = "必须是数字";
								} else {
									if(result < validateItem) {
										validate = false;
										errorMsg.mixNumber = "数值必须大于#{mixNumber}";
									}
								}
								break;
							case "maxNumber":
								var regNum = /^[-\+]?\d+\.?\d*$/;
								var isNumber = regNum.test(result);
								if(!isNumber) {
									validate = false;
									errorMsg.maxNumber = "必须是数字";
								} else {
									if(result > validateItem) {
										validate = false;
										errorMsg.maxNumber = "数值必须小于#{maxNumber}";
									}
								}
								break;
							case "isEqual":
								if(result != $("[name=" + validateItem + "]").attr("value")) {
									validate = false;
									errorMsg.isEqual = "两次输入的值必须相等";
								}
								break;
							case "isEmail":
								var regEmail = /^[a-zA-Z0-9_\\.]+@[a-zA-Z0-9-]+[\\.a-zA-Z]+$/;
								// /^[a-z0-9-_]{1,30}@[a-z0-9-]{1,65}.[a-z]{2,3}(.[a-z]{2})?$/;
								var isEmail = regEmail.test(result);
								if(!isEmail) {
									validate = false;
									errorMsg.isEmail = "必须是邮箱格式";
								}
								break;
							case "isCode":
								var regcode = /^[0-9]{6}$/;
								var isCode = regcode.test(result);
								if(!isCode) {
									validate = false;
									errorMsg.isCode = "必须是邮箱格式";
								}
								break;
							case "isIdcard":
								var regidcard = /^\d{14}(\d{1}|\d{4}|(\d{3}[xX]))$/;
								var isIdcard = regidcard.test(result);
								if(!isIdcard) {
									validate = false;
									errorMsg.isIdcard = "必须是身份证号码格式";
								}
								break;
							case "isTel":
								var reTel = /^((\(0\d{2}\)[- ]?\d{8})|(0\d{2}[- ]?\d{8})|(\(0\d{3}\)[- ]?\d{7,8})|(0\d{3}[- ]?\d{7,8}))?$/;
								var isTel = reTel.test(result);
								if(!isTel) {
									validate = false;
									errorMsg.isTel = "必须是电话号码格式";
								}
								break;
							case "isMobile":
								var regmobile = /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]\d{9}$/;
								var isMobile = regmobile.test(result);
								if(!isMobile) {
									validate = false;
									errorMsg.isMobile = "必须是手机号码格式";
								}
								break;
							case "isIp":
								var regIp = /^(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/;
								var isIp = regIp.test(result);
								if(!isIp) {
									validate = false;
									errorMsg.isIp = "必须是IP格式";
								}
								break;
							case "selfRegular":
								var regRegular = validateItem;
								var isRegular = regRegular.test(result);
								if(!isRegular) {
									validate = false;
									errorMsg.selfRegular = "格式不正确";
								}
								break;
						}
					}
				}
			}
			if(validate === false) {
				return {
					validate : false,
					data : errorMsg
				};
			} else {
				return {
					validate : true,
					data : result
				};
			}
		},
		reConstruct : function(obj, reClass) {
			if(!obj){
				this[0] = null;
				
			}else{
				this.storage(obj.nodeType ? obj : obj[0]);
			}
			return this;
		},
		reConstruct_TextNode : function(obj) {
			if(!obj){
				return;
			}
			var childNodes = obj.childNodes;
			if(childNodes) {
				for(var i = 0; i < childNodes.length; i += 1) {
					var node = childNodes[i];
					if(node.nodeType === 3) {
						this.setGlobal({
							textNode : node
						});
						break;
					}
				}
			}
		}
	});

})()
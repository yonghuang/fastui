fastDev.apply(fastDev.Core.Base, {
	construct : function(options, global) {
		if(options.container) {
			var newOptions = {};
			if( typeof options.container === "string") {
				newOptions.container = this.find("#" + options.container);
			} else if( typeof options.container === "object") {
				if(options.container.append) {
					return;
				}
				if(options.container.nodeType) {
					var tagName = options.container.tagName.toLowerCase();
					tagName = fastDev.Util.StringUtil.capitalize(tagName);
					Class = talkweb.BaseControl[tagName];
					if(Class) {
						newOptions.container = Class().reConstruct(options.container);
					}

				}
				if(!newOptions.container || !newOptions.container[0]) {
					newOptions.container = null;
				}
			}
		}
		newOptions && newOptions.hasOwnProperty("container") && this.setOptions(newOptions);
		return this;
	},
	initGlobal : function(global) {
		var global = talkweb.Tools.clone(global);
		this.applyGlobal(global);
	},
	applyGlobal : function(global) {
		this.getGlobal = function() {
			return talkweb.Tools.clone(global);
		};
		this.setGlobal = function() {
			var deep = true, param, i = 0;
			if( typeof arguments[0] === "boolean") {
				deep = arguments[i];
				i = 1;
			}
			param = arguments[i];
			deep === true ? talkweb.Tools.extendProperty(deep, global, param) : talkweb.Tools.extendProperty(global, param);
		};
	},
	extendOptions : function(subOptions, param) {
		var options = talkweb.Tools.extendProperty(true, this.superClass.getOptions(), talkweb.Tools.clone(subOptions), param);
		this.applyOptions(options);
	},
	applyOptions : function(options) {
		this.getOptions = function() {
			return talkweb.Tools.clone(options);
		};
		this.setOptions = function() {
			var deep = true, param, i = 0;
			if( typeof arguments[0] === "boolean") {
				deep = arguments[i];
				i = 1;
			}
			param = arguments[i];
			deep === true ? talkweb.Tools.extendProperty(deep, options, param) : talkweb.Tools.extendProperty(options, param);
		};
	},
	bind : function(object, fun) {
		return function() {
			return fun.apply(object, arguments);
		};
	},
	bindEventlistener : function(obj, fun) {
		return function(event) {
			event.target || (event.target = event.srcElement);
			return fun.call(obj, event);
		};
	},
	createFragment : function() {
		return document.createDocumentFragment();
	},
	create : function(tagName) {
		var browser = talkweb.ControlBus.getBrowser(), elem;
		if(browser.type === "msie" && (browser.version === "6.0" || browser.version === "7.0" || browser.version === "8.0")) {
			var name = this.getOptions().name || "";
			elem = document.createElement("<" + tagName + " name=\"" + name + "\">")
		} else {
			elem = document.createElement(tagName);
		}
		return elem;
	},
	createText : function(text) {
		return document.createTextNode(text);
	},
	createAttr : function(name, value) {
		var attr = document.createAttribute(name);
		attr.nodeValue = value;
		return attr;
	},
	addAttr : function(attr) {
		this[0].setAttributeNode(attr);
	},
	removeAttr : function(attr) {
		this[0].removeAttribute(attr);
	},
	append : function() {
		var target, obj, length = arguments.length;
		if(length === 1) {
			target = this[0];
			obj = arguments[0];
		} else if(length === 2) {
			target = arguments[0];
			obj = arguments[1];
		}
		target && target.appendChild(obj.nodeType ? obj : obj[0]);
		return this;
	},
	attr : function() {
		var result = null, key, value = arguments[0], length = arguments.length, obj = this[0];
		if(length === 1) {
			if( typeof value === "string") {
				result = obj.getAttribute(value) || obj[value] || "";
			} else if( typeof value === "object") {
				for(var p in value) {
					p === "value" ? obj.value = value[p] : obj.setAttribute(p, value[p]);
				}
			}
		} else if(length === 2) {
			key = value;
			value = arguments[1];
			key === "value" ? obj.value = value : obj.setAttribute(key, value);
		}
		return typeof result === "string" ? result : ( typeof result === "number" ? result + "" : this);
	},
	storage : function(obj, append) {
		append === true ? (this[0] || (this[0] = this.createFragment())) && this[0].appendChild(obj[0] || obj) : this[0] = obj;
		this.length = 1;
		return this;
	},
	setCss : function() {
		var length = arguments.length;
		var control = this[0];
		var returnObj = this;
		if(length === 1) {
			var obj = arguments[0];
			if( typeof obj === "string") {
				returnObj = this.getCss(obj);
			} else if( typeof obj === "object") {
				var style = talkweb.Tools.toJsonString(obj);
				style = style.replace(/{|}/g, "").replace(/\,/g, ";");
				this[0] && (this[0].style.cssText === undefined ? this.attr("style", style) : (/\S+;$/.test(this[0].style.cssText) ? this[0].style.cssText += style : this[0].style.cssText += ";" + style));
			}
		} else if(length === 2) {
			//this[0].updateAttr(control, arguments[0], arguments[1]);
		}
		return returnObj;
	},
	getCss : function(name) {
		var style = this[0].getAttribute("style");
		typeof style !== "object" && ( style = this[0].style);
		return style ? style[name] : "";
	},
	find : function(condition) {
		var result, control = this[0] || document.body;
		result = $(control).find(condition);
		var tagName = result[0] ? result[0].tagName.toLowerCase() : "";
		if(tagName) {
			tagName = fastDev.Util.StringUtil.capitalize(tagName);
			Class = talkweb.BaseControl[tagName];
			if(Class) {
				return Class().reConstruct(result);
			}
		}
	},
	getChildNode : function(index) {
		return this[0].childNodes[index];
	},
	registerEvent : function(obj, type, handle) {
		if(obj.addEventListener) {
			obj.addEventListener(type, handle, false);
		} else if(obj.attachEvent) {
			obj.attachEvent("on" + type, handle);
		}
	},
	revokeEvent : function(obj, type, handle) {
		if(obj.removeEventListener) {
			obj.removeEventListener(type, handle, false);
		} else if(obj.detachEvent) {
			obj.detachEvent("on" + type, handle);
		}
	},
	removeEvent : function(type, handle) {
		$(this[0]).unbind(type, handle);
	},
	clone : function() {
		var obj = talkweb.Tools.extendProperty({}, this);
		obj[0] = obj[0].cloneNode(true);
		return obj;
	},
	applyContainer : function() {
		var options = this.getOptions();
		//,currentControl = this;
		//options.notes && (currentControl = this.buildNotes(options.notes,options.validateItems.requires));
		//初始化完加载
		options.container && options.container.append(this);
		
	}
});


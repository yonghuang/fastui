(function(window, undefined) {
	var toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, doc = window.document;
	/**
	 * 基础运行库对外使用接口，可静态使用外挂在其上的常用方法，也可当构造方法使用，构造{@link fastDev.Core.DomObject}对象
	 * @class fastDev
	 * @author 袁刚
	 * @singleton
	 */
	var fastDev = function(selector, context) {

		if(!selector) {
			return;
		}

		if(fastDev.isDomObject(selector)) {
			return selector;
		}

		var elem;

		if(selector.nodeType || fastDev.isArray(selector)) {
			elem = selector;
			selector = null;
		}

		if(selector === "body" && !context && doc.body) {
			elem = doc.body;
			selector = null;
		}

		if(fastDev.isWindow(selector)) {
			elem = window;
			selector = null;
		}

		if( typeof selector === "string") {
			if(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {

				var ret = /^<(\w+)\s*\/?>(?:<\/\1>)?$/.exec(selector);

				if(ret) {
					if(fastDev.isPlainObject(context)) {
						elem = doc.createElement(ret[1]);
						for(var p in context) {
							fastDev.Dom.attr(selector, p, context[p]);
						}
						context = null;
					} else {
						elem = [doc.createElement(ret[1])];
					}

				} else {
					ret = fastDev.Dom.createByHTML(selector);
					elem = fastDev.Dom.children(ret);
				}
				selector = null;

			}

		}

		if(elem || typeof selector === "string") {
			return fastDev.create("DomObject", {
				selector : selector,
				context : context,
				elem : elem
			});
		}

		if( typeof selector === "function") {
			fastDev.ready(selector);
		}
	};
	/**
	 * 将目标对象中的属性拷贝至源对象中
	 * @param {Boolean} deep 是否深拷贝
	 * @param {Object} source 拷贝源
	 * @param {Object} target 拷贝目标
	 * @return {Object} source 完成拷贝后对象
	 *
	 *     @example
	 *     fastDev.apply({},{
	 *         propOne:1,
	 *         propTwo:"2",
	 *         propThree:function(){
	 *             ...
	 *         }
	 *     });
	 *
	 */
	fastDev.apply = function() {
		var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
		if( typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if( typeof target !== "object" && !fastDev.isFunction(target)) {
			target = {};
		}
		if(length === i) {
			target = this; --i;
		}
		for(; i < length; i++) {
			if(( options = arguments[i]) !== null) {
				for(name in options ) {
					src = target[name];
					copy = options[name];

					if(target === copy) {
						continue;
					}

					if(deep && copy && (fastDev.isPlainObject(copy) || ( copyIsArray = fastDev.isArray(copy)) )) {
						if(copyIsArray) {
							copyIsArray = false;
							clone = src && fastDev.isArray(src) ? src : [];
						} else {
							clone = src && fastDev.isPlainObject(src) ? src : {};
						}

						if(fastDev.isArray(clone) && !fastDev.isEmptyArray(clone)) {
							target[name] = clone.concat(copy);
						} else {
							target[name] = fastDev.apply(deep, clone, copy);
						}
					} else if(copy !== undefined) {
						target[name] = copy;
					}
				}

			}
		}
		return target;
	};

	fastDev.apply({
		/**
		 * 根据路径创建命名空间
		 * @param {String} path 命名空间路径
		 * @return {Object} 创建完成的空间
		 *
		 *     @example
		 *     fastDev.namespace("fastDev.Ui.Component");
		 *
		 */
		namespace : function(path) {
			var space = window;
			fastDev.each(path.split("."), function(i, name) {
				space = space[name] || (space[name] = {});
			});
			return space;
		},
		/**
		 * 自定义方法与作用域遍历处理每一个数组元素或对象属性
		 * @param {Object|Array} object 遍历对象
		 * @param {Fcuntion} callback 自定义句柄函数
		 * @param {Object} context 句柄函数执行域
		 * @return {Object|Array} object 遍历对象
		 */
		each : function(object, callback, context) {
			if(!object) {
				return;
			}
			var name, i = 0, length = object.length, isObj = length === undefined || fastDev.isFunction(object);
			if(isObj) {
				for(name in object ) {
					if(callback.call(context || object[name], name, object[name]) === false) {
						break;
					}
				}
			} else {
				for(var value = object[0]; i < length && callback.call(context || value, i, value) !== false; value = object[++i]) {
				}
			}
			return object;
		},
		/**
		 * 判断对象自身是否拥有指定属性
		 * @param {Object} object 待查找对象
		 * @param {String} property 属性名称
		 * @return {Boolean}
		 */
		hasOwn : function(object, property) {
			return hasOwn.call(object, property);
		},
		/**
		 * 将其他类型对象转换为字符串类型对象
		 * @param {Object} object 待转换对象
		 * @return {String}
		 */
		toString : function(object) {
			return toString.call(object);
		},
		/**
		 * 返回指定变量的类型
		 * @param {Object} value
		 * @return {String}
		 */
		typeOf : function(value) {
			var type, typeToString;
			if(value === null) {
				return 'null';
			}

			type = typeof value;

			if(type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean' || type === 'function') {
				return type;
			}

			typeToString = toString.call(value);

			switch(typeToString) {
				case '[object Array]':
					return 'array';
				case '[object Date]':
					return 'date';
				case '[object Boolean]':
					return 'boolean';
				case '[object Number]':
					return 'number';
				case '[object RegExp]':
					return 'regexp';
			}

			if(type === 'object') {
				if(value.nodeType) {
					if(value.nodeType === 3) {
						return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
					} else {
						return 'element';
					}
				}

				return 'object';
			}
		},
		/**
		 *	判断指定变量是否为函数对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isFunction : function(value) {
			return typeof value === 'function';
		},
		/**
		 * 判断指定变量是否为数组对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isArray : Array.isArray ||
		function(value) {
			return toString.call(value) === '[object Array]';
		},
		/**
		 * 判断指定变量是否为日期对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isDate : function(value) {
			return toString.call(value) === '[object Date]';
		},
		/**
		 * 判断指定变量是否为Object对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isObject : (toString.call(null) === '[object Object]') ? function(value) {
			// check ownerDocument here as well to exclude DOM nodes
			return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
		} : function(value) {
			return toString.call(value) === '[object Object]';
		},
		/**
		 * 判断指定变量是否为数字对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isNumber : function(value) {
			return !isNaN(parseFloat(value)) && isFinite(value);
		},
		/**
		 * 判断指定变量是否为字符串对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isString : function(value) {
			return typeof value === 'string';
		},
		/**
		 * 判断指定变量是否为布尔对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isBoolean : function(value) {
			return typeof value === 'boolean';
		},
		isValid : function(value) {
			return !(value === undefined || value === null);
		},
		/**
		 * 判断指定变量是否为对象字面量
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isPlainObject : function(value) {
			if(!fastDev.isObject(value) || value.nodeType || fastDev.isWindow(value)) {
				return false;
			}
			if(value.constructor && !hasOwn.call(value, "constructor") && !hasOwn.call(value.constructor.prototype, "isPrototypeOf")) {
				return false;
			}
			var key;
			for(key in value ) {
			}
			return key === undefined || hasOwn.call(value, key);
		},
		/**
		 * 判断指定变量是否为空对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isEmptyObject : function(value) {
			for(var name in value ) {
				return false;
			}
			return true;
		},
		/**
		 * 判断指定变量是否为空数组
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isEmptyArray : function(value) {
			return value.length && value.length > 0 ? false : true;
		},
		/**
		 * 判断指定变量是否为Dom节点对象
		 * @param {Object} value
		 * @return {Boolean}
		 * @private
		 */
		isTextNode : function(value) {
			return value ? value.nodeName === "#text" : false;
		},
		/**
		 * 判断指定变量是否为Dom元素对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isElement : function(value) {
			return value ? value.nodeType === 1 : false;
		},
		/**
		 * 判断指定变量是否为窗体对象
		 * @param {Object} value
		 * @return {Boolean}
		 */
		isWindow : function(value) {
			return value && typeof value === "object" && "setInterval" in value;
		},
		/**
		 * 空函数常量
		 * @type {Function}
		 */
		noop : function() {
		},
		/**
		 * 获取唯一Id
		 * @return {Number}
		 */
		getID : function() {
			var num1 = new Date().getTime();
			var num2 = parseInt(Math.random() * 100000, 10);
			return num1 + num2;
		},
		/**
		 * 将以"-"分隔的字符串转换为驼峰格式
		 * @param {String} value
		 * @return {String}
		 */
		camelCase : function(value) {
			return value.replace(/^-ms-/, "ms-").replace(/-([a-z]|[0-9])/ig, fastDev.Util.StringUtil.capitalize);
		},
		/**
		 * 将方法绑定到指定作用域执行
		 * @param {Object} context 作用域
		 * @param {Function} handle 方法句柄
		 * @return {Function}
		 */
		setFnInScope : function(context, handle) {
			return function() {
				return handle.apply(context, arguments);
			};
		},
		/**
		 * 将方法绑定到指定作用域执行并传参
		 * @param {Object} context 作用域
		 * @param {Function} handle 方法句柄
		 * @param {Object|String|Number} paramX 参数
		 * @return {Function}
		 */
		setFnInScopeByParam : function(obj, fun) {
			return (function(args) {
				var index = 2, params = [],param;
				while(index < args.length) {
					params.push(args[index]);
					index++;
				}
				//fun.param = param;
				return function() {
					index = 0;
					while( param = arguments[index]) {
						//fun.
						params.splice(0, 0, param);
						index++;
					}
					return fun.apply(obj, params);
				};
			})(arguments);
		},
		fire : function(fn, context) {
			if(!fastDev.isFunction(fn)) {
				return;
			}
			var param = [], index = 2;
			while(arguments[index]) {
				param.push(arguments[index]);
			}
			fn.apply(context, param);
		},
		/**
		 * 克隆方法
		 * @param {Object} obj 克隆模板对象
		 * @return {Object}
		 */
		clone : function(obj) {
			var Getter = function() {
			};
			Getter.prototype = obj;
			Getter.prototype.constructor = Getter;
			return new Getter();
		},
		/**
		 * 检测指定值与目标值是否满足匹配类型
		 * @param {String} s_value 指定值
		 * @param {String} t_value 目标值
		 * @param {String} type 匹配类型
		 * @return {Boolean}
		 * @private
		 */
		execCond : function(s_value, t_value, type) {
			var ret = false;
			switch(type) {
				case "=":
					ret = RegExp("\\s" + t_value + "\\s").test(" " + s_value + " ");
					break;
				case "==":
					ret = s_value === t_value;
					break;
				case "!":
					ret = s_value !== t_value;
					break;
				case "^":
					ret = RegExp("^" + t_value).test(s_value);
					break;
				case "~":
					ret = RegExp(t_value).test(s_value);
					break;
				case "$":
					ret = RegExp(t_value + "$").test(s_value);
					break;
			}
			return ret;
		}
	});

	var ready = false, isReady = false, loaded, readyList, callbacks = [], inProgress = true;
	if(doc.addEventListener) {
		loaded = function() {
			doc.removeEventListener("DOMContentLoaded", loaded, false);
			executeReady();
		};
	} else if(doc.attachEvent) {
		loaded = function() {
			if(doc.readyState === "complete") {
				doc.detachEvent("onreadystatechange", loaded);
				executeReady();
			}
		};
	}
	readyList = {
		push : function() {
			var args = arguments, i, length, handle;
			for( i = 0, length = args.length; i < length; i++) {
				handle = args[i];
				if(fastDev.isFunction(handle)) {
					callbacks.push(handle);
				}
			}
			if(inProgress === false) {
				readyList.execute(doc);
			}
			return this;
		},
		execute : function(context) {
			while(callbacks[0]) {
				callbacks.shift().call(context);
			}
			inProgress = false;
		}
	};

	/**
	 * 绑定监听页面就绪事件
	 * @private
	 */
	function bindReady() {
		if(ready) {
			return;
		}
		ready = true;
		if(doc.readyState === "complete") {
			return window.setTimeout(executeReady, 1);
		}
		if(doc.addEventListener) {
			doc.addEventListener("DOMContentLoaded", loaded, false);
			window.addEventListener("load", executeReady, false);
		} else if(doc.attachEvent) {
			doc.attachEvent("onreadystatechange", loaded);
			doc.attachEvent("onload", executeReady);
			var toplevel = false;
			try {
				toplevel = window.frameElement === null;
			} catch(e) {
			}
			if(doc.documentElement.doScroll && toplevel) {
				doScrollCheck();
			}
		}
	}

	/**
	 * 页面就绪时调用回调方法组的执行
	 * @private
	 */
	function executeReady() {
		if(!isReady) {
			if(!doc.body) {
				return window.setTimeout(executeReady, 1);
			}
			isReady = true;
			readyList.execute(doc);
		}

	}

	/**
	 * Ie下检测文档就绪方法
	 * @private
	 */
	function doScrollCheck() {
		if(isReady) {
			return;
		}
		try {
			doc.documentElement.doScroll("left");
		} catch(e) {
			window.setTimeout(doScrollCheck, 1);
			return;
		}

		executeReady();
	}

	/**
	 * 指定函数在页面文档就绪时执行
	 * @param {Function} handle
	 */
	fastDev.ready = function(handle) {
		bindReady();
		readyList.push(handle);
	};

	window.fastDev = window.$ ? fastDev : window.$ = fastDev;
})(window);

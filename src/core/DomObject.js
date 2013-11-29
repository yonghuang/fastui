/**
 * @class fastDev.Core.DomObject
 * @extends fastDev.Core.Base
 * 当前类为Dom操作的封装，实现了Dom的常用操作,包括检索、事件、属性、样式、动画这几个方面
 */

fastDev.define("fastDev.Core.DomObject", {
	extend : "fastDev.Core.Base",
	alias : "DomObject",
	_options : {
		/**
		 * 查询字符串
		 * @type {string}
		 */
		selector : null,
		/**
		 * 查询作用域
		 * @type {Object}
		 */
		context : null,
		/**
		 * 静态元素
		 * @type {Element}
		 */
		elem : null
	},
	/**
	 *
	 * @param {Object} options
	 * @param {Object} global
	 * @protected
	 */
	init : function(options, global) {
		var selector = options.selector, context = options.context, elem = options.elem, rs = [];

		if(fastDev.isWindow(elem)) {
			this.elems = [elem];
			return;
		}

		if(fastDev.isString(selector)) {
			rs = rs.concat(fastDev.Query.find(selector, context));
		}

		if(elem && elem.nodeType) {
			rs.push(elem);
			options.elem = null;
		}

		if(fastDev.isArray(elem)) {
			rs = rs.concat(elem);
		}

		this.elems = rs;
	},
	/**
	 * 往当前对象中增加Element元素
	 * @param {Element} elem
	 */
	addElement : function(elem) {
		if(!elem) {
			return this;
		}

		if(elem.nodeType) {
			this.elems.push(elem);
			return this;
		}

		while(elem[0]) {
			this.addElement(elem.shift());
		}

		return this;
	},
	/**
	 * 绑定事件
	 * @param {String} type 事件类型
	 * @param {Function} handle 事件句柄
	 * @param {Object} [context] 事件作用域
	 * @return {fastDev.Core.DomObject}
	 */
	bind : function(type, handle, context) {
		if(!this.hasElem()) {
			return this;
		}
		if(fastDev.isValid(context)) {
			handle = fastDev.setFnInScope(context, handle);
		}
		return this.each(fastDev.Core.EventManager.bindEvent, type, handle);
	},
	/**
	 * 删除绑定事件
	 * @param {String} type 事件类型
	 * @param {Function} handle 事件句柄
	 * @return {fastDev.Core.DomObject}
	 */
	unbind : function(type, handle) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Core.EventManager.unbind, type, handle);
	},
	/**
	 * 设置/获得Dom元素属性值(适用于Dom源生属性)
	 * @param {String} name 属性名称
	 * @param {String|Number} [value] 属性值
	 * @return {String/Number/fastDev.Core.DomObject}
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回属性值
	 */
	prop : function(name, value) {
		var valid = this.hasElem();
		if(value !== undefined) {
			if(!valid) {
				return this;
			}
			return this.each(fastDev.Dom.prop, name, value);
		}
		if(!valid) {
			return "";
		}
		return fastDev.Dom.prop(this.elems[0], name);
	},
	/**
	 * 删除Dom元素属性值(适用于Dom源生属性)
	 * @param {String} name 属性名称
	 * @return {fastDev.Core.DomObject}
	 */
	removeProp : function(name) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.removeProp, name);
	},
	/**
	 * 设置/获得Dom元素属性值(适用于自定义属性)
	 * @param {String} name 属性名称
	 * @param {String|Number} [value] 属性值
	 * @return {String/Number/fastDev.Core.DomObject}
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回属性值
	 */
	attr : function(name, value) {
		var valid = this.hasElem();

		if(value !== undefined) {
			if(!valid) {
				return this;
			}
			return this.each(fastDev.Dom.attr, name, value);
		}
		if(!valid) {
			return "";
		}
		return fastDev.Dom.attr(this.elems[0], name);
	},
	/**
	 * 删除Dom元素属性值(适用于自定义属性)
	 * @param {String} name 属性名称
	 * @return {fastDev.Core.DomObject}
	 */
	removeAttr : function(name) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.removeAttr, name);
	},
	/**
	 * 获取样式名
	 * @return {String}
	 */
	getClass : function() {
		if(!this.hasElem()) {
			return "";
		}
		return fastDev.Dom.prop(this.elems[0], "class");
	},
	/**
	 * 设置样式名
	 * @param {String} class 样式名称
	 * @return {fastDev.Core.DomObject}
	 */
	setClass : function(value) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.prop, "class", value);
	},
	/**
	 * 增加样式名
	 * @param {String} class 样式名称
	 * @return {fastDev.Core.DomObject}
	 */
	addClass : function(value) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.addClass, value);
	},
	/**
	 * 删除样式名
	 * @param {String} class 样式名称
	 * @return {fastDev.Core.DomObject}
	 */
	removeClass : function(value) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.removeClass, value);
	},
	/**
	 * 判断样式名是否存在
	 * @param {String} class 样式名称
	 * @return {Boolean}
	 */
	hasClass : function(value) {
		if(!this.hasElem()) {
			return false;
		}
		if(fastDev.isElement(this.elems[0])) {
			return fastDev.Dom.hasClass(this.elems[0], value);
		}
	},
	/**
	 * 在俩个指定样式之间进行切换 "classname1,classname2"
	 * @param {String} class 样式名称
	 * @return {Boolean}
	 */
	toggleClass : function(value) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.toggleClass, value);
	},
	/**
	 * 设置/获取Dom元素style属性值
	 * @param {String} name 样式属性名称
	 * @param {String} [value] 样式属性值
	 * @return {Number/String/fastDev.Core.DomObject}
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回样式值
	 */
	css : function(name, value) {
		if( typeof name === "object") {
			for(var p in name) {
				this.css(p, name[p]);
			}
			return this;
		}

		var valid = this.hasElem();

		if(value !== undefined) {
			if(!valid) {
				return this;
			}
			return this.each(fastDev.Dom.css, name, value);
		}
		if(!valid) {
			return "";
		}
		return fastDev.Dom.css(this.elems[0], name);
	},
	/**
	 * 清除Dom元素Style属性值
	 * @param {String} name 样式属性名称
	 * @return {fastDev.Core.DomObject}
	 */
	removeCss : function(name) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.removeCss, name);
	},
	/**
	 * 隐藏Dom元素
	 * @return {fastDev.Core.DomObject}
	 */
	hide : function() {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.hide);
	},
	/**
	 * 显示Dom元素
	 * @return {fastDev.Core.DomObject}
	 */
	show : function() {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.show);
	},
	/**
	 * 判断当前Dom元素是否可见
	 * @return {Boolean}
	 */
	isShow : function() {
		if(!this.hasElem()) {
			return false;
		}
		return fastDev.Dom.isShow(this.elems[0]);
	},
	/**
	 * 如果当前Dom元素可见则设置为不可见，否则设置为可见
	 * @return {fastDev.Core.DomObject}
	 */
	toggle : function() {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.toggle);
	},
	/**
	 * 获取Element绝对位置top,left
	 * @param {JsonObject} [options] 元素目标坐标值
	 * @param {String} [options.top]  元素目标top值
	 * @param {String} [options.left]  元素目标left值
	 * @return {Object}
	 * 返回对象包含俩个属性:top(Element的X坐标值)和left(Element的Y坐标值)
	 */
	offset : function(options) {
		if(!this.hasElem()) {
			return {
				top : 0,
				left : 0
			};
		}
		return fastDev.Dom.offset(this.elems[0],options);
	},
	/**
	 * 获取/设置Dom元素宽度（内容）
	 * @param {String} [value] 宽度值
	 * @return {Number|fastDev.Core.DomObject}
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回宽度值
	 */
	width : function(value) {
		var valid = this.hasElem();

		if(fastDev.isValid(value)) {
			if(!valid) {
				return this;
			}
			var m;
			if( m = /([+\-])+(\d+)/.exec(value)) {
				if(m[1] === "+") {
					value = fastDev.Dom.width(this.elems[0]) + (m[2] * 1);
				} else {
					value = fastDev.Dom.width(this.elems[0]) - (m[2] * 1);
					value = value < 30 ? 30 : value;
				}
			}
			return this.each(fastDev.Dom.width, value);
		}
		if(!valid) {
			return 0;
		}
		return fastDev.Dom.width(this.elems[0]);
	},
	/**
	 * 获取Dom元素宽度(内容+padding)
	 * @return {Number}
	 */
	innerWidth : function() {
		if(!this.hasElem()) {
			return 0;
		}
		return fastDev.Dom.innerWidth(this.elems[0]);
	},
	/**
	 * 获取Dom元素宽度（内容+padding+border）
	 * @param {Boolean} margin (Optional) 是否包含margin值
	 * @return {Number}
	 */
	outerWidth : function(margin) {
		if(!this.hasElem()) {
			return 0;
		}
		return fastDev.Dom.outerWidth(this.elems[0], margin);
	},
	/**
	 * 获取/设置Dom元素高度(内容)
	 * @param {String} [value] 高度值
	 * @return {Number/fastDev.Core.DomObject}
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回高度值
	 */
	height : function(value) {
		var valid = this.hasElem();

		if(fastDev.isValid(value)) {
			if(!valid) {
				return this;
			}
			var m;
			if( m = /([+\-])+(\d+)/.exec(value)) {
				if(m[1] === "+") {
					value = fastDev.Dom.height(this.elems[0]) + (m[2] * 1);
				} else {
					value = fastDev.Dom.height(this.elems[0]) - (m[2] * 1);
					value = value < 30 ? 30 : value;
				}
			}
			return this.each(fastDev.Dom.height, value);
		}
		if(!valid) {
			return 0;
		}
		return fastDev.Dom.height(this.elems[0]);
	},
	/**
	 * 获取/设置水平滚动条X坐标值
	 * @param {Number} [value] X坐标值
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回X坐标值
	 */
	scrollLeft : function(value) {
		var valid = this.hasElem();
		if(value !== undefined) {
			if(!valid) {
				return this;
			}
			return this.each(fastDev.Dom.scrollLeft, value);
		}
		if(!valid) {
			return 0;
		}
		return fastDev.Dom.scrollLeft(this.elems[0]);
	},
	/**
	 * 获取/设置垂直滚动条Y坐标值
	 * @param {Number} [value] Y坐标值
	 * 此方法做设置用时返回{@link fastDev.Core.DomObject},做获取用时返回Y坐标值
	 */
	scrollTop : function(value) {
		var valid = this.hasElem();
		if(value !== undefined) {
			if(!valid) {
				return this;
			}
			return this.each(fastDev.Dom.scrollTop, value);
		}
		if(!valid) {
			return 0;
		}
		return fastDev.Dom.scrollTop(this.elems[0]);
	},
	/**
	 * 获取高度(内容+padding)
	 * @return {Number}
	 */
	innerHeight : function() {
		if(!this.hasElem()) {
			return 0;
		}
		return fastDev.Dom.innerHeight(this.elems[0]);
	},
	/**
	 * 获取高度(内容+padding+border)
	 * @param {Boolean} margin (Optional) 是否包含margin值
	 * @return {Number}
	 */
	outerHeight : function(margin) {
		if(!this.hasElem()) {
			return 0;
		}
		return fastDev.Dom.outerHeight(this.elems[0], margin);
	},
	/**
	 * 获取子元素对象
	 * @param {String} [selector] 子元素查询条件
	 * @return {fastDev.Core.DomObject}
	 */
	children : function(selector) {
		var rs = [];
		for(var i = 0; i < this.elems.length; i++) {
			var children = fastDev.Dom.children(this.elems[i]);
			if(fastDev.isString(selector)) {
				children = fastDev.Query.filter(selector, children);
			}
			rs = rs.concat(children);
		}
		return fastDev(rs);
	},
	/**
	 * 删除指定Dom元素所有子元素对象
	 * @return {fastDev.Core.DomObject}
	 */
	empty : function() {
		if(!this.hasElem()) {
			return this;
		}
		for(var i = 0, elem, elems = this.elems; elem = elems[i]; i++) {
			fastDev(elem).children().remove();
		}
		return this;
	},
	/**
	 * 获取当前对象父元素
	 * @return {fastDev.Core.DomObject}
	 */
	parent : function(selector) {

		var rs = [];
		for(var i = 0; i < this.elems.length; i++) {
			var parent = [fastDev.Dom.parent(this.elems[i])];
			if(fastDev.isString(selector)) {
				parent = fastDev.Query.filter(selector, parent);
			}
			rs = rs.concat(parent);
		}
		return fastDev(rs);

		//return fastDev(fastDev.Dom.parent(this.elems[0]));
	},
	/**
	 * 获取当前对象所有祖先元素
	 * @param {String} [selector] 子元素查询条件
	 * @return {fastDev.Core.DomObject}
	 */
	parents : function(selector) {
		var rs = [];
		for(var i = 0; i < this.elems.length; i++) {
			var parents = fastDev.Dom.parents(this.elems[i]);
			if(fastDev.isString(selector)) {
				parents = fastDev.Query.filter(selector, parents);
			}
			rs = rs.concat(parents);
		}
		return fastDev(rs);
	},
	/**
	 * 获取当前对象的首个子节点
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {fastDev.Core.DomObject}
	 */
	first : function() {
		if(!this.hasElem()) {
			return fastDev.create("DomObject");
		}
		return fastDev(fastDev.Dom.first(this.elems[0]));
	},
	/**
	 * 获取当前对象的最后一个子节点
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {fastDev.Core.DomObject}
	 */
	last : function() {
		if(!this.hasElem()) {
			return fastDev.create("DomObject");
		}
		return fastDev(fastDev.Dom.last(this.elems[0]));
	},
	/**
	 * 获取当前对象的下一个兄弟节点
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {fastDev.Core.DomObject}
	 */
	next : function(selector) {
		var rs = [];
		for(var i = 0; i < this.elems.length; i++) {
			var next = fastDev.Dom.next(this.elems[i]);
			if(!fastDev.isValid(next)) {
				continue;
			}
			next = [next];
			if(fastDev.isString(selector)) {
				next = fastDev.Query.filter(selector, next);
			}
			rs = rs.concat(next);
		}
		return fastDev(rs);
		//return fastDev(fastDev.Dom.next(this.elems[0]));
	},
	/**
	 * 获取当前对象的上一个兄弟节点
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {fastDev.Core.DomObject}
	 */
	prev : function(selector) {
		var rs = [];
		for(var i = 0; i < this.elems.length; i++) {
			var prev = fastDev.Dom.prev(this.elems[i]);
			if(!fastDev.isValid(prev)) {
				continue;
			}
			prev = [prev];
			if(fastDev.isString(selector)) {
				prev = fastDev.Query.filter(selector, prev);
			}
			rs = rs.concat(prev);
		}
		return fastDev(rs);
		//return fastDev(fastDev.Dom.prev(this.elems[0]));
	},
	/**
	 * 设置当前对象文本
	 * @param {String} text 文本
	 * @return {fastDev.Core.DomObject}
	 */
	setText : function(value) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.setText, value);
	},
	/**
	 * 获取当前对象文本
	 * @param {Boolean} [all=false] 是否获取所有文本
	 * @return {String}
	 */
	getText : function(all) {
		if(!this.hasElem()) {
			return "";
		}
		return fastDev.Dom.getText(this.elems[0], all);
	},
	/**
	 * 为当前对象增加文本
	 * @param {String} text 文本值
	 * @return {fastDev.Core.DomObject}
	 */
	addText : function(value) {
		if(!this.hasElem()) {
			return this;
		}
		return this.each(fastDev.Dom.addText, value);
	},
	/**
	 * 添加子元素至指定元素
	 * @param {Element} elem 子元素
	 * @return {fastDev.Core.DomObject}
	 */
	append : function(elems) {
		if(!this.hasElem() || !elems) {
			return this;
		}

		if(fastDev.isArray(elems)) {
			for(var i = 0, elem; elem = elems[i]; i += 1) {
				this.append(elem);
			}
			return this;
		}

		if(elems.elems) {
			return this.append(elems.elems);
		}

		if(elems.nodeType) {
			fastDev.Dom.append(this.elems[0], elems);
		}

		return this;
	},
	/**
	 * 将当前元素渲染至目标元素下
	 * @param {Element/fastDev.Core.DomObject} elem
	 */
	appendTo : function(elem) {
		if(!this.hasElem()) {
			return this;
		}

		if(elem.append) {
			elem.append(this);
		}

		if(elem.nodeType) {
			fastDev(elem).append(this);
		}
		return this;
	},
	/**
	 * 删除当前对象所有Dom元素
	 * @return {fastDev.Core.DomObject}
	 */
	remove : function() {
		var elems = this.elems, elem, eventManager = fastDev.Core.EventManager;
		while( elem = elems.shift()) {
			if(!elem || !elem.nodeType) {
				continue;
			}
			var elements = fastDev.Dom.elements(elem);
			for(var i = 0, child; child = elements[i]; i += 1) {
				eventManager.unbind(child);
			}
			eventManager.unbind(elem);
			fastDev.Dom.remove(elem);
		}
		return this;
	},
	/**
	 * 将当前Dom对象添加至目标元素之后
	 * @param {Element/fastDev.Core.DomObject} target 目标元素
	 * @return {fastDev.Core.DomObject}
	 */
	insertAfter : function(elem) {
		if(!this.hasElem()) {
			return this;
		}
		if(elem.elems) {
			elem = elem.elems[0];
		}

		if(elem && elem.nodeType) {
			this.each(fastDev.Dom.insertAfter, elem);
		}
		return this;
	},
	/**
	 * 将当前Dom对象添加至目标元素之前
	 * @param {Element/fastDev.Core.DomObject} target 目标元素
	 * @return {fastDev.Core.DomObject}
	 */
	insertBefore : function(elem) {
		if(!this.hasElem()) {
			return this;
		}
		if(elem.elems) {
			elem = elem.elems[0];
		}

		if(elem && elem.nodeType) {
			this.each(fastDev.Dom.insertBefore, elem);
		}
		return this;
	},
	/**
	 * 用当前Dom对象替换指定元素
	 * @param {Element/fastDev.Core.DomObjec} elem 指定元素
	 * @return {fastDev.Core.DomObject}
	 */
	replace : function(elem) {
		if(!this.hasElem()) {
			return this;
		}

		if(elem.elems) {
			elem = elem.elems[0];
		}

		if(elem.nodeType) {
			var fragment, elems = this.elems;
			if(elems.length > 1) {
				fragment = fastDev.Dom.createFragment();
				for(var i = 0, child; child = elems[i]; i += 1) {
					if(child.nodeType) {
						fastDev.Dom.append(fragment, child);
					} else {
						break;
					}
				}

			} else {
				fragment = this.elems[0];
			}

			fastDev.Dom.replace(fragment, elem);
		}
		return this;
	},
	/**
	 * Dom元素查找方法
	 * @param {String} selector 查询条件
	 * @param {Element} context 查询范围
	 * @return {fastDev.Core.DomObject}
	 */
	find : function(selector) {
		if(!this.hasElem()) {
			return fastDev.create("DomObject");
		}
		return fastDev.create("DomObject").addElement(fastDev.Query.find(selector, this.elems));
	},
	/**
	 * 返回当前对象相对于父元素的位置
	 * @return {Object}
	 */
	position : function() {
		if(!this.hasElem()) {
			return {
				top : 0,
				left : 0
			};
		}
		return fastDev.Dom.position(this.elems[0]);
	},
	/**
	 * 判断当前对象是否包含指定元素
	 * @param {Element/fastDev.Core.DomObject} elem 指定元素
	 * @return {Boolean}
	 */
	contains : function(elem) {
		if(!elem || !this.hasElem()) {
			return false;
		}

		if(elem.elems) {
			elem = elem.elems[0];
		}

		return fastDev.Dom.contains(this.elems[0], elem);
	},
	/**
	 * 克隆当前DomObject对象并返回副本
	 * @param {Boolean} [all=true] 是否克隆其子元素
	 * @return {fastDev.Core.DomObject}
	 */
	clone : function(all) {
		var newElems = [], currElems = this.elems, domObj = fastDev.create("DomObject");
		for(var i = 0, elem; elem = currElems[i]; i += 1) {
			newElems.push(fastDev.Dom.clone(elem, all));
		}
		domObj.elems = newElems;
		return domObj;
	},
	/**
	 * 触发指定类型事件
	 * @param {String} type 事件类型
	 */
	fire : function(type) {
		if(!this.hasElem()) {
			return this;
		}
		fastDev.Dom.fire(this.elems[0], type);
		return this;
	},
	/**
	 * 遍历当前Dom对象
	 * @param {Function} handle 遍历执行方法
	 * @param {Object} arguments 遍历执行方法参数
	 * @return {fastDev.Core.DomObject}
	 */
	each : function() {
		
		var elem, i = 0,
			elems = this.elems,
			params = [].slice.call(arguments),
			handle = params[0];
		
		for( ; elem = elems[i]; i += 1) {
			params[0] = elem;
			params.splice(0, 1, elem);
			handle.apply(elem, params);
		}
		return this;
	},
	/**
	 * 是否有效操作
	 * @return {Boolean}
	 * @private
	 */
	hasElem : function() {
		return this.elems.length > 0;
	},
	/**
	 * 判断当前DomObject对象是否拥有elem元素
	 * @return {Boolean}
	 */
	isEmpty : function() {
		return !this.elems.length;
	},
	/**
	 * 元素动画调用 
	 * @param {JsonObject} props 动画终止样式值
	 * @param {Number} speed 动画执行时间(毫秒)
	 * @param {String} easing 动画执行算法
	 * @param {Function} callback 动画执行完成回调
	 */
	animate : function(props, speed, easing, callback) {
		// 无动画载体或无关键参数时，当前动画无效
		if(this.isEmpty() || fastDev.isEmptyObject(props)) {
			return this;
		}
		// 是否需要解析
		var parse,
		// 是否需要激活
		activate = !this.fxqueue || this.fxqueue.length === 0,
		// 重新调整动画运行参数
		animation = fastDev.Animate.correctParam(speed, easing, callback);
		animation.fxqueue = this.fxqueue || (this.fxqueue = []);
		// 当前队列是否正在运行
		if( parse = this.fxqueue[0] === "parse") {
			this.fxqueue.shift();
		} else {
			this.fxqueue.push("spliter");
		}
		//parse=!this.fxqueue || this.fxqueue[0] === "parse";
		// 初始化本次动画的执行区域
		// 如果正在运行中，则添加动画生成句柄至队列中
		// 当动画运行完成时会解析句柄生成动画运行依赖参数
		if(parse || activate) {
			// 生成动画对象运行的依赖参数
			this.each(fastDev.Animate.buildAnimation, props, animation, parse);
			// 添加到定时器队列中
			fastDev.Animate.timers.push(animation);
			// 激活定时器运行动画
			fastDev.Animate.activate();
		} else {
			// 动画生成句柄
			this.fxqueue.push(fastDev.setFnInScopeByParam(this, this.animate, props, speed, easing, callback));
		}
		return this;
	},
	/**
	 * 停止动画 
	 */
	stopAnimate : function(){
		for(var i=0;i<this.fxqueue.length;i++){
			if(this.fxqueue[i].startTime){
				this.fxqueue[i].startTime -= 60000;
			}
		}
	}
});

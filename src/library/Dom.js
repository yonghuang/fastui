/**
 * Dom元素操作类，主要处理各种浏览器之间Dom操作的兼容性问题
 * @class fastDev.Dom
 * @author 袁刚
 * @singleton
 */
fastDev.Dom = {
	/**
	 * 属性兼容映射
	 * @private
	 */
	propMapping : {
		tabindex : "tabIndex",
		readonly : "readOnly",
		"for" : "htmlFor",
		"class" : "className",
		maxlength : "maxLength",
		cellspacing : "cellSpacing",
		cellpadding : "cellPadding",
		rowspan : "rowSpan",
		colspan : "colSpan",
		usemap : "useMap",
		frameborder : "frameBorder",
		contenteditable : "contentEditable"
	},
	/**
	 * 设置样式值时,不需要附加"px"样式属性 列表
	 * @private
	 */
	cssNumber : {
		fontWeight : true,
		lineHeight : true,
		opacity : true,
		zIndex : true,
		zoom : true
	},
	cssPrefixes : ["Webkit", "O", "Moz", "ms"],
	cssProps : {
		// normalize float css property
		"float" : fastDev.Support.cssFloat ? "cssFloat" : "styleFloat"
	},
	cssExpand : ["Top", "Right", "Bottom", "Left"],
	cssShow : {
		position : "absolute",
		visibility : "hidden",
		display : "block"
	},
	cssHooks : {},
	cssNormalTransform : {
		letterSpacing : 0,
		fontWeight : 400
	},
	/**
	 * 检查是否值为布尔类型的属性正则
	 * @private
	 */
	rboolean : /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	rnum : /^[\-+]?(?:\d*\.)?\d+$/i,
	rmargin : /^margin/,
	rnumnonpx : /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rtable : /^t(?:able|d|h)$/i,
	rroot : /^(?:body|html)$/i,
	ropacity : /opacity=([^)]*)/,
	core_pnum : /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
	ralpha : /alpha\([^)]*\)/i,
	rposition : /^(top|right|bottom|left)$/,
	styleImpl : function(elem, name, value, extra) {
		if(!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
			return;
		}

		var ret, type, hooks, origName = fastDev.camelCase(name), style = elem.style;

		name = this.cssProps[origName] || (this.cssProps[origName] = this.vendorPropName(style, origName) );

		hooks = this.cssHooks[name] || this.cssHooks[origName];

		if(value !== undefined) {
			type = typeof value;

			if(type === "string" && ( ret = this.rrelNum.exec(value))) {
				value = (ret[1] + 1 ) * ret[2] + parseFloat(fastDev.Dom.css(elem, name));
				type = "number";
			}

			if(!fastDev.isValid(value) || type === "number" && isNaN(value)) {
				return;
			}

			if(type === "number" && !this.cssNumber[origName]) {
				value += "px";
			}

			if(!hooks || !("set" in hooks) || ( value = hooks.set(elem, value, extra)) !== undefined) {
				try {
					style[name] = value;
				} catch(e) {
				}
			}

		} else {
			if(hooks && "get" in hooks && ( ret = hooks.get(elem, false, extra)) !== undefined) {
				return ret;
			}

			return style[name];
		}

	},
	vendorPropName : function(style, name) {

		if( name in style) {
			return name;
		}

		var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = this.cssPrefixes.length;

		while(i--) {
			name = this.cssPrefixes[i] + capName;
			if( name in style) {
				return name;
			}
		}

		return origName;
	},
	cssImpl : function(elem, name, numeric, extra) {
		var val, num, hooks, origName = fastDev.camelCase(name);

		name = this.cssProps[origName] || (this.cssProps[origName] = this.vendorPropName(elem.style, origName) );

		hooks = this.cssHooks[name] || this.cssHooks[origName];

		if(hooks && "get" in hooks) {
			val = hooks.get(elem, true, extra);
		}

		if(val === undefined) {
			val = fastDev.Dom.curCSS(elem, name);
		}

		if(val === "normal" && name in this.cssNormalTransform) {
			val = this.cssNormalTransform[name];
		}

		if(numeric || extra !== undefined) {
			num = parseFloat(val);
			return numeric || fastDev.isNumer(num) ? num || 0 : val;
		}
		return val;
	},
	getOrset_WidthOrHeight : function(elem, value, type, extra) {
		var doc = elem.document;
		if(fastDev.isWindow(elem)) {
			var docElemProp = doc.documentElement["client" + type];
			return fastDev.Support.boxModel && docElemProp || doc.body && doc.body["client" + type] || docElemProp;
		}

		if(elem.nodeType === 9) {
			doc = elem.documentElement;

			if(doc["client" + type] >= doc["scroll" + type]) {
				return doc["client" + type];
			}

			return Math.max(elem.body["scroll" + type], doc["scroll" + type], elem.body["offset" + type], doc["offset" + type]);
		}

		if(value !== undefined) {
			fastDev.Dom["set"+type](elem, value);
		} else {
			if(elem.offsetWidth !== 0) {
				return fastDev.Dom.getWidthOrHeightImpl(elem, type, extra);
			} else {
				var old = {}, ret, name, cssShow = fastDev.Dom.cssShow;

				for(name in cssShow ) {
					old[name] = elem.style[name];
					elem.style[name] = cssShow[name];
				}

				ret = fastDev.Dom.getWidthOrHeightImpl(elem, type, extra);

				for(name in cssShow ) {
					elem.style[name] = old[name];
				}

				return ret;
			}
		}
	},
	getWidthOrHeightImpl : function(elem, name, extra) {

		var val = name === "Width" ? elem.offsetWidth : elem.offsetHeight, i = name === "Width" ? 1 : 0, len = 4, cssExpand = fastDev.Dom.cssExpand;

		if(val > 0) {
			if(extra !== "border") {
				for(; i < len; i += 2) {
					if(!extra) {
						val -= parseFloat(fastDev.Dom.css(elem, "padding" + cssExpand[i])) || 0;
					}
					if(extra === "margin") {
						val += parseFloat(fastDev.Dom.css(elem, extra + cssExpand[i])) || 0;
					} else {
						val -= parseFloat(fastDev.Dom.css(elem, "border" + cssExpand[i] + "Width")) || 0;
					}
				}
			}

			return val;
		}

		val = fastDev.Dom.css(elem, name);
		if(val < 0 || val === null) {
			val = elem.style[name];
		}

		if(fastDev.Dom.rnumnonpx.test(val)) {
			return val;
		}

		val = parseFloat(val) || 0;

		if(extra) {
			for(; i < len; i += 2) {
				val += parseFloat(fastDev.Dom.css(elem, "padding" + cssExpand[i])) || 0;
				if(extra !== "padding") {
					val += parseFloat(fastDev.Dom.css(elem, "border" + cssExpand[i] + "Width")) || 0;
				}
				if(extra === "margin") {
					val += parseFloat(fastDev.Dom.css(elem, extra + cssExpand[i])) || 0;
				}
			}
		}

		return val;
	},
	getOrSetScrollTopOrLeftImpl : function(elem, value, type, prop) {
		var top = /Y/.test(prop);

		var win = fastDev.Dom.getWindow(elem);

		if(value === undefined) {

			return win ? win[prop] ? win[prop] : fastDev.Support.boxModel && win.document.documentElement[type] || win.document.body[type] : elem[type];
		}

		if(win) {
			win.scrollTo(!top ? value : fastDev(win).scrollLeft(), top ? value : fastDev(win).scrollTop());

		} else {
			elem[type] = value;
		}

	},
	bodyOffset : function(body) {
		var top = body.offsetTop, left = body.offsetLeft;

		if(fastDev.Support.doesNotIncludeMarginInBodyOffset) {
			top += parseFloat(fastDev.Dom.css(body, "marginTop")) || 0;
			left += parseFloat(fastDev.Dom.css(body, "marginLeft")) || 0;
		}

		return {
			top : top,
			left : left
		};
	},
	getOffset : function(elem, doc, docElem) {
		var body = doc.body, top, left;

		if(document.documentElement.getBoundingClientRect) {
			var box;
			try {
				box = elem.getBoundingClientRect();
			} catch(e) {
			}

			if(!box || !fastDev.Dom.contains(docElem, elem)) {
				return box ? {
					top : box.top,
					left : box.left
				} : {
					top : 0,
					left : 0
				};
			}
			var win = fastDev.Dom.getWindow(doc),
			//
			clientTop = docElem.clientTop || body.clientTop || 0,
			//
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			//
			scrollTop = win.pageYOffset || fastDev.Support.boxModel && docElem.scrollTop || body.scrollTop,
			//
			scrollLeft = win.pageXOffset || fastDev.Support.boxModel && docElem.scrollLeft || body.scrollLeft;
			top = box.top + scrollTop - clientTop;
			left = box.left + scrollLeft - clientLeft;

			return {
				top : top,
				left : left
			};
		} else {
			var computedStyle,
			//
			offsetParent = elem.offsetParent,
			//
			prevOffsetParent = elem,
			//
			defaultView = doc.defaultView,
			//
			prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top = elem.offsetTop;
			left = elem.offsetLeft;

			while(( elem = elem.parentNode) && elem !== body && elem !== docElem) {
				if(fastDev.Browser.support.fixedPosition && prevComputedStyle.position === "fixed") {
					break;
				}

				computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
				top -= elem.scrollTop;
				left -= elem.scrollLeft;

				if(elem === offsetParent) {
					top += elem.offsetTop;
					left += elem.offsetLeft;

					if(fastDev.Browser.support.doesNotAddBorder && !(fastDev.Browser.support.doesAddBorderForTableAndCells && fastDev.Dom.rtable.test(elem.nodeName))) {
						top += parseFloat(computedStyle.borderTopWidth) || 0;
						left += parseFloat(computedStyle.borderLeftWidth) || 0;
					}

					prevOffsetParent = offsetParent;
					offsetParent = elem.offsetParent;
				}

				if(fastDev.Browser.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
					top += parseFloat(computedStyle.borderTopWidth) || 0;
					left += parseFloat(computedStyle.borderLeftWidth) || 0;
				}

				prevComputedStyle = computedStyle;
			}

			if(prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
				top += body.offsetTop;
				left += body.offsetLeft;
			}

			if(fastDev.Browser.support.fixedPosition && prevComputedStyle.position === "fixed") {
				top += Math.max(docElem.scrollTop, body.scrollTop);
				left += Math.max(docElem.scrollLeft, body.scrollLeft);
			}

			return {
				top : top,
				left : left
			};
		}
	},
	position : function(elem) {
		if(!elem) {
			return null;
		}

		var offsetParent = this.offsetParent(elem), offset = this.offset(elem), parentOffset = fastDev.Dom.rroot.test(offsetParent.nodeName) ? {
			top : 0,
			left : 0
		} : this.offset(offsetParent);

		offset.top -= parseFloat(fastDev.Dom.css(elem, "marginTop")) || 0;
		offset.left -= parseFloat(fastDev.Dom.css(elem, "marginLeft")) || 0;

		parentOffset.top += parseFloat(fastDev.Dom.css(offsetParent, "borderTopWidth")) || 0;
		parentOffset.left += parseFloat(fastDev.Dom.css(offsetParent, "borderLeftWidth")) || 0;

		return {
			top : offset.top - parentOffset.top,
			left : offset.left - parentOffset.left
		};
	},
	offsetParent : function(elem) {
		var offsetParent;

		if(elem) {
			offsetParent = elem.offsetParent || document.body;
			while(offsetParent && (!fastDev.Dom.rroot.test(offsetParent.nodeName.toLowerCase()) && fastDev.Dom.css(offsetParent, "position") === "static")) {
				offsetParent = offsetParent.offsetParent;
			}
		}
		return offsetParent;
	},
	getWindow : function(elem) {
		return fastDev.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
	},
	filterByNodeType : function(elem, nodeType, type) {
		if(nodeType === "all") {
			return elem;
		}

		nodeType = nodeType || 1;
		if(fastDev.isNumber(nodeType)) {
			while(elem && elem.nodeType !== nodeType) {
				elem = fastDev.Dom[type](elem);
			}
		}
		return elem;
	},
	getOrSetText : function(elem, text) {
		var childList = fastDev.Dom.children(elem, 3);
		if(text !== undefined) {
			var textnode = fastDev.Dom.createByHTML(text);
			fastDev.each(childList, function(i, item) {
				fastDev.Dom.remove(item);
			});
			fastDev.Dom.append(elem, textnode);
		} else {
			var i, node, nodeType = elem.nodeType, ret = "";

			if(nodeType) {
				if(nodeType === 1 || nodeType === 9 || nodeType === 11) {
					// Use textContent || innerText for elements
					if( typeof elem.textContent === 'string') {
						return elem.textContent;
					} else if( typeof elem.innerText === 'string') {
						// Replace IE's carriage returns
						return elem.innerText.replace(/\r/g, '');
					} else {
						// Traverse it's children
						for( elem = elem.firstChild; elem; elem = elem.nextSibling) {
							ret += fastDev.Dom.getOrSetText(elem);
						}
					}
				} else if(nodeType === 3 || nodeType === 4) {
					return elem.nodeValue;
				}
			} else {

				// If no nodeType, this is expected to be an array
				for( i = 0; ( node = elem[i]); i++) {
					// Do not traverse comment nodes
					if(node.nodeType !== 8) {
						ret += fastDev.Dom.getOrSetText(node);
					}
				}
			}
			return ret;
		}
	},
	setOffset: function( elem, options) {
		var position = fastDev.Dom.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = fastDev( elem ),
			curOffset = curElem.offset(),
			curCSSTop = fastDev.Dom.css( elem, "top" ),
			curCSSLeft = fastDev.Dom.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && /auto/.test([curCSSTop, curCSSLeft].join("")),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}


		if ( fastDev.isValid(options.top)) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( fastDev.isValid(options.left) ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}
		curElem.css( props );
	},

	/**
	 * 判断指定Dom元素是否包含目标Dom元素
	 * @param {Element} source 指定对象
	 * @param {Element} target 目标对象
	 * @return {Booelan}
	 */
	contains : function(source, elem) {
		if(document.documentElement.contains) {
			return source !== elem && (source.contains ? source.contains(elem) : true);
		} else if(document.documentElement.compareDocumentPosition) {
			return !!(source.compareDocumentPosition(elem) && 16);
		} else {
			return false;
		}
	},
	/**
	 * 克隆Dom元素
	 * @param {Element} elem 克隆原型
	 * @param {Boolean} [all=true] 是否克隆其子元素
	 * @return {Element}
	 */
	clone : function(elem, all) {
		return elem.cloneNode(all === false);
	},
	/**
	 * 设置/获得Dom元素属性值(适用于Dom源生属性)
	 * @param {Element} elem Dom元素
	 * @param {String} name 属性名称
	 * @param {String|Number} [value] 属性值
	 * @return {String|Number|undefined}
	 * 此方法做设置用时返回undefined,做获取用时返回属性值
	 */
	prop : function(elem, name, value) {
		// 忽略非控件
		var nType = elem.nodeType;
		// 忽略文本、注释、属性节点
		if(!elem || nType === 3 || nType === 8 || nType === 2) {
			return;
		}

		name = fastDev.Dom.propMapping[name] || name;
		if(fastDev.isValid(value)) {
			elem[name] = value;
		} else {
			return elem[name];
		}
	},
	/**
	 * 删除Dom元素属性值(适用于Dom源生属性)
	 * @param {Element} elem Dom元素
	 * @param {String} name 属性名称
	 */
	removeProp : function(elem, name) {
		name = fastDev.Dom.propMapping[name] || name;
		if(fastDev.Dom.rboolean.test(name)) {
			elem[name] = false;
		} else {
			try {
				elem[name] = undefined;
				delete elem[name];
			} catch( e ) {
			}
		}
	},
	/**
	 * 判断属性是否拥有指定属性值(适用于Dom源生属性)
	 */
	hasProp : function(elem, name) {
		return fastDev.isValid(fastDev.Dom.prop(elem, name));
	},
	/**
	 * 设置/获得Dom元素属性值(适用于自定义属性)
	 * @param {Element} elem Dom元素
	 * @param {String} name 属性名称
	 * @param {String|Number} [value] 属性值
	 * @return {String|Number|undefined}
	 * 此方法做设置用时返回undefined,做获取用时返回属性值
	 */
	attr : function(elem, name, value) {
		var nType = elem.nodeType;
		// 忽略文本、注释、属性节点
		if(!elem || nType === 3 || nType === 8 || nType === 2) {
			return;
		}

		if(!elem.getAttribute || fastDev.Dom.propMapping[name]) {
			return fastDev.Dom.prop(elem, name, value);
		}

		if(value !== undefined) {
			elem.setAttribute(name, "" + value);
		} else {
			return elem.getAttribute(name);
		}
	},
	/**
	 * 删除Dom元素属性值(适用于自定义属性)
	 * @param {Element} elem Dom元素
	 * @param {String} name 属性名称
	 */
	removeAttr : function(elem, name) {
		if(name && elem.nodeType === 1) {
			fastDev.Dom.attr(elem, name, "");
			elem.removeAttribute(name);
		}
	},
	/**
	 * 判断属性是否拥有指定属性值(适用于自定义属性)
	 */
	hasAttr : function(elem, name) {
		return fastDev.isValid(fastDev.Dom.attr(elem, name));
	},
	/**
	 * 增加样式名
	 * @param {Element} elem Dom元素
	 * @param {String} class 样式名称
	 */
	addClass : function(elem, classname) {
		var _classname = " " + fastDev.Dom.prop(elem, "class") + " ";
		if(_classname.indexOf(" " + classname + " ") === -1) {
			_classname += classname + " ";
		}

		elem.className = fastDev.Util.StringUtil.trim(_classname);
	},
	/**
	 * 删除样式名
	 * @param {Element} elem Dom元素
	 * @param {String} class 样式名称
	 */
	removeClass : function(elem, classname) {
		var _classname = " " + fastDev.Dom.prop(elem, "class") + " ";
		classname = _classname.replace(" " + classname + " ", " ");
		elem.className = fastDev.Util.StringUtil.trim(classname);
	},
	/**
	 * 判断样式名是否存在
	 * @param {Element} elem Dom元素
	 * @param {String} class 样式名称
	 * @return {Boolean}
	 */
	hasClass : function(elem, classname) {
		var _classname = " " + fastDev.Dom.prop(elem, "class") + " ";
		return _classname.indexOf(" " + classname + " ") >= 0;
	},
	/**
	 * 如果Dom元素拥有样式1则删除样式1设置样式2，否则删除样式2，设置样式1
	 * @param {Element} elem Dom元素
	 * @param {String} class 样式1,样式2
	 */
	toggleClass : function(elem, classname) {
		var m = /([^,]*),([^,]*)/.exec(classname), class1 = m[1], class2 = m[2];
		if(class1 && class2) {
			if(fastDev.Dom.hasClass(elem, class1)) {
				fastDev.Dom.removeClass(elem, class1);
				fastDev.Dom.addClass(elem, class2);
			} else {
				fastDev.Dom.removeClass(elem, class2);
				fastDev.Dom.addClass(elem, class1);
			}
		}
	},
	/**
	 * 设置/获取Dom元素style属性值
	 * @param {Element} elem Dom元素
	 * @param {String} name 样式属性名称
	 * @param {String} [value] 样式属性值
	 * @return {Number|String|undefined}
	 * 此方法做设置用时返回undefined,做获取用时返回样式值
	 */
	css : function(elem, name, value) {
		return value !== undefined ? fastDev.Dom.styleImpl(elem, name, value) : fastDev.Dom.cssImpl(elem, name);
	},
	/**
	 * 清除Dom元素Style属性值
	 * @param {Element} elem Dom元素
	 * @param {String} name 样式属性名称
	 */
	removeCss : function(elem, name) {
		fastDev.Dom.css(elem, name, "");
	},
	/**
	 * 隐藏Dom元素
	 * @param {Element} elem Dom元素
	 */
	hide : function(elem) {
		fastDev.Dom.css(elem, "display", "none");
		fastDev.Dom.removeClass(elem, "ui-display");
	},
	/**
	 * 显示Dom元素
	 * @param {Element} elem Dom元素
	 */
	show : function(elem) {
		fastDev.Dom.removeCss(elem, "display");
		fastDev.Dom.removeClass(elem, "ui-hidden");
	},
	/**
	 * 判断当前Dom元素是否可见
	 * @param {Element} elem Dom元素
	 * @return {Boolean}
	 */
	isShow : function(elem) {
		return !(fastDev.Dom.hasClass(elem, "ui-hidden") || fastDev.Dom.css(elem, "display") === "none");
	},
	/**
	 * 如果当前Dom元素可见则设置为不可见，否则设置为可见
	 * @param {Element} elem Dom元素
	 */
	toggle : function(elem) {
		if(fastDev.Dom.isShow(elem)) {
			fastDev.Dom.hide(elem);
		} else {
			fastDev.Dom.show(elem);
		}
	},
	/**
	 * 获取Element绝对位置top,left
	 * @param {Element} elem Dom元素
	 * @param {JsonObject} [options] 元素目标坐标值
	 * @param {String} [options.top]  元素目标top值
	 * @param {String} [options.left]  元素目标left值
	 * @return {Object}
	 * 返回对象包含俩个属性:top(Element的X坐标值)和left(Element的Y坐标值)
	 */
	offset : function(elem, options) {
		var doc = elem && elem.ownerDocument;

		if(!doc) {
			return null;
		}

		if(elem === doc.body) {
			return fastDev.Dom.bodyOffset(elem);
		}
		
		if(fastDev.isValid(options)){
			fastDev.Dom.setOffset(elem, options);
		}
		
		return fastDev.Dom.getOffset(elem, doc, doc.documentElement);
	},
	/**
	 * 获取/设置Dom元素宽度（内容）
	 * @param {Element} elem Dom元素
	 * @param {String} [value] 宽度值
	 * @return {Number|undefined}
	 * 此方法做设置用时返回undefined,做获取用时返回宽度值
	 */
	width : function(elem, value) {
		if(!fastDev.isValid(elem)) {
			return;
		}
		return fastDev.Dom.getOrset_WidthOrHeight(elem, value, "Width");
	},
	/**
	 * 设置Dom元素宽度
	 * @param {Element} elem Dom元素
	 * @param {String} value 宽度值
	 */
	setWidth : function(elem, value) {
		fastDev.Dom.css(elem, "width", value);
	},
	/**
	 * 获取Dom元素宽度(内容+padding)
	 * @param {Element} elem Dom元素
	 * @return {Number}
	 */
	innerWidth : function(elem) {
		return fastDev.Dom.getOrset_WidthOrHeight(elem, undefined, "Width", "padding");
	},
	/**
	 * 获取Dom元素宽度（内容+padding+border）
	 * @param {Element} elem Dom元素
	 * @param {Boolean} margin (Optional) 是否包含margin值
	 * @return {Number}
	 */
	outerWidth : function(elem, margin) {
		return fastDev.Dom.getOrset_WidthOrHeight(elem, undefined, "Width", margin ? "margin" : "border");
	},
	/**
	 * 获取/设置Dom元素高度(内容)
	 * @param {Element} elem Dom元素
	 * @param {String} [value] 高度值
	 * @return {Number|undefined}
	 * 此方法做设置用时返回undefined,做获取用时返回高度值
	 */
	height : function(elem, value) {
		return fastDev.Dom.getOrset_WidthOrHeight(elem, value, "Height");
	},
	/**
	 * 设置Dom元素高度
	 * @param {Element} elem Dom元素
	 * @param {String} value 高度度值
	 */
	setHeight : function(elem, value) {
		fastDev.Dom.css(elem, "height", value);
	},
	/**
	 * 获取高度(内容+padding)
	 * @param {Element} elem Dom元素
	 * @return {Number}
	 */
	innerHeight : function(elem) {
		return fastDev.Dom.getOrset_WidthOrHeight(elem, undefined, "Height", "padding");
	},
	/**
	 * 获取高度(内容+padding+border)
	 * @param {Element} elem Dom元素
	 * @param {Boolean} margin (Optional) 是否包含margin值
	 * @return {Number}
	 */
	outerHeight : function(elem, margin) {
		return fastDev.Dom.getOrset_WidthOrHeight(elem, undefined, "Height", margin ? "margin" : "border");
	},
	/**
	 * 获取/设置水平滚动条X坐标值
	 * @param {Element} elem Dom元素
	 * @param {Number} [value] X坐标值
	 * 此方法做设置用时返回undefined,做获取用时返回X坐标值
	 */
	scrollLeft : function(elem, value) {
		return fastDev.Dom.getOrSetScrollTopOrLeftImpl(elem, value, "scrollLeft", "pageXOffset");
	},
	/**
	 * 获取/设置垂直滚动条Y坐标值
	 * @param {Element} elem Dom元素
	 * @param {Number} [value] Y坐标值
	 * 此方法做设置用时返回undefined,做获取用时返回Y坐标值
	 */
	scrollTop : function(elem, value) {
		return fastDev.Dom.getOrSetScrollTopOrLeftImpl(elem, value, "scrollTop", "pageYOffset");
	},
	/**
	 * 创建文档片段
	 * @return {DocumentFragment}
	 */
	createFragment : function() {
		return document.createDocumentFragment();
	},
	/**
	 * 根据HTML字符串创建Dom元素
	 * @param {String} htmlStr html字符串
	 * @return {DocumentFragment}
	 */
	createByHTML : function(htmlStr) {
		// if(htmlStr == true) {
			// return fastDev();
		// }
		var div = document.createElement("div");
		div.innerHTML = htmlStr;
		var fragment = fastDev.Dom.createFragment();
		while(div.childNodes.length) {
			fragment.appendChild(div.childNodes[0]);
		}
		div = null;
		return fragment;
	},
	/**
	 * 获取子元素数组
	 * @param {Element} elem Dom元素
	 * @param {Number} [nodeType] 指定节点类型子元素
	 * @return {Array[Element]}
	 */
	children : function(elem, nodeType) {
		var children = [];
		for(var i = 0, childNodes = elem.childNodes, len = childNodes.length; i < len; i += 1) {
			if(nodeType && childNodes[i].nodeType !== nodeType) {
				continue;
			}
			children.push(childNodes[i]);
		}
		return children;
	},
	/**
	 * 获取指定Dom元素下属所有子孙元素
	 * @param {Element} elem Dom元素
	 * @return {Array[Element]}
	 */
	elements : function(elem) {
		return elem.getElementsByTagName ? elem.getElementsByTagName("*") : [];
	},
	/**
	 * 删除指定Dom元素所有子元素对象
	 * @param {Element} elem Dom元素
	 */
	empty : function(elem) {
		if(elem.nodeType !== 1) {
			return;
		}
		while(elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
	},
	/**
	 * 获取当前对象父元素
	 * @param {Element} elem Dom元素
	 * @return {Element}
	 */
	parent : function(elem) {
		return elem.parentNode;
	},
	/**
	 * 获取当前对象所有祖先元素
	 * @param {Element} elem Dom元素
	 * @return {Array}
	 */
	parents : function(elem) {
		var elems = [];
		do {
			elem = fastDev.Dom.parent(elem);
			if(elem && elem.nodeType !== 9) {
				elems.push(elem);
			}
		} while(elem);
		return elems;
	},
	/**
	 * 获取当前对象的首个子节点
	 * @param {Element} elem Dom元素
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {Element}
	 */
	first : function(elem, nodeType) {
		elem = elem.firstChild;
		return fastDev.Dom.filterByNodeType(elem, nodeType, "next");
	},
	/**
	 * 获取当前对象的最后一个子节点
	 * @param {Element} elem Dom元素
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {Element}
	 */
	last : function(elem, nodeType) {
		elem = elem.lastChild;
		return fastDev.Dom.filterByNodeType(elem, nodeType, "prev");
	},
	/**
	 * 获取当前对象的下一个兄弟节点
	 * @param {Element} elem Dom元素
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {Element}
	 */
	next : function(elem, nodeType) {
		elem = elem.nextSibling;
		return fastDev.Dom.filterByNodeType(elem, nodeType, "next");
	},
	/**
	 * 获取当前对象的上一个兄弟节点
	 * @param {Element} elem Dom元素
	 * @param {Number} [nodeType=1] 节点类型
	 * @return {Element}
	 */
	prev : function(elem, nodeType) {
		elem = elem.previousSibling;
		return fastDev.Dom.filterByNodeType(elem, nodeType, "prev");
	},
	/**
	 * 设置当前对象文本
	 * @param {Element} elem Dom元素
	 * @param {String} text 文本
	 */
	setText : function(elem, text) {
		text = text === undefined ? "" : text;
		fastDev.Dom.getOrSetText(elem, text);
	},
	/**
	 * 获取当前对象文本
	 * @param {Element} elem Dom元素
	 * @return {String}
	 */
	getText : function(elem) {
		return fastDev.Dom.getOrSetText(elem);
	},
	/**
	 * 为当前对象增加文本
	 * @param {Element} elem Dom元素
	 * @param {String} text 文本值
	 */
	addText : function(elem, text) {
		var textnode, childList = fastDev.Dom.children(elem, 3), index = childList.length - 1;
		text = fastDev.isValid(text) ? text : "";
		if(index !== -1) {
			textnode = childList[index];
			textnode.nodeValue += text;
		} else {
			textnode = fastDev.Dom.createByHTML(text);
			fastDev.Dom.append(elem, textnode);
		}
	},
	/**
	 * 添加子元素至指定元素
	 * @param {Element} source 指定元素
	 * @param {Element} elem 子元素
	 */
	append : function(target, elem) {
		if(target.appendChild) {
			target.appendChild(elem);
		}
	},
	/**
	 * 删除指定元素上的指定子元素
	 * @param {Element} elem 子元素
	 */
	remove : function(elem) {
		var parent = fastDev.Dom.parent(elem);
		if(parent && parent.nodeType){
			parent.removeChild(elem);
		}
	},
	/**
	 * 将指定元素添加至目标元素之后
	 * @param {Element} elem 指定元素
	 * @param {Element} target 目标元素
	 */
	insertAfter : function(elem, target) {
		var parent = fastDev.Dom.parent(target);
		if(fastDev.Dom.last(parent) === target) {
			fastDev.Dom.append(parent, elem);
		} else {
			target = fastDev.Dom.next(target);
			fastDev.Dom.insertBefore(elem, target);

		}
	},
	/**
	 * 将指定元素添加至目标元素之前
	 * @param {Element} elem 指定元素
	 * @param {Element} target 目标元素
	 */
	insertBefore : function(elem, target) {
		var parent = fastDev.Dom.parent(target);
		parent.insertBefore(elem, target);
	},
	/**
	 * 将目标元素替换指定元素
	 * @param {Element} target 目标元素
	 * @param {Element} elem 指定元素
	 */
	replace : function(target, elem) {
		var parent = fastDev.Dom.parent(elem);
		parent.replaceChild(target, elem);
	},
	/**
	 * 激活Dom上指定类型的事件
	 * @param {Element} elem Dom元素
	 * @param {String} type 事件类型
	 */
	fire : function(elem, type) {
		if(elem[type]) {
			elem[type]();
		}
	}
};
(function() {
	fastDev.Dom.rrelNum = new RegExp("^([-+])=(" + fastDev.Dom.core_pnum + ")", "i");
	fastDev.Dom.rnumnonpx = new RegExp("^(" + fastDev.Dom.core_pnum + ")(?!px)[a-z%]+$", "i");

	if(!fastDev.Support.opacity) {
		fastDev.Dom.cssHooks.opacity = {
			get : function(elem, computed) {
				return fastDev.Dom.ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (0.01 * parseFloat(RegExp.$1) ) + "" : computed ? "1" : "";
			},

			set : function(elem, value) {
				var style = elem.style, currentStyle = elem.currentStyle, opacity = fastDev.isNumber(value) ? "alpha(opacity=" + value * 100 + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";

				style.zoom = 1;

				if(value >= 1 && fastDev.Util.StringUtil.trim(filter.replace(fastDev.Dom.ralpha, "")) === "" && style.removeAttribute) {

					style.removeAttribute("filter");

					if(currentStyle && !currentStyle.filter) {
						return;
					}
				}

				style.filter = fastDev.Dom.ralpha.test(filter) ? filter.replace(fastDev.Dom.ralpha, opacity) : filter + " " + opacity;
			}
		};
	}

	if(window.getComputedStyle) {
		fastDev.Dom.curCSS = function(elem, name) {
			var ret, width, minWidth, maxWidth, computed = window.getComputedStyle(elem, null), style = elem.style;

			if(computed) {

				ret = computed.getPropertyValue(name) || computed[name];

				if(ret === "" && !fastDev.Dom.contains(elem.ownerDocument, elem)) {
					ret = fastDev.Dom.styleImpl(elem, name);
				}

				if(this.rnumnonpx.test(ret) && this.rmargin.test(name)) {
					width = style.width;
					minWidth = style.minWidth;
					maxWidth = style.maxWidth;

					style.minWidth = style.maxWidth = style.width = ret;
					ret = computed.width;

					style.width = width;
					style.minWidth = minWidth;
					style.maxWidth = maxWidth;
				}
			}

			return ret;
		};
	} else if(document.documentElement.currentStyle) {
		fastDev.Dom.curCSS = function(elem, name) {
			var left, rsLeft, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;

			if(!fastDev.isValid(ret) && style && style[name]) {
				ret = style[name];
			}

			if(this.rnumnonpx.test(ret) && !this.rposition.test(name)) {

				left = style.left;
				rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

				if(rsLeft) {
					elem.runtimeStyle.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : ret;
				ret = style.pixelLeft + "px";

				style.left = left;
				if(rsLeft) {
					elem.runtimeStyle.left = rsLeft;
				}
			}

			return ret === "" ? "auto" : ret;
		};
	}
})();


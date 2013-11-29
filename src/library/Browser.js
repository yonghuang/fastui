/**
 * 当前浏览器类型以及版本检测
 * @class fastDev.Browser
 * @author 袁刚
 * @singleton
 */

fastDev.Browser = {
	/**
	 *
	 * @property info 当前浏览器信息
	 * @property info.type 当前浏览器类型
	 * @property info.version 当前浏览器版本
	 */
	info : (function(ua) {
		var type = "", version = "0";
		fastDev.each("msie chrome firefox opera safari".split(" "), function(i, item) {
			type = RegExp(item).test(ua) ? item : "";
			if(type) {
				version = RegExp(type + "[\/ ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";
				return false;
			}
		});
		return {
			type : type,
			version : version
		};
	})(window.navigator.userAgent.toLowerCase()),
	/**
	 * 获取地址栏请求参数
	 * @return {JsonObject}
	 */
	getRequest : function() {
		var parameters, url = window.location, request = {};
		parameters = decodeURI(url.search).slice(1);
		if(parameters.length) {
			parameters = parameters.split("&");
			for(var i = 0; i < parameters.length; i += 1) {
				var parameter = parameters[i].split("=");
				var key = parameter[0];
				var value = parameter[1];
				request[key] = value;
			}
		}
		return request;
	}
};
(function() {
	var type = fastDev.Browser.info.type, version = fastDev.Browser.info.version;
	fastDev.apply(fastDev.Browser, {
		/**
		 * 当前浏览器是否为IE
		 * @type {Boolean}
		 */
		isIE : type === "msie",
		/**
		 * 当前浏览器是否为ie6
		 * @type {Boolean}
		 */
		isIE6 : type === "msie" && version === "6.0",
		/**
		 * 当前浏览器是否为ie7
		 * @type {Boolean}
		 */
		isIE7 : type === "msie" && version === "7.0",
		/**
		 * 当前浏览器是否为ie8
		 * @type {Boolean}
		 */
		isIE8 : type === "msie" && version === "8.0",
		/**
		 * 当前浏览器是否为ie9
		 * @type {Boolean}
		 */
		isIE9 : type === "msie" && version === "9.0",
		/**
		 * 当前浏览器是否为ie10
		 * @type {Boolean}
		 */
		isIE10 : type === "msie" && version === "10.0",
		/**
		 * 当前浏览器是否为谷歌
		 * @type {Boolean}
		 */
		isChrome : type === "chrome",
		/**
		 * 当前浏览器是否为火狐
		 * @type {Boolean}
		 */
		isFirefox : type === "firefox"
	});
})();

/**
 * 浏览器信息检测类，用于捕获各种类别、各个版本浏览器之间的解析差异
 * @class fastDev.Support
 * @author 袁刚
 * @singleton
 */
fastDev.Support = (function() {
	var support, all, a, select, opt, input, fragment, tds, eventName, i, isSupported,
	//
	div = document.createElement("div");
	//
	//documentElement = document.documentElement;

	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName( "a" )[0];

	if(!all || !all.length || !a) {
		return {};
	}

	select = document.createElement("select");
	opt = select.appendChild(document.createElement("option"));
	input = div.getElementsByTagName( "input" )[0];

	support = {
		/**
		 * 使用innerHTML创建Dom元素时是否为前面的空白字符创建文本节点
		 * @type {Boolean}
		 */
		leadingWhitespace : (div.firstChild.nodeType === 3 ),

		/**
		 * 浏览器是否会为table元素补上子元素tbody
		 * @type {Boolean}
		 */
		tbody : !div.getElementsByTagName("tbody").length,

		/**
		 * 浏览器通过innerHTML插入链接元素时能否创建成功,IE6/7/8中返回false
		 * @type {Boolean}
		 */
		htmlSerialize : !!div.getElementsByTagName("link").length,

		/**
		 * 是否元素的内联样式都可以通过getAttribute访问style
		 * @type {Boolean}
		 */
		style : /top/.test(a.getAttribute("style")),

		/**
		 * 使用getAttribute获取href时是否值不变
		 * @type {Boolean}
		 */
		hrefNormalized : (a.getAttribute("href") === "/a" ),
		/**
		 * 浏览器是否能正确的解释透明度的样式属性
		 * @type {Boolean}
		 */
		opacity : /^0.55/.test(a.style.opacity),

		/**
		 * 浏览器是否支持style.cssFloat
		 * @type {Boolean}
		 */
		cssFloat : !!a.style.cssFloat,

		/**
		 * 复选框没有指定值时，默认值是否为"on"
		 * @type {Boolean}
		 */
		checkOn : (input.value === "on" ),

		/**
		 * @private
		 * 浏览器是否会为Select元素设置一个默认选中项
		 * @type {Boolean}
		 */
		optSelected : opt.selected,
		/**
		 * setAttribute方法是否无法正确设置className属性时,ie6/7返回false
		 * @type {Boolean}
		 */
		getSetAttribute : div.className !== "t",
		/**
		 * 表单是否支持 enctype属性
		 * @type {Boolean}
		 */
		enctype : !!document.createElement("form").enctype,

		/**
		 * 克隆一个html5元素是否会引起问题
		 * @type {Boolean}
		 * @private
		 */
		html5Clone : document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",
		/**
		 * submit事件是否在冒泡阶段触发
		 * @type {Boolean}
		 */
		submitBubbles : true,
		/**
		 * change事件是否在冒泡阶段触发
		 * @type {Boolean}
		 */
		changeBubbles : true,
		/**
		 * 是否能用delete方法清除Dom元素上的属性值
		 * @type {Boolean}
		 */
		deleteExpando : true,
		/**
		 * 克隆Dom元素时是否会连同绑定在元素上的事件一起克隆
		 * @type {Boolean}
		 */
		noCloneEvent : true,
		/**
		 * 更改Dom元素样式属性display:block为display:inline时,offsetWidth是否不会被影响,ie6/7中返回true
		 * @type {Boolean}
		 */
		inlineBlockNeedsLayout : false,
		/**
		 * 当当前元素宽度被指定值且当前元素内部宽度超出当前元素时，当前元素宽度是否会变化,ie6中返回true
		 * @type {Boolean}
		 */
		shrinkWrapBlocks : false,
		/**
		 * 浏览器是否能正确返回marginRight样式属性值
		 * @type {Boolean}
		 */
		reliableMarginRight : true,
		/**
		 * 使用百分比指定各margin属性值时,是否会被解析成具体像素数值
		 * @type {Boolean}
		 */
		pixelMargin : true
	};

	/**
	 * 页面渲染是否符合 W3C Box Model
	 * @type {Boolean}
	 */
	fastDev.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	input.checked = true;
	/**
	 * 克隆checkbox元素时是否会连同选中状态一起被复制
	 * @type {Boolean}
	 */
	support.noCloneChecked = input.cloneNode(true).checked;

	/**
	 * @private
	 * 下拉框被禁用时，子选项的禁用状态不会被改变
	 * @type {Boolean}
	 */
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if(!div.addEventListener && div.attachEvent && div.fireEvent) {
		div.attachEvent("onclick", function() {
			support.noCloneEvent = false;
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	/**
	 * Input类型被javascript修改为 radio后,value值是否不变
	 * @type {Boolean}
	 */
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	input.setAttribute("name", "t");

	div.appendChild(input);
	fragment = document.createDocumentFragment();
	fragment.appendChild(div.lastChild);
	/**
	 * 文档片段对象中checkbox的选中状态能否被克隆
	 * @type {Boolean}
	 */
	support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;
	/**
	 * 被添加到Dom树中的checkbox是否仍然保留原来的选中状态
	 * @type {Boolean}
	 */
	support.appendChecked = input.checked;

	fragment.removeChild(input);
	fragment.appendChild(div);

	if(div.attachEvent) {
		for(i in {
			submit : 1,
			change : 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if(!isSupported) {
				div.setAttribute(eventName, "return;");
				isSupported = ( typeof div[eventName] === "function" );
			}
			support[i + "Bubbles"] = isSupported;
		}
	}

	fragment.removeChild(div);

	// 清空测试元素避免IE中内存泄漏
	fragment = select = opt = div = input = null;

	// Dom树加载完成时运行测试
	fastDev.ready(function() {
		var container, outer, inner, td, offsetSupport, marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight, paddingMarginBorderVisibility, paddingMarginBorder, body = document.getElementsByTagName("body")[0];

		if(!body) {
			// 如果页面为frameset布局则取消测试
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" + "<table " + style + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore(container, body.firstChild);

		div = document.createElement("div");
		container.appendChild(div);

		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		isSupported = (tds[0].offsetHeight === 0 );

		tds[0].style.display = "";
		tds[1].style.display = "none";

		/**
		 * 检查隐藏状态下offsetWidth和offsetHeight是否被正确设置
		 * @type {Boolean}
		 */
		support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0 );

		if(window.getComputedStyle) {
			div.innerHTML = "";
			marginDiv = document.createElement("div");
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild(marginDiv);
			support.reliableMarginRight = (parseInt((window.getComputedStyle(marginDiv, null) || {
				marginRight : 0
			} ).marginRight, 10) || 0 ) === 0;
		}

		if( typeof div.style.zoom !== "undefined") {
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = (div.offsetWidth === 3 );

			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = (div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder : (inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells : (td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		offsetSupport.fixedPosition = (inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = (inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== conMarginTop );

		if(window.getComputedStyle) {
			div.style.marginTop = "1%";
			support.pixelMargin = (window.getComputedStyle(div, null) || {
				marginTop : 0
			} ).marginTop !== "1%";
		}

		if( typeof container.style.zoom !== "undefined") {
			container.style.zoom = 1;
		}

		body.removeChild(container);
		marginDiv = div = container = null;

		fastDev.apply(support, offsetSupport);
	});
	return support;
})();

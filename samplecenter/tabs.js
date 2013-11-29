var tabs;
function setActiveTabByTitle(id) {
	this.find("li.ui-tab-selected").removeClass("ui-tab-selected");
	this.find("div.ui-tab-panel").css("display", "none");
	var currnode = this.find("li[name='" + id + "']");
	if (currnode) {
		currnode.addClass("ui-tab-selected");
		this.find("div.ui-tab-panel[id='" + id + "']").css("display", "block");
		// this.setSrcByTxt(title);
		setSrcByTxt.apply(this, [ id ]);

	}
}

function addTab(item) {
	var me = this, options = this._options;
	var tempds = this.dataset.select(function(i, data) {
		return data.id === item.id;
	});
	if (tempds.length > 0) {
		throw "“" + item.title + "”已经存在，不能重复添加。";
	}
	if (this._global.ie6Iframe
			|| (fastDev.Browser.isIE6 && options.ie6Mode === "iframe")) {
		if (item.type !== "ajax" && item.type !== "div") {
			item.type = "iframe";
			this.dataset.remove(function(i, data) {
				return data.type === "iframe";
			});
			this.dataset.insert(item);
			var datalen = this.dataset.select().length;
			if (datalen === 1) {
				this.createIframe();
			}
			return;
		}
	}
	var currentTitle = item.title;
	options.currentTitle = currentTitle;
	this.dataset.insert(item);
	// 这个是重新构建整个tabs,缺陷是首先打开的tab缓存没了，每次只打开了当前页面的iframe
	// this.constructItems();
	// 这个才是添加
	var dataSet = this.dataset.select(function(i, data) {
		return data.id === item.id;
	});
	var titleul = this.find("ul.ui-tab");
	this._renderDynamicHtml(titleul, "addDynamicTemplateTitle", dataSet, false,
			window, false);
	var contentdiv = this.find("div.ui-tab-content");
	this._renderDynamicHtml(contentdiv, "addDynamicTemplateContent", dataSet,
			false, window, false);

	setConstruct.apply(this);

	//var liobj = this.find("li");
	setActiveTabByTitle.apply(this, [ item.id ]);
	this._options.onAdd.call(me, currentTitle);
}

function setConstruct() {
	var options = this._options;
	this.setSelected(options);
	this.createTools(options);
	this.setHeightWidth(options);
	this.setType();
	bindEvent.apply(this);
}
function bindEvent() {
	var me = this, liobj = this.find("li"), uldiv = fastDev(me.elems[0]), options = this._options;

	var closeMouseOver = function(event) {
		var evobj = fastDev(event.target);
		if (evobj.hasClass("ui-tab-close")) {
			evobj.addClass("ui-tab-close-over");
		}
	};
	var closeMouseOut = function(event) {
		var evobj = fastDev(event.target);
		if (evobj.hasClass("ui-tab-close")) {
			evobj.removeClass("ui-tab-close-over");
		}
	};
	this.find("[class^='ui-tab-close']").bind("mouseover", closeMouseOver)
			.bind("mouseout", closeMouseOut);
	this.dargliEvent(options, liobj);
	this.scrollerliEvent(options, liobj);

	var liClick = function(event) {
		var evobj = fastDev(event.target), li = evobj.parents("li:first")
				|| evobj, id = li.attr("name");
		if (evobj.hasClass("ui-tab-close")) {
			removeTab.apply(me, [ id ]);
		} else {
			me.find("li.ui-tab-selected").removeClass("ui-tab-selected");
			li.addClass("ui-tab-selected");
			me.find("div.ui-tab-panel:visible").css("display", "none");
			me.find("div.ui-tab-panel[id='" + id + "']")
					.css("display", "block");
			setSrcByTxt.apply(me, [ id ]);
			options.onTabClick.call(this, event, li.attr("txt"));
		}
	};
	var liDblclick = function(event) {
		var evobj = fastDev(event.target), li = evobj.parents("li:first")
				|| evobj, id = li.attr("name");
		removeTab.apply(this, [ id ]);
	};
	// liobj.unbind("click");
	liobj.bind("mousedown", liClick);
	if (options.allowDblClickToClose) {
		liobj.bind("dblclick", liDblclick);
	}
}

function setSrcByTxt(id) {
	var panel = this.find("li[type='iframe'][name='" + id + "']"), iframe, iframesrc = panel
			.attr("url");
	if (panel.elems.length === 1) {
		if (fastDev.Browser.isIE6) {
			iframe = this.find("iframe:first");
			this.setIframeSrc(iframe, iframesrc);
		} else if (fastDev.Browser.isIE7) {
			var iframeNum = this.find("iframe").elems.length;
			if (iframeNum > 3) {
				iframe = this.find("iframe:first");
				this.setIframeSrc(iframe, iframesrc);
			} else {
				iframe = this.find(
						"div.ui-tab-panel[type='iframe'][id='" + id + "']")
						.children("iframe");
				this.setIframeSrc(iframe, iframesrc);
			}
		} else {
			iframe = this.find(
					"div.ui-tab-panel[type='iframe'][id='" + id + "']")
					.children("iframe");
			this.setIframeSrc(iframe, iframesrc);
		}
	}
}
function removeTab(id) {
	var options = this._options;
	if (fastDev.Browser.isIE6 && options.ie6Mode === "iframe") {
alert("11111");
		if (options.onBeforeClose.call(this, id) !== false) {
alert("1222");
			this.dataset.remove(function(i, data) {
				return data.id === id;
			});
			try {
				document.getElementById("iframe" + options.id).src = "about:blank";
			} catch (e) {
			}
			try {
				document.getElementById("iframe" + options.id).location.href = "about:blank";
			} catch (e) {
			}
			options.onClose.call(this, id);
			return;
		}
	}
	if (this.find("li[name='" + id + "']>a>.ui-tab-close").elems.length === 0) {
		return false;
	}
	if (options.onBeforeClose.call(this, id) !== false) {
		var prevTitle = this.find("li[name='" + id + "']").prev("li").attr(
				"name");
		if (prevTitle === "") {
			prevTitle = this.find("li[name='" + id + "']").next("li").attr(
					"name");
		}
		this.find("li[name='" + id + "']").remove();
		// this.dataset.remove("title=" + title);
		this.dataset.remove(function(i, data) {
			return data.id === id;
		});

		this.find("div.ui-tab-panel[id='" + id + "']>iframe").attr("src", "");
		this.find("div.ui-tab-panel[id='" + id + "']").remove();
		!!prevTitle && setActiveTabByTitle.apply(this, [ prevTitle ]);
		var liobj = this.find("li");
		liobj.removeAttr("style");
		this.dargliEvent(options, liobj);
		options.onClose.call(this, id);
	}
}
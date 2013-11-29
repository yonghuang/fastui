fastDev.namespace("talkweb.Components");
fastDev.define("fastDev.Patch.BreadCrumb", {
	extend : "fastDev.Ui.BreadCrumb",
	alias : "Patch.BreadCrumb",
	parseAttr : function(config) {
		return fastDev.create("Patch.BreadCrumb", config);
	},
	ready : function(options, global) {
		var that = this;
		options.onAfterInitRender = function() {
			if (!!options.symbolsimg) {
				that.find("span").each(function(elem) {
					fastDev(document.createElement("img")).replace(fastDev(elem)).prop("src", options.symbolsimg);
				});
			} else if (!!options.symbols) {
				that.find("span").removeClass("ui-bread-symbols").setText(options.symbols);
			}
		};
	}
});
talkweb.Components.BreadCrumb = function(config) {
	return fastDev.Patch.BreadCrumb.parseAttr(config);
};

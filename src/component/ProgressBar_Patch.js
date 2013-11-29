fastDev.namespace("talkweb.Components");
fastDev.define("fastDev.Patch.Loading", {
	extend : "fastDev.Ui.ProgressBar",
	alias : "Patch.ProgressBar",
	mapping : {
		"imgtext" : "text",
		"itemvalue" : "totalValue",
	},
	parseAttr : function(config) {
		return fastDev.create("Patch.ProgressBar", fastDev.parseMapping(config, this.mapping));
	},
	setValue : function(curr, total) {
		var global = this._global, that = global.that || this;
		that.setTotalValue(total || that._options.totalValue);
		that.superClass.setValue.call(that, curr);
	},
	show : function(dom) {
		if (!!dom) {
			var global = this._global;
			this._options.container = !!dom.alias ? dom.elems[0] : dom;
			if (!!global.that) {
				global.that.close();
			}
			this.hide();
			return (global.that = fastDev.create("ProgressBar", this._options));
		} else {
			return this.superClass.show.call(this);
		}
	},
	closeBox : function() {
		if (!!this._global.that) {
			this._global.that.close();
		}
		this.superClass.close.call(this);
	}
});
talkweb.Components.Loading = function(config) {
	return fastDev.Patch.Loading.parseAttr(config);
};

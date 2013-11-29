fastDev.namespace("talkweb.Components");
fastDev.define("fastDev.Patch.Datepicker", {
	extend : "fastDev.Ui.DatePicker",
	alias : "Patch.DatePicker",
	mapping : {
		"TimeafterID" : "timeBefore",
		"FormertimeID" : "timeAfter"
	},
	parseAttr : function(config) {
		if (config.isPanle) {
			config.display = "inline";
		}
		if (config.switchClock === "on") {
			config.showTimePicker = true;
		}
		if (!config.width) {
			config.width = "177px";
		}
		if (!config.trigger) {
			config.trigger = "click";
		}
		if ( typeof config.callback === "function") {
			var onSelect = config.callback;
			config.onSelect = function(date, value) {
				onSelect.call(this, value, date);
			};
		}
		if (/\d{4}\-\d{1,2}-\d{1,2}\s+\d+.*/.test(fastDev.Util.StringUtil.trim(config.value))) {
			config.format = "yyyy-MM-dd HH:mm:ss";
		} else {
			config.format = fastDev.Util.StringUtil.trim(config.displayFormat || "yyyy-mm-dd").toLowerCase() === "yyyy-mm-dd" ? "yyyy-MM-dd" : "yyyy-MM-dd HH:mm:ss";
		}
		return fastDev.create("Patch.DatePicker", fastDev.parseMapping(config, this.mapping));
	}
});
talkweb.Components.Datepicker = function(config) {
	return fastDev.Patch.Datepicker.parseAttr(config);
};

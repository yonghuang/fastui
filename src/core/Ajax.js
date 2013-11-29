fastDev.define("fastDev.Core.Ajax", {
	ajax : function(url, option) {
		if(/post/i.test(option.type)) {
			this.post(url, option);
		} else {
			this.get(url, option);
		}
	},
	get : function(url, option) {
		fastDev.create("Proxy", {
			url : url,
			onAfterLoad : option.complete,
			timeout : option.timeout,
			queue : option.queue,
			onError : option.error
		}).load(option.data, option.success, option.encode || true, option.json || false);
	},
	post : function(url, option) {
		fastDev.create("Proxy", {
			action : url,
			onAfterSave : option.complete,
			timeout : option.timeout,
			queue : option.queue,
			onError : option.error
		}).save(option.data, option.success, option.encode || true, option.json || false);
	}
});

fastDev.apply({
	"get" : fastDev.Core.Ajax.get,
	"post" : fastDev.Core.Ajax.post,
	"ajax" : fastDev.Core.Ajax.ajax
});

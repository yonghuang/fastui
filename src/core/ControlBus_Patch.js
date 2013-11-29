fastDev.apply(fastDev.Core.ControlBus._options, {
	idSequence : 0
});

fastDev.apply(fastDev.Core.ControlBus, {
	_instanceMap : {},
	getInstance : function(key) {
		return this._instanceMap[key];
	},
	setInstance : function(key, obj) {
		this._instanceMap[key] = obj;
	},
	deleteInstance : function(key) {
		this._instanceMap[key] = null;
		delete this._instanceMap[key];
	},
	getIDSequence : function() {
		return this._options.idSequence += 1;
	},
	getID : function() {
		return "tw_control_id_" + this.getIDSequence();
	},
	destory : function(id) {
		var obj = this.getInstance(id);
		typeof obj === "object" && this.deleteInstance(id);
		//obj && obj[0] && $(obj[0]).remove();
		obj && obj[0] && obj[0].parentNode.removeChild(obj[0]);
	},
	buildInitQueue : function(items) {
		for(var i = 0; i < items.length; i += 1) {
			for(var j = 0; j < items.length - i - 1; j += 1) {
				if(items[j].order > items[j + 1].order) {
					var temp = items[j];
					items[j] = items[j + 1];
					items[j + 1] = temp;
				}
			}
		}
		talkweb.ControlBus.constructControl(items);
	},
	constructControl : function(items) {
		var dataKey, requestInfo = talkweb.DataBus.buildRequestInfo(items);
		for(var i = 0; i < items.length; i += 1) {
			var param, info, requireRequest, config = items[i], path = "talkweb." + config.classPath;
			if(/BaseControl/.test(path)) {
				path = path + ".Class";
			}
			var control = fastDev.create(path, config.options);
			config.control = control;
			var initSource ="", dataSource = "";
			control.getInitURLByEncode && ( initSource = control.getInitURLByEncode());
			control.getDataURLByEncode && ( dataSource = control.getDataURLByEncode());
			requireRequest = requestInfo[config.initGroup] ? true : false;
			if(requireRequest && initSource) {
				info = requestInfo[config.initGroup];
				info instanceof Array && ( param = "&method=" + info);
				var init = talkweb.Tools.queueFn.getInstance({
					fnType : "ajax",
					url : initSource,
					parameters : "cacheID=" + config.initGroup + (param || "")
				});
				talkweb.DataBus.execute(init);
			}
			requireRequest = requestInfo[config.dataGroup] ? true : false;
			if(requireRequest && dataSource) {
				info = requestInfo[config.dataGroup];
				info instanceof Array && ( param = "&method=" + info);
				var load = talkweb.Tools.queueFn.getInstance({
					fnType : "ajax",
					url : dataSource,
					parameters : "cacheID=" + config.dataGroup + (param || "")
				});
				talkweb.DataBus.execute(load);
			}
		}
		var nomal = talkweb.Tools.queueFn.getInstance({
		 fnBody : talkweb.ControlBus.controlInit,
		 parameters : items
		 });
		 talkweb.DataBus.execute(nomal);
	},
	controlInit : function(items) {
		for(var i = 0; i < items.length; i += 1) {
			var control = items[i].control;
			var cacheID = items[i].initGroup + (items[i].initMethod ? "." + items[i].initMethod : "");
			var initData, loadData, cacheid_init = cacheID, cacheid_load;
			if(items[i].merge === true) {
				var cache = talkweb.DataBus.getCache(cacheID);
				initData = cache.data;
				loadData = cache.value;
				control.setGlobal && control.setGlobal({
					cacheid_init : cacheid_init
				});
			} else {
				initData = talkweb.DataBus.getCache(cacheID);
				cacheID = items[i].dataGroup + (items[i].dataMethod ? "." + items[i].dataMethod : "");
				cacheid_load = cacheID;
				loadData = talkweb.DataBus.getCache(cacheID);
				control.setGlobal && control.setGlobal({
					cacheid_init : cacheid_init,
					cacheid_load : cacheid_load
				});
			}
			(control.getGlobal().excuteCI === true || Boolean(control.getOptions().items) === false) && (control.constructItems && control.constructItems(initData));
			loadData && control.setValue(loadData);
		}
		if(talkweb.ControlBus.getInstance("_pageload")) {
			talkweb.ControlBus.getInstance("_pageload").closeBox();
		}
	},
	getRequest : function() {
		var parameters, url = window.location, request = {};
		parameters = decodeURI(url.search).slice(1);
		parameters = parameters.split("&");
		for(var i = 0; i < parameters.length; i += 1) {
			var parameter = parameters[i].split("=");
			var key = parameter[0];
			var value = parameter[1];
			request[key] = value;
		}
		return request;
	},
	getBrowser : function() {
		var info = {};
		switch(true) {
			case jQuery.browser.msie:
				info["type"] = "msie";
				break;
			case jQuery.browser.safari:
				info["type"] = "safari";
				break;
			case jQuery.browser.mozilla:
				info["type"] = "mozilla";
				break;
			case jQuery.browser.opera:
				info["type"] = "opera";
				break;
		}
		info["version"] = jQuery.browser.version;
		return info;
	},
	ready : function(param) {
		if(!param || !param.items){
			return;
		};
		fastDev.ready(function() {
			var items = param.items;
			var callback = function(remoteItems) {
				items = items ? items.concat(remoteItems) : remoteItems;
				talkweb.ControlBus.buildInitQueue(items);
			};
			if(param.configSource) {
				var ajax = talkweb.Tools.queueFn.getInstance({
					fnType : "ajax",
					url : param.configSource,
					callback : callback
				});
				talkweb.DataBus.execute(ajax);
			} else {
				talkweb.ControlBus.buildInitQueue(items);
			}
		});
	}
	/*if(typeof talkweb.ControlBus.getInstance("_pageload") === "undefined" && !param.configSource){
	 talkweb.Components.Loading({
	 saveInstance : true,
	 id : "_pageload"
	 }).show();
	 }*/

});


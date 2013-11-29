fastDev.apply(fastDev.Core.DataBus._options, {
	checkFnType : null,
	checkFnBody : null,
	checkUrl : null
});

fastDev.apply(fastDev.Core.DataBus._global, {
	checkResult : true
});

fastDev.apply(fastDev.Core.DataBus, {
	_dataStore : {},
	getCache : function(key) {
		var returnObj = null;
		(this._dataStore[key] && typeof this._dataStore[key] === "object") ? returnObj = talkweb.Tools.clone(this._dataStore[key]) : returnObj = this._dataStore[key];
		return returnObj;
	},
	setCache : function(key, value) {
		this._dataStore[key] = value;
	},
	JsonEncodeURI : function(jsonObj) {
		var data = "", result, value;
		for(var p in jsonObj) {
			if(jsonObj[p]) {
				result = jsonObj[p];
				result = encodeURIComponent(result);
				value = p + "=" + result;
				data.length > 0 ? data += "&" + value : data += value;
			}
		}
		return data;
	},
	execute : function(queueFn) {
		//判断queueFn.parameters是否字符串，如果是字符串，则encodeURIComponent，如果是json对象，则解析成字符串在encodeURIComponent
		var that = this, callback = function() {
		};
		var fnCallback = queueFn.callback;
		if(queueFn.fnType === "ajax") {
			//debugger;
			if(queueFn.parameters) {
				if( typeof queueFn.parameters === "string") {
					queueFn.parameters = encodeURI(queueFn.parameters);
				} else if( typeof queueFn.parameters === "object") {
					queueFn.parameters = this.JsonEncodeURI(queueFn.parameters);
				}
			}

			callback = function(data) {
				//debugger;
				try {
					data = eval("(" + data + ")");

				} catch (e) {
					try {
						data = $.parseJSON(data);
					} catch (e) {
					}
				}
				if( data instanceof Array) {
					for(var i = 0; i < data.length; i += 1) {
						data[i].cacheID && that.setCache(data[i].cacheID, data[i].cacheData);
					}
				} else {
					data && data.cacheID && that.setCache(data.cacheID, data.cacheData)
				}
				//queueFn.cacheid && that.setCache(queueFn.cacheid, data);
				fnCallback(data);
			};
		}
		queueFn.callback = callback;
		talkweb.Tools.executeQueue.add(queueFn);
	},
	executeURI : function(queueFn) {
		//queueFn.parameters && typeof queueFn.parameters === "string"
		//	&& (queueFn.parameters = encodeURI(queueFn.parameters));
		var that = this, callback = function() {
		};
		var fnCallback = queueFn.callback;
		if(queueFn.fnType === "ajax") {
			callback = function(data) {
				try {
					data = eval("(" + data + ")");
				} catch (e) {
					try {
						data = $.parseJSON(data);
					} catch (e) {
					}
				}
				if( data instanceof Array) {
					for(var i = 0; i < data.length; i += 1) {
						data[i].cacheID && that.setCache(data[i].cacheID, data[i].cacheData);
					}
				} else {
					data && data.cacheID && that.setCache(data.cacheID, data.cacheData)
				}
				//queueFn.cacheid && that.setCache(queueFn.cacheid, data);
				fnCallback(data);
			};
		}
		queueFn.callback = callback;
		talkweb.Tools.executeQueue.add(queueFn);
	},
	/*
	 * Description:构造控件集请求信息方法
	 * Param:queueFn 控件集配置信息
	 * Return:请求信息对象
	 */
	buildRequestInfo : function(items) {
		var requestInfo = {};
		for(var i = 0; i < items.length; i += 1) {
			var item = items[i], key = item.initGroup;
			if(key) {
				(requestInfo[key] && requestInfo[key].push(item.initMethod || "")) || (requestInfo[key] = new Array(item.initMethod || ""));
			} else {
				key = talkweb.ControlBus.getID();
				requestInfo[key] = 1;
			}
			item.initGroup = key;
			key = item.dataGroup;
			if(key) {
				(requestInfo[key] && requestInfo[key].push(item.dataMethod || "")) || (requestInfo[key] = new Array(item.dataMethod || ""));
			} else {
				key = talkweb.ControlBus.getID();
				requestInfo[key] = 1;
			}
			item.dataGroup = key;
		}
		return requestInfo;
	},
	check : function() {
		var ajax = talkweb.Tools.queueFn.getInstance({
			fnType : "nomal",
			fnBody : function() {
			}
		});
		talkweb.DataBus.execute(ajax);
	}
});


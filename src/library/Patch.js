(function() {
	fastDev.namespace("talkweb.Tools");
	fastDev.namespace("talkweb.Components");
	fastDev.namespace("talkweb.Business");
	fastDev.namespace("talkweb.Bus");

	talkweb.Tools.extend = fastDev.extend;
	talkweb.Tools.extendProperty = fastDev.apply;
	talkweb.Tools.clone = fastDev.clone;
	talkweb.Tools.toJsonString = function(obj) {
		var str = "";
		for(var p in obj) {
			str += "," + p + ":" + obj[p];
		}
		return "{" + str.slice(1) + "}";
	};
	talkweb.Tools.queueFn = (function() {
		var fn = {
			fnBody : function(param) {
			},
			fnType : "nomal",
			url : null,
			type : "GET",
			parameters : "",
			callback : function(param) {
			}
		};
		return {
			getInstance : function(param) {
				return $.extend(talkweb.Tools.clone(fn), param);
			}
		}
	})();
	
	
	talkweb.Tools.executeQueue = (function() {
		var state = "stop";
		// 队列执行类型{nomal}
		var queue = new Array();
		var addElement = function(executeObj) {
			if(talkweb.DataBus.getGlobal().checkResult === true) {
				var element = new Array();
				element.push(executeObj);
				queue = element.concat(queue);
				execute();
			}
		};
		var cutInLine = function(executeObj) {
			talkweb.DataBus.getGlobal().checkResult === true && queue.push(executeObj);
		};
		var queueStart = function() {
			if(queue.length > 0) {
				var element = queue.pop();
				with(element) {
					if(fnType == "ajax" && url) {
						$.ajax({
							type : type,
							url : url,
							cache : false,
							data : parameters,
							success : function(msg) {

							},
							error : function(msg) {

							},
							complete : function(XMLHttpRequest, textStatus) {
								callback(XMLHttpRequest.responseText);
								queueStart();
							}
						});
					} else {
						callback(element["fnBody"](parameters));
						queueStart();
					}
				}
			} else {
				state = "stop";
			}
		};
		var execute = function(permit_no) {
			if(state == "stop" && queue.length > 0) {
				var queue_permit_no = talkweb.DataBus.getCache("queue_permit_no");
				var options = talkweb.DataBus.getOptions();
				if((permit_no && queue_permit_no && permit_no === queue_permit_no) || (!options.checkFnBody || !(/(^nomal$)|(^ajax$)/g.test(options.checkFnType)) || (/^ajax$/g.test(options.checkFnType) && !options.checkUrl))) {
					state = "start";
					queueStart();
				} else {
					var permitNo = talkweb.ControlBus.getID();
					var checkcallback = function(data) {
						if(options.checkFnBody(data) === false) {
							talkweb.Tools.executeQueue.clear(permitNo);
							talkweb.DataBus.setGlobal({
								checkResult : false
							});
							options.callback && options.callback();
						} else {
							talkweb.DataBus.setGlobal({
								checkResult : true
							});
						}
					};
					var checkfnOptions = {
						fnType : options.checkFnType,
						url : options.checkUrl
					};
					options.checkFnType === "ajax" ? checkfnOptions.callback = checkcallback : checkfnOptions.fnBody = checkcallback;
					var checkFn = talkweb.Tools.queueFn.getInstance(checkfnOptions);
					talkweb.DataBus.setCache("queue_permit_no", permitNo);
					talkweb.Tools.executeQueue.cutIn(checkFn);
					talkweb.Tools.executeQueue.execute(permitNo);
				}
			}
		};
		var clearQueue = function(permit_no) {
			var queue_permit_no = talkweb.DataBus.getCache("queue_permit_no");
			if(permit_no && queue_permit_no && permit_no === queue_permit_no) {
				queue = [];
			}
		};
		return {
			add : addElement,
			cutIn : cutInLine,
			execute : execute,
			clear : clearQueue
		}
	})();
	talkweb.Tools.analyticClassPath = function(classPath) {
		if(!classPath) {
			return false;
		}
		var clazz = talkweb;
		var paths = classPath.split(".");
		for(var i = 0; i < paths.length; i += 1) {
			clazz = clazz[paths[i]];
		}
		return clazz;
	}

	talkweb.ControlBus = fastDev.create("fastDev.Core.ControlBus");
	talkweb.DataBus = fastDev.create("fastDev.Core.DataBus");
	talkweb.Bus.ready = talkweb.ControlBus.ready;
	
	
	fastDev.Core.ClassManager.addAlias = function(alias,className){
		this._aliasMap[alias] = className;
	};
})();


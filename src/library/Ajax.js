/**
 * 基于浏览器的异步请求封装
 * @class fastDev.Ajax
 * @author  袁刚
 * @singleton
 */

/**
 * @event success
 * 请求成功后执行
 * @param {JsonObject} responses
 * @param {XML} [responses.xml] XML形式的响应数据
 * @param {String} [responses.text] 字符串形式的响应数据
 */

/**
 * @event failure
 * 请求失败后执行
 * @param {String} msg 错误信息
 */

/**
 * @event complete
 * 请求完成（无论是否执行成功 ）后执行
 * @param {Object|String} result 请求成功时为responses对象，失败时错误信息字符串
 */

fastDev.Ajax = {
	_settings : {
		method : "get",
		data : null,
		async : true,
		timeout : 0,
		success : fastDev.noop,
		failure : fastDev.noop,
		complete : fastDev.noop,
		headers : null,
		cache : false,
		username : "",
		password : ""
	},
	_getXHR : function() {
		if(window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	},
	/**
	 * 执行Ajax请求
	 * @param {Object} url 请求地址
	 * @param {object} settings 请求配置信息
	 * @param {String} [settings.method="get"] 请求类型
	 * @param {String} [settings.default] 请求附加数据
	 * @param {Boolean} [settings.async=true] 是否异步
	 * @param {Boolean} [settings.timeout=false] 是否开启请求超时
	 * @param {Function} [settings.success] 成功时回调
	 * @param {Function} [settings.failure] 失败时回调
	 * @param {Function} [settings.complete] 完成时回调
	 * @param {JsonObject} [settings.headers] 请求HTTP头部信息
	 * @param {Boolean} [settings.cache=false] 是否使用缓存数据
	 * @param {String} [settings.username] 服务调用用户名
	 * @param {String} [settings.password] 服务调用密码
	 */
	doAjax : function(url, settings) {
		var config = fastDev.clone(fastDev.Ajax._settings), xhr = fastDev.Ajax._getXHR(), timeout;
		config = fastDev.apply(config, settings);

		if(!config.cache) {
			url += (/\?/.test(url) ? "&" : "?") + "cache_id=" + (+new Date());
		}

		if(config.data && config.method === "get") {
			url += (/\?/.test(url) ? "&" : "?") + settings.data;
		}

		if(config.username) {
			xhr.open(config.method, url, config.async, config.username, config.password);
		} else {
			xhr.open(config.method, url, config.async);
		}

		if(config.async) {
			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					var status, responses, xml;
					clearTimeout(timeout);

					status = xhr.status;
					
					if(status === 200) {
						xml = xhr.responseXML;
						responses = {
							text : xhr.responseText
						};
						if(xml && xml.documentElement) {
							responses.xml = xml;
						}
					}else{
						responses = {
							status : "system",
							msg : "Ajax请求失败" + (status ? "" : ",请求"+url+"时发生错误"),
							detailMsg : status ? /<h1>(.*)<\/h1>/.exec(xhr.responseText)[1] : "请求超时无法获取返回结果",
							errorStatus : status
						};
					}
					config.complete(responses);
				}
			};
		}

		for(var key in config.headers) {
			xhr.setRequestHeader(key, config.headers[key]);
		}
		if(config.method === "post") {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8;');
		}

		if(fastDev.isNumber(config.timeout) && config.timeout !== 0) {
			timeout = setTimeout(function() {
				xhr.abort();
			}, config.timeout);
		}
		xhr.send(config.data);
	},
	/**
	 * 执行get类型请求
	 * @param {Object} url 请求地址
	 * @param {object} settings 请求配置信息
	 * @param {String} [settings.method="get"] 请求类型
	 * @param {String} [settings.default] 请求附加数据
	 * @param {Boolean} [settings.async=true] 是否异步
	 * @param {Number} [settings.outtime=30000] 请求超时时间
	 * @param {Function} [settings.success] 成功时回调
	 * @param {Function} [settings.failure] 失败时回调
	 * @param {Function} [settings.complete] 完成时回调
	 * @param {JsonObject} [settings.headers] 请求HTTP头部信息
	 * @param {Boolean} [settings.cache=false] 是否使用缓存数据
	 * @param {String} [settings.username] 服务调用用户名
	 * @param {String} [settings.password] 服务调用密码
	 */
	doGet : function(url, settings) {
		settings.method = "get";
		fastDev.Ajax.doAjax(url, settings);
	},
	/**
	 * 执行post类型请求
	 * @param {Object} url 请求地址
	 * @param {object} settings 请求配置信息
	 * @param {String} [settings.method="get"] 请求类型
	 * @param {String} [settings.default] 请求附加数据
	 * @param {Boolean} [settings.async=true] 是否异步
	 * @param {Number} [settings.outtime=30000] 请求超时时间
	 * @param {Function} [settings.success] 成功时回调
	 * @param {Function} [settings.failure] 失败时回调
	 * @param {Function} [settings.complete] 完成时回调
	 * @param {JsonObject} [settings.headers] 请求HTTP头部信息
	 * @param {Boolean} [settings.cache=false] 是否使用缓存数据
	 * @param {String} [settings.username] 服务调用用户名
	 * @param {String} [settings.password] 服务调用密码
	 */
	doPost : function(url, settings) {
		settings.method = "post";
		fastDev.Ajax.doAjax(url, settings);
	}
};

fastDev.apply({
	jsonp : function(url, callback) {
		var id = fastDev.getID();
		url = url + "callback=" + callback + "&cache_id=" + (+new Date());
		fastDev("<script>").prop("src", url).prop("id", id).appendTo(fastDev("head"));
		fastDev("#" + id).remove();
	}
});

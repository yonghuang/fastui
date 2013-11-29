/**
 * @class fastDev.Data.Proxy
 * @extends fastDev.Core.Base
 * @author 袁刚
 * 数据代理实现类，协助数据集与后台进行交互的辅助类
 */

fastDev.define("fastDev.Data.Proxy", {
	extend : "fastDev.Core.Base",
	alias : "Proxy",
	_options : {
		/**
		 * 远程数据地址
		 * @type {String}
		 */
		url : null,
		/**
		 * 远程请求类型
		 * @type {string}
		 */
		method : "get",
		/**
		 * 数据提交地址
		 * @type {String}
		 */
		action : null,
		/**
		 * load方法执行时附带参数(如果load方法传了参数则此设置不生效)
		 * @type {JsonObject}
		 */
		urlParam : null,
		/**
		 * 代理中的静态数据源
		 */
		data : null,
		/**
		 * 代理超时时间
		 */
		timeout : 0,
		/**
		 * 数据读取类型
		 * @type {String}
		 */
		dataType : "json",
		/**
		 * 代理所属队列
		 * @type {fastDev.Queue}
		 */
		queue : null,
		/**
		 * 加载数据错误时的事件
		 * @event  onError
		 */
		onError : fastDev.noop,
		/**
		 *  数据加载完成事件
		 * @event onAfterLoad
		 * @private
		 */
		onAfterLoad : fastDev.noop,
		onAfterSave : fastDev.noop
	},
	/**
	 * 代理对象参数准备方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	ready : function(options, global) {
		if(options.dataset) {
			global.handle = fastDev.setFnInScopeByParam(options.dataset, options.dataset.load, true, true);
		}
		
		if(fastDev.isString(options.url)){
			options.url = this.encodeCustomParamForUrl(options.url);
		}
		
		if(fastDev.isString(options.action)){
			options.action = this.encodeCustomParamForUrl(options.action);
		}
		
	},
	/**
	 * 代理对象构造方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	construct : function(options, global) {
		this.reader = fastDev.create("Reader", options.reader);

		if(!fastDev.isValid(options.queue)) {
			options.queue = fastDev.Queue.getInstance();
		}
	},
	/**
	 * 远程数据加载
	 * @param {JsonObject/String} data Json格式键值对数据或者字符串格式数据
	 * @param {Function} [callback] 后台处理完成后的回调函数
	 * @param {Boolean} [encode=false] 是否编码
	 * @param {Boolean} [json=false] 是否提交Json格式参数(此参数为true时系统追加data为数据键：url?data=jsondata)
	 */
	load : function(data, callback, encode, json) {
		var url, success, error, complete,
			options = this._options,
			global = this._global,
			// 代理所使用的队列
			queue = options.queue,
			// load方法请求类型
			method = options.method,
			// load方法超时时间
			timeout = options.timeout,
			// 统一数据处理
			dataProcessing = fastDev.Core.DataBus.processing,
			// 代理所驱动的数据集
			dataset = options.dataset,
			// 修正传入参数
			params = this.correctParam(data, callback, encode, json, options.urlParam);
			
			
		if(dataset && dataset.fill){
			success = global.handle;
			complete = fastDev.isFunction(params[1]) ? params[1] : fastDev.isFunction(options.onAfterLoad) ? options.onAfterLoad : undefined;
		}else{
			success = fastDev.isFunction(params[1]) ? params[1] : undefined;
			complete = fastDev.isFunction(options.onAfterLoad) ? options.onAfterLoad : undefined;
		}
		error = fastDev.isFunction(options.onError) ? options.onError : undefined;

		if( url = options.url) {
			callback = fastDev.setFnInScopeByParam(this, dataProcessing, success, error, complete);
			// 格式化提交参数
			data = this.formatData(params[0], params[2], params[3]);

			queue.add({
				url : url,
				data : data,
				method : method,
				complete : callback,
				timeout : timeout
			});
			return true;
		}
		return false;
	},
	/**
	 * 提交数据至远程服务
	 * @param {JsonObject/String} data Json格式键值对数据或者字符串格式数据
	 * @param {Function} [callback] 后台处理完成后的回调函数
	 * @param {Boolean} [encode=false] 是否编码
	 * @param {Boolean} [json=false] 是否提交Json格式参数(此参数为true时系统追加data为数据键：url?data=jsondata)
	 */
	save : function(data, callback, encode, json) {
		var options = this._options,
		// 代理所使用的队列
		queue = options.queue,
		// 代理数据提交地址
		url = options.action,
		// save方法超时时间
		timeout = options.timeout,
		// 数据总线数据处理中心
		dataProcessing = fastDev.Core.DataBus.processing,
		// 修正传入参数
		params = this.correctParam(data, callback, encode, json),
		success = fastDev.isFunction(params[1]) ? params[1] : undefined,
		error = fastDev.isFunction(options.onError) ? options.onError : undefined,
		complete = fastDev.isFunction(options.onAfterSave) ? options.onAfterSave : undefined;
		// 回调函数
		callback = fastDev.setFnInScopeByParam(this, dataProcessing, success, error, complete);
		
		// 格式化提交参数
		data = this.formatData(params[0], params[2], params[3]);

		queue.add({
			url : url,
			data : data,
			method : "post",
			complete : callback,
			timeout : timeout
		});
	},
	/**
	 * 设置远程数据加载(load方法)时的参数
	 * @param {JsonObject} param 数据参数
	 */
	setParam : function(param) {
		this._options.urlParam = param;
		return this;
	},
	/**
	 * 增加远程数据加载(load方法)时的参数
	 * @param {JsonObject} param 数据参数
	 */
	addParam : function(param) {
		this._options.urlParam = fastDev.apply(this._options.urlParam || {}, param);
		return this;
	},
	/**
	 * 设置代理的超时时间
	 * @param {Number} time 超时时间(ms)
	 */
	setTimeout : function(time) {
		this._options.timeout = time;
		return this;
	},
	/**
	 * 设置数据提交的远程服务地址
	 * @param {String} action 服务地址
	 */
	setAction : function(action) {
		this._options.action = action;
		return this;
	},
	setUrl : function(url){
		this._options.url = url;
		return this;
	},
	/**
	 * 处理提交数据
	 * @param {JsonObject} data 数据对象
	 * @param {Boolean} encode 是否编码
	 * @param {Bollean} json 是否转换成Json格式
	 */
	formatData : function(data, encode, json) {
		if(json === true) {
			return "data=" + fastDev.Util.JsonUtil.parseString(data, encode);
		} else {
			return fastDev.Util.UrlUtil.jsonToQuery(data, encode);
		}
	},
	/**
	 * 修正save/load方法传入参数
	 * @param {JsonObject} data 数据对象
	 * @param {Function} callback 回调函数
	 * @param {Boolean} encode 是否编码
	 * @param {Bollean} json 是否转换成Json格式
	 */
	correctParam : function(data, callback, encode, json, urlParam) {
		
		if(!fastDev.isBoolean(encode)) {
			encode = fastDev.isBoolean(data) ? encode : fastDev.isBoolean(data) ? data : fastDev.isBoolean(callback) ? callback : true;
		} else if(fastDev.isBoolean(callback)) {
			json = encode;
			encode = callback;
		}

		if(!fastDev.isBoolean(json)) {
			json = false;
		}

		if(!fastDev.isPlainObject(data) && !fastDev.isArray(data)) {
			callback = fastDev.isFunction(callback) ? callback : fastDev.isFunction(data) ? data : undefined;
			data = urlParam || {};
		} else {
			callback = fastDev.isFunction(callback) ? callback : undefined;
		}

		return [data, callback, encode, json];
	},
	bindAfterLoad : function(fn){
		this._options.onAfterLoad = fn;
	},
	/**
	 * 对地址字符串上的参数做编码 
	 * @param {Object} url
	 * @private
	 */
	encodeCustomParamForUrl : function(url){
		if(!url){
			return url;
		}
		
		var params;
		return url.replace(/\?([^\?]+)/,function(all, params){
			params = params.split("&");
			for(var i=0,param;param = params[i];i++){
				params[i] = param.replace(/=([^=]*)/,function(all, value){
					return  "=" + encodeURIComponent(value);
				});
			}
			return "?" + params.join("&");
		});
	}
});

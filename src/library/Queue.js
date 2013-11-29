/**
 * 队列实现类，使队列中的方法按照先入先出顺序执行，支持Ajax异步使用
 * @class fastDev.Queue
 * @author 袁刚
 * @singleton
 */

fastDev.Queue = {
	/**
	 * 队列状态
	 * @type {Boolean}
	 * @private
	 */
	_state : "stop",
	/**
	 * 队列元素配置
	 * @type {Object}
	 * @private
	 */
	_options : {
		/**
		 * 建普通执行函数配置信息时必填
		 * @type {Function} [handle=fastDev.noop]
		 */
		handle : fastDev.noop,
		/**
		 * 标明当前队列句柄类型 (ajax、normal)
		 * @type {string} [type=ajax]
		 */
		type : "ajax",
		/**
		 * 创建ajax执行函数配置信息息时必填
		 * @type {String}
		 */
		url : "",
		/**
		 *  当队列句柄类型为ajax时，指定请求类型 (get、post)
		 * @type {String} [method=get]
		 */
		method : "get",
		/**
		 * 当队列类型为ajax时，data做为请求的附加参数发送;队列句柄类型为nomal时，data做为success事件参数传入
		 * @type {string}
		 */
		data : null,
		/**
		 * 队列元素成功后执行
		 * @event
		 * @param {JsonObject} result
		 * <p>"ajax"返回response</p>
		 * <p>- xml: xml格式数据</p>
		 * <p>- text: 文本数据</p>
		 * <p>"normal"返回执行结果</p>
		 */
		success : fastDev.noop,
		/**
		 * 请求失败后执行
		 * @event
		 * @param {String} msg 错误信息
		 */
		failure : fastDev.noop,
		/**
		 * 请求完成时执行，不论成败
		 * @event
		 * @param {JsonObject/String} result
		 * <p>成功时参数与success事件参数一致</p>
		 * <p>失败时参数与failures事件参数一致</p>
		 */
		complete : fastDev.noop,
		timeout : 0
	},
	/**
	 * 创建队列元素
	 * @param {Object} settings 队列元素配置信息
	 * @return {Object}
	 * @private
	 */
	_createEl : function(settings) {
		var el = fastDev.clone(this._options);
		return fastDev.apply(el, settings);
	},
	/**
	 * 在队列最前增加一个队列元素
	 * @param {JsonObject} settings 队列元素配置信息
	 */
	addFirst : function(settings){
		this.add(settings, 0);
	},
	/**
	 * 在队列最后增加一个队列元素
	 * @param {JsonObject} settings 队列元素配置信息
	 */
	addLast : function(settings) {
		this.add(settings);
	},
	/**
	 * 在队列中增加一个元素(settings参数参见{@link #doAjax doAjax}详细信息)
	 * @param {Object} settings 队列元素配置信息
	 * @param {Number} index 元素插入位置
	 */
	add : function(settings, index) {
		var element = this._createEl(settings), queueList = this._queueList;
		if(index >= 0 && index < queueList.length) {
			queueList.splice(index, 0, element);
		} else {
			this._queueList.push(element);
		}
		
		if( element.type === "ajax"){
			fastDev.Core.DataBus.increaseReqCount();
		}
		this.exec();
	},
	/**
	 * 队列启动方法
	 * @private
	 */
	_queueStart : function() {
		if(this._queueList.length > 0) {
			var me = this, settings = me._queueList.shift();
			if(settings.type === "ajax") {
				var completeHandle = settings.complete;
				settings.complete = function(result) {
					try {
						completeHandle(result);
					} catch(e) {
						fastDev.error("Queue" ,"Ajax.complete", "为"+settings.url+"配置的执行完成时回调方法执行异常", e.message);
					} finally {
						fastDev.Core.DataBus.reduceReqCount();
						me._queueStart();
					}
				};
				fastDev.Ajax.doAjax(settings.url, settings);
			} else {
				try {
					settings.success(settings.handle(settings.data));
				} catch(e) {
					settings.failure(e);
				} finally {
					settings.complete();
					this._queueStart();
				}
			}
		} else {
			this._state = "stop";
		}
	},
	/**
	 * 队列开始执行
	 */
	exec : function() {
		if(this._state === "stop" && this._queueList.length > 0) {
			this._state = "start";
			this._queueStart();
		}
	},
	/**
	 * 获得一个新的队列实例
	 * @return {fastDev.Queue}
	 */
	getInstance : function() {
		var instance = fastDev.clone(this);
		instance._queueList = [];
		return instance;
	}
};

/**
 * 系统默认创建的队列对象
 * @property queue
 * @type {fastDev.Queue}
 * @member fastDev
 */
fastDev.apply({
	queue : fastDev.Queue.getInstance()
});


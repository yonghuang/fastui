/**
 * @class fastDev.Core.DataBus
 * @extends fastDev.Core.Base
 * @singleton
 * 数据总线，输入控制层的一部分，负责管理数据的统一加载、接受以及数据异常的处理
 */
fastDev.define("fastDev.Core.DataBus", {
	_global : {
		reqCount : 0
	},
	/**
	 * 数据处理
	 * @param {Object} result 返回结果
	 * @param {Function} success 成功回调
	 * @param {Function} complete 完成回调
	 * @private
	 */
	processing : function(data, success, error, complete) {
		var msg, status, detailMsg,
			reader = fastDev.Core.DataBus.dataReader,
			type = data.xml && data.xml.attributes ? "xml" : "json";
			
		if(data.text || data.xml){
			data = fastDev.Data.Reader.read(type === "xml" ? data.xml : data.text, type);
			if(reader && fastDev.isFunction(reader)) {
				data = reader(data) || data;
			}
		}
		
		// 获取数据部分的状态信息
		status = data.status;

		switch(status){
			case "system" :
				if(error && !(detailMsg = error(data))){
					break;
				}
			case "timeout" :
				status = fastDev.Util.StringUtil.capitalize(status);
				fastDev.Core.DataBus["do"+status](data.msg, detailMsg || data.detailMsg);
				break;
			default :
				success && success(data);
		}
			
		complete && complete(data);
	},
	/**
	 * 处理系统错误
	 */
	doSystem : function(msg, detailMsg) {
		fastDev.addError("Ajax", "doAjax", msg, detailMsg);
	},
	/**
	 * 处理Session过期
	 */
	doTimeout : function(msg) {
		fastDev.Core.ControlBus.fireTimeout(msg);
	},
	/**
	 * 设置数据读取器，数据总线处理数据时回调此方法，可用于统一处理数据
	 * @param {Function} reader 数据读取函数
	 */
	setDataReader : function(reader) {
		this.dataReader = fastDev.isFunction(reader) && reader;
	},
	/**
	 * 请求队列数增加
	 */
	increaseReqCount : function() {
		this._global.reqCount++;
	},
	/**
	 * 请求队列数减少
	 */
	reduceReqCount : function() {
		if(this._global.reqCount) {
			this._global.reqCount--;
		}
		this.execReqComplete();
	},
	/**
	 * 绑定所有请求队列执行完成事件
	 * @param {Function} handle
	 */
	bindReqComplete : function(handle) {
		this._global.onReqComplete = handle;
	},
	/**
	 * 执行所有请求队列完成事件
	 * @private
	 */
	execReqComplete : function() {
		if(!this._global.reqCount) {
			fastDev.show();
			if(fastDev.isFunction(this._global.onReqComplete)) {
				this._global.onReqComplete();
			}
		}
	}
});


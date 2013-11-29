/**
 * @class fastDev.Core.ExceptionManager
 * @singleton
 * 异常管理器，负责记录和显示当前控件库的异常与警告信息
 */
fastDev.Core.ExceptionManager = {
	/**
	 * 异常模式
	 * 分为三种级别高(high)、中(medium)、低(low)
	 * high : 提示开发者异常和警告
	 * medium : 提示开发者异常信息
	 * low : 不提示任何信息
	 */
	model : "high",
	/**
	 * 异常信息存储对象
	 * @private
	 */
	errorinfo : [],
	/**
	 * 日志信息存储对象
	 * @private
	 */
	warninfo : [],
	/**
	 * 创建异常/警告信息
	 * @private
	 */
	createMessage : function(objname, name, msg) {
		return "<b>" + objname + " 对象 " + name + " 方法执行异常</b>：<br>" + msg.replace(/\$msg/g, "<br>");
	},
	/**
	 * 记录错误信息
	 * 此方法在任何控件库的异常级别下都不会提示用户，只会保存信息，需要手工调用fastDev.showInfo方法或依赖下一次fastDev.error才会打印出来
	 * @param {String} objname 异常所在对象
	 * @param {String} name 异常所在方法
	 * @param {String} error 异常信息
	 */
	addError : function(objname, name, error) {
		var em = fastDev.Core.ExceptionManager;
		error = em.createMessage(objname, name, error);
		em.errorinfo.push(error);
	},
	addWarn : function(objname,name,warn){
		var em = fastDev.Core.ExceptionManager;
		warn = em.createMessage(objname, name, warn);
		em.warninfo.push(warn);
	},
	/**
	 * 显示当前控件库异常级别下能显示的信息
	 */
	display : function() {
		var em = fastDev.Core.ExceptionManager;
		// 如果没有异常信息则不处理
		if(!em.errorinfo.length && !em.warninfo.length) {
			return;
		}
		var warn = "", error = "<h3>异常信息：</h3>" + em.errorinfo.join("<br>");
		if(em.model = "high" && em.warninfo.length) {
			warn = "警告信息：<br><br>" + em.warninfo.join("<br><br>");
		}
		// 清除异常信息
		em.errorinfo = [];
		em.warninfo = [];
		// 弹出异常信息提示框
		fastDev.alert(error + warn, "程序运行异常", "error");
		
	},
	/**
	 * 错误信息提示
	 * 在控件库的异常级别设定不为"low"时此方法会及时打印错误信息
	 * 在控件库的异常级别设定为"low"时会记录错误信息，可手工调用fastDev.showInfo方法查看
	 * @param {String} objname 异常所在对象
	 * @param {String} name 异常所在方法
	 * @param {String} error 异常信息
	 * @member fastDev
	 */
	error : function(objname, name, error) {
		var em = fastDev.Core.ExceptionManager;
		if(em.model !== "low") {
			em.addError(objname, name, error);
			return;
		}
		error = em.createMessage(objname, name, error);
		fastDev.alert(error, "程序运行异常", "error");
	},
	/**
	 * 记录警告信息
	 *  在控件库的异常级别设定为"high"时此方法记录的警告信息才会被处理
	 * @param {String} objname 警告所在对象
	 * @param {String} name 警告所在方法
	 * @param {String} warn 警告信息
	 */
	warn : function(objname, name, warn) {
		var em = fastDev.Core.ExceptionManager;
		if(em.model !== "higt"){
			em.addWarn(objname, name, warn);
			return;
		}
		warn = em.createMessage(objname, name, warn);
		fastDev.alert(warn, "程序运行警告", "warning");
	}
};

fastDev.apply({
	/**
	 * 错误信息提示
	 * 在控件库的异常级别设定不为"low"时此方法会及时打印错误信息
	 * 在控件库的异常级别设定为"low"时会记录错误信息，可手工调用fastDev.showInfo方法查看
	 * @param {String} objname 异常所在对象
	 * @param {String} name 异常所在方法
	 * @param {String} error 异常信息
	 * @member fastDev
	 */
	error : fastDev.Core.ExceptionManager.error,
	/**
	 * 记录错误信息
	 * 此方法在任何控件库的异常级别下都不会提示用户，只会保存信息，需要手工调用fastDev.showInfo方法或依赖下一次fastDev.error才会打印出来
	 * @param {String} objname 异常所在对象
	 * @param {String} name 异常所在方法
	 * @param {String} error 异常信息
	 */
	addError : fastDev.Core.ExceptionManager.addError,
	/**
	 * 记录警告信息
	 *  在控件库的异常级别设定为"high"时此方法记录的警告信息才会被处理
	 * @param {String} objname 警告所在对象
	 * @param {String} name 警告所在方法
	 * @param {String} warn 警告信息
	 */
	warn : fastDev.Core.ExceptionManager.warn,
	/**
	 * 显示当前控件库异常级别下能显示的信息
	 */
	showInfo : fastDev.Core.ExceptionManager.display
});

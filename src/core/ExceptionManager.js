/**
 * @class fastDev.Core.ExceptionManager
 * @singleton
 * 异常管理器，负责记录和显示当前控件库的异常与警告信息
 */
fastDev.Core.ExceptionManager = {
	exceptionView : [
		'<span id="ui_exception_info"></span>',
        '<div class="ui-window-tipcontent" style="_width:326px;">',
			'<div style="position: relative;text-align: right; padding: 5px 0">',
				'<input itype="Button" text="确定" onclick="fastDev.Core.ExceptionManager.closeDialog_2()" />',
				'<input itype="Button" text="下一条" {disabled} onclick="fastDev.Core.ExceptionManager.renderDialog()" />',
				'<input itype="Button" text="详细信息" onclick="fastDev.Core.ExceptionManager.toggleDetail()" />',
			'</div>',
			'<div id="ui_exception_detail" style="margin-top:10px;display:none">',
				'<div class="ui-form ui-form-wrap ui-textarea" style="height:140px; left: 0px; top: 0px; ">',
					'<textarea name="textarea" id="ui_exception_detail_box" wrap="off" readonly="readonly" class="ui-form-field ui-form-input" style="height:137px;"></textarea>',
				'</div>',
			'</div>',
		'</div>'
	],
	/**
	 * 程序运行异常监控模式
	 * 分为三种级别高(high)、中(medium)、低(low)
	 * high/warn&error : 提示开发者异常和警告 
	 * medium/error : 提示开发者异常信息 
	 * low/none : 不提示任何信息
	 */
	mode : "medium",
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
	 * 创建错误信息
	 * @private
	 */
	createErrorMsg : function(objname, name, error, detail) {
		return  objname + " 对象 " + name + " 方法执行异常：" + ( error.message || error ) + "{split}" + detail;
	},
	/**
	 * 创建警告信息
	 * @private
	 */
	createWarnMsg : function(objname, name, warn, detail){
		return  objname + " 对象 " + name + " 方法执行警告：" + warn + "{split}" + detail;
	},
	/**
	 * 记录错误信息
	 * @param {String} objname 错误发生所在对象
	 * @param {String} name 错误发生所在方法
	 * @param {String} error 错误信息
	 * @param {String} detail 错误详细信息
	 */
	addError : function(objname, name, error, detail) {
		var em = fastDev.Core.ExceptionManager;
		error = em.createErrorMsg(objname, name, error, detail);
		em.errorinfo.push(error);
	},
	/**
	 * 记录警告信息
	 * @param {String} objname 警告发生所在对象
	 * @param {String} name 警告发生所在方法
	 * @param {String} warn 警告信息
	 * @param {String} detail 警告详细信息
	 */
	addWarn : function(objname, name, warn, detail){
		var em = fastDev.Core.ExceptionManager;
		warn = em.createWarnMsg(objname, name, warn,detail);
		em.warninfo.push(warn);
	},
	/**
	 * 显示异常信息
	 * @private 
	 */
	showMessage : function(type){
		var info, detail, exceptionView, 
			icon = "error",
			title = "程序运行",
			em = fastDev.Core.ExceptionManager,
			exceptionList = em[type+"info"];
		
		if(!exceptionList.length){
			return false;
		}
		
		if(type === "error"){
			title += "错误";
		}else{
			title += "警告";
			icon = "warning";
		}
		
		exceptionView = em.getExceptionView(exceptionList.length===1);
		
		window.top.fastDev.Core.ExceptionManager.dialog = fastDev.create("MessageBox", {
			title : title,
			icon : icon,
			content : exceptionView,
			showMaxBtn : true,
			allowResize : false,
			inside : false,
			width : "400px",
			height : "152px",
			bodyCls : "ui-tiperror",
			onAfterClose : em.closeDialog_1
		});
		
		if(window !== window.top){
			window.top.fastDev.Core.ExceptionManager[type+"info"] = window.top.fastDev.Core.ExceptionManager[type+"info"].concat(exceptionList.slice(1));
		}
		em.renderDialog(0);
	},
	/**
	 * 显示错误信息 
	 */
	showError : function(){
		var em = fastDev.Core.ExceptionManager;
		return em.showMessage(em.exceptionType = "error");
	},
	/**
	 * 显示警告信息 
	 */
	showWarn : function(){
		var em = fastDev.Core.ExceptionManager;
		em.showMessage(em.exceptionType = "warn");
	},
	/**
	 * 显示当前控件库异常级别下能显示的信息
	 */
	display : function() {
		var em = fastDev.Core.ExceptionManager,
			mode = em.mode;
		
		if(mode === "low" || mode === "none"){
			return;
		}
		
		if(em.showError() === false && (mode === "high" || mode === "warn&error")){
			em.showWarn();
		}
	},
	/**
	 * 错误信息显示
	 * 在控件库的异常级别设定不为"low"时此方法会及时打印错误信息
	 * 在控件库的异常级别设定为"low"时会记录错误信息，可手工调用fastDev.showInfo方法查看
	 * @param {String} objname 错误所在对象
	 * @param {String} name 错误所在方法
	 * @param {String} error 错误信息
	 * @param {String} detail 错误详细信息
	 */
	error : function(objname, name, error, detail) {
		var em = fastDev.Core.ExceptionManager;
		em.addError(objname, name, error, detail);
		if(em.mode !== "low" && em.mode !== "none") {
			em.showError();
		}
	},
	/**
	 * 警告信息显示
	 *  在控件库的异常级别设定为"high"时此方法记录的警告信息才会被处理
	 * @param {String} objname 警告所在对象
	 * @param {String} name 警告所在方法
	 * @param {String} warn 警告信息
	 * @param {String} detail 警告详细信息
	 */
	warn : function(objname, name, warn, detail) {
		var em = fastDev.Core.ExceptionManager;
		em.addWarn(objname, name, warn, detail);
		if(em.mode === "high" && em.mode === "warn&error") {
			em.showWarn();
		}
	},
	renderDialog : function(index){
		var em = fastDev.Core.ExceptionManager, 
			exceptionList = em[em.exceptionType+"info"],
			exceptionMsg = exceptionList.shift();
		
		if(!exceptionMsg){
			return;
		}
		
		if( !exceptionList.length && this.alias ){
			this.disable();
		}
		
		exceptionMsg = exceptionMsg.split("{split}");
		window.top.fastDev("#ui_exception_info").setText(exceptionMsg[0]);
		window.top.fastDev("#ui_exception_detail_box").prop("value", exceptionMsg[1]);
	},
	closeDialog_1 : function(){
		if(fastDev.Core.ExceptionManager.exceptionType === "error"){
			fastDev.Core.ExceptionManager.showWarn();
		}
	},
	closeDialog_2 : function(){
		window.top.fastDev.Core.ExceptionManager.dialog.close();
	},
	toggleDetail : function(){
		var height, detail = window.top.fastDev("#ui_exception_detail");
		height = detail.isShow()?"150px":"302px";
		window.top.fastDev("#ui_exception_detail").toggle();
		window.top.fastDev.Core.ExceptionManager.dialog.resize({"height":height});
	},
	getExceptionView : function(hasmore){
		var view = this.exceptionView.join(''),
			disabled = hasmore ? 'disabled=true' : '';
		return view.replace("{disabled}",disabled);
	}
};

fastDev.apply({
	/**
	 * 错误信息提示
	 * 在控件库的异常级别设定不为"low"时此方法会及时打印错误信息
	 * 在控件库的异常级别设定为"low"时会记录错误信息，可手工调用fastDev.showInfo方法查看
	 * @param {String} objname 错误所在对象
	 * @param {String} name 错误所在方法
	 * @param {String} error 错误信息
	 * @param {String} detail 错误信息详情
	 * @member fastDev
	 */
	error : fastDev.Core.ExceptionManager.error,
	/**
	 * 警告信息提示
	 *  在控件库的异常级别设定为"high"时此方法记录的警告信息才会被处理
	 * @param {String} objname 警告所在对象
	 * @param {String} name 警告所在方法
	 * @param {String} warn 警告信息
	 * @param {String} detail 警告信息详情
	 * @member fastDev
	 */
	warn : fastDev.Core.ExceptionManager.warn,
	/**
	 * 记录错误信息
	 * 此方法在任何控件库的异常级别下都不会提示用户，只会保存信息，需要手工调用fastDev.showInfo方法或依赖下一次fastDev.error才会打印出来
	 * @param {String} objname 错误所在对象
	 * @param {String} name 错误所在方法
	 * @param {String} error 错误信息
	 * @param {String} detail 错误信息详情
	 * @member fastDev
	 */
	addError : fastDev.Core.ExceptionManager.addError,
	/**
	 * 记录警告信息
	 * 此方法在任何控件库的异常级别下都不会提示用户，只会保存信息，需要手工调用fastDev.showInfo方法或依赖下一次fastDev.warn才会打印出来
	 * @member fastDev
	 */
	addWarn : fastDev.Core.ExceptionManager.addWarn,
	/**
	 * 显示当前控件库异常级别下能显示的异常信息
	 * @member fastDev
	 */
	show : fastDev.Core.ExceptionManager.display,
	/**
	 *  显示到目前为止记录下来未显示的错误信息(错误级别为low或none时不做处理)
	 * @member fastDev
	 */
	showError : fastDev.Core.ExceptionManager.showError,
	/**
	 *  显示到目前为止记录下来未显示的警告信息(错误级别为high或warn&error时才会显示)
	 * @member fastDev
	 */
	showWarn : fastDev.Core.ExceptionManager.showWarn
});

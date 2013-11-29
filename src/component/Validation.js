/**
 * @class fastDev.Ui.Validation
 * @extends fastDev.Core.Base
 * 验证类继承自Base，实现了表单类控件的大部分验证功能，包括非空验证、长度验证、邮箱验证、身份证验证、手机验证等等
 */
fastDev.Core.Validation = {
	doubleByte : /[^\x00-\xff]/g,
	number : /^[\-\+]?\d+\.?\d*$/,
	email : /^[a-zA-Z0-9_\\.]+@[a-zA-Z0-9\-]+[\\.a-zA-Z]+$/,
	code : /^[0-9]{6}$/,
	idCard : /^\d{14}(\d{1}|\d{4}|(\d{3}[xX]))$/,
	mobile : /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]\d{9}$/,
	telPhone : /^((\(0\d{2}\)[\- ]?\d{8})|(0\d{2}[\- ]?\d{8})|(\(0\d{3}\)[\- ]?\d{7,8})|(0\d{3}[\- ]?\d{7,8}))?$/,
	ipAddress : /^(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([0-9]|([0-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/,
	/**
	 * 验证控件值是否为空
	 * @param {Object} ctrl 控件对象
	 */
	checkRequired : function(value) {
		if(!fastDev.isValid(value) || fastDev.Util.StringUtil.trim(value) === "") {
			return "不能为空";
		}
	},
	/**
	 * 控件值最大长度验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkMaxLength : function(value, rule) {
		if(value.replace(this.doubleByte, '..').length > rule) {
			return "长度只能在" + rule + "以内";
		}
	},
	/**
	 * 控件值最小长度验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkMinLength : function(value, rule) {
		if(value.replace(this.doubleByte, '..').length < rule) {
			return "长度只能在" + rule + "以上";
		}
	},
	/**
	 * 控件值长度验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkLenEqual : function(value, rule) {
		if(value.length != rule) {
			return "长度只能是" + rule;
		}
	},
	/**
	 * 数字验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsNumber : function(value) {
		if(!this.number.test(value)) {
			return "必须是数字";
		}
	},
	/**
	 * 最小数字验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkMinNumber : function(value, rule) {
		if(+value < +rule) {
			return "数值必须大于" + rule;
		}
	},
	/**
	 * 最大数字验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkMaxNumber : function(value, rule) {
		if(+value > +rule) {
			return "数值必须小于" + rule;
		}
	},
	/**
	 * 值相等验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkIsEqual : function(value, rule) {
		var col=fastDev("[id=" + rule + "]").elems.length>0?fastDev("[id=" + rule + "]"):fastDev("[name=" + rule + "]");
		var val=col.prop("value") || col.attr("value");
		if(value !== val) {
			return "两次输入的值必须相等";
		}
	},
	/**
	 * 邮箱验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsEmail : function(value) {
		if(!this.email.test(value)) {
			return "必须是邮箱格式";
		}
	},
	/**
	 * 邮编验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsCode : function(value) {
		if(!this.code.test(value)) {
			return "必须是邮编格式";
		}
	},
	/**
	 * 身份证验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsIdCard : function(value) {
		if(!this.idCard.test(value)) {
			return "必须是身份证号码格式";
		}
	},
	/**
	 * 手机号码验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsMobile : function(value) {
		if(!this.mobile.test(value)) {
			return "必须是手机号码格式";
		}
	},
	/**
	 * 电话号码验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsTel : function(value) {
		if(!this.telPhone.test(value)) {
			return "必须是电话号码格式";
		}
	},
	/**
	 * Ip地址验证
	 * @param {Object} ctrl 控件对象
	 * @return {Boolean}
	 */
	checkIsIp : function(value) {
		if(!this.ipAddress.test(value)) {
			return "必须是IP格式";
		}
	},
	/**
	 * 自定义验证
	 * @param {Object} ctrl 控件对象
	 * @param {String} rule 验证规则
	 * @return {Boolean}
	 */
	checkSelfRegular : function(value, rule) {
		if(!RegExp(rule).test(value)) {
			return "值不合法";
		}
	},
	/**
	 *
	 * @param {String} rule
	 * @param {String} href
	 * @param {string} model 错误提示模型
	 */
	checkAjax : function(value, url, ctrl, handle) {
		fastDev.Ajax.doGet(url, {
			data : "value=" + value,
			success : function() {
				handle.call(ctrl);
			},
			complete : function(result) {
				var msg = (fastDev.isString(result) ? result : result.text).replace(/[\r\n\t]/g,"");
				if(fastDev.isString(msg) && msg.length > 0){
					ctrl.initError(msg);
				}else{
					ctrl.destroyError();
				}
			}
		});
	},
	/**
	 * 验证接口
	 */
	validate : function(rule, value, errorConfig) {
		var me = this, rules = rule.split(";"), errorList = [];

		while(rules[0]) {
			rule = rules.shift().split(":");

			var msg, method, param = rule[1];

			method = fastDev.Util.StringUtil.capitalize(rule[0]);
			if(!value && method !== "Required"){
				continue;
			}
			msg = me["check"+method](value, param);

			if(fastDev.isString(msg)) {
				errorList.push( errorConfig ? errorConfig[rule[0]]||msg : msg);
			}
		}

		return errorList.join(";");
	}
};

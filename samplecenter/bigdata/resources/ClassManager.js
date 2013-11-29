fastDev.namespace("fastDev.Core");
/**
 * @class fastDev.Core.ClassManage
 * @singleton
 */
fastDev.Core.ClassManager = {
	_aliasMap : {},
	_classMap : {},
	/**
	 * 注册类
	 * @param {String} className 类名
	 * @param {Object} clazz 类对象
	 * @param {String} [classAlias] 类别名
	 */
	regClass : function(className, clazz, classAlias) {
		classAlias = classAlias || className;
		this._aliasMap[classAlias] = className;
		this._classMap[className] = clazz;
	},
	/**
	 * 根基类名或类别名获取类对象
	 * @param {Object} name 类名或类别名
	 * @return {Object|undefined}
	 */
	getClass : function(name) {
		var Class;
		if( Class = this._classMap[name]) {
		} else if( Class = this._aliasMap[name]) {
			Class = this._classMap[Class];
		}
		return Class?(Class.Class||Class):undefined;
	}
};
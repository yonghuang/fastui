/**
 * @class fastDev.Data.Field
 * @extends fastDev.Core.Base
 * @author 袁刚
 * 字段模型实现类，定义了字段的各种信息，需配合{@link fastDev.Data.DataSet}使用
 */

fastDev.define("fastDev.Data.Field", {
	extend : "fastDev.Core.Base",
	alias : "Field",
	_options : {
		/**
		 * 字段名称
		 * @type {String}
		 */
		name : null,
		/**
		 * 默认值
		 * @type {String/Boolean/Number}
		 */
		defaultValue : null,
		/**
		 * 映射名称
		 * @type {String}
		 */
		mapping : null,
		/**
		 * 字段类型 String,Int,Float,Boolean,DataSet
		 * @type {String}
		 */
		type : "Object",
		/**
		 * 字段值转换器
		 * @type {Function}
		 */
		convert : fastDev.noop
	},
	/**
	 * 获取当前字段对象值
	 * @param {Object} value
	 * @return {Boolean/String/Number}
	 */
	getValue : function(value) {
		var convert, options = this._options, type = options.type;
		// 如果数据无效则取数据默认值
		value = value == null ? options.defaultValue : value;

		convert = fastDev.isNoop(options.convert) ? this["convert" + type] : options.convert;

		if(fastDev.isFunction(convert)) {
			value = convert.call(this, value);
		}

		return value == null ? "" : value;
	},
	/**
	 * 获取当前字段名称
	 * @return {String}
	 */
	getName : function() {
		return this._options.name;
	},
	/**
	 * 获取当前字段映射名称
	 * @return {String}
	 */
	getMapping : function() {
		return this._options.mapping || this._options.name;
	},
	/**
	 *  转换成字符串类型
 	 * @param {Object} value 
 	 * @return {String}
 	 * @private
	 */
	convertString : function(value) {
		return value == null ? "" : value + "";
	},
	/**
	 * 转换成整数类型
 	 * @param {Object} value
 	 * @return {Number}
 	 * @private
	 */
	convertInt : function(value) {
		value = parseInt(value);
		return value === NaN ? 0 : value;
	},
	/**
	 * 转换成浮点数类型 
	 * @param {Object} value
	 * @return {Number}
	 * @private
	 */
	convertFloat : function(value) {
		return value * 1;
	},
	/**
	 *  转换成布尔类型
 	 * @param {Object} value
 	 * @return {Boolean}
 	 * @private
	 */
	convertBoolean : function(value) {
		return (value === true || value === "true") ? true : value == true;
	},
	/**
	 *  转换为数据集
 	 * @param {Object} value
 	 * @return {fastDev.Data.DataSet}
 	 * @private
	 */
	convertDataset : function(value) {
		return fastDev.create("DataSet", {
			fields : this._options.fields,
			data : value,
			autoLoad : true
		});
	}
});

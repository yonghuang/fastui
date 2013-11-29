/**
 * @class fastDev.Data.Record
 * @extends fastDev.Core.Base
 * @author 袁刚 
 * 数据集行记录对象实现类，协助数据集进行数据管理的辅助类
 */
fastDev.define("fastDev.Data.Record", {
	extend : "fastDev.Core.Base",
	alias : "Record",
	_options : {
		/**
		 * 记录的数据
		 * @type {JsonObject} 
		 */
		data : null,
		/**
		 * 字段配置
		 * @type{Array[fastDev.Data.Field]} 
		 */
		fields : null
	},
	/**
	 *  数据行对象创建准备
	 * @protected 
	 */
	ready : function() {
		this.data = {};
	},
	/**
	 *  数据行对象初始化
	 * @protected 
	 */
	init : function(options, global) {
		var fields = options.fields, data = options.data;
		if(data == null || fastDev.isEmptyObject(data)){
			return;
		}
		
		for(var i = 0, field; field = fields[i]; i += 1) {
			var name = field.getName(), value = data[name];
			this.set(name, value, field);
		}
	},
	/**
	 *	获取指定名称的数据 
	 * @param {String} fieldName 名称
	 * @return {Object}
	 */
	get : function(fieldName) {
		return this.data[fieldName];
	},
	/**
	 *  设置指定名称的数据
	 * @param {String} name 名称
	 * @param {Object} value 数据
	 * @param {fastDev.Data.Field} [field] 字段模型
	 */
	set : function(name, value, field) {
		if(field) {
			var mapping = field.getMapping(), data = this.data;
			value = field.getValue(value);
			data[mapping] = value;
		} else {
			var options=this._options,fields = options.fields;
			for(var i = 0; field = fields[i]; i++) {
				if(field.getName() === name) {
					this.set(null, value, field);
					break;
				}
			}
		}
	}
});

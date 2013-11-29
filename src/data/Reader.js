/**
 * @class fastDev.Data.Reader
 * @extends fastDev.Core.Base
 * @author 袁刚
 * 数据读取实现类，协助数据集读取后台返回数据的辅助类
 */
fastDev.define("fastDev.Data.Reader", {
	alias : "Reader",
	/**
	 *  数据读取方法
	 * @param {JsonObject/String/Xml} data 原始数据
	 */
	read : function(data, type) {

		var method = "read" + fastDev.Util.StringUtil.capitalize(type || "json");

		return this[method](data);
	},
	/**
	 * Json格式数据读取方法
	 * @param {String|JsonObject} data Json格式数据
	 */
	readJson : function(data) {
		return fastDev.Util.JsonUtil.parseJson(data);
	},
	/**
	 * 数据格式数据读取方法(暂未实现)
	 */
	readArray : function(data) {

	},
	/**
	 * Xml格式数据读取方法(暂未实现)
	 */
	readXml : function(data) {

	},
	readString : function(data) {
		return data?data + "":"";
	},
	readDataSegment : function(data, root) {
		if(!fastDev.isValid(root) || !data) {
			return data;
		}
		var rootPath = root.split("."), copy = data;
		while(rootPath[0]) {
			root = rootPath.shift();
			if(/^\d*$/.test(root)){
				root = +root;
			}
			copy = copy[root];
		}
		return copy || data;
	},
	readToTarget : function(data, config) {
		var object = config.object, root = config.root;
		data = this.readRoot(data, root);
		object.load(data);
	}
});

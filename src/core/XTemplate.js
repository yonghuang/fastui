/**
 *	控件展现模板实现，负责解析控件内定义的界面规则并生成对应的Element
 * @class fastDev.Core.Template
 * @extends fastDev.Core.Base
 * @author  袁刚
 */

/**
 * @method destroy
 * @private
 */
fastDev.define("fastDev.Core.Template", {
	extend : "fastDev.Core.Base",
	alias : "Template",
	_options : {
		/**
		 * @type {Array[String]} 模板语句数组
		 */
		htmlList : null,
		/**
		 * @type {JsonObject} 模板中用到的参数存储对象
		 */
		params : null,
		/**
		 * 解析数据类型
		 * @type {String} dataset or Array[JsonObject]
		 */
		parseType : "dataset"
	},
	_global : {
		staticTpl : null,
		dynamicTpl : null
	},
	// 匹配标签
	_tplTag : /(?:<tpl\s(dynamic|each)\s*([^>]*)\>)|(?:<\/tpl>)/g,
				 
	// 匹配结束标签
	_tplTagEnd : /<\/tpl>/,
	// 匹配if标签内的条件
	_captureCond : /\({1}(.*)\){1}/,
	// 匹配条件语句
	_tplIF : /<tpl\s(else|else\sif)(.*)/,
	// 匹配变量关键字
	_captureParamKey : /#\{(.*)\}/,
	// 匹配变量
	_captureParam : /#\{[^\}]*\}/g,
	// 匹配数据关键字
	_captureDataKey : /\{(.*)\}/,
	// 匹配数据变量
	_captureData : /\{[^\}]*\}/g,
	// 匹配数据子集
	_captureEachProp : /each\(\{(.*)\}\)/,
	_eachCount :0,
	/**
	 * 模板初始化方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	ready : function(options, global) {
		// 初始化动态模板存储空间
		global.dynamicTpl = {};
		// load plugin
	},
	/**
	 * 模板构造方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	construct : function(options, global) {
		// 编译生成模板静态标签部分
		var staticTplHandle = new Function(this.compile(options.htmlList.join("")).join(""));
		global.staticTpl = staticTplHandle;
	},
	compile : function(tplStr, param, iterate,index) {
		var body  = [];
		this.initBody(body);
		var begin, end, len = tplStr.length,
		// 标签正则 
		tplTag = this._tplTag,
		level = 0;
		
		index = index || 0;
		
		for( ; index < len; index = end) {
			tplTag.lastIndex = index;
			var match = tplTag.exec(tplStr);
			if(match == null) {
				body.push("html.push('"+tplStr.substring(index, len)+"');\n");
				break;
			}

			begin = match.index;
			end = tplTag.lastIndex;

			if(index < begin) {
				body.push("html.push('"+tplStr.substring(index, begin)+"');\n");
			}
			
			if(match[1]){
				level ++;
			}
			
			switch(match[1]){
				case "dynamic" : 
					var name = /name\s*=\s*(.*)/.exec(match[2])[1] || "tpl"+fastDev.getID(),
					info = this.compileDynamic(tplStr,param,end);
					end = info.end;
					this._global.dynamicTpl[name] = info.body;
					body.push("html.push('<span name=\"" + name + "\"></span>');\n");
					break;
				case "each":
					this.compileEach(body);
					break;
					
			}
			
			 if (match[0] === "</tpl>"){
				if(level === 0){
					break;
				}
				body.push("}\n");
				level --;
			 }
		}
		body.push("return html.join('');");
		
		if(iterate === true){
			return {end:end,body:body};
		}
		return body;
	},
	initBody : function(body){
		body.push("var html=[];\n");
	},
	compileDynamic:function(tplStr,param,index){
		return this.compile(tplStr,param,true,index);
	},
	compileEach : function(body){
		var eachCount = this._eachCount++;
		var i = "i"+eachCount,len = "len"+eachCount,data = "data"+eachCount;
		body.push("var "+i+" = 0,"+len+" = dataList.length,"+data+";\n");
		body.push("for(;"+i+"<"+len+";"+i+"++){\n");
		body.push(data+" = dataList["+i+"];\n");
	}
});


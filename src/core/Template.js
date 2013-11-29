/**
 * @class fastDev.Core.Template
 * @extends fastDev.Core.Base
 * @author  袁刚
 * 控件展现模板实现，负责解析控件内定义的界面规则并生成DomObject对象
 */
fastDev.define("fastDev.Core.Template", {
	alias : "Template",
	prototype : function(setting) {
		// 模板内容
		this.content = setting.content || setting.htmlList;
		// 模板参数
		this.params = setting.params;
		// 模板所属控件
		this.control = setting.name || "自定义模板";
		// 动态模板存储对象
		this.dynamicMap = {};
		// 模板关键字捕捉正则
		this.capturekey = /(?:<tpl\s(dynamic|each|if|else\sif|else)\s*([^>]*)\>)|(?:<\/tpl>)/g;
		// 参数占位符捕捉正则
		this.captureParam = /#\{([^\}]*)\}/g;
		// 数据占位符捕捉正则
		this.captureData = /\{([^\}]*)\}/g;
		// 小于号占位符捕捉正则
		this.captureLTSign = /&lt;/g;
		// 大于号占位符捕捉正则
		this.captureGTSign = /&gt;/g;
		// 动态模板名称捕捉正则
		this.captureDynamicName = /name\s*=\s*(.*)/,
		// 避免嵌套渲染中变量重名
		this.loopLevel = 0;
		// 模板内容有效性校验
		if(fastDev.isArray(this.content)) {
			this.content = this.content.join("");
		} else if(!fastDev.isString(this.content)) {
			fastDev.addError("Template", "construct", "传入的模板内容不合法");
		}
		// 去除可能导致模板编译出错的格式字符
		this.content = this.content.replace(/[\r\t\n]/g, "");
		// 编译模板内容，生成静态模板函数以及动态模板函数
		var fnContent = this.compile(this.content);
		try {
			// 编译静态模板生成函数
			this.staticTemplate = fastDev.Util.ObjectUtil.parseObject("params", fnContent);
		} catch(e) {
			fastDev.addError("Template", "construct", this.control + " 解析静态模板异常：" + e.message);
		}
	},
	/**
	 * 模板内容编译 
	 * @param {String} 模板内容
	 * @param {Number} index 解析起始下标 
	 * @param {Boolean} isDynamic 当前是否在编译动态模板
	 * @private
	 */
	compile : function(content, index, isDynamic) {
		var begin, end, key, match, parseInfo,
		// 代码层次
		level = 0,
		// 模板内容长度
		len = content.length,
		// 函数内容
		fnContent = ['var html=[];\n'];

		// 正则匹配开始标志
		index = index || 0;

		for(; index < len; index = end) {
			// 设置正则匹配的起始下标
			this.capturekey.lastIndex = index;
			match = this.capturekey.exec(content);

			// 匹配不到任何模板关键字时，将所有模板内容当HTML代码添加至函数中
			if(match === null) {
				this.pushHtml(fnContent, content.substring(index, len));
				break;
			}
			// 记录当前匹配的起始与结束下标
			begin = match.index;
			end = this.capturekey.lastIndex;
			
			// 当当前这次匹配与上次匹配之间的非模板关键字字符当HTML代码添加至函数中
			if(index < begin) {
				this.pushHtml(fnContent, content.substring(index, begin));
			}

			if( key = match[1]) {
				parseInfo = this.parseKey(fnContent, match[2], key, content, end ,level);
				level = parseInfo[0];
				end = parseInfo[1];
			} else if(match[3]) {
				
			} else if(match[0] === "</tpl>") {
				if(level === 0) {
					break;
				}
				fnContent.push(" } \n");
				level--;
			}
		}
		fnContent.push("return html.join('');");
		
		if( isDynamic === true ){
			return [end, fnContent.join("")];
		}
		
		return fnContent.join("");
	},
	/**
	 * 将HTML代码加入模板函数内容中 
	 * @param {Array} fnContent 模板函数内容数组
	 * @param {String} html HTML代码
	 * @private
	 */
	pushHtml : function(fnContent, html) {
		var params = this.params;
		fnContent.push("html.push('" + html.replace(this.captureParam, function(all, match){
			if(params && params[match] === undefined){
				params[match] = "";
			}
			return "' + params[\""+ match +"\"] + '";
		}).replace(this.captureData, "' + item[\"$1\"] + '")  + "'); \n");
	},
	/**
	 * 解析模板关键字 
	 * @param {Array} fnContent 模板函数内容数组
	 * @param {String} content 解析关键字附加内容
	 * @param {String} key 模板关键字
	 * @param {String} template 完整模板字符串
	 * @param {Number} end 当前关键字下辖内容起始下标
	 * @param {Number} level 当前解析层级
	 * @private
	 */
	parseKey : function(fnContent, content, key, template, end, level) {
		switch(key) {
			case "if" :
				this.parseIf(fnContent, content);
				level++;
				break;
			case "else" :
				this.parseElse(fnContent);
				break;
			case "else if" :
				this.parseElseIf(fnContent, content);
				break;
			case "each" :
				this.parseEach(fnContent, content);
				level++;
				break;
			case "dynamic" :
				end = this.parseDynamic(template, content, end);
				break;
		}
		return [level, end];
	},
	/**
	 * 解析 if 关键字 
	 * @param {Array} fnContent 模板函数内容数组
	 * @param {String} cond if关键字内的条件
	 * @private
	 */
	parseIf : function(fnContent, cond) {
		cond = cond.replace(this.captureLTSign, "<").replace(this.captureGTSign, ">").replace(this.captureParam, "params.$1").replace(this.captureData, "item.$1");
		fnContent.push("if" + cond + "{\n");
	},
	/**
	 * 解析 else 关键字 
	 * @param {Array} fnContent 模板函数内容数组
	 * @private
	 */
	parseElse : function(fnContent) {
		fnContent.push("} else {");
	},
	/**
	 *  解析 else if 关键字 
	 * @param {Array} fnContent 模板函数内容数组
	 * @param {String} cond if关键字内的条件
	 * @private
	 */
	parseElseIf : function(fnContent, cond) {
		this.parseIf(fnContent, cond);
		fnContent.push("} else " + fnContent.pop());
	},
	/**
	 * 解析 each 关键字 
	 * @param {Array} fnContent 模板函数内容数组
	 * @private
	 */
	parseEach : function(fnContent){
		var i = "i" + this.loopLevel++;
		fnContent.push("for( var " + i + " = 0, item, dateSeq, rowid ; item = data[" +i+"]; " + i + "++ ){ \n");
		fnContent.push("rowid =  ( params.rowid || 0 ) + "+ i + " + 1;\n");
	},
	/**
	 * 解析 dynamic 关键字 
	 * @param {String} template 完整模板字符串
	 * @param {String} content 动态模板其他信息
	 * @param {Number} index 动态模板开始下标
	 * @private
	 */
	parseDynamic : function(template, content, index){
		var name, match, fnContent, dynamicInfo;
		
		match = this.captureDynamicName.exec(content);
		name = match ? match[1] : "d_" + fastDev.getID();
		// 编译动态模板
		dynamicInfo = this.compile(template, index, true);
		// 获取动态模板内容
		fnContent = dynamicInfo[1];
		try {
			// 生成动态模板函数并保存
			this.dynamicMap[name] = fastDev.Util.ObjectUtil.parseObject("params","data", fnContent);
		} catch(e) {
			fastDev.addError("Template", "construct", this.control + " 解析动态模板异常：" + e.message);
		}
		// 返回动态模板结束下标
		return dynamicInfo[0];
	},
	/**
	 * 生成静态模板内容 
	 * @param {JsonObject} params 静态模板所使用到的参数组合
	 */
	buildStaticTemplate : function(params){
		return fastDev(this.staticTemplate(params));
	},
	createStaticHtml : function(){
		return this.buildStaticTemplate(this.params);
	},
	/**
	 * 生成动态模板内容 
	 * @param {String} name 动态模板名称
	 * @param {JsonObject} params 动态模板所使用到的参数组合
	 * @param {Array} data 动态模板中所使用到的数据数组
	 */
	buildDynamicTemplate : function(name, params, data, context){
		var dynamic = this.getDynamic(name);
		return context.fastDev(dynamic(params, data));
	},
	/**
	 * 根据动态模板名称获取动态模板 
	 * @param {String} name 动态模板名称
	 */
	getDynamic : function(name){
		if(fastDev.isValid(name)){
			return this.dynamicMap[name];
		}
		
		for(name in this.dynamicMap){
			return this.dynamicMap[name];
		}
	}
});

fastDev.Core.Template.prototype.prototype = fastDev.Core.Template;

fastDev.Core.Template.constructor = function(content) {
	return new this.prototype(content);
};

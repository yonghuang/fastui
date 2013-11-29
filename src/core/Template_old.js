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
		params : null
	},
	_global : {
		staticTpl : null,
		dynamicTpl : null
	},
	// 匹配标签
	_tplTag : /<tpl\s(each|if|delay|dynamic)(.*)/,
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
		global.staticTpl = this.compile(options.htmlList);
	},
	compile : function(htmlList) {
		var str, tplList = [];
		while( str = htmlList[0]) {
			// 如果当前字符串含有模板标签则进行编译，否则直译为html字符串
			if(this._tplTag.exec(str)) {
				switch(RegExp.$1) {
					case "if":
						// 编译条件语句块
						this.compileIf(htmlList, tplList);
						break;
					case "each":
						// 编译循环语句块
						this.compileEach(htmlList, tplList);
						break;
					case "dynamic" :
						// 编译动态语句块
						this.compileDynamic(htmlList, tplList);
						break;
				}
			} else {
				tplList.push({
					tagName : "html",
					content : htmlList.shift()
				});
			}
		}
		return tplList;
	},
	compileIf : function(htmlList, tplList) {
		// 1.抓取首个条件
		// 因captureFragment方法会去头去尾，需要把首个条件缓存
		var cond = htmlList[0];
		//  2.抓取标签内所有子元素
		var content = this.captureFragment(htmlList);
		// 将缓存的条件增加至待解析数组最前方
		content.splice(0, 0, cond);
		// 3.分析条件语句生成条件块
		var conds = this.analysisIfFragment(content);
		// 4.遍历条件块
		for(var i = 0; cond = conds[i++]; ) {
			// 5.编译条件内语句块
			cond.result = this.compile(cond.result);
		}

		tplList.push({
			tagName : "if",
			content : conds
		});
	},
	compileEach : function(htmlList, tplList) {
		// 获取指定遍历的属性
		var propPath = this._captureEachProp.exec(htmlList[0]) ? RegExp.$1 : "",
		// 获取循环模板内容
		content = this.captureFragment(htmlList),
		// 分析循环模板内容
		fragment = this.analysisEachFragment(content);

		tplList.push({
			tagName : "each",
			propPath : propPath,
			content : fragment
		});
	},
	compileDynamic : function(htmlList, tplList) {
		var name = /name=([^>]*)/.exec(htmlList[0])?RegExp.$1:fastDev.getID(),
		// 获取动态模板内容
		content = this.captureFragment(htmlList),
		// 分析动态模板内容
		fragment = this.analysisDynamicFragment(content);

		tplList.push({
			tagName : "dynamic",
			content : fragment,
			name : name
		});
	},
	analysisIfFragment : function(fragment) {
		// 生成首个条件及其内容
		var str = fragment.shift(), cond = {
			cond : this.captureCond(str),
			result : []
		}, rs = cond.result, conds = [cond], level = 0, index = 0;

		while(fragment[0]) {
			str = fragment.shift();
			if(this._tplTag.test(str)) {
				level++;
			} else if(this._tplTagEnd.test(str)) {
				level--;
			}

			if(this._tplIF.test(str) && level === 0) {
				// 依次生成剩余条件及其内容
				cond = {
					cond : this.captureCond(str),
					result : []
				};
				rs = cond.result;
				conds[++index] = cond;
			} else {
				rs.push(str);
			}
		}
		return conds;
	},
	analysisEachFragment : function(fragment) {
		return this.compile(fragment);
	},
	analysisDynamicFragment : function(fragment) {
		return this.compile(fragment);
	},
	/**
	 * 执行普通标签的参数占位符替换
	 * @param {String} str 标签字符串
	 * @param {JsonObject} params 参数存储对象
	 * @private
	 */
	doNomal : function(str, params) {
		var variableList = str.match(this._captureParam) || [];

		for(var j = 0, variable; variable = variableList[j]; j += 1) {
			var variableName = this._captureParamKey.exec(variable)[1], value = params[variableName];
			str = str.replace(variable, value == null ? "" : value);
		}

		return str;
	},
	/**
	 * 执行条件判断语句的参数占位符与数据占位符替换，并返回符合条件的标签数组
	 * @param {Array} conds 条件数组
	 * @param {JsonObject} params 参数存储对象
	 * @param {fastDev.Data.Record}  record 数据记录对象
	 * @return {Array}
	 * @private
	 */
	doIf : function(conds, params, record) {
		var result;

		for(var i = 0, item; item = conds[i++]; ) {
			var cond = item.cond;

			cond = this.doParamReplace(cond, params);

			cond = this.doDataReplace(cond, record);

			if(this.execCond(cond || "1==1")) {
				result = item.result;
				break;
			}
		}

		return result || [];
	},
	/**
	 * 参数数占位符替换
	 * @param {Array} str 标签字符串
	 * @param {JsonObject} params 参数存储对象
	 * @return {String}
	 * @private
	 */
	doParamReplace : function(str, params) {
		var conds = str.split(/&&|\|\||&|\|/), condStr;
		while(conds[0]) {
			condStr = conds.shift();
			var variableList = condStr.match(this._captureParam) || [];
			for(var j = 0, variable; variable = variableList[j]; j += 1) {
				var variableName = this._captureParamKey.exec(variable)[1];
				var value = params[variableName];
				if(!/[=!><]/.test(condStr)) {
					value = (!!value);
				}
				str = str.replace(RegExp(variable, "g"), value);
			}
		}
		return str;
	},
	doEach : function(tplList, params, dataList) {
		var html = [];
		// 循环记录数组
		for(var i = 0, record; record = dataList[i]; i += 1) {
			// 建立循环模板数组拷贝，避免循环内条件判断被固定
			var copy = tplList.slice(0);
			// 循环模板数组
			for(var j = 0, tpl; tpl = copy[j]; j += 1) {
				var str = tpl.content || tpl;
				// 如果当前语句无需再次解析，则直接做参数与数据占位符的替换
				if(fastDev.isString(str)) {
					str = this.doParamReplace(str, params);
					str = this.doDataReplace(str, record);
					html.push({
						tagName : "html",
						content : str
					});
				} else {
					// 否则调用解析
					this.buildHTML([tpl], params, record);
					// 获取解析结果
					var list = this._html;
					// 将解析结果替换当前语句
					if(list.length) {
						var index = 1;
						copy.splice(j, 1, list.shift());
						while(list[0]) {
							copy.splice(j + index, 0, list.shift());
							index++;
						}
						j -= 1;
					}
				}
			}
		}
		return html;
	},
	/**
	 * 数据占位符替换
	 * @param {Array} str 标签字符串
	 * @param {fastDev.Data.Record}  record 数据记录对象
	 * @return {String}
	 * @private
	 */
	doDataReplace : function(str, record) {
		var variableList = str.match(this._captureData) || [];
		for(var k = 0, variable; variable = variableList[k]; k += 1) {
			var variableName = this._captureDataKey.exec(variable)[1];
			str = str.replace(RegExp(variable, "g"), record[variableName]);
		}
		return str;
	},
	/**
	 * 抓取数据中的条件表达式部分
	 * @param {String} str 模板语句
	 * @return {String}
	 * @private
	 */
	captureCond : function(str) {
		return this._captureCond.exec(str) ? RegExp.$1 : "";
	},
	/**
	 * 执行条件
	 * @param {String} cond 条件字符串
	 * @return {Boolean}
	 * @private
	 */
	execCond : function(cond) {
		return fastDev.Util.ObjectUtil.parseObject(cond);
	},
	/**
	 * 抓取一段标签
	 * @param {Array} 模板语句数组
	 * @return {Array}
	 * @private
	 */
	captureFragment : function(htmlList) {
		htmlList.shift();
		var level = 0, fragment = [], str;
		while(htmlList[0]) {
			str = htmlList.shift();
			if(this._tplTagEnd.test(str)) {
				if(level === 0) {
					//fragment.push(str);
					break;
				} else {
					level -= 1;
				}
			} else if(this._tplTag.test(str)) {
				level += 1;
			}
			fragment.push(str);
		}
		return fragment;
	},
	/**
	 * 解析模板并生成HTML字符串数组 
	 * @param {Array} tplList 模板语句数组
	 * @param {JsonObject} params 参数存储对象
	 * @param {Array[fastDev.Data.Record]} 数据记录数组
	 * @private
	 */
	buildHTML : function(tplList, params, dataList) {
		var html = [], dynamic_id = 0;
		// 初始化模板中所需要用到的参数
		params = params || this._options.params || {};
		while(tplList[0]) {
			var tpl = tplList.shift(), tagName = tpl.tagName, content = tpl.content;

			switch(tagName) {
				case "html":
					// 生成普通html标签，并替换占位符
					html.push(this.doNomal(content, params));
					break;
				case "if":
					// 判断条件返回符合条件的html标签数组
					tplList = this.doIf(content, params, dataList).concat(tplList);
					break;
				case "each":
					var datafragment;
					// 配置了each目标时，做数据转接
					if( tpl.propPath !== ""){
						datafragment = dataList(0).get(tpl.propPath);
					}
					// 循环生成HTML标签，并替换占位符
					tplList = this.doEach(content, params, datafragment || dataList).concat(tplList);
					break;
				case "dynamic":
					// 生成动态模板占位标签
					html.push('<span name="' + tpl.name + '"></span>');
					// 保存动态模板
					this._global.dynamicTpl[tpl.name] = content;
					break;
			}
		}
		this._html = html;
	},
	/**
	 * 根据静态模板生成HTML标签数组
	 */
	buildStaticTpl : function() {
		this.buildHTML(this._global.staticTpl.slice(0));
	},
	/**
	 * 获取当前生成的HTML标签数组
	 */
	getHtml : function() {
		return (this._html || []).join("");
	},
	/**
	 * 将当前生成的HTML标签数组创建为DomObject对象
	 */
	createDom : function() {
		return fastDev(this._html.join(""));
	},
	/**
	 * 获取动态模板 
	 * @param {String} [name] 动态模板名称
	 */
	getDynamicTpl : function(name) {
		var dynamicTpl = this._global.dynamicTpl,tplList=[];
		if(name != null) {
			tplList = (dynamicTpl[name] || tplList).slice(0);
		}else{
			for(var p in dynamicTpl){
				name=p;
				tplList = dynamicTpl[name];
				break;
			}
		}
		return {name:name,tplList:tplList.slice(0)};
	},
	/**
	 * 初始化动态模板
	 * @param {Array[fastDev.Data.Record]} 数据记录数据
	 * @param {String} [name] 动态模板名称
	 */
	initDynamic : function(dataList,name){
		var dynamicTpl = this.getDynamicTpl(name),
		name = dynamicTpl.name,
		tplList = dynamicTpl.tplList;
		
		if(tplList) {
			
			this.buildHTML(tplList, null, dataList);

			return {name:name,fragment:this.createDom()};
		}
	}
});


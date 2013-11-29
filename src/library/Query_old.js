/**
 * Dom元素查询类，提供简便快捷的Dom查询功能
 * @class fastDev.Query
 * @author 袁刚
 * @singleton
 */
fastDev.Query = {
	/**
	 * Dom元素查找方法
	 * @param {String} selector 查询条件
	 * @param {Element} context 查询范围
	 * @return {Array}
	 */
	find : function(selector, context, self) {
		// 查询范围
		if(/^#(.*)/.test(selector)) {
			context = document;
			return context.getElementById(RegExp.$1);
		}

		context = context || document;
		// 结果集
		var ret = [];
		// first last全局筛选
		//pos,
		// 单次查询结果
		//ret=[];
		// 条件集
		// conds = selector.split(","),
		//
		// cond_len = conds.length;
		//for(var i = 0; i < cond_len; i += 1) {
		//conds[i] = conds[i].replace(/(\s?(?:first|last))/, "");
		//pos = RegExp.$1;
		if( context instanceof Array) {
			for(var j = 0, len = context.length; j < len; j += 1) {
				ret = ret.concat(fastDev.Query.execFind(selector, context[j], self));
				//set = set.concat(ret);
			}
		} else {
			ret = ret.concat(fastDev.Query.execFind(selector, context, self));
			//set = set.concat(ret);
		}
		//}

		// if(pos === " first") {
		// set = set.splice(0, 1);
		// } else if(pos === " last") {
		// set = set.splice(set.length - 1, 1);
		// }
		return ret;
	},
	/**
	 * 根据条件执行查询
	 * @param {String} expr 查询条件
	 * @param {Element} context 查询作用域
	 * @param {Element} self 是否包含当前作用域对象
	 * @return {Array}
	 * @private
	 */
	execFind : function(expr, context, self) {
		var condList, conds=expr.split(/\s+/), ret,
		// 获取上下文范围内所有element
		elems = fastDev.Query.getAllElemsInContext(conds, context, self);

		ret = this.execMultiCondFind(conds, elems);

		/*elems = fastDev.Query.getAllElemsInContext(conds, context);
		 if(conds[0]) {
		 while(conds[0]) {
		 var cond = conds.shift();
		 if(/([^\=\!\^\~\$]+)(=|==|!|\^|\~|\$)([^\=\!\^\~\$]+)/.exec(cond)) {
		 ret = fastDev.Query.filter(RegExp.$1, RegExp.$3, RegExp.$2, ret || elems);
		 }
		 }
		 return ret || [];
		 } else {
		 return elems;
		 }*/
		return ret || [];
	},
	/**
	 *
	 */
	execMultiCondFind : function(conds, elems) {
		var cond,contextList, ret;
		if( cond = conds.shift()) {
			contextList = this.execCondFind(cond, elems);
		}
		while(conds[0]) {
			cond = conds.shift(), ret = [];
			for(var i = 0, context; context = contextList[i]; i += 1) {
				ret = ret.concat(this.find(cond, context));
			}
		}
		return ret || contextList;
	},
	execCondFind : function(cond, elems) {
		var conds, ret;
		if( conds = cond.match(/\[[^\]]*\]/g)) {
			while(conds[0]) {
				cond = conds.shift().replace(/[\[\]]/g, "");
				ret = this.execFilter(cond, ret || elems);
			}
		} else if(cond.indexOf(",") !== -1) {
			conds = cond.split(",");
			ret = [];
			while(conds[0]) {
				cond = conds.shift();
				ret = ret.concat(this.execFilter(cond, elems));
			}
		} else {
			ret = this.execFilter(cond, elems);
		}
		return ret;
		//else if() 逗号分隔的或条件
	},
	execFilter : function(cond, elems) {
		if(/([^\=\!\^\~\$]+)(=|==|!|\^|\~|\$)([^\=\!\^\~\$]+)/.exec(cond)) {
			elems = this.filter(RegExp.$1, RegExp.$3, RegExp.$2, elems);
		}
		return elems || [];
	},
	/**
	 * 获取所有满座查询条件的Dom元素
	 * @param {String} conds 查询条件
	 * @param {Element} context 查询作用域
	 * @param {Element} self 是否包含当前作用域对象
	 * @return {Array}
	 * @private
	 */
	getAllElemsInContext : function(conds, context, self) {
		var ret, set = [], addSelf = false;
		if(context.getElementsByTagName) {
			if(/[=!\^~\$]/.test(conds[0])) {
				ret = context.getElementsByTagName("*");
				addSelf = true;
			} else {
				var tagName = conds.shift();
				ret = context.getElementsByTagName(tagName);
				addSelf = context.tagName && context.tagName.toLowerCase() === tagName;
			}
			for(var i = 0, len = ret.length; i < len; i += 1) {
				set.push(ret[i]);
			}

			if(self === true && addSelf === true) {
				set.push(context);
			}
		}
		return set;
	},
	/**
	 * 过滤查询出来的Dom元素
	 * @param {String} name 属性名称
	 * @param {String} value 属性值
	 * @param {String} type 匹配类型
	 * @param {Array} elems 当前Don元素数组
	 * @return {Array}
	 * @private
	 */
	filter : function(name, value, type, elems) {
		var ret = [], elem, elem_v;
		for(var i = 0; elem = elems[i]; i += 1) {
			elem_v = fastDev.Dom.attr(elem, name);
			if(this.execCond(elem_v, value, type)) {
				ret.push(elem);
				elems.splice(i, 1);
				i -= 1;
			}
		}
		copy = null;
		return ret;
	},
	/**
	 * 检测指定值与目标值是否满足匹配类型
	 * @param {String} s_value 指定值
	 * @param {String} t_value 目标值
	 * @param {String} type 匹配类型
	 * @return {Boolean}
	 * @private
	 */
	execCond : function(s_value, t_value, type) {
		var ret = false;
		switch(type) {
			case "=":
				ret = RegExp("\\s" + t_value + "\\s").test(" " + s_value + " ");
				break;
			case "==":
				ret = s_value === t_value;
				break;
			case "!":
				ret = s_value !== t_value;
				break;
			case "^":
				ret = RegExp("^" + t_value).test(s_value);
				break;
			case "~":
				ret = RegExp(t_value).test(s_value);
				break;
			case "$":
				ret = RegExp(t_value + "$").test(s_value);
				break;
		}
		return ret;
	}
};

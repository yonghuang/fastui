(function() {
	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	//
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	//
	done = 0,
	//
	toString = Object.prototype.toString,
	//
	hasDuplicate = false,
	//
	baseHasDuplicate = true,
	//
	rBackslash = /\\/g,
	//
	rReturn = /\r\n/g,
	//
	rNonWord = /\W/;

	var Expr = {
		order : ["ID", "NAME", "TAG"],
		match : {
			ID : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
			NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
			ATTR : /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
			TAG : /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
			CHILD : /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
			POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
			PSEUDO : /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
		},

		leftMatch : {},

		attrMap : {
			"class" : "className",
			"for" : "htmlFor"
		},

		attrHandle : {
			href : function(elem) {
				return elem.getAttribute("href");
			},
			type : function(elem) {
				return elem.getAttribute("type");
			}
		},

		relative : {
			"+" : function(checkSet, part) {
				var isPartStr = typeof part === "string", isTag = isPartStr && !rNonWord.test(part), isPartStrNotTag = isPartStr && !isTag;

				if(isTag) {
					part = part.toLowerCase();
				}

				for(var i = 0, l = checkSet.length, elem; i < l; i++) {
					if(( elem = checkSet[i])) {
						while(( elem = elem.previousSibling) && elem.nodeType !== 1) {
						}

						checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
					}
				}

				if(isPartStrNotTag) {
					fastDev.Query.filter(part, checkSet, true);
				}
			},

			">" : function(checkSet, part) {
				var elem, isPartStr = typeof part === "string", i = 0, l = checkSet.length;

				if(isPartStr && !rNonWord.test(part)) {
					part = part.toLowerCase();

					for(; i < l; i++) {
						elem = checkSet[i];

						if(elem) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
						}
					}

				} else {
					for(; i < l; i++) {
						elem = checkSet[i];

						if(elem) {
							checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
						}
					}

					if(isPartStr) {
						fastDev.Query.filter(part, checkSet, true);
					}
				}
			},

			"" : function(checkSet, part, isXML) {
				var nodeCheck, doneName = done++, checkFn = dirCheck;

				if( typeof part === "string" && !rNonWord.test(part)) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
			},

			"~" : function(checkSet, part, isXML) {
				var nodeCheck, doneName = done++, checkFn = dirCheck;

				if( typeof part === "string" && !rNonWord.test(part)) {
					part = part.toLowerCase();
					nodeCheck = part;
					checkFn = dirNodeCheck;
				}

				checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
			}
		},

		find : {
			ID : function(match, context, isXML) {
				if(!context.getElementById) {
					context = context.ownerDocument;
				}

				if( typeof context.getElementById !== "undefined" && !isXML) {
					var m = context.getElementById(match[1]);
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			},

			NAME : function(match, context) {
				if( typeof context.getElementsByName !== "undefined") {
					var ret = [], results = context.getElementsByName(match[1]);

					for(var i = 0, l = results.length; i < l; i++) {
						if(results[i].getAttribute("name") === match[1]) {
							ret.push(results[i]);
						}
					}

					return ret.length === 0 ? null : ret;
				}
			},

			TAG : function(match, context) {
				if( typeof context.getElementsByTagName !== "undefined") {
					return context.getElementsByTagName(match[1]);
				}
			}
		},
		preFilter : {
			CLASS : function(match, curLoop, inplace, result, not, isXML) {
				match = " " + match[1].replace(rBackslash, "") + " ";

				if(isXML) {
					return match;
				}

				for(var i = 0, elem; ( elem = curLoop[i]); i++) {
					if(elem) {
						if(not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
							if(!inplace) {
								result.push(elem);
							}

						} else if(inplace) {
							curLoop[i] = false;
						}
					}
				}

				return false;
			},

			ID : function(match) {
				return match[1].replace(rBackslash, "");
			},

			TAG : function(match, curLoop) {
				return match[1].replace(rBackslash, "").toLowerCase();
			},

			CHILD : function(match) {
				if(match[1] === "nth") {
					if(!match[2]) {
						//Sizzle.error(match[0]);
						//exception
					}

					match[2] = match[2].replace(/^\+|\s*/g, '');

					var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

					// calculate the numbers (first)n+(last) including if they are negative
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				} else if(match[2]) {
					//Sizzle.error(match[0]);
					// exception
				}

				match[0] = done++;

				return match;
			},

			ATTR : function(match, curLoop, inplace, result, not, isXML) {
				var name = match[1] = match[1].replace(rBackslash, "");

				if(!isXML && Expr.attrMap[name]) {
					match[1] = Expr.attrMap[name];
				}

				// Handle if an un-quoted value was used
				match[4] = (match[4] || match[5] || "" ).replace(rBackslash, "");

				if(match[2] === "~=") {
					match[4] = " " + match[4] + " ";
				}

				return match;
			},

			PSEUDO : function(match, curLoop, inplace, result, not) {
				if(match[1] === "not") {
					// If we're dealing with a complex expression, or a simple one
					if((chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3])) {
						match[3] = fastDev.Query.find(match[3], null, null, curLoop);

					} else {
						var ret = fastDev.Query.filter(match[3], curLoop, inplace, true ^ not);

						if(!inplace) {
							result.push.apply(result, ret);
						}

						return false;
					}

				} else if(Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
					return true;
				}

				return match;
			},

			POS : function(match) {
				match.unshift(true);

				return match;
			}
		},

		filters : {
			enabled : function(elem) {
				return elem.disabled === false && elem.type !== "hidden";
			},

			disabled : function(elem) {
				return elem.disabled === true;
			},

			checked : function(elem) {
				return elem.checked === true;
			},

			selected : function(elem) {
				// if(elem.parentNode) {
				// elem.parentNode.selectedIndex;
				// }

				return elem.selected === true;
			},

			parent : function(elem) {
				return !!elem.firstChild;
			},

			empty : function(elem) {
				return !elem.firstChild;
			},

			has : function(elem, i, match) {
				return !!fastDev.Query.find(match[3], elem).length;
			},

			header : function(elem) {
				return (/h\d/i).test(elem.nodeName);
			},

			text : function(elem) {
				var attr = elem.getAttribute("type"), type = elem.type;
				return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null );
			},

			radio : function(elem) {
				return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
			},

			checkbox : function(elem) {
				return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
			},

			file : function(elem) {
				return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
			},

			password : function(elem) {
				return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
			},

			submit : function(elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "submit" === elem.type;
			},

			image : function(elem) {
				return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
			},

			reset : function(elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && "reset" === elem.type;
			},

			button : function(elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && "button" === elem.type || name === "button";
			},

			input : function(elem) {
				return (/input|select|textarea|button/i).test(elem.nodeName);
			},

			focus : function(elem) {
				return elem === elem.ownerDocument.activeElement;
			},
			hidden : function(elem) {
				var width = elem.offsetWidth, height = elem.offsetHeight;
				return (width === 0 && height === 0 ) || (!fastDev.Support.reliableHiddenOffsets && ((elem.style && elem.style.display) || fastDev.Dom.css(elem, "display")) === "none");
			},
			visible : function(elem) {
				return !Expr.filters.hidden(elem);
			}
		},
		setFilters : {
			first : function(elem, i) {
				return i === 0;
			},

			last : function(elem, i, match, array) {
				return i === array.length - 1;
			},

			even : function(elem, i) {
				return i % 2 === 0;
			},

			odd : function(elem, i) {
				return i % 2 === 1;
			},

			lt : function(elem, i, match) {
				return i < match[3] - 0;
			},

			gt : function(elem, i, match) {
				return i > match[3] - 0;
			},

			nth : function(elem, i, match) {
				return match[3] - 0 === i;
			},

			eq : function(elem, i, match) {
				return match[3] - 0 === i;
			}
		},
		filter : {
			PSEUDO : function(elem, match, i, array) {
				var name = match[1], filter = Expr.filters[name];

				if(filter) {
					return filter(elem, i, match, array);

				} else if(name === "contains") {
					return (elem.textContent || elem.innerText || fastDev.Dom.getText(elem) || "").indexOf(match[3]) >= 0;

				} else if(name === "not") {
					var not = match[3];

					for(var j = 0, l = not.length; j < l; j++) {
						if(not[j] === elem) {
							return false;
						}
					}

					return true;

				} else {
					//Sizzle.error(name);
					//exception
				}
			},

			CHILD : function(elem, match) {
				var first, last, doneName, parent, cache, count, diff, type = match[1], node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while(( node = node.previousSibling)) {
							if(node.nodeType === 1) {
								return false;
							}
						}

						//if(type === "first") {
						return true;
					//}

					//node = elem;

					case "last":
						while(( node = node.nextSibling)) {
							if(node.nodeType === 1) {
								return false;
							}
						}

						return true;

					case "nth":
						first = match[2];
						last = match[3];

						if(first === 1 && last === 0) {
							return true;
						}

						doneName = match[0];
						parent = elem.parentNode;

						if(parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
							count = 0;

							for( node = parent.firstChild; node; node = node.nextSibling) {
								if(node.nodeType === 1) {
									node.nodeIndex = ++count;
								}
							}

							parent[expando] = doneName;
						}

						diff = elem.nodeIndex - last;

						if(first === 0) {
							return diff === 0;

						} else {
							return (diff % first === 0 && diff / first >= 0 );
						}
				}
			},

			ID : function(elem, match) {
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},

			TAG : function(elem, match) {
				return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
			},

			CLASS : function(elem, match) {
				return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
			},

			ATTR : function(elem, match) {
				var name = match[1], result = fastDev.Dom.attr ? fastDev.Dom.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[ name ](elem) : fastDev.isValid(elem[name]) ? elem[name] : elem.getAttribute(name), value = result ? "" + result : result, type = match[2], check = match[4];
				result = !fastDev.isValid(result) ? result : result + "";

				return !fastDev.isValid(result) ? type === "!=" : !type && fastDev.Dom.attr ? fastDev.isValid(result) : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
			},

			POS : function(elem, match, i, array) {
				var name = match[2], filter = Expr.setFilters[name];

				if(filter) {
					return filter(elem, i, match, array);
				}
			}
		}
	};

	var fescape = function(all, num) {
		return "\\" + (num - 0 + 1);
	};
	for(var type in Expr.match ) {
		Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
		Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
	}
	var sortOrder, siblingCheck;

	if(document.documentElement.compareDocumentPosition) {
		sortOrder = function(a, b) {
			if(a === b) {
				hasDuplicate = true;
				return 0;
			}

			if(!a.compareDocumentPosition || !b.compareDocumentPosition) {
				return a.compareDocumentPosition ? -1 : 1;
			}

			return a.compareDocumentPosition(b) & 4 ? -1 : 1;
		};

	} else {
		sortOrder = function(a, b) {
			if(a === b) {
				hasDuplicate = true;
				return 0;

			} else if(a.sourceIndex && b.sourceIndex) {
				return a.sourceIndex - b.sourceIndex;
			}

			var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;

			if(aup === bup) {
				return siblingCheck(a, b);

			} else if(!aup) {
				return -1;

			} else if(!bup) {
				return 1;
			}

			while(cur) {
				ap.unshift(cur);
				cur = cur.parentNode;
			}

			cur = bup;

			while(cur) {
				bp.unshift(cur);
				cur = cur.parentNode;
			}

			al = ap.length;
			bl = bp.length;

			for(var i = 0; i < al && i < bl; i++) {
				if(ap[i] !== bp[i]) {
					return siblingCheck(ap[i], bp[i]);
				}
			}

			return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
		};

		siblingCheck = function(a, b, ret) {
			if(a === b) {
				return ret;
			}

			var cur = a.nextSibling;

			while(cur) {
				if(cur === b) {
					return -1;
				}

				cur = cur.nextSibling;
			}

			return 1;
		};
	}
	function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
		for(var i = 0, l = checkSet.length; i < l; i++) {
			var elem = checkSet[i];

			if(elem) {
				var match = false;

				elem = elem[dir];

				while(elem) {
					if(elem[this.expando] === doneName) {
						match = checkSet[elem.sizset];
						break;
					}

					if(elem.nodeType === 1) {
						if(!isXML) {
							elem[this.expando] = doneName;
							elem.sizset = i;
						}

						if( typeof cur !== "string") {
							if(elem === cur) {
								match = true;
								break;
							}

						} else if(fastDev.Query.filter(cur, [elem]).length > 0) {
							match = elem;
							break;
						}
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
		for(var i = 0, l = checkSet.length; i < l; i++) {
			var elem = checkSet[i];

			if(elem) {
				var match = false;

				elem = elem[dir];

				while(elem) {
					if(elem[expando] === doneName) {
						match = checkSet[elem.sizset];
						break;
					}

					if(elem.nodeType === 1 && !isXML) {
						elem[expando] = doneName;
						elem.sizset = i;
					}

					if(elem.nodeName.toLowerCase() === cur) {
						match = elem;
						break;
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	/**
	 * @class fastDev.Query
	 */

	fastDev.Query = {
		/**
		 * Dom检索方法
		 * @param {String} selector 查询条件
		 * @param {Array{Element}/Element} [context=document] 查询范围
		 * @param {Array} elems 追加元素
		 * @return {Array{Element}}
		 */
		find : function(selector, context, elems) {
			elems = elems || [];

			if(!fastDev.isArray(context)) {
				context = [context];
			}
			var execFind = document.querySelectorAll ? this.sysFind : this.extFind;
			try {
				for(var i = 0, len = context.length; i < len; i++) {
					execFind.call(this, selector, context[i], elems);
				}
				return elems;
			} catch(e) {
				fastDev.addError("Query", "find", "查询条件描述错误：" + selector.replace(/</g, "&lt;"));
			}

		},
		quickFind : function(expr, context, isXML) {
			var set, i, len, match, type, left;

			if(!expr) {
				return [];
			}

			for( i = 0, len = Expr.order.length; i < len; i++) {
				type = Expr.order[i];

				if(( match = Expr.leftMatch[type].exec(expr))) {
					left = match[1];
					match.splice(1, 1);

					if(left.substr(left.length - 1) !== "\\") {
						match[1] = (match[1] || "").replace(rBackslash, "");
						set = Expr.find[ type ](match, context, isXML);

						if(fastDev.isValid(set)) {
							expr = expr.replace(Expr.match[type], "");
							break;
						}
					}
				}
			}

			if(!set) {
				set = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName("*") : [];
			}

			return {
				set : set,
				expr : expr
			};
		},
		sysFind : function(selector, context, elems, seed) {
			context = context || document;

			if(!seed && !this.isXML(context)) {
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(selector);

				if(match && (context.nodeType === 1 || context.nodeType === 9)) {
					// 调用系统自带查询标签方法
					if(match[1]) {
						return this.resultSetProcess(context.getElementsByTagName(selector), elems);
						//调用系统自带查询样式类方法
					} else if(match[2] && context.getElementsByClassName) {
						return this.resultSetProcess(context.getElementsByClassName(match[2]), elems);
					}
				}

				if(context.nodeType === 9) {
					// 如果是查询body元素，则直接返回不做查找
					if(selector === "body" && context.body) {
						return this.resultSetProcess([context.body], elems);
						//调用系统自带查询ID方法
					} else if(match && match[3]) {
						var elem = context.getElementById(match[3]);

						if(elem && elem.parentNode) {
							if(elem.id === match[3]) {
								return this.resultSetProcess([elem], elems);
							}

						}
					}

					try {
						return this.resultSetProcess(context.querySelectorAll(selector), elems);
					} catch(e) {
					}

				} else if(context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
					// 当context为普通Element元素时，查询会被扩散到整个页面
					// 这种情况下为context增加ID，并将ID并入查询条件以做缩减查询范围使用
					var oldContext = context, old = context.getAttribute("id"), nid = old || "__sizzle__", hasParent = context.parentNode, relativeHierarchySelector = /^\s*[+~]/.test(selector);

					if(!old) {
						context.setAttribute("id", nid);
					} else {
						nid = nid.replace(/'/g, "\\$&");
					}
					if(relativeHierarchySelector && hasParent) {
						context = context.parentNode;
					}

					try {
						if(!relativeHierarchySelector || hasParent) {
							return this.resultSetProcess(context.querySelectorAll("[id='" + nid + "'] " + selector), elems);
						}

					} catch(e) {
					} finally {
						if(!old) {
							oldContext.removeAttribute("id");
						}
					}
				}
			}

			return this.extFind(selector, context, elems, seed);
		},
		extFind : function(selector, context, elems, seed) {
			context = context || document;

			var origContext = context;

			if(context.nodeType !== 1 && context.nodeType !== 9) {
				return [];
			}

			if(!selector || typeof selector !== "string") {
				return elems;
			}

			var m, set, checkSet, extra, ret, cur, pop, i, prune = true, isXML = this.isXML(context), parts = [], soFar = selector;

			// Reset the position of the chunker regexp (start from head)
			do {
				chunker.exec("");
				m = chunker.exec(soFar);

				if(m) {
					soFar = m[3];

					parts.push(m[1]);

					if(m[2]) {
						extra = m[3];
						break;
					}
				}
			} while ( m );

			if(parts.length > 1 && Expr.match.POS.exec(selector)) {

				if(parts.length === 2 && Expr.relative[parts[0]]) {
					set = this.posProcess(parts[0] + parts[1], context, seed);

				} else {
					set = Expr.relative[parts[0]] ? [context] : this.find(parts.shift(), context);

					while(parts.length) {
						selector = parts.shift();

						if(Expr.relative[selector]) {
							selector += parts.shift();
						}

						set = this.posProcess(selector, set, seed);
					}
				}

			} else {
				if(!seed && parts.length > 1 && context.nodeType === 9 && !isXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {

					ret = this.quickFind(parts.shift(), context, isXML);
					context = ret.expr ? this.filter( ret.expr, ret.set )[0] : ret.set[0];
				}

				if(context) {
					ret = seed ? {
						expr : parts.pop(),
						set : seed
					} : this.quickFind(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, isXML);

					set = ret.expr ? this.filter(ret.expr, ret.set) : ret.set;

					if(parts.length > 0) {
						checkSet = set;

					} else {
						prune = false;
					}

					while(parts.length) {
						cur = parts.pop();
						pop = cur;

						if(!Expr.relative[cur]) {
							cur = "";
						} else {
							pop = parts.pop();
						}

						if(!fastDev.isValid(pop)) {
							pop = context;
						}
						checkSet = this.resultSetProcess(checkSet);
						Expr.relative[ cur ](checkSet, pop, isXML);
					}

				} else {
					checkSet = parts = [];
				}
			}

			if(!checkSet) {
				checkSet = set;
			}

			if(!checkSet) {
				//Sizzle.error(cur || selector);
				//exception
			}

			if(toString.call(checkSet) === "[object Array]") {
				if(!prune) {
					elems.push.apply(elems, checkSet);

				} else if(context && context.nodeType === 1) {
					for( i = 0; fastDev.isValid(checkSet[i]); i++) {
						if(checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && fastDev.Dom.contains(context, checkSet[i]))) {
							elems.push(set[i]);
						}
					}

				} else {
					for( i = 0; fastDev.isValid(checkSet[i]); i++) {
						if(checkSet[i] && checkSet[i].nodeType === 1) {
							elems.push(set[i]);
						}
					}
				}

			} else {
				this.resultSetProcess(checkSet, elems);
			}

			if(extra) {
				this.find(extra, origContext, elems, seed);
				this.uniqueSort(elems);
			}

			return elems;

		},
		isXML : function(context) {
			var documentElement = ( context ? context.ownerDocument || context : 0).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		},
		uniqueSort : function(results) {
			if(sortOrder) {
				hasDuplicate = baseHasDuplicate;
				results.sort(sortOrder);

				if(hasDuplicate) {
					for(var i = 1; i < results.length; i++) {
						if(results[i] === results[i - 1]) {
							results.splice(i--, 1);
						}
					}
				}
			}

			return results;
		},
		resultSetProcess : function(array, result) {

			if(!result && fastDev.isArray(array)) {
				return array.slice(0);
			}

			var ret = result || [];
			for(var i = 0, len = array.length; i < len; i++) {
				ret.push(array[i]);
			}
			return ret;
		},
		posProcess : function(selector, context, seed) {
			var match, tmpSet = [], later = "", root = context.nodeType ? [context] : context;

			// Position selectors must be done after the filter
			// And so must :not(positional) so we move all PSEUDOs to the end
			while(( match = Expr.match.PSEUDO.exec(selector))) {
				later += match[0];
				selector = selector.replace(Expr.match.PSEUDO, "");
			}

			selector = Expr.relative[selector] ? selector + "*" : selector;

			for(var i = 0, l = root.length; i < l; i++) {
				this.find(selector, root[i], tmpSet, seed);
			}

			return this.filter(later, tmpSet);
		},
		filter : function(expr, set, inplace, not) {
			var match, anyFound, type, found, item, filter, left, i, pass, old = expr, result = [], curLoop = set, isXMLFilter = set && set[0] && this.isXML(set[0]);

			while(expr && set.length) {
				for(type in Expr.filter ) {
					if(( match = Expr.leftMatch[type].exec(expr)) && match[2]) {
						filter = Expr.filter[type];
						left = match[1];

						anyFound = false;

						match.splice(1, 1);

						if(left.substr(left.length - 1) === "\\") {
							continue;
						}

						if(curLoop === result) {
							result = [];
						}

						if(Expr.preFilter[type]) {
							match = Expr.preFilter[ type ](match, curLoop, inplace, result, not, isXMLFilter);

							if(!match) {
								anyFound = found = true;

							} else if(match === true) {
								continue;
							}
						}

						if(match) {
							for( i = 0; ( item = curLoop[i]); i++) {
								if(item) {
									found = filter(item, match, i, curLoop);
									pass = not ^ found;

									if(inplace && fastDev.isValid(found)) {
										if(pass) {
											anyFound = true;

										} else {
											curLoop[i] = false;
										}

									} else if(pass) {
										result.push(item);
										anyFound = true;
									}
								}
							}
						}

						if(found !== undefined) {
							if(!inplace) {
								curLoop = result;
							}

							expr = expr.replace(Expr.match[type], "");

							if(!anyFound) {
								return [];
							}

							break;
						}
					}
				}

				if(expr === old) {
					if(!fastDev.isValid(anyFound)) {
						fastDev.addError("Query", "filter", "表达式描述错误：" + expr);
					} else {
						break;
					}
				}

				old = expr;
			}

			return curLoop;
		}
	};
})();


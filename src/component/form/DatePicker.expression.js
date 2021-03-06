// 日期范围表达式功能扩展
fastDev.apply(fastDev.Ui.DatePicker, {
	/*
	 * 解析cron日期表达式配置
	 * @private
	 */
	parseCronExpression : function() {
		var that = this, options = that._options, global = that._global, fn = fastDev.Util.StringUtil.trim;
		fastDev.each(["includes", "excludes"], function(i, name) {
			var array = [];
			if ( typeof options[name] === "string") {
				options[name] = fn(options[name]);
				array.push(that.cronParser.parse(options[name], true)
				.schedules[0]);
			} else if (fastDev.isArray(options[name])) {
				fastDev.each(options[name], function(i, val) {
					array.push(that.cronParser.parse(fn(val), true)
					.schedules[0]);
				});
			}
			global[name] = array;
		});
		// 根据表达式解析结果重新限定最大与最小日期
		that.mergeExtremum();
	},
	/*
	 * 根据表达式查找且合并日期极值点
	 * @private
	 */
	mergeExtremum : function() {
		var that = this, global = that._global, includes = global.includes, maxYear = 0, maxMonth = -1000, minYear = 999999, minMonth = 999999, length;
		fastDev.each(includes, function(i, include) {
			if (include.Y) {
				length = include.Y.length;
				if (maxYear < include.Y[length - 1]) {
					maxYear = include.Y[length - 1];
				}
				if (minYear > include.Y[0]) {
					minYear = include.Y[0];
				}
			}
			if (include.M) {
				length = include.M.length;
				if (maxMonth < include.M[length - 1]) {
					maxMonth = include.M[length - 1];
				}
				if (minMonth > include.M[0]) {
					minMonth = include.M[0];
				}
			}
		});
		if (maxYear !== 0 && global.maxYear > maxYear) {
			global.maxYear = maxYear;
		}
		if (maxMonth !== -1000 && global.maxMonth > maxMonth - 1) {
			global.maxMonth = maxMonth - 1;
		}
		if (minYear !== 999999 && global.minYear < minYear) {
			global.minYear = minYear;
		}
		if (minMonth !== 999999 && global.minMonth < minMonth - 1) {
			global.minMonth = minMonth - 1;
		}
		if (global.maxYear === global.maxDate.getFullYear() && global.minYear === global.minDate.getFullYear()) {
			return;
		}
		fastDev.each(["max", "min"], function(i, n) {
			var inc = i ? 1 : -1, left = global[n + "Year"], right = global[( i ? "max" : "min") + "Year"], cur = {}, d, D;
			for (var Y = left; Y * inc <= right * inc; Y += inc) {
				if (!that.isDisabled(Y)) {
					cur.Y = Y;
					for (var M = i ? 0 : 11, m = i ? 11 : 0; M * inc <= m * inc; M += inc) {
						if (!that.isDisabled(Y, M)) {
							cur.M = M;
							d = new Date(Y, M + 1, 0).getDate();
							for ( D = i ? 1 : d, d = i ? d : 1; D * inc <= d * inc; D += inc) {
								if (!that.isDisabled(Y, M, D)) {
									cur.D = D;
									break;
								}
							}
							if (cur.D) {
								break;
							}
						}
					}
					if (cur.M !== undefined && cur.D) {
						break;
					}
				}
			}
			if (cur.Y) {
				global[n + "Year"] = cur.Y;
			}
			if (cur.M !== undefined) {
				global[n + "Month"] = cur.M;
			}
			if (cur.D !== undefined) {
				global[n + "Day"] = cur.D;
			}
		});
	},
	/*
	 * cron日期表达式解析器
	 * @return {Object}
	 * @private
	 */
	cronParser : (function() {
		// 常量配置
		var NAMES = {
			JAN : 1,
			// 一月
			FEB : 2,
			// 二月
			MAR : 3,
			// 三月
			APR : 4,
			// 四月
			MAY : 5,
			// 五月
			JUN : 6,
			// 六月
			JUL : 7,
			// 七月
			AUG : 8,
			// 八月
			SEP : 9,
			// 九月
			OCT : 10,
			// 十月
			NOV : 11,
			// 十一月
			DEC : 12,
			// 十二月
			SUN : 1,
			// 星期日
			MON : 2,
			// 星期一
			TUE : 3,
			// 星期二
			WED : 4,
			// 星期三
			THU : 5,
			// 星期四
			FRI : 6,
			// 星期五
			SAT : 7 // 星期六
		};
		// 表达式各子域参数范围配置
		//[子域位序,最小值,最大值]
		var FIELDS = {
			s : [0, 0, 59],
			// 秒
			m : [1, 0, 59],
			// 分钟
			h : [2, 0, 23],
			// 小时
			D : [3, 1, 31],
			// 日
			M : [4, 1, 12],
			// 月
			Y : [6, 1970, 2099],
			// 年
			d : [5, 1, 7] // 星期
		};
		// 取常量值或者计算偏移量的值
		var getValue = function(value, offset) {
			return isNaN(value) ? NAMES[value] : +value + (offset || 0);
		};
		// 克隆一份计划表
		var cloneSchedule = function(sched) {
			var clone = {}, field;
			for (field in sched) {
				if (field !== 'dc' && field !== 'd') {
					clone[field] = sched[field].slice(0);
				}
			}
			return clone;
		};
		// 按给定的增量获取指定范围内的值
		var add = function(sched, name, min, max, inc) {
			var i = min;
			if (!sched[name]) {
				// 新的有效子域
				sched[name] = [];
				// 域长+1
				sched.length += 1;
			}
			while (i <= max) {
				// 添加范围内的值
				if ((sched[name] + "").indexOf(i) < 0) {
					sched[name].push(i);
				}
				i += inc || 1;
			}
			sched[name].sort(itemSorter);
		};
		// 添加月中周哈希值（如：6#3，表示月中第三个周的星期五，哈希值即为3）
		var addHash = function(schedules, curSched, value, hash) {
			if ((curSched.d && !curSched.dc) || (curSched.dc && (curSched.dc + "").indexOf(hash) < 0)) {
				schedules.push(cloneSchedule(curSched));
				curSched = schedules[schedules.length - 1];
			}
			// d表示周内星期几
			// dc表示第几周，0表示最后一周
			add(curSched, 'd', value, value);
			add(curSched, 'dc', hash, hash);
		};
		// 添加离指定日子最近的工作日
		var addWeekday = function(s, curSched, value) {
			if (value === 1) {
				// D表示日
				// 当前日为星期日，则最近工作日取星期周一和周五
				add(curSched, 'D', 1, 3);
				add(curSched, 'd', NAMES.MON, NAMES.FRI);
			} else {
				// 取离最近的左右值
				add(curSched, 'D', value - 1, value + 1);
				add(curSched, 'd', NAMES.MON, NAMES.FRI);
			}
		};
		// 添加包含范围的值
		var addRange = function(item, curSched, name, min, max, offset) {
			var incSplit = item.split('/'), inc = +incSplit[1], range = incSplit[0], value;
			if (range !== '*' && range !== '0') {
				var rangeSplit = range.split('-');
				min = getValue(( value = rangeSplit[0]) ? value : min, offset);
				max = getValue(( value = rangeSplit[1]) ? value : max, offset);
			}
			add(curSched, name, min, max, inc);
		};
		// 解析表达式子域
		var parse = function(item, s, name, min, max, offset) {
			var value, split, schedules = s.schedules, curSched = schedules[schedules.length - 1];
			// 月份的最后一天(L)
			if (item === 'L') {
				item = min - 1;
			}
			// 单一值(x)
			if (( value = getValue(item, offset)) !== undefined) {
				add(curSched, name, value, value);
			}
			// 离给定日子最近的工作日，仅能应用于"日"域上(xW)
			else if (( value = getValue(item.replace('W', ''), offset)) !== undefined) {
				addWeekday(s, curSched, value);
			}
			// 月中最后一个星期几，仅能应用于"星期"域上(xL)
			else if (( value = getValue(item.replace('L', ''), offset)) !== undefined) {
				addHash(schedules, curSched, value, min - 1);
			}
			// 位于月中第几周的星期几，仅能应用于"星期"域上(x#y)
			else if (( split = item.split('#')).length === 2) {
				value = getValue(split[0], offset);
				addHash(schedules, curSched, value, getValue(split[1]));
			}
			// 范围值(x-y or x-y/z or */z or 0/z)
			else {
				addRange(item, curSched, name, min, max, offset);
			}
		};
		// 判断是否是哈希值指定
		var isHash = function(item) {
			return typeof item === "string" && (item.indexOf('#') > -1 || item.indexOf('L') > 0);
		};
		// 对散列值声明进行排序
		var itemSorter = function(a, b) {
			return isHash(a) && !isHash(b) ? 1 : (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0);
		};
		// 解析表达式
		var parseExpr = function(expr) {
			var schedule = {
				schedules : [{}]
			}, components = fastDev.Util.StringUtil.trim(expr).replace(/\t/g, ' ').split(/\s+/), field, f, component, items;
			// 允许不声明秒分时域，缺少的自动补齐
			if (components.length === 3 || components.length === 4) {
				components = ["?", "?", "?"].concat(components);
			}
			// 初始域长度
			schedule.schedules[0].length = 0;
			for (field in FIELDS) {
				// 取得表达式相应位序上的子表达式域
				f = FIELDS[field];
				component = components[f[0]];
				// "*"通配符以及"?"未定值则不处理
				if (component && component !== '*' && component !== '?') {
					// 对散列值进行排序
					items = component.split(',').sort(itemSorter);
					var i, length = items.length;
					for ( i = 0; i < length; i++) {
						// 解析子表达式
						parse(items[i], schedule, field, f[1], f[2], f[3]);
					}
				}
			}
			return schedule;
		};
		return {
			/*
			 * cron表达式解析接口
			 * @param {String} expr: 需解析的cron表达式
			 * @param {Bool} hasSeconds: 表达式是否使用了"秒"子表达式
			 */
			parse : function(expr, hasSeconds) {
				// 星期与月份非数字符号值不区分大小写
				var e = expr.toUpperCase();
				return parseExpr( hasSeconds ? e : '0 ' + e);
			}
		};
	})(),
	/*
	 * 执行表达式匹配
	 * @param {Object} time 日期时间
	 * @private
	 */
	match : function(time) {
		var that = this, global = this._global, includes = global.includes, excludes = global.excludes, disabled = false;
		// 先判断排除
		fastDev.each(excludes || [], function(i, exclude) {
			if (that.contains(exclude, time, true)) {
				return !( disabled = true);
			}
		});
		// 再判断包含
		if (!disabled) {
			fastDev.each(includes || [], function(i, include) {
				// 如果含include声明，则拟定待判断值是需要disabled的
				disabled = true;
				if (that.contains(include, time)) {
					return disabled = false;
				}
			});
		}
		return disabled;
	},
	/*
	 * 设置并刷新Cron日期表达式
	 * 请注意，若要重设includes与excludes属性，请一并设置，不要通过调用2次该方法来分开设置。
	 * 重设表达式后，会重新解析并刷新最大与最小日期值。
	 * 若只指定一个参数，则另外一个参数对应的表达式其历史属性值仍然会保持有效状态，并不会被自动清除。
	 * @param {String|Array} includes 可选日期表达式
	 * @param {String|Array} excludes 禁选日期表达式
	 * @return {fastDev.Ui.DatePicker} 本控件实例
	 */
	setExpressions : function(includes, excludes) {
		var options = this._options;
		if (includes !== undefined) {
			options.includes = includes;
		}
		if (excludes !== undefined) {
			options.excludes = excludes;
		}
		this.parseCronExpression();
		return this;
	},
	/*
	 * 移除并刷新Cron日期表达式
	 * 移除表达式后，会重新解析现有表达式
	 * @param {Boolean} includes 是否移除可选日期表达式
	 * @param {Boolean} excludes 是否移除禁选日期表达式
	 * @return {fastDev.Ui.DatePicker} 本控件实例
	 */
	removeExpressions : function(includes, excludes) {
		var options = this._options, global = this._global;
		if (includes !== undefined) {
			options.includes = global.includes = [];
		}
		if (excludes !== undefined) {
			options.excludes = global.excludes = [];
		}
		this.setMinDate(options.minDate);
		this.setMaxDate(options.maxDate);
		return this;
	},
	/*
	 * 判断表达式所指日期是否包含指定的日期值
	 * @param {Object} items 已解析的表达式项
	 * @param {Object} item 需验证的日期对象（POJO）
	 * @param {Boolean} exclude 是否是exclude表达式判断
	 * @return {Boolean}
	 * @private
	 */
	contains : function(items, item, exclude) {
		var that = this, Y = item.year, M = item.month, D = item.date, h = item.hours, m = item.minutes, s = item.seconds, isExcluded,
		// 需匹配的域个数
		length = items.length,
		// 初始限制
		yearLimit = true, monthLimit = true, dateLimit = true, dayLimit = true, weekLimit = true, hoursLimit = true, minutesLimit = true, secondsLimit = true;
		// 判断开始
		fastDev.each(["Y", "M", "D", "d", "dc", "h", "m", "s"], function(i, name) {
			switch (name) {
				// 年
				case "Y":
					if (items[name] === undefined) {
						if (exclude && length === 0) {
							// 排除操作，则检查是否还有其他域限制
							// 不含子域声明，则确定需排除
							return !( isExcluded = true);
						}
						// 匹配所有年份，继续往下判断
						yearLimit = false;
					} else {
						length -= 1;
						// 年份匹配
						if (that.inArray(items[name], Y)) {
							if (exclude && length === 0) {
								// 已确定需排除该年份值
								isExcluded = true;
							}
							// 匹配成功则解除受限，然后继续匹配下一个域
							yearLimit = false;
						}
					}
					if (exclude) {
						if (isExcluded) {
							// 确定排除了则跳出
							return false;
						}
						if (M === undefined && length !== 0) {
							// 匹配结束
							return false;
						}
						// 匹配下一个子域
						break;
					}
					if (yearLimit) {
						// 未匹配到年份，则终止匹配
						return false;
					}
					if (M === undefined || length === 0) {
						// 匹配结束
						return monthLimit = dateLimit = dayLimit = weekLimit = hoursLimit = minutesLimit = secondsLimit = false;
					}
					break;
				// 月
				case "M":
					if (items[name] === undefined) {
						// 匹配所有月份，继续往下判断
						monthLimit = false;
					} else {
						length -= 1;
						if (that.inArray(items[name], M + 1)) {
							if (exclude && length === 0 && !yearLimit) {
								// 此时已确定需要排除掉该月份
								isExcluded = true;
							}
							monthLimit = false;
						}
					}
					if (exclude) {
						if (isExcluded) {
							// 确定要排除掉，则跳出
							return false;
						}
						if (D === undefined && length !== 0) {
							return false;
						}
						// 月份域未匹配成功，则继续匹配下一个子表达式
						break;
					}
					if (monthLimit) {
						// 未匹配到月份，则终止匹配
						return false;
					}
					if (D === undefined || length === 0) {
						// 匹配结束
						return dateLimit = dayLimit = weekLimit = hoursLimit = minutesLimit = secondsLimit = false;
					}
					break;
				// 日
				case "D":
					if (items[name] === undefined) {
						// 匹配所有日，继续往下匹配
						dateLimit = false;
					} else {
						length -= 1;
						if (items[name][0] === 0) {
							dateLimit = new Date(Y, M + 1, 0).getDate() !== D;
							if (exclude && !dateLimit && !yearLimit && !monthLimit && length === 0) {
								isExcluded = true;
							}
						} else if (that.inArray(items[name], D)) {
							if (exclude && length === 0 && !yearLimit && !monthLimit) {
								// 确定要排除掉该日子
								isExcluded = true;
							}
							dateLimit = false;
						}
					}
					if (exclude) {
						if (isExcluded) {
							return false;
						}
						break;
					}
					if (dateLimit) {
						return false;
					}
					if (length === 0) {
						return dayLimit = weekLimit = hoursLimit = minutesLimit = secondsLimit = false;
					}
					break;
				// 周
				case "d":
					if (items[name] !== undefined) {
						length -= 1;
						if (that.inArray(items[name], new Date(Y, M, D).getDay() + 1)) {
							if (exclude && length === 0 && !yearLimit && !monthLimit && !dateLimit) {
								isExcluded = true;
							}
							dayLimit = false;
						}
					} else {
						dayLimit = false;
					}
					if (exclude) {
						if (isExcluded) {
							return false;
						}
						break;
					}
					if (dayLimit) {
						return false;
					}
					if (length === 0) {
						return weekLimit = hoursLimit = minutesLimit = secondsLimit = false;
					}
					break;
				// 周数，0表示月份最后一周
				case "dc":
					if (items[name] !== undefined) {
						length -= 1;
						// 当前日所在周数限制
						if (Math.floor((D - 1) / 7) + 1 === items[name][0]) {
							if (exclude && length === 0 && !yearLimit && !monthLimit && !dateLimit && !dayLimit) {
								isExcluded = true;
							}
							weekLimit = false;
						} else if (items[name][0] === 0) {
							// 判断是否是在最后一周
							weekLimit = D <= new Date(Y, M + 1, 0).getDate() - 7;
							if (exclude && !weekLimit && length === 0 && !yearLimit && !monthLimit && !dateLimit && !dayLimit) {
								isExcluded = true;
							}
						}
					} else {
						weekLimit = false;
					}
					if (exclude) {
						if (isExcluded) {
							return false;
						}
						if (h === undefined && length !== 0) {
							return false;
						}
						break;
					}
					if (weekLimit) {
						return false;
					}
					if (h === undefined || length === 0) {
						return hoursLimit = minutesLimit = secondsLimit = false;
					}
					break;
				// 小时
				case "h":
					if (items[name] === undefined) {
						hoursLimit = false;
					} else {
						length -= 1;
						if (that.inArray(items[name], h)) {
							if (exclude && length === 0 && !yearLimit && !monthLimit && !dateLimit && !dayLimit && !weekLimit) {
								isExcluded = true;
							}
							hoursLimit = false;
						}
					}
					if (exclude) {
						if (isExcluded) {
							return false;
						}
						if (m === undefined && length !== 0) {
							return false;
						}
						break;
					}
					if (hoursLimit) {
						return false;
					}
					if (m === undefined || length === 0) {
						return minutesLimit = secondsLimit = false;
					}
					break;
				// 分
				case "m":
					if (items[name] === undefined) {
						minutesLimit = false;
					} else {
						length -= 1;
						if (that.inArray(items[name], m)) {
							if (exclude && length === 0 && !yearLimit && !monthLimit && !dateLimit && !dayLimit && !weekLimit && !hoursLimit) {
								isExcluded = true;
							}
							minutesLimit = false;
						}
					}
					if (exclude) {
						if (isExcluded) {
							return false;
						}
						if (s === undefined && length !== 0) {
							return false;
						}
						break;
					}
					if (minutesLimit) {
						return false;
					}
					if (s === undefined || length === 0) {
						return secondsLimit = false;
					}
					break;
				// 秒
				case "s":
					if (items[name] === undefined) {
						secondsLimit = false;
						break;
					}
					if (that.inArray(items[name], s)) {
						if (exclude && !yearLimit && !monthLimit && !dateLimit && !dayLimit && !weekLimit && !hoursLimit && !minutesLimit) {
							isExcluded = true;
						}
						secondsLimit = false;
					}
			}
		});
		// 判断结束
		return exclude ? isExcluded : !(yearLimit || monthLimit || dateLimit || dayLimit || weekLimit || hoursLimit || minutesLimit || secondsLimit);
	},
	/*
	 * 应用二分查找判断给定的元素是否在数组中
	 * @param {Array} array 查找集
	 * @param {Number} elem 被查找的元素
	 * @param {Function} sorter 排序比较函数，应用在需要对数组排序时
	 * @private
	 */
	inArray : function(array, value, sorter) {
		if (!array) {
			return false;
		}
		if (sorter) {
			array.sort( typeof sorter === "function" ? sorter : function(a, b) {
				return a - b;
			});
		}
		var left = 0, right = array.length - 1, middle;
		if (value < array[left] || value > array[right]) {
			return false;
		}
		while (left <= right) {
			middle = Math.round((left + right) / 2);
			if (array[middle] === value) {
				return true;
			} else if (value < array[middle]) {
				right = middle - 1;
			} else {
				left = middle + 1;
			}
		}
		return false;
	}
});

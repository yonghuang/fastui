/**
 * @class fastDev.Animate
 * @singleton
 * 控件库动画实现类
 */
fastDev.Animate = {
	/**
	 * 待执行动画对象数据
	 * @private
	 */
	timers : [],
	/**
	 * 是否禁用页面动画
	 */
	off : false,
	/**
	 * 激活定时器
	 * @private
	 */
	activate : function() {
		if(!this.timerID) {
			this.timerID = setInterval(fastDev.Animate.tick, 13);
		}
	},
	/**
	 * 执行动画单位时间内的一帧
	 * @private
	 */
	tick : function() {
		var timers = fastDev.Animate.timers, animation, len = timers.length, index = 0, fxHandle;
		for(; animation = timers[index]; index++) {
			if( fxHandle = fastDev.Animate.parseAnimation(animation)) {
				if(fastDev.isFunction(animation.complete)) {
					try{
						animation.complete();
					}catch(e){
						fastDev.warn("Animate", "callback", "触发动画的页面已被关闭，无法执行完成时回调", e.message);
					}
				}
				if(fastDev.isFunction(fxHandle)) {
					fxHandle();
				}
				timers.splice(index--, 1);
			}
		}

		if(timers.length === 0) {
			clearInterval(fastDev.Animate.timerID);
			fastDev.Animate.timerID = null;
		}
	},
	/**
	 * 解析动画配置执行动画
	 * @private
	 */
	parseAnimation : function(animation) {
		var index = 0, tween, fxqueue = animation.fxqueue, tweens;
		// 队列首个元素为区域分隔符则代表当前分隔符于下个分隔符之前的动画元素进行执行区域
		if(fxqueue[0] === "spliter") {
			fxqueue.shift();
		}

		for(var fx; fx = fxqueue[index]; index++) {
			if(fx === "spliter") {
				// 到达执行区域末尾则放弃后续动画元素
				break;
			} else if(fastDev.isFunction(fx)) {
				// 如果是队列中的下一次动画调用则清空本区域动画元素，生成下一次动画所需元素
				fxqueue.splice(index--, 1, "parse");
				return fx;
			}

			tweens = fx.tweens;
			// 运行当前动画元素的基本属性组
			for(var i = 0; tween = tweens[i]; i++) {
				if(this.runTween.call(animation, fx, tween)) {
					// 如果当前属性已达到动画完成要求，则删除当前属性
					tweens.splice(i, 1);
				}
			}
			// 如果所有属性都已达到动画要求则删除当前动画
			if(tweens.length === 0) {
				fxqueue.splice(index--, 1);
			}
		}
		// 如果当前动画运行完成则从定时器队列中删除此动画
		return fxqueue.length === 0;
	},
	/**
	 * 执行动画属性帧
	 * @private
	 */
	runTween : function(fx, tween) {
		var finish,
		// 当前时间
		nowTime = +new Date(),
		// 动画属性的起始值
		start = tween.start,
		// 动画属性基于当前时间的偏移量
		newValue = this.easing(nowTime - fx.startTime, Math.abs(start - tween.end), this.duration);
		// 计算属性的最终值
		if(start > tween.end) {
			newValue = start - newValue;
			finish = newValue <= tween.end;
		} else {
			newValue = start + newValue;
			finish = newValue >= tween.end;
		}

		// 如果动画运行完成或者超时，则直接设置属性的目标值，否则正常执行动画
		if(nowTime - fx.startTime > this.duration || finish) {
			fastDev.Dom.css(fx.elem, tween.name, +tween.end);
			return true;
		} else {
			fastDev.Dom.css(fx.elem, tween.name, newValue + (tween.unit || 0));
			return false;
		}
	},
	/**
	 * 构建动画元素
	 * @private
	 */
	buildAnimation : function(elem, prop, config, parse) {
		// 构建动画元素并添加至待执行队列
		config.fxqueue[parse?"unshift":"push"]({
			elem : elem,
			tweens : fastDev.Animate.createTweens(elem, prop),
			startTime : +new Date()
		});
	},
	/**
	 * 调整动画运行参数
	 * @param {Number} speed 动画时长
	 * @param {Function} easing 动画算法
	 * @param {Function} callback 回调函数
	 * @private
	 */
	correctParam : function(speed, easing, callback) {
		var easingCls, easingObj = fastDev.Animate.easing, speeds = fastDev.Animate.speeds;
		return {
			// 从最后一个参数逆推检测设置的动画完成时的回调
			complete : callback || !callback && easing || fastDev.isFunction(speed) && speed,
			// 动画持续时间
			duration : fastDev.Animate.off ? 0 : typeof speed === "number" ? speed : speed in speeds ? speeds[speed] : speeds._default,
			// 当前动画算法
			easing : fastDev.isString(easing) ? (( easing = easing.split("-")) && (( easingCls = easingObj[easing[0]]) && (easingCls[easing[1]] || easingCls.easeIn)) || easingObj.linear) : easingObj.linear
		};
	},
	/**
	 * 创建动画构成的基本属性组
	 * @param {Element} elem 动画影响元素
	 * @param {JsonObject} props 动画改变属性
	 * @private
	 */
	createTweens : function(elem, props) {
		var tweens = [];
		fastDev.each(props, function(key, value) {
			tweens.push(this.createTween(elem, key, value));
		}, this);
		return tweens;
	},
	/**
	 * 创建动画的基本属性
	 * @param {Element} elem 动画影响元素
	 * @param {String} key 属性键
	 * @param {String} value 属性值
	 * @private
	 */
	createTween : function(elem, key, value) {
		// 获取当前样式值
		var currValue = fastDev.Dom.css(elem, key),
		// 获取数字值以及单位
		m = /(\d*(?:.\d+)?)(.*)/.exec(currValue), m1 = /(\d*(?:.\d+)?)(.*)/.exec(value);
		return {
			name : key,
			start : +m[1] || 0,
			end : +m1[1],
			unit : m1[2]
		};
	},
	/**
	 * 内置动画速度
	 * @private
	 */
	speeds : {
		_default : 400,
		fast : 200,
		slow : 600
	},
	/**
	 * 内置动画算法
	 * @private
	 */
	easing : {
		linear : function(t, c, d) {
			return c * t / d;
		},
		quad : {
			easeIn : function(t, c, d) {
				return c * (t /= d) * t;
			},
			easeOut : function(t, c, d) {
				return -c * (t /= d) * (t - 2);
			},
			easeInOut : function(t, c, d) {
				if((t /= d / 2) < 1)
					return c / 2 * t * t;
				return -c / 2 * ((--t) * (t - 2) - 1);
			}
		},
		cubic : {
			easeIn : function(t, c, d) {
				return c * (t /= d) * t * t;
			},
			easeOut : function(t, c, d) {
				return c * (( t = t / d - 1) * t * t + 1);
			},
			easeInOut : function(t, c, d) {
				if((t /= d / 2) < 1)
					return c / 2 * t * t * t;
				return c / 2 * ((t -= 2) * t * t + 2);
			}
		},
		quart : {
			easeIn : function(t, c, d) {
				return c * (t /= d) * t * t * t;
			},
			easeOut : function(t, c, d) {
				return -c * (( t = t / d - 1) * t * t * t - 1);
			},
			easeInOut : function(t, c, d) {
				if((t /= d / 2) < 1)
					return c / 2 * t * t * t * t;
				return -c / 2 * ((t -= 2) * t * t * t - 2);
			}
		},
		quint : {
			easeIn : function(t, c, d) {
				return c * (t /= d) * t * t * t * t;
			},
			easeOut : function(t, c, d) {
				return c * (( t = t / d - 1) * t * t * t * t + 1);
			},
			easeInOut : function(t, c, d) {
				if((t /= d / 2) < 1)
					return c / 2 * t * t * t * t * t;
				return c / 2 * ((t -= 2) * t * t * t * t + 2);
			}
		},
		sine : {
			easeIn : function(t, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c;
			},
			easeOut : function(t, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2));
			},
			easeInOut : function(t, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1);
			}
		},
		expo : {
			easeIn : function(t, c, d) {
				return (t === 0) ? 0 : c * Math.pow(2, 10 * (t / d - 1));
			},
			easeOut : function(t, c, d) {
				return (t === d) ? 0 + c : c * (-Math.pow(2, -10 * t / d) + 1);
			},
			easeInOut : function(t, c, d) {
				if(t === 0)
					return 0;
				if(t === d)
					return 0 + c;
				if((t /= d / 2) < 1)
					return c / 2 * Math.pow(2, 10 * (t - 1));
				return c / 2 * (-Math.pow(2, -10 * --t) + 2);
			}
		},
		circ : {
			easeIn : function(t, c, d) {
				return -c * (Math.sqrt(1 - (t /= d) * t) - 1);
			},
			easeOut : function(t, c, d) {
				return c * Math.sqrt(1 - ( t = t / d - 1) * t);
			},
			easeInOut : function(t, c, d) {
				if((t /= d / 2) < 1)
					return -c / 2 * (Math.sqrt(1 - t * t) - 1);
				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
			}
		},
		elastic : {
			easeIn : function(t, c, d, a, p) {
				if(t === 0) {
					return 0;
				}
				if((t /= d) === 1) {
					return 0 + c;
				}
				if(!p) {
					p = d * 0.3;
				}
				var s;
				if(!a || a < Math.abs(c)) {
					a = c;
					s = p / 4;
				} else
					s = p / (2 * Math.PI) * Math.asin(c / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p));
			},
			easeOut : function(t, c, d, a, p) {
				if(t === 0) {
					return 0;
				}
				if((t /= d) === 1) {
					return 0 + c;
				}
				if(!p) {
					p = d * 0.3;
				}
				var s;
				if(!a || a < Math.abs(c)) {
					a = c;
					s = p / 4;
				} else
					s = p / (2 * Math.PI) * Math.asin(c / a);
				return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + 0);
			},
			easeInOut : function(t, c, d, a, p) {
				if(t === 0) {
					return 0;
				}
				if((t /= d / 2) === 2) {
					return 0 + c;
				}
				if(!p) {
					p = d * (0.3 * 1.5);
				}
				var s;
				if(!a || a < Math.abs(c)) {
					a = c;
					s = p / 4;
				} else
					s = p / (2 * Math.PI) * Math.asin(c / a);
				if(t < 1)
					return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p));
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c;
			}
		},
		back : {
			easeIn : function(t, c, d, s) {
				if(s === undefined)
					s = 1.70158;
				return c * (t /= d) * t * ((s + 1) * t - s);
			},
			easeOut : function(t, c, d, s) {
				if(s === undefined)
					s = 1.70158;
				return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1);
			},
			easeInOut : function(t, c, d, s) {
				if(s === undefined)
					s = 1.70158;
				if((t /= d / 2) < 1)
					return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
			}
		},
		bounce : {
			easeIn : function(t, c, d) {
				return c - fastDev.Animate.easing.bounce.easeOut(d - t, c, d);
			},
			easeOut : function(t, c, d) {
				if((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t);
				} else if(t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
				} else if(t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
				}
			},
			easeInOut : function(t, c, d) {
				if(t < d / 2)
					return fastDev.Animate.easing.bounce.easeIn(t * 2, c, d) * 0.5;
				else
					return fastDev.Animate.easing.bounce.easeOut(t * 2 - d, c, d) * 0.5 + c * 0.5;
			}
		}
	}
};

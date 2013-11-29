(function() {
	/*
	 * 时钟控件
	 * @class fastDev.Ui.Clock
	 * @extends fastDev.Ui.Component
	 */
	fastDev.define("fastDev.Ui.Clock", {
		extend : "fastDev.Ui.Component",
		alias : "Clock",
		_global : {
			upDiv : null,
			hoursSpan : null,
			minuteSpan : null,
			table : null,
			upImage : null,
			secondSpan : null,
			downImage : null,
			switchHour : "on",
			switchMinute : "off",
			switchSecond : "off"
		},
		/*
		 * 构造方法
		 * @private
		 */
		construct : function() {
			var date = new Date();
			var options = this.getOptions();
			var clockDiv = fastDev.create("talkweb.BaseControl.Div.Class", {
				container : options.container
			});
			this.storage(clockDiv[0]);
			var upDiv = fastDev.create("talkweb.BaseControl.Div.Class").hide();
			var downDiv = fastDev.create("talkweb.BaseControl.Div.Class", {
				className : "datepicker-footer"
			});
			this.append(upDiv).append(downDiv);
			fastDev.create("talkweb.BaseControl.Span.Class", {
				container : downDiv,
				value : "时间:"
			});
			var hoursSpan = fastDev.create("talkweb.BaseControl.Text.Class", {
				container : downDiv,
				value : date.getHours() == "0" ? "0" : date.getHours(),
				width : "20px",
				name : "hours"
			}).onKeyup(this.bindEventlistener(this, this.limit));
			var hoursWords = fastDev.create("talkweb.BaseControl.Span.Class", {
				container : downDiv,
				value : ":"
			});
			var minuteSpan = fastDev.create("talkweb.BaseControl.Text.Class", {
				container : downDiv,
				value : date.getMinutes() == "0" ? "0" : date.getMinutes(),
				width : "20px"
			}).onKeyup(this.bindEventlistener(this, this.limit));
			var minuteWords = fastDev.create("talkweb.BaseControl.Span.Class", {
				container : downDiv,
				value : ":"
			});
			var secondSpan = fastDev.create("talkweb.BaseControl.Text.Class", {
				container : downDiv,
				value : date.getSeconds() == "0" ? "0" : date.getSeconds(),
				width : "20px"
			}).onKeyup(this.bindEventlistener(this, this.limit));
			var upImage = fastDev.create("talkweb.BaseControl.Span.Class", {
				container : downDiv,
				saveInstance : true,
				id : "hoursUp",
				//				value : "上",
				className : "datepicker_arrowtop"
			});

			var downImage = fastDev.create("talkweb.BaseControl.Span.Class", {
				container : downDiv,
				saveInstance : true,
				id : "hoursDown",
				//				value : "下",
				className : "datepicker_arrowdown"
			});

			var table = fastDev.create("talkweb.BaseControl.Table.Class", {
				container : upDiv,
				rows : 2,
				cols : 12
			});
			this.setGlobal({
				upDiv : upDiv,
				hoursSpan : hoursSpan,
				minuteSpan : minuteSpan,
				table : table,
				upImage : upImage,
				downImage : downImage,
				secondSpan : secondSpan
			});
		},
		/*
		 * 截取时间值
		 * @private
		 */
		limit : function(e) {
			e.target.value = e.target.value.replace(/\D/g, '');
		},
		/*
		 * 初始化控件
		 * @private
		 */
		init : function() {
			var global = this.getGlobal();
			global.hoursSpan.onClick(this.bindEventlistener(this, this.clickHour));
			global.minuteSpan.onClick(this.bindEventlistener(this, this.clickMinute));
			global.secondSpan.onClick(this.bindEventlistener(this, this.clickSecond));
			global.table.onClick(this.bindEventlistener(this, this.clickTable));
			global.upImage.onClick(this.bindEventlistener(this, this.addNum));
			global.downImage.onClick(this.bindEventlistener(this, this.reductionNum));
		},
		/*
		 * 显示层
		 * @private
		 */
		showDiv : function() {
			var global = this.getGlobal();
			var cssblock = {
				'display' : 'block'
			};
			global.upDiv.setCss(cssblock);
			global.upDiv.setClass("datepicker-times-select");
		},
		/*
		 * 隐藏层
		 * @private
		 */
		hideDiv : function() {
			this.getGlobal().upDiv.hide();
		},
		/*
		 * 构造 table
		 * @private
		 * @param {String} creat "minute"或"second"
		 * @return {Array}
		 */
		creatTable : function(creat) {
			var tableArr = new Array(2);
			if (creat == "minute" || creat == "second") {
				for (var i = 0; i < tableArr.length - 1; i += 1) {
					tableArr[i] = new Array(12);
					for (var j = 0, h = 0; j < tableArr[i].length; j += 1, h = h + 5) {
						tableArr[i][j] = h;
					}
				}
			} else {
				for (var i = 0, h = 0; i < tableArr.length; i += 1) {
					tableArr[i] = new Array(12);
					for (var j = 0; j < tableArr[i].length; j += 1, h += 1) {
						tableArr[i][j] = h;
					}
				}
			}
			return tableArr;
		},
		/*
		 * 点击小时数字触发事件
		 * @private
		 */
		clickHour : function() {
			this.showDiv();
			this.getGlobal().table.cleanData();
			this.getGlobal().table.setValue(this.creatTable("hour"));
			this.setGlobal({
				switchHour : "on",
				switchMinute : "off",
				switchSecond : "off"
			});
		},
		/*
		 * 点击分钟数字触发事件
		 * @private
		 */
		clickMinute : function() {
			this.showDiv();
			this.getGlobal().table.cleanData();
			this.getGlobal().table.setValue(this.creatTable("minute"));
			this.setGlobal({
				switchHour : "off",
				switchMinute : "on",
				switchSecond : "off"
			});
		},
		/*
		 * 点击秒钟数字触发事件
		 * @private
		 */
		clickSecond : function() {
			this.showDiv();
			this.getGlobal().table.cleanData();
			this.getGlobal().table.setValue(this.creatTable("second"));
			this.setGlobal({
				switchHour : "off",
				switchMinute : "off",
				switchSecond : "on"
			});
		},
		/*
		 * 点击显示层获取数字事件
		 * @private
		 */
		clickTable : function(event) {
			if (event.target) {
				var global = this.getGlobal();
				switch("on") {
					case global.switchHour:
						global.hoursSpan.setValue(event.target.innerHTML);
						break;
					case global.switchMinute:
						global.minuteSpan.setValue(event.target.innerHTML);
						break;
					case global.switchSecond:
						global.secondSpan.setValue(event.target.innerHTML);
						break;
				}
				this.hideDiv();
			}
		},
		/*
		 * 增加数字事件
		 * @private
		 */
		addNum : function() {
			var global = this.getGlobal(), obj, value, maxV = 59;
			switch("on") {
				case global.switchHour:
					obj = global.hoursSpan, maxV = 23;
					break;
				case global.switchMinute:
					obj = global.minuteSpan;
					break;
				case global.switchSecond:
					obj = global.secondSpan;
					break;
			};
			value = obj.getValue(), value = parseInt(value) + 1;
			if (value == maxV + 1) {
				value = 0;
			}
			obj.setValue(String(value));
		},
		/*
		 * 减少数字事件
		 * @private
		 */
		reductionNum : function() {
			var global = this.getGlobal(), obj, value, maxV = 59;
			minV = 0;
			switch("on") {
				case global.switchHour:
					obj = global.hoursSpan, maxV = 23;
					break;
				case global.switchMinute:
					obj = global.minuteSpan;
					break;
				case global.switchSecond:
					obj = global.secondSpan;
					break;
			};
			value = obj.getValue(),
			//(/^\d+$/.test(value) && value >= 0 && --value) || ( value = maxV);
			value = parseInt(value) - 1;
			if (value == minV - 1) {
				value = maxV;
			}
			obj.setValue(String(value));
		},
		/*
		 * @private
		 */
		Appendzero : function(obj) {
			if (obj < 10 && obj.toString().length == 1) {
				return "0" + "" + obj;
			} else {
				return obj;
			}
		},
		/*
		 * 设置控件的值
		 * @param {String} mdate 要设置的时间值
		 */
		setValue : function(mdate) {
			var global = this.getGlobal();
			var mycars = new Array();
			for ( i = 0; i < mdate.length; i++) {
				mycars[i] = mdate[i];
			}
			global.hoursSpan.setValue(mycars[3]);
			global.minuteSpan.setValue(mycars[4]);
			global.secondSpan.setValue(mycars[5]);
		},
		/*
		 * 得到当前控件的显示值
		 * @return {String} HH:mm:ss格式的时间值
		 */
		getValue : function() {
			return this.Appendzero(this.getGlobal().hoursSpan.getValue() > 23 ? 23 : this.getGlobal().hoursSpan.getValue()) + ":" + this.Appendzero(this.getGlobal().minuteSpan.getValue() > 59 ? 59 : this.getGlobal().minuteSpan.getValue()) + ":" + this.Appendzero(this.getGlobal().secondSpan.getValue() > 59 ? 59 : this.getGlobal().secondSpan.getValue());
		}
	});
})(jQuery)

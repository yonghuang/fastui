/**
 * @class fastDev.Ui.DatePicker
 * @extends fastDev.Ui.Box
 * @author chengwei
 * <p>日期选择控件提供日期时间选择功能，且能对日期时间范围作出动态限制。</p>
 * <p>作者：程伟</p>
 *     
 *     <input itype="DatePicker" value="2012-8-25" />
 */
fastDev.define("fastDev.Ui.DatePicker", {
    alias: "DatePicker",
    extend: "fastDev.Ui.Box",
    _options: {
        /**
         * 控件宽度
         * @type {String}
         */
        width: "160px",
        /**
         * 索引重置
         * @type {Number}
         */
        zIndex: 2012,
        /**
         * 设定日期值
         * @type {String}
         */
        value: "",
        /**
         * 输入框名称
         * @type {String}
         */
        name: "",
        /**
         * 日期选择的触发方式
         * <p>- button: 仅仅在点击图标按钮时触发日期选择</p>
         * <p> -click: 输入框或图标上发生点击事件时触发</p>
         * <p> -mouseover: 鼠标悬浮至输入框或图标上时触发</p>
         * <p> -[eventType] :其他任何有效事件类型</p>
         * @type {String}
         */
        trigger: "click",
        /**
         * 日期时间格式
         * <p>格式表达式，变量含义:</p>
         * <p>-yyyy: 带 0 补齐的四位年表示</p>
         * <p>-yy: 带 0 补齐的两位年表示</p>
         * <p>-MM: 带 0 补齐的两位月表示</p>
         * <p>-M: 不带 0 补齐的月表示</p>
         * <p>-dd: 带 0 补齐的两位日表示</p>
         * <p>-d: 不带 0 补齐的日表示</p>
         * <p>-hh: 带 0 补齐的两位 12 进制时表示</p>
         * <p>-h: 不带 0 补齐的 12 进制时表示</p>
         * <p>-HH: 带 0 补齐的两位 24 进制时表示</p>
         * <p>-H: 不带 0 补齐的 24 进制时表示</p>
         * <p>-mm: 带 0 补齐两位分表示</p>
         * <p>-m: 不带 0 补齐分表示</p>
         * <p>-ss: 带 0 补齐两位秒表示</p>
         * <p>-s: 不带 0 补齐秒表示</p>
         * @type {String}
         */
        format: "yyyy-MM-dd",
        /**
         * 定义星期的第一天，可选值0~6
         * 星期日为0、星期一为1、星期六为6
         * @type {Number}
         */
        firstDayOfWeek: 0,
        /**
         * 最小日期限制（默认会取1900年1月1日0时0分0秒）
         * @type {String|Date}
         */
        minDate: null,
        /**
         * 最大日期限制（默认会取2099年12月31日23时59分59秒）
         * @type {String|Date}
         */
        maxDate: null,
        /**
         * 可选择的日期时间值表达式组
         * 此表达式为cron日期表达式，其格式为用空格分隔的7个子表达式域，如：
         *  0 15 10 ? * 6L 2002-2005
         * [秒   分     时] 日  月   周   年
         * 可以不声明   ”秒“ “分” “时”子表达式，表达式长度等于3或等于4时，会默认"秒 分 时"为 "?"值
         * 上述表达式表示：在 2002, 2003, 2004和 2005 年中的每月最后一个周五（星期日为1，星期一为2，依此类推）的 10:15 AM
         * 更多有关于cron日期表达式的信息，请参考相关资料或在线示例
         * @type {String|Array}
         */
        includes: [],
        /**
         * 被禁用的日期时间值表达式组
         * includes属性中指明的可选值也会在excludes声明中被排除
         * 此表达式为cron表达式
         * 可以不声明   ”秒“ “分” “时”子表达式，表达式长度等于3或等于4时，会默认"秒 分 时"为 "?"值
         * 更多有关于cron日期表达式的信息，请参考相关资料或在线示例
         * @type {String|Array}
         */
        excludes: [],
        /**
         * 是否显示时间选择器
         * 控件默认会根据日期时间格式来判定是否需要显示时间选择器
         * 也可以通过该属性强制开启或关闭时间选择器，但最终日期时间值仍受限于format属性指定的格式
         * @type {Boolean}
         */
        showTimePicker: null,
        /**
         * 是否显示农历日期值提示
         * @type {Boolean}
         */
        showLunarTips: true,
        /**
         * 指定可选时间必须在另外一个DatePicker控件已选日期值之前
         * 即设置当前控件的最大日期值为该属性所指定日期控件的已选日期值
         * 另外也可以通过onPick事件回调来动态设置本控件的最大最小日期值限制
         * 可传控件ID或者fastDev.Ui.DatePicker对象
         * @type {String|fastDev.Ui.DatePicker}
         */
        timeBefore: null,
        /**
         * 指定可选时间必须在另外一个DatePicker控件已选日期值之后
         * 即设置当前控件的最小日期值为该属性所指定的日期控件的已选日期值
         * 另外也可以通过onPick事件回调来动态设置本控件的最大最小日期值限制
         * 可传控件ID或者fastDev.Ui.DatePicker对象
         * @type {String|fastDev.Ui.DatePicker}
         */
        timeAfter: null,
        /**
         * 是否只读
         * @type {Boolean}
         */
        readonly: false,
        /**
         * 日历面板展现类型，为以下枚举值：
         * <p>-block: 以弹出层形式展现，默认方式 </p>
         * <p>-inline: 以行内块形式展现，即平面模式 </p>
         * @type {String}
         */
        display: "block",
        /**
         * 选择日期值后的回调事件，传递参数为当前拟选的日期对象(Date对象)和根据格式参数格式化后的日期时间值(字符串值)
         * 若回调函数返回false，则不会选择当前拟选的日期值
         * this指向当前日历控件
         * @type {Function}
         * @event
         */
        onPick: fastDev.noop,
        enabledDataProxy: false,
        enabledInitProxy: false
    },
    template: ['<tpl if("#{display}"!="inline")>',
        '<div class="ui-form ui-form-wrap ui-date" style="width:#{width}">',
        '<input id="#{id}" type="text" name="#{name}" autocomplete="off" readonly="readonly" class="ui-form-field ui-form-input" value="#{value}" style="width:#{inputWidth}"/>',
        '<div class="ui-form-trigger">',
        '<div id="datepicker-trigger-#{sequence}" class="ui-date-icon"></div>',
        '</div>',
        '</div>',
        '</tpl>',
        '<div id="datepicker-#{sequence}" class="ui-datepicker #{shadowCls}" style="display:none">',
        '<div id="datepicker-header-#{sequence}" class="ui-datepicker-header">',
        '<div>',
        '<span name="prevYearBtn" id="datepicker-prevyear-#{sequence}" title="上一年" class="ui-datepicker-header-page ui-datepicker-header-prevyear"></span>',
        '</div>',
        '<div>',
        '<span name="prevMonthBtn" id="datepicker-prevmonth-#{sequence}" title="上一月" class="ui-datepicker-header-page ui-datepicker-header-prevmonth"></span>',
        '</div>',
        '<div class="ui-datepicker-header-text">',
        '<input name="monthInput" id="datepicker-input-month-#{sequence}" class="ui-datepicker-header-input ui-datepicker-header-month"/>',
        '<input name="yearInput" id="datepicker-input-year-#{sequence}" class="ui-datepicker-header-input ui-datepicker-header-year"/>',
        '</div>',
        '<div>',
        '<span name="nextMonthBtn" id="datepicker-nextmonth-#{sequence}" title="下一月" class="ui-datepicker-header-page ui-datepicker-header-nextmonth"></span>',
        '</div>',
        '<div>',
        '<span name="nextYearBtn" id="datepicker-nextyear-#{sequence}" title="下一年" class="ui-datepicker-header-page ui-datepicker-header-nextyear"></span>',
        '</div>',
        '</div>',
        '<div class="ui-datepicker-body">',
        '<table cellpadding="0" cellspacing="0" border="0" class="ui-datepicker-weekday">',
        '<thead>',
        '<tr id="datepicker-weekday-title-#{sequence}" class="ui-datepicker-weekday-title"></tr>',
        '</thead>',
        '<tbody id="datepicker-body-#{sequence}"></tbody>',
        '</table>',
        '</div>',
        '<div id="datepicker-toolbar-#{sequence}" class="ui-datepicker-toolbar">',
        '<tpl if(#{showTimePicker}==true)>',
        '<div class="ui-datepicker-time" style="display:block;">',
        '<div id="timepicker-numberbox-#{sequence}" class="ui-form ui-form-wrap ui-numberbox" style="width:80px;left:0px;top:0px">',
        '<input name="timePickerHours" id="timepicker-hours-#{sequence}" title="时" type="text" autocomplete="off" class="ui-form-field ui-form-input" style="width:16px"/>:',
        '<input name="timePickerMinutes" id="timepicker-minutes-#{sequence}" title="分" type="text" autocomplete="off" class="ui-form-field ui-form-input" style="width:16px"/>:',
        '<input name="timePickerSeconds" id="timepicker-seconds-#{sequence}" title="秒" type="text" autocomplete="off" class="ui-form-field ui-form-input" style="width:16px"/>',
        '<div id="datepicker-timepicker-trigger-#{sequence}" class="ui-form-trigger">',
        '<div class="ui-numberbox-up">',
        '<div name="timePickerUpBtn" title="递增时间" id="timepicker-up-#{sequence}" class="ui-numberbox-icon"></div>',
        '</div>',
        '<div class="ui-numberbox-split"></div>',
        '<div class="ui-numberbox-down">',
        '<div name="timePickerDownBtn" title="递减时间" id="timepicker-down-#{sequence}" class="ui-numberbox-icon"></div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</tpl>',
        '<div class="ui-datepicker-button">',
        '<tpl if(#{showTimePicker}==true)>',
        '<a class="ui-button ui-button-bg">',
        '<em class="ui-button-em"><span name="confirmBtn" id="datepicker-button-confirm-#{sequence}" class="ui-button-text">确定</span></em>',
        '</a>',
        '<tpl else>',
        '<a class="ui-button ui-button-bg">',
        '<em class="ui-button-em"><span name="todayBtn" id="datepicker-button-today-#{sequence}" class="ui-button-text">今天</span></em>',
        '</a>',
        '</tpl>',
        '<a class="ui-button ui-button-bg">',
        '<em class="ui-button-em"><span name="cleanBtn" id="datepicker-button-clean-#{sequence}" class="ui-button-text">清除</span></em>',
        '</a>',
        '</div>',
        '<div class="ui-clear"></div>',
        '</div>',
        '<div class="ui-clear"></div>',
        '</div>',
        '<div id="datepicker-menu-month-#{sequence}" class="ui-datepicker-menu-month ui-shadow" style="display:none;"></div>',
        '<div id="datepicker-menu-year-#{sequence}" class="ui-datepicker-menu-year ui-shadow" style="display:none;">',
        '<div id="datepicker-menu-year-placeholder-#{sequence}"></div>',
        '<div class="ui-clear"></div>',
        '<div class="ui-datepicker-menu-year-page">',
        '<a id="datepicker-menu-year-prev-#{sequence}" title="上翻页" name="prev" class="ui-datepicker-menu-year-prev">&nbsp;&laquo;&nbsp;</a>',
        '<span id="datepicker-menu-year-line-#{sequence}" class="ui-datepicker-menu-year-line">-----</span>',
        '<a id="datepicker-menu-year-next-#{sequence}" title="下翻页" name="next" class="ui-datepicker-menu-year-next">&nbsp;&raquo;&nbsp;</a>',
        '</div>',
        '</div>'],
    tplParam: ["width", "name", "inputWidth", "trigger", "value", "sequence", "id", "showTimePicker", "display", "shadowCls"],
    /**
     * 准备参数
     * @param {Object} options
     * @param {Object} global
     * @protected
     */
    ready: function (options, global) {
        var that = this;
        fastDev.apply(global, {
            sequence: fastDev.getID(),
            minYear: 1900,
            maxYear: 2099,
            minDate: new Date(0, 0, 1),
            maxDate: new Date(2099, 11, 31, 23, 59, 59)
        });
        fastDev.apply(options, {
            // 容器有2px的边框
            width: ((fastDev.Util.StringUtil.stripUnits(options.width, options.container.width()) || 160) - 2) + "px",
            firstDayOfWeek: parseInt(options.firstDayOfWeek, 10) || 0,
            format: fastDev.Util.StringUtil.trim(options.format),
            minDate: options.minDate ? that.toValidDate(options.minDate) : global.minDate,
            maxDate: options.maxDate ? that.toValidDate(options.maxDate) : global.maxDate,
            display: options.display === "inline" ? "inline" : "block",
            zIndex: parseInt(options.zIndex, 10) || 2012,
            timeAfter: !! options.timeAfter ? options.timeAfter : "",
            timeBefore: !! options.timeBefore ? options.timeBefore : "",
            saveInstance: !! options.saveInstance || !! options.timeAfter || !! options.timeBefore,
            onPick: typeof options.onPick === "function" ? options.onPick : fastDev.noop
        });
        // 输入框的宽度等于容器的宽度减去图标的宽度（18px）再减边框的2px（共20px）
        global.inputWidth = (window.parseFloat(options.width) - 20) + "px";
        options.showTimePicker = this.isShowTimePicker();
        global.shadowCls = options.display === "inline" ? "" : "ui-shadow";
        global.onBlur = fastDev.noop;
        options.firstDayOfWeek = options.firstDayOfWeek > -1 && options.firstDayOfWeek < 7 ? options.firstDayOfWeek : 0;
        if (!options.id || !fastDev.Util.StringUtil.trim(options.id)) {
            options.id = fastDev.getID();
        }
    },
    /**
     * 构造控件
     * @param {Object} options
     * @param {Object} global
     * @protected
     */
    construct: function (options, global) {
        var sequence = global.sequence;
        fastDev.apply(global, {
            input: global.box,
            trigger: this.find("[id='datepicker-trigger-" + sequence + "']"),
            picker: this.find("[id='datepicker-" + sequence + "']").appendTo(document.body),
            yearMenu: this.find("[id='datepicker-menu-year-" + sequence + "']").appendTo(document.body),
            monthMenu: this.find("[id='datepicker-menu-month-" + sequence + "']").appendTo(document.body),
            yearMenuPlaceHolder: this.find("[id='datepicker-menu-year-placeholder-" + sequence + "']"),
            yearMenuPrevBtn: this.find("[id='datepicker-menu-year-prev-" + sequence + "']"),
            yearMenuNextBtn: this.find("[id='datepicker-menu-year-next-" + sequence + "']"),
            yearMenuLine: this.find("[id='datepicker-menu-year-line-" + sequence + "']"),
            header: this.find("[id='datepicker-header-" + sequence + "']"),
            weekdayTitle: this.find("[id='datepicker-weekday-title-" + sequence + "']"),
            body: this.find("[id='datepicker-body-" + sequence + "']"),
            toolbar: this.find("[id='datepicker-toolbar-" + sequence + "']"),
            todayBtn: this.find("[id='datepicker-button-today-" + sequence + "']"),
            confirmBtn: this.find("[id='datepicker-button-confirm-" + sequence + "']"),
            cleanBtn: this.find("[id='datepicker-button-clean-" + sequence + "']"),
            monthInput: this.find("[id='datepicker-input-month-" + sequence + "']"),
            yearInput: this.find("[id='datepicker-input-year-" + sequence + "']"),
            prevYearBtn: this.find("[id='datepicker-prevyear-" + sequence + "']"),
            prevMonthBtn: this.find("[id='datepicker-prevmonth-" + sequence + "']"),
            nextYearBtn: this.find("[id='datepicker-nextyear-" + sequence + "']"),
            nextMonthBtn: this.find("[id='datepicker-nextmonth-" + sequence + "']")
        });
        if (options.showTimePicker) {
            fastDev.apply(global, {
                timePicker: this.find("[id='timepicker-numberbox-" + sequence + "']"),
                timePickerUpBtn: this.find("[id='timepicker-up-" + sequence + "']"),
                timePickerDownBtn: this.find("[id='timepicker-down-" + sequence + "']"),
                timePickerHours: this.find("[id='timepicker-hours-" + sequence + "']"),
                timePickerMinutes: this.find("[id='timepicker-minutes-" + sequence + "']"),
                timePickerSeconds: this.find("[id='timepicker-seconds-" + sequence + "']"),
                timePickerTrigger: this.find("[id='datepicker-timepicker-trigger-" + sequence + "']")
            });
        }
        // 设置星期标题
        this.setWeekdayTitle();
        this.elems.splice(1, 0, "none");
    },
    /**
     * 初始控件
     * @param {Object} options
     * @param {Object} global
     * @protected
     */
    init: function (options, global) {
        // 初始化日期时间最值设定
        this.setMinDate(options.minDate);
        this.setMaxDate(options.maxDate);
        // 初始化时间表达式
        this.parseCronExpression();
        // 初始化日期选择值
        this.setValue(options.value);
        // 注册事件
        if (options.display === "inline") {
            // 初始行内模式的日历
            this.initInlinePicker();
        }
        if ( !! options.disabled) {
            this.disable();
        }
        // 刷新界面
        this.freshUI();
        // 绑定相关事件
        this.bindEventHandle();
        // 阻止文本选择
        this.preventTextSelect();
        // 标记为初始完毕，用于被其他日历控件引用时
        global.initialized = true;
    },
    /**
     * 绑定事件
     * @param {String} type 事件类型
     * @param {Function} handle 事件句柄 
     * @private 
     */
    bind: function (type, handle) {
    	if (type === "blur") {
    		this._global.onBlur = handle;
    	} else {
    		this.superClass.bind.apply(this, arguments);
    	}
    	return this;
    },
    /**
     * 初始化行内模式的日历控件
     * @private
     */
    initInlinePicker: function () {
        var options = this._options,
            global = this._global;
        // 行内模式
        global.toolbar.hide();
        global.picker.css("position", "static");
        options.readonly = false;
        if ( !! options.container.elems[0] && !(options.container.prop("disabled") || options.container.attr("disabled"))) {
            // 容器未被禁用则添加日历面板
            global.picker.appendTo(options.container);
            this.show();
        }
    },
    /**
     * 对按钮或输入框作禁用处理
     * @param {Boolean} onlyBtn 为true时则只刷新"今天"按钮
     * @private
     */
    freshUI: function (onlyBtn) {
        var options = this._options;
        if (options.display !== "inline") {
            var global = this._global,
                today = new Date();
            // 如果"今天"不可用，则禁用"今天按钮"
            if (!options.showTimePicker) {
                if (this.isDisabled(today.getFullYear(), today.getMonth(), today.getDate())) {
                    global.todayBtn.parent().parent().addClass("ui-button-disabled");
                    global.todayBtn.attr("forbidden", "forbidden");
                } else {
                    global.todayBtn.parent().parent().removeClass("ui-button-disabled");
                    global.todayBtn.attr("forbidden", "");
                }
            } else if (!onlyBtn) {
                fastDev.each(["Hours", "Minutes", "Seconds"], function (idx, val) {
                    if (!global["show" + val]) {
                        global["timePicker" + val].prop("disabled", "disabled").addClass("ui-datepicker-disabled");
                    }
                });
            }
        }
    },
    /**
     * 绑定事件处理器
     * @private
     */
    // 考虑建立事件管理器，用代理来托管重复类型的事件
    bindEventHandle: function () {
        var that = this,
            options = this._options,
            global = this._global;
        if (options.display !== "inline") {
            if (options.trigger === "button") {
                // 仅点击button时触发
                global.trigger.bind("click", fastDev.setFnInScope(this, this.triggerEvent));
            } else {
                // 发生指定事件时触发
                global.input.bind(options.trigger, fastDev.setFnInScope(this, this.triggerEvent));
                global.trigger.bind(options.trigger, fastDev.setFnInScope(this, this.triggerEvent));
            }
        }
        // 绑定日历面板事件代理
        global.picker.bind("click", fastDev.setFnInScope(this, this.pickerClick)).bind("mouseover", fastDev.setFnInScope(this, this.pickerOver)).bind("mouseout", fastDev.setFnInScope(this, this.pickerOut));
        // IE6、7、8下dblclick事件不会执行click事件，点击过快时会有停顿感觉，所以需同时绑dblclick事件
        if (fastDev.Browser.isIE6 || fastDev.Browser.isIE7 || fastDev.Browser.isIE8) {
            global.picker.bind("dblclick", fastDev.setFnInScope(this, this.pickerClick));
        }
        // 绑定键盘相关操作
        global.picker.bind("keydown", fastDev.setFnInScope(this, this.pickerKeydown));
        if (fastDev.Browser.isIE6) {
            // IE6不支持keydown捕获回车事件，改用keyup监听
            global.picker.bind("keyup", function (event) {
                if (event.keyCode === 13) {
                    that.pickerKeydown(event);
                }
            });
        }
        // 绑定鼠标滚轮滚动事件，以便快速翻页
        global.picker.bind(fastDev.Browser.isFirefox ? "DOMMouseScroll" : "mousewheel", fastDev.setFnInScope(this, this.bodyMouseWheel));
        global.yearMenu.bind(fastDev.Browser.isFirefox ? "DOMMouseScroll" : "mousewheel", fastDev.setFnInScope(this, this.yearMenuMouseWheel));
        global.monthMenu.bind(fastDev.Browser.isFirefox ? "DOMMouseScroll" : "mousewheel", fastDev.setFnInScope(this, this.bodyMouseWheel));
        global.monthMenu.bind("click", function (event) {
            return that.menuClick(event, "month");
        });
        global.yearMenu.bind("click", global.yearMenuClickHandle = function (event) {
            return that.menuClick(event, "year");
        });
        if (fastDev.Browser.isIE6) {
            // IE6下不支持样式设置hover，需添加js事件
            global.monthMenu.bind("mouseover", fastDev.setFnInScope(global.monthMenu, this.menuOver)).bind("mouseout", fastDev.setFnInScope(global.monthMenu, this.menuOut));
            global.yearMenu.bind("mouseover", fastDev.setFnInScope(global.yearMenu, this.menuOver)).bind("mouseout", fastDev.setFnInScope(global.yearMenu, this.menuOut));
        }
        if (fastDev.Browser.isIE6 || fastDev.Browser.isIE7 || fastDev.Browser.isIE8) {
            global.yearMenu.bind("dblclick", global.yearMenuClickHandle);
        }
        // 面板点击默认取消事件冒泡
        global.cancelBubble = true;
        // 初始化清理标识
        global.clear = false;
    },
    /**
     * 触发器触发事件
     * @param {Event} event
     * @private
     */
    triggerEvent: function (event) {
        this.show();
        // 取消事件冒泡
        return this.stopBubble(event);
    },
    /**
     * 阻止文本选择
     * @private
     */
    preventTextSelect: function () {
        var global = this._global;
        if (fastDev.Browser.isFirefox) {
            // 火狐下禁用日历面板文本选择
            global.picker.css("-moz-user-select", "-moz-none");
            global.yearMenu.css("-moz-user-select", "none");
        } else {
            // Chrome、IE禁用文本选择
            global.picker.elems[0].onselectstart = global.yearMenu.elems[0].onselectstart = global.monthMenu.elems[0].onselectstart = fastDev.setFnInScope(this, this.stopBubble);
            global.yearInput.elems[0].onselectstart = global.monthInput.elems[0].onselectstart = function () {
                // 年份与月份输入框应该拥有可选文本事件
                global.cancelBubble = false;
            };
            if (this._options.showTimePicker) {
                fastDev.each(["Hours", "Minutes", "Seconds"], function (idx, val) {
                    global["timePicker" + val].elems[0].onselectstart = function () {
                        global.cancelBubble = !global["show" + val];
                    };
                });
            }
        }
    },
    /**
     * 日历面板鼠标悬浮事件代理
     * @param {Event} event
     * @private
     */
    pickerOver: function (event) {
        var options = this._options,
            global = this._global,
            target = fastDev(event.target),
            name = (target.attr("name") || target.prop("name") || "").split("-");
        if (name[1] === global.sequence + "") {
            // 日期项鼠标悬浮
            target.addClass("ui-datepicker-over");
            if (options.showLunarTips && !target.prop("title")) {
                target.prop("title", this.showLunarTips(name));
            }
        } else {
            switch (name[0]) {
                // 上一年按钮鼠标悬浮事件
                case "prevYearBtn":
                    // 下一年按钮鼠标悬浮事件
                case "nextYearBtn":
                    // 上一月按钮鼠标悬浮事件
                case "prevMonthBtn":
                    // 下一月按钮鼠标悬浮事件
                case "nextMonthBtn":
                    target.parent().addClass("ui-datepicker-header-over");
                    break;
                    // 今天按钮悬浮
                case "todayBtn":
                    // 确定按钮悬浮
                case "confirmBtn":
                    // 清除按钮悬浮
                case "cleanBtn":
                    target.prop("title", name[0] === "cleanBtn" ? "" : fastDev.Util.DateUtil.format(name[0] === "todayBtn" ? new Date() : new Date(global.year, global.month, global.forSelectDate, global.hours, global.minutes, global.seconds), options.format));
                    target.parent().parent().addClass("ui-button-over");
                    break;
                    // 时间选择器向上按钮点击事件
                case "timePickerUpBtn":
                    // 时间选择器向下按钮点击事件
                case "timePickerDownBtn":
                    target.parent().addClass("ui-numberbox-over");
            }
        }
        // 取消事件冒泡
        return this.stopBubble(event);
    },
    /**
     * 菜单鼠标悬浮事件，IE6兼容考虑
     * @param {Event} event
     * @private
     */
    menuOver: function (event) {
        if (event.target.tagName.toLowerCase() === "a") {
            fastDev(event.target).addClass("ui-datepicker-menu-over");
        }
    },
    /**
     * 菜单鼠标移出事件，IE6兼容考虑
     * @param {Event} event
     * @private
     */
    menuOut: function (event) {
        this.find(".ui-datepicker-menu-over").removeClass("ui-datepicker-menu-over");
    },
    /**
     * 日历面板鼠标移出事件代理
     * @param {Event} event
     * @private
     */
    pickerOut: function (event) {
        var global = this._global;
        global.body.find(".ui-datepicker-over").removeClass("ui-datepicker-over");
        global.header.find(".ui-datepicker-header-over").removeClass("ui-datepicker-header-over");
        global.toolbar.find(".ui-button-over").removeClass("ui-button-over");
        if (this._options.showTimePicker) {
            global.timePickerTrigger.find(".ui-numberbox-over").removeClass("ui-numberbox-over");
        }
        // 取消事件冒泡
        return this.stopBubble(event);
    },
    /**
     * 日历面板鼠标点击事件
     * @param {Event} event
     * @private
     */
    pickerClick: function (event) {
        var options = this._options,
            global = this._global,
            target = fastDev(event.target),
            name = (target.attr("name") || target.prop("name") || "").split("-");
        // 隐藏年、月份菜单层，未传值则表示需验证年、月份输入框的值
        this.hideMenu("month");
        this.hideMenu("year");
        // 验证时间选择器的值
        this.validateTime(name[0]);
        if (name[1] === global.sequence + "") {
            // 日期值点选
            this.bodyClick(name, target, event);
        } else {
            switch (name[0]) {
                // 上一年按钮点击事件
                case "prevYearBtn":
                    // 下一年按钮点击事件
                case "nextYearBtn":
                    // 上一月按钮点击事件
                case "prevMonthBtn":
                    // 下一月按钮点击事件
                case "nextMonthBtn":
                    name = name[0].match(/(prev|next)(Year|Month)Btn/);
                    this.headerBtnClick(fastDev.Util.StringUtil.capitalize(name[1]), name[2].toLowerCase(), target.parent().hasClass("ui-datepicker-header-disabled"));
                    break;
                    // 月份输入框点击事件
                case "monthInput":
                    // 年份输入框点击事件
                case "yearInput":
                    this.headerInputClick(name[0].match(/(month|year)Input/)[1]);
                    break;
                    // "今天"按钮点击事件
                case "todayBtn":
                    // "确定"按钮点击事件
                case "confirmBtn":
                    // "清除"按钮点击事件
                case "cleanBtn":
                    this[name[0] + "Click"](event);
                    break;
                case "timePickerUpBtn":
                    this.timePickerBtnClick("up");
                    break;
                case "timePickerDownBtn":
                    this.timePickerBtnClick("down");
                    break;
                    // 时间选择器
                case "timePickerHours":
                case "timePickerMinutes":
                case "timePickerSeconds":
                    this.timePickerFocus(name[0]);
                    break;
                default:
                    this.btnClickCount();
            }
        }
        if (options.display === "inline") {
            // 行内模式时，点击日历面板，需清理未关闭的其他非行内模式的日历面板
            global.clear = true;
            // 取消阻止事件冒泡，以避免影响其他监听doc click的控件（实际上clear操作已经取消阻止事件冒泡了，此处作个Note而已）
            global.cancelBubble = false;
        }
        // 取消事件冒泡
        return this.stopBubble(event);
    },
    /**
     * 监听按键触发事件
     * @param {Event} event
     * @private
     */
    pickerKeydown: function (event) {
        var global = this._global;
        if (event.keyCode === 13) {
            this.hideMenu("year", undefined, true);
            this.hideMenu("month", undefined, true);
            this.refreshDate(global.year, global.month);
        } else {
            var target = event.target;
            if (target === global.yearInput.elems[0]) {
                if (event.keyCode === 9) {
                    this.hideMenu("year", undefined, true);
                    this.refreshDate(global.year, global.month);
                    this.headerInputClick("month");
                } else {
                    this.setTimer(function () {
                        this.refreshYearMenu(parseInt(this._global.yearInput.prop("value"), 10), true);
                    }, 10);
                    global.cancelBubble = false;
                }
            } else if (target === global.monthInput.elems[0]) {
                if (event.keyCode === 9) {
                    this.hideMenu("month", undefined, true);
                    this.refreshDate(global.year, global.month);
                    this.headerInputClick("year");
                } else {
                    global.cancelBubble = false;
                }
            } else if (this._options.showTimePicker && /^timePicker([HMS].*)$/.test((target = fastDev(target)).prop("name"))) {
                if (event.keyCode === 9) {
                    this.validateTime();
                    switch (RegExp.$1) {
                        case "Hours":
                            this.timePickerFocus(global.timePickerMinutes.prop("disabled") ? "timePickerSeconds" : "timePickerMinutes");
                            break;
                        case "Minutes":
                            this.timePickerFocus(global.timePickerSeconds.prop("disabled") ? "timePickerHours" : "timePickerSeconds");
                            break;
                        case "Seconds":
                            this.timePickerFocus(global.timePickerHours.prop("disabled") ? "timePickerMinutes" : "timePickerHours");
                    }
                } else if (event.keyCode === 38) {
                    this.setTimer(this.timePickerBtnClick, 25, "up");
                } else if (event.keyCode === 40) {
                    this.setTimer(this.timePickerBtnClick, 25, "down");
                } else {
                    global.cancelBubble = false;
                }
            } else {
                global.cancelBubble = false;
            }
            return this.stopBubble(event);
        }
    },
    /**
     * 刷新日期
     * @param {Number} year
     * @param {Number} month
     * @private
     */
    refreshDate: function (year, month) {
        var options = this._options,
            global = this._global,
            lastDay = new Date(year, month + 1, 0).getDate(),
            date = options.showTimePicker ? global.forSelectDate > lastDay ? lastDay : global.forSelectDate : global.date > lastDay ? lastDay : global.date;
        this.refreshToRecent(options.showTimePicker ? new Date(year, month, date, global.hours, global.minutes, global.seconds) : new Date(year, month, date));
    },
    /**
     * 设置计时器
     * @param {Function} func 函数
     * @param {Number} timeout 超时时长
     * @param {Object} parama 参数a
     * @param {Object} paramb 参数b
     * @private
     */
    setTimer: function (func, timeout, parama, paramb) {
        var that = this,
            global = this._global;
        window.clearTimeout(global.timer);
        global.timer = window.setTimeout(function () {
            func.call(that, parama, paramb);
        }, timeout);
    },
    /**
     * 日期格子点击事件
     * @param {Array} name
     * @param {Element} target
     * @param {Event} event
     * @private
     */
    bodyClick: function (name, target, event) {
        var options = this._options,
            global = this._global,
            month = name[2] === "prev" ? global.month - 1 : name[2] === "next" ? global.month + 1 : global.month,
            year = month < 0 ? global.year - 1 : month > 11 ? global.year + 1 : global.year,
            date = new Date(year, month = month < 0 ? 11 : month > 11 ? 0 : month, name[0]),
            needFresh;
        if (options.display === "block") {
            if (!options.showTimePicker) {
                // 有时间选择器的时候，需通过点击文档来关闭日历面板
                // 非行内模式则清理并隐藏日历面板
                global.forSelectDate = null;
                // 选取日期时间值并刷新输入框
                this.select(date);
                this.documentClick(event);
            } else {
                this.forSelect(date.getDate(), month, year);
                // 点击日期在上月或下月，则刷新面板
                needFresh = name[2];
            }
        } else {
            needFresh = this.select(date);
        }
        if (needFresh) {
            global.forSelectDate = date.getDate();
            global.year = year;
            global.month = month;
            this.refreshHeader();
            this.refreshBody();
        }
        this.btnClickCount();
    },
    /**
     * 鼠标滚轮滚动翻页事件
     * @param {Event} event
     * @private
     */
    bodyMouseWheel: function (event) {
        var global = this._global,
            direct = event.wheelDelta || -event.detail;
        this.hideMenu("year");
        this.hideMenu("month");
        if (this._options.showTimePicker && (global.timePicker.contains(event.target) || global.timePicker.elems[0] === event.target)) {
            this.setTimer(this.timePickerBtnClick, 15, direct > 0 ? "up" : "down");
        } else if (global.body.contains(event.target)) {
            this.headerBtnClick(direct > 0 ? "Prev" : "Next", "month");
        }
        this.btnClickCount();
        this.cancelBubble = true;
        return this.stopBubble(event);
    },
    /**
     * 鼠标滚轮滚动翻页"年"事件
     * @param {Event} event
     * @private
     */
    yearMenuMouseWheel: function (event) {
        var direct = event.wheelDelta || -event.detail;
        this.btnClickCount();
        this.yearMenuPaging(direct > 0 ? "Prev" : "Next");
        this.cancelBubble = true;
        return this.stopBubble(event);
    },
    /**
     * 上下年月份按钮点击事件
     * @param {String} name Next或Prev
     * @param {String} type year或者month
     * @param {Boolean} disabled 是否被禁用
     * @private
     */
    headerBtnClick: function (name, type, disabled) {
        if (disabled) {
            this.btnClickCount();
            return;
        }
        var global = this._global,
            options = this._options,
            time;
        if (type === "year") {
            do {
                time = this.getUsableYear(name, global.year);
            } while (time.month === null);
        } else {
            time = this.getUsableMonth(name, global.year, global.month);
        }
        this.refreshDate(time.year, time.month);
        this.btnClickCount(type);
    },
    /**
     * 年月份输入框点击事件
     * @param {String} type year或month
     * @private
     */
    headerInputClick: function (type) {
        var global = this._global,
            cType = fastDev.Util.StringUtil.capitalize(type),
            elem;
        this.btnClickCount();
        if (global["is" + cType + "MenuShowed"]) {
            return;
        }
        global[type + "Input"].addClass("ui-datepicker-header-input-over").prop("value", global[type] + (type === "year" ? 0 : 1));
        this.position(global[type + "Menu"], global[type + "Input"]).show();
        if (type === "year") {
            global.pageYear = global.year;
        } else {
            global.monthMenu.find(".ui-datepicker-menu-selected").removeClass("ui-datepicker-menu-selected");
            global.monthMenu.find("[name='" + global.month + "']").addClass("ui-datepicker-menu-selected");
        }
        this["refresh" + cType + "Menu"]();
        (elem = global[type + "Input"].elems[0]).select();
        elem.focus();
        global["is" + cType + "MenuShowed"] = true;
    },
    /**
     * “今天”按钮点击事件
     * @param {Event} event
     * @private
     */
    todayBtnClick: function (event) {
        if (!this._global.todayBtn.attr("forbidden")) {
            this.select(new Date());
            // 点击"今天"按钮，则直接选取今天
            this.documentClick(event);
        } else {
            this.btnClickCount();
        }
    },
    /**
     * “确定”按钮点击事件
     * @param {Event} event
     * @private
     */
    confirmBtnClick: function (event) {
        var global = this._global;
        if (global.forSelectDate) {
            this.validateTime();
            this.select(new Date(global.year, global.month, global.forSelectDate, global.hours, global.minutes, global.seconds));
        }
        this.documentClick(event);
    },
    /**
     * “清除”按钮点击事件
     * @param {Event} event
     * @private
     */
    cleanBtnClick: function (event) {
        var global = this._global;
        // 清理并隐藏日历面板
        this.documentClick(event);
        this.setValue("");
    },
    /**
     * 菜单点击事件
     * @param {Event} event
     * @param {String} type year或month
     * @private
     */
    menuClick: function (event, type) {
        var global = this._global,
            target = fastDev(event.target),
            name = target.prop("name"),
            time = parseInt(name, 10);
        this.btnClickCount();
        if (target.hasClass("ui-datepicker-disabled")) {
            // 被禁用
        } else if (typeof time === "number" && !isNaN(time)) {
            this.refreshDate(type === "year" ? time : global.year, type === "year" ? global.month : time);
            this.hideMenu(type, time, true);
        } else if (type === "year" && (name === "prev" || name === "next")) {
            // 上下翻页
            this.yearMenuPaging(fastDev.Util.StringUtil.capitalize(name));
        }
        // 取消事件冒泡
        return this.stopBubble(event);
    },
    /**
     * 年份菜单上下翻页
     * @param {String} type Next或Prev
     * @private
     */
    yearMenuPaging: function (type) {
        var global = this._global,
            year = this.getUsableYear(type, global.pageYear + (type === "Next" ? 4 : -5)).year;
        if (type === "Next" ? year <= global.maxYear && global.pageYear !== year + 5 : year >= global.minYear && global.pageYear !== year - 4) {
            global.pageYear = year + (type === "Next" ? 5 : -4);
            global["yearMenu" + (type === "Next" ? "Prev" : "Next") + "Btn"].removeClass("ui-datepicker-disabled");
            this.refreshYearMenu();
        }
        // 到达最值，禁用按钮
        if (year === global[type === "Next" ? "maxYear" : "minYear"]) {
            global["yearMenu" + type + "Btn"].addClass("ui-datepicker-disabled");
            global.yearMenuLine.addClass("ui-datepicker-disabled");
        } else {
            global.yearMenuLine.removeClass("ui-datepicker-disabled");
        }
    },
    /**
     * 时间选择器聚焦事件
     * @param {String} name 输入框名
     * @private
     */
    timePickerFocus: function (name) {
        var global = this._global;
        if (!global[name].prop("disabled")) {
            (global.timePickerInputFocus || global[name]).removeClass("ui-datepicker-change");
            (global.timePickerInputFocus = global[name]).addClass("ui-datepicker-change");
            global[name].elems[0].select();
            global[name].elems[0].focus();
        } else {
            (global.timePickerInputFocus || global[name]).elems[0].blur();
        }
    },
    /**
     * 验证时间选择器输入框的时间值是否有效
     * @param {String} name 不传name值则表示非增减时间按钮点击
     * @private
     */
    validateTime: function (name) {
        if (this._options.showTimePicker) {
            var global = this._global,
                focus = global.timePickerInputFocus,
                // 获取所有时间输入框的当前值
                time = this.getTime(name);
            fastDev.apply(global, time);
            this.refreshTimePicker();
        }
    },
    /**
     * 时间选择器按钮点击事件
     * @param {String} name 按钮名称
     * @private
     */
    timePickerBtnClick: function (name) {
        var global = this._global,
            focus = global.timePickerInputFocus || global.timePickerHours,
            time = focus.prop("name")
                .split("timePicker")[1].toLowerCase(),
            value = parseInt(focus.prop("value"), 10) || 0,
            // 时钟点击
            hours = time === "hours" ? value : global.hours,
            // 分钟点击
            minutes = time === "minutes" ? value : global.minutes,
            // 秒种点击
            seconds = time === "seconds" ? value : global.seconds;
        time = global.timePickerInputFocus ? time : "";
        time = name === "up" ? this.getNextTime(hours, minutes, seconds, time) : this.getPrevTime(hours, minutes, seconds, time);
        global.hours = time[0];
        global.minutes = time[1];
        global.seconds = time[2];
        this.refreshTimePicker();
    },
    /**
     * 获取时间选择器聚焦输入框的名称
     * @private
     */
    getTimeFocusName: function () {
        var focus = this._global.timePickerInputFocus;
        return focus ? focus.prop("name").split("timePicker")[1].toLowerCase() : "";
    },
    /**
     * 文档点击事件
     * @param {Event} event
     * @private
     */
    documentClick: function (event) {
        var options = this._options,
            global = this._global;
        this.btnClickCount();
        if (event.target === global.input.elems[0] || !global.isPickerShowed || options.display === "inline" || global.clear) {
            if (options.display === "inline" && !global.clear) {
                // 如果是清理操作，则跳过下面，以确保不会被自己给清理
                // 隐藏菜单时会根据已选值是否改变来刷新日历面板
                this.hideMenu("month");
                this.hideMenu("year");
            }
            global.clear = false;
            return;
        }
        if (options.display === "block") {
            this.hide();
        }
    },
    /**
     * 阻止事件冒泡
     * @param {Event} event
     * @private
     */
    stopBubble: function (event) {
        var global = this._global;
        if (!global.cancelBubble || global.clear) {
            // 非取消事件冒泡或者处于清理状态则返回
            global.cancelBubble = true;
            return;
        }
        fastDev.Event.stopBubble(event);
        return false;
    },
    /**
     * 按钮点击计数
     * 若连续点击某类按钮5次则弹出相应菜单
     * @param {String} name 按钮名
     * @private
     */
    btnClickCount: function (name) {
        var global = this._global,
            clickCount = global[name + "BtnClickCount"] || 0;
        if (name !== "year") {
            global.yearBtnClickCount = 0;
        }
        if (name !== "month") {
            global.monthBtnClickCount = 0;
        }
        if (!name) {
            return;
        }
        if (++clickCount === 5) {
            // 5次连续点击则自动弹出选择菜单
            global[name + "BtnClickCount"] = 0;
            this.headerInputClick(name);
        } else {
            global[name + "BtnClickCount"] = clickCount;
        }
    },
    /**
     * 生成日历面板HTML
     * @param {Number} year 年份
     * @param {Number} month 月份
     * @return {String}
     * @private
     */
    generateBody: function (year, month) {
        var day, cls, disabled, body = [],
            global = this._global,
            today = new Date(),
            sysYear = today.getFullYear(),
            sysMonth = today.getMonth(),
            sysDay = today.getDate(),
            // 上月
            prevMonth = month === 0 ? 11 : month - 1,
            // 上月所在的年
            prevMonthYear = prevMonth === month - 1 ? year : year - 1,
            // 下月
            nextMonth = month === 11 ? 0 : month + 1,
            // 下月所在的年
            nextMonthYear = nextMonth === month + 1 ? year : year + 1,
            // 该月的第一天在星期几（0~6）
            firstDay = new Date(year, month, 1).getDay(),
            // 上月的总天数
            daysInPreMonth = new Date(year, month, 0).getDate(),
            // 该月的总天数
            daysInMonth = new Date(year, month + 1, 0).getDate(),
            // 每周的第一天
            firstDayOfWeek = this._options.firstDayOfWeek,
            // 日历面板上显示的属于上月日子的天数（第一天现默认以星期日开始）
            daysFromPreMonth = firstDay - firstDayOfWeek;
        // 保证总是有上月日子显示，更加符合习惯，也更加对称美观
        daysFromPreMonth = daysFromPreMonth === 0 ? 7 : daysFromPreMonth < 0 ? daysFromPreMonth + 7 : daysFromPreMonth;
        body.push("<tr>");
        for (var i = 0, j; i < 42; i++) {
            if (i > 0 && i % 7 === 0) {
                body.push("</tr><tr>");
            }
            // 周末样式
            if ((j = (firstDayOfWeek + i) % 7) === 0 || j === 6) {
                cls = "ui-datepicker-holiday";
            } else {
                cls = "";
            }
            disabled = false;
            if (i < daysFromPreMonth) {
                // 上月日子
                cls += " ui-datepicker-other";
                day = daysInPreMonth - daysFromPreMonth + i + 1;
                if (this.isDisabled(prevMonthYear, prevMonth, day)) {
                    // 被禁用
                    cls += " ui-datepicker-disabled";
                    disabled = true;
                }
                body.push('<td ' + (disabled ? "" : 'name="' + day + "-" + global.sequence + '-prev"') + ' class="' + cls + '">' + day + '</td>');
            } else if ((day = i - daysFromPreMonth + 1) > daysInMonth) {
                // 下月日子
                day = day - daysInMonth;
                cls += " ui-datepicker-other";
                if (this.isDisabled(nextMonthYear, nextMonth, day)) {
                    // 被禁用
                    cls += " ui-datepicker-disabled";
                    disabled = true;
                }
                body.push('<td ' + (disabled ? "" : 'name="' + day + "-" + global.sequence + '-next"') + ' class="' + cls + '">' + day + '</td>');
            } else {
                // 当前月日子
                if (day === sysDay && month === sysMonth && year === sysYear) {
                    // 今天
                    cls += " ui-datepicker-today";
                }
                if (this.isDisabled(year, month, day)) {
                    // 被禁用
                    cls += " ui-datepicker-disabled";
                    disabled = true;
                } else if (this.isSelected(year, month, day)) {
                    // 已选择值
                    cls += " ui-datepicker-selected";
                }
                body.push('<td ' + (disabled ? "" : 'name="' + day + "-" + global.sequence + '"') + ' class="' + cls + '">' + day + '</td>');
            }
        }
        body.push("</tr>");
        return body.join("");
    },
    /**
     * 刷新年份菜单
     * @param {Number} year 当前选择年份
     * @param {Boolean} highlight 高亮传参年份
     * @private
     */
    refreshYearMenu: function (year, highlight) {
        var global = this._global,
            menu = [],
            selectedYear;
        year = (year && year < 9996 && year > 1004) ? year : year === undefined ? global.pageYear : global.year;
        global.pageYear = year;
        selectedYear = highlight ? this.isDisabled(year) ? undefined : year : global.year;
        for (var y = year - 5; y < year + 5; y++) {
            menu.push('<a name="' + y + '" class="' + (y === selectedYear ? "ui-datepicker-menu-selected" : this.isDisabled(y) ? " ui-datepicker-disabled" : "") + '">' + y + '</a>');
        }
        global.yearMenuPlaceHolder.empty()
            .elems[0].innerHTML = menu.join("");
        global.yearMenu.find(".ui-datepicker-menu-year-page").find(".ui-datepicker-disabled").removeClass("ui-datepicker-disabled");
    },
    /**
     * 刷新月份菜单
     * @param {Number} month 当前月份(0~11)
     * @private
     */
    refreshMonthMenu: function (month) {
        var locale = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一", "十二"],
            global = this._global,
            menu = [];
        month = month || global.month;
        for (var m = 0; m < 12; m++) {
            menu.push('<a name="' + m + '" class="' + (m === global.month ? "ui-datepicker-menu-selected" : this.isDisabled(global.year, m) ? " ui-datepicker-disabled" : "") + '">' + locale[m] + '</a>');
        }
        global.monthMenu.empty()
            .elems[0].innerHTML = menu.join("");
    },
    /**
     * 刷新日历面板
     * @param {Number} year
     * @param {Number} month(0~11)
     * @private
     */
    refreshBody: function (year, month) {
        var global = this._global,
            body = global.body,
            tbody = this.generateBody(year || global.year, parseInt(month || global.month, 10));
        // 清理DOM
        body.empty();
        if (fastDev.Browser.isIE) {
            // IE下table的innerHTML为只读属性
            var div = document.createElement("div");
            div.innerHTML = "<table><tbody>" + tbody + "</tbody></table>";
            global.body = fastDev(div).find("tbody").replace(body);
        } else {
            body.elems[0].innerHTML = tbody;
        }
        // 刷新"今天"按钮
        this.freshUI(true);
    },
    /**
     * 刷新日历头部样式
     * @param {Number} year 年份
     * @param {Number} month 月份(0~11)
     * @private
     */
    refreshHeader: function (year, month) {
        var global = this._global;
        global.yearInput.removeClass("ui-datepicker-header-input-over").prop("value", this.toLocaleYear(year || global.year));
        global.monthInput.removeClass("ui-datepicker-header-input-over").prop("value", this.toLocaleMonth(month || global.month));
        this.refreshHeaderBtn();
    },
    /**
     * 刷新日历头部按钮样式
     * @param {Number} year 当前年份
     * @param {Number} month 当前月份
     * @private
     */
    refreshHeaderBtn: function (year, month) {
        var global = this._global;
        year = year || global.year;
        month = month || global.month;
        global.header.find(".ui-datepicker-header-disabled").removeClass("ui-datepicker-header-disabled");
        if (year === global.maxYear) {
            global.nextYearBtn.parent().addClass("ui-datepicker-header-disabled");
            if (month === global.maxMonth) {
                global.nextMonthBtn.parent().addClass("ui-datepicker-header-disabled");
            }
        }
        if (year === global.minYear) {
            global.prevYearBtn.parent().addClass("ui-datepicker-header-disabled");
            if (month === global.minMonth) {
                global.prevMonthBtn.parent().addClass("ui-datepicker-header-disabled");
            }
        }
    },
    /**
     * 刷新至较近可用时间点
     * @param {Date} date
     * @private
     */
    refreshToRecent: function (date) {
        var global = this._global,
            options = this._options,
            oldYear = global.year,
            oldMonth = global.month,
            oldDate = global.date,
            now, year, month, last, time;
        if (!global.selectedYear) {
            // 以指定日期或当前日期点刷新
            now = date || new Date();
        } else {
            // 以指定日期或已选择日期点刷新
            now = date || global.selectedValue;
            global.hours = now.getHours();
            global.minutes = now.getMinutes();
            global.seconds = now.getSeconds();
        }
        date = new Date(now.getFullYear(), now.getMonth() - 1);
        year = date.getFullYear();
        month = date.getMonth();
        time = this.getUsableMonth("Next", year, month);
        if (time.month === month) {
            time = this.getUsableMonth("Prev", now.getFullYear(), now.getMonth());
        }
        global.year = year = time.year;
        global.month = month = time.month;
        global.date = date = now.getDate();
        if (options.showTimePicker) {
            // 确定当前待选日可用
            last = new Date(year, month + 1, 0).getDate();
            while (this.isDisabled(year, month, date) && !! date) {
                date = date >= global.date ? date === last ? global.date - 1 : date + 1 : date - 1;
            }
            global.date = global.forSelectDate = date === 0 ? global.date : date;
            // 刷新待选日样式
            this.forSelect(global.forSelectDate);
        } else {
            global.forSelectDate = global.selectedDate;
        }
        // 刷新头部
        this.refreshHeader();
        // 刷新面板
        this.refreshBody();
        if (options.showTimePicker) {
            // 获取最近整点
            if (global.hours === undefined || global.hours === null) {
                time = this.getNextTime(now.getHours(), now.getMinutes(), now.getSeconds(), this.getTimeFocusName());
            } else if (this.isDisabled(global.year, global.month, global.forSelectDate, global.hours, global.minutes, global.seconds)) {
                time = this.getNextTime(global.hours, global.minutes, global.seconds, this.getTimeFocusName());
            } else {
                time = null;
            }
            if (time !== null) {
                global.hours = time[0] || 0;
                global.minutes = time[1] || 0;
                global.seconds = time[2] || 0;
            }
            this.refreshTimePicker();
        }
    },
    /**
     * 设置星期标题
     * @param {Number} firstDay 每周的第一天
     * @private
     */
    setWeekdayTitle: function (firstDay) {
        var td = "<td>",
            isIE = fastDev.Browser.isIE,
            weekdayTitle = this._global.weekdayTitle.elems[0],
            title = ["日", "一", "二", "三", "四", "五", "六"];
        for (var i = firstDay || this._options.firstDayOfWeek, j = 0; j < 7; j++, i++) {
            i = i > 6 ? 0 : i;
            if (isIE) {
                //IE下table的innerHTML为只读属性
                td = document.createElement("td");
                td.appendChild(document.createTextNode(title[i]));
                weekdayTitle.appendChild(td);
            } else {
                if (j > 0) {
                    td += "</td><td>";
                }
                td += title[i];
            }
        }
        if (!isIE) {
            weekdayTitle.innerHTML = td + "</td>";
        }
    },
    /**
     * 隐藏菜单
     * @param {String} type year或month
     * @param {Number} time 当前年月值，月份值(1~12)
     * @param {Boolean} noFresh 是否不刷新
     * @private
     */
    hideMenu: function (type, time, noFresh) {
        var global = this._global,
            cType = fastDev.Util.StringUtil.capitalize(type);
        if (global["is" + cType + "MenuShowed"]) {
            if (time === undefined) {
                //验证输入框输入
                time = parseInt(global[type + "Input"].prop("value"), 10) || -1;
                time = type === "year" ? (time >= global.minYear && time <= global.maxYear && !this.isDisabled(time)) ? time : global.year : (time > 0 && time < 13 && !this.isDisabled(global.year, time - 1)) ? time - 1 : global.month;
            }
            global[type] = time;
            if (!noFresh) {
                this.refreshBody(global.year, global.month + "");
            }
            this.refreshHeader(global.year, global.month + "");
            global[type + "Input"].elems[0].blur();
            global[type + "Menu"].hide();
            global["is" + cType + "MenuShowed"] = false;
        }
    },
    /**
     * 获取可用年份
     * @param {String} type Next或Prev
     * @param {Number} year 当前年份
     * @param {Boolean} forMonth 是否是获取月份操作
     * @return {Object}
     * @private
     */
    getUsableYear: function (type, year, forMonth) {
        var global = this._global,
            extremum = global[type === "Next" ? "maxYear" : "minYear"],
            month = global.month,
            maxLoopCount = 2000;
        year = type === "Next" ? year >= extremum ? extremum - 1 : year : year <= extremum ? extremum + 1 : year;
        while (type === "Next" ? ++year < extremum : --year > extremum) {
            if (!this.isDisabled(year)) {
                //可用年份
                // 如果当前月份被禁用，则获取当前年的上或下一个可用月份
                if (!forMonth && this.isDisabled(year, month)) {
                    while (type === "Next" ? --month > -1 : ++month < 12) {
                        if (!this.isDisabled(year, month)) {
                            break;
                        } else if (month === (type === "Next" ? 0 : 11)) {
                            // 获取当前年下或上一个可用的月份
                            month = global.month;
                            while (type === "Next" ? ++month < 12 : --month > -1) {
                                if (!this.isDisabled(year, month)) {
                                    break;
                                } else if (month === (type === "Next" ? 11 : 0)) {
                                    // 当前年根本无可用的月份
                                    month = null;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                }
                break;
            }
            if (!(maxLoopCount--)) {
                break;
            }
        }
        return maxLoopCount ? {
            year: year,
            month: month
        } : {
            year: global[type === "Next" ? "maxYear" : "minYear"],
            month: global[type === "Next" ? "maxMonth" : "minMonth"]
        };
    },
    /**
     * 获取可用月份
     * @param {String} type Next或Prev
     * @param {Number} year 当前年份
     * @param {Number} month 当前月份(0~11)
     * @private
     */
    getUsableMonth: function (type, year, month) {
        var global = this._global,
            usableYear, temp = month,
            maxLoopCount = 2000;
        while (maxLoopCount--) {
            if (month === (type === "Prev" ? 0 : 11)) {
                // 获取下一个可用年份
                if ((usableYear = this.getUsableYear(type, year, true).year) === year) {
                    month = temp;
                    break;
                }
                year = usableYear;
                month = (type === "Prev" ? 11 : 0);
            } else {
                month += (type === "Prev" ? -1 : 1);
            }
            if (!this.isDisabled(year, month)) {
                break;
            }
        }
        return maxLoopCount ? {
            year: year,
            month: month
        } : {
            year: global[type === "Prev" ? "minYear" : "maxYear"],
            month: global[type === "Prev" ? "minMonth" : "maxMonth"]
        };
    },
    /**
     * 获取当前时间的下一个较近的可选时间值
     * @param {Number} hours
     * @param {Number} minutes
     * @param {Number} seconds
     * @param {String} focus
     * @param {Array} original 原值
     * @private
     */
    getNextTime: function (hours, minutes, seconds, focus, original) {
        var global = this._global,
            sPlus = global.showSeconds && (!focus || focus === "seconds" || !! original),
            mPlus = global.showMinutes && (!focus || focus === "minutes" || !! original),
            hPlus = global.showHours && (!focus || focus === "hours"),
            step = focus ? 1 : 15,
            args = Array.prototype.slice.call(arguments, 0, 3),
            prev = false,
            time;
        minutes = focus ? minutes : mPlus ? Math.floor(minutes / 15) * 15 : 0;
        seconds = focus ? seconds : sPlus ? !! original ? 0 : 45 : 0;
        if ( !! original && !this.isDisabled(global.year, global.month, global.forSelectDate, hours, minutes, seconds)) {
            return [hours, minutes, seconds];
        }
        do {
            if (sPlus) {
                hPlus = ((mPlus = !(seconds = ((time = seconds + step) < 60 ? time : 0)) && global.showMinutes) || (!seconds && !global.showMinutes)) && global.showHours;
                if (seconds === 0 && !hPlus && !mPlus) {
                    prev = true;
                    break;
                }
            }
            if (mPlus && !(hPlus = !(minutes = ((time = minutes + step) < 60 ? time : 0)) && global.showHours) && minutes === 0) {
                prev = true;
                break;
            }
            if (hPlus && !(hours = (hours < 23 ? hours + 1 : 0))) {
                prev = true;
                break;
            }
            if ( !! original && (hours > original[0] || (hours === original[0] && minutes >= original[1]) || (hours === original[0] && minutes === original[1] && seconds >= original[2]))) {
                return original;
            }
        } while (this.isDisabled(global.year, global.month, global.forSelectDate, hours, minutes, seconds));
        return prev ? original || this.getNextTime(hours, minutes, seconds, focus, args) : [hours, minutes, seconds];
    },
    /**
     * 获取当前时间的上一个较近的可选时间值
     * @param {Number} hours
     * @param {Number} minutes
     * @param {Number} seconds
     * @param {Array} original 原值
     * @private
     */
    getPrevTime: function (hours, minutes, seconds, focus, original) {
        var global = this._global,
            sPlus = focus ? global.showSeconds && (focus === "seconds" || !! original) : false,
            mPlus = global.showMinutes && (!focus || focus === "minutes" || !! original),
            hPlus = global.showHours && (!focus || focus === "hours"),
            step = focus ? -1 : -15,
            args = Array.prototype.slice.call(arguments, 0, 3),
            next = false,
            time;
        minutes = focus ? minutes : mPlus ? Math.floor(minutes / 15) * 15 : 0;
        if ( !! original && !this.isDisabled(global.year, global.month, global.forSelectDate, hours, minutes, seconds)) {
            return [hours, minutes, seconds];
        }
        do {
            if (sPlus) {
                if ((time = seconds + step) < 0) {
                    seconds = 59;
                    if (!(mPlus = global.showMinutes) && !(hPlus = global.showHours)) {
                        next = true;
                        break;
                    }
                } else {
                    seconds = time;
                    hPlus = mPlus = false;
                }
            }
            if (mPlus) {
                if ((time = minutes + step) < 0) {
                    minutes = focus ? 59 : 45;
                    if (!(hPlus = global.showHours)) {
                        next = true;
                        break;
                    }
                } else {
                    minutes = time;
                    hPlus = false;
                }
            }
            if (hPlus) {
                if ((time = hours - 1) < 0) {
                    hours = 23;
                    next = true;
                    break;
                } else {
                    hours = time;
                }
            }
            if ( !! original && (hours < original[0] || (hours === original[0] && minutes <= original[1]) || (hours === original[0] && minutes === original[1] && seconds <= original[2]))) {
                return original;
            }
        } while (this.isDisabled(global.year, global.month, global.forSelectDate, hours, minutes, seconds));
        return next ? original || this.getPrevTime(hours, minutes, seconds, focus, args) : [hours, minutes, seconds];
    },
    /**
     * 判断该日期是否被禁用
     * @param {Number|Date} year 年
     * @param {Number} month 月(0~11)
     * @param {Number} date 日
     * @param {Number} hours 时
     * @param {Number} minutes 分
     * @param {Number} seconds 秒
     * @return {Boolean}
     * @private
     */
    isDisabled: function (year, month, date, hours, minutes, seconds) {
        var that = this,
            options = that._options,
            global = this._global,
            includes = global.includes,
            excludes = global.excludes,
            time, disabled;
        hours = global.showHours ? hours : undefined;
        minutes = global.showMinutes ? minutes : undefined;
        seconds = global.showSeconds ? seconds : undefined;
        // 最值判断
        if (year === undefined) {
            disabled = true;
        } else if (month === undefined) {
            disabled = year > global.maxYear || year < global.minYear;
        } else if (date === undefined) {
            time = new Date(year, month).getTime();
            disabled = time >= new Date(global.maxYear, global.maxMonth + 1).getTime() || time < new Date(global.minYear, global.minMonth, 1).getTime();
        } else if (hours === undefined) {
            time = new Date(year, month, date).getTime();
            disabled = time >= new Date(global.maxYear, global.maxMonth, global.maxDay + 1).getTime() || time < new Date(global.minYear, global.minMonth, global.minDay).getTime();
        } else if (minutes === undefined) {
            time = new Date(year, month, date, hours).getTime();
            disabled = time >= new Date(global.maxYear, global.maxMonth, global.maxDay, global.maxHours + 1).getTime() || time < new Date(global.minYear, global.minMonth, global.minDay, global.minHours).getTime();
        } else if (seconds === undefined) {
            time = new Date(year, month, date, hours, minutes).getTime();
            disabled = time >= new Date(global.maxYear, global.maxMonth, global.maxDay, global.maxHours, global.maxMinutes + 1).getTime() || time < new Date(global.minYear, global.minMonth, global.minDay, global.minHours, global.minMinutes).getTime();
        } else {
            time = new Date(year, month, date, hours, minutes, seconds).getTime();
            disabled = time >= new Date(global.maxYear, global.maxMonth, global.maxDay, global.maxHours, global.maxMinutes, global.maxSeconds + 1).getTime() || time < new Date(global.minYear, global.minMonth, global.minDay, global.minHours, global.minMinutes, global.minSeconds).getTime();
        }
        // cron表达式判断
        if (!disabled) {
            time = {
                year: year,
                month: month,
                date: date,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
            // 先判断排除
            fastDev.each(excludes || [], function (i, exclude) {
                if (that.contains(exclude, time, true)) {
                    return !(disabled = true);
                }
            });
            // 再判断包含
            if (!disabled) {
                fastDev.each(includes || [], function (i, include) {
                    // 如果含include声明，则拟定待判断值是需要disabled的
                    disabled = true;
                    if (that.contains(include, time)) {
                        return disabled = false;
                    }
                });
            }
        }
        return disabled;
    },
    /**
     * 判断表达式所指日期是否包含指定的日期值
     * @param {Object} items 已解析的表达式项
     * @param {Object} item 需验证的日期对象（POJO）
     * @param {Boolean} exclude 是否是exclude表达式判断
     * @return {Boolean}
     * @private
     */
    // 将此方法拆分子方法，一个方法273行不方便维护
    contains: function (items, item, exclude) {
        var that = this,
            Y = item.year,
            M = item.month,
            D = item.date,
            h = item.hours,
            m = item.minutes,
            s = item.seconds,
            isExcluded,
            // 需匹配的域个数
            length = items.length,
            // 初始限制
            yearLimit = true,
            monthLimit = true,
            dateLimit = true,
            dayLimit = true,
            weekLimit = true,
            hoursLimit = true,
            minutesLimit = true,
            secondsLimit = true;
        // 判断开始
        fastDev.each(["Y", "M", "D", "d", "dc", "h", "m", "s"], function (i, name) {
            switch (name) {
                // 年
                case "Y":
                    if (items[name] === undefined) {
                        if (exclude && length === 0) {
                            // 排除操作，则检查是否还有其他域限制
                            // 不含子域声明，则确定需排除
                            return !(isExcluded = true);
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
    /**
     * 应用二分查找判断给定的元素是否在数组中
     * @param {Array} array 查找集
     * @param {Number} elem 被查找的元素
     * @param {Function} sorter 排序比较函数，应用在需要对数组排序时
     * @private
     */
    inArray: function (array, value, sorter) {
        if (!array) {
            return false;
        }
        if (sorter) {
            array.sort(typeof sorter === "function" ? sorter : function (a, b) {
                return a - b;
            });
        }
        var left = 0,
            right = array.length - 1,
            middle;
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
    },
    /**
     * 解析cron日期表达式配置
     * @private
     */
    parseCronExpression: function () {
        var that = this,
            options = that._options,
            global = that._global,
            fn = fastDev.Util.StringUtil.trim;
        fastDev.each(["includes", "excludes"], function (i, name) {
            var array = [];
            if (typeof options[name] === "string") {
                options[name] = fn(options[name]);
                array.push(that.cronParser.parse(options[name], true)
                    .schedules[0]);
            } else if (fastDev.isArray(options[name])) {
                fastDev.each(options[name], function (i, val) {
                    array.push(that.cronParser.parse(fn(val), true)
                        .schedules[0]);
                });
            }
            global[name] = array;
        });
        // 根据表达式解析结果重新限定最大与最小日期
        that.mergeExtremum();
    },
    /**
     * 根据表达式查找且合并日期极值点
     * @private
     */
    mergeExtremum: function () {
        var that = this,
            global = that._global,
            includes = global.includes,
            maxYear = 0,
            maxMonth = -1000,
            minYear = 999999,
            minMonth = 999999,
            length;
        fastDev.each(includes, function (i, include) {
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
        fastDev.each(["max", "min"], function (i, n) {
            var inc = i ? 1 : -1,
                left = global[n + "Year"],
                right = global[(i ? "max" : "min") + "Year"],
                cur = {}, d, D;
            for (var Y = left; Y * inc <= right * inc; Y += inc) {
                if (!that.isDisabled(Y)) {
                    cur.Y = Y;
                    for (var M = i ? 0 : 11, m = i ? 11 : 0; M * inc <= m * inc; M += inc) {
                        if (!that.isDisabled(Y, M)) {
                            cur.M = M;
                            d = new Date(Y, M + 1, 0).getDate();
                            for (D = i ? 1 : d, d = i ? d : 1; D * inc <= d * inc; D += inc) {
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
    /**
     * 判断日期值是否为当前所选值
     * @param {Number} year
     * @param {Number} month
     * @param {Number} date
     * @return {Boolean}
     * @private
     */
    isSelected: function (year, month, date) {
        var global = this._global;
        return global.forSelectDate === date || (global.selectedDate === date && global.selectedMonth === month && global.selectedYear === year && global.forSelectDate === date);
    },
    /**
     * 判断是否需要显示时间选择器
     * @private
     */
    isShowTimePicker: function () {
        var options = this._options;
        if (options.display === "inline") {
            return false;
        }
        var global = this._global,
            format = options.format,
            // 查找小时域
            h = /.*[Hh]{1,2}.*/g.test(format),
            // 查找分钟域
            m = /.*m{1,2}.*/g.test(format),
            // 查找秒钟域
            s = /.*s{1,2}.*/g.test(format),
            //判断
            isShow = options.showTimePicker === true ? true : options.showTimePicker === false ? false : (h || m || s);
        if (isShow) {
            global.showHours = h;
            global.showMinutes = m;
            global.showSeconds = s;
        }
        return isShow;
    },
    /**
     * 预备选取
     * @param {Number} date 日
     * @param {Number} month 月（0~11）
     * @param {Number} year 年
     * @private
     */
    forSelect: function (date, month, year) {
        var options = this._options,
            global = this._global;
        global.body.find(".ui-datepicker-selected").removeClass("ui-datepicker-selected");
        global.body.find("[name='" + date + "-" + global.sequence + "']").addClass("ui-datepicker-selected");
        // 待选日期标记
        if (options.showTimePicker) {
            global.forSelectDate = date;
            if (this.isDisabled(year || global.year, month === undefined ? global.month : month, date, global.hours, global.minutes, global.seconds)) {
                // 需重新判断当天时间选择值是否有效
                this.timePickerBtnClick("up");
            }
        }
    },
    /**
     * 选择指定的日期时间
     * @param {Date} date 日期对象
     * @return {Boolean} 是否已接受此值
     * @private
     */
    select: function (date) {
        var options = this._options,
            global = this._global,
            value;
        date = this.toValidDate(date);
        if ( !! date && this.isDisabled(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())) {
            return false;
        }
        value = date ? fastDev.Util.DateUtil.format(date, options.format) : "";
        if (options.onPick.call(this, date, value) !== false) {
            options.value = value;
            if (options.display !== "inline") {
                global.input.prop("value", value);
                global.input.elems[0].blur();
            }
            fastDev.each(["After", "Before"], function (i, name) {
                name = "time" + name;
                global[name] = options[name].alias === "DatePicker" ? options[name] : fastDev.getInstance(options[name]);
            });
            if ( !! global.timeAfter && global.timeAfter._global.initialized && typeof global.timeAfter.setMaxDate === "function") {
                global.timeAfter.setMaxDate(date);
            }
            if ( !! global.timeBefore && global.timeBefore._global.initialized && typeof global.timeBefore.setMinDate === "function") {
                global.timeBefore.setMinDate(date);
            }
            fastDev.apply(global, {
                selectedYear: date ? date.getFullYear() : null,
                selectedMonth: date ? date.getMonth() : null,
                selectedDate: date ? date.getDate() : null,
                selectedValue: date,
                hours: date ? date.getHours() : null,
                minutes: date ? date.getMinutes() : null,
                seconds: date ? date.getSeconds() : null
            });
            return true;
        }
    },
    /**
     * 获取有效时间值
     * @param {String} name
     * @return {Object}
     * @private
     */
    getTime: function (name) {
        var global = this._global,
            options = this._options,
            hours, minutes, seconds, time;
        hours = parseInt(global.timePickerHours.prop("value"), 10);
        hours = isNaN(hours) ? 0 : hours > 23 ? 23 : hours < 0 ? 0 : hours;
        minutes = parseInt(global.timePickerMinutes.prop("value"), 10);
        minutes = isNaN(minutes) ? 0 : minutes > 59 ? 59 : minutes < 0 ? 0 : minutes;
        seconds = parseInt(global.timePickerSeconds.prop("value"), 10);
        seconds = isNaN(seconds) ? 0 : seconds > 59 ? 59 : seconds < 0 ? 0 : seconds;
        if (!this.isDisabled(global.year, global.month, global.forSelectDate, hours, minutes, seconds)) {
            return {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        } else {
            time = (name && (name === "timePickerUpBtn" || name === "timePickerDownBtn")) ? [hours, minutes, seconds] : this.getNextTime(hours, minutes, seconds, this.getTimeFocusName());
            return {
                hours: time[0],
                minutes: time[1],
                seconds: time[2]
            };
        }
    },
    /**
     * 刷新时间选择器
     * @param {Number} hours 小时
     * @param {Number} minutes 分钟
     * @param {Number} seconds 秒钟
     * @private
     */
    refreshTimePicker: function (hours, minutes, seconds) {
        if (this._options.showTimePicker) {
            var global = this._global,
                fn = fastDev.Util.NumberUtil.pad;
            // 时
            hours = global.showHours ? fn(hours || global.hours, 2) : "00",
            // 分
            minutes = global.showMinutes ? fn(minutes || global.minutes, 2) : "00",
            // 秒
            seconds = global.showSeconds ? fn(seconds || global.seconds, 2) : "00";
            global.timePickerHours.prop("value", hours);
            global.timePickerMinutes.prop("value", minutes);
            global.timePickerSeconds.prop("value", seconds);
        }
    },
    /**
     * 定位层
     * @param {fastDev.Core.DomObject} obj 需定位的对象
     * @param {fastDev.Core.DomObject} elem 相对其定位的元素
     * @return {fastDev.Core.DomObject} obj 定位对象
     * @private
     */
    position: function (obj, elem) {
        var win = fastDev(window),
            doc = fastDev(document),
            winWidth = win.width(),
            winHeight = win.height(),
            docLeft = doc.scrollLeft(),
            docTop = doc.scrollTop(),
            offset = elem.offset(),
            elemHeight = elem.outerHeight() + 3,
            height = offset.top + elemHeight,
            objHeight = obj.outerHeight() + 2;
        // 需要在可视区域内以最佳呈现视角来呈现
        // 目前不考虑跨iframe展示的情况
        return obj.css({
            left: Math.max(docLeft + 2, Math.min(offset.left - 1, winWidth - obj.outerWidth() + docLeft - 2)),
            top: height + objHeight > winHeight + docTop ? offset.top - docTop < winHeight + docTop - offset.top - elemHeight ? height : offset.top - objHeight : height,
            zIndex: obj === this._global.picker ? this._options.zIndex : this._options.zIndex + 1
        });
    },
    /**
     * 显示日历面板
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    show: function () {
        var global = this._global,
            options = this._options;
        if (global.isPickerShowed || options.readonly) {
            // 已显示日历面板或者只读状态，则返回
            return this;
        }
        // 显示日历面板
        global.picker.show();
        // 刷新面板
        this.refreshToRecent( !! global.selectedYear ? global.selectedValue : new Date());
        if (options.display === "inline") {
            global.pageYear = global.year;
        } else {
            // 定位
            this.position(global.picker, global.input);
            // 聚焦
            global.input.parent().addClass("ui-form-focus");
            global.trigger.parent().addClass("ui-form-trigger-over");
        }
        // 绑定隐藏或刷新日历面板事件
        global.docClickEventHandle = fastDev.setFnInScope(this, this.documentClick);
        fastDev(document.documentElement).bind("click", global.docClickEventHandle);
        global.clear = true;
        global.isPickerShowed = true;
        return this;
    },
    /**
     * 隐藏日历面板
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    hide: function () {
        var options = this._options,
            global = this._global;
        // 隐藏面板
        this.hideMenu("month");
        this.hideMenu("year");
        global.picker.hide();
        if (options.display === "block") {
            // 因为点击面板后会取消事件冒泡（非行内模式下），所以关闭面板时解绑此事件非常有必要，以免影响其他控件的doc click事件监听
            fastDev(document.documentElement).unbind("click", global.docClickEventHandle);
            // 失焦
            global.input.parent().removeClass("ui-form-focus");
            global.trigger.parent().removeClass("ui-form-trigger-over");
            global.onBlur();
        }
        global.forSelectDate = null;
        global.isPickerShowed = false;
        return this;
    },
    /**
     * 获取本地化月份值
     * @param {Number} month 月
     * @return {String}
     * @private
     */
    toLocaleMonth: function (month) {
        var locale = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
        return locale[month];
    },
    /**
     * 获取本地化年份值
     * @param {Number} year 年
     * @return {String}
     * @private
     */
    toLocaleYear: function (year) {
        return year + "年";
    },
    /**
     * 获取有效日期对象
     * @param {String|Date} date 需验证的日期字符串或对象
     * @return {Date} 若为有效日期，则返回解析后的日期对象，否则返回null
     */
    toValidDate: function (date) {
        if (date) {
            if (typeof date === "string") {
                date = fastDev.Util.DateUtil.parse(fastDev.Util.StringUtil.trim(date));
            }
            var value = date.toString();
            if (!(value === "Invalid Date" || value === "NaN")) {
                return date;
            }
        }
        return null;
    },
    /**
     * cron日期表达式解析器
     * @return {Object}
     * @private
     */
    // 为何使用闭包而不是直接存放在DatePicker中
    cronParser: (function () {
        // 常量配置
        var NAMES = {
            JAN: 1,
            // 一月
            FEB: 2,
            // 二月
            MAR: 3,
            // 三月
            APR: 4,
            // 四月
            MAY: 5,
            // 五月
            JUN: 6,
            // 六月
            JUL: 7,
            // 七月
            AUG: 8,
            // 八月
            SEP: 9,
            // 九月
            OCT: 10,
            // 十月
            NOV: 11,
            // 十一月
            DEC: 12,
            // 十二月
            SUN: 1,
            // 星期日
            MON: 2,
            // 星期一
            TUE: 3,
            // 星期二
            WED: 4,
            // 星期三
            THU: 5,
            // 星期四
            FRI: 6,
            // 星期五
            SAT: 7 // 星期六
        };
        // 表达式各子域参数范围配置
        //[子域位序,最小值,最大值]
        var FIELDS = {
            s: [0, 0, 59],
            // 秒
            m: [1, 0, 59],
            // 分钟
            h: [2, 0, 23],
            // 小时
            D: [3, 1, 31],
            // 日
            M: [4, 1, 12],
            // 月
            Y: [6, 1970, 2099],
            // 年
            d: [5, 1, 7] // 星期
        };
        // 取常量值或者计算偏移量的值
        var getValue = function (value, offset) {
            return isNaN(value) ? NAMES[value] : +value + (offset || 0);
        };
        // 克隆一份计划表
        var cloneSchedule = function (sched) {
            var clone = {}, field;
            for (field in sched) {
                if (field !== 'dc' && field !== 'd') {
                    clone[field] = sched[field].slice(0);
                }
            }
            return clone;
        };
        // 按给定的增量获取指定范围内的值
        var add = function (sched, name, min, max, inc) {
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
        var addHash = function (schedules, curSched, value, hash) {
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
        var addWeekday = function (s, curSched, value) {
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
        var addRange = function (item, curSched, name, min, max, offset) {
            var incSplit = item.split('/'),
                inc = +incSplit[1],
                range = incSplit[0],
                value;
            if (range !== '*' && range !== '0') {
                var rangeSplit = range.split('-');
                min = getValue((value = rangeSplit[0]) ? value : min, offset);
                max = getValue((value = rangeSplit[1]) ? value : max, offset);
            }
            add(curSched, name, min, max, inc);
        };
        // 解析表达式子域
        var parse = function (item, s, name, min, max, offset) {
            var value, split, schedules = s.schedules,
                curSched = schedules[schedules.length - 1];
            // 月份的最后一天(L)
            if (item === 'L') {
                item = min - 1;
            }
            // 单一值(x)
            if ((value = getValue(item, offset)) !== undefined) {
                add(curSched, name, value, value);
            }
            // 离给定日子最近的工作日，仅能应用于"日"域上(xW)
            else if ((value = getValue(item.replace('W', ''), offset)) !== undefined) {
                addWeekday(s, curSched, value);
            }
            // 月中最后一个星期几，仅能应用于"星期"域上(xL)
            else if ((value = getValue(item.replace('L', ''), offset)) !== undefined) {
                addHash(schedules, curSched, value, min - 1);
            }
            // 位于月中第几周的星期几，仅能应用于"星期"域上(x#y)
            else if ((split = item.split('#')).length === 2) {
                value = getValue(split[0], offset);
                addHash(schedules, curSched, value, getValue(split[1]));
            }
            // 范围值(x-y or x-y/z or */z or 0/z)
            else {
                addRange(item, curSched, name, min, max, offset);
            }
        };
        // 判断是否是哈希值指定
        var isHash = function (item) {
            return typeof item === "string" && (item.indexOf('#') > -1 || item.indexOf('L') > 0);
        };
        // 对散列值声明进行排序
        var itemSorter = function (a, b) {
            return isHash(a) && !isHash(b) ? 1 : (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0);
        };
        // 解析表达式
        var parseExpr = function (expr) {
            var schedule = {
                schedules: [{}]
            }, components = fastDev.Util.StringUtil.trim(expr).replace(/\t/g, ' ').split(/\s+/),
                field, f, component, items;
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
                    for (i = 0; i < length; i++) {
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
            parse: function (expr, hasSeconds) {
                // 星期与月份非数字符号值不区分大小写
                var e = expr.toUpperCase();
                return parseExpr(hasSeconds ? e : '0 ' + e);
            }
        };
    })(),
    /**
     * 设置日期时间值
     * @param {String|Date} value 字符串形式或日期对象形式的日期时间值
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setValue: function (value) {
        this.select(value);
        if (this._options.display === "inline") {
            this.refreshToRecent();
        }
        return this;
    },
    /**
     * 获取日期时间值
     * @return {String} 按配置格式格式化后的日期时间值
     */
    getValue: function () {
        return this._options.value;
    },
    /**
     * 获取控件当前值的日期对象
     * @return {Date} 当前日期对象或者null
     */
    getDate: function () {
        return this._global.selectedValue || null;
    },
    /**
     * 设置并刷新Cron日期表达式
     * 请注意，若要重设includes与excludes属性，请一并设置，不要通过调用2次该方法来分开设置。
     * 重设表达式后，会重新解析并刷新最大与最小日期值。
     * 若只指定一个参数，则另外一个参数对应的表达式其历史属性值仍然会保持有效状态，并不会被自动清除。
     * @param {String|Array} includes 可选日期表达式
     * @param {String|Array} excludes 禁选日期表达式
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setExpressions: function (includes, excludes) {
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
    /**
     * 移除并刷新Cron日期表达式
     * 移除表达式后，会重新解析现有表达式
     * @param {Boolean} includes 是否移除可选日期表达式
     * @param {Boolean} excludes 是否移除禁选日期表达式
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    removeExpressions: function (includes, excludes) {
        var options = this._options,
            global = this._global;
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
    /**
     * 设置极值日期
     * @param {String} type max或min
     * @return {fastDev.Ui.DatePicker}
     * @private
     */
    setExtremumDate: function (date, type) {
        var global = this._global,
            options = this._options,
            extremum, time;
        date = this.toValidDate(date);
        if (date && (time = date.getTime()) <= global.maxDate.getTime() && time >= global.minDate.getTime()) {
            extremum = options[type + "Date"] = date;
        } else {
            extremum = options[type + "Date"] = global[type + "Date"];
        }
        global[type + "Year"] = extremum.getFullYear();
        global[type + "Month"] = extremum.getMonth();
        global[type + "Day"] = extremum.getDate();
        global[type + "Hours"] = extremum.getHours();
        global[type + "Minutes"] = extremum.getMinutes();
        global[type + "Seconds"] = extremum.getSeconds();
        if (type === "max") {
            if (extremum.getTime() < options.minDate.getTime()) {
                this.setMinDate(global.minDate);
            }
            if (global.selectedValue && global.selectedValue.getTime() > extremum.getTime()) {
                this.setValue("");
            }
        } else {
            if (extremum.getTime() > options.maxDate.getTime()) {
                this.setMaxDate(global.maxDate);
            }
            if (global.selectedValue && global.selectedValue.getTime() < extremum.getTime()) {
                this.setValue("");
            }
        }
        if (options.display === "inline") {
            this.refreshToRecent();
        }
        return this;
    },
    /**
     * 设置最小日期限制
     * @param {String|Date} date 日期时间字符串或日期对象
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setMinDate: function (date) {
        return this.setExtremumDate(date, "min");
    },
    /**
     * 设置最大日期限制
     * @param {String|Date} date 日期时间字符串或日期对象
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setMaxDate: function (date) {
        return this.setExtremumDate(date, "max");
    },
    /**
     * 设置只读
     * @param {Boolean} readonly
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setReadOnly: function (readonly) {
        var options = this._options;
        if (options.display === "inline" || !! options.disabled) {
            return;
        }
        options.readonly = readonly;
        return this;
    },
    /**
     * 启用控件
     */
    enable: function () {
        this._options.disabled = false;
        this.setReadOnly(false);
        this._global.input.prop("disabled", "").parent().removeClass("ui-form-disabled");
    },
    /**
     * 禁用控件
     */
    disable: function () {
        this._options.disabled = false;
        this.setReadOnly(true);
        this._options.disabled = true;
        this._global.input.prop("disabled", "disabled").parent().addClass("ui-form-disabled");
    },
    /**
     * 显示农历提示标签
     * @param {Array} name 日期项名
     * @return {String} tips
     * @private
     */
    showLunarTips: function (name) {
        var global = this._global,
            month = name[2] === "prev" ? global.month - 1 : name[2] === "next" ? global.month + 1 : global.month,
            year = month < 0 ? global.year - 1 : month > 11 ? global.year + 1 : global.year,
            date = new Date(year, month = month < 0 ? 11 : month > 11 ? 0 : month, name[0]);
        return this.getLunarTips(date);
    },
    /**
     * 获取农历提示信息
     * @param {Date} date 阳历日期
     * @return {String}
     * @private
     */
    getLunarTips: function (date) {
        if (date.getTime() < new Date(1900, 0, 31).getTime()) {
            return "";
        }
        var lunarDate = this.getLunarDate(date),
            solarTerm, festival, tips = [];
        if (lunarDate.isLeap) {
            tips.push("闰");
        }
        tips.push(this.localeMonth[lunarDate.month - 1] + "月");
        tips.push(this.getLocaleDate(lunarDate.date));
        tips.push(" " + lunarDate.zodiac + "年");
        // 二十四节气
        solarTerm = this.getSolarTerm(date);
        if ( !! solarTerm) {
            tips.push(" " + solarTerm);
        }
        // 佳节
        festival = this.getFestival(lunarDate, date);
        if ( !! festival) {
            tips.push(" " + festival);
        }
        return tips.join("");
    },
    /**
     * 获取月历（即阴历）日期
     * @param {Date} date 阳历日期
     * @return {Object}
     * @private
     */
    getLunarDate: function (date) {
        var year, month, day, leap, isLeap, days,
        // 根据世界时，取得阳历日期与1900年1月1日0点0时0分所相差的天数
        offset = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
        for (year = 1900; year < 2100 && offset > 0; year += 1) {
            days = this.getDaysOfLunarYear(year);
            offset -= days;
        }
        if (offset < 0) {
            offset += days;
            year -= 1;
        }
        leap = this.getLeapMonthOfYear(year);
        isLeap = false;
        for (month = 1; month < 13 && offset > 0; month += 1) {
            if (leap > 0 && month === leap + 1 && isLeap === false) {
                month -= 1;
                isLeap = true;
                days = this.getLeapDaysOfYear(year);
            } else {
                days = this.getDaysOfLunarMonth(year, month);
            }
            if (isLeap === true && month === leap + 1) {
                isLeap = false;
            }
            offset -= days;
        }
        if (offset === 0 && leap > 0 && month === leap + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                month += 1;
            }
        }
        if (offset < 0) {
            offset += days;
            month -= 1;
        }
        day = offset + 1;
        return {
            year: year,
            month: month,
            date: day,
            isLeap: isLeap,
            zodiac: this.zodiac[(year - 4) % 12]
        };
    },
    /**
     * 获取阴历在给定年的总天数
     * @param {Number} year 农历年份
     * @return {Number}
     * @private
     */
    getDaysOfLunarYear: function (year) {
        var table = this.lunarTable,
            sum = 348;
        for (var i = 0x8000; i > 0x8; i >>= 1) {
            sum += (table[year - 1900] & i) ? 1 : 0;
        }
        return sum + this.getLeapDaysOfYear(year);
    },
    /**
     * 获取农历某年某月份的总天数
     * @param {Number} year 农历年份
     * @param {Number} month 农历月份
     * @return {Number}
     * @private
     */
    getDaysOfLunarMonth: function (year, month) {
        return (this.lunarTable[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    },
    /**
     * 获取当前年闰月的总天数
     * @param {Number} year 农历年份
     * @return {Number}
     * @private
     */
    getLeapDaysOfYear: function (year) {
        return this.getLeapMonthOfYear(year) ? (this.lunarTable[year - 1899] & 0xf) === 0xf ? 30 : 29 : 0;
    },
    /**
     * 获取当前年闰月所在月份
     * @param {Number} year 农历年份
     * @return {Number} 0-12，0表示无闰月
     * @private
     */
    getLeapMonthOfYear: function (year) {
        var leapMonth = this.lunarTable[year - 1900] & 0xf;
        return leapMonth === 0xf ? 0 : leapMonth;
    },
    /**
     * 获取当前年指定序号的节气所在的阳历日子
     * 节气序号从0开始，依次为"小寒"、"大寒"、...
     * @param {Number} year 阳历年份
     * @param {Number} num 节气序号
     * @return {Number}
     * @private
     */
    getDayWithSolarTerm: function (year, num) {
        return (this.solarTermBase[num] + Math.floor(this.solarTermOS.charAt((Math.floor(this.solarTermIdx.charCodeAt(year - 1900)) - 48) * 24 + num)));
    },
    /**
     * 获取当天所拥有的二十四节气值
     * @param {Date} date 当前阳历日期
     * @return {String} 当前日期无节气则返回空字符串
     * @private
     */
    getSolarTerm: function (date) {
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            num = date.getMonth() * 2;
        if (this.getDayWithSolarTerm(year, num) === day || this.getDayWithSolarTerm(year, ++num) === day) {
            return this.solarTerm[num];
        }
        return "";
    },
    /**
     * 获取节日信息
     * @param {Date} solar 当前阳历日期
     * @param {Object} lunar 当前农历日期
     * @return {String} 当前日期无佳节，则返回空字符串
     * @private
     */
    getFestival: function (lunar, solar) {
        var small = this.getDaysOfLunarMonth(lunar.year, lunar.month) === 29,
            month = solar.getMonth() + 1,
            date = solar.getDate(),
            res = "",
            festi, day, i;
        if (!lunar.isLeap) {
            for (i in this.lunarFestival) {
                festi = this.lunarFestival[i].split(" ");
                if (parseInt(festi[0], 10) === lunar.month) {
                    if (((day = parseInt(festi[1], 10)) === lunar.date)) {
                        res = festi[2];
                        break;
                    }
                    if (small && lunar.month === 12 && lunar.date === 29 && day === 30) {
                        res = festi[2];
                        break;
                    }
                }
            }
        }
        for (i in this.solarFestival) {
            festi = this.solarFestival[i].split(" ");
            if (parseInt(festi[0], 10) === month && parseInt(festi[1], 10) === date) {
                res = res ? res + " " + festi[2] : festi[2];
                break;
            }
        }
        return res;
    },
    /**
     * 获取本地化日期（中文）
     * @param {Number} day 日子
     * @return {String}
     * @private
     */
    getLocaleDate: function (day) {
        switch (day) {
            case 10:
                return '初十';
            case 20:
                return '二十';
            case 30:
                return '三十';
            default:
                return ['初', '十', '廿', '卅'][Math.floor(day / 10)] + ["日", '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][day % 10];
        }
    },
    // 使用的是查表方式，每一个数组元素即保存了一个年份的农历信息（转换成二进制，每位一个信息点）
    lunarTable: [0x4bd8, 0x4ae0, 0xa570, 0x54d5, 0xd260, 0xd950, 0x5554, 0x56af, 0x9ad0, 0x55d2, 0x4ae0, 0xa5b6, 0xa4d0, 0xd250, 0xd295, 0xb54f, 0xd6a0, 0xada2, 0x95b0, 0x4977, 0x497f, 0xa4b0, 0xb4b5, 0x6a50, 0x6d40, 0xab54, 0x2b6f, 0x9570, 0x52f2, 0x4970, 0x6566, 0xd4a0, 0xea50, 0x6a95, 0x5adf, 0x2b60, 0x86e3, 0x92ef, 0xc8d7, 0xc95f, 0xd4a0, 0xd8a6, 0xb55f, 0x56a0, 0xa5b4, 0x25df, 0x92d0, 0xd2b2, 0xa950, 0xb557, 0x6ca0, 0xb550, 0x5355, 0x4daf, 0xa5b0, 0x4573, 0x52bf, 0xa9a8, 0xe950, 0x6aa0, 0xaea6, 0xab50, 0x4b60, 0xaae4, 0xa570, 0x5260, 0xf263, 0xd950, 0x5b57, 0x56a0, 0x96d0, 0x4dd5, 0x4ad0, 0xa4d0, 0xd4d4, 0xd250, 0xd558, 0xb540, 0xb6a0, 0x95a6, 0x95bf, 0x49b0, 0xa974, 0xa4b0, 0xb27a, 0x6a50, 0x6d40, 0xaf46, 0xab60, 0x9570, 0x4af5, 0x4970, 0x64b0, 0x74a3, 0xea50, 0x6b58, 0x5ac0, 0xab60, 0x96d5, 0x92e0, 0xc960, 0xd954, 0xd4a0, 0xda50, 0x7552, 0x56a0, 0xabb7, 0x25d0, 0x92d0, 0xcab5, 0xa950, 0xb4a0, 0xbaa4, 0xad50, 0x55d9, 0x4ba0, 0xa5b0, 0x5176, 0x52bf, 0xa930, 0x7954, 0x6aa0, 0xad50, 0x5b52, 0x4b60, 0xa6e6, 0xa4e0, 0xd260, 0xea65, 0xd530, 0x5aa0, 0x76a3, 0x96d0, 0x4afb, 0x4ad0, 0xa4d0, 0xd0b6, 0xd25f, 0xd520, 0xdd45, 0xb5a0, 0x56d0, 0x55b2, 0x49b0, 0xa577, 0xa4b0, 0xaa50, 0xb255, 0x6d2f, 0xada0, 0x4b63, 0x937f, 0x49f8, 0x4970, 0x64b0, 0x68a6, 0xea5f, 0x6b20, 0xa6c4, 0xaaef, 0x92e0, 0xd2e3, 0xc960, 0xd557, 0xd4a0, 0xda50, 0x5d55, 0x56a0, 0xa6d0, 0x55d4, 0x52d0, 0xa9b8, 0xa950, 0xb4a0, 0xb6a6, 0xad50, 0x55a0, 0xaba4, 0xa5b0, 0x52b0, 0xb273, 0x6930, 0x7337, 0x6aa0, 0xad50, 0x4b55, 0x4b6f, 0xa570, 0x54e4, 0xd260, 0xe968, 0xd520, 0xdaa0, 0x6aa6, 0x56df, 0x4ae0, 0xa9d4, 0xa4d0, 0xd150, 0xf252, 0xd520],
    // 十二生肖
    zodiac: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    localeMonth: ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"],
    // 二十四节气
    solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],
    solarTermBase: [4, 19, 3, 18, 4, 19, 4, 19, 4, 20, 4, 20, 6, 22, 6, 22, 6, 22, 7, 22, 6, 21, 6, 21],
    solarTermIdx: "0123415341536789:;<9:=<>:=1>?012@015@015@015AB78CDE8CD=1FD01GH01GH01IH01IJ0KLMN;LMBEOPDQRST0RUH0RVH0RWH0RWM0XYMNZ[MB\\]PT^_ST`_WH`_WH`_WM`_WM`aYMbc[Mde]Sfe]gfh_gih_Wih_WjhaWjka[jkl[jmn]ope]qph_qrh_sth_W",
    solarTermOS: "211122112122112121222211221122122222212222222221222122222232222222222222222233223232223232222222322222112122112121222211222122222222222222222222322222112122112121222111211122122222212221222221221122122222222222222222222223222232222232222222222222112122112121122111211122122122212221222221221122122222222222222221211122112122212221222211222122222232222232222222222222112122112121111111222222112121112121111111222222111121112121111111211122112122112121122111222212111121111121111111111122112122112121122111211122112122212221222221222211111121111121111111222111111121111111111111111122112121112121111111222111111111111111111111111122111121112121111111221122122222212221222221222111011111111111111111111122111121111121111111211122112122112121122211221111011111101111111111111112111121111121111111211122112122112221222211221111011111101111111110111111111121111111111111111122112121112121122111111011111121111111111111111011111111112111111111111011111111111111111111221111011111101110111110111011011111111111111111221111011011101110111110111011011111101111111111211111001011101110111110110011011111101111111111211111001011001010111110110011011111101111111110211111001011001010111100110011011011101110111110211111001011001010011100110011001011101110111110211111001010001010011000100011001011001010111110111111001010001010011000111111111111111111111111100011001011001010111100111111001010001010000000111111000010000010000000100011001011001010011100110011001011001110111110100011001010001010011000110011001011001010111110111100000010000000000000000011001010001010011000111100000000000000000000000011001010001010000000111000000000000000000000000011001010000010000000",
    // 传统佳节
    lunarFestival: ["01 01 春节", "01 15 元宵节", "05 05 端午节", "07 07 七夕", "07 15 中元节", "08 15 中秋节", "09 09 重阳节", "12 08 腊八节", "12 23 小年", "12 30 除夕"],
    // 公历节日
    solarFestival: ["01 01 元旦", "02 14 情人节", "03 08 妇女节", "03 12 植树节", "03 15 消费者权益日", "04 01 愚人节", "05 01 劳动节", "05 04 青年节", "06 01 儿童节", "08 01 建军节", "09 10 教师节", "10 01 国庆节", "12 24 平安夜", "12 25 圣诞节"]
});
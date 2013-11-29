/*
 * 日历控件（主体）
 * @class fastDev.Ui.DatePicker
 * @extends fastDev.Ui.Box
 * @author chengwei
 */
fastDev.define("fastDev.Ui.DatePicker", {
    alias: "DatePicker",
    extend: "fastDev.Ui.Box",
    _options: {
        /*
         * 控件宽度
         * @type {String}
         */
        width: "160px",
        /*
         * 索引重置
         * @type {Number}
         */
        zIndex: 2012,
        /*
         * 设定日期值
         * @type {String}
         */
        value: "",
        /*
         * 输入框名称
         * @type {String}
         */
        name: "",
        /*
         * 日期选择的触发方式
         * <p>- button: 仅仅在点击图标按钮时触发日期选择</p>
         * <p> -click: 输入框或图标上发生点击事件时触发</p>
         * <p> -mouseover: 鼠标悬浮至输入框或图标上时触发</p>
         * <p> -[eventType] :其他任何有效事件类型</p>
         * @type {String}
         */
        trigger: "click",
        /*
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
        /*
         * 定义星期的第一天，可选值0~6
         * 星期日为0、星期一为1、星期六为6
         * @type {Number}
         */
        firstDayOfWeek: 0,
        /*
         * 最小日期限制（默认会取1900年1月1日0时0分0秒）
         * @type {String|Date}
         */
        minDate: null,
        /*
         * 最大日期限制（默认会取2099年12月31日23时59分59秒）
         * @type {String|Date}
         */
        maxDate: null,
        /*
         * 可选择的日期时间值表达式组
         * 开启该功能需加载DatePicker.expression.js扩展文件
         * 此表达式为cron日期表达式，其格式为用空格分隔的7个子表达式域，如：
         *  0 15 10 ? * 6L 2002-2005
         * [秒   分     时] 日  月   周   年
         * 可以不声明   ”秒“ “分” “时”子表达式，表达式长度等于3或等于4时，会默认"秒 分 时"为 "?"值
         * 上述表达式表示：在 2002, 2003, 2004和 2005 年中的每月最后一个周五（星期日为1，星期一为2，依此类推）的 10:15 AM
         * 更多有关于cron日期表达式的信息，请参考相关资料或在线示例
         * @type {String|Array}
         */
        includes: [],
        /*
         * 被禁用的日期时间值表达式组
         * 开启该功能需加载DatePicker.expression.js扩展文件
         * includes属性中指明的可选值也会在excludes声明中被排除
         * 此表达式为cron表达式
         * 可以不声明   ”秒“ “分” “时”子表达式，表达式长度等于3或等于4时，会默认"秒 分 时"为 "?"值
         * 更多有关于cron日期表达式的信息，请参考相关资料或在线示例
         * @type {String|Array}
         */
        excludes: [],
        /*
         * 是否显示时间选择器
         * 控件默认会根据日期时间格式来判定是否需要显示时间选择器
         * 也可以通过该属性强制开启或关闭时间选择器，但最终日期时间值仍受限于format属性指定的格式
         * @type {Boolean}
         */
        showTimePicker: null,
        /*
         * 是否显示农历日期值提示
         * 开启该功能需加载DatePicker.lunar.js扩展文件
         * @type {Boolean}
         */
        showLunarTips: false,
        /*
         * 指定可选时间必须在另外一个DatePicker控件已选日期值之前
         * 即设置当前控件的最大日期值为该属性所指定日期控件的已选日期值
         * 另外也可以通过onPick事件回调来动态设置本控件的最大最小日期值限制
         * 可传控件ID或者fastDev.Ui.DatePicker对象
         * @type {String|fastDev.Ui.DatePicker}
         */
        timeBefore: null,
        /*
         * 指定可选时间必须在另外一个DatePicker控件已选日期值之后
         * 即设置当前控件的最小日期值为该属性所指定的日期控件的已选日期值
         * 另外也可以通过onPick事件回调来动态设置本控件的最大最小日期值限制
         * 可传控件ID或者fastDev.Ui.DatePicker对象
         * @type {String|fastDev.Ui.DatePicker}
         */
        timeAfter: null,
        /*
         * 是否只读
         * @type {Boolean}
         */
        readonly: false,
        /*
         * 日历面板展现类型，为以下枚举值：
         * <p>-block: 以弹出层形式展现，默认方式 </p>
         * <p>-inline: 以行内块形式展现，即平面模式 </p>
         * @type {String}
         */
        display: "block",
        /*
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
    /*
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
    /*
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
    /*
     * 初始控件
     * @param {Object} options
     * @param {Object} global
     * @protected
     */
    init: function (options, global) {
        // 初始化日期时间最值设定
        this.setMinDate(options.minDate);
        this.setMaxDate(options.maxDate);
        if ( !! this.cronParser) {
            // 初始化时间表达式
            this.parseCronExpression();
        }
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
    /*
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
    /*
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
    /*
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
    /*
     * 触发器触发事件
     * @param {Event} event
     * @private
     */
    triggerEvent: function (event) {
        this.show();
        // 取消事件冒泡
        return this.stopBubble(event);
    },
    /*
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
    /*
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
                if (typeof this.showLunarTips !== "function") {
                    throw "未包含相关农历日期功能API，需导入DatePicker.lunar.js扩展文件.";
                }
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
    /*
     * 菜单鼠标悬浮事件，IE6兼容考虑
     * @param {Event} event
     * @private
     */
    menuOver: function (event) {
        if (event.target.tagName.toLowerCase() === "a") {
            fastDev(event.target).addClass("ui-datepicker-menu-over");
        }
    },
    /*
     * 菜单鼠标移出事件，IE6兼容考虑
     * @param {Event} event
     * @private
     */
    menuOut: function (event) {
        this.find(".ui-datepicker-menu-over").removeClass("ui-datepicker-menu-over");
    },
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
     * “今天”按钮点击事件
     * @param {Event} event
     * @private
     */
    todayBtnClick: function (event) {
        if (!this._global.todayBtn.attr("forbidden")) {
            // 点击"今天"按钮，则直接选取今天
            this.select(new Date());
            this.documentClick(event);
        } else {
            this.btnClickCount();
        }
    },
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
     * 获取时间选择器聚焦输入框的名称
     * @private
     */
    getTimeFocusName: function () {
        var focus = this._global.timePickerInputFocus;
        return focus ? focus.prop("name").split("timePicker")[1].toLowerCase() : "";
    },
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
        return (!disabled && !! this.cronParser) ? this.match({
            year: year,
            month: month,
            date: date,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }) : disabled;
    },
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
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
    /*
     * 获取本地化月份值
     * @param {Number} month 月
     * @return {String}
     * @private
     */
    toLocaleMonth: function (month) {
        var locale = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
        return locale[month];
    },
    /*
     * 获取本地化年份值
     * @param {Number} year 年
     * @return {String}
     * @private
     */
    toLocaleYear: function (year) {
        return year + "年";
    },
    /*
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
    /*
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
    /*
     * 获取日期时间值
     * @return {String} 按配置格式格式化后的日期时间值
     */
    getValue: function () {
        return this._options.value;
    },
    /*
     * 获取控件当前值的日期对象
     * @return {Date} 当前日期对象或者null
     */
    getDate: function () {
        return this._global.selectedValue || null;
    },
    /*
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
    /*
     * 设置最小日期限制
     * @param {String|Date} date 日期时间字符串或日期对象
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setMinDate: function (date) {
        return this.setExtremumDate(date, "min");
    },
    /*
     * 设置最大日期限制
     * @param {String|Date} date 日期时间字符串或日期对象
     * @return {fastDev.Ui.DatePicker} 本控件实例
     */
    setMaxDate: function (date) {
        return this.setExtremumDate(date, "max");
    },
    /*
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
    /*
     * 启用控件
     */
    enable: function () {
        this._options.disabled = false;
        this.setReadOnly(false);
        this._global.input.prop("disabled", "").parent().removeClass("ui-form-disabled");
    },
    /*
     * 禁用控件
     */
    disable: function () {
        this._options.disabled = false;
        this.setReadOnly(true);
        this._options.disabled = true;
        this._global.input.prop("disabled", "disabled").parent().addClass("ui-form-disabled");
    }
});
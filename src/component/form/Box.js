/**
 * @class fastDev.Ui.Box
 * @extends fastDev.Ui.Component
 * Box类继承自component,所有输入类控件的基础类控件，其子类包括输入框、密码框、文本域、下拉框等
 */
fastDev.define("fastDev.Ui.Box", {
    extend: "fastDev.Ui.Component",
    alias: "Box",
    _options: {
        /**
         * 校验的规则
         * @type {String}
         */
        rule: "",
        /**
         * 是否只读
         * @type {Boolean}
         */
        readonly: false,
        /**
         * 输入框的宽度值（HTML模式时在IE6、7下使用input标签声明输入框宽度时的兼容属性）
         * @type {String}
         */
        iwidth: "",
        /**
         * 是否禁用控件
         * @type {Boolean}
         */
        disabled: false,

        /**
         * 错误提示方式
         * @type {String}
         */
        errorMode: "float",
        /**
         * 验证模式: blur(失去焦点验证),ajax:url(Ajax远程验证),none(无验证)
         * @type {String}
         */
        validateMode: "none",
        /**
         * 验证错误的提示消息配置
         * @type {String}
         */
        errorConfig: null,
        /**
         * 值为空时显示的提示文字
         * @type {String}
         */
        emptyText: null,
        enableDataSet : false,
        enableInitProxy: false,
        enableDataProxy: false,
        /**
         * 当元素获得焦点时触发
         * @event 
         */
        onfocus: fastDev.noop,
        /**
         * 当元素失去焦点时触发
         * @event 
         */
        onblur: fastDev.noop,
        /**
         * 当元素被选取时触发
         * @event
         */
        onselect: fastDev.noop,
        /**
         * 当元素改变时触发
         * @event
         */
        onchange: fastDev.noop,
        /**
         * 当鼠标被单击时触发
         * @event
         */
        onclick: fastDev.noop,
        /**
         * 当鼠标被双击时触发
         * @event
         */
        ondblclick: fastDev.noop,
        /**
         * 当鼠标按钮被按下时触发
         * @event
         */
        onmousedown: fastDev.noop,
        /**
         * 当鼠标按钮被按下时触发
         * @event
         */
        onmouseup: fastDev.noop,
        /**
         * 当鼠标指针悬停于某元素之上时触发
         * @event
         */
        onmouseover: fastDev.noop,
        /**
         * 当鼠标指针移动时触发
         * @event
         */
        onmousemove: fastDev.noop,
        /**
         * 当鼠标指针移出某元素时触发
         * @event
         */
        onmouseout: fastDev.noop,
        /**
         * 当键盘被按下后又松开时触发
         * @event
         */
        onkeypress: fastDev.noop,
        /**
         * 当键盘被按下时触发
         * @event
         */
        onkeydown: fastDev.noop,
        /**
         * 当键盘被松开时触发
         * @event
         */
        onkeyup: fastDev.noop,
        /**
         * 验证前发生触发
         * @event
         */
        onBeforeValidation: fastDev.noop,
        /**
         * 验证后发生触发
         * @event
         */
        onAfterValidation: fastDev.noop
    },
    _global: {
        clearEmptyText: false
    },
    /**
     * 错误提示信息模板
     * @private
     */
    errorTemplate: ['<div class="ui-tips-text ui-radius ui-shadow" style="z-index:9999999"></div>'],
    /**
     * 模板中使用的参数
     * @private
     */
    tplParam: ["readOnly", "disabled"],
    /**
     * 清除输入的值
     */
    clean: function () {
        this.reset();
    },
    /**
     * 重置输入框的值为空
     */
    reset: function () {
        this.setValue("");
    },
    /**
     * 组件参数准备方法
     * @protected
     */
    ready: function (options, global) {
        if (!fastDev.isString(options.id) || options.id.length === 0) {
            options.id = fastDev.getID() + "";
        }
        var fx = fastDev.Util.StringUtil.trim;
        for (var fx = fastDev.Util.StringUtil.trim, elems = ["width", "height"], elem, ielem; elem = elems.shift();) {
            ielem = "i" + elem;
            if (options[ielem] = fx(options[ielem] || "")) {
                options[elem] = options[ielem];
            } else if (fastDev.isPlainObject(options.style)) {
                options[elem] = options.style[elem] === undefined ? options[elem] : options.style[elem];
            }
        }
        options.value = fastDev.isValid(options.value) ? options.value : "";
        if (fastDev.isString(options.errorConfig)) {
            options.errorConfig = fastDev.Util.JsonUtil.parseJson("{" + options.errorConfig + "}");
        }
        options.readonly = !! options.readonly;
        this.setReadOnly = this.setReadonly;
    },
    /**
     * 组件构造方法
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    construct: function (options, global) {
        global.box = this.find("[id='" + options.id + "']");
        global.wrapper = this.find(".ui-form-wrap");
    },
    /**
     * 组件初始化方法
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    init: function (options, global) {
        var box = this._global.box;

        if (options.value === "") {
            this.initEmptyText(options.emptyText);
        } else {
            //if(options.enabledDataProxy === false){
            //this.setValue(options.value);
            //}
            global.clearEmptyText = true;
        }

        if (options.validateMode !== "none") {
            this.bind("blur", fastDev.setFnInScope(this, this.validate));
        }
        // 初始化事件
        this.initEvent(options);
        if (options.readonly) {
            this.setReadonly(true);
        }
    },
    /**
     * 初始化事件
     * @private 
     */
    initEvent: function (options) {
        fastDev.each(["onfocus", "onblur", "onselect", "onchange", "onclick", "ondblclick", "onmousedown", "onmouseup", "onmouseover", "onmousemove", "onmouseout", "onkeypress", "onkeydown", "onkeyup"], function (index, eventname) {
            if (!fastDev.isNoop(options[eventname]) && fastDev.isFunction(options[eventname])) {
                this.bind(eventname.replace("on", ""), options[eventname], false);
            }
        }, this);
    },
    /**
     * 调用配置中的验证规则对输入值进行验证
     * @return {Boolean}
     */
    validate: function () {
        var options = this._options,
            value = this.getValue(),
            validation = fastDev.Core.Validation,
            validateMode = options.validateMode;
        options.onBeforeValidation.call(this);

        if (validateMode.indexOf("ajax:") !== -1) {
            validation.checkAjax(value, validateMode.replace("ajax:", ""), this, options.onAfterValidation);

        } else {
            var errorMsg = validation.validate(options.rule, value, options.errorConfig);
            if (errorMsg) {

                this.initError(errorMsg);

            } else {

                this.destroyError();
            }

            options.onAfterValidation.call(this);

            return errorMsg;
        }
    },
    /**
     * 获取验证之后的提示信息
     * @return {String}
     */
    getMsg: function () {
        return this._options.msg;
    },
    /**
     * 取得控件的值
     */
    getValue: function () {
        if (this._global.clearEmptyText === true) {
            return this._global.box.prop("value");
        } else {
            return "";
        }

    },
    /**
     * 设置控件的值
     * @param {String} value
     */
    setValue: function (value, only) {
        if (!only && this._global.clearEmptyText === false) {
            this.destroyEmptyText();
        }
        this._global.box.prop("value", value);
        return this;
    },
    /**
     * 初始化空值提示
     * @private
     */
    initEmptyText: function (value) {

        var me = this,
            global = this._global;

        if (!value || !fastDev.isString(value)) {
            this._global.clearEmptyText = true;
            return me;
        }
        var box = global.box,
            //
            destroyEmptyText = global.destroyEmptyText;

        if (!destroyEmptyText) {
            destroyEmptyText = global.destroyEmptyText = fastDev.setFnInScope(me, this.destroyEmptyText);
        }

        box.addClass("ui-form-text-default");

        this.bind("focus", destroyEmptyText);

        return me.setValue(value, true);
    },
    /**
     *  销毁空值提示
     * @private
     */
    destroyEmptyText: function () {
        var me = this,
            global = this._global,
            box = global.box,
            destroyEmptyText = global.destroyEmptyText;

        box.prop("value", "");

        me._global.clearEmptyText = true;

        box.removeClass("ui-form-text-default");

        this.unbind("focus", destroyEmptyText);
    },
    /**
     * 设置是否只读
     * @param {Boolean} [readonly=true] 是否只读
     */
    setReadonly: function (readonly) {
        if (readonly === false) {
            this._global.box.removeProp("readOnly");
        } else {
            this._global.box.prop("readOnly", true);
        }
        return this;
    },
    /**
     * 启用控件
     */
    enable: function () {
        var global = this._global;
        global.box.removeProp("disabled");
        global.wrapper.removeClass("ui-form-disabled");
        return this;
    },
    /**
     * 禁用控件
     */
    disable: function () {
        var global = this._global;
        global.box.prop("disabled", true);
        global.wrapper.addClass("ui-form-disabled");
        return this;
    },
    /**
     *  初始化错误提示
     * @param {Object} errorMsg 错误信息
     * @private
     */
    initError: function (errorMsg) {
        if (!fastDev.isString(errorMsg) || errorMsg.length <= 0) {
            return;
        }
        var global = this._global,
            // 输入框
            box = global.box,
            wrapper = global.wrapper,
            // 错误提示框
            errorDiv = global.errorDiv || (global.errorDiv = fastDev(this.errorTemplate.join(""))),
            // 鼠标滑入输入框事件
            boxMouseoverHandle = global.boxMouseoverHandle,
            // 鼠标滑出输入框事件
            boxMouseoutHandle = global.boxMouseoutHandle;

        if (!boxMouseoverHandle) {
            boxMouseoverHandle = global.boxMouseoverHandle = function (event) {
                if (wrapper.hasClass("ui-tips-text-err")) {
                    //ajax验证移除错误后再调用此方法时errorDiv为空。
                    if (errorDiv.elems.length === 0) {
                        errorDiv = global.errorDiv;
                    }
                    errorDiv.css({
                        left: event.pageX + 10 + "px",
                        top: event.pageY + 10 + "px"
                    }).show();
                }
            };

            boxMouseoutHandle = global.boxMouseoutHandle = function () {
                errorDiv.hide();
            };
        }

        // 渲染错误提示框并隐藏
        errorDiv.setText(errorMsg).css({
            position: "absolute"
        }).hide().appendTo(document.body);

        wrapper.addClass("ui-tips-text-err");

        box.bind("mouseover", boxMouseoverHandle).bind("mouseout", boxMouseoutHandle);
    },
    /**
     * 销毁错误提示
     * @private
     */
    destroyError: function () {
        var global = this._global,
            errorDiv = global.errorDiv;
        if (!errorDiv) {
            return;
        }

        var box = global.box,
            textMouseoverHandle = global.textMouseoverHandle,
            textMouseoutHandle = global.textMouseoutHandle;
        global.wrapper.removeClass("ui-tips-text-err");
        box.unbind("mouseover", textMouseoverHandle).unbind("mouseout", textMouseoutHandle);
        errorDiv.remove();
        global.errorDiv = null;
    },
    /**
     * 绑定控件事件 
     * @param {String} type 事件类型
     * @param {Function} handle 事件句柄
     */
    bind: function (type, handle) {
        this._global.box.bind(type, handle);
        return this;
    },
    /**
     * 解除绑定控件事件 
     * @param {String} type 事件类型
     * @param {Function} handle 事件句柄
     */
    unbind: function (type, handle) {
        this._global.box.unbind(type, handle);
        return this;
    },
    /**
     * 触发控件指定事件 
     * @param {String} type 事件类型
     */
    fire: function (type) {
        this._global.box.fire(type);
        return this;
    },
    /**
     * 当前控件是否验证出错 
     */
    hasError: function () {
        return fastDev.isValid(this._global.errorDiv);
    }
});
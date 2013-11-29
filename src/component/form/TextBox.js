/**
 * @class fastDev.Ui.TextBox
 * @extends fastDev.Ui.Box
 * TextBox文本框控件，继承自box控件,实现对文本的输入、验证。内含文本框、密码框、隐藏文本框、文本域的实现
 */
fastDev.define("fastDev.Ui.TextBox", {
    extend: "fastDev.Ui.Box",
    alias: "TextBox",
    _options: {
        /**
         * 输入框默认宽度
         * @type {String}
         */
        width: "150px",
        /**
         * 文本域的默认高度
         * @type {String} 
         */
        height: "52px",
        /**
         * 输入框类型: text, password, textarea、hidden
         * @type {String}
         */
        type: "text",
        /**
         * 是否允许用户调节输入框大小 （目前只允许调节文本域的大小）
         * <p>其值为以下枚举量：
         * <p>-none 不允许调节大小（默认）
         * <p>-both 允许调节宽度与高度（水平与垂直方向）
         * <p>-horizontal 只允许调节宽度（水平方向）
         * <p>-vertical 只允许调节高度（垂直方向）
         * @type {String}
         */
        resize: "none",
        /**
         * 提示文本信息
         * @type {String}
         */
        tips: ""
    },
    /**
     * 用于构建静态模板串
     * @param {Object} params 模板已解析参数对象
     * @private 
     */
    staticTemplate: function (params) {
        var pub = 'id="' + params.id + '" name="' + params.name + '" value="' + params.value + '"' + ' title="' + params.tips + '"',
            html = [],
            type = params.type;
        if (/hidden/i.test(type)) {
            html.push('<input ' + pub + ' type="hidden"/>');
        } else {
            html.push('<div elem="textbox-wrapper" style="width:' + params.width + '" class="ui-form '+params.cls+'"><div class="ui-form-wrap ' + params.wrapperCls + '">');
            if (/textarea/i.test(type)) {
                html.push('<div style="width:100%"><textarea ' + pub + ' class="ui-form-field ui-form-input" autocomplete="off" aria-invalid="false" style="resize:none;overflow:auto;height:' + params.height + '"></textarea></div>');
            } else {
                html.push('<input ' + pub + ' type="' + type + '" class="ui-form-field ui-form-input"/>');
            }
            html.push('</div></div>');
        }
        return html.join('');
    },
    tplParam: ["width", "height", "name", "value", "id", "wrapperCls", "type", "tips", "cls"],
    /**
     * 输入框参数准备方法
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    ready: function (options, global) {
        var type = (options.type + "").toLowerCase(),
            width;
        // 确保ID存在,用于内部查找
        options.id = options.id || fastDev.getID();
        global.wrapperCls = type === "textarea" ? "ui-textarea" : "ui-input";
        if (width = /^(-?\d+\.?\d+|-?\d)(px|%|em|cm)?$/.exec(fastDev.Util.StringUtil.trim(options.width + ""))) {
            options.width = width[1] + (width[2] || "px");
        } else {
            options.width = "150px";
        }
        if (type === "password") {
            // 输入框为密码框时，提示文本无效
            options.emptyText = "";
        } else if (type === "textarea") {
            // 文本域高度计算确定像素值
            options.height = (fastDev.Util.StringUtil.stripUnits(options.height, options.container.height()) || 52) - 4 + "px";
        }
        options.display = (options.display === "none" || options.display === false) ? false : true;
    },
    /**
     * 输入框初始化方法
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    init: function (options, global) {
        if (options.type === "textarea" && (global.resize = /(both|horizontal|vertical)/i.exec(options.resize))) {
            fastDev.create("Resizable", {
                element: global.wrapper,
                handles: "se",
                minWidth: 150,
                minHeight: Math.min(parseInt(options.height, 10), 52),
                axis: /horizontal/i.test(global.resize[1]) ? "x" : /vertical/i.test(global.resize[1]) ? "y" : "x,y",
                onstop: function (event, width, height) {
                    var dimension = global.resize[1];
                    if (/both|horizontal/i.test(dimension)) {
                        global.wrapper.parent().width(width + 4);
                    }
                    if (/both|vertical/i.test(dimension)) {
                        global.box.height(height - 2);
                    }
                    return false;
                }
            });
        }
        if (!options.display) {
            this.hide();
        }
        if (options.disabled) {
            this.disable();
        }
    },
    /**
     * 隐藏输入框
     * @return {fastDev.Ui.TextBox} 当前控件实例
     */
    hide: function () {
        this._options.display = false;
        this.find("[elem='textbox-wrapper']").hide();
        return this;
    },
    /**
     * 显示输入框
     * @return {fastDev.Ui.TextBox} 当前控件实例 
     */
    show: function () {
        this._options.display = true;
        this.find("[elem='textbox-wrapper']").show();
        return this;
    }
});
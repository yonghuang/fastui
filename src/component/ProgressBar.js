/**
 * @class fastDev.Ui.ProgressBar
 * @extends fastDev.Ui.Component
 * @author chengwei
 * <p>进度条控件。</p>
 * <p>有2种可选模式：progress（进度条样式）、graphical（Loading图标）。</p>
 * <p>作者：程伟</p>
 *     
 *     fastDev.create("ProgressBar", {
 *          container : "example"
 *     });
 */
fastDev.define("fastDev.Ui.ProgressBar", {
    alias: "ProgressBar",
    extend: "fastDev.Ui.Component",
    _options: {
        /**
         * 控件展现模式，可选值：graphical（图形）、progress（进度条）
         * @type {String}
         */
        model: "graphical",
        /**
         * 进度条模式时进度条的宽度值
         * @type {String}
         */
        width: "200px",
        /**
         * 文本提示信息
         * @type {String}
         */
        text: '',
        /**
         * 文本对齐方式，可选值：left、center、right
         * @type {String}
         */
        textAlign: "center",
        /**
         * 进度条分段总数
         * @type {Number}
         */
        totalValue: 100,
        /**
         * 当前进度值
         * @type {Number}
         */
        value: 0,
        /**
         * 遮罩层透明度（小数） 
         * @type {Number}
         */
        opacity: 0.1,
        /**
         * 是否使用屏蔽层
         * <p>Loading模式下默认开启屏蔽层，Progress模式下默认不开启屏蔽层
         * @type {Boolean}
         */
        allowLock: null,
        /**
         * 是否在满进度时自动关闭
         * <p>Loading模式下默认自动关闭，Progress模式下默认不自动关闭
         * @type {Boolean}
         */
        allowAutoClose: null,
        /**
         * 索引重置
         * @type {Number}
         */
        zIndex: 2015,
        /**
         * 进度改变时的回调函数
         * 传递参数为当前进度值和总进度值，this指向当前ProgressBar控件实例
         * @type {Function}
         * @event
         */
        onValueChange: fastDev.noop,
        /**
         * 加载图标模式时，遮罩被点击时的事件
         * <p>this指向当前ProgressBar控件实例
         * @type {Function}
         * @event 
         */
        onOverlayClick: fastDev.noop,
        /**
         * @private 
         */
        enableInitProxy: false,
        /**
         * @private 
         */
        enableDataProxy: false,
        /**
         * @private 
         */
        autoRenderer: false,
        /**
         * @private 
         */
        enableDataSet: false
    },
    /**
     * 静态模板
     * @param {Object} params 模板参数
     * @private 
     */
    staticTemplate: function (params) {
        var html = [];
        if (/progress/i.test(params.model)) {
            html.push('<div class="ui-progressbar" style="width:' + params.width + ';position:relative;">');
            html.push('<div class="ui-progressbar-gradient">');
            html.push('<span class="ui-progressbar-text" style="width:' + params.width + ';text-align:' + params.textAlign + '">' + params.text + '</span>');
            html.push('</div></div>');
        } else {
            html.push('<span name="loading"><div class="ui-progressbar-ico ' + params.loadingCls + '"></div>');
            html.push('<span class="ui-progressbar-ico-text">' + params.text + '</span></span>');
        }
        if (params.allowLock) {
            html.push('<div id="progressbar-mask" class="ui-opacity"></div>');
        }
        return html.join("");
    },
    tplParam: ["model", "width", "text", "textAlign", "allowLock", "loadingCls"],
    /**
     * 进度条参数准备
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    ready: function (options, global) {
        options.container = fastDev(fastDev.isComponent(options.container) ? options.container.elems[0] : options.container);
        var fn = fastDev.Util.StringUtil.stripUnits;
        // 进度条模式时，减去阴影3px左右宽度，默认200px宽
        options.width = (fn(options.width, Math.max(options.container.width() - 3, 0)) || 200) + "px";
        options.value = parseFloat(options.value) || 0;
        options.totalValue = parseFloat(options.totalValue) || 100;
        options.zIndex = parseInt(options.zIndex, 10) || 2012;
        options.opacity = parseFloat(options.opacity) || 0.6;
        options.loadingCls = options.loadingCls || "";
        options.allowLock = options.allowLock === null ? options.model === "graphical" ? true : false : !! options.allowLock;
        options.allowAutoClose = options.allowAutoClose === null ? options.model === "graphical" ? true : false : !! options.allowAutoClose;
        if (!options.text) {
            options.text = options.model === "graphical" ? "" : this.getPercentage();
        }
    },
    /**
     * 控件构造
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    construct: function (options, global) {
        global.mask = this.find("[id='progressbar-mask']");
        if (typeof options.onOverlayClick === "function" && !fastDev.isNoop(options.onOverlayClick)) {
            global.mask.bind("click", fastDev.setFnInScope(this, options.onOverlayClick));
        }
        global.box = this.find(options.model === "progress" ? ".ui-progressbar" : "[name='loading']");
        global.ico = options.model === "progress" ? global.box : this.find(".ui-progressbar-ico");
        global.text = this.find(options.model === "progress" ? ".ui-progressbar-text" : ".ui-progressbar-ico-text");
        global.body = fastDev(document.body);
        this.elems.splice((options.allowLock || options.model === "graphical") ? 0 : 1, 0, "none");
    },
    /**
     * 初始化
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    init: function (options, global) {
        var box = global.box;
        // 默认的进度更新事件
        if (options.onValueChange === fastDev.noop || typeof options.onValueChange !== "function") {
            options.onValueChange = function () {
                this.setText(this.getPercentage());
            };
        }
        if ( !! options.value) {
            options.onValueChange.call(this);
        }
        if (!(options.display = !(options.display === "none" || options.display === false))) {
            this.hide();
        }
        if (options.model === "progress") {
            if (options.left) {
                box.css("left", options.left);
            }
            if (options.top) {
                box.css("top", options.top);
            }
            global.gradient = this.find(".ui-progressbar-gradient").css("width", this.getPercentage());
            if (!options.allowLock) {
                options.container.append(box);
            }
        }
    },
    /**
     * 定位
     * @param {DomObject} elem 需定位的元素
     * @private
     */
    position: function (elem) {
        // 图形模式
        var options = this._options,
            global = this._global,
            container = options.container;
        if ((options.allowLock || options.model === "graphical") && options.display && !container.isEmpty()) {
            // offsetWidth变量用来取特殊属性值，用来触发浏览器刷新DOM操作（reflow），以便读取正确的绝对坐标值
            var offsetWidth = container.elems[0].offsetWidth,
                offset = container.offset(),
                width = container.width(),
                height = container.height(),
                fixed = container.css("position") === "fixed",
                body = global.body,
                bodyBorder = {
                    left: fixed ? 0 : parseInt(body.css("borderLeftWidth"), 10) || 0,
                    top: fixed ? 0 : parseInt(body.css("borderTopWidth"), 10) || 0
                },
                loading = global.ico,
                left, top;
            // 容器内部居中坐标计算，需算上容器的相应边框及边距
            // borderTopWidth属性即上边框的高度，注意，没有borderTopHeight样式属性
            left = offset.left + bodyBorder.left + (parseInt(container.css("borderLeftWidth"), 10) || 0) + (parseInt(container.css("paddingLeft"), 10) || 0);
            top = offset.top + bodyBorder.top + (parseInt(container.css("borderTopWidth"), 10) || 0) + (parseInt(container.css("paddingTop"), 10) || 0);
            // 定位
            elem.appendTo(body).css({
                position: "absolute",
                left: Math.max(0.5 * (width - elem.outerWidth(true)) + left, left),
                // 0.382系数为黄金分割比例位置，如果需要完全居中，改为0.5系数即可
                top: Math.max(0.42 * (height - loading.outerHeight(true)) + top, top),
                zIndex: options.zIndex + 1
            });
            if (options.allowLock) {
                // 使用遮罩覆盖容器内部
                global.mask.css({
                    position: "absolute",
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    zIndex: options.zIndex,
                    opacity: options.opacity
                }).appendTo(body);
            }
        }
        return this;
    },
    /**
     * 进度值改变处理
     * @param {Number} oldValue
     * @param {Number} oldTotal
     * @param {Number} newValue
     * @param {Number} newTotal
     * @private
     */
    valueChange: function (oldValue, oldTotal, newValue, newTotal) {
        var options = this._options,
            global = this._global;
        if ((oldValue / (oldTotal || 1)) !== (newValue / (newTotal || 1))) {
            options.onValueChange.call(this, newValue, newTotal);
        }
        if (newValue === newTotal && options.allowAutoClose) {
            this.close();
        }
        return this;
    },
    /**
     * 获取当前进度百分比
     * 注意，返回值为一个字符串类型的百分数
     * @return {String} xx%
     */
    getPercentage: function () {
        return (Math.floor(Math.abs(100 * (this.getValue() / (parseFloat(this._options.totalValue) || 100))))) + "%";
    },
    /**
     * 设置当前进度值
     * 用于刷新当前进度值
     * @param {Number} value 当前进度值
     * @param {Number} [total] 总进度值（可选）
     * @return {fastDev.Ui.ProgressBar}
     */
    setValue: function (value, total) {
        var options = this._options,
            global = this._global,
            gradient = global.gradient,
            oldValue = this.getValue(),
            oldTotal = this.getTotalValue();
        options.value = value;
        if (total !== undefined) {
            options.totalValue = total;
        }
        if (gradient) {
            gradient.css("width", this.getPercentage());
        }
        return this.valueChange(oldValue, oldTotal, this.getValue(), this.getTotalValue()).position(global.box);
    },
    /**
     * 设置显示文本
     * 可用于刷新文本提示信息
     * @return {fastDev.Ui.ProgressBar}
     */
    setText: function (text) {
        var global = this._global;
        if (global.closed) {
            return this;
        }
        global.text.setText(text);
        return this.position(global.box);
    },
    /**
     * 获取当前进度值
     * @return {Number}
     */
    getValue: function () {
        var options = this._options;
        return Math.min(parseFloat(options.totalValue) || 100, Math.max(parseFloat(options.value) || 0, 0));
    },
    /**
     * 设置进度条的总数值
     * @param {Number} value 总进度值
     * @return {fastDev.Ui.ProgressBar}
     */
    setTotalValue: function (value) {
        return this.setValue(this.getValue(), value);
    },
    /**
     * 获取进度条的总数值
     * @return {Number}
     */
    getTotalValue: function () {
        return parseFloat(this._options.totalValue) || 100;
    },
    /**
     * 显示隐藏切换
     * @param {Boolean} show 是否是显示
     * @private
     */
    toggle: function (show) {
        var global = this._global;
        if (global.closed) {
            return this;
        }
        this._options.display = !! show;
        if ( !! global.mask) {
            global.mask[show ? "show" : "hide"]();
        }
        if ( !! global.box) {
            global.box[show ? "show" : "hide"]();
        }
        return this;
    },
    /**
     * 显示进度条控件
     * @return {fastDev.Ui.ProgressBar}
     */
    show: function () {
        if (!this._options.display) {
            return this.toggle(true).position(this._global.box);
        }
        return this;
    },
    /**
     * 隐藏进度条控件
     * @return {fastDev.Ui.ProgressBar}
     */
    hide: function () {
        return this.toggle();
    },
    /**
     * 关闭并销毁进度条控件
     */
    close: function () {
        var global = this._global;
        if (global.closed) {
            return this;
        }
        this._options.display = !(global.closed = true);
        this.destroy();
        return this;
    }
});
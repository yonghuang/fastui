/**
 * @class fastDev.Ui.Panel
 * @extends fastDev.Ui.Component
 * @author 程伟
 * <p>面板控件，继承自component。布局类控件。</p>
 * <p>可定义标题图标，折叠，最大最小，关闭按钮等。</p>
 * <p>作者：程伟</p>
 *      
 *      <div itype="Panel" width="100px" height="100px">
 *           面板内容
 *      </div>
 */
fastDev.define("fastDev.Ui.Panel", {
    extend: "fastDev.Ui.Component",
    alias: "Panel",
    _options: {
        /**
         * 标题内容
         * @type {String}
         */
        title: "",
        /**
         * 标题内容自定义样式名
         * @type {String}
         */
        headerCls: "",
        /**
         * 标题栏图标样式名
         * @type {String}
         */
        iconCls: "",
        /**
         * 面板内容区域自定义样式名
         * @type {String}
         */
        bodyCls: "",
        /**
         * 面板内容区域自定义行内样式
         * <p>值格式如：margin:10px;padding:10px;
         * @type {String} 
         */
        bodyStyle: "",
        /**
         * 是否显示面板内容区域的边框
         * @type {Boolean}
         */
        showBorder: true,
        /**
         * 是否显示标题栏
         * @type {Boolean}
         */
        showHeader: true,
        /**
         * 面板内容
         * @type {String}
         */
        content: "",
        /**
         * 是否显示折叠面板按钮
         * @type {Boolean}
         */
        showCollapseBtn: false,
        /**
         * 是否显示最小化面板按钮
         * @type {Boolean}
         */
        showMinBtn: false,
        /**
         * 是否显示最大化面板按钮
         * @type {Boolean}
         */
        showMaxBtn: false,
        /**
         * 是否显示关闭面板按钮
         * @type {Boolean}
         */
        showCloseBtn: false,
        /**
         * 面板初始是否折叠
         * @type {Boolean}
         */
        collapsed: false,
        /**
         * 面板初始是否最小化
         * @type {Boolean}
         */
        minimized: false,
        /**
         * 面板初始是否最大化
         * @type {Boolean}
         */
        maximized: false,
        /**
         * 加载图标附带的提示消息内容
         * @type {String}
         */
        loadingMsg: "",
        /**
         * 加载面板内容时是否显示加载图标
         * @type {Boolean}
         */
        showLoading: true,
        /**
         * 面板的宽度
         * @type {String}
         */
        width: "300px",
        /**
         * 面板的高度
         * @type {String}
         */
        height: "185px",
        /**
         * 面板内部子页面链接地址
         * @type {String}
         */
        src: "",
        /**
         * 动画执行的速度值
         * <p>单位为毫秒
         * <p>0表示没有动画效果
         * <p>也可使用以下预定义速度枚举值：
         * <p>-slow 400毫秒 
         * <p>-fast 150毫秒 
         * <p>-default 260毫秒  
         * @type {Number|String}
         */
        animateSpeed: 260,
        /**
         * 重置动画执行算法
         * <p>默认情况下不同的窗口动画类型，使用的算法并不一致 
         * <p>该属性可将所有动画效果的算法重置为某一算法类型（如:liner）
         * @type {String}
         */
        animateEasing: "liner",
        /**
         * 面板显示之前事件
         * <p>回调函数返回布尔值false可阻止面板显示
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeOpen: fastDev.noop,
        /**
         * 面板显示之后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterOpen: fastDev.noop,
        /**
         * 面板关闭之前事件
         * <p>回调函数返回布尔值false可阻止面板关闭
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeClose: fastDev.noop,
        /**
         * 面板关闭之后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterClose: fastDev.noop,
        /**
         * 面板内容折叠之前事件
         * <p>回调函数返回布尔值false可阻止面板内容折叠
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeCollapse: fastDev.noop,
        /**
         * 面板内容折叠之后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterCollapse: fastDev.noop,
        /**
         * 面板内容展开之前事件
         * <p>回调函数返回布尔值false可阻止面板内容展开
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeExpand: fastDev.noop,
        /**
         * 面板内容展开之后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterExpand: fastDev.noop,
        /**
         * 面板大小被改变事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterResize: fastDev.noop,
        /**
         * 面板位置被改变事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterMove: fastDev.noop,
        /**
         * 面板最大化前事件
         * <p>回调函数返回布尔值false可阻止面板最大化
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeMaximize: fastDev.noop,
        /**
         * 面板最大化后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterMaximize: fastDev.noop,
        /**
         * 面板还原前事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeReset: fastDev.noop,
        /**
         * 面板还原后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterReset: fastDev.noop,
        /**
         * 面板最小化（隐藏）前事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onBeforeMinimize: fastDev.noop,
        /**
         * 面板最小化（隐藏）后事件
         * <p>this指向当前面板控件
         * @type {Function}
         * @event
         */
        onAfterMinimize: fastDev.noop,
        /**
         * 动画开始前的回调函数
         * <p>返回false值则终止动画的执行
         * <p>this指向当前面板控件
         * @type {Function}
         * @event 
         */
        onAnimateStart: fastDev.noop,
        /**
         * 动画结束时的回调函数
         * <p>this指向当前面板控件
         * @type {Function}
         * @event 
         */
        onAnimateStop: fastDev.noop,
        /**
         * @private
         */
        enableInitProxy: false,
        /**
         * @private
         */
        enableDataProxy: false,
        enableDataSet: false
    },
    /**
     * 静态模板
     * @param {Object} params 已解析模板参数
     * @private 
     */
    staticTemplate: function (params) {
        var html = ['<div name="box" class="ui-panel ui-panel-box ' + params.cls + '">'];
        if (params.showHeader) {
            html.push([
                    '<div name="header" class="ui-panel-header">',
                    '<div name="title" class="ui-window-header-text ' + params.iconCls + ' ' + params.headerCls + '">' + params.title + '</div>',
                    '<div name="tool" class="ui-window-tool">',
                    '<span class="ui-window-tool-show" name="Expand" handler="expand" title="展开"></span>',
                    '<span class="ui-window-tool-hidden" name="Collapse" handler="collapse" title="折叠"></span>',
                    '<span class="ui-window-tool-min" name="Min" handler="minimize" title="最小化"></span>',
                    '<span class="ui-window-tool-restore" name="Restore" handler="reset" title="还原"></span>',
                    '<span class="ui-window-tool-max" name="Max" handler="maximize" title="最大化"></span>',
                    '<span class="ui-window-tool-close" name="Close" handler="close" title="关闭"></span>',
                    '</div>',
                    '</div>'
            ].join(""));
        }
        html.push('<div name="body" class="ui-panel-body ' + params.borderCls + '">');
        html.push('<div name="content" class="ui-panel-content ' + params.bodyCls + '" style="' + params.bodyStyle + '"></div></div></div>');
        return html.join("");
    },
    tplParam: ["title", "showHeader", "cls", "iconCls", "headerCls", "borderCls", "bodyCls", "bodyStyle"],
    /**
     * 准备参数
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    ready: function (options, global) {
        options.showHeader = !! options.showHeader;
        // 初始内容边框样式
        global.borderCls = !(options.showBorder = !! options.showBorder) ? "ui-noborder" : "";
        // body的水平方向（top、bottom）的边框的高度和
        global.hBodyBorderWidth = options.showBorder ? options.showHeader ? 1 : 2 : 0;
        // 初始标题图标样式
        if (options.iconCls && fastDev.isString(options.iconCls)) {
            global.iconClsName = options.iconCls;
            options.iconCls += " ui-window-header-ico";
        } else {
            options.iconCls = "";
        }
        if (!fastDev.isString(options.src) || !(options.src = fastDev.Util.StringUtil.trim(options.src))) {
            options.src = "";
        }
        // 初始动画参数
        var speed = options.animateSpeed;
        speed = fastDev.Ui.Panel.launchAnimation ? speed === "fast" ? 150 : speed === "slow" ? 400 : speed === "default" ? 260 : speed : 0;
        options.animateSpeed = Math.max(parseInt(speed, 10) || 0, 0);
    },
    /**
     * 构造结构
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    construct: function (options, global) {
        // 保存结构对象
        var elems = ["header", "title", "tool", "box", "body", "content", "iframe"],
            elem;
        while (elem = elems.shift()) {
            global[elem] = this.find("[name='" + elem + "']");
        }
        // 处理标题栏按钮
        elems = ["Min", "Max", "Collapse", "Close", "Expand", "Restore"];
        while (elem = elems.shift()) {
            if (options.showHeader) {
                global[elem] = global.header.find("[name='" + elem + "']")[!options["show" + elem + "Btn"] ? "hide" : "show"]();
            } else {
                options["show" + elem + "Btn"] = false;
            }
        }
        if (!options.showHeader && options.showBorder) {
            global.body.addClass("ui-border-top");
        }
        global.body.css("overflow", "hidden");
        global.content.css("position", "relative");
    },
    /**
     * 初始化
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    init: function (options, global) {
        var that = this;
        // 绑定标题栏按钮事件
        if (options.showHeader) {
            global.tool.bind("mouseover", function (event) {
                that.toolBtnEventHandle("mouseover", fastDev(event.target), event);
            }).bind("mouseout", function (event) {
                that.toolBtnEventHandle("mouseout", fastDev(event.target), event);
            }).bind("mouseup", function (event) {
                that.toolBtnEventHandle("click", fastDev(event.target), event);
            }).bind("mousedown", fastDev.Event.stopBubble).bind("dblclick", fastDev.Event.stopBubble);
        }
        if (!options.src) {
            // 追加HTML模式定义的面板内容
            if (options.htmlContent) {
                this.append(options.htmlContent);
            } else if (fastDev.isValid(options.content) && options.content !== "") {
                this.setContent(options.content);
            }
        } else if (!options.minimized && !options.collapsed) {
            // 加载iframe子页面
            this.load(options.src, true);
        }
        // 初始宽高坐标设定
        this.toOriginalPanel({
            width: options.width,
            height: options.height,
            left: options.left || 0,
            top: options.top || 0
        }, true);
        // 保存历史坐标与宽高
        fastDev.apply(global, {
            offsetLeft: options.left || 0,
            offsetTop: options.top || 0,
            offsetWidth: options.width || 0,
            offsetHeight: options.height || 0
        });
        if (!options.display || options.display === "none" || options.minimized) {
            this.minimize(true, options.minimized = false);
        } else {
            options.display = true;
        }
        fastDev.each(["maximize", "collapse"], function (index, handle) {
            if (options[handle + "d"]) {
                that[handle](true, options[handle + "d"] = false);
            }
        });
        global.initialized = true;
    },
    /**
     * 标题栏按钮事件处理
     * @param {String} type 事件类型
     * @param {DomObject} target 事件目标
     * @param {Event} event 事件对象
     * @private
     */
    toolBtnEventHandle: function (type, target, event) {
        var global = this._global,
            handle;
            // 变更标题工具栏按钮样式
        if (target.elems[0] !== global.tool.elems[0]) {
            if (type === "mouseover") {
                target.setClass(target.getClass().replace("-over", "") + "-over");
            } else if (type === "mouseout") {
                target.setClass(target.getClass().replace("-over", ""));
            } else if ((handle = target.attr("handler")) && (this._options["on" + target.attr("name") + "BtnClick"] || fastDev.noop).call(this, event) !== false) {
                this[handle](false, true);
            }
        }
        fastDev.Event.stopBubble(event);
        return false;
    },
    /**
     * 刷新标题栏的工具按钮
     * @return {fastDev.Ui.Panel}
     * @private
     */
    refreshToolBtn: function () {
        var options = this._options,
            global = this._global;
        if (options.showHeader) {
        	// 显示或隐藏相关按钮
            if (options.showMaxBtn) {
                global.Max.css("display", options.maximized ? "none" : "inline");
                global.Restore.css("display", options.maximized ? "inline" : "none");
            }
            if (options.showCollapseBtn) {
                global.Collapse.css("display", options.collapsed ? "none" : "inline");
                global.Expand.css("display", options.collapsed ? "inline" : "none");
            }
        }
        return this;
    },
    /**
     * 加载Iframe内容
     * @return {fastDev.Ui.Panel}
     * @protected
     */
    loadIframe: function () {
        var options = this._options,
            global = this._global;
        if (options.src && !global.loading && !global.loaded && !options.collapsed) {
            this.load(options.src);
        } else {
        	// 显示加载图标
            this.showLoading();
        }
        return this;
    },
    /**
     * 加载Iframe子页前的回调函数
     * <p>子类可实现此回调来作相应的加载前的准备
     * <p>返回false可中断Iframe的加载准备
     * @param {DomObject} iframe
     * @protected 
     */
    readyForLoading: fastDev.noop,
    /**
     * 显示加载图标 
     * @return {fastDev.Ui.Panel}
     * @param {Boolean} show 为false时隐藏Loading，为null时销毁Loading
     * @protected
     */
    showLoading: function (show) {
        var options = this._options,
            global = this._global;
        if (fastDev.isComponent(global.loading)) {
            if (!(options.minimized || options.collapsed || options.closed || global.loaded)) {
                global.loading[show === null ? "close" : show === false ? "hide" : "show"]();
            }
        }
        return this;
    },
    /**
     * 获取内容部分高度值
     * @param {Number} bodyHeight 当前body高度
     * @return {Number}
     * @protected
     */
    getContentHeight: function (bodyHeight) {
        var content = this._global.content;
        return Math.max(bodyHeight - (content.outerHeight(true) - content.height()), 0);
    },
    /**
     * 获取面板主体部分的高度值
     * @param {Number} height 面板总高度
     * @return {Number}
     * @protected
     */
    getBodyHeight: function (height) {
        var global = this._global;
        // 27px的标题栏
        return Math.max(parseInt(height, 10) - (this._options.showHeader ? global.header.outerHeight(true) || 27 : 0) - global.hBodyBorderWidth, 0);
    },
    /**
     * 执行动画
     * @param {DomObject} target 目标
     * @param {Array} queue 动画队列配置
     * @param {Function} callback 动画结束时的回调
     * @param {String} type 动画操作类型
     * @return {fastDev.Ui.Panel}
     * @private
     */
    exec: function (target, queue, callback, type) {
        var animation = fastDev.isArray(queue) ? queue : [queue || {}],
            stop = (animation[animation.length - 1] || {}).stop || {}, frame, frames;
            // 动画开始
        if (this.startAnimation(target, animation, type) === false) {
            this.stopAnimation(target, animation, type);
            return this;
        }
        target.css("display", "block");
        // 读取每一帧动画，并依次执行
        for (queue = animation.slice(0); frame = queue.shift();) {
            if (!frame || !frame.duration) {
                target.css((frame = frame || {}).stop || {});
                if (!queue.length) {
                	// 变更相应状态的回调事件
                    callback.call(this);
                    // 结束动画
                    this.stopAnimation(target, animation, type);
                    // 动画结束后的动画配置回调事件
                    (frame.callback || fastDev.noop).call(this, stop);
                    // 一次操作结束后（调大小、移位置，改变几何属性等）的回调
                    this.finishAction(target, stop);
                    // 以下回调主要是调用用户配的回调函数
                    callback.call(this, true);
                } else {
                    (frame.callback || fastDev.noop).call(this, stop);
                }
            } else {
            	// 执行动画
                this.draw(frames = (frames || target.css(frame.start).show()), type, animation, frame, (queue[0] || {}).start, stop, callback);
            }
        }
        return this;
    },
    /**
     * 执行动画队列中的一帧动画
     * @param {DomObject} target 动画目标
     * @param {String} type 动画类型
     * @param {Array[Object]} animation 动画队列
     * @param {Object} frame 动画队列中的当前帧
     * @param {Object} next 下一帧动画的起始样式
     * @param {Object} end 动画队列最终样式
     * @param {Function} callback 动画队列结束后的回调
     * @private
     */
    draw: function (target, type, animation, frame, next, end, callback) {
        var that = this,
            options = this._options,
            global = this._global,
            fn;
        global.drawing = true;
        target.animate(frame.stop, frame.duration, options.animateEasing || frame.easing, fn = function () {
            if (!options.destroyed) {
                target.css(next || {});
                if (frame.stop === end) {
                    global.drawing = false;
                    callback.call(that);
                    that.stopAnimation(target, animation, type);
                    (frame.callback || fastDev.noop).call(that, end);
                    that.finishAction(target, end);
                    try {
                        callback.call(that, true);
                    } catch (e) {
                        fastDev.error("Panel", "draw", "运行时错误！（" + e + "）");
                    }
                }
            }
            fn = null;
        });
    },
    /**
     * 动画开始前的回调函数
     * 返回false则中断动画
     * @param {DomObject} target 动画目标
     * @param {Array[Object]} animation 动画配置队列 
     * @param {String} type 动画类型 
     * @protected 
     */
    startAnimation: function (target, animation, type) {
        var global = this._global,
            isBox;
        global.body.css("borderColor", isBox = target.elems[0] === global.box.elems[0] ? "white" : "");
        global.content.css({
            display: isBox ? "none" : "block",
            overflow: "hidden"
        });
        return (this._options.onAnimateStart || fastDev.noop).apply(this, arguments);
    },
    /**
     * 动画结束时的回调函数
     * @param {DomObject} target 动画目标
     * @param {Array[Object]} animation 动画配置队列 
     * @param {String} type 动画类型 
     * @protected
     */
    stopAnimation: function (target, animation, type) {
        var options = this._options;
        if (!options.closed) {
            var global = this._global;
            global.body.removeCss("borderColor");
            global.content.css("overflow", "auto").show();
            global.box.removeCss("opacity");
        }
        (options.onAnimateStop || fastDev.noop).apply(this, arguments);
    },
    /**
     * 初始动画配置队列
     * @param {DomObject} target 动画目标对象
     * @param {Object|Array} animation
     * @param {Number} [cWidth] 容器宽度
     * @param {Number} [cHeight] 容器高度
     * @return {Array} 动画队列
     * @protected
     */
    toAnimationQueue: function (target, animation, cWidth, cHeight) {
        var that = this,
            options = this._options,
            speed = options.animateSpeed,
            container = options.container,
            plain;
        cWidth = cWidth || container.width();
        cHeight = cHeight || container.height();
        fastDev.each(animation = fastDev.isArray(animation) ? animation : [animation], function (index, frame) {
            plain = !frame || frame.duration === 0;
            animation[index] = frame = fastDev.isPlainObject(frame) ? frame : {};
            fastDev.each(["start", "stop"], function (i, name) {
            	// 对动画配置对象里面的回调函数调用，以获取动画配置参数
                frame[name] = fastDev.isFunction(frame[name]) ? frame[name].call(that, target, cWidth, cHeight) : frame[name];
                frame[name] = fastDev.isPlainObject(frame[name]) ? frame[name] : {};
            });
            frame.duration = plain ? 0 : Math.max(parseInt(frame.duration, 10) || 0, 0) || speed;
        });
        return animation;
    },
    /**
     * 初始动画设置
     * @param {String} type
     * @param {DomObject} target
     * @param {Object|Boolean} animation
     * @return {Object}
     * @protected
     */
    initAnimation: function (type, target, animation) {
        var options = this._options,
            global = this._global;
        switch (type) {
        case "expand":
        // 展开事件
            animation = this.toAnimationQueue(target, animation)[0];
            animation.easing = animation.easing || "expo-easeIn";
            animation.start.height = 0;
            animation.stop.height = global.bodyHeight;
            return animation;
        case "collapse":
        // 折叠事件
            animation = this.toAnimationQueue(target, animation)[0];
            animation.easing = animation.easing || "quart-easeOut";
            animation.stop.height = 0;
            return animation;
        case "maximize":
        // 最大化
            this.toOriginalPanel({
                left: 0,
                top: 0,
                width: options.container.width(),
                height: options.container.height()
            });
            break;
        case "reset":
        // 重置上一次状态
            this.toOriginalPanel({
                left: global.offsetLeft,
                top: global.offsetTop,
                width: global.offsetWidth,
                height: global.offsetHeight
            });
        }
    },
    /**
     * 判断动画是否正在进行中
     * @return {Boolean} 
     */
    isDrawing: function () {
        return this._global.drawing;
    },
    /**
     * 对面板的每一次操作结束时，必将执行的一次回调
     * <p>可供子类实现使用
     * @param {DomObject} target 动画目标
     * @param {Object} stop 结束时的状态
     * @protected 
     */
    finishAction: function (target, stop) {
        this.loadIframe().refreshToolBtn();
    },
    /**
     * 还原面板至常态
     * @param {Object} rect
     * @param {Boolean} noShow
     * @return {fastDev.Ui.Panel}
     * @protected
     */
    toOriginalPanel: function (rect, noShow) {
        var global = this._global;
        if (!noShow) {
            global.box.show();
            global.body.show();
            global.content.show();
        }
        return this.resize(rect).move(rect);
    },
    /**
     * 根据事件回调判断方法是否需要执行
     * @param {Boolean} only
     * @param {String} type
     * @return {Boolean}
     * @private
     */
    execuable: function (only, type) {
        var options = this._options,
            global = this._global,
            container = options.container;
        if (options.closed || (!only && options["onBefore" + type].call(this) === false)) {
            return false;
        }
        // 隐藏加载图标
        this.showLoading(false);
        return true;
    },
    /**
     * 展开面板内容
     * @param {Boolean} [only=false] 为true时，不触发展开面板事件
     * @param {Boolean} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    expand: function (only, animation) {
        var options = this._options,
            global = this._global;
        if (!options.collapsed || !this.execuable(only, "Expand")) {
            return this;
        }
        global.box.removeCss("height");
        return this.exec(global.body, this.initAnimation("expand", global.body, animation), function () {
            options.collapsed = false;
            if (!only && arguments[0]) {
                options.onAfterExpand.call(this);
            }
        }, "expand");
    },
    /**
     * 折叠面板内容
     * @param {Boolean} [only=false] 为true时，不触发折叠面板事件
     * @param {Boolean} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    collapse: function (only, animation) {
        var options = this._options,
            global = this._global;
        if (options.collapsed || !this.execuable(only, "Collapse")) {
            return this;
        }
        // 内容body部分的高度需要实时计算
        global.expandedBodyHeight = global.bodyHeight || (global.bodyHeight = this.getBodyHeight(options.height));
        global.box.removeCss("height");
        return this.exec(global.body, this.initAnimation("collapse", global.body, animation), function () {
            options.collapsed = true;
            global.body.hide();
            if (!only && arguments[0]) {
                options.onAfterCollapse.call(this);
            }
        }, "collapse");
    },
    /**
     * 最大化面板
     * @param {Boolean} [only=false] 为true时，不触发面板最大化事件
     * @param {Boolean|Object} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    maximize: function (only, animation) {
        var options = this._options;
        if ((options.maximized && !options.collapsed && !options.minimized) || !this.execuable(only, "Maximize")) {
            return this;
        }
        var global = this._global,
            original = !(options.minimized || options.collapsed);
            // 保存当前几何状态
        fastDev.apply(global, {
            offsetLeft: !original ? global.offsetLeft : options.left,
            offsetTop: !original ? global.offsetTop : options.top,
            offsetWidth: !original ? global.offsetWidth : options.width,
            offsetHeight: !original ? global.offsetHeight : options.height
        });
        return this.exec(global.box, this.initAnimation("maximize", global.box, animation), function () {
            options.maximized = options.display = !(options.minimized = options.collapsed = false);
            global.body.show();
            if (!only && arguments[0]) {
                options.onAfterMaximize.call(this);
            }
        }, "maximize");
    },
    /**
     * 显示面板
     * @param {Boolean} [only=false] 为true时，不触发面板显示事件
     * @param {Boolean|Object} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel}
     */
    open: function (only, animation) {
        var options = this._options,
            global = this._global;
        if (!options.minimized || !this.execuable(only, "Open")) {
            return this;
        }
        return this.exec(global.box, this.initAnimation("open", global.box, animation), function () {
            options.display = !(options.minimized = false);
            global.box.css("display", "block");
            if (!only && arguments[0]) {
                options.onAfterOpen.call(this);
            }
        }, "open");
    },
    /**
     * 最小化面板
     * @param {Boolean} [only=false] 为true时，不触发面板最小化事件
     * @param {Boolean|Object} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    minimize: function (only, animation) {
        var options = this._options,
            global = this._global;
        if (options.minimized || !this.execuable(only, "Minimize")) {
            return this;
        }
        return this.exec(global.box, global.initialized ? this.initAnimation("minimize", global.box, animation) : {}, function () {
            options.display = !(options.minimized = true);
            global.box.hide();
            if (!only && arguments[0]) {
                options.onAfterMinimize.call(this);
            }
        }, "minimize");
    },
    /**
     * 将已最大化、已折叠或已隐藏的面板还原至一般状态
     * @param {Boolean} [only=false] 为true时，不触发面板还原事件
     * @param {Boolean|Object} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    reset: function (only, animation) {
        var options = this._options,
            global = this._global;
        if (!(options.collapsed || options.maximized || options.minimized) || !this.execuable(only, "Reset")) {
            return this;
        }
        return this.exec(global.box, this.initAnimation("reset", global.box, animation), function () {
            options.display = !(options.collapsed = options.minimized = options.maximized = false);
            global.body.show();
            if (!only && arguments[0]) {
                options.onAfterReset.call(this);
            }
        }, "reset");
    },
    /**
     * 关闭面板
     * @param {Boolean} [only=false] 为true时，不触发相关事件
     * @param {Boolean|Object} [animation=false] 是否使用动画效果。同时需指定animateSpeed参数
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    close: function (only, animation) {
        var options = this._options,
            global = this._global;
        if (!this.execuable(only, "Close")) {
            return this;
        }
        // persisted标记为实例重用，用以提升性能
        options.closed = !options.persisted;
        options.display = !(options.minimized = true);
        return this.exec(global.box, this.initAnimation("close", global.box, animation), function () {
            if (!arguments[0]) {
            	// 销毁加载图标
                this.showLoading(null);
                global.box.hide();
            } else {
                if (!options.persisted) {
                	// 清空iframe
                    options.onBeforeDestroy.call(this);
                    if (!global.iframe.isEmpty()) {
                        global.iframe.prop("src", "");
                    }
                    this.destroy();
                }
                if (!only) {
                    options.onAfterClose.call(this);
                }
                if (!options.persisted) {
                	// 非单实例模式时，清理私有变量（可能对IE6下的内存释放有点帮助）
                    var prop;
                    for (prop in global) {
                        global[prop] = null;
                    }
                    for (prop in options) {
                        options[prop] = null;
                    }
                    options.destroyed = true;
                }
            }
        }, "close");
    },
    /**
     * 判断面板是否可见
     * @return {Boolean} true时可见，false时不可见
     */
    isShow: function () {
        return this._options.display;
    },
    /**
     * 重新定义面板大小
     * @param {Object} size 尺寸参数对象
     * @param {String} size.width 宽度
     * @param {String} size.height 高度
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    resize: function (size) {
        var options = this._options,
            global = this._global,
            container = options.container,
            fx = fastDev.Util.StringUtil.stripUnits,
            tmp;
        if (fastDev.isPlainObject(size)) {
        	// 记录宽高信息
            fastDev.each(["width", "height"], function (index, name) {
                if (!isNaN(tmp = fx(size[name], container, name))) {
                    options[name] = Math.round(tmp);
                }
            });
            global.box.width(options.width = options.width || 0);
            options.height = options.height || 0;
            if (!options.collapsed) {
                global.box.height(options.height);
            }
            // 设置宽高
            global.body.height(global.bodyHeight = this.getBodyHeight(options.height));
            global.content.height(this.getContentHeight(global.bodyHeight));
            options.onAfterResize.call(this.showLoading());
        }
        return this;
    },
    /**
     * 移动面板至指定坐标
     * @param {Object} position 坐标参数对象
     * @param {String} position.left X轴坐标值
     * @param {String} position.top Y轴坐标值
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    move: function (position) {
        var options = this._options,
            global = this._global,
            container = options.container,
            fx = fastDev.Util.StringUtil.stripUnits,
            tmp;
        if (fastDev.isPlainObject(position)) {
        	// 记录坐标信息
            fastDev.each(["left", "top"], function (index, name) {
                if (!isNaN(tmp = fx(position[name], container, index === 0 ? "width" : "height"))) {
                    options[name] = Math.round(tmp);
                }
            });
            // 设置坐标信息
            global.box.css({
                left: options.left = options.left || 0,
                top: options.top = options.top || 0
            });
            options.onAfterMove.call(this.showLoading());
        }
        return this;
    },
    /**
     * 重设标题内容及标题栏图标
     * @param {String} title 标题内容，可带HTML标签文本
     * @param {String} [iconCls] 标题图标样式名，值为空字符串时将去除标题图标
     * @return {fastDev.Ui.Panel}
     */
    setTitle: function (title, iconCls) {
        var global = this._global,
            elem;
        if (this._options.showHeader) {
        	// 标题栏可以使用标签
            (elem = global.title).elems[0].innerHTML = title + "";
            if (typeof iconCls === "string") {
                elem.removeClass("ui-window-header-ico").removeClass(global.iconClsName);
                if (iconCls) {
                    elem.addClass("ui-window-header-ico").addClass(global.iconClsName = iconCls);
                }
            }
        }
        return this;
    },
    /**
     * 设置窗体内容（可包含HTML标签以及复合控件声明字符串）
     * <p>若使用了src配置属性声明了内部子页面，将默认禁止设置新的内容
     * <p>可先调用empty方法清空窗体内容后（内部子页面同样也会被清理掉）再设置新的内容
     * <p>该方法会清空之前的窗体内容
     * @param {String} content 内容文本
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    setContent: function (content) {
        var global = this._global;
        if (fastDev.isValid(content) && global.iframe.isEmpty()) {
            global.content.empty().removeClass("ui-window-nopadding").elems[0].innerHTML = content + "";
            // 编译
            fastDev.Core.ControlBus.compile(null, global.content.elems);
        }
        return this;
    },
    /**
     * 清空内容区域
     * @return {fastDev.Ui.Panel} 当前控件实例 
     */
    empty: function () {
        var options = this._options,
            global = this._global;
        (global.iframeLoadHandle || fastDev.noop)();
        global.content.empty().removeClass("ui-window-nopadding");
        global.iframe = fastDev();
        options.src = "";
        return this;
    },
    /**
     * 追加窗体内容（可包含文本、标签、控件等）
     * <p>若使用了src配置属性声明了内部子页面，将默认禁止往内容区域追加内容
     * <p>可先调用empty方法清空窗体内容后（内部子页面同样也会被清理掉）再追加新的内容
     * <p>该方法不会清空之前的窗体内容
     * @param {String|Element|Component|DomObject} content 需追加的内容
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    append: function (content) {
        var global = this._global,
            elem;
        if (fastDev.isValid(content) && global.iframe.isEmpty()) {
            global.content.append(elem = (fastDev.isComponent(content) || fastDev.isDomObject(content)) ? content : fastDev(typeof content === "string" ? "<div>" + content + "</div>" : content));
            if (elem !== content) {
                fastDev.Core.ControlBus.compile(null, elem.elems);
            }
        }
        return this;
    },
    /**
     * 加载新的面板内部Iframe子页面
     * @param {String} src 子页面链接地址
     * @return {fastDev.Ui.Panel}
     */
    load: function (src) {
        var options = this._options,
            global = this._global;
        if (fastDev.isString(src) && (src = fastDev.Util.StringUtil.trim(src)) && !options.closed) {
            var that = this,
                time = new Date().getTime();
            options.src = src;
            if (global.iframe.isEmpty()) {
            	// 初始iframe
                global.iframe = fastDev("<iframe frameborder='0' width='100%' height='100%' style='position:absolute;top:0'></iframe>")
                //
                .addClass("ui-window-iframe").appendTo(global.content.empty().addClass("ui-window-nopadding"));
                if (!arguments[1]) {
                    this.resize({
                        width: options.width,
                        height: options.height
                    });
                }
            }
            // 加载iframe前，进行相应的状态判断与准备
            if (this.readyForLoading(global.iframe) !== false) {
                (global.iframeLoadHandle || fastDev.noop)();
                global.loaded = false;
                // 设置src并加载子页面
                global.iframe.prop("src", src).bind("load", global.iframeLoadHandle = function () {
                    if (fastDev.isComponent(global.loading)) {
                        global.loading.close();
                    }
                    global.iframe.unbind("load", global.iframeLoadHandle);
                    global.loaded = !(global.loading = false);
                });
                // 实例化加载图标
                global.loading = options.showLoading ? fastDev.create("ProgressBar", {
                    container: global.content,
                    text: options.loadingMsg,
                    zIndex: options.zIndex + 3,
                    opacity: 0.025,
                    onOverlayClick: function () {
                        if (new Date().getTime() - time > 5000) {
                            this.close();
                        }
                    }
                }) : true;
            }
        }
        return this;
    },
    /**
     * 显示面板
     * @return {fastDev.Ui.Panel}
     */
    show: function () {
        return this._global.initialized ? this.open.apply(this, arguments) : this;
    },
    /**
     * 最小化（隐藏）面板
     * @return {fastDev.Ui.Panel}
     */
    hide: function () {
        return this._global.initialized ? this.minimize.apply(this, arguments) : this;
    },
    /**
     * 窗体类控件动画全局开关 
     * <p>出于浏览器性能考虑，在IE6和IE7下将默认禁用窗体动画（用户可通过此属性再次开启）
     * @type {Boolean}
     */
    launchAnimation: (fastDev.Browser.isIE6 || fastDev.Browser.isIE7) ? false : true
});
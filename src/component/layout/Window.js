/**
 * @class fastDev.Ui.Window
 * @extends fastDev.Ui.Panel
 * @author chengwei
 * <p>弹出窗控件。</p>
 * <p>支持窗口折叠，最大最小化，拖拽定位，调节尺寸，跨级交互等。</p>
 * <p>作者：程伟</p>
 *     
 *     fastDev.create("Window", {
 *          title : "标题",
 *          content : "弹窗内容"
 *     });
 */
fastDev.define("fastDev.Ui.Window", {
    extend: "fastDev.Ui.Panel",
    alias: "Window",
    _options: {
        /**
         * 浮动层级
         * @type {String|Number}
         */
        zIndex: "auto",
        /**
         * 是否显示最大化按钮
         * @type {Boolean}
         */
        showMaxBtn: true,
        /**
         * 是否显示关闭窗体按钮
         * @type {Boolean}
         */
        showCloseBtn: true,
        /**
         * 是否显示折叠按钮
         * @type {Boolean}
         */
        showCollapseBtn: true,
        /**
         * 内容图标名
         * <p>在内容区域显示
         * @type {String} 
         */
        icon: "",
        /**
         * 是否可拖动
         * @type {Boolean}
         */
        allowDrag: true,
        /**
         * 是否可拖拽调节尺寸
         * @type {Boolean}
         */
        allowResize: true,
        /**
         * 是否显示阴影
         * <p>出于浏览器性能考虑，IE6下将默认禁用窗体阴影（用户可通过此属性再次开启）
         * @type {Boolean}
         */
        showShadow: fastDev.Browser.isIE6 ? false : true,
        /**
         * 窗体宽度值
         * @type {String} 
         */
        width: "auto",
        /**
         * 窗体高度值
         * @type {String} 
         */
        height: "auto",
        /**
         * 动画执行的参照对象
         * <p>使用组件对象时，将取组件对象中的第一个元素作为目标元素
         * <p>控件将优先从原父页面寻找该目标元素，若找不到该目标元素则从当前页面找（在跨级展现的情况下）
         * @type {String|Element|DomObject|Component}
         */
        animateTarget: "",
        /**
         * 是否限制在父容器中，即是否需要窗口跨级(跨iframe)显示。
         * 此属性指定为false时，窗口将跨级创建并展示（有权访问的顶层窗口需引入该控件js）。
         * 跨窗口显示即指弹窗从当前窗口（一般是一个iframe页面）跨级至有权访问的最顶层窗口（一般是框架集的最顶层框架）创建并展现。
         * 跨级弹窗的作用域（window）将不再是原窗口对象，而是原窗口对象的顶层父页面对象（top），此时若弹窗需与原父页面交互，则需通过指定的接口来存储和传递数据。
         * 可通过实例的setData(name, value)、getData(name)方法和fastDev.Ui.Window.setData(name, value)、fastDev.Ui.Window.getData(name)方法存取数据。
         * <frameset/>定义的框架集由于浏览器限制而不能够跨级访问，但iframe可以。
         * 由于浏览器安全限制，跨域访问将受到限制，若需跨域访问则需做其他特殊处理。
         * 此控件目前对跨域问题不作支持。
         * @type {Boolean}
         */
        inside: true,
        /**
         * 窗口是否总是可见
         * 此属性为真时，则窗口仅能在当前可视区域内拖动
         * @type {Boolean}
         */
        visible: true,
        /**
         * 是否为模态窗体（锁屏）
         * @type {Boolean}
         */
        modal: true,
        /**
         * 锁屏时遮罩层的透明度
         * @type {Number} 
         */
        overlayOpacity: 0.08,
        /**
         * 是否使用固定定位
         * 固定定位的窗口，其位置不受滚动条滚动影响
         * 兼容IE6
         * @type {Boolean}
         */
        fixed: false,
        /**
         * 定义底部的buttons
         * 各个按钮的配置中align属性可指定按钮的摆放位置（left、right、center）
         * 按钮点击事件回调中，作用域为当前按钮控件，参数为：
         * <p>-event 点击事件对象</p>
         * <p>-win 当前弹窗实例</p>
         * <p>-window 内部子页的window对象（仅当存在且有权访问此变量时）</p>
         * <p>-fastDev 内部子页面的fastDev对象（仅当存在此变量时）</p>
         * @type {Array}
         */
        buttons: null,
        /**
         * 最大宽度限制，可带单位px、em、%
         * @type {String|Number}
         */
        maxWidth: Infinity,
        /**
         * 最小宽度限制，可带单位px、em、%
         * @type {String|Number}
         */
        minWidth: 199,
        /**
         * 最大高度限制，可带单位px、em、%
         * @type {String|Number}
         */
        maxHeight: Infinity,
        /**
         * 最小高度限制，可带单位px、em、%
         * @type {String|Number}
         */
        minHeight: 122,
        /**
         * 调节大小时的可调方向
         * @type {String}
         */
        resizeDirection: "s,e,se",
        /**
         * 调节大小时的宽高比例
         * <p>指定此比例后，窗口的宽高比将始终保持此值（包括初始窗口及最大化窗口时）
         * @type {Number}
         */
        resizeRatio: null,
        /**
         * 调节窗口尺寸时是否显示窗口大小提示标签
         * <p>开发阶段，需对窗口固定大小时开启此属性可帮助开发人员确定窗口合适的尺寸大小
         * @type {Boolean}
         */
        showSizeTips: false
    },
    /**
     * 用于构建静态模板串
     * @param {Object} params 模板已解析参数对象
     * @private 
     */
    staticTemplate: function (params) {
        var html = [];
        if (params.inside) {
            html.push('<div name="box" class="ui-window ui-panel ui-panel-box ' + params.cls + '" style="display:none;z-index:' + params.zIndex + '">');
            if (params.showHeader) {
                html.push([
                        '<div name="header" class="ui-panel-header">',
                        '<div name="title" class="ui-window-header-text ' + params.iconCls + ' ' + params.headerCls + '" style="height:16px">' + params.title + '</div>',
                        '<div name="tool" class="ui-window-tool">',
                        '<span class="ui-window-tool-show" name="Expand" handler="expand" title="展开"></span>',
                        '<span class="ui-window-tool-hidden" name="Collapse" handler="collapse" title="折叠"></span>',
                        '<span class="ui-window-tool-min" name="Min" handler="minimize" title="最小化"></span>',
                        '<span class="ui-window-tool-restore" name="Restore" handler="reset" title="还原"></span>',
                        '<span class="ui-window-tool-max" name="Max" handler="maximize" title="最大化"></span>',
                        '<span class="ui-window-tool-close" name="Close" handler="close" title="关闭"></span>',
                        '</div></div>'
                ].join(''));
            }
            html.push('<div name="body" class="ui-panel-body ' + params.borderCls + '">');
            html.push('<div name="content" class="ui-panel-content ' + params.bodyCls + '" style="' + params.bodyStyle + '"></div>');
            if ( !! params.buttons) {
                html.push([
                        '<div name="buttons" class="ui-window-button-panel">',
                        '<span name="left" class="ui-left" style="display:none;margin-left:' + params.btnPanelMarginLeft + '"></span>',
                        '<span name="center" class="ui-center" style="display:none;overflow:hidden"></span>',
                        '<span name="right" class="ui-right" style="display:none;margin-right:' + params.btnPanelMarginRight + '"></span>',
                        '</div>'
                ].join(''));
            }
            html.push('</div></div>');
            if ( !! params.showShadow) {
                html.push([
                        '<div name="shadow" class="ui-window-shadow-bg" style="display:none">',
                        '<div class="shadow-st">',
                        '<div class="shadow-stl"></div>',
                        '<div class="shadow-stc"></div>',
                        '<div class="shadow-str"></div>',
                        '</div>',
                        '<div class="shadow-sc">',
                        '<div class="shadow-sml"></div>',
                        '<div class="shadow-smc"></div>',
                        '<div class="shadow-smr"></div>',
                        '</div>',
                        '<div class="shadow-sb">',
                        '<div class="shadow-sbl"></div>',
                        '<div class="shadow-sbc"></div>',
                        '<div class="shadow-sbr"></div>',
                        '</div></div>'
                ].join(''));
            }
            if ( !! params.modal) {
                html.push('<div name="mask" class="ui-mask" style="display:none"></div>');
            }
        }
        return html.join('');
    },
    tplParam: ["inside", "zIndex", "showHeader", "cls", "iconCls", "headerCls", "title", "borderCls", "bodyCls", "bodyStyle", "buttons", "showShadow", "modal", "btnPanelMarginLeft", "btnPanelMarginRight"],
    /**
     * 准备参数
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    ready: function (options, global) {
        var target = options.container,
            counter;
        if (!(options.inside = !! options.inside) && !this.equals(fastDev.Ui.Window.top, window) && (!target.hasElem() || fastDev.isWindow(target.elems[0]))) {
            // 窗口跨级
            global.instance = this.cross(options, global);
            if (options.saveInstance && options.id) {
            	// 将当前实例保存起来
                fastDev.Core.ControlBus.saveInstance(options.id, global.instance);
            }
            return false;
        } else {
            global.pageContext = global.pageContext || window;
            if (!fastDev.isValid(document) || !fastDev.isValid(document.body)) {
                options.alias = this.alias;
                options.instance = this;
                // 若页面body未初始，则在页面加载完毕后渲染弹窗
                fastDev(function () {
                    var win = fastDev.create(options.alias, options),
                        instance = options.instance;
                    instance._options = win._options;
                    instance._global = win._global;
                    instance.elems = win.elems;
                });
                return false;
            }
            global.instance = this;
            // 当前页面弹窗计数器，用于协助计算索引值
            counter = ++fastDev.Util.position.top.fastDev.Ui.Window.count;
            fastDev.apply(global, {
                uuid: fastDev.getID().toString(),
                windowResizeHandles: {},
                btnPanelMarginLeft: (fastDev.Browser.isIE6 || fastDev.Browser.isIE7) ? "10px" : "5px",
                btnPanelMarginRight: (fastDev.Browser.isIE6 || fastDev.Browser.isIE7) ? "0px" : "6px",
                container: (target.hasElem() && !fastDev.isWindow(target.elems[0])) ? target : null,
                buttonInstances: []
            });
            options.left = parseInt(options.left, 10) ? options.left + "" : 0;
            options.top = parseInt(options.top, 10) ? options.top + "" : 0;
            fastDev.apply(options, {
                inside: true,
                left: global.container ? options.left : options.left || "50%",
                top: global.container ? options.top : options.top || "38.2%",
                buttons: [].concat(options.buttons),
                showShadow: !! options.showShadow && !global.container,
                animateTarget: this.toDomObject(options.animateTarget),
                showMaxBtn: options.allowResize && options.showMaxBtn,
                container: global.container || fastDev(document.body),
                zIndex: (parseInt(options.zIndex, 10) || (100 + counter * 3)) + 2,
                resizeRatio: parseFloat(options.resizeRatio) || 0,
                modal: !! options.modal && !global.container,
                content: (fastDev.Browser.isIE6 && options.content === "") ? "　" : options.content
            });
            global.btnPanelMargin = (fastDev.Browser.isIE6 || fastDev.Browser.isIE7) ? "5px" : "10px";
        }
    },
    /**
     * 构造结构
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    construct: function (options, global) {
        if (options.inside) {
            var elems = ["buttons", "shadow", "mask", "left", "right", "center"],
                elem;
            global.doc = fastDev(document);
            global.win = fastDev(window);
            // 将内部元素对象保存
            while (elem = elems.shift()) {
                global[elem] = this.find("[name='" + elem + "']");
            }
            options.container = global.container || global.win;
            if (global.container) {
            	// 嵌入页面中显示时，设置为相对定位，以便可移动位置
                global.box.css("position", "relative");
            } else if (options.fixed) {
            	// 固定定位应用
                this.fixed(global.box);
            } else {
            	// 设置绝对定位样式，针对当前body定位
                global.box.css("position", "absolute");
                global.shadow.css("position", "absolute");
            }
            // 遮罩层透明度样式值
            global.maskOpacity = parseFloat(options.overlayOpacity) || 0.021;
            // 初始底部按钮栏按钮
            this.addButtons(options.buttons).setButtons(false);
            if (options.modal) {
                this.elems.splice(this.elems.length - 1, 1);
            }
            global.constructed = true;
        }
    },
    /**
     * 初始控件
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    init: function (options, global) {
        if (options.inside) {
            global.initialized = false;
            if (options.display) {
            	// 显示窗体
                this.open(!(options.minimized = true));
                options.height = global.offsetHeight;
            } else {
            	// 不显示时，隐藏阴影
                this.setShadow(false);
                global.initialized = true;
            }
            if (options.showMaxBtn) {
            	// 标题栏双击最大化窗体事件绑定
                global.header.bind("dblclick", function () {
                    this[options.maximized ? "reset" : "maximize"]();
                }, this);
            }
        }
    },
    /**
     * 获取内容部分高度值
     * @param {Number} bodyHeight 当前body高度
     * @return {Number}
     * @protected
     */
    getContentHeight: function (bodyHeight) {
        var global = this._global,
            content = global.content;
        // 底部按钮栏有37px的高度
        return Math.max(bodyHeight - (content.outerHeight(true) - content.height()) - (global.hasButton ? Math.max(global.buttons.outerHeight(true), 37) : 0), 0);
    },
    /**
     * 获取内容区域以外部分的宽高值
     * @return {Number} width、height
     * @protected 
     */
    getContentBounding: function () {
        var options = this._options,
            global = this._global;
        return {
            width: Math.abs(global.content.outerWidth(true) - global.content.width() + (options.showBorder ? 2 : 0)),
            // 增加10px的冗余高度，使得内容显示更美观
            height: Math.abs(10 + (options.showBorder ? 1 : 0) + (global.content.outerHeight(true) - global.content.height()) + (global.hasButton ? Math.max(global.buttons.outerHeight(true), 37) : 0) + (options.showHeader ? Math.max(global.header.outerHeight(true), 27) : 1))
        };
    },
    /**
     * 将目标对象转换为DomObject对象
     * @param {Object} target 目标对象
     * @param {fastDev} fast 命名空间
     * @return {DomObject}
     * @private
     */
    toDomObject: function (target, fast) {
        var options = this._options,
            element;
        if (options.crossed === "crossed" && !fast) {
        	// 从原父页面找对应元素对象
            return this.toDomObject(target, options.parent.fastDev);
        } else {
        	// 从当前页面找元素对象
            fast = (fast || fastDev);
            if ((element = ((fast.isComponent(target) || fast.isDomObject(target)) ? fast(target.elems) : fast((fast.isString(target) && target) ? "#" + target : target) || fast())).isEmpty() && fast !== fastDev) {
                return this.toDomObject(target, fastDev);
            }
            return element;
        }
    },
    /**
     * 初始动画设置
     * @param {String} type
     * @param {DomObject} target
     * @param {Object|Boolean|Array} queue
     * @return {Object}
     * @protected
     */
    initAnimation: function (type, target, animation) {
        var that = this,
            options = this._options,
            global = this._global,
            container = options.container,
            box = global.box,
            queue, index;
            // 计算当前的页面滚动条位置
        global.docScrollLeft = !isNaN(global.docScrollLeft) ? global.docScrollLeft : global.doc.scrollLeft();
        global.docScrollTop = !isNaN(global.docScrollTop) ? global.docScrollTop : global.doc.scrollTop();
        // 清理计时器，并隐藏阴影等
        this.clearTimer().setShadow(false).setButtons();
        // 初始动画队列，取最后一帧动画用于定义默认动画设置
        for (index in (queue = this.toAnimationQueue(target, animation === false ? false : animation || true, global.containerWidth = global.containerWidth || container.width(), global.containerHeight = global.containerHeight || container.height()))) {
            queue[index].start = this.limit(queue[index].start);
            queue[index].stop = this.limit(queue[index].stop);
        }
        animation = queue[queue.length - 1];
        switch (type) {
        case "expand":
        case "collapse":
        // 展开与折叠事件
            this.setResizer(false).setButtons(false);
            // 获取动画参数并对相应的用户回调进行代理等
            animation.callback = this.getAnimationParam(animation.callback, function () {
            	// 动画结束后的收尾处理
                options.height = box.height();
                this.setResizer(type === "expand").setButtons(type === "expand");
            });
            return fastDev.Ui.Panel.initAnimation.call(this, type, target, queue);
        case "maximize":
            if (!fastDev.Browser.isIE6 || global.container) {
                // 保存转换为fixed定位后的元素坐标值
                var offset = options.fixed ? {
                    left: box.elems[0].offsetLeft,
                    top: box.elems[0].offsetTop
                } : global.container ? {
                    left: parseInt(box.css("left"), 10) || 0,
                    top: parseInt(box.css("top"), 10) || 0
                } : box.offset();
                // 依据是否固定定位进行坐标转换
                global.offsetLeft = offset.left - ((options.fixed || global.container) ? 0 : global.docScrollLeft);
                global.offsetTop = offset.top - ((options.fixed || global.container) ? 0 : global.docScrollTop);
            }
            // 隐藏Resizer
            this.setResizer(false);
            // 动画配置参数初始
            animation.easing = animation.easing || "expo-easeIn";
            animation.start.opacity = animation.start.opacity || (options.minimized ? 0.1 : 0.8);
            // 若指定了用户配置动画，则不加载默认的动画配置设置
            animation.stop = this.getAnimationParam(animation.stop, this.limit({
                left: "50%", // 水平居中
                top: "38.2%", // 垂直黄金比例定位
                width: global.containerWidth,
                height: global.containerHeight,
                opacity: 1
            }));
            animation.callback = this.getAnimationParam(animation.callback, function (stop) {
            	// 动画结束后，重新定义固定定位，以及自适应窗体大小（跟随窗口大小变化，自动最大化填充窗口）
                this.fixed(box).fill(box, function (size) {
                    that.resize(size);
                });
            });
            break;
        case "reset":
            animation.easing = animation.easing || "expo-easeIn";
            if (options.minimized) {
            	// 获取目标元素的坐标信息等
                this.getBoundingRect(animation.start, animation.target);
            }
            animation.start.opacity = animation.start.opacity || (options.minimized ? 0.1 : 0.8);
            // 应用默认的动画配置参数（若已存在用户配置动画参数，则不会加载默认的动画配置参数）
            animation.stop = this.getAnimationParam(animation.stop, {
                top: global.offsetTop,
                left: global.offsetLeft,
                width: global.offsetWidth,
                height: global.offsetHeight,
                opacity: 1
            });
            // 动画结束后的回调事件设置
            animation.callback = this.getAnimationParam(animation.callback, function (stop) {
                this.fixed(box, false).fill(box, false).setResizer().lock();
            });
            break;
        case "minimize":
            this.fill(box, false).lock(false);
            animation.easing = animation.easing || "quad-easeOut";
            if (fastDev.isEmptyObject(this.getBoundingRect(animation.stop, animation.target, 0.1))) {
                fastDev.apply(animation.stop, {
                    top: 0,
                    left: 0,
                    width: 80,
                    height: 30,
                    opacity: 0.1
                });
            }
            break;
        case "open":
            this.lock().setButtons(false);
            animation.easing = animation.easing || "expo-easeIn";
            var max = (options.maximized && !options.collapsed),
            // 几何属性限制值处理
                rect = this.limit({
                    left: max ? "50%" : options.left,
                    top: max ? "38.2%" : options.top,
                    width: options.maximized ? global.containerWidth : options.width,
                    height: max ? global.containerHeight : options.height
                });
            rect.height = options.collapsed ? options.height : rect.height;
            if (!options.collapsed && fastDev.isEmptyObject(this.getBoundingRect(animation.start, animation.target, 0.1))) {
                fastDev.apply(animation.start, {
                    left: rect.left + (rect.width < 8 ? rect.width / 2 : 4),
                    top: rect.top + (rect.height < 8 ? rect.height / 2 : 4),
                    height: Math.max(rect.height - 8, 0),
                    width: Math.max(rect.width - 8, 0),
                    opacity: 0.1
                });
            }
            fastDev.apply(animation.stop, this.getAnimationParam(animation.stop, {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                opacity: 1
            }));
            animation.callback = this.getAnimationParam(animation.callback, function (stop) {
                global.initialized = true;
                if (options.maximized) {
                    this.fixed(box).fill(box, function (size) {
                        that.resize(size);
                    });
                }
                this.setResizer().setDragger().setButtons(!options.collapsed);
            });
            break;
        case "close":
        // 清理计时器
            window.clearInterval(global.windowCloseTimer);
            window.clearTimeout(global.windowResizeTimer);
            window.clearTimeout(global.windowCloseTimer);
            this.lock(options.persisted ? false : null);
            animation.easing = animation.easing || "liner-easeOut";
            if (fastDev.isEmptyObject(this.getBoundingRect(animation.stop, animation.target))) {
                var width = options.width,
                    height = parseInt(box.css("height"), 10);
                fastDev.apply(animation.stop, {
                    left: parseInt(box.css("left"), 10) + (width < 8 ? width / 2 : 4),
                    top: parseInt(box.css("top"), 10) + (height < 8 ? height / 2 : 4),
                    height: Math.max(height - 8, 0),
                    width: Math.max(width - 8, 0)
                });
            }
            animation.stop.opacity = animation.stop.opacity || 0;
            animation.callback = this.getAnimationParam(animation.callback, function (stop) {
            	// 解除自动填充
                this.fill(box, false);
                if (!options.persisted) {
                	// 清理resizer、dragger、按钮等
                    this.setResizer(null).setDragger(null).setButtons(null);
                    // 清理全局状态变量
                    delete(this.getData("@fastDev" + global.uuid) || fastDev).Ui.Window.windows[global.uuid];
                    this.setData("@fastDev" + global.uuid, null);
                    fastDev.Util.position.top.fastDev.Ui.Window.count--;
                }
            });
        }
        // 清理无效的动画样式参数值
        for (var i = 0, j, k, limit, name = ["start", "stop"]; i < queue.length; i++) {
            for (j = 0; j < 2; j++) {
                for (k in (limit = queue[i][name[j]])) {
                    if (isNaN(limit[k])) {
                        delete limit[k];
                    }
                }
            }
        }
        return queue;
    },
    /**
     * 动画结束时的回调函数
     * @param {DomObject} target 动画目标
     * @param {Array[Object]} animation 动画配置对象 
     * @param {String} type 动画类型 
     * @protected
     */
    stopAnimation: function (target, animation, type) {
        var options = this._options,
            global = this._global,
            box = this._global.box,
            frame = animation[animation.length - 1].stop || {};
            // 结束动画后，重新计算尺寸并设置其值
        if (!options.collapsed && !options.closed && options.display && target.elems[0] === box.elems[0]) {
            fastDev.Ui.Panel.resize.call(this, {
                width: frame.width || box.width(),
                height: frame.height || box.height()
            });
        }
        // 应用父类的方法
        return fastDev.Ui.Panel.stopAnimation.apply(this, arguments);
    },
    /**
     * 获取动画配置参数
     * @param {Object} param 参数配置值
     * @param {Object} defaults 默认配置值
     * @return {Object}
     * @private
     */
    getAnimationParam: function (param, defaults) {
        if (fastDev.isFunction(param)) {
            var that = this;
            return function () {
                if (param.apply(that, arguments) !== false) {
                    (defaults || fastDev.noop).apply(that, arguments);
                }
            };
        }
        // 若不包含用户自定义的配置参数时，才会使用默认的配置参数
        return (!param || fastDev.isEmptyObject(param)) ? defaults : param;
    },
    /**
     * 每一次动画操作结束时，必将执行的一次回调
     * @param {DomObject} target 动画目标
     * @param {Object} stop 结束时的状态
     * @protected 
     */
    finishAction: function (target, stop) {
        var global = this._global;
        if (global.initialized) {
            if (this.isShow()) {
            	// 固定定位重计算
                if (this._options.fixed) {
                    this.fixed(global.box);
                }
                fastDev.Ui.Panel.finishAction.apply(this, arguments);
                this.setShadow();
                if (global.needCompile) {
                	// 编译窗体内容
                    fastDev.Core.ControlBus.compile(null, global.content.elems);
                    global.needCompile = false;
                }
            }
            global.containerWidth = global.containerHeight = global.docScrollLeft = global.docScrollTop = undefined;
        }
        return this;
    },
    /**
     * 获取元素的边界信息
     * @param {Object} rect
     * @param {DomObject} [target]
     * @param {Number} [opacity]
     * @return {Object} left、top、width、height
     * @private
     */
    getBoundingRect: function (rect, target, opacity) {
        if (fastDev.isEmptyObject(rect) && (target = this.toDomObject(target || this._options.animateTarget)).hasElem()) {
            var global = this._global,
                offset = this.getOffset(target),
                doc = global.doc,
                fixed = global.box.css("position") === "fixed";
                // 当前坐标及宽高信息计算
            fastDev.apply(rect, {
                left: offset.left - (fixed ? !isNaN(global.docScrollLeft) ? global.docScrollLeft : doc.scrollLeft() : 0),
                top: offset.top - (fixed ? !isNaN(global.docScrollTop) ? global.docScrollTop : doc.scrollTop() : 0),
                width: target.innerWidth(),
                height: target.innerHeight()
            });
            if (opacity !== undefined) {
                rect.opacity = opacity;
            }
        }
        return rect;
    },
    /**
     * 判断2个窗口对象是否属同一个对象
     * <p>解决IE某些浏览器中不能通过运算符直接判断的问题
     * @param {Window} a
     * @param {Window} b
     * @private 
     */
    equals: function (a, b) {
        var equal;
        try {
            equal = a.fastDev.Ui.Window.id === b.fastDev.Ui.Window.id;
        } catch (e) {} finally {
            return equal;
        }
    },
    /**
     * 获取目标元素的坐标值
     * @param {DomObject} [target] 不传target参数，则获取原父页面的偏移量
     * @return {Object} left、top
     * @private
     */
    getOffset: function (target) {
        var options = this._options;
        if (options.crossed === "crossed") {
            var that = this,
                parent = options.parent,
                id = parent.fastDev.Ui.Window.id,
                iframes = this.getData("@iframes" + id) || fastDev.Util.position.getIframePath(function () {
                    return that.equals(this, parent);
                });
            this.setData("@iframes" + id, iframes);
            return fastDev.Util.position.getBoundingRect(target, iframes);
        } else {
            return (target && !fastDev.isWindow(target)) ? target.offset() : {
                left: 0,
                top: 0
            };
        }
    },
    /**
     * 清理计时器
     * @return {fastDev.Ui.Window}
     * @private
     */
    clearTimer: function () {
        if (!this._options.destroyed) {
            var global = this._global;
            // 清理可能用到的计时器
            window.clearInterval(global.shadowFlickTimer);
            window.clearInterval(global.windowShakeTimer);
            global.box.removeCss("marginLeft").removeCss("opacity");
            global.shadow.removeCss("marginLeft");
        }
        return this;
    },
    /**
     * 设置阴影
     * @param {Boolean} [show] 是否显示阴影
     * @return {fastDev.Ui.Window}
     * @private
     */
    setShadow: function (show) {
        var options = this._options;
        if (options.showShadow) {
            var global = this._global;
            if (show === false || !global.initialized || options.minimized || options.closed || this.isDrawing()) {
            	// 隐藏阴影
                global.shadow.css("display", "none");
            } else {
            	// 重计算阴影
                var box = global.box,
                    height = box.height(),
                    width = box.width(),
                    shadow = global.shadow,
                    fixed = global.box.css("position") === "fixed",
                    offset = {
                        left: fixed ? box.elems[0].offsetLeft : parseInt(box.css("left"), 10) || 0,
                        top: fixed ? box.elems[0].offsetTop : parseInt(box.css("top"), 10) || 0
                    },
                    body = global.htmlBody || (global.htmlBody = fastDev(document.body)),
                    win = global.win,
                    docLeft = !isNaN(global.docScrollLeft) ? global.docScrollLeft : global.doc.scrollLeft(),
                    docTop = !isNaN(global.docScrollTop) ? global.docScrollTop : global.doc.scrollTop();
                    //  边界处理，以免阴影撑出页面滚动条
                width = offset.left + width >= Math.max(body.width(), docLeft + (global.containerWidth || win.width())) ? width - 5 : width;
                height = offset.top + height >= Math.max(body.height(), docTop + (global.containerHeight || win.height())) ? height - 4 : height;
                // 设置阴影样式
                shadow.css({
                    position: fixed ? "fixed" : "absolute",
                    zIndex: options.zIndex - 1,
                    left: offset.left - 5,
                    top: offset.top - 4,
                    height: height + 8,
                    width: width + 10,
                    display: "block"
                }).find(".shadow-sc").css("height", height - 4);
                shadow.children("div").find("div[class$='c']").css("width", width - 2);
                // 对阴影进行固定定位处理（如果需要的话）
                this.fixed(shadow, !! global.boxFixed, docLeft, docTop);
            }
        }
        return this;
    },
    /**
     * 锁屏
     * @param {Boolean} enable 为布尔值false时解除锁屏，为null时销毁遮罩
     * @return {fastDev.Ui.Window}
     * @private
     */
    lock: function (enable) {
        var that = this,
            options = this._options,
            global = this._global;
        if (options.modal && (!global.locked || enable === false || enable === null) && fastDev.isWindow(options.container.elems[0])) {
            var docLeft = !isNaN(global.docScrollLeft) ? global.docScrollLeft : global.doc.scrollLeft(),
                docTop = !isNaN(global.docScrollTop) ? global.docScrollTop : global.doc.scrollTop(),
                mask = global.mask;
                // 设置锁屏层样式
            global.mask.css(global.locked ? {} : {
                position: fastDev.Browser.isIE6 ? "absolute" : "fixed",
                opacity: 0,
                height: (global.containerHeight || global.win.height()) + docTop,
                width: (global.containerWidth || global.win.width()) + docLeft,
                zIndex: options.zIndex - 2,
                display: "block",
                left: 0,
                top: 0
            }).animate({
            	// 显影与消影动画处理（通过透明度）
                opacity: (enable !== false && enable !== null) ? global.maskOpacity : 0
            }, fastDev.Ui.Panel.launchAnimation ? Math.min(1.5 * options.animateSpeed, 1000) : 0, "expo-easeIn", function () {
                mask[enable === null ? "remove" : enable === false ? "hide" : "show"]();
                if (enable !== false && enable !== null && !global.maskClickHandle && options.showShadow) {
                    global.mask.bind("click", global.maskClickHandle = function () {
                        if (options.destroyed || that.isDrawing()) {
                            return;
                        }
                        var times = 10;
                        // 点击锁屏时，对阴影进行闪烁处理，以提醒用户当前操作状态
                        that.clearTimer();
                        global.box.css("opacity", 0.85);
                        global.shadowFlickTimer = window.setInterval(function () {
                            if (times % 2 === 0) {
                                global.shadow.hide();
                            } else {
                                global.shadow.show();
                            }
                            if (--times === 0 || options.minimized) {
                                window.clearInterval(global.shadowFlickTimer);
                                global.box.removeCss("opacity");
                                global.shadow[options.minimized ? "hide" : "show"]();
                            }
                        }, 80);
                    });
                }
            });
            global.locked = enable !== false;
            // 对锁屏进行固定定位以及自适应窗口大小处理（如果需要的话）
            this.fixed(global.mask, enable === null ? false : enable, docLeft, docTop).fill(global.mask, enable === null ? false : enable);
        }
        return this;
    },
    /**
     * 摇晃效果
     * @param {Number} frequency 摇晃的频率
     * @return {fastDev.Ui.Window}
     */
    shake: function (frequency) {
        var options = this._options;
        if (!options.minimized) {
            this.clearTimer();
            // 窗体抖动效果设置
            var global = this._global,
                box = global.box,
                shadow = global.shadow,
                margin, p = [4, 8, 4, 0, -4, -8, -4, 0],
                fx = function () {
                    box.css("marginLeft", margin = p.shift());
                    shadow.css("marginLeft", margin);
                    shadow[p.length % 4 === 0 ? "hide" : "show"]();
                    if (!p.length) {
                        window.clearInterval(global.windowShakeTimer);
                        box.removeCss("marginLeft");
                        if ( !! shadow) {
                            shadow.removeCss("marginLeft").show();
                        }
                    }
                };
            p = p.concat(p.concat(p));
            global.windowShakeTimer = window.setInterval(fx, Math.abs(parseInt(frequency, 10)) || 20);
        }
    },
    /**
     * 设置超时关闭
     * @param {Number} time 超时关闭等待时长，单位为秒（默认为3秒）
     * @param {Object|Boolean} animation 动画配置
     * @return {fastDev.Ui.Window}
     */
    closeTimeout: function (time, animation) {
        var that = this,
            global = this._global;
            // 超时自动关闭计时器设定
        clearTimeout(global.windowCloseTimer);
        global.windowCloseTimer = setTimeout(function () {
            that.close(false, animation);
        }, Math.abs(parseFloat(time) || 3) * 1000);
        return this;
    },
    /**
     * 绑定浏览器窗口事件，自适应窗口大小
     * @param {DomObject} elem 与绑定事件相关的元素
     * @param {Boolean|Function} handle 为布尔值false时，解绑与元素对应的事件。为函数时在事件发生时回调该函数
     * @return {fastDev.Ui.Window}
     * @private
     */
    fill: function (elem, handle) {
        if (fastDev.isWindow(this._options.container.elems[0]) && fastDev.isDomObject(elem)) {
            var global = this._global,
                id;
            elem.attr("winResizeEventId", (id = elem.attr("winResizeEventId") || fastDev.getID()));
            global.win.unbind("resize", (global.windowResizeHandles[id] || "").bind || fastDev.noop);
            if (handle === false) {
                delete global.windowResizeHandles[id];
                return this;
            }
            global.windowResizeHandles[id] = {
                target: elem,
                handle: handle,
                bind: function () {
                    clearTimeout(global.windowResizeTimer);
                    global.windowResizeTimer = setTimeout(function () {
                    	// 若需要自适应多个对象，则在同一个resize事件里面监听，以减少资源占用
                        var handles = global.windowResizeHandles,
                            handle, target, id;
                        for (id in handles) {
                        	// 迭代多个处理程序，并进行相应的回调处理
                            (fastDev.isFunction(handle = handles[id].handle) ? handle : (target = handles[id].target).css).call(target, {
                                width: global.win.width(),
                                height: global.win.height()
                            });
                        }
                    }, 120);
                }
            };
            // 绑定窗口的resize事件
            global.win.bind("resize", global.windowResizeHandles[id].bind);
        }
        return this;
    },
    /**
     * 将指定的元素模拟为固定定位（IE6下）
     * @param {DomObject} elem
     * @param {Boolean} enable 为布尔值false时取消固定定位
     * @param {Number} docLeft
     * @param {Number} docTop
     * @return {fastDev.Ui.Window}
     * @private
     */
    fixed: function (elem, enable, docLeft, docTop) {
        var options = this._options;
        if (elem.hasElem() && fastDev.isWindow(options.container.elems[0])) {
            var global = this._global,
                isBox = elem.elems[0] === global.box.elems[0],
                position;
            if (isNaN(docLeft)) {
                docLeft = global.docScrollLeft = global.doc.scrollLeft();
                docTop = global.docScrollTop = global.doc.scrollTop();
            }
            if (fastDev.Browser.isIE6) {
            	// IE6下面的通过样式表达式来模拟固定定位
                var html = fastDev(document.documentElement),
                    offset = elem.css("position", "absolute").show().offset(),
                    style;
                position = "backgroundAttachment";
                if (html.css(position) !== "fixed" && fastDev(document.body).css(position) !== "fixed") {
                    var backgroundImage = html.css("backgroundImage");
                    // 应用背景层，解决IE6下面模拟固定定位时，元素抖动的问题
                    html.css({
                        backgroundImage: (backgroundImage && backgroundImage !== "none") ? backgroundImage : "url(about:blank)",
                        backgroundAttachment: "fixed",
                        zoom: 1
                    });
                }
                style = elem.elems[0].style;
                html = "(document.documentElement)";
                style.removeExpression("left");
                style.removeExpression("top");
                if (options.fixed || enable !== false) {
                	// 设置样式表达式
                    style.setExpression("left", 'eval(' + html + '.scrollLeft + ' + (offset.left - docLeft) + ') + "px"');
                    style.setExpression("top", 'eval(' + html + '.scrollTop + ' + (offset.top - docTop) + ') + "px"');
                }
            } else if (isBox) {
            	// 如果是当前窗体对象，则根据相应的定位类型，进行坐标值转换
                var prev = elem.css("position"),
                    next = (options.fixed || enable !== false) ? "fixed" : "absolute";
                position = {
                    left: prev === "fixed" ? elem.elems[0].offsetLeft : parseInt(elem.css("left"), 10) || 0,
                    top: prev === "fixed" ? elem.elems[0].offsetTop : parseInt(elem.css("top"), 10) || 0
                };
                position.left += (prev === "absolute" && next === "fixed") ? -docLeft : (prev === "fixed" && next === "absolute") ? docLeft : 0;
                position.top += (prev === "absolute" && next === "fixed") ? -docTop : (prev === "fixed" && next === "absolute") ? docTop : 0;
                // 这种坐标值样式与定义样式
                elem.css({
                    position: next,
                    left: position.left,
                    top: position.top
                });
            }
            if (isBox) {
                global.boxFixed = options.fixed || enable !== false;
            }
        }
        return this;
    },
    /**
     * 还原面板至常态
     * @param {Object} rect
     * @param {Boolean} noShow
     * @return {fastDev.Ui.Window}
     * @protected
     */
    toOriginalPanel: function (rect, noShow) {
        var global = this._global;
        if (!noShow) {
        	// 显示所有区域
            global.box.show();
            global.body.show();
            global.content.show();
        }
        if (!global.resized) {
            this.resize(rect);
        } else {
            this.limit(rect);
        }
        global.resized = false;
        return fastDev.Ui.Panel.move.call(this, rect);
    },
    /**
     * 计算宽高限制处理后的size以及offset信息
     * @param {Object} rect left、top、width、height
     * @return {Object} left、top、width、height（无值则为NaN）
     * @private
     */
    limit: function (rect) {
        if (!fastDev.isEmptyObject(rect = fastDev.isPlainObject(rect) ? rect : {})) {
            var options = this._options,
                global = this._global,
                container = options.container,
                cWidth = global.containerWidth || container.width(),
                cHeight = global.containerHeight || container.height(),
                fx = fastDev.Util.StringUtil.stripUnits,
                inWindow = fastDev.isWindow(container.elems[0]),
                fixed = global.box.css("position") === "fixed",
                ie6Fixed = fastDev.Browser.isIE6 && options.fixed,
                regx = /^\d+(?:\.\d+|)%$/,
                leftPercent = regx.test(rect.left),
                topPercent = regx.test(rect.top),
                docLeft = !isNaN(global.docScrollLeft) ? global.docScrollLeft : global.doc.scrollLeft(),
                docTop = !isNaN(global.docScrollTop) ? global.docScrollTop : global.doc.scrollTop(),
                sWidth = fx(rect.width, cWidth),
                sHeight = fx(rect.height, cHeight),
                pMinWidth, pMinHeight, pMaxWidth, pMaxHeight, val, b = {
                    minWidth: (val = fx(rect.minWidth || options.minWidth, cWidth)) ? val : 2,
                    maxWidth: (val = fx(rect.maxWidth || options.maxWidth, cWidth)) ? val : Infinity,
                    minHeight: (val = fx(rect.minHeight || options.minHeight, cHeight)) ? val : 2,
                    maxHeight: (val = fx(rect.maxHeight || options.maxHeight, cHeight)) ? val : Infinity
                }, left, top, width, height, ratio;
            if (ratio = options.resizeRatio || rect.ratio) {
            	// 宽高等比限制
                pMinWidth = b.minHeight * ratio;
                pMinHeight = b.minWidth / ratio;
                pMaxWidth = b.maxHeight * ratio;
                pMaxHeight = b.maxWidth / ratio;
                if (pMinWidth > b.minWidth) b.minWidth = pMinWidth;
                if (pMinHeight > b.minHeight) b.minHeight = pMinHeight;
                if (pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
                if (pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
            }
            // 计算有效宽高，坐标等样式值
            rect.width = isNaN(sWidth) ? NaN : Math.floor(Math.max(b.minWidth, Math.min(b.maxWidth, sWidth)));
            rect.height = isNaN(sHeight) ? NaN : ratio ? Math.min(Math.floor(rect.width / ratio), sHeight) : Math.floor(Math.max(b.minHeight, Math.min(b.maxHeight, sHeight)));
            rect.width = (!isNaN(sWidth) && !isNaN(rect.height) && ratio) ? Math.floor(rect.height * ratio) : rect.width;
            rect.width = width = rect.width || Math.max(options.width || global.box.width(), b.minWidth);
            rect.height = height = rect.height || Math.max(options.height || global.box.height(), b.minHeight);
            // 坐标限制计算
            fastDev.apply(b, this.coordinateLimit(width, height, rect.visible, {
                dLeft: docLeft,
                dTop: docTop,
                cWidth: cWidth,
                cHeight: cHeight
            }));
            left = fx(rect.left, inWindow ? cWidth - width : cWidth) + ((leftPercent && inWindow) ? ie6Fixed ? docLeft : fixed ? 0 : docLeft : 0);
            top = fx(rect.top, inWindow ? cHeight - height : cHeight) + ((topPercent && inWindow) ? ie6Fixed ? docTop : fixed ? 0 : docTop : 0);
            rect.left = isNaN(left) ? NaN : Math.floor(Math.max(b.minX, Math.min(b.maxX, left)));
            rect.top = isNaN(top) ? NaN : Math.floor(Math.max(b.minY, Math.min(b.maxY, top)));
            fastDev.apply(rect, {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
        }
        return rect;
    },
    /**
     * 计算坐标范围
     * @param {Number} width 元素宽
     * @param {Number} height 元素高
     * @param {Boolean} visible 是否在可视区域内定位
     * @param {Object} rect cWidth、cHeight、dLeft、dTop
     * @return {Object} minX、minY、maxX、maxY
     * @private
     */
    coordinateLimit: function (width, height, visible, rect) {
        var options = this._options,
            global = this._global,
            container = options.container,
            positionCss = global.box.css("position"),
            fixed = positionCss === "fixed",
            maxX = Infinity,
            pMaxX = Infinity,
            minX = -Infinity,
            pMinX = -Infinity,
            maxY = Infinity,
            pMaxY = Infinity,
            minY = -Infinity,
            pMinY = -Infinity,
            docLeft, docTop;
        visible = visible === undefined ? options.visible : visible;
        if (options.inside && !fastDev.isWindow(container.elems[0])) {
            var parent = global.box.parent(),
                pWidth = parent.width(),
                pHeight = parent.height();
            if (positionCss === "relative") {
                var fx = fastDev.Util.StringUtil.stripUnits,
                    position = global.box.show().offset(),
                    grandparent = parent.parent(),
                    gWidth = grandparent.width(),
                    gHeight = grandparent.height(),
                    pOffset = parent.offset(),
                    offset = {
                        left: fx(global.box.css("left"), pWidth) || 0,
                        top: fx(global.box.css("top"), pHeight) || 0
                    };
                pMinX = -(position.left - pOffset.left - offset.left - (parseInt(parent.css("borderLeftWidth"), 10) || 0) + (fx(parent.css("paddingLeft"), gWidth) || 0) + (fx(parent.css("marginLeft"), gWidth) || 0));
                pMinY = -(position.top - pOffset.top - offset.top - (parseInt(parent.css("borderTopWidth"), 10) || 0) + (fx(parent.css("paddingTop"), gHeight) || 0) + (fx(parent.css("marginTop"), gHeight) || 0));
            } else {
                pMinX = pMinY = 0;
            }
            pMaxY = pMinY + pWidth - height;
            pMaxX = pMinX + pHeight - width;
        }
        if (visible && fastDev.isWindow(container.elems[0])) {
            minX = docLeft = fixed ? 0 : rect.dLeft;
            minY = docTop = fixed ? 0 : rect.dTop;
            maxX = rect.cWidth - width + docLeft;
            maxY = rect.cHeight - height + docTop;
        }
        return {
            minX: Math.max(pMinX, minX),
            minY: Math.max(pMinY, minY),
            maxX: Math.min(pMaxX, maxX),
            maxY: Math.min(pMaxY, maxY)
        };
    },
    /**
     * 设置拖拽调节大小
     * @param {Boolean} enable 是否启用Resizer
     * @return {fastDev.Ui.Window} 当前控件实例
     * @private
     */
    setResizer: function (enable) {
        var options = this._options,
            global = this._global;
        if (options.allowResize && global.initialized) {
            var that = this;
            global.resizer = global.resizer || global.pageContext.fastDev.create("Resizable", {
                container: options.container,
                element: global.box,
                maxHeight: options.maxHeight,
                maxWidth: options.maxWidth,
                minHeight: options.minHeight,
                minWidth: options.minWidth,
                ratio: options.resizeRatio,
                handles: options.resizeDirection,
                showTips: options.showSizeTips,
                zIndex: options.zIndex + 3,
                onstart: function () {
                    if (that.isDrawing()) {
                        return false;
                    }
                    global.resizing = true;
                    that.clearTimer().setShadow(false);
                },
                onresize: function () {
                    if (!options.display) {
                        return false;
                    }
                },
                onstop: function (event, width, height, offset) {
                    that.resize({
                        width: width,
                        height: height
                    });
                    if (options.allowDrag) {
                        that.move(offset);
                    }
                    global.offsetWidth = width;
                    global.offsetHeight = height;
                    global.resizing = false;
                    return false;
                },
                oncreate: function () {
                    global.box.css("overflow", "hidden");
                }
            });
            global.resizer[enable === null ? "destroy" : (enable !== false && !options.maximized && !options.collapsed) ? "enable" : "disable"]();
        }
        return this;
    },
    /**
     * 设置拖拽
     * @param {Boolean} enable 是否启用拖拽
     * @return {fastDev.Ui.Window} 当前控件实例
     * @private
     */
    setDragger: function (enable) {
        var options = this._options,
            global = this._global;
        if (options.allowDrag && global.initialized) {
            var that = this;
            global.dragger = global.dragger || global.pageContext.fastDev.create("Draggable", global.dragSettings = {
                ghost: false,
                element: global.box,
                handle: global.header,
                zIndex: options.zIndex + 3,
                visible: options.visible,
                inside: global.container && options.inside,
                onstart: function () {
                    if (that.isDrawing() || global.resizing) {
                        return false;
                    }
                    global.readyForDragging = true;
                },
                ondrag: function (event, offsetX, offsetY) {
                    if (!options.display || global.resizing) {
                        return false;
                    }
                    if (options.maximized && (offsetX !== 0 || offsetY !== 0)) {
                        var clientX = event.clientX,
                            clientY = event.clientY;
                            // 拖动还原坐标计算
                        options.left = parseInt(global.box.css("left"), 10) || 0;
                        options.top = parseInt(global.box.css("top"), 10) || 0;
                        global.offsetLeft = Math.max(Math.floor(clientX - (clientX - options.top) * global.offsetWidth / options.width), 0);
                        global.offsetLeft = clientX - global.offsetWidth + Math.min(global.offsetWidth - 40, Math.max(global.offsetWidth - (clientX - global.offsetLeft), 90));
                        global.offsetTop = Math.max(options.top + offsetY, 0);
                        that.reset(false, false);
                        global.dragger.resetBoundingRect(global.box);
                    }
                    if (global.readyForDragging) {
                        global.readyForDragging = false;
                        that.clearTimer().showLoading(false).setButtons(false).setResizer(false);
                        global.box.css("opacity", 0.6);
                        if (!global.contentHidden) {
                            global.content.css("visibility", "hidden");
                        }
                        if (global.onDragStart) {
                            global.onDragStart.apply(that, arguments);
                        }
                    }
                    that.setShadow(false);
                },
                onstop: function (event, left, top) {
                    if (!options.maximized) {
                        if (!global.contentHidden) {
                            global.content.removeCss("visibility");
                        }
                        that.move({
                            left: left,
                            top: top
                        }).setButtons().setResizer();
                        global.box.removeCss("opacity");
                        if (global.onDragStop) {
                            global.onDragStop.apply(that, arguments);
                        }
                        // 移动至最顶端时，最大化窗体
                        if ((event.clientY <= 0) && options.showMaxBtn && !options.collapsed && fastDev.isWindow(options.container.elems[0])) {
                            left = global.offsetLeft;
                            top = global.offsetTop;
                            that.maximize();
                        }
                        global.offsetLeft = left;
                        global.offsetTop = top;
                    }
                    return false;
                },
                oncreate: function () {
                    global.title.css("cursor", "default");
                }
            });
            if (enable === null) {
                global.dragger.destroy();
            }
        }
        return this;
    },
    /**
     * 构建窗体底部按钮
     * @param {Boolean} [show] 是否显示按钮栏
     * @return {fastDev.Ui.Window} 前控件实例
     * @private
     */
    setButtons: function (show) {
        var global = this._global;
        if (this._options.closed) {
            global.buttons.remove();
        } else if (!global.hasButton || show === false) {
            global.buttons.css("display", "none");
        } else {
            global.buttons.removeCss("display");
        }
        return this;
    },
    /**
     * 移动窗体至指定坐标
     * @param {Object} position 坐标参数对象
     * @param {String} position.left X轴坐标值
     * @param {String} position.top Y轴坐标值
     * @param {Boolean} [animation=false] 是否启用动画效果
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    move: function (position, animation) {
        var options = this._options;
        if (fastDev.isPlainObject(position) && options.inside) {
            var that = this,
                global = this._global;
            this.limit(position);
            if (animation === true && !options.minimized && options.animateSpeed) {
                this.clearTimer().setShadow(false);
                global.box.animate(position = {
                    left: position.left || global.box.css("left"),
                    top: position.top || global.box.css("top")
                }, options.animateSpeed, "liner", function () {
                    fastDev.Ui.Panel.move.call(that, position).finishAction();
                });
            } else {
                fastDev.Ui.Panel.move.call(this, position).finishAction();
            }
        }
        return this;
    },
    /**
     * 重新定义窗体大小
     * @param {Object} size 尺寸参数对象
     * @param {String} size.width 宽度，未指定则窗体宽度保持原来值不变，使用auto则适应内容宽度（非内部子页面模式时） 
     * @param {String} size.height 高度，未指定则窗体高度保持原来值不变，使用auto则适应内容高度（非内部子页面模式时）
     * @param {Boolean} [animation=false] 是否启用动画效果
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    resize: function (size, animation) {
        var options = this._options;
        if (fastDev.isPlainObject(size) && options.inside) {
            var global = this._global,
                box = global.box,
                container = options.container,
                fx = fastDev.Util.StringUtil.stripUnits,
                width, height;
            if (options.src) {
            	// 含内部子页面时，默认宽高根据当前窗口比例调整
                size.width = (!size.width || size.width === "auto") ? "71.3402%" : size.width;
                size.height = (!size.height || size.height === "auto") ? "89.8061%" : size.height;
                size.ratio = (size.width === "71.3402%" || size.height === "89.8061%" ? 1.618 : 0);
            } else if (size.width === "auto" || size.height === "auto") {
                var sWidth = size.width === "auto" ? "auto" : fx(size.width, global.containerWidth || container, "width") || options.width,
                    sHeight = size.height === "auto" ? "auto" : fx(size.height, global.containerHeight || container, "height") || options.height,
                    bounding = this.getContentBounding(box.css({
                        display: "block",
                        width: "auto"
                    })),
                    // 自动宽高时，根据内容宽高计算
                    elem = global.content.css({
                        width: width = (!sWidth || sWidth === "auto") ? "auto" : Math.max(sWidth - bounding.width, 1),
                        height: height = (!sHeight || sHeight === "auto") ? "auto" : Math.max(sHeight - bounding.height, 1)
                    }),
                    contentWidth = width === "auto" ? elem.width() : width,
                    contentHeight = height === "auto" ? elem.height() : height;
                box.css("width", options.width);
                elem.removeCss("width");
                size.width = contentWidth + bounding.width;
                size.height = contentHeight + bounding.height;
            }
            // 限制计算
            this.limit(size);
            if (animation === true && !options.minimized && !options.collapsed && options.animateSpeed && !(size.width === (width = global.box.width()) && size.height === (height = global.box.height()))) {
                var that = this;
                this.clearTimer().setShadow(false);
                global.content.hide();
                box.animate(size = {
                    width: size.width || width,
                    height: size.height || height
                }, options.animateSpeed, "liner", function () {
                    fastDev.Ui.Panel.resize.call(that, size).finishAction().showContent();
                });
                global.body.animate({
                    height: this.getBodyHeight(size.height)
                }, options.animateSpeed, "liner");
            } else {
                fastDev.Ui.Panel.resize.call(this, size).finishAction();
            }
        }
        return this;
    },
    /**
     * 新增底部按钮控件
     * <p>按钮配置对象中，属性align可指定按钮的摆放位置，可选值为：left、center、right，默认为right。
     * @param {Object|Array} buttons 按钮控件配置对象，可使用数组传递多个按钮配置对象
     * @return {fastDev.Ui.Window} 当前弹窗控件实例
     */
    addButtons: function (buttons) {
        var options = this._options,
            global = this._global,
            left = global.left,
            right = global.right,
            center = global.center,
            button, i = 0;
        buttons = fastDev.isArray(buttons) ? buttons : [buttons];
        while (button = buttons[i++]) {
            if (!fastDev.isPlainObject(button)) {
                continue;
            }
            button.onclick = this.getBtnCallback(button.onclick, button.name);
            switch (button.align) {
            case "left":
                button.container = global.left.removeCss("display");
                break;
            case "center":
                button.container = global.center.removeCss("display");
                break;
            default:
                button.container = global.right.removeCss("display");
            }
            global.buttonInstances.push(fastDev.create("Button", button));
            global.hasButton = true;
        }
        return this;
    },
    /**
     * @param {Function} callback 按钮点击回调
     * @param {String} [name] 按钮名
     * @return {Function}
     * @protected 
     */
    getBtnCallback: function (callback, name) {
        var that = this,
            fn;
        return fn = function (event) {
            var iframe = that.find("iframe"),
                win;
            try {
                if (iframe.hasElem()) {
                    win = iframe.elems[0].contentWindow;
                }
            } catch (e) {
                win = undefined;
            } finally {
                (callback || fastDev.noop).call(this, event, that, win, win ? win.fastDev : undefined);
            }
            fn = null;
        };
    },
    /**
     * 获取底部按钮栏Dom对象
     * <p>可调用Window控件的addButtons方法动态添加按钮
     * @param {String} [position] 按钮栏的子区域，可为以下值：
     * <p>-left 左边区域 </p> 
     * <p>-center 中部区域 </p> 
     * <p>-right 右部区域</p>
     * <p>未指定position时将获取整个底部按钮栏的DOM对象
     * @return {fastDev.Core.DomObject} 底部按钮栏的fastDev.Core.DomObject对象
     */
    getFooter: function (position) {
        var global = this._global,
            footer = /^(left|center|right)$/i.test(position) ? global[RegExp.$1].show() : global.buttons;
        return footer;
    },
    /**
     * 显示底部按钮栏
     * @return {fastDev.Ui.Window} 当前弹窗控件实例
     */
    showFooter: function () {
        var global = this._global;
        if (global.hasButton = !! global.buttonInstances.length) {
            global.buttons.show();
            this.resize({
                height: global.box.height()
            });
        }
        return this;
    },
    /**
     * 隐藏底部按钮栏 
     * @return {fastDev.Ui.Window} 当前弹窗控件实例
     */
    hideFooter: function () {
        var global = this._global;
        global.hasButton = false;
        global.buttons.hide();
        if (global.buttonInstances.length) {
            this.resize({
                height: global.box.height()
            });
        }
        return this;
    },
    /**
     * 显示窗体内容
     * @return {fastDev.Ui.Window} 当前弹窗控件实例
     */
    showContent: function () {
        var global = this._global;
        global.content.css({
            display: "block",
            overflow: "auto",
            visibility: "visible"
        });
        global.body.removeCss("display");
        global.contentHidden = false;
        return this;
    },
    /**
     * 隐藏窗体内容
     * @return {fastDev.Ui.Window} 
     */
    hideContent: function () {
        var global = this._global;
        global.content.css("visibility", "hidden");
        global.contentHidden = true;
        return this;
    },
    /**
     * 获取通过src属性指定的内部子页面的窗口对象（Window）
     * <p>若内部子页面为跨域页面，可能会出现Window无权限访问的异常，此时，返回值为undefined
     * @return {Window} 子页面窗口对象或者undefined(无访问权限或者无内部子页面时) 
     */
    getContentWindow: function () {
        var iframe = this._global.iframe;
        if (!iframe.isEmpty()) {
            try {
                return iframe.elems[0].contentWindow;
            } catch (e) {}
        }
        return undefined;
    },
    /**
     * 追加窗体内容（可包含文本、标签、控件等）
     * <p>若内容文本包含了fastui控件声明标签时，请通过当前弹窗控件实例的getInstance方法获取被创建控件的实例（需声明了ID和saveInstance=true才能拿到实例）。详情请参见getInstance方法说明。
     * <p>若使用了src配置属性声明了内部子页面，将默认禁止往内容区域追加内容
     * <p>可先调用empty方法清空窗体内容后（内部子页面同样也会被清理掉）再追加新的内容
     * <p>该方法不会清空之前的窗体内容
     * @param {String|Element|Component|DomObject|Array} content 需追加的内容，可以使用数组一次性追加多个元素
     * @return {fastDev.Ui.Panel} 当前控件实例
     */
    append: function (content) {
        var global = this._global;
        if (global.iframe.isEmpty()) {
            var options = this._options,
                elements = [].concat(content),
                html = fastDev(),
                doc = document,
                body = doc.body;
            while (fastDev.isValid(content = elements.shift())) {
                if (!fastDev.isString(content)) {
                    content = this.toDomObject(content);
                    // fastDev.Core.ControlBus.compile(null, content.elems);
                } else {
                    (html = fastDev(doc.createElement("div")).appendTo(body).hide()).elems[0].innerHTML = content;
                    // fastDev.Core.ControlBus.compile(null, html.elems);
                    content = html.children();
                }
                global.needCompile = true;
                try {
                    global.content.append(content);
                } catch (e) {
                    fastDev.error("Window", "append", "当前弹窗已<span style='color:red'>从子页面跨往父页面</span>创建并展现。<br/><span style='color:red'>IE6浏览器</span>不支持从子页面往父页面追加在<span style='color:red'>子页面上创建的DOM对象</span>。<br/>若追加的内容为控件对象，可使用标签声明方式来创建控件实例，或者使用形如以下的方式创建控件实例：<br/><hr/>fastDev.Ui.Window.top.fastDev.create(\"Button\",{text:\"按钮\"});");
                    break;
                }
                html.remove();
            }
        }
        return this;
    },
    /**
     * 获取控件实例
     * <p>当弹窗跨级时，若弹窗的内容文本包含形如:<div itype="DataGrid" id="datagrid" saveInstance="true" />的控件声明时，该控件仍会被创建出来。
     * <p>此时在声明创建弹窗的页面上，若通过fastDev.getInstance("datagrid")来取得DataGrid控件实例，则会行不通。这是因为跨级弹窗将在其真实展现页面内创建，其window作用域已经不是原来的那个弹窗声明页面了。
     * <p>跨级时，可通过弹窗实例的getInstance方法获取已跨级的控件实例。弹窗会根据当前是否跨级判定实例保存的命名空间，因此，弹窗未跨级时，通过该方法也是能正确获取到指定ID的控件实例的（前提是确实保存了该ID的控件实例）。
     * @param {String} id 控件ID值
     * @return {fastDev.Ui.Component} fastui 控件 
     */
    getInstance: function (id) {
        var options = this._options;
        return (options.crossed === "crossed" || !fastDev.isWindow(options.parent)) ? fastDev.Ui.Window.top.fastDev.getInstance(id) : options.parent.fastDev.getInstance(id);
    },
    /**
     * 设置窗体内容（可包含HTML标签以及复合控件声明字符串）
     * <p>若内容文本包含了fastui控件声明标签时，请通过当前弹窗控件实例的getInstance方法获取被创建控件的实例（需声明了ID和saveInstance=true才能拿到实例）。详情请参见getInstance方法说明。
     * <p>若使用了src配置参数声明了内部子页面，将默认禁止设置新的内容
     * <p>可先调用empty方法清空窗体内容后（内部子页面同样也会被清理掉）再设置新的内容
     * <p>该方法会清空之前的窗体内容
     * <p>追内容请使用append方法
     * <p>setContent与append方法的主要区别在于，append方法直接追加内容（如Element对象、控件对象、字符串等，使用src声明了子页面时则追加无效）至内容区域，追加完成后若需要重新调整窗体大小，可调用resize方法来调整窗体大小。</p>
     * <p>setContent方法若接受字符串参数（包含字符串形式的标签声明，复合控件声明），则会根据配置属性icon添加内容消息图标，以及默认添加字体行高样式等。</p>
     * <p>设置新的内容后，窗体默认将根据新的内容自适应调整窗体尺寸，也可以通过参数指定是否自动调节尺寸以及如何调节尺寸。</p>
     * @param {String|Element|Array[Element]} content 需设置的窗体内容
     * @param {Object|Boolean} [resize] 指定更新内容后窗体的新尺寸，为布尔值false时则不自动调整窗体尺寸，未传值或传值为非对象字面量时则根据内容自适应调整大小，为对象字面量值时则根据指定的宽高来调整大小
     * @param {Number} [resize.width] 窗体宽度，未指定则窗体保持原宽度不变，可以使用auto、数值、百分比等，百分比计算基数为当前可视区域大小，下同
     * @param {Number} [resize.height] 窗体高度，未指定则保持原值不变
     * @param {Boolean} [animation=false] 调整窗体尺寸时是否使用动画效果 
     * @return {fastDev.Ui.Window} 
     */
    setContent: function (content, resize, animation) {
        var options = this._options,
            global = this._global,
            doc = document,
            body = doc.body;
        if (!fastDev.isValid(content) && !global.iframe.isEmpty()) {
            return this;
        }
        resize = global.initialized ? resize === false ? false : fastDev.isPlainObject(resize) ? resize : {
            width: "auto",
            height: "auto"
        } : false;
        resize = {
            width: resize === false ? options.width : resize.width === undefined ? global.box.width() : resize.width,
            height: resize === false ? options.height : resize.height === undefined ? global.box.height() : resize.height
        };
        this.empty();
        global.resized = true;
        if (typeof content === "string") {
            var fx = fastDev.Util.StringUtil.stripUnits,
                container = options.container,
                width = fx(resize.width, container, "width"),
                height = fx(resize.height, container, "height"),
                text, rect = {
                    width: width || "auto",
                    height: height || "auto"
                }, tag = "main" + fastDev.getID(),
                bounding = this.getContentBounding(),
                cWidth = global.containerWidth = container.width(),
                cHeight = global.containerHeight = container.height(),
                html;
            text = '<div name="' + tag + '" class="' + ((options.icon && fastDev.isString(options.icon)) ? "ui-window-content-icon ui-window-content-" + options.icon : "") + ' ui-window-content-text">';
            content += "</div>";
            if (resize.width === "auto" && resize.height === "auto") {
                var element, elementWidth, elementHeight;
                // 应用表格特性，来自适应宽高
                html = ["<span style='display:none'><table width='" + (Math.max(width ? width - bounding.width : 0, 0) || Math.max((Math.round((options.icon ? 184 : 162) * cWidth / (cHeight || 1))), options.icon ? 368 : 325)) + "px' height='1px'>"];
                html.push("<tbody><tr><td>" + text + content + "</td></tr></tbody></table></span>");
                (element = fastDev(doc.createElement("div")).appendTo(body)).elems[0].innerHTML = html.join("");
                tag = element.find("div[name='" + tag + "']");
                // 编译文本
                fastDev.Core.ControlBus.compile(null, element.elems);
                // 超过800px宽度时，作文本强制断行处理
                if ((element = element.children("span:first")).width() > (width || 800)) {
                    tag.css({
                        "word-wrap": "break-word",
                        "word-break": "break-all"
                    });
                    element.children("table:first").css("width", width || 800);
                }
                elementWidth = element.width();
                elementHeight = element.height();
                (html = fastDev(doc.createElement("span")).css({
                    "max-width": "800px",
                    display: "none"
                }).appendTo(body)).append(element.children("table:first").find("td:first").children());
                rect.width = width || (Math.min(html.width(), elementWidth) + bounding.width);
                rect.height = height || (Math.max(html.height(), elementHeight) + bounding.height);
                element.parent().remove();
            } else {
                (html = fastDev(doc.createElement("div")).appendTo(body).hide()).elems[0].innerHTML = text + content;
                global.needCompile = true;
            }
            global.content.append(html.children());
            rect.maxWidth = fastDev.isFunction(options.maxWidth) ? options.maxWidth.call(this, cWidth) : isFinite(parseInt(options.maxWidth, 10)) ? options.maxWidth : resize.width === "auto" ? cWidth - 10 : Infinity;
            rect.maxHeight = fastDev.isFunction(options.maxHeight) ? options.maxHeight.call(this, cHeight) : isFinite(parseInt(options.maxHeight, 10)) ? options.maxHeight : resize.height === "auto" ? cHeight - 10 : Infinity;
            html.remove();
            this.resize(rect, animation);
        } else {
            this.append(content).resize(resize, animation);
        }
        return this;
    },
    /**
     * 父类回调实现，用于延迟加载Iframe前的准备工作
     * @param {DomObject} iframe
     * @private
     */
    readyForLoading: function (iframe) {
        var that = this,
            global = this._global,
            now = new Date().getTime(),
            grandparent = this._options.parent;
        if (!global.initialized) {
            return false;
        }
        if (fastDev.isWindow(grandparent)) {
            iframe.unbind("load", global.loadParentHandle || fastDev.noop).bind("load", global.loadParentHandle = function () {
                try {
                    if (global.maskClickHandle && (new Date().getTime() - now > 5000)) {
                        global.maskClickHandle.call(that);
                    }
                    // 未加载fastDev.Ui.Window将引发异常
                    iframe.elems[0].contentWindow.fastDev.Ui.Window.parent = grandparent;
                } catch (e) {} finally {
                    now = Infinity;
                }
            });
        }
    },
    /**
     * 窗口跨级
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @return {fastDev.Ui.Window} 跨级窗口对象实例
     * @private
     */
    cross: function (options, global) {
        var that = this,
            top = fastDev.Ui.Window.top,
            // 顶层窗口类型的序列值
            id = top.fastDev.Ui.Window.id,
            instance;
        global.pageContext = top;
        // 已跨级的弹窗需在其所在窗口域里面构建
        options.inside = true;
        // 清除原容器设置
        options.container = "";
        // 该回调已在原实例构建前调用
        options.onBeforeReady = fastDev.noop;
        // 设置坐标值
        options.left = parseInt(options.left, 10) ? options.left : "50%";
        options.top = parseInt(options.top, 10) ? options.top : "38.2%";
        // 标记为已跨级
        options.crossed = "crossed";
        // 绑定跨级窗口的原父页面窗口对象
        options.parent = window;
        // 创建跨级弹窗实例
        instance = top.fastDev.create(this.alias, options);
        // 跨级弹窗的唯一标识值
        id = instance._global.uuid;
        // 保存原弹窗实例，以便在页面卸载时销毁未被关闭的跨级弹窗
        fastDev.Ui.Window.windows[id] = instance;
        // 保存原弹窗实例的构建上下文
        this.setData("@fastDev" + id, fastDev);
        this._options = instance._options;
        this._global = instance._global;
        this.elems = instance.elems;
        // 绑定页面卸载事件，销毁未被关闭的跨级弹窗
        fastDev(window).unbind("unload", global.windowUnloadHandle = global.windowUnloadHandle || function () {
            fastDev.each(fastDev.Ui.Window.windows, function (name, win) {
                win[win._options.persisted ? "hide" : "close"](true, false);
            });
            fastDev.Ui.Window.setData("@iframes" + fastDev.Ui.Window.id, null);
            fastDev.Ui.Window.parent = null;
        }).bind("unload", global.windowUnloadHandle);
        return instance;
    },
    /**
     * 获取跨级储存的数据
     * @param {String} name 与数据绑定的键名
     * @return {Object} 数据对象
     */
    getData: function (name) {
        if (name === "parent") {
            return fastDev.Ui.Window.parent;
        }
        return fastDev.Ui.Window.top.fastDev.Ui.Window.cache[name];
    },
    /**
     * 存储跨级数据
     * <p>会覆盖之前保存的同名数据（共享存储区）
     * <p>也可使用一个普通对象一次性保存多项数据（属性名为数据的绑定键名，属性值即为相应的数据值）
     * @param {String|Object} name 与数据绑定的键名或者一个键值映射的数据集对象（一次性存储多项数据）
     * @param {Object} value 与键名对应的数据值
     */
    setData: function (name, value) {
        var fast = fastDev.Ui.Window.top.fastDev;
        if (fastDev.isPlainObject(name)) {
            fast.apply(fast.Ui.Window.cache, name);
        } else {
            fast.Ui.Window.cache[name] = value;
        }
        return this;
    },
    /**
     * 当前iframe页所归属的顶层window对象
     * <p>若inside配置属性为false时，弹窗将从原页面跨级至此页面创建并展现。
     * @type {Window}
     */
    top: fastDev.Util.position.top,
    /**
     * 当前页面弹窗类型的唯一标识序列
     * @type {String}
     * @private
     */
    id: fastDev.getID().toString(),
    /**
     * 跨级数据存储对象
     * @type {Object}
     * @private
     */
    cache: {},
    /**
     * 当前页面已跨级展现的弹窗实例存储对象
     * @type {Object}
     * @private
     */
    windows: {},
    /**
     * 当前页面的未关闭弹窗数
     * @type {Number}
     * @private
     */
    count: 0,
    /**
     * 当前页面的原父页面窗口对象
     * @type {Window}
     */
    parent: window.parent
});
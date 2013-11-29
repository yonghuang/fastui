/**
 * <p>调节大小组件。</p>
 * 以下三个样式类名可供用户自定义使用：
 * <p>ui-resizable-element  被调节大小的元素
 * <p>ui-resizable-helper  调节大小辅助层
 * <p>ui-resizable-resizing 正在调节中
 * <p>作者：程伟</p>
 * @class fastDev.Interaction.Resizable
 * @extends fastDev.Core.Base
 * @author chengwei
 */
fastDev.define("fastDev.Interaction.Resizable", {
    alias: "Resizable",
    extend: "fastDev.Core.Base",
    _options: {
        /**
         * 可调整大小的元素对象或元素选择器
         * @type {Element|String|DomObject}
         */
        element: null,
        /**
         * 可捕获调整大小事件的方位，可为以下枚举量：
         * n(北)、ne(东北)、e(东)、se(东南)、s(南)、sw(西南)、w(西)、nw(西北)、all(全部)
         * 字符串类型值时用逗号分隔
         * @type {String|Array}
         */
        handles: "s,e,se",
        /**
         * 最大可调宽度限制，可使用单位px、em、%
         * 百分比相对于父元素，em受body的font-size字体尺寸样式影响
         * @type {String|Number}
         */
        maxWidth: Infinity,
        /**
         * 最大可调高度限制，可使用单位px、em、%
         * 百分比相对于父元素，em受body的font-size字体尺寸样式影响
         * @type {String|Number}
         */
        maxHeight: Infinity,
        /**
         * 最小可调宽度限制，可使用单位px、em、%
         * 百分比相对于父元素，em受body的font-size字体尺寸样式影响
         * @type {String|Number}
         */
        minWidth: "1px",
        /**
         * 最小可调高度限制，可使用单位px、em、%
         * 百分比相对于父元素，em受body的font-size字体尺寸样式影响
         * @type {String|Number}
         */
        minHeight: "1px",
        /**
         * 宽高比例限制（宽/高）
         * @type {Number}
         */
        ratio: null,
        /**
         * 可调坐标轴线，为以下枚举值：
         * <p>'x,y'、'x'、'y'或['x','y']、['x']、['y']
         * <p>x为只可调节宽度，y为只可调节高度
         * @type {String|Array}
         */
        axis: "x,y",
        /**
         * 用于重设可调大小元素所在的父容器
         * 百分比值的计算将依赖于父容器的宽高
         * @type {String|DomObject}
         */
        container: "",
        /**
         * 是否使用辅助层
         * 使用辅助层则在调整大小完成后才做实际变更
         * @type {Boolean}
         */
        ghost: true,
        /**
         * 辅助层的边框样式
         * @type {String}
         */
        border: "2px dotted #00F",
        /**
         * 辅助层的透明度
         * @type {Number}
         */
        opacity: 0.4,
        /**
         * 辅助层的背景色
         * @type {String}
         */
        backgroundColor: "#6699FF",
        /**
         * 辅助层样式名
         * 用于通过样式文件配置
         * @type {String}
         */
        helperCls: "",
        /**
         * 索引重置
         * @type {Number}
         */
        zIndex: 2013,
        /**
         * 是否显示尺寸提示标签
         * @type {Boolean}
         */
        showTips: false,
        /**
         * 初始完成时的回调函数
         * @type {Function}
         * @event
         */
        oncreate: fastDev.noop,
        /**
         * 触发调整大小事件时的回调函数
         * <p>this指向当前被调整大小的元素（DomObject对象）
         * <p>参数为event对象
         * 返回false值则不会继续处理
         * @type {Function}
         * @event
         */
        onstart: fastDev.noop,
        /**
         * 调整大小进行时的回调函数
         * <p>this指向当前被调整大小的元素（DomObject对象）
         * <p>参数为event对象、X轴偏移量、Y轴偏移量
         * 返回false值则不会继续处理
         * @type {Function}
         * @event
         */
        onresize: fastDev.noop,
        /**
         * 调整事件结束时的回调函数
         * <p>this指向当前被调整大小的元素（DomObject对象）
         * <p>参数为event对象、内容宽度、内容高度、offset对象（包含left、top）
         * 返回false值则不会更改元素尺寸样式（由回调函数自行处理尺寸样式）
         * @type {Function}
         * @event
         */
        onstop: fastDev.noop
    },
    /**
     * handler模版
     * @private
     */
    tpl: {
        n: '<span class="ui-resizable-handle ui-resizable-handle-n" style="cursor: n-resize; height: 10px; width: 100%; top: -5px; left: 0; position: absolute;"></span>',
        s: '<span class="ui-resizable-handle ui-resizable-handle-s" style="cursor: s-resize; height: 10px; width: 100%; bottom: -5px; left: 0; position: absolute;"></span>',
        e: '<span class="ui-resizable-handle ui-resizable-handle-e" style="cursor: e-resize; width: 10px; right: -5px; top: 0; height: 100%; position: absolute;"></span>',
        w: '<span class="ui-resizable-handle ui-resizable-handle-w" style="cursor: w-resize; width: 10px; left: -5px; top: 0; height: 100%; position: absolute;"></span>',
        se: '<span class="ui-resizable ui-resizable-handle ui-resizable-handle-se" style="cursor: se-resize;  right: 1px; bottom: 1px; position: absolute; overflow: hidden;"></span>',
        sw: '<span class="ui-resizable-handle ui-resizable-handle-sw " style="cursor: sw-resize; width: 14px; height: 14px; left: -5px; bottom: -5px; position: absolute;"></span>',
        nw: '<span class="ui-resizable-handle ui-resizable-handle-nw" style="cursor: nw-resize; width: 14px; height: 14px; left: -5px; top: -5px; position: absolute;"></span>',
        ne: '<span class="ui-resizable-handle ui-resizable-handle-ne" style="cursor: ne-resize; width: 14px; height: 14px; right: -5px; top: -5px; position: absolute;"></span>'
    },
    /**
     * 准备参数
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    ready: function (options, global) {
        var handles = options.handles,
        	elem = options.element,
            handle;
        options.handles = [];
        handles = /all/i.test(fastDev.Util.StringUtil.trim(handles)) ? ["n", "ne", "e", "se", "s", "sw", "w", "nw"] : handles ? handles.toString().split(",") : [];
        for (var i = 0; i < handles.length; i++) {
            if (/n[ew]|n|s[ew]|s|w|e/i.test(handle = fastDev.Util.StringUtil.trim(handles[i]))) {
                options.handles.push(handle);
            }
        }
        options.handles = options.handles.length ? options.handles : ["e", "s", "se"];
        fastDev.apply(options, {
            zIndex: parseInt(options.zIndex, 10) || 2013,
            ratio: Math.abs(parseFloat(options.ratio) || 0),
            element: (fastDev(fastDev.isComponent(elem) ? elem.elems[0] : elem) || fastDev()).addClass("ui-resizable-element"),
            container: fastDev(fastDev.isComponent(options.container) ? options.container.elems[0] : options.container),
            axis: options.axis ? /\s*(x|y)?\s*\,?\s*(x|y)?\s*$/i.exec(options.axis.toString()) ? [RegExp.$1, RegExp.$2 === RegExp.$1 ? "" : RegExp.$2].join("") : null : null
        });
    },
    /**
     * 初始控件
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    init: function (options, global) {
    	var doc = document;
        fastDev.apply(global, {
            uuid: fastDev.getID(),
            win: fastDev(window),
            doc: fastDev(doc),
            resizeHandler: []
        });
        for (var wrapper, position, elem, helper, body = doc.body, i = 0; elem = options.element.elems[i++];) {
            wrapper = this.getHandlerWrapper(elem = fastDev(elem));
            position = elem.css("position");
            if (/canvas|textarea|input|select|button|img/i.test(elem.elems[0].nodeName)) {
            	// 特殊标签包装
                wrapper.css({
                    position: position === "static" ? "relative" : position,
                    top: position === "static" ? 0 : elem.css("top"),
                    left: position === "static" ? 0 : elem.css("left"),
                    zIndex: elem.css("zIndex"),
                    display: elem.css("display"),
                    width: elem.outerWidth(true),
                    height: elem.outerHeight(true)
                }).replace(elem.css({
                    position: "relative",
                    left: 0,
                    top: 0
                })).append(elem);
            } else {
                wrapper.children("span").appendTo(elem);
                wrapper.remove();
                if (position === "static") {
                    elem.css({
                        position: "relative",
                        left: 0,
                        top: 0
                    });
                }
                wrapper = null;
            }
            elem.elems[0]["resizeWrapper" + global.uuid] = wrapper || elem;
        }
        if (global.resizeHandler.length) {
            var elems = [];
            // 辅助层
            global.mask = fastDev(elem = doc.createElement("div")).css({
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                opacity: 0.01,
                display: "none",
                position: "absolute",
                zIndex: options.zIndex + 99999997
            });
            elems.push(elem);
            helper = global.helper = fastDev(elem = doc.createElement("div")).css({
                display: "none",
                position: "absolute",
                border: options.border,
                zIndex: options.zIndex + 99999998,
                backgroundColor: options.backgroundColor,
                opacity: options.ghost ? parseFloat(options.opacity) || 0.4 : 0.001
            }).setClass(options.helperCls || "ui-resizable-helper");
            elems.push(elem);
            global.tips = options.showTips ? fastDev(elem = doc.createElement("div")).css({
                opacity: 0.4,
                display: "none",
                border: "1px solid",
                position: "absolute",
                backgroundColor: "#FFFFCC",
                zIndex: options.zIndex + 99999999
            }) : fastDev();
            elems.push(elem);
            fastDev(elems).appendTo(body);
        }
        (options.oncreate || fastDev.noop).call(this);
    },
    /**
     * 获取handler
     * @param {DomObject} elem 可调节大小的实际元素
     * @private
     */
    getHandlerWrapper: function (elem) {
        for (var that = this, options = this._options, global = this._global, wrapper = fastDev("<div class='ui-resizable-wrapper' style='zoom:1'/>"), handle, i = 0; handle = options.handles[i]; i++) {
            wrapper.append(handle = fastDev(this.tpl[handle]).css("zIndex", options.zIndex + (/n[we]|s[we]/.test(handle) ? 20 : 10)).bind("mousedown", this.getResizeHandle(elem)));
            global.resizeHandler.push(handle);
        }
        return wrapper;
    },
    /**
     * 获取resize处理函数
     * @param {DomObject} elem 可调节大小的实际元素
     * @private
     */
    getResizeHandle: function (elem) {
        var that = this;
        return function (event) {
            return event.button === ((fastDev.Browser.isIE6 || fastDev.Browser.isIE7 || fastDev.Browser.isIE8) ? 1 : 0) ? that.startResize(event, elem) : undefined;
        };
    },
    /**
     * 开始调节大小事件处理
     * @param {Event} event
     * @param {DomObject} target 可调节大小的实际元素
     * @private
     */
    startResize: function (event, target) {
        var that = this,
            options = this._options,
            global = this._global,
            helper = global.helper,
            settings, wrapper, handler, offset, parent, width, height, cursor;
        if (!options.disabled && (options.onstart || fastDev.noop).call(target, event) !== false) {
            fastDev.apply(target.elems[0]["resizeSettings" + global.uuid] = settings = {}, {
                handler: handler = fastDev(event.target),
                handlerName: handler.getClass().match(/ui-resizable-handle-(n[ew]|n|s[ew]|s|w|e)/)[1],
                wrapper: wrapper = target.elems[0]["resizeWrapper" + global.uuid],
                parent: parent = options.container.isEmpty() ? wrapper.parent() : options.container,
                startLeft: (offset = wrapper.offset()).left,
                startHeight: height = wrapper.outerHeight(true),
                startWidth: width = wrapper.outerWidth(true),
                limit: this.limit(wrapper, parent),
                position: wrapper.css("position"),
                zIndex: target.css("zIndex"),
                sClientX: event.clientX,
                sClientY: event.clientY,
                startTop: offset.top
            });
            if (settings.position === "fixed") {
                settings.fixedPosition = {
                    left: wrapper.elems[0].offsetLeft,
                    top: wrapper.elems[0].offsetTop
                };
                wrapper.css("position", "absolute").offset(offset);
            }
            wrapper.css("zIndex", options.zIndex + 99999996).addClass("ui-resizable-resizing");
            global.mask.css("cursor", cursor = handler.css("cursor"));
            global.helperBorder = global.helperBorder || {
            	horizontal: helper.outerWidth() - helper.innerWidth(),
                vertical: helper.outerHeight() - helper.innerHeight()
            };
            helper.css({
                cursor: cursor,
                display: "block",
                width: Math.max(width - global.helperBorder.horizontal, 2),
                height: Math.max(height - global.helperBorder.vertical, 2)
            }).offset(offset);
            if (options.showTips) {
                global.tips.css({
                    display: "block",
                    left: event.clientX + 10,
                    top: event.clientY + 10
                }).setText(Math.ceil(width) + " × " + Math.ceil(height));
            }
            global.doc.bind("mousemove", global.resizingHandle = function (event) {
                return that.doResizing(event, target);
            }).bind("mouseup", global.stopHandle = function (event) {
                return that.stopResize(event, target);
            }).bind("dblclick", global.stopHandle).bind("selectstart", fastDev.Event.stopBubble);
            if (!fastDev.Browser.isIE6 && ("onlosecapture" in document.documentElement)) {
                settings.handler.bind("losecapture", global.stopHandle);
            } else {
                global.win.bind("blur", global.stopHandle);
            }
            if ("setCapture" in document.documentElement) {
                event.target.setCapture();
            }
        }
        return false;
    },
    /**
     * 调节大小过程事件处理
     * @param {Event} event
     * @param {DomObject} target 可调节大小的实际元素
     * @private
     */
    doResizing: function (event, target) {
        var options = this._options,
            global = this._global,
            settings = target.elems[0]["resizeSettings" + global.uuid],
            offsetX, offsetY;
        this.clsSelect();
        if ((options.onresize || fastDev.noop).call(target, event, offsetX = event.clientX - settings.sClientX, offsetY = event.clientY - settings.sClientY) !== false) {
            var p = settings.handlerName,
                axis = options.axis,
                limit = settings.limit,
                startWidth = settings.startWidth,
                startHeight = settings.startHeight,
                startLeft = settings.startLeft,
                startTop = settings.startTop,
                width = startWidth,
                height = startHeight,
                left = startLeft,
                top = startTop,
                offset;
                // 根据拖拽触发方向计算相应坐标值及宽高
            if (p === "e" || axis === "x") {
                width = startWidth + offsetX;
                if (options.ratio) {
                    height = width / options.ratio;
                }
            } else if (p === "s" || axis === "y") {
                height = startHeight + offsetY;
                if (options.ratio) {
                    width = height * options.ratio;
                }
            } else if (p === "se") {
                width = startWidth + offsetX;
                if (options.ratio) {
                    height = width / options.ratio;
                } else {
                    height = startHeight + offsetY;
                }
            } else if (/nw|sw|w/.test(p)) {
                left = startLeft + offsetX;
                width = startWidth - offsetX;
                if (options.ratio) {
                    offsetY = offsetX / options.ratio;
                    height = width / options.ratio;
                }
                if (p === "nw") {
                    top = startTop + offsetY;
                    height = startHeight - offsetY;
                } else if (!options.ratio && p === "sw") {
                    height = startHeight + offsetY;
                }
            } else { //ne、n
                top = startTop + offsetY;
                height = startHeight - offsetY;
                if (options.ratio) {
                    width = height * options.ratio;
                } else if (p === "ne") {
                    width = startWidth + offsetX;
                }
            }
            // 依据最值计算宽高
            width = Math.max(limit.minWidth, Math.min(limit.maxWidth, width));
            height = Math.max(limit.minHeight, Math.min(limit.maxHeight, height));
            left = left === startLeft ? left : Math.max(width === limit.maxWidth ? startLeft - (width - startWidth) : 0, Math.min(startLeft + startWidth - limit.minWidth, left));
            top = top === startTop ? top : Math.max(height === limit.maxHeight ? startTop - (height - startHeight) : 0, Math.min(startTop + startHeight - limit.minHeight, top));
            global.helper.css({
                width: Math.max(width - global.helperBorder.horizontal, 2),
                height: Math.max(height - global.helperBorder.vertical, 2)
            }).offset(offset = {
                left: left,
                top: top
            });
            global.mask.css({
                display: "block",
                width: global.win.width() + global.doc.scrollLeft(),
                height: global.win.height() + global.doc.scrollTop()
            });
            if (options.showTips) {
                global.tips.css({
                    left: event.clientX + 10,
                    top: event.clientY + 10
                }).setText(Math.ceil(width) + " × " + Math.ceil(height));
            }
            if (!options.ghost) {
                this.resize(target, width, height, Math.max(width - (target.outerWidth(true) - target.width()), 1), Math.max(height - (target.outerHeight(true) - target.height()), 1));
            }
        }
        return false;
    },
    /**
     * 调节大小终止件处理
     * @param {Event} event
     * @param {DomObject} target 可调节大小的实际元素
     * @private
     */
    stopResize: function (event, target) {
        var options = this._options,
            global = this._global,
            settings = target.elems[0]["resizeSettings" + global.uuid],
            wrapper = target.elems[0]["resizeWrapper" + global.uuid],
            helper = global.helper,
            offset = helper.offset(),
            position, outerWidth, outerHeight, width, height;
        global.doc.unbind("mousemove", global.resizingHandle).unbind("mouseup", global.stopHandle).unbind("dblclick", global.stopHandle).unbind("selectstart", fastDev.Event.stopBubble);
        if (!fastDev.Browser.isIE6 && ("onlosecapture" in document.documentElement)) {
            settings.handler.unbind("losecapture", global.stopHandle);
        } else {
            global.win.unbind("blur", global.stopHandle);
        }
        if ("setCapture" in document.documentElement) {
            settings.handler.elems[0].releaseCapture();
        }
        global.mask.css("display", "none");
        global.helper.css("display", "none");
        global.tips.css("display", "none");
        if (position = settings.fixedPosition) {
            target.css({
                position: "fixed",
                left: position.left,
                top: position.top
            });
            offset.left -= global.doc.scrollLeft();
            offset.top -= global.doc.scrollTop();
        } else if (settings.position === "relative") {
            var fx = fastDev.Util.StringUtil.stripUnits,
                parent = settings.parent,
                left = fx(target.css("left"), parent.width()) || 0,
                top = fx(target.css("top"), parent.height()) || 0;
            offset.left += (left - settings.startLeft);
            offset.top += (top - settings.startTop);
        }
        wrapper.css("zIndex", settings.zIndex).removeClass("ui-resizable-resizing");
        if ((options.onstop || fastDev.noop).call(target, event, width = Math.max((outerWidth = helper.outerWidth(true)) - (target.outerWidth(true) - target.width()), 1), height = Math.max((outerHeight = helper.outerHeight(true)) - (target.outerHeight(true) - target.height()), 1), offset) !== false) {
            this.resize(target, outerWidth, outerHeight, width, height);
        }
        return false;
    },
    /**
     * 变更元素的尺寸样式
     * @param {DomObject} target 可调节大小的实际元素
     * @param {Number} outerWidth 绝对宽度
     * @param {Number} outerHeight 绝对高度
     * @param {Number} width 内容宽度
     * @param {Number} height 内容高度
     * @private
     */
    resize: function (target, outerWidth, outerHeight, width, height) {
        var wrapper = target.elems[0]["resizeWrapper" + this._global.uuid];
        if (wrapper.elems[0] !== target.elems[0]) {
            wrapper.css({
                width: outerWidth,
                height: outerHeight
            });
        }
        target.css({
            width: width,
            height: height
        });
    },
    /**
     * 宽高限制计算
     * @param {DomObject} elem
     * @param {DomObject} parent 宽高百分比值计算的相对元素
     * @private
     */
    limit: function (elem, parent) {
        var options = this._options,
            global = this._global,
            ratio = options.ratio,
            pWidth = parent.width(),
            pHeight = parent.height(),
            fx = fastDev.Util.StringUtil.stripUnits,
            pMinWidth, pMinHeight, pMaxWidth, pMaxHeight, val, b = {
                minWidth: fx(options.minWidth, pWidth) || 1,
                maxWidth: fx(options.maxWidth, pWidth) || Infinity,
                minHeight: fx(options.minHeight, pHeight) || 1,
                maxHeight: fx(options.maxHeight, pHeight) || Infinity
            };
        if (ratio) {
        	// 宽高比例限制计算
            pMinWidth = b.minHeight * ratio;
            pMinHeight = b.minWidth / ratio;
            pMaxWidth = b.maxHeight * ratio;
            pMaxHeight = b.maxWidth / ratio;
            if (pMinWidth > b.minWidth) b.minWidth = pMinWidth;
            if (pMinHeight > b.minHeight) b.minHeight = pMinHeight;
            if (pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
            if (pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
        }
        return b;
    },
    /**
     * 清理文本选取
     * @private
     */
    clsSelect: "getSelection" in window ? function () {
        try {
            window.getSelection().removeAllRanges();
        } catch (e) {}
    } : function () {
        try {
            document.selection.empty();
        } catch (e) {}
    },
    /**
     * 开启调节大小功能
     * @return {fastDev.Interaction.Resizable} 当前调节大小组件实例
     */
    enable: function () {
        var options = this._options;
        options.disabled = !! options.destroyed;
        for (var global = this._global, handler, i = 0; handler = global.resizeHandler[i++];) {
            handler.css("visibility", "visible");
        }
        return this;
    },
    /**
     * 开启调节大小功能
     * @return {fastDev.Interaction.Resizable} 当前调节大小组件实例
     */
    disable: function () {
        this._options.disabled = true;
        for (var global = this._global, handler, i = 0; handler = global.resizeHandler[i++];) {
            handler.css("visibility", "hidden");
        }
        return this;
    },
    /**
     * 开启调节大小功能
     * @return {fastDev.Interaction.Resizable} 当前调节大小组件实例
     */
    destroy: function () {
        var options = this._options,
            global = this._global,
            handler;
        options.destroyed = options.disabled = true;
        options.element.removeClass("ui-resizable-element");
        global.mask.remove();
        global.helper.remove();
        global.tips.remove();
        while (handler = global.resizeHandler.shift()) {
            handler.remove();
        }
        return this;
    }
});
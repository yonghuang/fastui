/**
 * <p>拖拽组件。</p>
 * 以下四个样式类名可供用户自定义使用：
 * <p>ui-draggable-element  被拖动的元素
 * <p>ui-draggable-handle  拖动触发元素
 * <p>ui-draggable-helper  拖动辅助层
 * <p>ui-draggable-dragging 正在拖动中
 * <p>作者：程伟</p>
 * @class fastDev.Interaction.Draggable
 * @extends fastDev.Core.Base
 * @author chengwei
 */
fastDev.define("fastDev.Interaction.Draggable", {
    alias: "Draggable",
    extend: "fastDev.Core.Base",
    _options: {
        /**
         * 被拖拽元素对象或元素选择器
         * @type {Element|String|fastDev.Core.DomObject}
         */
        element: null,
        /**
         * 触发拖拽事件的元素对象或元素选择器
         * @type {Element|String|fastDev.Core.DomObject}
         */
        handle: null,
        /**
         * 是否使用辅助层拖动
         * @type {Boolean}
         */
        ghost: true,
        /**
         * 触发拖动时光标的样式
         * @type {String}
         */
        cursor: "move",
        /**
         * 使用辅助层时辅助层的透明度
         * @type {Number}
         */
        opacity: 0.4,
        /**
         * 使用辅助层时辅助层的背景色
         * @type {String}
         */
        backgroundColor: "#0099CC",
        /**
         * 辅助层样式名
         * @type {String}
         */
        helperCls: "",
        /**
         * 索引重置
         * @type {Number}
         */
        zIndex: 2013,
        /**
         * 是否限制在父容器内拖动
         * @type {Boolean}
         */
        inside: false,
        /**
         * 是否限制在当前可视区域内拖动
         * @type {Boolean}
         */
        visible: true,
        /**
         * 可拖动的坐标轴线，为以下枚举值：
         * 'x,y'、'x'、'y'或['x','y']、['x']、['y']
         * @type {String|Array}
         */
        axis: ["x", "y"],
        /**
         * 以网格大小拖动，单位可为px、%、em，百分比相对于父元素，em受body的font-size字体尺寸样式影响，0表示不受限制，如：
         * '20,0'或[20,0]表示以宽为20px高不限制的格子拖动
         * '10%,10em'或['10%','10em']表示以宽为父元素宽(含margin)的10%、高为10倍字体大小的格子拖动
         * @type {String|Array}
         */
        grid: [0, 0],
        /**
         * 拖动初始完毕时的回调函数
         * @type {Function}
         * @event
         */
        oncreate: fastDev.noop,
        /**
         * 触发拖拽事件时的回调函数
         * <p>this指向当前被拖动的元素
         * <p>返回false值则终止拖动
         * @type {Function} fn 回调函数
         * @param {Event} fn.event 事件对象
         * @event
         */
        onstart: fastDev.noop,
        /**
         * 拖动进行时的回调函数
         * <p>this指向当前被拖动的元素
         * <p>返回false值则不处理该元素的拖动事件
         * 返回false值则终止拖动
         * @type {Function} fn 回调函数
         * @param {Event} fn.event 事件对象
         * @param {Number} fn.x X轴方向位移量
         * @param {Number} fn.y Y轴方向位移量
         * @event
         */
        ondrag: fastDev.noop,
        /**
         * 拖拽事件结束时的回调函数
         * <p>this指向当前被拖动的元素
         * <p>返回false值则不会更改元素定位坐标样式值
         * @type {Function} fn
         * @param {Event} fn.event 事件对象
         * @param {Number} fn.left 元素经拖动后的X轴坐标值
         * @param {Number} fn.top 元素经拖动后的Y轴坐标值
         * @event
         */
        onstop: fastDev.noop
    },
    /**
     * 准备参数
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    ready: function (options, global) {
        fastDev.apply(options, {
            zIndex: parseInt(options.zIndex, 10) || 2013,
            handle: fastDev(fastDev.isComponent(options.handle) ? options.handle.elems[0] : options.handle),
            element: fastDev(fastDev.isComponent(options.element) ? options.element.elems[0] : options.element),
            axis: options.axis ? /\s*(x|y)?\s*\,?\s*(x|y)?\s*$/i.exec(options.axis.toString()) ? [RegExp.$1, RegExp.$2 === RegExp.$1 ? '' : RegExp.$2].join("") : null : null,
            grid: options.grid ? /\s*(-?\d+\.?\d+|-?\d)\s*(px|%|em)?\s*\,\s*(-?\d+\.?\d+|-?\d)\s*(px|%|em)?\s*$/i.exec(options.grid.toString()) ? [RegExp.$1 + RegExp.$2, RegExp.$3 + RegExp.$4] : null : null
        });
    },
    /**
     * 初始控件
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    init: function (options, global) {
        if (options.element.addClass("ui-draggable-element").hasElem()) {
            var that = this,
                doc = document;
            fastDev.apply(global, {
                uuid: fastDev.getID(),
                win: fastDev(window),
                doc: fastDev(doc),
                mask: fastDev("<div/>").appendTo(doc.body).css({
                    top: 0,
                    left: 0,
                    width: 1,
                    height: 1,
                    opacity: 0.01,
                    display: "none",
                    position: "absolute",
                    cursor: options.cursor || "move",
                    zIndex: options.zIndex + 99999997
                })
            });
            if (options.handle.hasElem()) {
            	// 点击触发事件绑定
                global.trigger = options.handle.addClass("ui-draggable-handle").bind("mousedown", global.dragHandle = function (event) {
                    return event.button === ((fastDev.Browser.isIE6 || fastDev.Browser.isIE7 || fastDev.Browser.isIE8) ? 1 : 0) ? that.startDrag(event, options.element) : undefined;
                });
            } else {
                global.trigger = options.element.addClass("ui-draggable-handle").bind("mousedown", global.dragHandle = function (event) {
                    return event.button === ((fastDev.Browser.isIE6 || fastDev.Browser.isIE7 || fastDev.Browser.isIE8) ? 1 : 0) ? that.startDrag(event, fastDev(this)) : undefined;
                });
            }
        }
        (options.oncreate || fastDev.noop).call(this);
    },
    /**
     * 拖拽事件初始化
     * @param {Event} event 事件对象
     * @param {DomObject} target 目标元素
     * @private
     */
    startDrag: function (event, target) {
        var options = this._options;
        if (!options.disabled) {
            for (var that = this, global = this._global, targets = [], elems = target.elems, i = 0, elem; i < elems.length; i++) {
                if ((options.onstart || fastDev.noop).call(elem = fastDev(elems[i]), event) !== false) {
                	// 重新设定当前位置及辅助层
                    this.resetBoundingRect(elem);
                    targets.push(elem.css("zIndex", options.zIndex + 99999996).addClass("ui-draggable-dragging"));
                }
            }
            if (targets.length) {
            	// 拖拽事件绑定
                (global.handler = fastDev(event.target)).cursor = global.handler.css("cursor");
                global.doc.bind("mousemove", global.draggingHandle = function (event) {
                    return that.doDragging(event, targets);
                }).bind("mouseup", global.stopHandle = function (event) {
                    return that.stopDrag(event, targets);
                }).bind("dblclick", global.stopHandle).bind("selectstart", fastDev.Event.stopBubble);
                if (!fastDev.Browser.isIE6 && ("onlosecapture" in document.documentElement)) {
                    global.handler.bind("losecapture", global.stopHandle);
                } else {
                    global.win.bind("blur", global.stopHandle);
                }
                if ("setCapture" in document.documentElement) {
                    event.target.setCapture();
                }
                global.sClientX = event.clientX;
                global.sClientY = event.clientY;
            }
        }
        return false;
    },
    /**
     * 拖拽事件处理
     * @param {Object} event 事件对象
     * @param {Array[DomObject]} targets 被拖拽目标元素集
     * @private
     */
    doDragging: function (event, targets) {
        var options = this._options,
            global = this._global,
            x = event.clientX - global.sClientX,
            y = event.clientY - global.sClientY,
            target, settings, helper, grid, i;
        this.clsSelect();
        global.handler.css("cursor", options.cursor);
        for (i = 0; target = targets[i]; i++) {
            if ((options.ondrag || fastDev.noop).call(target, event, x, y) !== false) {
            	// 指定网格大小限制计算
                grid = (settings = target.elems[0]["dragSettings" + global.uuid]).grid;
                settings.stopLeft = /^x|x$/i.test(options.axis) ? Math.max(settings.limit.minX, Math.min(settings.limit.maxX, (grid[0] ? Math.round(x / grid[0]) * grid[0] : x) + settings.startLeft)) : settings.startLeft;
                settings.stopTop = /^y|y$/i.test(options.axis) ? Math.max(settings.limit.minY, Math.min(settings.limit.maxY, (grid[1] ? Math.round(y / grid[1]) * grid[1] : y) + settings.startTop)) : settings.startTop;
                (helper = settings.helper).css({
                    left: helper.positionCss.left + settings.stopLeft - settings.startLeft,
                    top: helper.positionCss.top + settings.stopTop - settings.startTop,
                    display: "block"
                });
                if (!options.ghost) {
                    target.css({
                        left: settings.stopLeft,
                        top: settings.stopTop
                    });
                }
            }
        }
        global.mask.css({
            display: "block",
            width: global.win.width() + global.doc.scrollLeft(),
            height: global.win.height() + global.doc.scrollTop()
        });
        return false;
    },
    /**
     * 拖拽结束事件
     * @param {Object} event 事件对象
     * @param {Array} targets 被拖拽目标元素集
     * @private
     */
    stopDrag: function (event, targets) {
        var options = this._options,
            global = this._global,
            target, settings;
            // 解绑相关拖拽事件
        global.doc.unbind("mousemove", global.draggingHandle).unbind("mouseup", global.stopHandle).unbind("dblclick", global.stopHandle).unbind("selectstart", fastDev.Event.stopBubble);
        if (!fastDev.Browser.isIE6 && ("onlosecapture" in document.documentElement)) {
            global.handler.unbind("losecapture", global.stopHandle);
        } else {
            global.win.unbind("blur", global.stopHandle);
        }
        if ("setCapture" in document.documentElement) {
            global.handler.elems[0].releaseCapture();
        }
        global.handler.css("cursor", global.handler.cursor);
        global.mask.css("display", "none");
        while (target = targets.shift()) {
            target.removeClass("ui-draggable-dragging");
            (settings = target.elems[0]["dragSettings" + global.uuid]).helper.remove();
            if ((options.onstop || fastDev.noop).call(target, event, settings.stopLeft, settings.stopTop) !== false) {
                target.css({
                    left: settings.stopLeft,
                    top: settings.stopTop
                });
            }
            target.css("zIndex", settings.zIndex);
            target.elems[0]["dragSettings" + global.uuid] = null;
        }
        return false;
    },
    /**
     * 重设当前正在被拖拽的元素
     * @param {DomObject} elem 当前正在被拖拽的元素
     * @return {fastDev.Interaction.Draggable} 当前拖拽组件实例
     */
    resetBoundingRect: function (elem) {
        var options = this._options,
            global = this._global,
            body = fastDev(document.body),
            fx = fastDev.Util.StringUtil.stripUnits,
            bodyBorder = {
                left: parseInt(body.css("borderLeftWidth"), 10) || 0,
                top: parseInt(body.css("borderTopWidth"), 10) || 0
            },
            offset, position, positionCss, fixed, width, height, parent, helper, settings;
        if ((elem = fastDev(elem)).hasElem()) {
            parent = elem.css("position", positionCss = (position = elem.css("position")) === "static" ? "relative" : position).parent();
            offset = (fixed = positionCss === "fixed") ? {
                left: elem.elems[0].offsetLeft,
                top: elem.elems[0].offsetTop
            } : positionCss === "absolute" ? parent.elems[0] === document.body ? elem.offset() : elem.position() : {
                left: fx(elem.css("left"), parent.width()) || 0,
                top: fx(elem.css("top"), parent.height()) || 0
            };
            position = fixed ? offset : elem.offset();
            if (settings = elem.elems[0]["dragSettings" + global.uuid]) {
                settings.helper.remove();
            }
            (helper = this.createHelper(elem).css({
                position: fixed ? "fixed" : "absolute",
                height: height = elem.outerHeight(true),
                width: width = elem.outerWidth(true),
                left: (position = {
                    left: position.left + (fixed ? 0 : bodyBorder.left),
                    top: position.top + (fixed ? 0 : bodyBorder.top)
                }).left,
                top: position.top,
                display: "none"
            })).positionCss = position;
            if (positionCss === "absolute" && parent.elems[0] === document.body) {
                offset.left += bodyBorder.left;
                offset.top += bodyBorder.top;
            }
            elem.elems[0]["dragSettings" + global.uuid] = {
                grid: [fx(options.grid[0], parent.outerWidth(true)), fx(options.grid[1], parent.outerHeight(true))],
                limit: this.calculateLimit(width, height, offset, elem, parent, positionCss),
                zIndex: settings ? settings.zIndex : elem.css("zIndex"),
                startLeft: offset.left,
                stopLeft: offset.left,
                startTop: offset.top,
                stopTop: offset.top,
                helper: helper
            };
        }
        return this;
    },
    /**
     * 计算坐标范围
     * @param {Number} width
     * @param {Number} height
     * @param {Object} offset
     * @param {DomObject} elem
     * @param {DomObject} parent
     * @param {String} positionCss
     * @private
     */
    calculateLimit: function (width, height, offset, elem, parent, positionCss) {
        var options = this._options,
            global = this._global,
            fixed = positionCss === "fixed",
            maxX = Infinity,
            pMaxX = Infinity,
            minX = 0,
            pMinX = 0,
            maxY = Infinity,
            pMaxY = Infinity,
            minY = 0,
            pMinY = 0,
            docLeft, docTop;
        if (options.inside) {
            if (positionCss === "relative") {
                var fx = fastDev.Util.StringUtil.stripUnits,
                    position = elem.offset(),
                    pOffset = parent.offset(),
                    grandparent = parent.parent(),
                    gWidth = grandparent.width(),
                    gHeight = grandparent.height();
                pMinX = -(position.left - pOffset.left - offset.left - (parseInt(parent.css("borderLeftWidth"), 10) || 0) + (fx(parent.css("paddingLeft"), gWidth) || 0) + (fx(parent.css("marginLeft"), gWidth) || 0));
                pMinY = -(position.top - pOffset.top - offset.top - (parseInt(parent.css("borderTopWidth"), 10) || 0) + (fx(parent.css("paddingTop"), gHeight) || 0) + (fx(parent.css("marginTop"), gHeight) || 0));
            }
            pMaxX = pMinX + parent.width() - width;
            pMaxY = pMinY + parent.height() - height;
        }
        if (options.visible) {
            minX = docLeft = fixed ? 0 : global.doc.scrollLeft();
            minY = docTop = fixed ? 0 : global.doc.scrollTop();
            maxY = global.win.height() - height + docTop;
            maxX = global.win.width() - width + docLeft;
        }
        return {
            minX: Math.max(pMinX, minX),
            minY: Math.max(pMinY, minY),
            maxX: Math.min(pMaxX, maxX),
            maxY: Math.min(pMaxY, maxY)
        };
    },
    /**
     * 创建拖拽辅助层
     * @param {DomObject} elem 当前被拖拽的元素
     * @private
     */
    createHelper: function (elem) {
        var options = this._options;
        return fastDev("<div/>").css({
            cursor: options.cursor,
            zIndex: options.zIndex + 99999998,
            backgroundColor: options.backgroundColor,
            opacity: options.ghost ? options.opacity : 0.04
        }).setClass(options.helperCls || "ui-draggable-helper").appendTo(document.body);
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
     * 开启拖拽功能
     * @return {fastDev.Interaction.Draggable} 当前拖拽组件实例
     */
    enable: function () {
        var options = this._options;
        options.disabled = !! options.destroyed;
        return this;
    },
    /**
     * 禁用拖拽功能
     * @return {fastDev.Interaction.Draggable} 当前拖拽组件实例
     */
    disable: function () {
        this._options.disabled = true;
        return this;
    },
    /**
     * 销毁当前拖拽控件实例
     * @return {fastDev.Interaction.Draggable} 当前拖拽组件实例
     */
    destroy: function () {
        var options = this._options,
            global = this._global;
        options.destroyed = options.disabled = true;
        options.element.removeClass("ui-draggable-element");
        (global.trigger || fastDev()).removeClass("ui-draggable-handle").unbind("mousedown", global.dragHandle);
        global.mask.remove();
        return this;
    }
});
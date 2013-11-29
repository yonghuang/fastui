/**
 * @class fastDev.Ui.MessageBox
 * @extends fastDev.Ui.Dialog
 * @author chengwei
 * <p>消息提示框控件。</p>
 * <p>作者：程伟</p>
 *
 *     fastDev.create("MessageBox", {
 *        width : "200px",
 *        height : "150px",
 *        content : "消息内容",
 *        icon : "tip"
 *     })
 */
fastDev.define("fastDev.Ui.MessageBox", {
    alias: "MessageBox",
    extend: "fastDev.Ui.Dialog",
    _options: {
        /**
         * 是否固定定位
         * @type {Boolean}
         */
        fixed: true,
        /**
         * 标题内容
         * @type {String}
         */
        title: "消息",
        /**
         * 动画速度
         * @type {Number} 
         */
        animateSpeed: 180,
        /**
         * 是否允许调节大小
         * @type {Boolean}
         */
        allowResize: false,
        /**
         * 是否在当前父容器展现
         * @type {Boolean}
         */
        inside: false,
        /**
         * 最小宽度
         * @type {String|Number}
         */
        minWidth: 255,
        /**
         * 是否显示最大化按钮
         * @type {Boolean}
         */
        showMaxBtn: false,
        /**
         * 是否显示最小化按钮
         * @type {Boolean}
         */
        showMinBtn: false,
        /**
         * 是否显示折叠按钮
         * @type {Boolean}
         */
        showCollapseBtn: false
    },
    /**
     * 内置消息框队列 
     * @private
     */
    queue: [],
    /**
     * 构造结构
     * @param {Object} options 参数配置对象
     * @param {Object} global 控件私有变量域
     * @protected
     */
    construct: function (options, global) {
        global.box.removeClass("ui-dialog").addClass("ui-messagebox");
    },
    /**
     * @param {Function} callback 按钮点击回调
     * @param {String} [name] 按钮名
     * @return {Function}
     * @private 
     */
    getBtnCallback: function (callback, name) {
        if (typeof callback !== "function" && (name = /^@MESSAGEBOX#(ALERT|CONFIRM|PROMPT|SAVE)#(OK|YES|NO|CANCEL)$/.exec(name))) {
            callback = function (event, that) {
                if ((that._options["on" + name[2] + "BtnClick"] || fastDev.noop).apply(that, [/CONFIRM|PROMPT/i.test(name[1]) ? name[2] === "OK" : name[2].toLowerCase(), /PROMPT/i.test(name[1]) ? that.find("[name='input']").prop("value") : undefined]) !== false) {
                    that.close();
                }
            };
        }
        return fastDev.Ui.Window.getBtnCallback.call(this, callback);
    },
    /**
     * 初始预设的消息框
     * @param {String} type 消息框类型
     * @param {Object} options 配置对象
     * @param {Boolean} queued 是否属队列操作
     * @return {fastDev.Ui.MessageBox}
     * @private 
     */
    initPredefineBox: function (type, options, queued) {
        var top = fastDev.Util.position.top,
            box = fastDev.Ui.MessageBox,
            queue = box.queue;
        if (!queued) {
            queue.push({
                type: type,
                options: options
            });
            if (queue.length === 1) {
                return box.initPredefineBox(type, options, true);
            }
        } else {
            var msger = fastDev.Ui.Window.getData("@MESSAGEBOX#" + type),
                fn = options.callback,
                callback = typeof fn === "function" ? function () {
                    try {
                        return fn.apply(this, arguments);
                    } catch (e) {
                        fastDev.error("fastDev", type, "消息框回调函数执行异常。[" + e + "]");
                    }
                } : fastDev.noop,
                common = {
                    animateSpeed: fastDev.Ui.Panel.launchAnimation ? 180 : 0,
                    onCloseBtnClick: function () {
                        return callback.apply(this, [/CONFIRM|PROMPT/i.test(type) ? false : "cancel", /PROMPT/i.test(type) ? this.find("[name='input']").prop("value") : undefined]);
                    },
                    onAfterOpen: type === "prompt" ? function () {
                        var elem = this.find("[name='input']").elems[0];
                        elem.focus();
                        elem.select();
                    } : fastDev.noop,
                    onCANCELBtnClick: callback,
                    onYESBtnClick: callback,
                    onOKBtnClick: callback,
                    onNOBtnClick: callback,
                    onAfterClose: function () {
                        var box = fastDev.Ui.MessageBox,
                            queue = box.queue;
                        if (queue) {
                            var settings;
                            queue.shift();
                            if (settings = queue[0]) {
                                box.initPredefineBox(settings.type, settings.options, true);
                            }
                        }
                    }
                };
            options.content = fastDev.isValid(options.content) ? options.content : "";
            if (msger) {
                fastDev.apply(msger._options, fastDev.apply({
                    icon: options.icon || "",
                    height: "auto",
                    width: "auto"
                }, common));
                msger.setContent(options.content).move({
                    left: "50%",
                    top: "38.2%"
                }).show().setTitle(options.title || "消息", options.iconCls || "");
            } else {
                options.persisted = true;
                fastDev.Ui.Window.setData("@MESSAGEBOX#" + type, msger = top.fastDev.create("MessageBox", fastDev.apply(options, common)));
            }
            fastDev(window).unbind("unload", box._winUnloadEventHandler || fastDev.noop).bind("unload", box._winUnloadEventHandler = function () {
                box.queue = [];
                msger.hide(true, false);
            });
            return msger;
        }
    }
});
fastDev.apply(fastDev, {
    /**
     * 确认框
     * @param {String} content 消息内容
     * @param {String} [title] 标题内容
     * @param {Function} [callback] 回调函数，参数为true为点击确定按钮，参数为false为点击取消按钮，this指向消息框控件，返回false则默认不关闭消息框
     * @param {String} [iconCls] 标题图标样式名
     * @return {fastDev.Ui.MessageBox}
     */
    confirm: function (content, title, callback, iconCls) {
        return fastDev.Ui.MessageBox.initPredefineBox("confirm", {
            title: title || "确认",
            zIndex: 999999998,
            callback: callback,
            content: content,
            iconCls: iconCls,
            icon: "help",
            buttons: [{
                    text: "确定",
                    width: "63px",
                    name: "@MESSAGEBOX#CONFIRM#OK"
                }, {
                    text: "取消",
                    width: "63px",
                    name: "@MESSAGEBOX#CONFIRM#CANCEL"
                }
            ]
        });
    },
    /**
     * 提问框
     * @param {String} content 提问内容
     * @param {String} [title] 标题内容
     * @param {Function} [callback] 回调函数，第一个参数为true表示点击确定按钮，为false则表示点击取消或关闭按钮，第二个参数为输入框或文本域的值，this指向消息框控件，返回false则默认不关闭消息框
     * @param {Boolean} [multiline] 输入框是否是文本域
     * @param {String} [value] 输入框或文本域中初始时的默认值
     * @param {String} [iconCls] 标题图标样式名
     * @return {fastDev.Ui.MessageBox}
     */
    prompt: function (content, title, callback, multiline, value, iconCls) {
        value = fastDev.isValid(value) ? value : "";
        var width = multiline ? "304px" : "299px",
            height = multiline ? "188px" : "132px",
            html = '<div style="margin:3px 10px"><div style="height:' + (content ? "" : "18px") + ';margin-bottom:2px;width:' + (multiline ? 259 : 254) + 'px;word-wrap:break-word;word-break:break-all">' + content + '</div>';
        if (multiline) {
            html += '<div style="width:259px;height:81px;"><div style="width:259px" class="ui-form"><div class="ui-form-wrap ui-textarea"><div style="width:100%"><textarea name="input" value="' + value + '" class="ui-form-field ui-form-input" autocomplete="off" aria-invalid="false" style="resize:none;overflow:auto;height:77px"></textarea></div></div></div></div>';
        } else {
            html += '<div style="width:254px;"><div style="width:254px" class="ui-form"><div class="ui-form-wrap ui-input"><input name="input" value="' + value + '" type="input" class="ui-form-field ui-form-input"></div></div></div>';
        }
        html += "</div>";
        return fastDev.Ui.MessageBox.initPredefineBox("prompt", {
            title: title || "输入",
            zIndex: 999999997,
            callback: callback,
            minHeight: height,
            maxHeight: 5000,
            content: html,
            iconCls: iconCls,
            buttons: [{
                    text: "确定",
                    width: "63px",
                    name: "@MESSAGEBOX#PROMPT#OK"
                }, {
                    text: "取消",
                    width: "63px",
                    name: "@MESSAGEBOX#PROMPT#CANCEL"
                }
            ]
        });
    },
    /**
     * 提示框
     * @param {String} content 提示内容
     * @param {String} [title] 标题内容
     * @param {String} [icon] 图标名
     * @param {Function} [callback] "确定"按钮点击回调，回调内this指向当前消息框控件实例，返回false则默认不关闭消息框
     * @param {String} [iconCls] 标题图标样式名
     * @return {fastDev.Ui.MessageBox}
     */
    alert: function (content, title, icon, callback, iconCls) {
        return fastDev.Ui.MessageBox.initPredefineBox("alert", {
            title: title || "消息",
            zIndex: 999999999,
            callback: callback,
            content: content,
            iconCls: iconCls,
            icon: icon,
            buttons: {
                text: "确定",
                width: "63px",
                name: "@MESSAGEBOX#ALERT#OK"
            }
        });
    },
    /**
     * YES_NO_CANCEL三按钮提示框
     * @param {String} content 消息内容
     * @param {String} [title] 标题内容
     * @param {Function} [callback] 回调函数，参数为以下枚举值：
     * <p>-yes "是"按钮点击 </p>
     * <p>-no "否"按钮点击 </p>
     * <p>-cancel "取消或关闭"按钮点击 </p>
     * 返回false则默认不关闭消息框
     * @param {String} [iconCls] 标题图标样式名
     * @return {fastDev.Ui.MessageBox}
     */
    save: function (content, title, callback, iconCls) {
        return fastDev.Ui.MessageBox.initPredefineBox("save", {
            title: title || "消息",
            zIndex: 999999998,
            callback: callback,
            content: content,
            iconCls: iconCls,
            icon: "help",
            buttons: [{
                    text: "是",
                    width: "58px",
                    name: "@MESSAGEBOX#SAVE#YES"
                }, {
                    text: "否",
                    width: "58px",
                    name: "@MESSAGEBOX#SAVE#NO"
                }, {
                    text: "取消",
                    width: "58px",
                    name: "@MESSAGEBOX#SAVE#CANCEL"
                }
            ]
        });
    },
    /**
     * 简短提示消息标签
     * @param {String} content 提示消息内容
     * @param {String} [icon="tip"] 内容图标名
     * @param {Boolean|Number} [shake=false] 是否启用摇晃效果，数值参数时为摇晃的频率
     * @param {Number} [time=2] 显示时长，单位为秒
     * @return {fastDev.Ui.Window}
     */
    tips: function (content, icon, shake, time) {
        return fastDev.create("Window", {
            content: '<div name="tips" style="white-space:nowrap;">' + (fastDev.isValid(content) ? content : "") + '</div>',
            icon: icon = fastDev.isValid(icon) ? icon : "tip",
            showHeader: false,
            display: false,
            allowResize: false,
            allowDrag: false,
            modal: false,
            inside: false,
            fixed: true,
            top: "36.2%",
            minHeight: 58,
            maxHeight: 58,
            minWidth: 120,
            maxWidth: function (boxWidth) {
                return Math.max(Math.min(boxWidth - 40, 800), 120);
            },
            onBeforeClose: function () {
                this.close(true, {
                    stop: {
                        top: "15%",
                        opacity: 0
                    }
                });
                return false;
            },
            onAnimateStart: function () {
                this.showContent();
                this._global.content.css("overflow", "hidden");
            },
            onAnimateStop: function () {
                this._global.content.css("overflow", "hidden");
            }
        }).open(true, {
            start: function () {
                var global = this._global,
                    options = this._options,
                    height = options.height - 12,
                    width = options.width - 12,
                    tips = this.find("div[name='tips']"),
                    align = "center";
                for (var elems = ["box", "body"], elem; elem = elems.shift();) {
                    global[elem].css({
                        "-webkit-border-radius": "5px",
                        "-moz-border-radius": "5px",
                        "border-radius": "5px"
                    });
                }
                global.content.css("padding", "5px 15px");
                if (icon && fastDev.isString(icon)) {
                    tips.parent().css({
                        margin: "7px 0px",
                        height: (height -= 14)
                    });
                    width -= 40;
                    align = "left";
                }
                global.box.width(options.width += 20);
                tips.css({
                    lineHeight: height - 3 + "px",
                    textOverflow: !fastDev.Browser.isIE ? "ellipsis" : "",
                    overflow: "hidden",
                    width: width,
                    textAlign: align,
                    height: height
                });
                return {
                    opacity: 0,
                    left: "50%"
                };
            },
            stop: {
                top: "30%",
                opacity: 1
            },
            callback: function () {
                if (shake) {
                    this.shake(shake);
                }
                this.closeTimeout(Math.abs(parseFloat(time) || 2));
            }
        });
    },
    /**
     * 通知框
     * <p>除3个特定参数（time、showTime、position）外，其他配置参数继承自MessageBox
     * @param {String} [options] 参数配置对象
     * @param {String} [options.itype] 控件类型，可选值为：Window、Dialog、MessageBox
     * @param {String} [options.time] 显示时长，单位为秒
     * @param {String} [options.position] 弹出位置（left-top、top、right-top、left、right、left-bottom、right-bottom、bottom）
     * @param {Boolean} [options.showTime] 是否在标题栏显示关闭倒计时信息
     * @param {String|Number} [options.horizontalOffset] 弹窗在水平方向（X轴）上的最终显示位置相对可视区域边界的偏移量（百分比值相对于可视区域计算）
     * @param {String|Number} [options.verticalOffset] 弹窗在垂直方向（Y轴）上的最终显示位置相对于可视区域边界的偏移量（百分比值相对于可视区域计算）
     * @param {String} [options.showTime] 是否在标题栏显示关闭倒计时信息
     * @param {String} [options.onBeforeAutoClose] 自动关闭前的回调函数。（此回调先于onBeforeClose回调执行）
     * @return {fastDev.Ui.MessageBox}
     */
    notice: function (options) {
        var getPosition = function (global) {
            var docLeft = global.doc.scrollLeft(),
                docTop = global.doc.scrollTop(),
                width = global.box.width(),
                height = global.box.height(),
                regx = /^\d+(?:\.\d+|)%$/,
                horizontalOffset = options.horizontalOffset,
                verticalOffset = options.verticalOffset,
                leftPercent = regx.test(horizontalOffset),
                topPercent = regx.test(verticalOffset);
            return {
                left: /^left$/i.test(position) ? docLeft - width : /^right$/i.test(position) ? docLeft + global.win.width() + width : /.*left.*/i.test(position) ? leftPercent ? horizontalOffset : docLeft : /.*right.*/i.test(position) ? leftPercent ? (100 - parseFloat(horizontalOffset)) + "%" : "100%" : leftPercent ? horizontalOffset : "50%",
                top: /.*top.*/i.test(position) ? docTop - height : /.*bottom.*/i.test(position) ? global.win.height() + docTop + height : topPercent ? verticalOffset : "50%",
                visible: false,
                opacity: 0
            };
        }, position = (options = fastDev.isPlainObject(options) ? options : {}).position || "right-bottom",
            onBeforeAutoClose = options.onBeforeAutoClose || fastDev.noop;
        fastDev.apply(options, {
            animateSpeed: fastDev.isValid(options.animateSpeed) ? options.animateSpeed : 600,
            maxHeight: options.maxHeight || 453,
            minHeight: options.minHeight || 96,
            maxWidth: options.maxWidth || 280,
            minWidth: options.minWidth || 155,
            allowResize: !! options.allowResize || false,
            fixed: options.fixed === undefined ? true : !! options.fixed,
            showCollapseBtn: !! options.showCollapseBtn || false,
            modal: !! options.modal || false,
            inside: !! options.inside || false,
            display: false,
            visible: true,
            onAnimateStart: function (target, queue, type) {
                if (/open|close/.test(type)) {
                    this.showContent();
                    if (fastDev.isValid(options.horizontalOffset) || fastDev.isValid(options.verticalOffset)) {
                        var global = this._global,
                            regx = /^\d+(?:\.\d+|)%$/,
                            fx = fastDev.Util.StringUtil.stripUnits,
                            left = regx.test(options.horizontalOffset) ? 0 : fx(options.horizontalOffset, global.win, "width"),
                            top = regx.test(options.verticalOffset) ? 0 : fx(options.verticalOffset, global.win, "height"),
                            animation;
                        queue = fastDev.isArray(queue) ? queue : [queue || {}];
                        fastDev.each(["start", "stop"], function (i, val) {
                            animation = queue[0][val];
                            animation.left += (!isNaN(left) ? /.*right.*/i.test(position) ? -left : left : 0);
                            animation.top += (!isNaN(top) ? /.*bottom.*/i.test(position) ? -top : top : 0);
                        });
                    }
                }
            },
            onCloseBtnClick: function () {
                this.close(false, {
                    stop: getPosition(this._global)
                });
                return false;
            }
        });
        return fastDev.create(/(Window|Dialog|MessageBox)/i.test(options.itype) ? RegExp.$1 : "MessageBox", options).open(true, {
            start: function () {
                return getPosition(this._global);
            },
            stop: function () {
                var regx = /^\d+(?:\.\d+|)%$/,
                    horizontalOffset = options.horizontalOffset,
                    verticalOffset = options.verticalOffset;
                return {
                    left: regx.test(horizontalOffset) ? /.*right.*/i.test(position) ? (100 - parseFloat(horizontalOffset)) + "%" : horizontalOffset : /.*left.*/i.test(position) ? 0 : /.*right.*/i.test(position) ? "100%" : "50%",
                    top: regx.test(verticalOffset) ? /.*bottom.*/i.test(position) ? (100 - parseFloat(verticalOffset)) + "%" : verticalOffset : /.*top.*/i.test(position) ? 0 : /.*bottom.*/i.test(position) ? "100%" : "50%",
                    visible: true,
                    opacity: 1
                };
            },
            callback: function () {
                var that = this,
                    global = this._global,
                    time = Math.abs(parseInt(options.time, 10));
                if (time && options.showTime) {
                    global.windowCloseTimer = window.setInterval(function () {
                        that.setTitle(options.title + "（" + (--time) + " 秒后自动关闭）");
                        if (!time) {
                            window.clearInterval(global.windowCloseTimer);
                            onBeforeAutoClose.call(that);
                            that.close(false, {
                                stop: getPosition(global)
                            });
                        }
                    }, 1000);
                } else if (!isNaN(time)) {
                    global.windowCloseTimer = window.setTimeout(function () {
                        onBeforeAutoClose.call(that);
                        that.close(false, {
                            stop: getPosition(global)
                        });
                    }, time * 1000);
                }
            }
        });
    }
});
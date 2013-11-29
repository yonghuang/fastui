/**
 * @class fastDev.Ui.Dialog
 * @extends fastDev.Ui.Window
 * @author chengwei
 * <p>对话框控件。</p>
 * <p>属弹窗类控件，继承自Window。</p>
 * <p>可定义工具栏。</p>
 * <p>作者：程伟</p>
 *     
 *     fastDev.create("Dialog", {
 *          title : "标题",
 *          src : "iframe.html"
 *     });
 */
fastDev.define("fastDev.Ui.Dialog", {
    extend: "fastDev.Ui.Window",
    alias: "Dialog",
    _options: {
        /**
         * 定义顶部的工具栏
         * @type {Object}
         */
        toolbar: null
    },
    /**
     * 用于构建静态模板串
     * @param {Object} params 模板已解析参数对象
     * @private 
     */
    staticTemplate: function (params) {
        var html = [];
        if (params.inside) {
            html.push('<div name="box" class="ui-window ui-dialog ui-window-plain ui-window-radius ui-window-shadow ' + params.cls + '" style="display:none;z-index:' + params.zIndex + '">');
            if (params.showHeader) {
                html.push([
                        '<div class="ui-window-tl">',
                        '<div class="ui-window-tr">',
                        '<div name="header" class="ui-window-tc">',
                        '<div class="ui-window-header ui-window-header-noborder">',
                        '<div name="title" class="ui-window-header-text  ' + params.iconCls + ' ' + params.headerCls + '" style="height:16px">' + params.title + '</div>',
                        '<div name="tool" class="ui-window-tool">',
                        '<span class="ui-window-tool-show" name="Expand" handler="expand" title="展开"></span>',
                        '<span class="ui-window-tool-hidden" name="Collapse" handler="collapse" title="折叠"></span>',
                        '<span class="ui-window-tool-min" name="Min" handler="minimize" title="最小化"></span>',
                        '<span class="ui-window-tool-restore" name="Restore" handler="reset" title="还原"></span>',
                        '<span class="ui-window-tool-max" name="Max" handler="maximize" title="最大化"></span>',
                        '<span class="ui-window-tool-close" name="Close" handler="close" title="关闭"></span>',
                        '</div></div></div></div></div>'
                ].join(''));
            }
            html.push('<div class="ui-window-bg"><div name="body" class="ui-window-content-bg ui-window-body">');
            if ( !! params.toolbar) {
                html.push('<div name="toolbar" style="width:100%"></div>');
            }
            html.push('<div name="content" class="ui-window-content ' + params.bodyCls + '" style="' + params.bodyStyle + '"></div>');
            if ( !! params.buttons) {
                html.push([
                        '<div name="buttons" class="ui-window-button-panel">',
                        '<span name="left" class="ui-left" style="display:none;margin-left:' + params.btnPanelMarginLeft + '"></span>',
                        '<span name="center" class="ui-center" style="display:none;overflow:hidden"></span>',
                        '<span name="right" class="ui-right" style="display:none;margin-right:' + params.btnPanelMarginRight + '"></span>',
                        '</div>'
                ].join(''));
            }
            html.push('</div></div><div class="ui-window-bl"><div class="ui-window-br"><div class="ui-window-bc"><div class="ui-window-footer"></div></div></div></div></div>');
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
    tplParam: ["inside", "zIndex", "showHeader", "cls", "iconCls", "toolbar", "headerCls", "title", "bodyCls", "bodyStyle", "buttons", "showShadow", "modal", "btnPanelMarginLeft", "btnPanelMarginRight"],
    /**
     * 对话框参数准备
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    ready: function (options, global) {
        if (!fastDev.isPlainObject(options.toolbar)) {
            options.toolbar = null;
        }
        options.showBorder = true;
        // 底部按钮面板与边线的距离
        global.btnPanelMarginLeft = (fastDev.Browser.isIE6 || fastDev.Browser.isIE7) ? "10px" : "5px";
        global.btnPanelMarginRight = (fastDev.Browser.isIE6 || fastDev.Browser.isIE7) ? "0px" : "5px";
    },
    /**
     * 构造对话框
     * @param {Object} options 当前控件配置信息
     * @param {Object} global 当前控件全局信息
     * @protected
     */
    construct: function (options, global) {
        if (options.inside) {
            var that = this;
            global.toolbar = this.find("[name='toolbar']");
            if (fastDev.isPlainObject(options.toolbar)) {
                options.toolbar.container = global.toolbar;
                // 初始工具栏
                fastDev.each(options.toolbar.items = [].concat(options.toolbar.items), function (index, item) {
                    if (fastDev.isPlainObject(item)) {
                        item.onclick = that.getBtnCallback(item.onclick);
                    }
                });
                global.toolbarInstance = fastDev.create("Toolbar", options.toolbar);
                global.hasToolbar = true;
                global.onDragStart = function () {
                    global.toolbar.hide();
                };
                global.onDragStop = function () {
                    if (global.hasToolbar) {
                        global.toolbar.show();
                    }
                };
            }
        }
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
            global = this._global,
            duration = 0,
            startHeight, stopHeight, height;
        animation = fastDev.Ui.Window.initAnimation.call(this, type, target, animation);
        for (var i = 0; i < animation.length; i++) {
        	// 计算总的动画执行时长
            duration += animation[i].duration;
        }
        if (!(duration === 0 || type === "collapse" || type === "expand" || options.collapsed)) {
            height = global.box.height();
            startHeight = animation[0].start.height;
            stopHeight = animation[animation.length - 1].stop.height;
            global.body.css({
            	// 调整内容区域的高度
                height: this.getBodyHeight(isNaN(startHeight) ? height : startHeight),
                display: "block"
            }).animate({
                height: this.getBodyHeight(isNaN(stopHeight) ? height : stopHeight)
            }, duration, options.animateEasing || animation.easing);
        }
        return animation;
    },
    /**
     * 开始动画前的回调
     * @param {DomObject} target 动画目标
     * @param {Object} animation 动画队列配置
     * @private 
     */
    startAnimation: function (target, animation) {
        var res = fastDev.Ui.Window.startAnimation.apply(this, arguments);
        this._global.body.removeCss("borderColor");
        return res;
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
        return Math.max(bodyHeight - (content.outerHeight(true) - content.height()) - (global.hasButton ? Math.max(global.buttons.outerHeight(true), 32) : 0) - (global.hasToolbar ? Math.max(global.toolbar.outerHeight(true), 28) : 0), 0);
    },
    /**
     * 获取对话框主体部分的高度值
     * @param {Number} height 总高度
     * @return {Number}
     * @protected
     */
    getBodyHeight: function (height) {
        var options = this._options;
        return Math.max(parseInt(height, 10) - (options.showHeader ? Math.max(this._global.header.outerHeight(true), 27) : 0) - 9, 0);
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
            // 2pxbody-bg边框，10px body外边距，2px body边框
            width: Math.abs(global.content.outerWidth(true) - global.content.width() + 2 + 10 + 2),
            height: Math.abs(12 + (global.content.outerHeight(true) - global.content.height()) + (global.hasButton ? Math.max(global.buttons.outerHeight(true), 32) : 0) + (global.hasToolbar ? Math.max(global.toolbar.outerHeight(true), 28) : 0) + (options.showHeader ? Math.max(global.header.outerHeight(true), 27) : 0))
        };
    },
    /**
     * 获取工具栏 
     * @return {fastDev.Ui.Toobar}
     */
    getToolbar: function () {
        return this._global.toolbarInstance;
    },
    /**
     * 隐藏工具栏
     * @return {fastDev.Ui.Dialog} 当前对话框控件实例
     */
    hideToolbar: function () {
        var global = this._global;
        if (global.toolbarInstance) {
            global.toolbar.hide();
            global.hasToolbar = false;
            this.resize({
                height: global.box.height()
            });
        }
        return this;
    },
    /**
     * 显示工具栏
     * @return {fastDev.Ui.Dialog} 当前对话框控件实例
     */
    showToolbar: function () {
        var global = this._global;
        if (global.toolbarInstance) {
            global.toolbar.show();
            global.hasToolbar = true;
            this.resize({
                height: global.box.height()
            });
        }
        return this;
    }
});
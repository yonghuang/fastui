/**
 * @class fastDev.Ui.ChooseList
 * @extends fastDev.Ui.Component
 * @author chengwei
 * <p>选择列表控件。</p>
 * <p>适用于需对某一数据集进行数据筛选过滤的场合。</p>
 * <p>作者：程伟</p>
 *     
 *     <div itype="ChooseList" id="list2" saveInstance="true" leftWidth="160px" 
 *          rightWidth="160px" initSource="../../data/chooselist.json" 
 *          dataSource="../../data/chooselist_select.json">
 *     </div>
 */
fastDev.define("fastDev.Ui.ChooseList", {
    alias: "ChooseList",
    extend: "fastDev.Ui.Component",
    _options: {
        /**
         * 左侧区域的宽度
         * @type {String|Number}
         */
        leftWidth: "122px",
        /**
         * 左侧顶部区域高度
         * @type {String|Number}
         */
        leftTopHeight: 0,
        /**
         * 左侧底部区域的高度
         * @type {String|Number}
         */
        leftBottomHeight: 0,
        /**
         * 中部区域的宽度
         * @type {String|Number}
         */
        centerWidth: "77px",
        /**
         * 按钮的宽度
         * @type {String|Number}
         */
        buttonWidth: "50px",
        /**
         * 右侧区域的宽度
         * @type {String|Number}
         */
        rightWidth: "122px",
        /**
         * 右侧顶部区域的高度
         * @type {String|Number}
         */
        rightTopHeight: 0,
        /**
         * 右侧底部区域的高度
         * @type {String|Number}
         */
        rightBottomHeight: 0,
        /**
         * 整个控件的高度
         * @type {String|Number}
         */
        height: "150px",
        /**
         * 左部上方自定义模板
         * @type {String}
         */
        leftTop: "",
        /**
         * 左部下方自定义模板
         * @type {String}
         */
        leftBottom: "",
        /**
         * 右部上方自定义模板
         * @type {String}
         */
        rightTop: "",
        /**
         * 右部下方自定义模板
         * @type {String}
         */
        rightBottom: "",
        /**
         * 左边中部区域自定义样式名
         * @type {String}
         */
        leftCls: "",
        /**
         * 右边中部区域自定义样式名
         * @type {String}
         */
        rightCls: "",
        /**
         * 中部区域自定义样式名
         * @type {String}
         */
        centerCls: "",
        /**
         * 是否显示功能按钮（选取，移除等操作按钮）
         * 不需要功能按钮时，可以通过该属性撤销按钮的构建
         * @type {Boolean} 
         */
        showFunctionBtn: true,
        /**
         * 远程数据源链接地址
         * @type {String}
         */
        initSource: null,
        /**
         * 已选值数据源
         * @type {String}
         */
        dataSource: null,
        /**
         * 是否在加载数据时显示加载图标
         * @type {Boolean} 
         */
        showLoading: true,
        /**
         * 重置索引值
         * @type {Number} 
         */
        zIndex: 2012,
        /**
         * 加载图标附带的提示文本信息
         * @type {String} 
         */
        loadingMsg: "",
        /**
         * 记录的主键字段名
         * 用于标记记录的唯一性
         * @type {String}
         */
        primaryKey: "",
        /**
         * 最大可选项数
         * 0表示不受限
         * @type {Number}
         */
        maxItems: 0,
        /**
         * 静态数据源
         * @type {Array}
         */
        items: null,
        /**
         * 刷新控件时额外的查询参数
         * @type {Object}
         */
        params: {},
        /**
         * 列表项使用的自定义渲染器（回调函数）
         * 传递参数为当前列表项，回调需返回渲染后的DOM片段或文本值，否则按默认文本处理
         * @type {Function}
         */
        itemRenderer: fastDev.noop,
        /**
         * 左边待选项数据展示部件（控件）自定义配置
         * 默认为列表控件
         * @type {Object} obj 部件配置对象
         * @param {String} obj.type 控件类型，可为控件的全类型名或者别名
         * @param {String|Function} obj.onGetSelectedItems 获取控件已选中项的方法名，或者自定义一个函数来返回控件已选择项（this指向对应的控件类型，如：type为Tree，则this为树控件，下同）
         * @param {String|Function} obj.onGetAllItems 获取控件所有可选项的方法名，或者自定义一个函数来返回控件的所有可选项
         * @param {String|Function} obj.onRemoveItems 控件移除指定列表项的方法名，或者自定义一个函数来移除控件值项，传递参数为被移除的项列表（数组）
         * @param {String|Function} obj.onAddItems 控件添加指定列表项的方法名，或者自定义一个函数来添加控件值项，传递参数为被添加的项列表（数组）
         * @param {String|Function} [obj.onRefresh] 刷新控件的方法名或者自定义一个函数，传递参数为查询参数
         * @param {Object} obj.options 控件配置对象
         */
        leftWidget: null,
        /**
         * 右边已选项数据展现部件（控件）自定义配置
         * 默认为列表控件
         * @type {Object} obj 部件配置对象
         * @param {String} obj.type 控件类型，可为控件的全类型名或者别名
         * @param {String|Function} obj.onGetSelectedItems 获取控件已选中项的方法名，或者自定义一个函数来返回控件已选择项（this指向对应的控件类型，如：type为Tree，则this为树控件，下同）
         * @param {String|Function} obj.onGetAllItems 获取控件所有可选项的方法名，或者自定义一个函数来返回控件的所有可选项
         * @param {String|Function} obj.onRemoveItems 控件移除指定列表项的方法名，或者自定义一个函数来移除控件值项，传递参数为被移除的项列表（数组）
         * @param {String|Function} obj.onAddItems 控件添加指定列表项的方法名，或者自定义一个函数来添加控件值项，传递参数为被添加的项列表（数组）
         * @param {String|Function} [obj.onGetValue] 控件的"getValue"取值性质的方法名或者函数
         * @param {String|Function} [obj.onGetText] 控件的"getText"取文本值性质的方法名或者函数
         * @param {String|Function} [obj.onGetItems] 控件的"getItems"取值对象性质的方法名或者函数
         * @param {String|Function} [obj.onMoveUp] 控件的"moveUp"上移记录性质的方法名或者函数
         * @param {String|Function} [obj.onMoveDown] 控件的"moveDown"下移记录性质的方法名或者函数
         * @param {Object} obj.options 控件配置对象
         */
        rightWidget: null,
        /**
         * 中部区域操作按钮自定义配置（按钮控件的配置对象）
         * 所有按钮的点击回调事件中，this指向按钮控件，回调函数的参数依次为event（事件对象）、chooselist（当前ChooseList实例）
         * 以下本控件的方法可以在按钮点击的回调里面调用来响应用户操作
         * <p>- select(items) 选取操作，如果未传递参数，则控件会默认去获取用户已选择的项（建议不传递参数由控件内部自动去获取值）</p>
         * <p>- selectAll() 全部选取操作</p>
         * <p>- deselect(items) 取消选取操作，如果未传递参数，则控件会默认去获取需取消的的项（建议不传参数由控件内部自动去获取值）</p>
         * <p>- deselectAll() 全部取消选取操作</p>
         * 也可以在按钮配置中，声明name属性值为以上函数名，其点击事件自动绑定至对应的函数。
         * @type {Array}
         */
        buttons: null,
        /**
         * 选取前的回调
         * 传递参数为拟选记录对象
         * this指向当前控件实例
         * 返回false则放弃选取该项
         * @type {Function}
         * @event
         */
        onBeforeSelect: fastDev.noop,
        /**
         * 选取后的事件回调
         * 传递参数为此次选取的记录的集合（数组）
         * this指向当前控件实例
         * @type {Function}
         * @event
         */
        onAfterSelect: fastDev.noop,
        /**
         * 取消选取前的回调
         * 传递参数为待撤销选取的记录对象
         * this指向当前控件实例
         * 返回false值则放弃取消操作
         * @type {Function}
         * @event
         */
        onBeforeDeselect: fastDev.noop,
        /**
         * 取消选取后的回调
         * 传递参数为此次撤销选取的记录的集合（数组）
         * this指向当前控件实例
         * @type {Function}
         * @event
         */
        onAfterDeselect: fastDev.noop,
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
        enableDataSet: false
    },
    /**
     * 静态模板
     * @param {Object} params 模板参数
     * @private 
     */
    staticTemplate: function (params) {
        return [
            '<div class="ui-form ui-chooselist" style="height:' + params.listHeight + '">',
            '<div class="ui-chooselist-float">',
            '<div id="chooselist-lefttop-' + params.sequence + '" style="display:none;width:' + params.leftTplWidth + ';height:' + params.leftTopHeight + ';overflow-x:hidden;">' + params.leftTop + '</div>',
            '<div id="chooselist-left-' + params.sequence + '" style="width:' + params.leftWidth + ';height:' + params.leftHeight + '" class="ui-chooselist-list ' + params.leftCls + '"></div>',
            '<div id="chooselist-leftbottom-' + params.sequence + '" style="display:none;width:' + params.leftTplWidth + ';height:' + params.leftBottomHeight + ';overflow-x:hidden;">' + params.leftBottom + '</div>',
            '</div>',
            '<div class="ui-chooselist-panel ui-chooselist-float ' + params.centerCls + '" style="height:' + params.listHeight + ';width:' + params.centerWidth + '">',
            '<div class="ui-chooselist-block">', '<div id="chooselist-center-' + params.sequence + '" class="ui-chooselist-tools"></div>',
            '</div>',
            '</div>',
            '<div class="ui-chooselist-float">',
            '<div id="chooselist-righttop-' + params.sequence + '" style="display:none;width:' + params.rightTplWidth + ';height:' + params.rightTopHeight + ';overflow-x:hidden;">' + params.rightTop + '</div>',
            '<div id="chooselist-right-' + params.sequence + '" style="width:' + params.rightWidth + ';height:' + params.rightHeight + '" class="ui-chooselist-list ' + params.rightCls + '"></div>',
            '<div id="chooselist-rightbottom-' + params.sequence + '" style="display:none;width:' + params.rightTplWidth + ';height:' + params.rightBottomHeight + ';overflow-x:hidden;" >' + params.rightBottom + '</div>',
            '</div>',
            '</div>'].join("");
    },
    tplParam: ["sequence", "listHeight", "leftWidth", "rightWidth", "leftHeight", "rightHeight", "centerWidth", "leftTplWidth", "leftTopHeight", "leftBottomHeight", "rightTopHeight", "rightBottomHeight", "rightTplWidth", "leftCls", "centerCls", "rightCls", "leftTop", "leftBottom", "rightTop", "rightBottom"],
    /**
     * 参数准备
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有参数
     * @protected
     */
    ready: function (options, global) {
        var fn = fastDev.Util.StringUtil.stripUnits,
            // 容器的内容宽度
            width = options.container.width(),
            height = fn(options.height, options.container.height()) || 150;
        global.sequence = fastDev.getID();
        global.listHeight = height + "px";
        fastDev.apply(options, {
            // 整个控件的高度（包括边框）
            height: height,
            id: options.id || fastDev.getID() + "",
            // 不包括边框的宽度
            leftWidth: (parseInt(options.leftWidgetWidth, 10) || ((fn(options.leftWidth, width) || 122) - 2)) + "px", //2px的边框
            centerWidth: ((fn(options.centerWidth, width) || 77) - 30) + "px", //30px的外边距
            buttonWidth: options.buttonWidth === "auto" ? "auto" : ((fn(options.buttonWidth, width) || 52) - 7) + "px", //7px的外边距加边框
            // 不包括边框的宽度
            rightWidth: (parseInt(options.rightWidgetWidth, 10) || ((fn(options.rightWidth, width) || 122) - 2)) + "px", //2px的边框
            leftWidget: fastDev.isPlainObject(options.leftWidget) ? options.leftWidget : {},
            rightWidget: fastDev.isPlainObject(options.rightWidget) ? options.rightWidget : {},
            maxItems: (options.maxItems && !isNaN(parseInt(options.maxItems, 10))) ? parseInt(options.maxItems, 10) : Infinity,
            params: fastDev.isPlainObject(options.params) ? options.params : {},
            saveInstance: true
        });
        options.leftWidget.name = "left";
        options.leftWidget.options = fastDev.isPlainObject(options.leftWidget.options) ? options.leftWidget.options : {};
        options.rightWidget.name = "right";
        options.rightWidget.options = fastDev.isPlainObject(options.rightWidget.options) ? options.rightWidget.options : {};
        fastDev.each(["onBeforeSelect", "onAfterSelect", "onBeforeDeselect", "onAfterDeselect", "itemRenderer"], function (i, name) {
            options[name] = typeof options[name] === "function" ? options[name] : fastDev.noop;
        });
        fastDev.apply(options, {
            leftTopHeight: (fn(options.leftTopHeight, height) || 0) + "px",
            leftBottomHeight: (fn(options.leftBottomHeight, height) || 0) + "px",
            rightTopHeight: (fn(options.rightTopHeight, height) || 0) + "px",
            rightBottomHeight: (fn(options.rightBottomHeight, height) || 0) + "px",
            // 绝对宽度
            leftTplWidth: (parseInt(options.leftWidth, 10) + 2) + "px",
            rightTplWidth: (parseInt(options.rightWidth, 10) + 2) + "px"
        });
        options.leftWidgetWidth = options.leftWidth;
        options.rightWidgetWidth = options.rightWidth;
        // 初始计算时，减2px边框
        options.leftHeight = (parseInt(options.leftWidgetHeight, 10) || Math.max((height - 2 - (parseInt(options.leftTopHeight, 10) || 0) - (parseInt(options.leftBottomHeight, 10) || 0)), 0)) + "px";
        options.rightHeight = (parseInt(options.rightWidgetHeight, 10) || Math.max((height - 2 - (parseInt(options.rightTopHeight, 10) || 0) - (parseInt(options.rightBottomHeight, 10) || 0)), 0)) + "px";
        if (options.leftWidget.options && typeof options.leftWidget.options.dataSource === "string") {
            options.dataSource = options.leftWidget.options.dataSource;
        }
        global.widgets = {};
        // 保存已选值主键，用于判断数据是否已被选取
        global.keyMap = {};
        // 已选记录数
        global.size = 0;
        // 用于缓存当前待选数据
        global.datas = [];
    },
    /**
     * 构造控件
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有参数
     * @protected
     */
    construct: function (options, global) {
        var sequence = global.sequence;
        fastDev.apply(global, {
            left: this.find("[id='chooselist-left-" + sequence + "']"),
            leftTop: this.find("[id='chooselist-lefttop-" + sequence + "']"),
            leftBottom: this.find("[id='chooselist-leftbottom-" + sequence + "']"),
            center: this.find("[id='chooselist-center-" + sequence + "']"),
            right: this.find("[id='chooselist-right-" + sequence + "']"),
            rightTop: this.find("[id='chooselist-righttop-" + sequence + "']"),
            rightBottom: this.find("[id='chooselist-rightbottom-" + sequence + "']")
        });
        fastDev.each(["leftTop", "leftBottom", "rightTop", "rightBottom"], function (idx, name) {
            options[name + "Height"] = !! options[name + "Element"] ? global[name].outerHeight(true) : 0;
        });
        if (!fastDev.getInstance(options.id)) {
            fastDev.Core.ControlBus.saveInstance(options.id, this);
        }
    },
    /**
     * 初始控件
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有参数
     * @protected
     */
    init: function (options, global) {
        if (options.dataSource && typeof options.dataSource === "string") {
            this.dataProxy = fastDev.create("Proxy", {
                url: options.dataSource,
                onAfterLoad: fastDev.setFnInScope(this, this.setValue)
            });
        }
        // 初始化按钮
        this.initButtons(options.buttons);
        // 初始化左部数据展现部件
        this.initWidget(options.leftWidget);
        // 初始化右部数据展现部件
        this.initWidget(options.rightWidget);
        // 初始自定义模板区域
        this.initTemplate();
        if (options.leftWidget.isNotDefaultContainer || options.rightWidget.isNotDefaultContainer) {
            this.hide();
        } else {
            var that = this;
            fastDev(function () {
                that.setLoading( !! options.leftWidget.options.initSource);
            });
        }
    },
    /**
     * 刷新已选数据
     * @param {Object} widget 部件配置对象
     * @private 
     */
    refreshData: function (widget) {
        var options = this._options,
            global = this._global;
        global.widgets[widget.id] = widget;
        widget.initialized = true;
        if (options.leftWidget.initialized && options.rightWidget.initialized) {
            global.initialized = true;
            if ( !! options.dataSource) {
                this.dataRefresh();
                global.initSource = options.initSource;
                global.dataSource = options.dataSource;
                options.initSource = "";
                options.dataSource = "";
            }
        }
    },
    /**
     * 显示与隐藏数据加载图标
     * @param {Boolean} show 为false值时隐藏加载图标，为null时关闭加载图标，否则显示加载图标
     * @param {Boolean} [extra] 是否是额外的数据展现控件
     * @private 
     */
    setLoading: function (show, extra) {
        var options = this._options,
            global = this._global;
        if (options.showLoading && !extra) {
            if (!fastDev.isComponent(global.loading)) {
                global.loading = fastDev.create("ProgressBar", {
                    opacity: 0.02,
                    display: false,
                    container: global.left,
                    text: options.loadingMsg,
                    zIndex: parseInt(options.zIndex, 10) || 2012
                });
            }
            window.setTimeout(function () {
                global.loading[show === null ? "close" : show === false ? "hide" : "show"]();
            }, 100);
        }
        return this;
    },
    /**
     * 初始化按钮
     * @param {Array} buttons 按钮组
     * @private
     */
    initButtons: function (buttons) {
        var options = this._options,
            global = this._global,
            btn, name;
        if (options.showFunctionBtn) {
            buttons = buttons ? fastDev.isArray(buttons) ? buttons : [buttons] : [{
                    text: ">",
                    tips: "选取",
                    name: "select"
                }, {
                    text: ">>",
                    tips: "全部选取",
                    name: "selectAll"
                }, {
                    text: "<",
                    tips: "移除",
                    name: "deselect"
                }, {
                    text: "<<",
                    tips: "全部移除",
                    name: "deselectAll"
                }
            ];
            for (var i = 0; i < buttons.length; i++) {
                btn = buttons[i];
                btn.container = fastDev("<div/>").appendTo(global.center);
                // 按钮右外边距加边框有7px
                btn.width = btn.width || options.buttonWidth;
                btn.onclick = this.getBtnCallback(btn.name, btn.onclick);
                buttons[i] = fastDev.create("Button", btn);
            }
            options.buttons = buttons;
        }
    },
    /**
     * 获取按钮的回调
     * @param {String} name 按钮名
     * @param {Function} fn 用户声明的回调
     * @private 
     */
    getBtnCallback: function (name, fn) {
        var that = this;
        return typeof fn === "function" ? function (event) {
            fn.call(this, event, that);
        } : /^selectAll|deselectAll|select|deselect|moveUp|moveDown$/i.test(name) ? function () {
            that[name]();
        } : fastDev.noop;
    },
    /**
     * 初始化数据展现部件
     * @param {Object} widget 部件配置对象
     * @private
     */
    initWidget: function (widget) {
        var that = this,
            options = this._options,
            global = this._global,
            container = widget.options.container;
        container = !! container ? fastDev(fastDev.isString(container) ? "#" + container : container) : global[widget.name];
        widget.options.container = container.hasElem() ? container : global[widget.name];
        if (container !== global[widget.name]) {
            global[widget.name].hide();
            widget.isNotDefaultContainer = true;
        }
        if ( !! widget.widgetElement) {
            widget.options.container.append(widget.widgetElement);
        } else {
            widget.type = !! widget.type ? widget.type : "ChooseList.ComboList";
            widget.options.items = widget.options.items || (widget.name === "left" ? options.items : null);
            widget.component = fastDev.create(widget.type, this.initPredefine(options, widget));
        }
        if (widget.type === "DataGrid" || widget.type === "fastDev.Ui.DataGrid") {
            global[widget.name].css("border", "none");
        }
    },
    /**
     * 初始预定义控件回调方法
     * @param {Object} options 控件配置对象
     * @param {Object} widget 部件配置对象
     * @return {Object} settings 部件用户配置对象
     * @private
     */
    initPredefine: function (options, widget) {
        var uuid = fastDev.getID(),
            name = widget.name,
            settings = widget.options;
        options.id = options.id || (fastDev.getID() + "");
        widget.id = fastDev.getID() + "";
        if (!widget.isNotDefaultContainer) {
            var fn = fastDev.Util.StringUtil.stripUnits;
            fastDev.apply(settings, {
                width: options[name + "WidgetWidth"] || ((parseInt(options[name + "Width"], 10) || 122) - 2 + "px"),
                height: options[name + "WidgetHeight"] || (Math.max((fn(options.height, fastDev(typeof options.container === "string" ? "#" + options.container : options.container).height()) || 150) - 2 - (parseInt(options[name + "TopHeight"], 10) || 0) - (parseInt(options[name + "BottomHeight"], 10) || 0), 0) + "px")
            });
            options[name + "WidgetWidth"] = settings.width;
            options[name + "WidgetHeight"] = settings.height;
        }
        settings.initSource = settings.initSource || (widget.name === "left" ? options.initSource : "");
        // fastDev.apply(settings, {
        // initSource: settings.initSource || (widget.name === "left" ? options.initSource : ""),
        // dataSource: settings.dataSource || (widget.name === "left" ? options.dataSource : "")
        // });
        // 若以后需要内置新的控件定义，到下面的case语句后添加即可
        switch (widget.type) {
            case "Tree":
            case "fastDev.Ui.Tree":
                this.initTreeWidget(options, widget);
                break;
            case "DataGrid":
            case "fastDev.Ui.DataGrid":
                this.initDataGridWidget(options, widget);
                break;
            default:
                this.initComboListWidget(options, widget);
        }
        settings.enableDataProxy = false;
        var onAfterInitRender = settings.onAfterInitRender || fastDev.noop,
            onAfterInit = settings.onAfterInit || fastDev.noop;
        fastDev.apply(settings, {
            onAfterInit: function () {
                this.widgetName = widget.name + "Widget";
                this.widgetSettings = widget;
                widget.component = this;
                onAfterInit.call(this);
                if (!settings.initSource && !widget.initialized) {
                    fastDev.getInstance(options.id).refreshData(widget);
                }
            },
            onAfterInitRender: function () {
                var that = fastDev.getInstance(options.id);
                if (widget.name === "left") {
                    that.setLoading(false, widget.extraWidget);
                }
                onAfterInitRender.call(this);
                that.refreshData(widget);
            }
        });
        if (widget.mode === "html") {
            window["onAfterInitRender" + uuid] = settings.onAfterInitRender;
            settings.onAfterInitRender = "onAfterInitRender" + uuid + "()";
            window["onAfterInit" + uuid] = settings.onAfterInit;
            settings.onAfterInit = "onAfterInit" + uuid + "()";
        }
        return settings;
    },
    /**
     * 初始化列表部件定义
     * @param {Object} options 控件配置对象
     * @param {Object} widget 部件配置对象
     * @private
     */
    initComboListWidget: function (options, widget) {
        var settings = widget.options,
            isLeft = widget.name === "left";
        fastDev.apply(widget, {
            textField: widget.textField || "text",
            valueField: widget.valueField || options.primaryKey || "value",
            onGetSelectedItems: "getSelectedItems",
            onGetAllItems: "getItems",
            onRemoveItems: "removeItems",
            onAddItems: "addItems",
            onGetValue: "getValue",
            onGetText: "getText",
            onGetItems: "getItems",
            onRefresh: "initRefresh",
            onMoveUp: function () {
                this.move(true);
            },
            onMoveDown: function () {
                this.move();
            }
        });
        fastDev.apply(settings, {
            enableDataProxy: false,
            enableInitProxy: isLeft,
            autoLoad: isLeft,
            maxItems: isLeft ? 0 : options.maxItems,
            itemRenderer: options.itemRenderer,
            onDoubleClick: function (event, item) {
                fastDev.getInstance(options.id)[isLeft ? "select" : "deselect"](item);
            },
            fields: settings.fields || [{
                    name: widget.textField,
                    mapping: "text"
                }, {
                    name: widget.valueField,
                    mapping: "value"
                }
            ]
        });
    },
    /**
     * 初始化表格部件定义
     * @param {Object} options 控件配置对象
     * @param {Object} widget 部件配置对象
     * @private
     */
    initDataGridWidget: function (options, widget) {
        var settings = widget.options;
        fastDev.apply(widget, {
            isCopy: widget.name === "left" && widget.isCopy,
            onGetSelectedItems: widget.onGetSelectedItems || function () {
                return this.getValue();
            },
            onGetAllItems: widget.onGetAllItems || function () {
                return this.getAllValue();
            },
            onRemoveItems: widget.onRemoveItems || function (items) {
                var list = fastDev.getInstance(options.id),
                    item, key;
                while (item = items.shift()) {
                    key = list.getPrimaryValue(item);
                    if (widget.isCopy) {
                        this.cleanSelected(key);
                        this.enableChooseBox(key);
                    } else {
                        this.delRow(key);
                    }
                }
                this.find("input[name='dg_checkbox_all']").prop("checked", false);
                if (widget.name === "left") {
                    this._options.onAfterInitRender.call(this);
                }
            },
            onAddItems: widget.onAddItems || function (items) {
                var list = fastDev.getInstance(options.id),
                    item, key;
                while (item = items.shift()) {
                    key = list.getPrimaryValue(item);
                    if (widget.isCopy || widget.name === "left" && this.getValueByText(key, settings.keyword).length) {
                        this.cleanSelected(key);
                        this.enableChooseBox(key);
                    } else {
                        this.addRow(item, false);
                    }
                }
                this.find("input[name='dg_checkbox_all']").prop("checked", false);
                if (widget.name === "left") {
                    this._options.onAfterInitRender.call(this);
                }
            },
            onGetValue: widget.onGetValue || function () {
                var list = fastDev.getInstance(options.id),
                    items = [].concat(this.getAllValue()),
                    values = [],
                    item;
                while (item = items.shift()) {
                    values.push(list.getPrimaryValue(item));
                }
                return values.join(",");
            },
            onGetText: widget.onGetText || "getAllValue",
            onGetItems: widget.onGetItems || "getAllValue",
            onRefresh: widget.onRefresh || function (config) {
                this.refreshData(config.urlParam);
            }
        });
        if (widget.name === "right") {
            settings.pagePosition = "none";
            settings.showCheckColumn = true;
            settings.keyword = settings.keyword || options.primaryKey || "";
        } else {
            fastDev.apply(settings, {
                allowAutoFillRow: false,
                showCheckColumn: true,
                keyword: settings.keyword || options.primaryKey || "",
                onAfterInitRender: function () {
                    var list = fastDev.getInstance(options.id),
                        items = [].concat(this.getAllValue()),
                        item;
                    while (item = items.shift()) {
                        if (list.isSelected(item)) {
                            this.setSelected(list.getPrimaryValue(item));
                        }
                    }
                    this.find("[name='dg_choose']:checked").each(function (elem) {
                        fastDev(elem).prop("disabled", "disabled");
                    });
                }
            });
        }
    },
    /**
     * 初始化树部件定义
     * @param {Object} options 控件配置对象
     * @param {Object} widget 部件配置对象
     * @private
     */
    initTreeWidget: function (options, widget) {
        var settings = widget.options;
        fastDev.apply(widget, {
            onlyLeaf: (widget.onlyLeaf === undefined && settings.onlySelectedLeaf === undefined) ? true : widget.onlyLeaf || settings.onlySelectedLeaf,
            onGetSelectedItems: widget.onGetSelectedItems || function () {
                if (!settings.mTreeShowCkb) {
                    var tree = this,
                        nodes = [];
                    fastDev.each(this.getSelectedIds(), function (idx, id) {
                        nodes.push(tree.getNodeByid(id));
                    });
                    return nodes;
                } else {
                    return this.getValues(widget.onlyLeaf ? "chkedLeafNodesArray" : "chkedNodesArray");
                }
            },
            onGetAllItems: widget.onGetAllItems || function () {
                return this[widget.onlyLeaf ? "getAllLeafItems" : "getItems"]();
            },
            onRemoveItems: widget.onRemoveItems || function (items) {
                var list = fastDev.getInstance(options.id),
                    branches = {},
                    tree = this,
                    branch, node;
                fastDev.each(items, function (i, item) {
                    if (!tree.isLeaf(item.id)) {
                        list.select(tree.getNodesByPid(item.id) || []);
                    } else {
                        // branches[tree.getParentid(item.id)] = true;
                    }
                    tree.unCheckedById(item.id);
                    tree.hideNode(item.id);
                });
                // 复选框禁用样式不对
                // isHideNode判断有误
                // for (branch in branches) {
                // var children = tree.getNodesByPid(branch) || [];
                // while (node = children.shift()) {
                // if (!tree.isHideNode(node.id)) {
                // branch = false;
                // break;
                // }
                // }
                // if ( !! branch) {
                // tree.disableChk(branch);
                // }
                // }
            },
            onAddItems: widget.onAddItems || function (items) {
                var list = fastDev.getInstance(options.id),
                    tree = this,
                    parent;
                fastDev.each(items, function (i, item) {
                    tree.unCheckedById(item.id);
                    tree.showNode(item.id);
                    if ( !! (parent = tree.getNodeByid(tree.getParentid(item.id))) && list.isSelected(parent)) {
                        list.deselect(parent);
                        tree.setExpand(parent.id);
                    }
                });
            },
            onRefresh: widget.onRefresh || "reLoad"
        });
        fastDev.apply(settings, {
            treeType: "multitree",
            enabledInitProxy: true,
            mTreeShowCkb: settings.mTreeShowCkb === undefined ? true : settings.mTreeShowCkb,
            onlySelectedLeaf: !! widget.onlyLeaf,
            onExpand: function (id) {
                var list = fastDev.getInstance(options.id),
                    tree = this,
                    nodes = tree.getNodesByPid(id);
                fastDev.each(fastDev.isArray(nodes) ? nodes : [nodes], function (i, node) {
                    if (tree.isLeaf(node.id) && list.isSelected(node)) {
                        tree.hideNode(node.id);
                    }
                });
            },
            onNodeDblClick: function (id) {
                if (this.isLeaf(id)) {
                    fastDev.getInstance(options.id).select(this.getNodeByid(id));
                    this.unCheckedById(id);
                    this.hideNode(id);
                }
            }
        });
        // html构建模式，则需在全局命名空间生成代理函数（控件的用户配置回调）
        if (widget.mode === "html") {
            var uuid = fastDev.getID();
            window["onExpand" + uuid] = settings.onExpand;
            settings.onExpand = "onExpand" + uuid + "()";
            window["onNodeDblClick" + uuid] = settings.onNodeDblClick;
            settings.onNodeDblClick = "onNodeDblClick" + uuid + "()";
        }
        if (widget.name === "left") {
            options.primaryKey = options.primaryKey || "id";
        }
    },
    /**
     * 初始化自定义模板
     * @private
     */
    initTemplate: function () {
        var options = this._options,
            global = this._global;
        fastDev.each(["leftTop", "leftBottom", "rightTop", "rightBottom"], function (i, name) {
            if ( !! options[name + "Element"]) {
                global[name].append(options[name + "Element"]).removeCss("display");
            }
        });
    },
    /**
     * 获取记录的主键值
     * @param {Object} item 值对象
     * @param {Object} [field] 映射字段
     * @return {String} key
     * @private
     */
    getPrimaryValue: function (item, field) {
        var key = "";
        if ( !! item || item === 0) {
            field = field || this._options.primaryKey || "value";
            if (fastDev.isPlainObject(item) || typeof item === "object") {
                key = item[field];
            } else {
                key = item;
            }
        }
        return fastDev.Util.StringUtil.trim(key + "");
    },
    /**
     * 操作控件进行增删操作
     * @param {String} name left或right
     * @param {Object} items 值项
     * @private
     */
    doSelect: function (name, items) {
        var that = this,
            options = this._options,
            global = this._global,
            widget = options[name + "Widget"],
            size = name === "left" ? global.size : -9999999;
        if (size < options.maxItems && !! (items = items ? items : this.doCallback(widget.component, widget.onGetSelectedItems))) {
            var array = [];
            fastDev.each(fastDev.isArray(items) ? items : [items], function (idx, item) {
                if ( !! item && size < options.maxItems && (name === "left" ? !that.isSelected(item) : that.isSelected(item)) && options[name === "left" ? "onBeforeSelect" : "onBeforeDeselect"].call(that, item) !== false) {
                    global.keyMap[that.getPrimaryValue(item)] = name === "left";
                    array.push(item);
                    size++;
                }
            });
            if ( !! array.length) {
                global.size += (array.length * (name === "left" ? 1 : -1));
                fastDev.each(global.widgets, function (id, wigt) {
                    try {
                        that.doCallback(wigt.component, wigt[name === "left" ? (wigt.name === "left" ? "onRemoveItems" : "onAddItems") : (wigt.name === "left" ? "onAddItems" : "onRemoveItems")], array.slice(0));
                    } catch (e) {}
                });
                global.hasChanged = true;
                options[name === "left" ? "onAfterSelect" : "onAfterDeselect"].call(that, array);
            }
        }
        return this;
    },
    /**
     * 执行回调函数
     * @param {fastDev.Ui.Component} obj
     * @param {Function|String} func
     * @param {Object} args
     * @return {Object}
     * @private
     */
    doCallback: function (obj, func, args) {
        if (typeof func === "function") {
            return func.call(obj, args);
        } else if (fastDev.isString(func) && typeof obj[func] === "function") {
            return obj[func](args);
        } else {
            throw "未知的回调函数(" + func + ")";
        }
    },
    /**
     * 判断某项是否已被选取
     * 将根据primaryKey主键字段配置来判断
     * @param {Object} item 待测项（记录对象或者记录的主键值）
     * @return {Boolean}
     */
    isSelected: function (item) {
        return !!this._global.keyMap[this.getPrimaryValue(item)];
    },
    /**
     * 执行选取
     * @param {Array} [items] 要选择的项，若未指定则控件自动获取拟选项
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    select: function (items) {
        return this.doSelect("left", items);
    },
    /**
     * 选取所有值
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    selectAll: function () {
        var left = this._options.leftWidget;
        return this.select(this.doCallback(left.component, left.onGetAllItems) || []);
    },
    /**
     * 取消选取
     * @param {Array} [items] 要取消的项，若未指定则控件自动获取拟取消选取的项
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    deselect: function (items) {
        return this.doSelect("right", items);
    },
    /**
     * 全部取消选取
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    deselectAll: function () {
        var right = this._options.rightWidget;
        return this.deselect(this.doCallback(right.component, right.onGetAllItems) || []);
    },
    /**
     * 获取已选择项的有效值
     * @return {Object} 控件值
     */
    getValue: function () {
        var right = this._options.rightWidget;
        return this.doCallback(right.component, right.onGetValue || "getValue");
    },
    /**
     * 获取已选择项的文本值
     * @return {Object} 控件文本值
     */
    getText: function () {
        var right = this._options.rightWidget;
        return this.doCallback(right.component, right.onGetText || "getText");
    },
    /**
     * 获取已选值对象数组
     * @return {Array} 控件值对象数组
     */
    getItems: function () {
        var right = this._options.rightWidget;
        return this.doCallback(right.component, right.onGetItems || "getItems") || [];
    },
    /**
     * 获取待选值对象数组
     * @param {fastDev.Ui.Component} [context] 数据的来源控件实例（可选参数，默认为当前使用的待选数据展现控件）
     * @return {Array} 待选值对象数组
     */
    getData: function (context) {
        var global = this._global,
            data = !! context ? [] : global.hasChanged ? [] : global.datas.slice(0),
            items, item, mark;
        if (!data.length) {
            fastDev.each( !! context ? this._global.widgets : [], function (id, widget) {
                if (context === widget.component) {
                    context = widget;
                    return !(mark = true);
                }
            });
            context = mark ? context : this._options.leftWidget;
            items = [].concat(this.doCallback(context.component, context.onGetAllItems));
            while (item = items.shift()) {
                if (!this.isSelected(item)) {
                    data.push(item);
                }
            }
            global.datas = !! context ? [] : data.slice(0);
            global.hasChanged = false;
        }
        return data;
    },
    /**
     * 设置值
     * @param {Object} value 可以为非文本值
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    setValue: function (value) {
        if (this._global.initialized && value) {
            this.select(value);
        }
        return this;
    },
    /**
     * 上移选中的记录
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    moveUp: function () {
        var right = this._options.rightWidget;
        this.doCallback(right.component, right.onMoveUp || "moveUp");
        return this;
    },
    /**
     * 下移选中的记录
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    moveDown: function () {
        var right = this._options.rightWidget;
        this.doCallback(right.component, right.onMoveDown || "moveDown");
        return this;
    },
    /**
     * 获取当前使用的左侧控件实例
     * @return {fastDev.Ui.Component}
     */
    getLeftWidget: function () {
        return this._options.leftWidget.component;
    },
    /**
     * 获取当前使用的右侧控件实例
     * @return {fastDev.Ui.Component}
     */
    getRightWidget: function () {
        return this._options.rightWidget.component;
    },
    /**
     * 设置数据展现控件实例
     * @param {fastDev.Ui.Component} widget 参数必须为使用createWidget()方法初始化出的控件实例
     * @return {fastDev.Ui.ChooseList}
     */
    setWidget: function (widget) {
        if (fastDev.isComponent(widget) && /^(left|right)Widget/.test(widget.widgetName)) {
            var options = this._options,
                global = this._global;
            options[widget.widgetName].component.hide();
            options[widget.widgetName] = widget.widgetSettings;
            global.widgets[widget.widgetSettings.id] = widget.widgetSettings;
            if (!widget.widgetSettings.isNotDefaultContainer) {
                global[widget.widgetSettings.name][widget.alias === "DataGrid" ? "css" : "removeCss"]("border", "none");
            }
            widget.show();
            global.hasChanged = true;
        } else {
            throw "参数无效（仅接受使用ChooseList控件的createWidget方法创建出的控件实例）.";
        }
        return this;
    },
    /**
     * 刷新左边区域控件的值
     * @param {Object} config 请求参数配置对象(plain object)
     * @param {String} [config.url] 请求链接，默认为initSource属性值
     * @param {Object} [config.param] 查询参数对象(plain object)，键值对
     * @param {Object} [config.data] 使用的静态数据
     * @param {Boolean} cleanSelected 是否在刷新前清理右边已选数据
     * @return {fastDev.Ui.ChooseList} 本控件实例
     */
    refresh: function (config, cleanSelected) {
        var that = this,
            options = this._options,
            left = options.leftWidget,
            right = options.rightWidget;
        if ( !! cleanSelected) {
            this.doCallback(right.component, right.onRemoveItems, this.doCallback(right.component, right.onGetAllItems) || []);
            this._global.keyMap = {};
        }
        if (!fastDev.isPlainObject(config)) {
            config = {};
        }
        if (fastDev.isPlainObject(config.param)) {
            fastDev.apply(options.params, config.param);
        }
        config.url = config.url || left.options.initSource;
        config.urlParam = options.params;
        fastDev(function () {
            that.setLoading(true, !config.url);
        });
        this.doCallback(left.component, left.onRefresh || "initRefresh", config);
        return this;
    },
    /**
     * 创建一个数据展示部件（不传配置时，使用默认的列表控件）
     * 控件使用ChooseList容器时，初始完成后，该控件默认会被隐藏起来
     * @param {Object} [config] 部件配置对象 
     * @param {String} [config.name] left或right值，标明需放置在左边（待选）或右边（已选） 
     * @param {Object} [config.options] 控件配置对象
     * @return {fastDev.Ui.Component} 控件实例或undefined（创建失败时）
     */
    createWidget: function (config) {
        var options = this._options,
            widget;
        if (!fastDev.isPlainObject(config)) {
            config = {};
        }
        fastDev.apply(config, {
            extraWidget: true,
            name: (config.name === "left" || config.name === "right") ? config.name : "left",
            type: config.type || "ChooseList.ComboList",
            options: fastDev.isPlainObject(config.options) ? config.options : {}
        });
        if (!config.options.container) {
            config.options.container = this._global[config.name];
        } else {
            config.isNotDefaultContainer = true;
        }
        (widget = fastDev.create(config.type, this.initPredefine(options, config)))[config.isNotDefaultContainer ? "show" : "hide"]();
        return widget;
    },
    /**
     * 获取当前已选记录数
     * @return {Number} 当前已选记录的数目 
     */
    getSize: function () {
        return this._global.size;
    }
});
// 内部子控件
fastDev.define("fastDev.Ui.ChooseList.ComboList", {
    alias: "ChooseList.ComboList",
    extend: "fastDev.Ui.Component",
    _options: {
        width: "",
        height: "",
        multiple: true,
        maxItems: 0,
        itemRenderer: fastDev.noop,
        onDoubleClick: fastDev.noop,
        onItemClick: fastDev.noop,
        onItemMouseOver: fastDev.noop,
        onItemMouseOut: fastDev.noop,
        fields: []
    },
    staticTemplate: function (params) {
        var html = ['<div id="combolist-container-' + params.uuid + '">'];
        html.push('<div class="ui-selectlist-list-ct" style="width:' + params.width + ';height:' + params.height + '">');
        html.push('<ul id="combolist-list-' + params.uuid + '"></ul></div></div>');
        return html.join("");
    },
    dynamicTemplate: function (params, data) {
        var html = [];
        for (var i = 0, item; item = data[i]; i++) {
            html.push('<li class="ui-list-item" name="list' + params.uuid + '" text="' + item.text + '" itemVal="' + item.value + '" item="' + item.item + '">' + item.label + '</li>');
        }
        return html.join("");
    },
    tplParam: ["uuid", "width", "height", "text", "value"],
    fields: ["text", "value", "label", "item"],
    ready: function (options, global) {
        global.uuid = fastDev.getID();
        global.size = 0;
        global.currItems = {};
        options.maxItems = (options.maxItems && fastDev.isNumber(options.maxItems)) ? options.maxItems : Infinity;
    },
    construct: function (options, global) {
        var uuid = global.uuid;
        global.list = this.find("[id='combolist-list-" + uuid + "']");
    },
    init: function (options, global) {
        var that = this,
            uuid = global.uuid;
        global.list.bind("mouseover", function (event) {
            options.onItemMouseOver.call(that, event, that.getListItem(event).addClass("ui-list-over"));
        }).bind("mouseout", function (event) {
            options.onItemMouseOut.call(that, event, that.getListItem(event));
            global.list.find("li.ui-list-over").removeClass("ui-list-over");
        }).bind("click", function (event) {
            var item = that.getListItem(event);
            if (!options.multiple) {
                global.list.find("li.ui-list-selected").removeClass("ui-list-selected");
            }
            item[(item.hasClass("ui-list-selected") ? "remove" : "add") + "Class"]("ui-list-selected");
            options.onItemClick.call(that, event, global.currItems[item.attr("item")]);
        }).bind("dblclick", function (event) {
            global.list.find("li.ui-list-selected").removeClass("ui-list-selected");
            options.onDoubleClick.call(that, event, global.currItems[that.getListItem(event).attr("item")]);
        });
        global.initialized = true;
    },
    constructItems: function () {
        var opts = this._options,
            global = this._global,
            data = this.dataset.select(),
            length = Math.min(data.length, opts.maxItems),
            items = [],
            item, id, label;
        for (var i = 0; i < length; i++) {
            if (label = fastDev.Util.StringUtil.trim(opts.itemRenderer.call(this, {
                text: (item = data[i]).text,
                value: item.value
            }) || item.text)) {
                item.label = label;
                item.item = id = fastDev.getID();
                global.currItems[id] = {
                    value: item.value,
                    text: item.text
                };
                global.size += 1;
                items.push(item);
            }
        }
        this._renderDynamicHtml(global.list, items);
    },
    /*
     * 取value、text、items等
     * @private
     */
    get: function (type) {
        var global = this._global,
            items = [];
        global.list.find("li[name='list" + global.uuid + "']").each(function (item) {
            items.push(fastDev(item).attr(type));
        });
        return items;
    },
    /*
     * 获取dom节点
     * @private
     */
    getListItem: function (event) {
        var uuid = this._global.uuid,
            item = (item = fastDev(event.target)).attr("name") === "list" + uuid ? item : item.parents("li[name='list" + uuid + "']");
        return item;
    },
    /*
     * 获取已选择的项
     * @private
     */
    getSelectedItems: function () {
        var global = this._global,
            uuid = global.uuid,
            items = [];
        global.list.find("li.ui-list-selected[name='list" + uuid + "']").each(function (item) {
            items.push(global.currItems[(item = fastDev(item)).attr("item")]);
        });
        return items;
    },
    /*
     * 判断Element是否在数组中
     * @private
     */
    inArray: function (array, elem) {
        elem = fastDev.isArray(elem.elems) ? elem.elems[0] : elem;
        for (var i = 0; i < array.length; i++) {
            if (elem === (array[i].elems ? array[i].elems[0] : array[i])) {
                return true;
            }
        }
    },
    /*
     * 获取字段映射
     * @private
     */
    getMapping: function (name) {
        var options = this._options,
            fields = options.fields,
            length = fields.length;
        while (length--) {
            if (fastDev.isPlainObject(fields[length]) && fields[length].mapping === name) {
                return fields[length].name;
            }
        }
        return name;
    },
    /*
     * 移除项
     * @return this
     */
    removeItems: function (items) {
        var global = this._global,
            uuid = global.uuid,
            value = this.getMapping("value"),
            id, item;
        items = fastDev.isArray(items) ? items : [items];
        for (var i = 0; i < items.length; i++) {
            if ( !! (item = global.list.find("li[name='list" + uuid + "'][itemVal='" + fastDev.Util.StringUtil.trim(items[i][value] || items[i]) + "']")).elems.length) {
                global.currItems[id = item.attr("item")] = null;
                delete global.currItems[id];
                item.remove();
                global.size -= 1;
            }
        }
        return this;
    },
    /*
     * 添加项
     * @return this
     */
    addItems: function (items) {
        var opts = this._options,
            global = this._global,
            uuid = global.uuid,
            text = this.getMapping("text"),
            value = this.getMapping("value"),
            item, id, html, length;
        items = fastDev.isArray(items) ? items : [items];
        length = Math.min(items.length, opts.maxItems - global.size);
        for (var i = 0; i < length; i++) {
            if (html = fastDev.Util.StringUtil.trim(opts.itemRenderer.call(this, items[i]) || items[i][text] || items[i])) {
                item = fastDev(document.createElement("li")).addClass("ui-list-item").attr("name", "list" + uuid).attr("itemVal", fastDev.Util.StringUtil.trim(items[i][value] || items[i])).attr("text", fastDev.Util.StringUtil.trim(items[i][text] || items[i])).attr("item", id = fastDev.getID()).appendTo(global.list);
                item.elems[0].innerHTML = html;
                global.currItems[id] = items[i];
                global.size += 1;
            }
        }
        return this;
    },
    /*
     * 取得所有项数据对象
     * @return {Array}
     */
    getItems: function () {
        var global = this._global,
            items = this.get("item"),
            data = [];
        for (var i = 0; i < items.length; i++) {
            data.push(global.currItems[items[i]]);
        }
        return data;
    },
    /*
     * 获取值
     * @return {Array}
     */
    getValue: function () {
        return this.get("itemVal").join(",");
    },
    /*
     * 获取文本值
     * @return {Array}
     */
    getText: function () {
        return this.get("text").join(",");
    },
    /*
     * 设置值
     * @param {value}
     */
    setValue: function (value) {
        if (this._global.initialized && value) {
            this.clean();
            this.addItems(value);
        }
        return this;
    },
    /*
     * 清空值
     * @return this
     */
    clean: function () {
        var global = this._global;
        global.currItems = {};
        global.size = 0;
        global.list.empty();
        if ( !! this.dataset) {
            this.dataset.clean();
        }
        return this;
    },
    /*
     * 获取当前控件列表的项数
     */
    getSize: function () {
        return this._global.size;
    },
    /*
     * 移动
     * @param {String} isUp
     * @param {Array} items
     * @param {DomObject|Element} items.item
     */
    move: function (isUp, items) {
        var global = this._global,
            uuid = global.uuid,
            item, prev;
        items = !! items ? items : global.list.find("li.ui-list-selected[name='list" + uuid + "']").elems;
        items = fastDev.isArray(items) ? items : [items];
        items = !isUp ? items.reverse() : items;
        for (var i = 0; i < items.length; i++) {
            if ((item = fastDev(items[i])).hasElem() && (prev = item[isUp ? "prev" : "next"]("li[name='list" + uuid + "']")).hasElem() && !this.inArray(items, prev)) {
                prev[isUp ? "insertAfter" : "insertBefore"](item.replace(prev));
            }
        }
    }
});
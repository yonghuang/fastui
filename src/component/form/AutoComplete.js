/**
 * @class fastDev.Ui.AutoComplete
 * @extends fastDev.Ui.Box
 * @author chengwei
 * <p>AutoComplete控件属检索提示类控件。</p>
 * <p>支持对静态数据源和远程数据源的检索，远程检索结果缓存，关键字高亮，多值输入等。</p>
 * <p>作者：程伟</p>
 *     
 *     <input itype="AutoComplete" initSource="../../data/autocomplete.jsp" 
 *            hintText="输入英文字母查询"/>
 */
fastDev.define("fastDev.Ui.AutoComplete", {
    alias: "AutoComplete",
    extend: "fastDev.Ui.Box",
    _options: {
        /**
         * 远程数据检索链接地址
         * @type {String}
         */
        initSource: null,
        /**
         * 静态的数据项，支持以下数据格式：
         * <p>-String 纯字符串形式，每个值以逗号分隔</p>
         * <p>-Array 数组形式，数组元素可为字符串或者对象</p>
         * <p>-Object 对象形式，作为一条数据处理</p>
         * 注意：若数据格式为纯字符串形式时，逗号会作为单个值的分隔符，若结果串中本身就包含逗号，请使用数组形式的数据格式
         * 数据格式为对象形式时，可带2个有效属性，分别为：
         * <p>-text 展现（标签形式）时的文本值</p>
         * <p>-value 记录的有效值</p>
         * 以上2个对象属性的值若相同，则只需设置一个即可，另外一个属性会以相同值来处理
         * 数据为远程数据时，同样支持以上3种数据格式
         * @type {Array} items
         * @param {Object} items.item 数据项
         * @param {String} items.item.text 标签名
         * @param {String} items.item.value 标签值
         */
        items: null,
        /**
         * 文本输入框的宽度
         * <p>当为多值输入框时，最小宽度为300px、但不会超出容器的宽度。
         * @type {String|Number}
         */
        width: "150px",
        /**
         * 文本输入框的名称
         * @type {String}
         */
        name: "",
        /**
         * 是否禁用该控件
         * @type {Boolean}
         */
        disabled: false,
        /**
         * 是否只读
         * @type {Boolean}
         */
        readonly: false,
        /**
         * 检索结果时使用的查询名
         * @type {String}
         */
        queryName: "q",
        /**
         * 提示层的索引
         * @type {Number}
         */
        zIndex: 200,
        /**
         * 触发关键字查找时的最小输入字符数
         * @type {Number}
         */
        minChars: 1,
        /**
         * 最大显示结果数
         * 0表示不受限
         * @type {Number}
         */
        maxItems: 0,
        /**
         * 未查询到结果时的提示信息
         * 该值有效时才会显示提示信息
         * @type {String}
         */
        noResultsText: "",
        /**
         * 正在搜索时的提示信息
         * 该值有效时才会显示提示信息
         * @type {String}
         */
        searchingText: "",
        /**
         * 提示用户输入以便自动检索的提示信息
         * 该值有效时才会显示提示信息
         * @type {String}
         */
        hintText: "",
        /**
         * 输入框值为空时的默认提示项
         * 属性值可以指定需提示的值项，也可以使用布尔值
         * 为布尔值true时，如果items属性有值，则显示items项
         * 若为布尔值false或者空值，则应用hintText属性指定的提示信息
         * @type {Boolean|Array|String}
         */
        hintItems: false,
        /**
         * 使用远程数据时击键后激活查找请求的延迟时间(单位毫秒)
         * 使用动态数据时，默认为400毫秒
         * 同一关键字查询不会发送二次请求，而是直接从缓存中读取数据，按键延迟与静态数据相同，为10毫秒
         * @type {Number}
         */
        keyDelay: null,
        /**
         * 是否在用户选择时自动将用户当前鼠标所在的值填入到input框
         * @type {Boolean}
         */
        autoFill: true,
        /**
         * 关键字是否大小写敏感
         * @type {Boolean}
         */
        matchCase: false,
        /**
         * 提示结果中是否 高亮显示关键字
         * @type {Boolean}
         */
        keywordHighlight: true,
        /**
         * 高亮关键字的样式名
         * @type {String}
         */
        highlightCls: "",
        /**
         * 连接超时时长
         * 单位毫秒
         * @type {Number}
         */
        connectTimeout: 10000,
        /**
         * 是否检索包含查询关键字的结果，而非仅仅检索以查询关键字开头的结果
         * @type {Boolean}
         */
        matchContains: true,
        /**
         * 按回车时是否默认选取第一个提示结果项
         * @type {Boolean}
         */
        selectFirst: false,
        /**
         * 允许输入多个值时值的限制个数
         * 0表示不受限
         * @type {Number}
         */
        selectionLimit: 0,
        /**
         * 是否允许输入多个值
         * @type {Boolean}
         */
        multiple: false,
        /**
         * 结果提示菜单出现滚动条的最大高度
         * @type {String}
         */
        scrollHeight: "180px",
        /**
         * 是否显示搜索图标
         * @type {Boolean}
         */
        showSearchIcon: false,
        /**
         * 额外添加的查询参数
         * @type {Object}
         */
        extraParams: {},
        /**
         * 多值输入框模式时，当用户输入 ”逗号“，”分号“，”制表键“时，是否允许控件自动创建标签项
         * @type {Boolean}
         */
        allowAutoCreate: false,
        /**
         * 是否允许缓存远程数据
         * @type {Boolean}
         */
        allowCache: true,
        /**
         * 自定义数据字段配置
         * @type {Array}
         */
        fields: null,
        /**
         * 是否在当前页面内展现弹出层
         * <p>该配置属性为false值时，结果弹出层将尝试跨Iframe定位展现
         * @type {Boolean} 
         */
        inside: true,
        /**
         * 自定义下拉面板的弹出位置 ，为以下枚举值：
         * <p>auto   -   由控件根据当前可视区域大小自行设定，默认值
         * <p>up   -   输入框上方
         * <p>down   -   输入框下方
         * @type {String}
         */
        direction: "auto",
        /**
         * 检索结果列表项渲染器
         * 对每个检索值进行自定义处理
         * this指向本控件实例
         * @param {Object} data 数据 数据类型与服务器返回的数据结构相关，可能为String或Object
         * @param {String} keyword 关键字
         * @type {Function}
         */
        itemRenderer: null,
        /**
         * 检索结果渲染器
         * 对整个结果进行渲染而不是逐个渲染
         * this指向本控件实例
         * @type {Function}
         * @param {DomObject} ui 容器
         * @param {Object} data 服务器返回的数据，若该数据为json格式，则已经转换为json对象，否则为原始数据
         * @param {String} keyword 关键字
         */
        resultRenderer: null,
        /**
         * 检索前的事件回调
         * 返回false值则不执行检索
         * this指向本控件实例
         * @type {Function}
         * @param {String} keyword 查询关键字
         * @event
         */
        onBeforeRetrieve: function (keyword) {},
        /**
         * 检索完成时的事件回调
         * 返回false值则不处理检索结果
         * this指向本控件实例
         * @type {Function}
         * @param {Object} data 服务器端返回的检索结果
         * @param {String} keyword 查询关键字
         * @event
         */
        onAfterRetrieve: function (data, keyword) {},
        /**
         * 检索失败时的事件回调
         * this指向本控件实例
         * @type {Function}
         * @param {String} msg 错误消息
         * @event
         */
        onRetrieveError: function (msg) {
            throw msg;
        },
        /**
         * 用户点选结果后的事件回调
         * 返回false值，则放弃此次选取
         * this指向本控件实例
         * @type {Function}
         * @param {Object} item 已选项
         * @event
         */
        onAfterChoose: function (item) {},
        /**
         * 输入框上回车输入事件
         * 参数为输入框的当前值
         * this指向本控件实例
         * @type {Function}
         * @event
         */
        onEnterKeydown: function (value) {},
        /**
         * 搜索图标点击事件
         * 参数为输入框的当前值
         * this指向本控件实例
         * @type {Function}
         * @event
         */
        onSearchIconClick: function (value) {},
        /**
         * 标签被移除前（如delete按键或点击了关闭x按钮）的回调函数
         * 返回false值，则不会执行移除操作
         * this指向本控件实例
         * @type {Function}
         * @param {Object} item
         * @event
         */
        onBeforeRemove: function (item) {},
        /**
         * @private
         */
        enableInitProxy: true,
        /**
         * @private
         */
        enableDataProxy: false,
        /**
         * @private 
         */
        enableDataSet: true
    },
    /**
     * 用于构建静态模板串
     * @param {Object} params 模板已解析参数对象
     * @private 
     */
    staticTemplate: function (params) {
        var html = [];
        html.push('<div style="width:' + params.width + '" class="ui-form"><div elem="autocomplete-box" class="ui-form-wrap ui-autocomplete">');
        if (params.multiple) {
            html.push('<ul elem="autocomplete-selection-items" class="ui-autocomplete-selection"></ul>');
        }
        html.push('<span><input elem="autocomplete-input" type="text" autocomplete="off" class="ui-form-field ui-form-input"/></span>');
        if (params.showSearchIcon) {
            html.push('<div class="ui-form-trigger"><div elem="autocomplete-searchicon" class="ui-search-icon"></div></div>');
        }
        html.push('<input type="hidden" name="' + params.name + '" id="' + params.id + '"/>');
        html.push('</div></div>');
        return html.join("");
    },
    /**
     * 动态模板片段
     * @param {Object} params 已解析的参数对象
     * @param {Object} data 数据对象
     * @private 
     */
    dynamicTemplate: function (params, data) {
        var html = [],
            i = 0,
            item;
        while (item = data[i++]) {
            html.push('<li class="ui-list-item" name="list' + params.sequence + '" text="' + item.text + '" item="' + item.item + '" itemVal="' + item.value + '">' + item.label + '</li>');
        }
        return html.join("");
    },
    /**
     * 弹出层模板
     * @param {Object} params 模板已解析参数对象
     * @private 
     */
    popupStaticTemplate: function (params) {
        var html = [];
        html.push('<div elem="autocomplete-menu" class="ui-autocomplete-list ui-layer ui-shadow" style="height:' + params.menuHeight + ';z-index:' + params.zIndex + ';position:absolute;display:none">');
        html.push('<div class="ui-selectlist-list-ct"><ul elem="autocomplete-menu-items"></ul></div>');
        html.push('<div elem="autocomplete-custom"></div></div>');
        return html.join("");
    },
    tplParam: ["width", "multiple", "sequence", "menuHeight", "zIndex", "name", "id", "showSearchIcon"],
    fields: ["label", "value", "text", "item"],
    /**
     * 参数准备
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有参数
     * @protected
     */
    ready: function (options, global) {
        var width;
        options.selectionLimit = parseInt(options.selectionLimit, 10);
        options.keyDelay = parseInt(options.keyDelay, 10);
        options.maxItems = parseInt(options.maxItems, 10);
        options.selectionLimit = parseInt(options.selectionLimit, 10);
        global.initSource = !! options.dataSource ? options.dataSource : options.initSource;
        if (width = /^(-?\d+\.?\d+|-?\d)(px|%|em|cm)?$/.exec(fastDev.Util.StringUtil.trim(options.width + ""))) {
            options.width = width[1] + (width[2] || "px");
        } else {
            options.width = "150px";
        }
        if ((options.multiple = !! options.multiple) && (!width[2] || width[2] !== "%")) {
            options.width = Math.max(Math.min(options.container.width(), 300), parseInt(options.width, 10)) + "px";
        }
        fastDev.apply(options, {
            zIndex: parseInt(options.zIndex, 10) || 200,
            id: options.id ? options.id : fastDev.getID(),
            initSource: null,
            dataSource: null,
            autoLoad: false,
            keyDelay: Math.abs(options.keyDelay) || (( !! options.items || !global.initSource) ? 10 : 400),
            connectTimeout: parseInt(options.connectTimeout, 10) || 10000,
            minChars: parseInt(options.minChars, 10) || 1,
            fields: fastDev.isArray(options.fields) ? options.fields : [],
            showSearchIcon: !! options.showSearchIcon,
            queryName: (options.queryName && typeof options.queryName === "string") ? options.queryName : "q",
            extraParams: fastDev.isPlainObject(options.extraParams) ? options.extraParams : {},
            maxItems: (fastDev.isNumber(options.maxItems) && options.maxItems !== 0) ? options.maxItems : Infinity,
            selectionLimit: options.multiple ? !fastDev.isNumber(options.selectionLimit) ? options.selectionLimit === 0 ? Infinity : options.selectionLimit : Infinity : Infinity,
            items: this.toArray(options.items),
            inside: fastDev.Util.position.top.fastDev === fastDev || !! options.inside
        });
        fastDev.each(["onRetrieveError", "onBeforeRetrieve", "onAfterRetrieve", "onBeforeRemove", "onAfterChoose", "itemRenderer", "onEnterKeydown", "onSearchIconClick"], function (i, name) {
            options[name] = typeof options[name] === "function" ? options[name] : fastDev.noop;
        });
        fastDev.apply(global, {
            pageContext: options.inside ? window : fastDev.Util.position.top,
            sequence: fastDev.getID(),
            menuHeight: (window.parseInt(options.scrollHeight) || 180) + "px",
            selectionCount: 0,
            requestCount: 0,
            labelWidth: 0,
            onBlur: fastDev.noop,
            cache: {},
            // 用于保存原始数据
            items: {},
            // 用于保存当前值的原始数据
            values: {}
        });
        // 提供给表单使用的方法名
        this.addItems = this.appendItems;
    },
    /**
     * 构造控件
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有参数
     * @protected
     */
    construct: function (options, global) {
        var context = global.pageContext;
        this.merge(context.fastDev(this.popupStaticTemplate(global.params)).appendTo(fastDev(context.document.body)));
        fastDev.apply(global, {
            win: fastDev(window),
            docHtml: fastDev(document.documentElement),
            menu: this.find("[elem='autocomplete-menu']"),
            selection: this.find("[elem='autocomplete-selection-items']"),
            menuItems: this.find("[elem='autocomplete-menu-items']"),
            inputBox: this.find("[elem='autocomplete-box']"),
            input: this.find("[elem='autocomplete-input']"),
            custom: this.find("[elem='autocomplete-custom']"),
            searchIcon: this.find("[elem='autocomplete-searchicon']"),
            box: this.find("[elem='autocomplete-input']"),
            valueInput: this.find("[id='" + options.id + "']"),
            isBlur: true
        });
        global.topDocHtml = options.inside ? global.docHtml : fastDev(context.document.documentElement);
        if (options.showSearchIcon) {
            global.inputBox.addClass("ui-search");
        }
        this.elems.splice(1, 0, "none");
    },
    /**
     * 控件初始化
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有参数
     * @protected
     */
    init: function (options, global) {
        var that = this;
        // 绑定事件
        // 输入框聚焦事件
        global.input.bind("focus", fastDev.setFnInScope(this, this.inputFocusHandle))
        // 输入框失焦事件
        .bind("blur", fastDev.setFnInScope(this, this.inputBlurHandle))
        // 输入框按键事件
        .bind("keydown", global.inputHandle = fastDev.setFnInScope(this, this.inputKeydownHandle));
        // 文本框值为空时给提示信息
        if (fastDev.Browser.isFirefox) {
            // 解决火狐浏览器下开启中文输入法时，事件捕获被丢失的情况（火狐支持input事件）
            global.input.bind("input", global.inputHandle);
        }
        if (fastDev.Browser.isIE6) {
            // IE6下回车事件不能由keydown捕获
            global.input.bind("keyup", function (event) {
                if (event.keyCode === 13) {
                    global.inputHandle(event);
                }
            });
        }
        // 文档点击事件
        global.docHtml.bind("click", global.docClickEvent = fastDev.setFnInScope(this, this.docClickHandle));
        if (!options.inside) {
            global.topDocHtml.bind("click", global.docClickEvent);
            global.win.bind("unload", function () {
                global.topDocHtml.unbind("click", global.docClickEvent);
                that.destroy();
            });
        }
        // 提示层鼠标悬浮事件
        global.menu.bind("mouseover", fastDev.setFnInScope(this, this.menuOverHandle))
        // 提示层鼠标移除事件
        .bind("mouseout", fastDev.setFnInScope(this, this.menuOutHandle));
        // 输入框值改变事件
        global.keyChangeHandle = fastDev.setFnInScope(this, this.keyChangeHandle);
        // 标签鼠标事件
        global.selection.bind("mouseover", fastDev.setFnInScope(this, this.selectionOverHandle))
        // 鼠标移出
        .bind("mouseout", fastDev.setFnInScope(this, this.selectionOutHandle))
        // 鼠标点击删除标签
        .bind("click", fastDev.setFnInScope(this, this.selectionClickHandle));
        global.doRetrieveHandle = fastDev.setFnInScope(this, this.doRetrieve);
        // 搜索图标点击事件
        global.searchIcon.bind("click", function () {
            options.onSearchIconClick.call(that, that.getValue());
        });
        if (global.initSource) {
            // 初始数据代理
            // 目前使用本地数据源时，不处理远程数据源，所以不初始代理
            this.initProxy.setOptions({
                onError: fastDev.setFnInScope(this, options.onRetrieveError || fastDev.noop),
                timeout: options.connectTimeout,
                url: options.initSource = global.initSource,
                onAfterLoad: fastDev.setFnInScope(this, function (data) {
                    if (data && !this.dataset.select().length) {
                        // 处理字符串数据
                        this.constructItems(data);
                    }
                })
            });
        }
        // 初始数据集
        if (options.value) {
            this.appendValue(options.value);
        }
        if (options.disabled) {
            options.disabled = false;
            this.disable();
        } else if (options.readonly) {
            this.setReadonly(true);
        }
    },
    /**
     * 绑定事件
     * @param {String} type 事件类型
     * @param {Function} handle 事件句柄 
     * @private 
     */
    bind: function (type, handle) {
        if (type === "blur") {
            this._global.onBlur = handle;
        } else {
            this.superClass.bind.apply(this, arguments);
        }
        return this;
    },
    /**
     * 输入框聚焦事件处理
     * @private
     */
    inputFocusHandle: function () {
        if (!this._global.input.prop("value")) {
            this.showHint();
        }
        this._global.isBlur = false;
    },
    /**
     * 输入框失焦事件处理
     * @private
     */
    inputBlurHandle: function () {},
    /**
     * 提示层鼠标悬浮事件处理
     * @param {Event} event
     * @private
     */
    menuOverHandle: function (event) {
        var sequence = "list" + this._global.sequence,
            target = fastDev(event.target),
            item = target;
        if (target.attr("name") === sequence || !! (item = target.parents("li[name='" + sequence + "']")).elems[0]) {
            item.addClass("ui-list-selected");
        }
    },
    /**
     * 提示层鼠标移出事件处理
     * @private
     */
    menuOutHandle: function () {
        this._global.menu.find(".ui-list-selected").removeClass("ui-list-selected");
    },
    /**
     * 标签层鼠标悬浮事件
     * @param {Event} event
     * @private
     */
    selectionOverHandle: function (event) {
        if (this._options.disabled) {
            return;
        }
        var sequence = "label" + this._global.sequence,
            target = fastDev(event.target),
            item = target;
        if (target.attr("name") === sequence || !! (item = target.parent("li[name='" + sequence + "']")).elems[0]) {
            item.addClass("ui-autocomplete-over");
            if (!item.prop("title")) {
                item.prop("title", item.find("span").getText());
            }
        }
    },
    /**
     * 标签鼠标移出事件处理
     * @private
     */
    selectionOutHandle: function () {
        if (this._options.disabled) {
            return;
        }
        this._global.selection.find("li.ui-autocomplete-over").removeClass("ui-autocomplete-over");
    },
    /**
     * 标签单击关闭事件处理
     * @param {Event} event
     * @private
     */
    selectionClickHandle: function (event) {
        if (this._options.disabled) {
            return;
        }
        var global = this._global,
            sequence = "label" + global.sequence,
            target = fastDev(event.target),
            item = target;
        if (target.attr("name") === sequence || !! (item = target.parent("li[name='" + sequence + "']")).elems[0]) {
            if (event.target.nodeName.toLowerCase() === "a") {
                this.closeLabel(item);
            } else {
                global.selection.find("li.ui-autocomplete-selected").removeClass("ui-autocomplete-selected");
                item.addClass("ui-autocomplete-selected");
                return fastDev.Event.stopBubble(event);
            }
        }
    },
    /**
     * 文档单击事件处理
     * @param {Event} event
     * @private
     */
    docClickHandle: function (event) {
        if (this._options.disabled) {
            return;
        }
        var global = this._global,
            sequence = "list" + global.sequence,
            target = fastDev(event.target),
            item = target;
        global.selection.find("li.ui-autocomplete-selected").removeClass("ui-autocomplete-selected");
        if (event.target === global.input.elems[0]) {
            // input focus
        } else if (target.attr("name") === sequence || !! (item = target.parents("li[name='" + sequence + "']")).elems[0]) {
            global.input.elems[0].focus();
            this.appendValue(global.items[item.attr("item")]);
            if (this._options.multiple) {
                this.showHint();
            }
            return fastDev.Event.stopBubble(event);
        } else if (!target.parents("#autocomplete-menu-" + global.sequence).elems[0]) {
            global.menu.hide();
            global.items = {};
            if (!global.isBlur) {
                global.onBlur();
                global.isBlur = true;
            }
        }
    },
    /**
     * 输入框按键事件处理
     * @param {Event} event
     * @private
     */
    inputKeydownHandle: function (event) {
        var options = this._options,
            global = this._global;
        global.handling = true;
        if (options.disabled) {
            return;
        }
        if (options.multiple) {
            if (global.lastKeypressCode === 8 && event.keyCode !== 8) {
                global.selectedLabel = null;
            }
            global.selection.find("li.ui-autocomplete-selected").removeClass("ui-autocomplete-selected");
        }
        global.lastKeypressCode = event.keyCode;
        switch (event.keyCode) {
            case 38:
                // up
                return this.moveItem("up", event);
            case 40:
                // down
                return this.moveItem("down", event);
            case 9:
            case 186:
            case 188:
            case 13:
                // 逗号，分号，制表，回车
                return this.dealWithEnterKey(event.keyCode, event);
            case 8:
                // delete
                return this.removeLabel(event);
            default:
                this.setTimer(global.keyChangeHandle, 10);
        }
    },
    /**
     * 设置检索计时
     * @param {Function} func
     * @param {Number} delay
     * @private
     */
    setTimer: function (func, delay) {
        var global = this._global,
            options = this._options;
        if (global.selectionCount < options.selectionLimit) {
            window.clearTimeout(global.timer);
            global.timer = window.setTimeout(func, delay);
        }
    },
    /**
     * 显示默认的提示信息项
     * @private
     */
    showHint: function () {
        var options = this._options,
            global = this._global,
            items, value, temp;
        if (options.readonly) {
            return;
        }
        if ( !! options.hintItems) {
            if (typeof options.hintItems === "boolean" && !! options.items.length) {
                items = options.items;
            } else if ( !! options.hintItems.length) {
                items = this.toArray(options.hintItems);
            }
            if ( !! items) {
                if (options.multiple) {
                    value = (" " + global.valueInput.prop("value").replace(/[,]/g, " ") + " ");
                    temp = [];
                    for (var i = 0; i < items.length; i++) {
                        if (value.search(new RegExp(" " + this.gainValue(items[i], "value", true) + " ")) === -1) {
                            temp.push(items[i]);
                        }
                        if (temp.length === options.maxItems) {
                            break;
                        }
                    }
                    items = temp;
                }
                return this.constructItems(items, true);
            }
        }
        if ( !! options.hintText) {
            this.showTips(options.hintText);
        } else {
            global.menu.hide();
        }
    },
    /**
     * 将数据转换为数组
     * @param {Object} data
     * @return {Array}
     * @private
     */
    toArray: function (data) {
        return data ? (typeof data === "string" || typeof data === "boolean" || fastDev.isNumber(data)) ? (data + "").split(",") : fastDev.isArray(data) ? data : fastDev.isPlainObject(data) ? [data] : [] : [];
    },
    /**
     * 键盘按键移除标签
     * @param {Event} event
     * @private
     */
    removeLabel: function (event) {
        var global = this._global,
            options = this._options;
        if (!options.readonly) {
            this.setTimer(global.keyChangeHandle, 10);
            if (options.multiple && ( !! global.selectionCount) && !global.input.prop("value")) {
                if ( !! global.selectedLabel) {
                    this.closeLabel(global.selectedLabel, true);
                    global.input.elems[0].focus();
                    global.selectedLabel = null;
                } else {
                    global.selection.find("li.ui-autocomplete-selected").removeClass("ui-autocomplete-selected");
                    global.selectedLabel = global.selection.find("li:last").addClass("ui-autocomplete-selected");
                }
                return fastDev.Event.stopBubble(event);
            }
        }
        return true;
    },
    /**
     * 提示结果菜单上下选取
     * @param {String} direction 按键方向
     * @param {Event} event
     * @private
     */
    moveItem: function (direction, event) {
        var global = this._global,
            menu = global.menuItems,
            items, item, start;
        if (global.menu.isShow() && !! (items = menu.find("li")).elems.length) {
            start = !! (item = menu.find("li.ui-list-selected:first")).elems[0] ? (direction === "up" ? item.prev() : item.next()) : menu.find("li:" + (direction === "up" ? "last" : "first"));
            items.removeClass("ui-list-selected");
            start.addClass("ui-list-selected");
            if (this._options.autoFill) {
                item = start.hasElem() ? start : global.prevInputValue;
                if (this._options.multiple) {
                    global.input.prop("value", this.gainValue(item, "text", true));
                } else {
                    this.appendValue(fastDev.isString(item) ? item : global.items[item.attr("item")], true);
                }
                global.input.elems[0].focus();
            }
            if (start.hasElem()) {
                // 处理滚动滚动条
                menu = global.menu;
                var top = start.elems[0].offsetTop,
                    itemHeight = start.outerHeight(),
                    menuHeight = menu.height(),
                    scrollTop = menu.scrollTop();
                if (top + itemHeight > scrollTop + menuHeight) {
                    menu.scrollTop(top + itemHeight - menuHeight);
                } else if (top < scrollTop) {
                    menu.scrollTop(top);
                }
            }
            return fastDev.Event.stopBubble(event);
        }
        return true;
    },
    /**
     * 处理键盘输入事件
     * @param {String} code 键位代码
     * @private
     */
    dealWithEnterKey: function (code, event) {
        var global = this._global,
            options = this._options,
            items = global.menuItems,
            item, value;
        if (options.multiple && (code === 9 || code === 188 || code === 186)) {
            // 逗号，分号或制表符
            if ( !! options.allowAutoCreate && !! (value = fastDev.Util.StringUtil.trim(global.input.prop("value").replace(/[,;]/g, "")))) {
                item = (" " + global.valueInput.prop("value").replace(/[,]/g, " ") + " ");
                if (item.search(new RegExp(" " + value + " ")) === -1) {
                    this.appendValue(value);
                    global.input.elems[0].focus();
                    global.menu.hide();
                    return fastDev.Event.stopBubble(event);
                }
            }
        } else if (global.menu.isShow()) {
            item = !! (item = items.find("li.ui-list-selected[name='list" + global.sequence + "']")).elems[0] ? item : options.selectFirst ? items.find("li:first[name='list" + global.sequence + "']") : null;
            if ( !! item && item.hasElem()) {
                this.appendValue(global.items[item.attr("item")]);
                global.input.elems[0].focus();
                if (options.multiple) {
                    this.showHint();
                }
            }
        }
        if (!options.multiple) {
            global.menu.hide();
            global.items = {};
        }
        if (code === 13) {
            // 回车事件
            options.onEnterKeydown.call(this, this.getValue());
        }
    },
    /**
     * 按键改变事件处理
     * @private
     */
    keyChangeHandle: function () {
        var options = this._options,
            global = this._global,
            value = global.input.prop("value"),
            // 输入框的当前值
            keyword = fastDev.Util.StringUtil.ltrim(value || ""),
            cache;
        options.onchange.call(this, value);
        if (!keyword || keyword.length < options.minChars || global.isLoading) {
            if (!keyword) {
                this.showHint();
            }
            return;
        }
        global.keyword = keyword;
        if (options.allowCache && !! (cache = !options.initSource ? null : global.cache[keyword])) {
            this.constructItems(cache, false);
        } else {
            this.setTimer(global.doRetrieveHandle, Math.max(options.keyDelay - 10, 0));
        }
    },
    /**
     * 取得元素的值
     * @param {DomObject|Object|String|Record} item
     * @param {String} name
     * @param {Boolean} str
     * @private
     */
    gainValue: function (item, name, str) {
        if (!item) {
            return "";
        }
        var res = {};
        if ( !! item.elems && !! item.elems.length && typeof item.attr === "function" && typeof item.prop === "function") {
            res.value = fastDev.Util.StringUtil.trim(this.toStr(item.attr(name || "itemVal")) || this.toStr(item.prop(name || "value")) || this.toStr(item.attr("text")) || this.toStr(item.prop("text")));
            res.text = fastDev.Util.StringUtil.trim(this.toStr(item.attr(name || "text")) || this.toStr(item.prop(name || "text")) || res.value);
        } else {
            name = this.getMapping(name || "value");
            res = fastDev.Util.StringUtil.trim(this.toStr(item[name || ("expando" + fastDev.getID())]) || this.toStr(item.value) || this.toStr(item.text) || this.toStr(item));
        }
        if (str) {
            res = typeof res === "object" ? name ? res[name] || res.value : res.value || res.text : res;
        }
        return res;
    },
    /**
     * 作字符化处理
     * @param {Object} item
     * @private
     */
    toStr: function (item) {
        return typeof item === "string" || typeof item === "number" || typeof item === "boolean" ? item + "" : "";
    },
    /**
     * 显示提示信息
     * @param {String} tip
     * @private
     */
    showTips: function (tip) {
        var global = this._global,
            options = this._options,
            doc = global.pageContext.document,
            isLoading = tip === options.searchingText && !fastDev.Browser.isIE6;
        if ( !! tip && global.selectionCount < options.selectionLimit) {
            this.dataset.clean();
            global.menuItems.empty();
            global.menu.css("height", 20);
            fastDev(doc.createElement("span")).appendTo(fastDev(doc.createElement("div")).addClass("ui-list-item").addClass("ui-list-gray").css("overflow", "hidden").appendTo(global.custom.empty())).addClass(isLoading ? "ui-loading-indicator" : "").css("text-indent", isLoading ? "20px" : "0px").elems[0].innerHTML = tip;
            // 定位并展现下拉层
            this.position(global.menu, global.inputBox).show();
        }
    },
    /**
     * 获取字段映射
     * @param {String} name 需映射的字段名
     * @private
     */
    getMapping: function (name) {
        var options = this._options,
            fields = options.fields,
            length = fields.length;
            // 获取自定义映射
        while (length--) {
            if (fastDev.isPlainObject(fields[length]) && fields[length].mapping === name) {
                return fields[length].name;
            }
        }
        return name;
    },
    /**
     * 执行检索
     * @private
     */
    doRetrieve: function () {
        var options = this._options,
            global = this._global,
            keyword = global.keyword,
            params, len;
        if (options.onBeforeRetrieve.call(this, keyword) !== false) {
            if (!options.initSource) {
                len = options.items.length;
                // 本地数据源
                keyword = keyword.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
                var items = [],
                    igCase = options.matchCase ? "" : "i",
                    regx, value;
                value = (" " + global.valueInput.prop("value").replace(/[,]/g, " ") + " ");
                regx = options.matchContains ? new RegExp("(?:" + keyword + ")", "g" + igCase) : new RegExp("(?:^" + keyword + ")", igCase);
                while (len--) {
                    regx.lastIndex = 0;
                    if (regx.test(this.gainValue(options.items[len], "text", true)) && (options.multiple ? value.search(new RegExp(" " + this.gainValue(options.items[len], "value", true) + " ")) === -1 : true)) {
                        items.push(options.items[len]);
                        if (items.length === options.maxItems) {
                            break;
                        }
                    }
                }
                this.constructItems(items);
            } else {
            	// 远程请求
                params = {};
                global.isLoading = true;
                global.requestCount++;
                fastDev.apply(params, options.extraParams);
                params[options.queryName] = keyword;
                this.initProxy.load(params, null, true);
                this.showTips(options.searchingText);
            }
        }
    },
    /**
     * 构造结果列表
     * @param {Array|String|Object} data
     * @param {Boolean} hint 是否是提示项构造
     * @param {Boolean} isCache 是否是缓存数据
     * @protected
     */
    constructItems: function (data, hint, isCache) {
        var global = this._global,
            options = this._options,
            keyword = global.keyword,
            json;
        global.prevInputValue = fastDev.Util.StringUtil.ltrim(global.input.prop("value"));
        global.menu.css("height", "auto");
        if (typeof data === "string") {
            try {
            	// 解析JSON数据
                json = fastDev.Util.JsonUtil.parseJson(data = fastDev.Util.StringUtil.trim(data));
            } catch (e) {} finally {
                data = !! json ? json : data;
                data = typeof options.resultRenderer === "function" ? data : this.toArray(data);
            }
        }
        if (hint || ( !! keyword && keyword === global.prevInputValue && options.onAfterRetrieve.call(this, (data = data || this.dataset.select() || []).slice(0), keyword) !== false)) {
            if ( !! data.length) {
                global.custom.empty();
                // 渲染结果项
                this.renderMenu(data, keyword, hint);
                // 缓存远程数据
                if (options.allowCache) {
                    global.cache[keyword] = !options.initSource ? [] : data;
                }
            } else if (options.noResultsText) {
                this.showTips(options.noResultsText);
                if (options.allowCache) {
                    global.cache[keyword] = [];
                }
            } else {
                global.menu.hide();
            }
        } else {
            global.menu.hide();
        }
        global.isLoading = false;
    },
    /**
     * 渲染提示菜单层
     * @param {Array|String|Object} data
     * @param {Boolean} hint
     * @param {String} keyword
     * @private
     */
    renderMenu: function (data, keyword, hint) {
        var global = this._global,
            options = this._options,
            max = options.maxItems,
            items = [],
            index = 0,
            record,
            label, regx, item, text;
        if (typeof options.resultRenderer === "function") {
            global.custom.empty().append(label = global.pageContext.document.createElement("div"));
            options.resultRenderer.call(this, label, data, keyword);
        } else {
            if (!hint) {
                global.items = {};
            }
            while ((record = data[index++]) && index <= max) {
                items.push({
                    text: text = this.gainValue(record, "text", true),
                    value: this.gainValue(record, "value", true),
                    item: item = fastDev.getID(),
                    label: options.itemRenderer.call(this, record, keyword) || text
                });
                global.items[item] = record;
            }
            this.dataset.clean();
            this._renderDynamicHtml(global.menuItems, items, global.pageContext);
        }
        if (global.menu.height() > window.parseInt(global.menuHeight)) {
            global.menu.css("height", global.menuHeight);
        }
        // 定位并展现下拉层
        this.position(global.menu, global.inputBox)[(keyword || hint) ? "show" : "hide"]();
        if (options.keywordHighlight && !! keyword && !hint) {
        	// 高亮关键字
            this.highlight(global.menu, keyword);
        }
    },
    /**
     * 渲染标签元素
     * @param {Array} items 标签值对象
     * @private
     */
    renderLabel: function (items) {
        var options = this._options,
            global = this._global,
            values = [],
            doc = document,
            len = items.length,
            item, value, uuid;
        while (len-- && global.selectionCount < options.selectionLimit) {
            value = this.gainValue(items[len]);
            if ( !! value && options.onAfterChoose.call(this, items[len]) !== false) {
                item = fastDev(doc.createElement("li"))
                // 添加至列表中
                .appendTo(global.selection)
                // 添加已选多值结果项样式
                .addClass("ui-autocomplete-item")
                // 设置名称标记
                .attr("name", "label" + global.sequence)
                // 当前标签值
                .attr("itemVal", value).attr("uuid", uuid = fastDev.getID());
                fastDev(doc.createElement("span"))
                // 添加标签值至子项中
                .appendTo(item)
                // 添加文本样式
                .addClass("ui-autocomplete-text")
                // 设置文本
                .setText(fastDev.Util.StringUtil.trim(items[len].text) || value);
                fastDev(doc.createElement("a"))
                // 添加标签关闭按钮
                .appendTo(item)
                // 添加关闭按钮样式名
                .addClass("ui-autocomplete-close");
                // 标记新的标签项
                global.newItem = item;
                item.hide();
                // 自适应标签宽度
                if (!this.adjustWidth(item.outerWidth(true))) {
                    item.show();
                }
                // 保存值
                values.push(value);
                global.values[uuid] = items[len];
                global.selectionCount++;
            }
        }
        if (options.disabled) {
            global.selection.find("li").addClass("ui-autocomplete-disabled");
        }
        if ( !! (item = global.valueInput.prop("value") || "")) {
            values.push(item.split(","));
        }
        global.valueInput.prop("value", values.join(","));
    },
    /**
     * 关闭标签
     * @param {DomObject} item 标签li
     * @private
     */
    closeLabel: function (item) {
        var options = this._options,
            global = this._global;
        if (!options.readonly && options.onBeforeRemove.call(this, global.values[item.attr("uuid")]) !== false) {
            var that = this,
                values = global.valueInput.prop("value").split(","),
                value = item.attr("itemVal") + "";
            fastDev.each(values, function (idx, val) {
                if (value === (val + "")) {
                    values.splice(idx, 1);
                    return false;
                }
            });
            global.valueInput.prop("value", values.join(","));
            delete global.values[item.attr("uuid")];
            item.remove();
            global.labelWidth = 0;
            global.input.hide();
            // 重计算大小
            global.selection.find("li").each(function (elem) {
                (global.newItem = item = fastDev(elem).hide()).find("span").show();
                if (!that.adjustWidth(item.outerWidth(true))) {
                    item.show();
                }
            });
            global.input.show();
            if (!(--global.selectionCount)) {
                global.input.css("width", global.inputBox.width());
            }
        }
    },
    /**
     * 自适应调节标签的宽度
     * @param {Number} width 宽度增量值
     * @private
     */
    adjustWidth: function (width) {
        var global = this._global,
            browser = fastDev.Browser,
            inputWidth = global.inputBox.width() - (browser.isIE6 ? 5 : browser.isIE ? 3 : 1),
            item;
        // 输入框以最小宽度为82px来处理
        if (global.labelWidth + width + 82 > inputWidth) {
            if ( !! (item = !! (item = global.selection.find("span:visible:first")).elems[0] ? item : global.selection.find("li:visible:first")).elems[0]) {
                global.labelWidth -= item.outerWidth(true);
                item.hide();
                return this.adjustWidth(width);
            } else {
                // 输入框所在容器初始宽度小于82px
                global.input.css("width", inputWidth);
                return true;
            }
        } else {
            // 减少输入框宽度
            global.input.css("width", Math.max(inputWidth - (global.labelWidth += width), 20));
        }
    },
    /**
     * 定位元素
     * @param {fastDev.Core.DomObject} obj 需定位的对象
     * @param {fastDev.Core.DomObject} elem 相对其定位的元素
     * @return {fastDev.Core.DomObject} obj 定位对象
     * @private
     */
    position: function (obj, elem) {
    	// 定位
        return fastDev.Util.position.locate(obj.width(this._global.inputBox.innerWidth()), elem, this._options.inside ? window : fastDev.Util.position.top, 1, true, this._options.direction);
    },
    /**
     * 高亮 显示关键字
     * @param {String|Element|DomObject|Component} element 需高亮的节点元素、控件或标签选择器
     * @param {String} keyword 需高亮显示的关键字
     * @param {String} [className] 高亮样式名，默认使用控件预设或用户配置的样式名
     * @return {fastDev.Ui.AutoComplte} 本控件实例
     */
    highlight: function (element, keyword, className) {
        if ( !! keyword && element && (fastDev.isDomObject(element) || fastDev.isComponent(element) || (element = fastDev(element || ("#e" + fastDev.getID()))).hasElem())) {
            var that = this,
                options = this._options,
                context = this._global.pageContext.fastDev,
                fx = context.Util.StringUtil.highlight,
                regx = new RegExp("(" + (options.matchContains ? "" : "^") + keyword.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") + ")", options.matchCase ? "" : "i");
            fastDev.each(element.elems, function (idx, elem) {
                fx(elem, regx, "em", className || options.highlightCls);
            });
        }
        return this;
    },
    /**
     * 添加查询参数
     * 会覆盖之前添加的同名的查询参数
     * @param {Object} params 参数对象，仅接受普通的javascript对象（即使用"{}"声明的对象字面量），对象属性名为查询参数名，属性值为查询参数值
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    setParam: function (params) {
        if (fastDev.isPlainObject(params)) {
            fastDev.apply(this._options.extraParams, params);
        }
        return this;
    },
    /**
     * 设置静态数据
     * @param {Array|String|Object} 静态数据值
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    setItems: function (items) {
        var options = this._options;
        options.items = this.toArray(items);
        return this;
    },
    /**
     * 追加静态数据
     * @param {Array|String|Object} 静态数据值
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    appendItems: function (items) {
        return this.setItems(this._options.items.concat(this.toArray(items)));
    },
    /**
     * 设置输入框为空时的默认的提示项
     * @param {Array|String|Object} 提示项值
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    setHintItems: function (items) {
        this._options.hintItems = items;
        return this;
    },
    /**
     * 设置控件值
     * @param {Object} value 要设置的值
     * @return {fastDev.Ui.AutoComplete}
     */
    setValue: function (value) {
        this.reset();
        return this.appendValue(value);
    },
    /**
     * 单值模式时，等效于setValue，多值模式时，可追加新的值项（创建新的标签）
     * 多用于多值模式
     * @param {Object} value 要追加的值
     * @param {Boolean} noClose 追加值后不自动关闭提示层
     * @return {fastDev.Ui.AutoComplete}
     */
    appendValue: function (value, noClose) {
        var global = this._global,
            options = this._options,
            uuid;
        value = (value === undefined || value === null || value === "") ? "" : this.toArray(value);
        if ( !! value && !! value.length) {
            if (options.multiple) {
                global.input.hide();
                this.renderLabel(value);
                global.input.prop("value", "").show();
                if (global.handling) {
                    global.input.elems[0].focus();
                }
            } else {
                if (options.onAfterChoose.call(this, value[0]) !== false) {
                    global.input.prop("value", this.gainValue(value[0], "text", true));
                    delete global.values[global.valueInput.attr("uuid") || "0"];
                    global.valueInput.prop("value", this.gainValue(value[0], "value", true)).attr("uuid", uuid = fastDev.getID());
                    global.values[uuid] = value[0];
                }
            }
        }
        if (!noClose) {
            global.menu.hide();
            global.items = {};
        }
        return this;
    },
    /**
     * 清理所有静态数据 （同时会重置输入框当前值为空）
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    clean: function () {
        return this.setHintItems(false).setItems([]).reset();
    },
    /**
     * 清理所有已选标签值或者输入框的当前值（重置输入框值为空）
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    reset: function () {
        var options = this._options,
            global = this._global;
        window.clearTimeout(global.timer);
        global.input.prop("value", "");
        global.valueInput.prop("value", "");
        global.labelWidth = 0;
        global.keyword = "";
        global.prevInputValue = "";
        if (options.multiple && !! global.selectionCount) {
            global.selection.empty();
            global.selectionCount = 0;
            global.input.css("width", global.inputBox.innerWidth());
        }
        global.menu.hide();
        global.items = {};
        return this;
    },
    /**
     * 获取输入框值的原始数据对象数组
     * @return {Array}
     */
    getItems: function () {
        var options = this._options,
            global = this._global,
            items = [],
            item;
        if (options.multiple) {
            global.selection.find("li").each(function (elem) {
                items.push(global.values[fastDev(elem).attr("uuid")]);
            });
        } else if (item = global.values[global.valueInput.attr("uuid") || "0"]) {
            items.push(item);
        }
        return items;
    },
    /**
     * 获取输入框的值
     * @return {String}
     */
    getValue: function () {
        return this._global[this._options.multiple ? "valueInput" : "input"].prop("value");
    },
    /**
     * 禁用本控件
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    disable: function () {
        var global = this._global,
            options = this._options;
        if (!options.disabled) {
            window.clearTimeout(global.timer);
            global.inputBox.addClass("ui-form-disabled");
            global.valueInput.prop("disabled", "disabled");
            if (options.multiple && !! global.selectionCount) {
                global.selection.find("li").addClass("ui-autocomplete-disabled");
            }
            this.setReadonly(true);
            global.menu.hide();
            options.disabled = true;
        }
        return this;
    },
    /**
     * 启用本控件
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    enable: function () {
        var global = this._global,
            options = this._options;
        if (options.disabled) {
            options.disabled = false;
            global.inputBox.removeClass("ui-form-disabled");
            global.valueInput.prop("disabled", "");
            if (options.multiple && !! global.selectionCount) {
                global.selection.find("li").removeClass("ui-autocomplete-disabled");
            }
            this.setReadonly(false);
        }
        return this;
    },
    /**
     * 设置是否只读
     * @param {Boolean} [readonly=true] 是否只读
     * @return {fastDev.Ui.AutoComplete} 本控件实例
     */
    setReadonly: function (readonly) {
        var options = this._options;
        if (!options.disabled) {
            options.readonly = readonly === false ? false : true;
            this._global.input.prop("readonly", options.readonly ? "readonly" : "");
        }
        return this;
    }
});
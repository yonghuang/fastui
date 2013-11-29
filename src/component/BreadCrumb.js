/**
 * @class fastDev.Ui.BreadCrumb
 * @extends fastDev.Ui.Component
 * @author chengwei
 * <p>面包屑控件。</p>
 * <p>导航类控件，支持静态定义和远程数据定义，样式自定义等。</p>
 * <p>作者：程伟</p>
 *      
 *      <div itype="BreadCrumb" width="60%">
 *           <div href="http://www.163.com" value="网易" target="_blank"></div>
 *           <div href="http://www.baidu.com" value="百度" target="_blank"></div>
 *           <div href="http://www.sina.com.cn" value="新浪" current="true"></div>
 *      </div> 
 */
fastDev.define("fastDev.Ui.BreadCrumb", {
    alias: "BreadCrumb",
    extend: "fastDev.Ui.Component",
    _options: {
        /**
         * 宽度
         * @type {String}
         */
        width: "auto",
        /**
         * 连接符号样式名
         * @type {String}
         */
        symbolsCls: "",
        /**
         * 头部样式名
         * @type {String}
         */
        headerCls: "",
        /**
         * 面包屑栏的背景样式名
         * @type {String}
         */
        backgroundCls: "",
        /**
         * 静态数据项
         * @type {Array}
         * @param {Object} item 超链接配置
         * @param {String} item.href 链接地址
         * @param {String} item.value 链接名称
         * @param {String} [item.target=_self] 链接的目标 URL
         * @param {String} [item.current=false] 是否是当前页面链接
         * @param {Number} [item.sortValue=0] 排序值
         */
        items: null
    },
    /**
     * 静态模板
     * @param {Object} params 模板参数
     * @private 
     */
    staticTemplate: function (params) {
        return '<div name="bread" class="ui-bread ' + params.backgroundCls + '" style="width:' + params.width + '"></div>';
    },
    /**
     * 动态模板片段
     * @param {Object} params 已解析的参数对象
     * @param {Object} data 数据对象
     * @private 
     */
    dynamicTemplate: function (params, data) {
        var html = ['<div class="ui-bread-ico ' + params.headerCls + '"></div>'];
        for (var i = 0, item; item = data[i]; i++) {
            if (i > 0) {
                html.push('<span class="ui-bread-symbols ' + params.symbolsCls + '"></span>');
            }
            html.push('<a href="' + item.href + '" target="' + item.target + '" ');
            if (data.current) {
                html.push('class="current"');
            }
            html.push('>' + item.value + '</a>');
        }
        return html.join("");
    },
    tplParam: ["symbolsCls", "headerCls", "backgroundCls", "width"],
    fields: [{
        name: "href",
        defaultValue: "#"
    }, {
        name: "value",
        defaultValue: ""
    }, {
        name: "target",
        defaultValue: "_self"
    }, {
        name: "current",
        defaultValue: false
    }, {
        name: "sortValue", //排序值，用于动态数据时显示顺序指定
        type: "Int",
        defaultValue: 0
    }],
    /**
     * 面包屑参数准备
     * @param {Object} options 用户配置项
     * @param {Object} global 全局私有变量
     */
    ready: function (options, global) {
        if (fastDev.isNumber(options.width)) {
            options.width += "px";
        }
        if (!options.backgroundCls) {
            options.backgroundCls = "ui-bread-bg";
        }
    },
    /**
     * 初始数据项
     * @protected
     */
    constructItems: function () {
        this.dataset.sort("sortValue");
        this._renderDynamicHtml(this.find("[name='bread']"));
        // 如果子项可能过多建议使用事件代理
        this.find(".ui-bread").bind("click", fastDev.setFnInScope(this, function (event) {
            if (event.target.nodeName === "A") {
                this.find("A").removeClass("current");
                fastDev(event.target).addClass("current");
            }
        }));
    }
});
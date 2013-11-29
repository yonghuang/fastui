talkweb.Components.AutoComplete = fastDev.apply(function(settings) {
    return fastDev.create("fastDev.Ui.AutoComplete", settings);
}, fastDev.Ui.AutoComplete);

fastDev.Core.ClassManager.addAlias("talkweb.Components.AutoComplete", "fastDev.Ui.AutoComplete");
/*
 *方法兼容补丁
 */
fastDev.apply(fastDev.Ui.AutoComplete._options, {
    /*
     * 回调接口
     * @event
     * @type {String}
     */
    afterChoose : fastDev.noop,
    /*
     * 鼠标触发的样式名称
     * @type {String}
     * @deprecated
     */
    onClass : "onClass",
    /*
     * 鼠标离开后的样式名称
     * @type {String}
     * @deprecated
     */
    unClass : "unClass",
    /*
     * 请求数据源
     * @type {String}
     * @deprecated
     */
    dataSource : ""
});
fastDev.apply(fastDev.Ui.AutoComplete, {
    ready : function(options, global) {
        options.onAfterChoose = options.afterChoose;
        options.selectedClass = options.onClass;
        options.unSelectedClass = options.unClass;
        //options.initSource = options.dataSource;
    }
});


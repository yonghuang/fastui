/*
 * @class fastDev.Ui.ComplexChooseList
 * @extends fastDev.Ui.ChooseList
 * @author chengwei
 */
fastDev.define("fastDev.Ui.ComplexChooseList", {
    alias: "ComplexChooseList",
    extend: "fastDev.Ui.ChooseList",
    _options: {
        leftWidth: 188,
        rightWidth: 188,
        height: 228,
        noResultsText: "未找到匹配项",
        leftTopHeight: 50,
        rightTopHeight: 25,
        topParentId: "0",
        onAfterInit: function () {
            var global = this._global;
            global.leftTitle.setText("通讯录(" + (global.size || 0) + "人)");
            global.rightTitle.setText("接收人(" + this.getSize() + "人)");
        },
        onAfterSelect: function (item) {
            var global = this._global,
                widget;
            global.leftTitle.setText("通讯录(" + (--global.size) + "人)");
            global.rightTitle.setText("接收人(" + this.getSize() + "人)");
            if (typeof (widget = this.getWidget()).delNode !== "function") {
                global.tree.delNode(item.id);
                if (widget.getSize() === 0) {
                    global.comboList.hide();
                    this.setWidget(global.tree.show());
                }
            }
            global.changed = true;
        },
        onAfterDeselect: function (item) {
            var global = this._global;
            global.leftTitle.setText("通讯录(" + (++global.size) + "人)");
            global.rightTitle.setText("接收人(" + this.getSize() + "人)");
            if (typeof this.getWidget().addNode !== "function") {
                global.tree.addNode(item);
            }
            global.changed = true;
        }
    },
    ready: function (options, global) {
        var that = this,
            uuid = fastDev.getID();
        global.uuid = uuid;
        fastDev.apply(options, {
            leftTopTemplate: options.leftTopTemplate || '<span id="leftTitle-' + uuid + '" class="ui-chooselist-title"></span><div id="search-' + uuid + '" style="width:' + options.leftWidth + '"></div>',
            rightTopTemplate: options.rightTopTemplate || '<span id="rightTitle-' + uuid + '" class="ui-chooselist-title"></spans>',
            widget: !! options.widget.onGetSelectedItems ? options.widget : {
                type: "Tree",
                textField: "val",
                valueField: "id",
                onGetSelectedItems: function () {
                    return typeof this.getValues === "function" ? this.getValues("chkedLeafNodesArray") : this.getSelectedItems();
                },
                onGetAllItems: function () {
                    return typeof this.getAllLeafItems === "function" ? this.getAllLeafItems() : this.getAllItems();
                },
                onRemoveItems: function (items) {
                    if (typeof this.delNode === "function") {
                        var tree = this;
                        fastDev.each(items, function (idx, item) {
                            tree.hideNode(item.id);
                        });
                    } else {
                        this.removeItems(items);
                    }
                },
                onAddItems: function (items) {
                    if (typeof this.addNode === "function") {
                        var tree = this;
                        fastDev.each(items, function (idx, item) {
                            tree.showNode(item.id);
                        });
                    } else {
                        this.addItems(items);
                    }
                },
                options: {
                    topParentid: options.topParentId,
                    showIco: true,
                    openFloor: 2,
                    treeType: "multitree",
                    onAfterLoadInit: function () {
                        global.data = this.getAllLeafItems();
                        global.size = global.data.length;
                        global.suggestion.setItems(global.data);
                        options.onAfterInit.call(that);
                    }
                }
            }
        });
    },
    construct: function (options, global) {
        var that = this,
            uuid = global.uuid;
        fastDev.apply(global, {
            leftTitle: this.find("[id='leftTitle-" + uuid + "']"),
            rightTitle: this.find("[id='rightTitle-" + uuid + "']"),
            suggestion: fastDev.create("AutoComplete", {
                container: this.find("[id='search-" + uuid + "']"),
                width: "100%",
                showSearchIcon: true,
                noResultsText: options.noResultsText,
                fields: [{
                    name: "val",
                    mapping: "text"
                }],
                onChange: function (value) {
                    if (!fastDev.Util.StringUtil.trim(value)) {
                        global.comboList.hide();
                        that.setWidget(global.tree.show());
                    }
                },
                onBeforeRetrieve: function () {
                    if (global.changed) {
                        this.setItems(global.tree.getAllLeafItems());
                        global.changed = false;
                    }
                },
                onAfterRetrieve: function (data, keyword) {
                    if ( !! data && !! data.length) {
                        global.tree.hide();
                        that.setWidget(global.comboList.clean());
                        for (var i = 0; i < data.length; i++) {
                            data[i].text = data[i].val;
                            data[i].value = data[i].id;
                        }
                        global.comboList.addItems(data).show();
                        return false;
                    } else {
                        global.comboList.hide();
                        that.setWidget(global.tree.show());
                    }
                }
            }),
            comboList: fastDev.create("ChooseList.ComboList", {
                container: options.widget.options.container,
                width: options.widget.options.width,
                height: options.widget.options.height,
                enabledDataProxy: false,
                enabledInitProxy: false,
                onDoubleClick: function (event, item) {
                    that.select(item);
                }
            }).hide(),
            tree: this.getWidget()
        });
    }
});
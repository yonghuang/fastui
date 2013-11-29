/*
 * @class fastDev.Ui.contextMenu
 * @extends fastDev.Ui.Component
 */
fastDev.define( "fastDev.Ui.contextMenu", {
    extend : "fastDev.Ui.Component",
    alias : "contextMenu",
    _options : {
        /*
         * 合法的json数据源url
         * @type {String}
         */
        treeInitSource : "",
        /*
         * 数据源,如果存在则treeInitSource失效
         * @type {Array}
         */
        items : null,
        /*
         *  初始化右框的值
         *  @type {String}
         *  @default null
         */
        InitRightData : "",
        /*
         * 搜索框ID
         * @type {String}
         * @default contextmenu_search_boxid
         */
        searchBoxId : "contextmenu_search_boxid",
        /*
         * 搜索按钮ID
         * @type {String}
         * @default contextmenu_search_buttonid
         *
         */
        searchButtonId : "contextmenu_search_buttonid",
        /*
         * 默认使用的语言
         * @type {String}
         * @default 通讯录(@@人)@@接收人(@@人)
         */
        initLanguageData : "通讯录(@@人)@@接收人(@@人) ",
        /* 
         *  左侧框ID
         *  @type {String}
         *  @default contextmenuleft_boxid
         */
        leftBoxId : "contextmenu_left_boxid",
        /*
         * 右侧框ID
         *  @type {String}
         * @default contextmenu_right_boxid
         */
        rightBoxId : "contextmenu_right_boxid",
        /*
         * 限制右侧个数
         * @type {Number}
         * @default null
         */
        rightLimitNum : null,
        /*
         * 左侧数据总和ID
         * @type {Number}
         * @default contextmenu_left_numid
         */
        leftNumId : "contextmenu_left_numid",
        /*
         * 右侧数据总和ID
         * @type {Number}
         * @default contextmenu_right_numid
         */
        rightNumId : "contextmenu_right_numid",
        /*
         * 是否需要多选按钮
         * @type {Boolean} 为true时打开
         * @default false
         */
        needControlAll : false,
        /*
         * 全部移动到左侧按钮ID
         * @type {String}
         * @default contextmenu_controlallleft_id
         */
        controlAllLeftId : "contextmenu_controlallleft_id",
        /*
         * 全部移动到右侧按钮ID
         * @type {String}
         * @default contextmenu_controlallright_id
         */
        controlAllRightId : "contextmenu_controlallright_id",
        /*
         * 隐藏ID保存数据
         * @type {String}
         * @default contextmenu_data_id
         */
        contextMenuDataId : "contextmenu_data_id",
        /*
         * 隐藏ID保存数据
         * @type {String}
         * @default contextmenu_data_name
         */
        contextMenuDataName : "contextmenu_data_name",
        /*
         * 默认树的根节点
         * @type {String}
         * @default 0
         */
        topParentid : "0",
        /*
         * 提交表单ID
         * @type {String}
         * @default contextmenu_submit_id
         */
        submitId : "contextmenu_submit_id"
        
    },
    _global : {
        source : null,
        controlA : null,
        div5 : null,
        ul2 : null,
        span2 : null,
        span5 : null,
        input3 : null,
        leftDom : null
    },
    /*
     * 构建控件
     * @param {Object} options 公共属性
     * @param {Object} global 全局变量
     * @protected
     */
    construct : function(options, global) {
        var shell = talkweb.BaseControl.Div();
        this.storage( shell[0] );
        this.constructItem();
    },
    /*
     * 构建view层
     * @protected
     */
    constructItem : function() {
        var that = this, cacheID = talkweb.ControlBus.getID(), options = this.getOptions(), 
        div1 = talkweb.BaseControl.Div( {
            className : "contextmenu-body",
            container : this
        } ), div2 = talkweb.BaseControl.Div( {
            className : "contextmenu-left",
            container : div1
        } ), div3 = talkweb.BaseControl.Div( {
            className : "contextmenu-title",
            container : div2
        } ), div4 = talkweb.BaseControl.Div( {
            className : "contextmenu-searchbox",
            container : div2
        } ), div6 = talkweb.BaseControl.Div( {
            className : "contextmenu-center",
            container : div1
        } ), div7 = talkweb.BaseControl.Div( {
            className : "contextmenu-right",
            container : div1
        } ), div8 = talkweb.BaseControl.Div( {
            className : "contextmenu-title",
            container : div7
        } ), div9 = talkweb.BaseControl.Div( {
            className : "contextmenu-rightbox",
            container : div7
        } ), div5 = talkweb.BaseControl.Div( {
            id : options.leftBoxId,
            className : "contextmenu-leftbox",
            container : div2
        } );
        var contextmenuLang = options.initLanguageData.split( "@@" );
        var span1 = talkweb.BaseControl.Span( {
            container : div3,
            value : contextmenuLang[0]
        } ), span2 = talkweb.BaseControl.Span( {
            id : options.leftNumId,
            container : div3,
            value : 0
        } ), span3 = talkweb.BaseControl.Span( {
            container : div3,
            value : contextmenuLang[1]
        } ), span4 = talkweb.BaseControl.Span( {
            container : div8,
            value : contextmenuLang[2]
        } ), span5 = talkweb.BaseControl.Span( {
            id : options.rightNumId,
            container : div8,
            value : "0"
        } ), span6 = talkweb.BaseControl.Span( {
            container : div8,
            value : contextmenuLang[3]
        } );
        var controlA = talkweb.BaseControl.Anchor( {
            container : div6,
            href : "#",
            title : "选中目标移动"
        } );
        if ( options.needControlAll === true ) {
            var controlA1 = talkweb.BaseControl.Anchor( {
                container : div6,
                href : "#",
                className : "all",
                title : "全部目标右移"
            } ), controlA2 = talkweb.BaseControl.Anchor( {
                container : div6,
                href : "#",
                className : "right",
                title : "全部目标左移"
            } );
            controlA1.onClick( this.bindEventlistener( this, this.controlAll ) );
            controlA2.onClick( this.bindEventlistener( this, this.controlRight ) );
        }
        var input1 = talkweb.BaseControl.Text( {
            container : div4,
            id : options.searchBoxId,
            className : "ntxt"
        } ), input2 = talkweb.BaseControl.Button( {
            container : div4,
            id : options.searchButtonId,
            className : "nbtn"
        } ), input3 = talkweb.BaseControl.Hidden( {
            container : div1,
            id : options.contextMenuDataId,
            name : options.contextmenu_data_name
        } );
        var ul2 = talkweb.BaseControl.Ul( {
            container : div9,
            id : options.rightBoxId
        } );
        that.setGlobal( {
            controlA : controlA,
            div5 : div5,
            ul2 : ul2,
            span2 : span2,
            span5 : span5,
            input3 : input3
        } );
        
        if(options.items !== null) {
            this.setGlobal( {
                source : options.items
            } );
            this.createTree();
        }else{
            
           var ajax = talkweb.Tools.queueFn.getInstance( {
                fnType : "ajax",
                url : options.treeInitSource,
                parameters : "cacheID=" + cacheID,
                callback : function(data) {
                    var items = talkweb.DataBus.getCache( cacheID );
                    if ( !items ) {
                        items = eval( data );
                    }
                    
                    that.setGlobal( {
                        source : items
                    } );
                    that.createTree();
                }
            } );
            talkweb.DataBus.execute( ajax ); 
        }
        

    },
    /*
     * 创建树
     * @private
     */
    createTree : function() {
        var options = this.getOptions(), global = this.getGlobal();
        var div5 = global.div5, ul2 = global.ul2, treeSource = global.source;
        if ( treeSource ) {
            //console.log(treeSource);
            var usetree = talkweb.Components.Tree( {
                container : div5,
                items : treeSource,
                autoLoadData : true,
                topParentid : options.topParentid,
                treeType : "multitree",
                showIco : true,
                id : "ctree",
                saveInstance : true
            } );
            //console.log("test",treeSource);

            //关键一步，取出全部的数据
            var leftDom = [];
            for ( i = 0; treeSource[i]; i++ ) {
                if ( treeSource[i]['ismen'] === "1" ) {
                    leftDom.push( treeSource[i] );
                }
            }
            //console.log("yyy",leftDom);
            //var leftDom = $("span.ui-tree-span-ico-leaf");
            //把节点先保存到全局变量
            this.setGlobal( {
                leftDom : leftDom
            } );
            //取出树中所有的数据项，有的可能不是数据
            var leftAllData = $( ".ui-tree-span-ico-leaf" ), leftStr = ",";
            //设置总数
            var leftDomLen = leftDom.length;
            //把所有的数据放到右侧框隐藏起来
            var right_data = "";
            if ( typeof options.InitRightData === "function" ) {
                right_data = options.InitRightData();
            } else {
                right_data = options.InitRightData;
            }
            //alert(right_data);
            for ( var i = 0; i < leftDomLen; i++ ) {
                var rightLiId = leftDom[i]["id"];
                var rclssName = "contextMenu_hide";
                if ( right_data ) {
                    var rightData = "," + right_data + ",";
                    if ( rightData.indexOf( "," + rightLiId + "," ) !== -1 ) {
                        rclssName = "contextMenu_show";
                        document.getElementById( "tckb_" + rightLiId ).className = "ui-tree-chk-readonly-selected";
                    }
                }
                var liId = talkweb.BaseControl.Li( {
                    container : ul2,
                    id : "rightli" + rightLiId,
                    className : rclssName
                } );
                var spanId = talkweb.BaseControl.Span( {
                    container : liId,
                    value : leftDom[i]["val"]
                } );
                var aId = talkweb.BaseControl.Anchor( {
                    container : liId,
                    href : "#" + rightLiId,
                    title : "清除"
                } );
                //过滤树中不是数据的项
                leftStr += leftDom[i]["id"] + ",";
            }
            //过滤树中不是数据的项
            for ( var i = 0, len = leftAllData.length; i < len; i++ ) {
                var currentId = leftAllData[i].previousSibling.id.replace( "tckb_", "" );
                if ( leftStr.indexOf( "," + currentId + "," ) === -1 ) {
                    leftAllData[i].className = "ui-tree-span-ico-open";
                }
            }
            //设置移动事件
            global.controlA.onClick( this.bindEventlistener( this, this.controlLi ) );
            global.ul2.onClick( this.bindEventlistener( this, this.controlDel ) );
            this.searchTree();
            this.getValue();
        }

    },
    /*
     * 控制移动按钮
     * @private
     */
    controlLi : function() {
        var that = this, options = this.getOptions(), global = this.getGlobal(), leftDom = global.leftDom, nodeArr = $( ".ui-tree-chk-selected" ), cIds = ",", rightlimit = options.rightLimitNum;
        for ( var i = 0, len = nodeArr.length; i < len; i++ ) {
            cIds += nodeArr[i].id.replace( "tckb_", "" ) + ",";
        }
        if ( nodeArr.length > 0 ) {
            var len = leftDom.length;
            for ( var i = 0; i < len; i++ ) {
                //限制右侧的个数
                if ( rightlimit && !isNaN( rightlimit ) ) {
                    if ( this.checkRightLimit() === false ) {
                        break;
                    }
                }
                var nodeid = leftDom[i]["id"];
                if ( cIds.indexOf( "," + nodeid + "," ) !== -1 ) {
                    document.getElementById( "rightli" + nodeid ).className = "contextMenu_show";
                    document.getElementById( "tckb_" + nodeid ).className = "ui-tree-chk-readonly-selected";
                }

            }
        }
        this.getValue();
    },
    /*
     * 限制右侧的个数
     * @private
     */
    checkRightLimit : function() {
        var rightlimit = this.getOptions().rightLimitNum;
        if ( !isNaN( rightlimit ) ) {
            rightnum = $( "li.contextMenu_show" ).length;
            if ( rightnum >= rightlimit ) {
                return false;
            }
        }
    },
    /*
     * 全部左移
     */
    controlAll : function() {
        var options = this.getOptions(), global = this.getGlobal(), div5 = global.div5, rightlimit = options.rightLimitNum;
        $( "#" + options.leftBoxId ).html( "" );
        $( "#" + options.rightBoxId ).html( "" );
        this.createTree();
        var rightDom = $( "li.contextMenu_hide" );
        for ( var i = 0, rightLen = rightDom.length; i < rightLen; i++ ) {
            if ( rightlimit && !isNaN( rightlimit ) ) {
                if ( this.checkRightLimit() === false ) {
                    break;
                }
            }
            rightDom[i].className = "contextMenu_show";
        }
        var leftDoms = $( "span[id^='tckb_']" );
        for ( var i = 0, leftLen = leftDoms.length; i < leftLen; i++ ) {
            leftDoms[i].className = "ui-tree-chk-readonly-selected";
        }
        this.getValue();
    },
    /*
     * 全部右移
     */
    controlRight : function() {
        var options = this.getOptions(), global = this.getGlobal(), div5 = global.div5;
        $( "#" + options.leftBoxId ).html( "" );
        $( "#" + options.rightBoxId ).html( "" );
        this.createTree();
        var rightDom = $( "li.contextMenu_show" );
        for ( var i = 0, rightLen = rightDom.length; i < rightLen; i++ ) {
            rightDom[i].className = "contextMenu_hide";
        }
        var leftDoms = $( "span[id^='tckb_']" );
        for ( var i = 0, leftLen = leftDoms.length; i < leftLen; i++ ) {
            leftDoms[i].className = "ui-tree-chk";
        }
        this.getValue();
    },
    /*
     * 设置删除单项
     * @private
     */
    controlDel : function(event) {
        var that = this, options = this.getOptions();
        //srcElement IE
        var obj = event.srcElement || event.target;
        var name = obj.name || obj.tagName.toLowerCase();
        if ( name === "a" ) {
            $( this[0] ).unbind( "click" );
            $( this[0] ).click( function(e) {
                var clickHref = $(e.target)[0].toString();
                clickId = clickHref.substring( clickHref.indexOf( "#" ) + 1, clickHref.length );
                if ( document.getElementById( "rightli" + clickId ) !== null ) {
                    document.getElementById( "rightli" + clickId ).className = "contextMenu_hide";
                    //document.getElementById("tckb_" + clickId).className =
                    // "ui-tree-chk-selected";
                    document.getElementById( "tckb_" + clickId ).className = "ui-tree-chk";
                    that.checkTop( clickId );
                }
                void (0);
                that.getValue();
            } );
        }

    },
    /*
     * 检测上级菜单
     * @private
     */
    checkTop : function(id) {
        var ulId = document.getElementById( id ).parentNode;
        if ( ulId.parentNode.id !== "ctree" ) {//不对根节点做处理
            var classNums = this.getClassTags( ulId, "span", "ui-tree-chk-readonly-selected" ).length;
            if ( classNums == 0 ) {
                topDom = ulId.previousSibling;
                topDom && (topDom.childNodes[1].className = "ui-tree-chk");
            }
        }
        //检查右侧如果为空的清况下左侧全部不选择
        var rightDom = $( ".contextMenu_show" ).length;
        if ( rightDom === 0 ) {
            var leftDomStr = $( "span[class^='ui-tree-chk']" );
            for ( var i = 0, l = leftDomStr.length; i < l; i++ ) {
                leftDomStr[i].className = "ui-tree-chk";
            }
        }
    },
    /*
     * 得到classname
     * @private
     */
    getClassTags : function(oElm, strTagName, strClassName) {
        var arrElements = (strTagName == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName( strTagName );
        var arrReturnElements = new Array();
        strClassName = strClassName.replace( /\-/g, "\\-" );
        var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
        var oElement;
        for ( var i = 0, l = arrElements.length; i < l; i++ ) {
            oElement = arrElements[i];
            if ( oRegExp.test( oElement.className ) ) {
                arrReturnElements.push( oElement );
            }
        }
        return (arrReturnElements);
    },
    /*
     * 搜素事件
     * @private
     */
    searchTree : function() {
        var options = this.getOptions(), that = this;
        var searchButton = document.getElementById( options.searchButtonId );
        var searchValueId = document.getElementById( options.searchBoxId );
        //注册点击按钮事件
        //console.log(searchButton);
        searchButton && this.registerEvent( searchButton, "click", searchEvent );
        //添加回车事件
        searchValueId && this.registerEvent( searchValueId, "keydown", btnkeydown );
        function btnkeydown(e) {
            var currKey = 0, e = e || event;
            currKey = e.keyCode || e.which || e.charCode;
            if ( currKey == 13 ) {
                searchEvent();
            }
        }

        function searchEvent() {
            var searchValue = searchValueId.value;
            var resultArr = [];
            var global = that.getGlobal(), treeDom = global.leftDom;
            var treeID = document.getElementById( "ctree" );
            if ( searchValue !== "" ) {
                for ( var i = 0, len = treeDom.length; i < len; i++ ) {
                    var searchData = treeDom[i]["val"];
                    var searchId = treeDom[i]["id"];
                    if ( searchData.indexOf( searchValue ) !== -1 ) {
                        resultArr.push( searchId );
                    }
                }
                treeDom = null;
                var resultLen = resultArr.length;
                //如果存在搜索结果
                if ( resultLen > 0 ) {
                    treeID.childNodes[0].style.display = "none";
                    var contextmenu_searchUlbox = document.createElement( "ul" );
                    contextmenu_searchUlbox.id = "contextmenu_searchUlbox";
                    contextmenu_searchUlbox.className = "ui-tree-ul-line-no";
                    treeID.appendChild( contextmenu_searchUlbox );
                    var searchBoxId = document.getElementById( "contextmenu_searchUlbox" );
                    searchBoxId.innerHTML = "";
                    for ( var i = 0; i < resultLen; i++ ) {
                        var oparentNode = document.getElementById( resultArr[i] ).cloneNode( true );
                        var copyLi = searchBoxId.appendChild( oparentNode );
                        var currentNode = searchBoxId.childNodes[i].childNodes[0];
                        currentNode.childNodes[0].style.display = "none";
                        currentNode.childNodes[1].className = "ui-tree-chk-selected";
                    }
                } else {
                    alert( searchValue + "不存在，请您从新搜索！" );
                    document.getElementById( options.searchBoxId ).value = "";
                    document.getElementById( options.searchBoxId ).focus();
                    treeID.childNodes[0].style.display = "";
                    document.getElementById( "contextmenu_searchUlbox" ) && (document.getElementById( "contextmenu_searchUlbox" ).innerHTML = "");
                }
            } else {
                treeID.childNodes[0].style.display = "";
                document.getElementById( "contextmenu_searchUlbox" ) && (document.getElementById( "contextmenu_searchUlbox" ).innerHTML = "");
            }
        }

    },
    /*
     *  统计数据，获取值
     *  @return value
     */
    getValue : function() {
        var options = this.getOptions(), global = this.getGlobal();
        var leftDom = global.leftDom, span2 = global.span2, span5 = global.span5, input3 = global.input3;
        var rightDom = $( "li.contextMenu_show" );
        var rightLen = rightDom.length;
        var leftLen = leftDom.length - rightLen;
        span5.setText( rightLen );
        span2.setText( leftLen );
        var str = "";
        for ( var i = 0; i < rightLen; i++ ) {
            str += "@" + rightDom[i].id.slice( 7 ) + "," + rightDom[i].firstChild.innerHTML;
        }
        str = str.slice( 1 );
        input3.setValue( str );
        return str;
    }
} );


(function() {
    talkweb.Components.MessageBoard = function(param) {
        return talkweb.Tools.clone(talkweb.Components.MessageBoard.Class).initConfig(param).construct();
    };

    talkweb.Components.MessageBoard.Class = talkweb.Tools.extend(talkweb.Components.ComplexControl());
    talkweb.Tools.extendProperty(true, talkweb.Components.MessageBoard.Class, {
        initConfig : function(param) {
            var options = {
                /*! 
                 *  @name initSource
                 *  @explain 设置消息板的数据来源
                 *  @description 合法的URL地址
                 *  @default ------
                 !*/
                initSource : null,
                /*! 
                 *  @name more
                 *  @explain 设置“更多”选项的文本提示
                 *  @description 字符串
                 *  @default "更多"
                 !*/
                more : "更多",
                /*! 
                 *  @name moreUrl
                 *  @explain 设置“更多”选项的URL链接
                 *  @description 合法的URL地址
                 *  @default ------
                 !*/
                moreUrl : null,
                 /*! 
                 *  @name maxCount
                 *  @explain 设置消息最多显示条目数
                 *  @description 数字型参数
                 *  @default 10
                 !*/
                maxCount : 10,
                 /*! 
                 *  @name title
                 *  @explain 设置消息板标题
                 *  @description 字符串
                 *  @default "消息板"
                 !*/
                title : "消息板",
                /*! 
                 *  @name target
                 *  @explain 当useScript为false时，此设置有效，设置目标页面在哪打开
                 *  @description "_blank"、"_self"、"_parent"、"_top"
                 *  @default "_blank"
                 !*/
                target : "_blank",
                /*! 
                 *  @name useScript
                 *  @explain 为true时表示点击链接时触发script属性设置的脚本，为flase时表示打开数据源中配置的URL地址
                 *  @description 布尔类型的true或false
                 *  @default false
                 !*/
                useScript : false,
                /*& 
                 *  @name script
                 *  @explain useScript为true时，此设置有效
                 *  @description js函数
                 *  @default ------
                 &*/
                script : null,
                width : "100%"
            };
            var global = {};
            this.initGlobal(global);
            this.extendOptions(options, param);
            return this;
        },
        /*
         * 构建控件
         */
        construct : function() {
            talkweb.Components.MessageBoard.Class.superClass.construct.call(this);
            var options = this.getOptions(), shell = talkweb.BaseControl.Div({
                width : options.width
            });
            this.storage(shell[0]);
            var head = talkweb.BaseControl.Div({
                className : "messageboard_header"
            });
            var title = talkweb.BaseControl.Span({
                container : head
            });
            var body = talkweb.BaseControl.Div({
                className : "messageboard_content"
            });
            var foot = talkweb.BaseControl.Div({
                className : "messageboard_footer"
            });
            var moreOptions = {
                container : foot,
                value : options.more
            };
            options.moreUrl && (moreOptions.href = options.moreUrl);
            talkweb.BaseControl.Anchor(moreOptions);
            this.append(head).append(body);
            foot && this.append(foot);
            this.setOptions({
                head : title,
                body : body
            });
            this.init();
            return this;
        },
        /*
         * 初始化控件
         */
        init : function() {
            var options = this.getOptions();
            this.setTitle(options.title);
            talkweb.Components.MessageBoard.Class.superClass.init.call(this);
        },
        /*
         * 解析控件数据源
         */
        constructItems : function(items) {
            var options = this.getOptions();
            var ul = talkweb.BaseControl.Ul({
                container : options.body
            });
            if( items instanceof Array) {
                var id, text, href, additional, target = options.target;
                for(var i = 0; i < options.maxCount; i++) {
                    if(i < items.length) {
                        id = items[i].id;
                        text = items[i].text;
                        additional = items[i].additional;
                        href = items[i].href;
                    } else {
                        id = "";
                        text = "";
                        additional = "";
                        href = "javascript:void(0);";
                        target = "";
                    }
                    var li = talkweb.BaseControl.Ul.Li({
                        container : ul
                    });
                    var div1 = talkweb.BaseControl.Div({
                        container : li
                    });
                    var span = talkweb.BaseControl.Span({
                        container : div1,
                        value : additional
                    });
                    var div2 = talkweb.BaseControl.Div({
                        container : li
                    });
                    options.useScript === true && ( href = "javascript:void(0);") && ( target = "");
                    var a = talkweb.BaseControl.Anchor({
                        container : div2,
                        value : text,
                        href : href,
                        title : text,
                        target : target,
                        id : id
                    });

                    if(i < items.length) {options.useScript === true && options.script && a.onClick(function(event) {
                            var obj = event.srcElement || event.target;
                            control = talkweb.BaseControl.Anchor({}, false).reConstruct(obj);
                            options.script.call(a, control.getID(), control.getValue());
                            return false;
                        });
                    } else {
                        a[0].innerHTML = "&nbsp;";
                        span[0].innerHTML = "&nbsp;";
                    }
                }
            }
        },
        setTitle : function(text) {
            var options = this.getOptions();
            text || ( text = "消息板");
            options.head.setValue(text);
            return this;
        }
    });
})()
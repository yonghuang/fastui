/**
 * @class fastDev.Ui.FileUpload
 * @extends fastDev.Ui.Box
 * @author chengwei
 * <p>HTML文件上传控件。</p>
 * <p>使用纯HTML实现页面无刷新文件上传功能。</p>
 * <p>支持多文件队列，以及选取文件后自动上传文件等。</p>
 * <p>作者：程伟</p>
 *     
 *     <input itype="FileUpload" action="../../data/fileupload.jsp"/>
 */
fastDev.define("fastDev.Ui.FileUpload", {
    alias: "FileUpload",
    extend: "fastDev.Ui.Box",
    _options: {
        /**
         * 文件上传后台处理程序链接
         * @type {String}
         */
        action: "",
        /**
         * 文件域表单请求参数名
         * @type {String}
         */
        name: "",
        /**
         * 是否显示文件域的文本输入框
         * @type {Boolean}
         */
        showTextInput: true,
        /**
         * 是否显示"上传"按钮
         * 指定为自动上传时不会显示上传按钮
         * @type {Boolean}
         */
        showUploadBtn: true,
        /**
         * 是否在上传进行时显示loading图标
         * @type {Boolean}
         */
        showLoading: true,
        /**
         * "浏览文件"按钮配置
         * @type {Object}
         */
        chooseBtn: {},
        /**
         * "上传文件"按钮配置
         * @type {Object}
         */
        uploadBtn: {},
        /**
         * 是否在选取文件后自动开始上传
         * 开启自动上传功能 后，文件仅在验证通过后才会开始上传
         * @type {Boolean}
         */
        autoUpload: false,
        /**
         * 是否允许上传多个文件
         * 若已开启自动上传，则总是允许上传多个文件
         * @type {Boolean}
         */
        multiple: false,
        /**
         * 单个可上传文件的最大字节数限制
         * 单位为千字节（KB）
         * -1表示可上传文件大小不受限制（默认为 10 MB）
         * @type {Number}
         */
        sizeLimit: 10240,
        /**
         * 允许上传的文件扩展名（扩展名并非文件真实的MIME类型，真实的文件类型需由后台处理程序验证）
         * 参数为字符串时，扩展名用逗号分隔
         * 空串或空数组则表示文件扩展名不受限制
         * @type {String|Array}
         */
        typeLimit: [],
        /**
         * 指定可上传文件文件数限制
         * -1表示可上传任意数量的文件
         * @type {Number}
         */
        fileLimit: null,
        /**
         * 额外附加的查询参数，对象的属性名为参数名，属性值为参数值
         * 也可以调用addParams(obj)方法来动态变更查询参数
         * @type {Object}
         */
        params: {},
        /**
         * 在自动上传的情况下，当文件上传失败时，是否继续上传文件队列中的其他文件
         * 参数值为false时，将会继续上传其他文件
         * 也可通过调用stopUpload()方法来终止整个上传进程
         * @type {Boolean}
         */
        stopOnFailed: false,
        /**
         * 用户选取文件后的回调函数
         * 回调函数返回false，则表示放弃此次选取
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值，可以根据该ID值调用startUpload(id)方法上传该文件
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @event
         */
        onFileChoose: function (file) {},
        /**
         * 选取失败时回调函数
         * 默认的回调处理函数提供简单的错误提示，可自定义该回调函数来处理错误信息
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @param {String} code 错误代码，为以下常量（数值类型）：
         * <p>1 - 文件扩展名受限</p>
         * <p>2 - 文件大小受限</p>
         * <p>3 - 超过最大可上传文件数</p>
         * @param {String} msg 默认的错误提示消息
         * @event
         */
        onChooseError: function (file, code, msg) {
            fastDev.tips(msg);
        },
        /**
         * 每个文件上传开始时的回调函数
         * 回调函数返回false，则取消上传该文件
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @event
         */
        onUploadStart: function (file) {},
        /**
         * 文件上传被取消时的回调函数
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @event
         */
        onUploadCancel: function (file) {
            fastDev.tips("文件 " + file.name + " 已经取消上传");
        },
        /**
         * 每个文件上传成功时的回调函数
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @param {Object|String} response 服务器端返回的上传结果，若上传发生异常或服务器端未返回任何结果，则其值为null
         * @event
         */
        onUploadSuccess: function (file, response) {
            fastDev.tips("文件 " + file.name + " 上传成功");
        },
        /**
         * 每个文件上传失败时的回调函数
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @param {Object|String} response 服务器端返回的上传结果，若上传发生异常或服务器端未返回任何结果，则其值为null
         * @event
         */
        onUploadFail: function (file, response) {
            fastDev.tips("文件 " + file.name + " 上传失败");
        },
        /**
         * 每个文件上传完成后的回调函数
         * <strong>回调函数返回布尔值false，则表示上传失败，无返回值或者返回非布尔值false则表示上传成功</strong>
         * 传递参数file为当前上传文件对象，response为服务器返回的上传结果JSON对象或字符串（不能解析为JSON对象时）
         * 注意！若上传发生异常或服务器未返回任何结果时，参数response为null
         * 默认回调是根据后台默认处理程序的返回结果来判断文件上传成功与否并给与相关提示的
         * 可以通过重定义该回调函数，然后自己处理后台处理程序的返回结果（上传失败的话，必须返回false值来通知控件更新上传状态）
         * <p>若上传成功，则会回调onUploadSuccess函数</p>
         * <p>若上传失败，则会回调onUploadFail函数</p>
         * 回调函数内this指向本控件
         * @type {Function}
         * @param {Object} file 文件对象
         * @param {String} file.id 文件ID值
         * @param {String} file.path 文件物理路径
         * @param {String} file.name 文件名称
         * @param {String} file.type 文件扩展名
         * @param {Number} file.size 文件大小，当js不能获取该值时，其值为null
         * @param {Object|String} response 服务器端返回的上传结果，若上传发生异常或服务器端未返回任何结果，则其值为null
         * @return {Boolean} 若上传失败，请返回布尔值false来更新控件内部状态
         * @event
         */
        onUploadComplete: function (file, response) {
            // 下面的实现与本控件后台处理程序处理结果绑定，如果更换后台处理程序，请自己实现相应的结果处理
            if (!response) {
                // 上传失败，返回false
                return false;
            }
            if (fastDev.isArray(response) && !! response.length) {
                response = response[0];
                if (!response.allowed || response.missing) {
                    // 上传失败，返回false
                    return false;
                }
            }
        }
    },
    /**
     * 静态模板
     * @param {Object} params 模板参数
     * @private 
     */
    staticTemplate: function (params) {
        var html = [];
        html.push('<form id="fileupload-form-' + params.sequence + '" action="' + params.action + '" method="post" enctype="multipart/form-data" target="fileupload-iframe-' + params.sequence + '" style="width:' + params.width + '">');
        html.push('<table class="ui-form-upload-wrap" style="width:' + params.wrapperWidth + '"><tbody><tr>');
        if (params.showTextInput) {
            html.push('<td id="fileupload-text-box-' + params.sequence + '" class="ui-form-upload-cell"></td>');
        }
        html.push('<td style="width:1px"><div id="fileupload-fileinput-container-' + params.sequence + '" style="position:relative;direction:ltr;overflow:hidden;">');
        html.push('<div id="fileupload-choosebtn-' + params.sequence + '" class="ui-form-upload-btn"></div></div></td>');
        if (params.showUploadBtnContainer) {
            html.push('<td style="width:18px">');
            if (params.showUploadBtn) {
                html.push('<div id="fileupload-uploadbtn-' + params.sequence + '"></div>');
            }
            if (params.showLoading) {
                html.push('<span id="fileupload-loading-' + params.sequence + '" class="ui-loading-indicator" style="display:none;background-position:0 0;padding:0">　</span>');
            }
            html.push('</td>');
        }
        html.push('</tr></tbody></table></form>');
        html.push('<iframe src="about:blank" id="fileupload-iframe-' + params.sequence + '" name="fileupload-iframe-' + params.sequence + '" style="display:none;position:absolute;left:-1000px;width:1px;height:1px"></iframe>');
        return html.join("");
    },
    tplParam: ["sequence", "action", "showTextInput", "showUploadBtnContainer", "id", "width", "wrapperWidth", "name", "showLoading", "showUploadBtn"],
    /**
     * 参数准备
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有变量
     * @protected
     */
    ready: function (options, global) {
        var width;
        options.showTextInput = typeof options.showTextInput === "boolean" ? options.showTextInput : true;
        if (width = /^(-?\d+\.?\d+|-?\d)(px|%|em|cm)?$/.exec(fastDev.Util.StringUtil.trim(options.width + ""))) {
            options.width = width[1] + (width[2] || "px");
        } else {
            options.width = options.showTextInput ? "280px" : "";
        }
        global.wrapperWidth = options.showTextInput ? "100%" : "";
        fastDev.apply(options, {
            id: options.id ? options.id : fastDev.getID(),
            sizeLimit: parseInt(options.sizeLimit, 10) || 10240,
            showLoading: !! options.showLoading,
            params: fastDev.isPlainObject(options.params) ? options.params : {},
            typeLimit: options.typeLimit ? fastDev.isArray(options.typeLimit) ? options.typeLimit : typeof options.typeLimit === "string" ? options.typeLimit.split(",") : [] : [],
            autoUpload: !! options.autoUpload
        });
        fastDev.each(["FileChoose", "ChooseError", "UploadStart", "UploadCancel", "UploadSuccess", "UploadFail", "UploadComplete"], function (i, name) {
            options["on" + name] = typeof options["on" + name] === "function" ? options["on" + name] : fastDev.noop;
        });
        options.showUploadBtn = options.autoUpload ? false : typeof options.showUploadBtn === "boolean" ? options.showUploadBtn : true;
        options.fileLimit = parseInt(options.fileLimit, 10);
        options.fileLimit = fastDev.isNumber(options.fileLimit) ? options.fileLimit : -1;
        options.multiple = options.autoUpload || !! options.multiple;
        fastDev.apply(global, {
            // "浏览文件"按钮默认配置
            chooseBtnOpts: {
                text: "浏览..."
            },
            // "上传文件"按钮默认配置
            uploadBtnOpts: {
                text: "上传"
            },
            sequence: fastDev.getID(),
            showUploadBtnContainer: options.showUploadBtn || options.showLoading,
            onBlur: fastDev.noop,
            // 当前窗口unload事件（特殊事件，可能会被用户事件覆盖）
            winBeforeUnloadEvent: fastDev.setFnInScope(this, this.winBeforeUnloadEvent)
        });
    },
    /**
     * 构造控件
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有变量
     * @protected
     */
    construct: function (options, global) {
        var sequence = global.sequence,
            chooseBtnContainer;
        // 添加浏览文件按钮
        // 合并用户配置
        fastDev.apply(global.chooseBtnOpts, options.chooseBtn);
        global.chooseBtnOpts.container = chooseBtnContainer = this.find("[id='fileupload-choosebtn-" + sequence + "']");
        if (options.showTextInput) {
            options.width = "100%";
            options.iwidth = "100%";
            options.container = this.find("[id='fileupload-text-box-" + sequence + "']");
            global.textBox = fastDev.create("TextBox", options).setReadonly(true);
        }
        if (options.showUploadBtn) {
            // 添加上传文件按钮
            var that = this;
            fastDev.apply(global.uploadBtnOpts, options.uploadBtn);
            global.uploadBtnOpts.container = global.uploadBtnContainer = this.find("[id='fileupload-uploadbtn-" + sequence + "']");
            global.uploadBtnClick = global.uploadBtnOpts.onclick;
            global.uploadBtnClick = typeof global.uploadBtnClick === "function" ? global.uploadBtnClick : fastDev.noop;
            global.uploadBtnOpts.onclick = function (event) {
                global.uploadBtnClick.apply(this, arguments);
                that.uploadEventHandle();
            };
            global.uploadBtn = fastDev.create("Button", global.uploadBtnOpts);
        }
        // 保存控件结构对象
        fastDev.apply(global, {
            textInput: this.find("[id='" + options.id + "']"),
            iframe: this.find("[id='fileupload-iframe-" + sequence + "']"),
            form: this.find("[id='fileupload-form-" + sequence + "']"),
            fileContainer: this.find("[id='fileupload-fileinput-container-" + sequence + "']"),
            chooseBtnContainer: chooseBtnContainer,
            chooseBtn: fastDev.create("Button", global.chooseBtnOpts),
            loading: this.find("[id='fileupload-loading-" + sequence + "']"),
            win: fastDev(window)
        });
        global.iframeElement = global.iframe.elems[0];
        if (fastDev.Browser.isIE6) {
            // IE6存在容器高度未显示设置时，overflow样式失效的bug
            global.fileContainer.css("height", global.fileContainer.height());
        }
    },
    /**
     * 初始化
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有变量
     * @protected
     */
    init: function (options, global) {
        var that = this;
        // 初始一个文件域，若为Flash按钮，则不初始HTML上传按钮
        if (!global.isSWFUploader) {
            global.fileContainer.append(this.createFileInput());
        }
        // 绑定相关事件
        global.fileContainer.bind("mouseover", function () {
            global.chooseBtnContainer.addClass("ui-button-over");
        }).bind("mouseout", function () {
            global.chooseBtnContainer.removeClass("ui-button-over");
        });
        // 初始文件队列
        global.fileQueue = [];
        // 统计对象
        global.fileStats = {
            success: 0,
            failed: 0,
            cancelled: 0
        };
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
     * 上传按钮点击事件回调
     * @private
     */
    uploadEventHandle: function () {
        if (!this._options.readonly) {
            this.startUpload();
        }
    },
    /**
     * 选取文件
     * @private
     */
    setFile: function () {
        var global = this._global,
            options = this._options,
            // 活动文件域
            fileInput = global.chooseFileInput,
            // 文件域ID
            fileId = fileInput.prop("id"),
            // 文件域的值
            fileValue = fileInput.prop("value"),
            // 文件路径
            filePath = fileValue.replace(/\\/g, "/"),
            // 文件名称
            fileName = filePath.substring(filePath.lastIndexOf("/") + 1),
            // 文件扩展名
            fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase(),
            // 文件对象
            file = fileInput.elems[0].files ? fileInput.elems[0].files[0] : null,
            // 文件大小
            fileSize = file ? file.fileSize ? file.fileSize : file.size : null;
        // 文件对象，包含属性声明如下：
        file = {
            id: fileId,
            path: fileValue,
            name: fileName,
            type: fileExtension,
            size: fileSize
        };
        if (!options.multiple) {
            global.fileQueue = [];
        }
        // 验证文件
        if ( !! filePath && this.checkFile(file) && options.onFileChoose.call(this, file) !== false) {
            this.addFile(file);
            if (options.multiple) {
                fileInput.prop("disabled", "disabled");
                global.fileContainer.append(this.createFileInput());
            }
            if (options.autoUpload) {
                this.startUpload(fileId);
            }
        } else {
            global.textInput.prop("value", "");
            fileInput.prop("value", "");
        }
    },
    /**
     * 创建新的文件域
     * @private
     */
    createFileInput: function () {
        var global = this._global,
            options = this._options,
            newFileInput = fastDev(document.createElement("input")),
            id = fastDev.getID();
        global.chooseFileInput = newFileInput.prop("type", "file")
        // 设置ID
        .prop("id", "file" + id)
        // 设置文件域的名称
        .prop("name", (options.name + "") || ("file" + id))
        // 该样式使得该文件域构成一个假按钮
        .addClass("ui-form-upload-file")
        // 绑定值变更事件，以便对选取的文件进行验证或上传
        .bind("change", fastDev.setFnInScope(this, this.setFile));
        return newFileInput;
    },
    /**
     * 检查文件是否符合上传要求
     * @param {Object} file
     * @return {Boolean}
     * @private
     */
    checkFile: function (file) {
        var options = this._options,
            global = this._global,
            size = file.size,
            extension = file.type,
            valid;
        // 检查是否超过最大可上传文件数限制
        if (options.fileLimit !== -1) {
            if (global.fileQueue.length >= options.fileLimit || global.fileStats.success >= options.fileLimit) {
                options.onChooseError.call(this, file, 3, "超过最大可上传文件数");
                return false;
            }
        }
        // 检查文件扩展名
        if (options.typeLimit.length > 0) {
            fastDev.each(options.typeLimit, function (i, type) {
                valid = (type + "").toLowerCase() === extension;
                return !valid;
            });
            if (!valid) {
                options.onChooseError.call(this, file, 1, "文件类型受到限制");
                return false;
            }
        }
        // 检查文件大小，前端js验证仅适用于某些浏览器
        if ( !! size && options.sizeLimit !== -1) {
            if (options.sizeLimit < size / 1024) {
                options.onChooseError.call(this, file, 2, "文件大小超过限制");
                return false;
            }
        }
        if (size === null && options.sizeLimit !== -1) {
            // 需服务器端验证
            global.needCheckSize = true;
        }
        return true;
    },
    /**
     * 执行上传
     * @param {Object} file 需上传的文件对象
     * @private
     */
    doUpload: function (uploadFile) {
        var global = this._global,
            options = this._options;
        // onUploadStart 回调返回false则取消本文件上传
        if (options.onUploadStart.call(this, uploadFile) !== false) {
            // 设置请求链接地址
            global.form.prop("action", this.getRequestAction());
            global.iframe.bind("load", global.iframeLoadEvent || (global.iframeLoadEvent = fastDev.setFnInScope(this, this.doComplete)));
            this.uploadReady();
            // 正在上传
            global.uploadFile = uploadFile;
            global.form.elems[0].submit();
        } else if (global.uploadAllFile) {
            this.startUpload();
        }
    },
    /**
     * 窗口卸载前回调事件
     * @private
     */
    winBeforeUnloadEvent: function () {
        var file = this._global.uploadFile;
        return "文件" + ( !! file ? file.name : "") + "正在上传中，确定中断上传并离开此页？";
    },
    /**
     * 上传前的最后准备工作
     * @private
     */
    uploadReady: function () {
        var global = this._global,
            options = this._options;
        global.win.bind("beforeunload", global.winBeforeUnloadEvent);
        global.boundUnloadEventHandle = true;
        global.isUploading = true;
        if (options.showLoading) {
            global.loading.css({
                display: "block",
                width: global.loading.parent().width()
            });
            if (options.showUploadBtn) {
                global.uploadBtnContainer.hide();
            }
        } else if (options.showUploadBtn) {
            global.uploadBtn.disable();
        }
    },
    /**
     * 上传完成后的扫尾工作
     * @private
     */
    uploadFinish: function () {
        var global = this._global,
            options = this._options;
        if (global.boundUnloadEventHandle) {
            global.win.unbind("beforeunload", global.winBeforeUnloadEvent);
            global.boundUnloadEventHandle = false;
        }
        global.isUploading = false;
        global.uploadFile = null;
        if (!options.multiple && !global.isSWFUploader) {
            global.chooseFileInput.prop("value", "");
        }
        if (options.showLoading) {
            global.loading.hide();
            if (options.showUploadBtn) {
                global.uploadBtnContainer.show();
            }
        } else if (options.showUploadBtn) {
            global.uploadBtn.enable();
        }
    },
    /**
     * 文件上传完成时的回调函数
     * @private
     */
    doComplete: function () {
        var options = this._options,
            global = this._global,
            iframe = global.iframeElement,
            uploadFile = global.uploadFile,
            doc, response, json, elem;
        global.iframe.unbind("load", global.iframeLoadEvent);
        this.uploadFinish();
        if (!global.isCancelled) {
            try {
                doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
            } catch (e) {
                // 上传发生异常
                response = null;
            }
            if (doc) {
                response = fastDev.Util.StringUtil.trim(!(elem = fastDev(doc.body).children("pre")).isEmpty() ? elem.elems[0].innerHTML : doc.body.innerHTML);
                try {
                    json = fastDev.Util.JsonUtil.parseJson(response);
                } catch (e) {} finally {
                    response = !! json ? json : response;
                }
                doc.body.innerHTML = "";
            }
            this["do" + (options.onUploadComplete.call(this, uploadFile, response) !== false ? "Success" : "Fail")](uploadFile, response);
        } else if ( !! uploadFile) {
            options.onUploadCancel.call(this, uploadFile);
        }
        global.uploadFileInput.prop("disabled", "disabled");
        global.isCancelled = false;
        if (global.uploadAllFile) {
            // 上传队列中的所有文件
            this.startUpload();
        } else {
            global.chooseFileInput.removeProp("disabled");
        }
    },
    /**
     * 上传成功后执行的操作
     * @param {Object} file
     * @param {Object} response
     * @private
     */
    doSuccess: function (file, response) {
        this._global.fileStats.success++;
        this._options.onUploadSuccess.call(this, file, response);
    },
    /**
     * 上传失败后执行的操作
     * @param {Object} file
     * @param {Object} response
     * @param {String} msg
     * @private
     */
    doFail: function (file, response, msg) {
        var options = this._options;
        this._global.fileStats.failed++;
        this.cleanTextInput();
        if (options.stopOnFailed) {
            this.stopUpload();
        }
        options.onUploadFail.call(this, file, response);
    },
    /**
     * 获取请求链接地址
     * @return {String}
     * @private
     */
    getRequestAction: function () {
        var options = this._options,
            global = this._global,
            // 链接中也许带了查询参数
            query = options.action.indexOf("?") === -1 ? false : true;
        query = query ? options.action : options.action + "?" + fastDev.getID() + "=1";
        // 最大字节数限制
        if (global.needCheckSize) {
            query += "&maxSize=" + options.sizeLimit * 1024;
        }
        for (var key in options.params) {
            query += ("&" + key + "=" + window.encodeURIComponent(options.params[key]));
        }
        return query;
    },
    /**
     * 删除并返回文件队列中指定ID的文件
     * 若ID为null，则删除并返回队列中的第一个文件
     * @param {String} id 文件ID
     * @return {Object} 文件对象
     * @private
     */
    nextFile: function (id) {
        var global = this._global,
            queue = global.fileQueue,
            uploadFile;
        if (id) {
            fastDev.each(queue, function (idx, file) {
                if (file.id === id) {
                    uploadFile = file;
                    // 删除数组中的对应元素
                    queue.splice(idx, 1);
                    return false;
                }
            });
        } else {
            // 返回队列中的第一个文件对象
            uploadFile = queue.shift();
        }
        if (!global.isSWFUploader && !! uploadFile) {
            global.uploadFileInput = this.find("[id='" + uploadFile.id + "']").removeProp("disabled");
        }
        return uploadFile;
    },
    /**
     * 向文件队列中添加一个文件
     * @param {Object} file 文件对象
     * @param {Boolean} only
     * @private
     */
    addFile: function (file, only) {
        var global = this._global,
            options = this._options,
            fileName = file.name,
            fileValue = file.path;
        global.fileQueue.push(file);
        if (!only && options.showTextInput) {
            global.textInput.attr("fileId", file.id).prop("value", fileName.length > 23 ? fileName.slice(0, 9) + "..." + fileName.slice(-10) : fileName).prop("title", fileValue);
        }
    },
    /**
     * 添加查询参数
     * 会覆盖之前添加的同名的查询参数
     * @param {Object} params 参数对象，仅接受普通的javascript对象（即使用"{}"声明的对象字面量），对象属性名为查询参数名，属性值为查询参数值
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    addParams: function (params) {
        if (fastDev.isPlainObject(params)) {
            fastDev.apply(this._options.params, params);
        }
        return this;
    },
    /**
     * 开始文件上传
     * 若未指定需上传的文件ID，则上传文件队列中的所有文件
     * @param {String} id 文件ID值
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    startUpload: function (id) {
        var global = this._global,
            options = this._options,
            uploadFile;
        if (!options.action) {
            // 未设置后台处理程序链接
            fastDev.error("FileUpload", "startUpload", "未设置上传处理程序链接（action）");
            return this;
        }
        if (global.fileQueue.length === 0) {
            // 文件队列为空则返回
            global.chooseFileInput.prop("value", "").removeProp("disabled");
            this.uploadFinish();
            return this;
        }
        if (global.isUploading) {
            // 正在上传则返回
            return this;
        }
        global.isCancelled = false;
        global.chooseFileInput.prop("disabled", "disabled");
        // 如果未指定文件ID或者自动上传，则上传文件队列中的所有文件
        global.uploadAllFile = !id || options.autoUpload;
        // 执行上传
        uploadFile = this.nextFile(id);
        if (uploadFile) {
            this.doUpload(uploadFile);
        }
        return this;
    },
    /**
     * 立即取消当前上传进程并停止整个上传队列
     * 区别于cancelUpload的是，该方法会终止整个上传队列
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    stopUpload: function () {
        this._global.uploadAllFile = false;
        this.cancelUpload();
        return this;
    },
    /**
     * 取消当前的上传过程
     * 若上传队列中存在其他待上传的文件，仍会继续上传下一个文件
     * 若要取消整个上传进程，请调用stopUpload方法
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    cancelUpload: function () {
        var global = this._global;
        if ( !! global.uploadFile) {
            // 标记为取消状态
            global.isCancelled = true;
            this.cleanTextInput();
            global.fileStats.cancelled++;
            if (!global.isSWFUploader) {
                // javascript:false是为解决IE6在https协议下使用空页面时会有BUG的问题
                global.iframe.prop("src", "javascript:false;");
            }
        }
        return this;
    },
    /**
     * 获取当前上传队列的一份快照
     * @return {Array} 文件队列
     */
    getFileQueue: function () {
        return this._global.fileQueue.slice(0);
    },
    /**
     * 清空并返回当前上传文件队列
     * @return {Array} 文件队列
     */
    cleanFileQueue: function () {
        var global = this._global,
            queue = this.getFileQueue();
        global.fileQueue = [];
        this.cleanTextInput();
        if (!global.isSWFUploader) {
            global.chooseFileInput.prop("value", "");
        }
        return queue;
    },
    /**
     * 从文件上传队列中移除文件
     * @param {String} id 文件ID
     * @param {Boolean} only 仅从文件队列中移除而不清空文本输入框的值
     * @return {Object} 被移除的文件对象（未找到对应ID文件时返回null）
     */
    removeFile: function (id, only) {
        var global = this._global,
            uploadFile = null;
        if (id) {
            uploadFile = this.nextFile(id);
            this.find("[id='" + id + "']").remove();
            if (!only && global.textInput.attr("fileId") === id) {
                this.cleanTextInput();
                if (!this._options.multiple && !global.isSWFUploader) {
                    global.chooseFileInput.prop("value", "");
                }
            }
        }
        return uploadFile;
    },
    /**
     * 清空文本输入框的值
     * @param {Boolean} removeFile 是否同时移除文件队列中的对应文件
     * @return {fastDev.Ui.FileUpload}
     */
    cleanTextInput: function (removeFile) {
        var global = this._global;
        if (this._options.showTextInput) {
            global.textInput.prop("value", "").prop("title", "");
        }
        if (removeFile) {
            this.removeFile(global.textInput.attr("fileId"));
        }
        return this;
    },
    /**
     * 设置是否只读 
     * @param {Boolean} [readonly=true] 是否只读
     * @return {fastDev.Ui.FileUpload} 当前控件实例
     */
    setReadonly: function (readonly) {
        var global = this._global;
        this._options.readonly = (readonly = readonly === false ? false : true);
        if (!global.isSWFUploader) {
            global.chooseFileInput[readonly ? "prop" : "removeProp"]("disabled", "disabled").css("cursor", readonly ? "default" : "pointer");
        }
        this.find(".ui-button")[readonly ? "css" : "removeCss"]("cursor", "default");
        return this;
    },
    /**
     * 开启与禁用切换
     * @param {Boolean} disabled
     * @private
     */
    toggle: function (disabled) {
        var global = this._global,
            toggle = disabled ? "disable" : "enable";
        if (disabled ? !global.disabled : !! global.disabled) {
            if (this._options.showUploadBtn) {
                global.uploadBtn[toggle]();
            }
            global.chooseBtn[toggle]();
            if (!global.isSWFUploader) {
                global.chooseFileInput[disabled ? "prop" : "removeProp"]("disabled", "disabled").css("cursor", disabled ? "default" : "pointer");
            }
            if (global.textBox) {
                global.textBox[toggle]();
            }
            global.disabled = !! disabled;
        }
        return this;
    },
    /**
     * 禁用文件上传
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    disable: function () {
        return this.toggle(true);
    },
    /**
     * 启用文件上传
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    enable: function () {
        return this.toggle(false);
    },
    /**
     * 获取统计信息，返回的统计信息对象包含以下属性：
     * <p>-success 上传成功文件数</p>
     * <p>-fail 上传失败文件数</p>
     * <p>-cancel 取消上传的文件数</p>
     * <p>-progress 正在上传的文件数（0或者1）</p>
     * <p>-queued 文件队列中待上传的文件数</p>
     * @return {Object} 
     */
    getStats: function () {
        var global = this._global;
        return {
            success: global.fileStats.success,
            fail: global.fileStats.failed,
            cancel: global.fileStats.cancelled,
            progress: global.isUploading ? 1 : 0,
            queued: this.getFileQueue().length
        };
    }
});
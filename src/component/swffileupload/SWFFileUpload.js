/**
 * @class fastDev.Ui.SWFFileUpload
 * @extends fastDev.Ui.FileUpload
 * @author chengwei
 * <p>flash文件上传控件。</p>
 * <p>可以不依赖于服务器端实时获取上传进度信息。</p>
 * <p>作者：程伟</p>
 *     
 *     <input itype="SWFFileUpload" flashUrl="../../data/swfupload.swf" 
 *            action="../../data/fileupload.jsp"/>
 */
fastDev.define("fastDev.Ui.SWFFileUpload", {
    alias: "SWFFileUpload",
    extend: "fastDev.Ui.FileUpload",
    _options: {
        /**
         * flash上传控件的链接地址（swf文件）
         * <strong>相对于当前页面</strong>
         * @type {String}
         */
        flashUrl: "swfupload.swf",
        /**
         * 文件类型描述，文件选取弹窗上文件类型处将显示该类型描述信息
         * @type {String}
         */
        fileTypeDescription: "",
        /**
         * 文件上传过程中的回调函数
         * 回调函数内this指向本控件
         * @param {Number} compelte 已完成字节数
         * @param {Number} total 文件的总字节数
         * @type {Function}
         * @event
         */
        onUploadProgress: function (file, complete, total) {}
    },
    template: ['<table class="ui-form-upload-wrap">', '<tbody>', '<tr>', '<tpl if(#{showTextInput}==true)>', '<td class="ui-form-upload-cell">', '<input id="#{id}" type="text" class="ui-upload-input ui-form-text" readonly="readonly" style="width:#{inputWidth}"/>', '</td>', '</tpl>', '<td>', '<div id="fileupload-fileinput-container-#{sequence}" style="position:relative;overflow:hidden;">', '<div id="fileupload-choosebtn-#{sequence}" class="ui-form-upload-btn"></div>', '<div id="swffileupload-button-#{sequence}" class="ui-form-upload-file">', '<div id="swffileupload-placeholder-#{sequence}"></div>', '</div>', '</div>', '</td>', '<td>', '<tpl if(#{showUploadBtn}==true)>', '<div id="fileupload-uploadbtn-#{sequence}"></div>', '</tpl>', '<tpl if(#{showLoading}==true)>', '<span id="fileupload-loading-#{sequence}" class="ui-loading-indicator" style="display:none"></span>', '</tpl>', '</td>', '</tr>', '</tbody>', '</table>'],
    /**
     * 参数准备
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有变量
     * @protected
     */
    ready: function (options, global) {
        if (!options.action || !options.flashUrl) {
            throw "action参数和flashUrl参数不能为空";
        }
        // 转换成绝对地址，解决SWFUpload控件对地址处理的BUG
        options.action = this.toAbsURL(options.action);
        // 适配参数
        if (options.typeLimit.length > 0) {
            fastDev.each(options.typeLimit, function (idx, type) {
                options.typeLimit[idx] = "*." + fastDev.Util.StringUtil.trim(type);
            });
            options.typeLimit = options.typeLimit.join(";");
        } else {
            options.typeLimit = "*.*";
        }
        options.sizeLimit = options.sizeLimit === -1 ? 0 : options.sizeLimit;
        options.fileLimit = options.fileLimit === -1 ? 0 : Math.abs(options.fileLimit);
        options.onUploadProgress = typeof options.onUploadProgress === "function" ? options.onUploadProgress : fastDev.noop;
        // 标记为Flash上传控件，则父类中不创建HTML文件域
        global.isSWFUploader = true;
    },
    /**
     * 构造控件
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有变量
     * @protected
     */
    construct: function (options, global) {
        var that = this,
            sequence = global.sequence,
            // HTML按钮容器
            chooseBtn = this.find("[id='fileupload-choosebtn-" + sequence + "']");
        global.swfUploadBtn = this.find("[id='swffileupload-button-" + sequence + "']");
        // 添加flash上传控件按钮
        global.swfUploader = new SWFUpload({
            upload_url: options.action,
            flash_url: options.flashUrl,
            file_post_name: options.name || ("file" + fastDev.getID()),
            post_params: options.params,
            preserve_relative_urls: true,
            prevent_swf_caching: true,
            file_types: options.typeLimit,
            file_types_description: options.fileTypeDescription,
            file_size_limit: options.sizeLimit,
            file_upload_limit: options.fileLimit,
            button_placeholder_id: "swffileupload-placeholder-" + sequence,
            button_width: chooseBtn.width() - 6, // HTML按钮有6px的有效外边距
            button_height: chooseBtn.height(),
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_action: options.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE,
            button_cursor: SWFUpload.CURSOR.HAND,
            file_queued_handler: fastDev.setFnInScope(this, this.fileQueuedHandler),
            file_queue_error_handler: fastDev.setFnInScope(this, this.fileQueuedErrorHandler),
            upload_start_handler: fastDev.setFnInScope(this, this.uploadStartHandler),
            upload_progress_handler: fastDev.setFnInScope(this, this.uploadProgressHandler),
            upload_success_handler: fastDev.setFnInScope(this, this.uploadSuccessHandler),
            upload_error_handler: fastDev.setFnInScope(this, this.uploadErrorHandler),
            upload_complete_handler: fastDev.setFnInScope(this, this.uploadCompleteHandler)
        });
    },
    /**
     * 初始化
     * @param {Object} options 用户配置参数
     * @param {Object} global 控件私有变量
     * @protected
     */
    init: function (options, global) {
        this.proxy("cleanFileQueue", function () {
            fastDev.each(this.getFileQueue(), function (idx, file) {
                global.swfUploader.cancelUpload(file.id, false);
            });
        }, true);
        this.proxy("removeFile", function (id) {
            if (id) {
                global.swfUploader.cancelUpload(id, false);
            }
        });
        this.proxy("enable", function () {
            global.swfUploadBtn.show();
        });
        this.proxy("disable", function () {
            global.swfUploadBtn.hide();
        });
    },
    /**
     * 文件添加进队列回调
     * @param {Object} file 文件对象
     * @private
     */
    fileQueuedHandler: function (file) {
        var options = this._options,
            global = this._global;
        if (options.onFileChoose.call(this, (file = this.toFile(file))) !== false) {
            if (!options.multiple) {
                this.removeFile(global.lastFileID, true);
                global.lastFileID = file.id;
            }
            this.addFile(file);
            if (options.autoUpload) {
                this.startUpload(file.id);
            }
        } else {
            global.swfUploader.cancelUpload(file.id, false);
        }
    },
    /**
     * 文件添加进队列异常时的回调
     * @param {Object} file 文件对象
     * @param {String} code 错误码
     * @param {String} msg 默认消息
     * @private
     */
    fileQueuedErrorHandler: function (file, code, msg) {
        var options = this._options;
        var errEnum = SWFUpload.QUEUE_ERROR;
        file = this.toFile(file);
        switch (code) {
            case errEnum.INVALID_FILETYPE:
                options.onChooseError.call(this, file, 1, "文件类型受到限制");
                break;
            case errEnum.FILE_EXCEEDS_SIZE_LIMIT:
                options.onChooseError.call(this, file, 2, "文件大小超过限制");
                break;
            case errEnum.QUEUE_LIMIT_EXCEEDED:
                options.onChooseError.call(this, file, 3, "超过最大可上传文件数");
        }
    },
    /**
     * 上传开始回调
     * @param {Object} file 文件对象
     * @private
     */
    uploadStartHandler: function (file) {
        var options = this._options,
            global = this._global;
        global.uploadFile = this.nextFile(file.id);
        if (options.onUploadStart.call(this, (file = this.toFile(file))) !== false) {
            global.swfUploader.setUploadURL(this.getRequestAction());
            this.uploadReady();
        } else {
            this.cancelUpload(file.id);
            return false;
        }
    },
    /**
     * 上传过程回调
     * @param {Object} file 文件对象
     * @param {Number} complete 完成字节数
     * @param {Number} total 总字节数
     * @private
     */
    uploadProgressHandler: function (file, complete, total) {
        this._options.onUploadProgress.call(this, this.toFile(file), complete, total);
    },
    /**
     * 上传成功回调
     * @param {Object} file 文件对象
     * @param {Object} data 服务器返回的数据
     * @param {Boolean} response 状态量
     * @private
     */
    uploadSuccessHandler: function (file, data, response) {
        response = fastDev.Util.StringUtil.trim(data);
        try {
            data = fastDev.Util.JsonUtil.parseJson(response);
        } catch (e) {} finally {
            response = !! data ? data : response;
        }
        this["do" + (this._options.onUploadComplete.call(this, file = this.toFile(file), response) !== false ? "Success" : "Fail")](file, response);
    },
    /**
     * 上传失败回调
     * @param {Object} file 文件对象
     * @param {String} code 错误码
     * @param {String} msg 默认提示消息
     * @private
     */
    uploadErrorHandler: function (file, code, msg) {
        var errEnum = SWFUpload.UPLOAD_ERROR;
        switch (code) {
            case errEnum.FILE_VALIDATION_FAILED:
            case errEnum.SPECIFIED_FILE_ID_NOT_FOUND:
            case errEnum.UPLOAD_LIMIT_EXCEEDED:
            case errEnum.FILE_CANCELLED:
            case errEnum.UPLOAD_STOPPED:
                return;
        }
        this._options.onUploadComplete.call(this, file = this.toFile(file), null);
        this.doFail(file, null, msg);
    },
    /**
     * 上传完成回调
     * @param {Object} file 文件对象
     * @private
     */
    uploadCompleteHandler: function (file) {
        var global = this._global;
        this.uploadFinish();
        if (global.uploadAllFile) {
            global.swfUploader.startUpload();
        }
    },
    /**
     * 开始文件上传
     * 若未指定需上传的文件ID，则上传文件队列中的所有文件
     * @param {String} id 文件ID值
     * @return {fastDev.Ui.SWFFileUpload} 本控件实例
     */
    startUpload: function (id) {
        var global = this._global,
            options = this._options;
        global.uploadAllFile = !id || options.autoUpload;
        global.swfUploader.startUpload(id);
        return this;
    },
    /**
     * 立即取消当前上传进程并停止整个上传队列
     * @return {fastDev.Ui.FileUpload} 本控件实例
     */
    stopUpload: function () {
        var global = this._global,
            options = this._options;
        global.uploadAllFile = false;
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
        var global = this._global,
            options = this._options,
            file = global.uploadFile;
        if ( !! file) {
            global.swfUploader.cancelUpload(file.id, false);
            options.onUploadCancel.call(this, file);
            global.fileStats.cancelled++;
            this.cleanTextInput();
            this.uploadFinish();
        }
        if (global.uploadAllFile) {
            this.startUpload();
        }
        return this;
    },
    /**
     * 适配文件对象
     * @return {Object}
     * @private
     */
    toFile: function (file) {
        file = file || {};
        return {
            id: file.id,
            name: file.name,
            size: file.size,
            path: file.name,
            type: file.type.replace(".", "")
        };
    },
    /**
     * 函数代理
     * @param {Object} name 函数名
     * @param {Object} func 代理函数
     * @param {Boolean} before 是否在被代理函数之前执行代理函数
     * @private
     */
    proxy: function (name, func, before) {
        var that = this,
            fn = that[name];
        that[name] = function () {
            var result;
            if (before) {
                func.apply(that, arguments);
            }
            result = fn.apply(that, arguments);
            if (!before) {
                func.apply(that, arguments);
            }
            return result;
        };
    },
    /**
     * 相对地址转换为绝对地址，解决swfupload控件upload地址存在的bug
     * @param {Object} url 相对地址
     * @return {String} 绝对地址
     * @private
     */
    toAbsURL: (function () {
        var link = function (url) {
            var a = document.createElement("a");
            a.href = url;
            return a.href;
        };
        return link("") === "" ? function (url) {
            var div = document.createElement('div');
            div.innerHTML = '<a href="' + url.replace(/"/g, "%22") + '"/>';
            return div.firstChild.href;
        } : link;
    })()
});
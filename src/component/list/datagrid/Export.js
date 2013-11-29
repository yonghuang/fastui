fastDev.apply(fastDev.Ui.DataGrid, {
	/**
	 * 导出表格数据
	 * @param {String} url 后台导出服务地址
	 * @param {String} type 导出类型xls、pdf、csv
	 * @param {String} [page=current] 默认为current只生成当前DataGrid所展示的数据，改为all则生成所有数据
	 * @param {String} [mode=stream] 导出模式为文件(file)还是流(stream)
	 * @member fastDev.Ui.DataGrid
	 */
	exportData : function(url, type, page, mode, streamurl) {
		var name, params, config = {
			container : this.elems[0],
			allowLock : true,
			model : "progress"
		};

		if(page === "all") {
			// 获取总页数
			config.totalValue = this.getPageBarInfo("total");
			// 收集多页导出参数
			params = [null, url, type, mode, streamurl];
			// 设定多页导出方法
			name = "exportAllData";
			// 多页导出时创建导出进度
			this._global.progress = fastDev.create("ProgressBar", config);
		} else {
			// 收集单页导出参数
			params = [url, type, 1];
			// 设定单页导出方法
			name = "exportCurrentData" + (mode !== "file" ? "ByStream" : "");
		}
		// 开始导出
		this[name].apply(this, params);
	},
	/**
	 * 打印表格数据
	 * @param {String} url 后台打印服务地址
	 * @member fastDev.Ui.DataGrid
	 */
	printData : function(url, page) {
		this.exportData(url, "pdf", page, "file");
	},
	/**
	 * 导出当前页数据
	 * @param {String} url 后台导出服务地址
	 * @param {String} type 导出文件类型
	 * @param {Number} end 导出结束标示符
	 * @param {String} sessionid 持续导出时的后台会话ID
	 * @param {Function} callback 当次导出结束后的回调函数
	 * @private
	 */
	exportCurrentData : function(url, type, end, sessionid, callback) {
		// 收集后台生成文件所需要的数据
		// 没有sessionid时则需要导出表头
		var that = this, 
			data = this.collectingData(!sessionid), 
			dataConfig = {
				"expData" : data,
				"expType" : type,
				"expEnd" : end,
				"expId" : sessionid || "",
				"expMode" : 0
			};

		// 设置导出结束后的回调
		callback = callback || this.openFile;
		// 请求后台服务生成文件
		fastDev.post(url, {
			data : dataConfig,
			success : callback
		});
	},
	/**
	 * 使用流模式导出数据
	 * @private
	 */
	exportCurrentDataByStream : function(url, type, end, sessionid, callback) {
		if(end === 1) {
			this._global.expForm = this.buildExportForm(url, type, end, sessionid);
			this._global.expForm.elems[0].submit();
		}
	},
	/**
	 * 生成数据表单
	 * @private
	 */
	buildExportForm : function(url, type, end, sessionid) {
		var data = fastDev.Util.JsonUtil.parseString(this.collectingData(!sessionid)), 
			exportForm = [
				'<form action="' + url + '" method="post" target="excelIFrame">', 
					'<input type="hidden" name="expEnd" value="' + end + '" />', 
					'<input type="hidden" name="expType" value="' + type + '" />', 
					'<input type="hidden" name="expId" value="' + (sessionid || "") + '" />', 
					'<input type="hidden" name="expMode" value="1" />', 
					'<input type="hidden" name="expData" value=' + data + ' />', 
				'</form>',
				'<iframe id="excelIFrame" name="excelIFrame" style="display:none;"></iframe>'
			];
		return fastDev(exportForm.join('')).appendTo(document.body);
	},
	/**
	 * 导出所有数据
	 * @param {String} sessionid 持续导出时的后台会话ID
	 * @param {String} url 后台导出服务地址
	 * @param {String} type 导出文件类型
	 */
	exportAllData : function(sessionid, url, type, mode, streamurl) {
		// 首次导出时需要跳转至第一个数据
		// 其后每次跳转至下一页
		if(sessionid === null) {
			this.pageFirst();
		} else {
			this.pageNext();
		}
		var that = this;
		// 页面跳转完成后调用打印当前页接口
		this._global.queue.add({
			type : "normal",
			handle : function() {
				// 获取当前页
				var callback,
				name = "exportCurrentData",
				page = that.getPageBarInfo("page"),
				// 获取总页
				total = that.getPageBarInfo("total"),
				// 判断当前导出是否是最后一页
				islast = page === total;
				// 为导出完成设置回调
				if(islast && mode === "stream"){
					name += mode === "stream" ? "ByStream" : "";
					url = streamurl;
				}
				if(!islast){
					callback = fastDev.setFnInScopeByParam(that, that.exportAllData, url, type, mode, streamurl);
				}
				// 导出当前显示页数据
				that[name](url, type, islast ? 1 : 0, sessionid, callback);
				if(islast) {
					that._global.progress.destroy();
				} else {
					that._global.progress.setValue(page);
				}
			}
		});
	},
	/**
	 * 收集当前页数据
	 * @param {Boolean} needtitle 是否需要收集表头数据
	 */
	collectingData : function(needtitle) {
		// 初始化导出数据
		var exportdata = {
			data : []
		};

		// 首次导出会收集列宽信息和表头信息
		if(needtitle === true) {
			exportdata.colwidth = [];
			this.buildColWidthData(exportdata.colwidth);
			this.buildTitleData(exportdata.data);
			exportdata.titlecount = exportdata.data.length;
		}
		// 收集表数据信息
		this.buildData(exportdata.data);
		// 返回收集完成的数据
		return exportdata;
	},
	/**
	 * 生成列宽数据
	 * @param {Array} array 列宽数据存储对象
	 * @private
	 */
	buildColWidthData : function(array) {
		var columns = this._global.headerContainer.find("tr:eq(0) td");
		columns.each(function(elem) {
			array.push(fastDev(elem).width());
		});
	},
	/**
	 * 生成表头数据
	 * @param {Array} array 表头数据存储对象
	 * @private
	 */
	buildTitleData : function(array) {
		var rows = this._global.headerContainer.find("tr:gt(0)");
		rows.each(function(row) {
			var cells = [];
			fastDev(row).find("td").each(function(cell) {
				cell = fastDev(cell);
				cells.push(cell.find(".ui-datagrid-cell-inner").getText() + "@" + (cell.prop("rowspan") || 1) + "-" + (cell.prop("colspan") || 1));
			});
			array.push(cells);
		});
	},
	/**
	 * 生成表数据
	 * @param {Array} array 表数据存储对象
	 * @private
	 */
	buildData : function(array) {
		var rows = this._global.dataContainer.find("tr:gt(0)");
		rows.each(function(row) {
			var cells = [];
			fastDev(row).find("td").each(function(cell) {
				cell = fastDev(cell);
				cells.push(cell.find(".ui-datagrid-inner").getText() + "@" + cell.prop("rowspan") + "-" + cell.prop("colspan"));
			});
			array.push(cells);
		});
	},
	/**
	 * 在新窗口打开文件地址出发浏览器下载
	 * @param {String} filepath 文件地址
	 */
	openFile : function(filepath) {
		window.open(filepath);
	}
});

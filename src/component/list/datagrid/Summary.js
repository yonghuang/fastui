fastDev.apply(fastDev.Ui.DataGrid, {
	/**
	 * 解析统计配置
	 * @param {JsonObject} column 列配置对象
	 * @private
	 */
	parseSummaryInfo : function(column) {
		// 解析用户定义的统计信息
		var summaryInfo = this._global.summaryInfo || {};
		summaryInfo[column.name] = {
			type : column.summaryType,
			renderer : column.summaryRenderer,
			text : column.summaryText,
			hidden : column.hidden
		};
		this._global.summaryInfo = summaryInfo;
	},
	/**
	 *  生成统计显示区域
	 * @param {Object} options
	 * @param {Object} global
	 * @private
	 */
	buildSummaryCol : function(options, global) {
		// 列配置信息
		var columns = options.columns,
		// 统计信息
		summaryInfo = global.summaryInfo, rendererList = [];
		// 如果用户没有定义统计模板则生成默认模板统计模板否则使用用户所定义的模板做展现
		if(!options.summaryTpl) {
			global.displayJobs.push(function() {
				var html = [], renderer = "";
				// 应用列宽限制模板
				html.push("<table><tr>" + global.colWidthTpl + "</tr><tr>");
				for(var i = 0, column; column = columns[i]; i++) {
					var summaryColumn = summaryInfo[column.name], summaryValue;
					html.push('<td' + (column.hidden === true?' style="display:none"' : ''));
					if(summaryColumn) {
						summaryValue = summaryColumn.text + this.dataset[summaryColumn.type](column.name);
						if(summaryColumn.renderer) {
							var processid = fastDev.getID();
							renderer = " dg_renderer='" + processid + "'";
							rendererList.push({
								id : processid,
								handle : summaryColumn.renderer,
								value : summaryValue
							});
							html.push(renderer);
						}
						html.push(">" + summaryValue);
					} else {
						html.push(">");
					}
					html.push("</td>");
				}
				html.push("</tr>");
				this.find(".ui-datagrid-count").show().empty().append(fastDev(html.join("")));
				this.buildSummaryRenderer(rendererList);
			});
		} else {
			global.displayJobs.push(function() {
				var html = options.summaryTpl, summaryValue;
				for(var p in summaryInfo) {
					var summaryColumn = summaryInfo[p];
					summaryValue = summaryColumn.text + this.dataset[summaryColumn.type](p);
					html = html.replace(RegExp("{" + p + "}", "g"), summaryValue);
				}
				this.find(".ui-datagrid-count").show().empty().append(fastDev(html));
			});
		}
	},
	/**
	 * 构建默认统计列的渲染器
	 * @param {Object} rendererList
	 * @private
	 */
	buildSummaryRenderer : function(rendererList) {
		this._global.displayJobs.push(function() {
			fastDev.each(rendererList, function(index, rendererInfo) {
				var elem = this.find("[dg_renderer='"+rendererInfo.id+"']").elems[0];
				rendererInfo.handle.call(elem, rendererInfo.value);
			}, this);
		});
	}
});

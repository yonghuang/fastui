/**
 * @class fastDev.Ui.DataGrid.Column
 * DataGrid子类，用于定义列信息以功能，如:标题、列宽、列渲染器、列类型、列模板等<p>
 * 作者：袁刚
 */

/**
 * @property {String} text 列标题
 * 该属性用于在头部显示，描述当前列内容
 */

/**
 * @property {String} name 列名
 * 该属性用于映射数据，所以需要与数据键保持一致方可显示
 */

/**
 * @property {String} [width] 列宽度
 * 该属性用于设定列宽度
 */

/**
 * @property {Function} [renderer] 列渲染器
 * 该属性用于对当前列进行个性化设置
 */

/**
 * @property {String} [defaultValue] 列默认值
 * 该属性用于设置在没有数据时的显示值
 */

/**
 * @property {String} [itype=normal] 列渲染器
 * 该属性用于设置当前列类型，可用值(normal、template、control、boolean、number、date)
 */

/**
 * @property {String} [tpl] 列模板
 * 当列类型为template时，该设置起效
 */

/**
 * @property {String} [trueText] 值为true时的显示值
 * 当列类型为boolean时，该设置起效，用于设置值为true时的显示值
 */

/**
 * @property {String} [falseText] 值为false时的显示值
 * 当列类型为boolean时，该设置起效，用于设置值为false时的显示值
 */

/**
 * @property {String} [controlType] 用来显示值的控件类型
 * 当列类型为control时，该设置起效，用于设置用来显示值的控件类型
 */

/**
 * @property {String} [format] 格式化描述
 * 当列类型为number/date时，该设置起效，用于设置格式化描述
 */

/**
 * @property {String} [editby]  行内编辑控件类型
 * 用于定义行内编辑时当前列的编辑控件
 */

/**
 * @property {String} [idColumn]  当前列值所对应的存储ID的列名
 * 当行内编辑控件为Select或SelectTree时，需要同时提供显示值和隐藏值才能正确编辑列值，当前属性就是用来指定当前值所对应的ID值存储列用的
 */

/**
 * @property {Boolean} [hidden]  设定当前列初始状态为显示/隐藏
 * 设定当前列初始状态为是否隐藏
 */

/**
 * @property {String} [summaryType] 统计类型
 * 设定当前列的统计类型 可用值(count、sum、avg、max、min)
 */

/**
 * @property {String} [summaryText] 统计描述文本
 * 设定当前列的统计值之前的描述文字
 */

/**
 * @property {Function} summaryRenderer 统计单元格的渲染器
 * 用于个性化显示统计信息
 */

/**
 * @property {String} titleCls 设定标题列样式名
 * 用于设定标题列的className
 */

/**
 * @property {String} titleStyle 设定标题列样式
 * 用于设定标题列的style 值参照标签的style属性书写
 */

fastDev.apply(fastDev.Ui.DataGrid, {
	/**
	 * 解析DataGrid配置生成内置功能列
	 * @private
	 */
	parseQuickConfig : function(options, global) {
		var columns = options.columns, length = columns.length, dataColStart = 0;

		// 如果配置了行内信息，则生成展开/收缩图标列配置
		if(global.buildRowDetail) {
			columns.splice(0, 0, {
				itype : "template",
				width : "30px",
				tpl : '<tpl if(!item["inner_invalid"])><div class="ui-datagrid-node-close"></div></tpl>'
			});
		}

		// 如果配置了复选框列，则生成复选框列配置
		// 同时配置复选框列与单选框列时，只显示复选框列
		if(options.showCheckColumn) {
			// 增加内置列-复选框列
			columns.splice(0, 0, {
				itype : "checkbox",
				width : "30px"
			});
		} else if(options.showRadioColumn) {
			// 如果配置了单选框列，则生成单选框列配置
			columns.splice(0, 0, {
				itype : "radio",
				width : "30px"
			});
		}
		// 如果配置了行号列，则生成行号列配置
		if(options.showSeqColumn) {
			// 增加内置列-序号列
			columns.splice(0, 0, {
				itype : "seq",
				width : "30px",
				tpl : "'+rowid+'"
			});
		}
		// 保存DataGrid数据列其实索引，在操作数据列时，不对内置列做处理
		global.dataColStart = columns.length - length;
		// 返回内置列所占宽度，在计算数据列宽度时预留
		return global.dataColStart * 30;
	},
	/**
	 * 解析列配置信息
	 * @private
	 */
	parseColumn : function(column, cls, hidden) {
		// 列类型
		var type = column.itype,
		// 列名
		name = column.name,
		// 数据字段配置
		field = {},
		// 渲染器标识
		rendererIdent = "";

		// 字段模型配置（数据集使用）
		if(name) {
			field = {
				name : name,
				defaultValue : column.defaultValue
			};
		}

		// 检测修改信息语句，如果当前数据被修改则会被增加修改标识
		var modifyCond = '<tpl if({gird_modify} === "all" || /' + (name || "nosetting") + '/.test({gird_modify}))>ui-datagrid-change-cell</tpl>';

		if(column.renderer) {
			// 生成渲染器并绑定标识至当前列
			rendererIdent = this.buildRendererCol(column.renderer);
		}

		if(column.summaryType) {
			// 解析并收集当前列统计依赖信息
			this.parseSummaryInfo(column);
		}

		if(type === "seq") {
			// 为内置行号列加上行号样式
			cls += " ui-datagrid-cell-seq";
			type = "template";
		}
		// 单元格模板
		var cellTplList = ['<td class="ui-datagrid-cell' + cls + '" style="' + hidden + '">'];

		switch(type) {
			case "checkbox":
				this.buildChooseBoxCol(cellTplList, "checkbox");
				break;
			case "radio":
				this.buildChooseBoxCol(cellTplList, "radio");
				break;
			case "date" :
				this.buildDateCol(cellTplList, name, column.format, rendererIdent, modifyCond);
				break;
			case "number" :
				this.buildNumberCol(cellTplList, name, column.format, rendererIdent, modifyCond);
				break;
			case "boolean" :
				// 更改布尔列的数据值类型
				field.type = "Boolean";
				this.buildBooleanCol(cellTplList, name, column.trueText, column.falseText, rendererIdent, modifyCond);
				break;
			case "template" :
				this.buildTemplateCol(cellTplList, name, column.tpl, rendererIdent, modifyCond);
				break;
			case "control" :
				this.buildControlCol(cellTplList, name, column.controlType, column.controlCfg, rendererIdent);
				break;
			default :
				this.buildNormalCol(cellTplList, name, rendererIdent, modifyCond);
		}
		// 将数据字段配置增加至数据模型配置中
		if(fastDev.isValid(name)) {
			this.fields.push(field);
		}

		cellTplList.push('</td>');

		return cellTplList.join("");
	},
	/**
	 * 宽度限制列生成
	 * @param {JsonObject} 列配置信息
	 * @param {String} width 外部配置宽度
	 * @param {String} totalWidth 总宽度
	 * @private
	 */
	buildColWidthTpl : function(column, totalWidth, surplus, inner) {
		// 计算限制列宽度，将当前列宽度设置换算成具体数值
		var width = Math.round(fastDev.Util.StringUtil.stripUnits(column.width || 0, totalWidth)),cellHtml,display="";
		// 最后一个显示列时，如果剩余宽度大于当前配置宽度则用剩余宽度，否则用当前配置宽度
		width = surplus && width < surplus ? surplus : width;
		
		if(column.hidden === true){
			display = "display:none";
			width = 0;
		}
		// 获取新的剩余宽度
		this._global.surplus -= width;
		cellHtml = '<td style="width:' + width + 'px;' + display + '"></td>';
		if(inner === true) {
			return [width,cellHtml];
		}
		return cellHtml;
	},
	/**
	 * 检查列内容是否有效
	 * @param {String} content 列内容
	 * @private
	 */
	buildCheckDataTpl : function(content) {
		return '<tpl if(!item["inner_invalid"])>' + content + '</tpl>';
	},
	/**
	 * 生成单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {String} rendererIdent 渲染器标识
	 * @param {String} cls 数据容器样式名
	 * @param {String} content 数据模板
	 * @param {String} prop 数据容器其他属性
	 * @private
	 */
	buildColTpl : function(cellTplList, name, rendererIdent, cls, content, prop, notitle) {
		var title = "", value = name ? 'value="{' + name + '}"' : '';
		content = content ? content : ( value ? '{' + name + '}' : '');
		rendererIdent = rendererIdent || "";
		cls = cls || "";
		prop = prop || "";
		title = notitle ? "" : 'title="' + content + '"';

		cellTplList.push('<div class="ui-datagrid-inner ' + cls + '" ' + title + ' ' + value + ' ' + rendererIdent + ' ' + prop + '>' + content + '</div>');
	},
	/**
	 * 生成普通数据单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {String} rendererIdent 渲染器标识
	 * @param {String} modifyCond 检测修改信息语句
	 * @private
	 */
	buildNormalCol : function(cellTplList, name, rendererIdent, modifyCond) {
		this.buildColTpl(cellTplList, name, rendererIdent, modifyCond);
	},
	/**
	 * 生成选择单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} type 选择框类型
	 * @private
	 */
	buildChooseBoxCol : function(cellTplList, type) {
		this.buildColTpl(cellTplList, null, null, null, this.buildCheckDataTpl('<input name="dg_choose" type="' + type + '" <tpl if({gird_checked} === true)>checked</tpl>>'), null, true);
	},
	/**
	 * 生成日期数据单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {format} format 数据格式定义
	 * @param {String} rendererIdent 渲染器标识
	 * @param {String} modifyCond 检测修改信息语句
	 * @private
	 */
	buildDateCol : function(cellTplList, name, format, rendererIdent, modifyCond) {
		var processid = fastDev.getID();
		this._global.displayJobs.push(function() {
			this.find('div [dg_format="' + processid + '"]').each(this.dateFormat, format);
		});

		this.buildColTpl(cellTplList, name, null, modifyCond, null, this.buildCheckDataTpl('dg_format="' + processid + '" ' + rendererIdent));
	},
	/**
	 * 生成数字数据单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {format} format 数据格式定义
	 * @param {String} rendererIdent 渲染器标识
	 * @param {String} modifyCond 检测修改信息语句
	 * @private
	 */
	buildNumberCol : function(cellTplList, name, format, rendererIdent, modifyCond) {
		var processid = fastDev.getID();
		this._global.displayJobs.push(function() {
			this.find('[dg_format="' + processid + '"]').each(this.numberFormat, format);
		});

		this.buildColTpl(cellTplList, name, null, modifyCond, null, this.buildCheckDataTpl('dg_format="' + processid + '" ' + rendererIdent));
	},
	/**
	 * 生成布尔数据单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {String} trueText 数据为真时显示文本
	 * @param {String} falseText 数据为假时显示文本
	 * @param {String} rendererIdent 渲染器标识
	 * @param {String} modifyCond 检测修改信息语句
	 * @private
	 */
	buildBooleanCol : function(cellTplList, name, trueText, falseText, rendererIdent, modifyCond) {
		this.buildColTpl(cellTplList, name, rendererIdent, modifyCond, this.buildCheckDataTpl('<tpl if({' + name + '} === true)>' + trueText + '<tpl else>' + falseText + '</tpl>'));
	},
	/**
	 * 生成模板单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {String} tpl 模板定义
	 * @param {String} rendererIdent 渲染器标识
	 * @param {String} modifyCond 检测修改信息语句
	 * @private
	 */
	buildTemplateCol : function(cellTplList, name, tpl, rendererTpl, modifyCond) {
		cellTplList.push('<div class="ui-datagrid-inner ' + modifyCond + '"  ' + rendererTpl + '>' +  this.buildCheckDataTpl(tpl) + '</div>');
	},
	/**
	 * 生成控件单元格模板
	 * @param {Array} cellTplList 单元格模板
	 * @param {String} name 当前列数据名
	 * @param {String} type 控件类型
	 * @param {JsonObject} config 控件配置
	 * @private
	 */
	buildControlCol : function(cellTplList, name, type, config) {
		var processid = fastDev.getID();
		this._global.displayJobs.push(function() {
			this.find('div [dg_control="' + processid + '"]').each(this.controlFormat, config, type);
		});
		cellTplList.push('<div class="ui-datagrid-inner" value="{' + name + '}" ' + this.buildCheckDataTpl('dg_control="' + processid + '"') + '>{' + name + '}</div>');
	},
	/**
	 * 生成渲染器并返回标识
	 * @param {Function} handle 渲染器句柄
	 * @private
	 */
	buildRendererCol : function(handle) {
		var processid = fastDev.getID();

		this._global.displayJobs.push(function() {
			this.find('div [dg_renderer="' + processid + '"]').each(this.dataRenderer, handle);
		});
		return this.buildCheckDataTpl('dg_renderer="' + processid + '"');
	},
	/**
	 * 将值转换为相应数字格式
	 * @param {Element} elem 数据所在元素
	 * @param {String} format 数据格式定义
	 * @private
	 */
	numberFormat : function(elem, format) {
		elem.innerHTML = fastDev.Util.NumberUtil.format(elem.innerHTML, format);
	},
	/**
	 * 将值转换为相应日期格式
	 * @param {Element} elem 数据所在元素
	 * @param {String} format 数据格式定义
	 * @private
	 */
	dateFormat : function(elem, format) {
		elem.innerHTML = fastDev.Util.DateUtil.format(elem.innerHTML, format);
	},
	/**
	 * 将值转换为控件显示
	 * @param {Element} elem 数据所在元素
	 * @param {JsonObject} config 控件配置
	 * @param {String} type 控件类型
	 * @private
	 */
	controlFormat : function(elem, config, type) {
		var id = fastDev.getID(), container = fastDev(elem).prop("id", id).empty();
		config = config || {};
		fastDev.apply(config, {
			id : id + "",
			saveInstance : true,
			container : container,
			value : container.attr("value"),
			width : container.width() + "px"
		});
		fastDev.create(type, config);
	},
	/**
	 * 数据渲染器
	 * @param {Element} elem 数据所在元素
	 * @param {Function} handle 渲染器句柄
	 * @private
	 */
	dataRenderer : function(elem, handle) {
		var content = handle.call(elem, fastDev(elem).attr("newValue") || fastDev(elem).attr("value"));
		if(fastDev.isValid(content)) {
			elem.innerHTML = content;
		}
	},
	/**
	 * 获取宽度不足时补足列索引
	 * @param {Array{JsonObject}} columns DataGrid列配置
	 * @private
	 */
	getRepairColIndex : function(columns) {
		// 以最后一列为起点逆推，找到第一个显示列索引
		var column, index = columns.length - 1;
		for(; column = columns[index]; index--) {
			if(column.hidden !== true) {
				break;
			}
		}
		return index;
	},
	/**
	 * 监听数据区域横向滚动条，保证表格内容和标题同步滚动事件
	 * @private
	 */
	listeningScroll : function() {
		var me = this;

		this._global.dataContainer.bind("scroll", function() {
			var scrollLeft = me._global.dataContainer.scrollLeft();
			me._global.headerContainer.find("table").css({
				"left" : scrollLeft * -1,
				"position" : "relative"
			});
			if(me._options.allowDelayLoad) {
				var scrollTop = me._global.dataContainer.scrollTop();
				if(scrollTop + me._global.dataContainer.height() >= me._global.dataContainer.elems[0].scrollHeight) {
					me._global.params.rowid = me._global.innerPage * 50;
					me.appendDynamicHtml(me._global.dataContainer,"body", me.dataset.selectByPage(me._global.innerPage++,50));
					//me.appendDynamicHTML("body", me.dataset.selectByPage(me._global.innerPage++,50));
					me._global.dataContainer.scrollTop(scrollTop);
					if(fastDev.Browser.isIE6 || fastDev.Browser.isIE7) {
						me._global.dataContainer.find("table:last-child").width("-17");
					}
				}
			}
		});
	},
	/**
	 * 初始化行内编辑
	 * @private
	 */
	initEditInline : function() {
		var me = this, global = this._global;

		global.dataContainer.bind("click", function(event) {
			var elem = event.target;
			if(elem.tagName === "DIV" && /ui-datagrid-inner/.test(elem.className)) {
				// 回写数据
				if(me.writeBackCell() === true || !fastDev.isValid(global.activeControl)) {
					// 激活下次的编辑
					me.editCell(elem);
				}
			}
		});

	},
	/**
	 * 行内编辑触发时设置焦点目标
	 * @param {Object} event
	 * @private
	 */
	setFocus : function(event) {
		var obj = event.target;
		if(obj.createTextRange) {
			try {
				var txt = obj.createTextRange();
				txt.moveStart('character', obj.value.length);
				txt.collapse(true);
				txt.select();
			} catch (e) {
			}

		} else if( typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
			obj.selectionStart = obj.selectionEnd = obj.value.length;
		}
	},
	/**
	 * 单元格编辑
	 * @param {Object} elem
	 * @private
	 */
	editCell : function(elem) {
		var options = this._options, global = this._global,
		// 封装DomObject
		container = fastDev(elem),
		// 获取DataGrid列配置
		columns = options.columns,
		// 获取操作列索引
		cellIndex = +(options.allowCellMerge?container.parents("td").attr("realCellIndex") : container.parents("td").prop("cellIndex")),
		// 获取操作行索引
		rowIndex = +(container.parents("tr:eq(0)").prop("rowIndex")),
		// 根据索引获取列配置
		columnCfg = this._global.activeColumn = (fastDev.Browser.isIE6 || fastDev.Browser.isIE7)?this.getColumnInfo(columns,cellIndex):columns[cellIndex],
		// 获取控件类型
		controlType = columnCfg.editby,
		// 行内编辑限制函数
		editCellLimit = fastDev.isFunction(options.editCellLimit)?options.editCellLimit : fastDev.noop,
		// 获取当前列真实值
		value = container.attr("newValue") || container.attr("value"),
		// 在列配置中获取控件配置
		controlCfg = columnCfg.controlCfg || {};
		// 如果当前列不是数据列，则取消编辑
		if(cellIndex < global.dataColStart || rowIndex > this.dataset.getSize() || !controlType || editCellLimit(rowIndex, cellIndex, value)) {
			return;
		}

		// 如果编辑控件需要根据ID定位值(如:Select、SelectTree),则寻找对应的ID列容器
		if(columnCfg.idColumn) {
			var i = 0, column, idColumn;
			for(; column = columns[i]; i++) {
				if(column.name === columnCfg.idColumn) {
					break;
				}
			}
			idColumn = this._global.activeIdDom = container.parents("tr").find("td:eq(" + i + ") [class~='ui-datagrid-inner']");
			value = idColumn.attr("newValue") || idColumn.attr("value");
		}
		// 将当前值写入配置中
		controlCfg.value = value;
		// 将当前容器写入配置中
		controlCfg.container = container;
		controlCfg.width = "100%";
		// 清空显示容器
		container.empty();
		// 创建控件
		this._global.activeControl = fastDev.create(controlType, controlCfg).bind("focus", this.setFocus).fire("focus");
	},
	/**
	 *  将当前已激活的行内编辑控件数据回写
	 */
	writeBackCell : function(validate) {
		// 获取当前活动控件
		var activeControl = this._global.activeControl;

		// 如果当前没有已被激活的控件则不继续执行回写
		if(!fastDev.isValid(activeControl)) {
			return true;
		}
		
		if(validate ? activeControl.validate() : activeControl.hasError()){
			return false;
		}
		
		// 获取当前活动列配置
		var activeColumn = this._global.activeColumn, columnName = activeColumn.name,
		// 关联ID列DomObject
		activeIdDom = this._global.activeIdDom,
		// 获取控件容器
		container = activeControl._options.container,
		// 主键列名
		keyword = this._options.keyword,
		// 获取控件类型
		controlType = activeControl.alias,
		// 获取当前行索引
		rowIndex = activeControl._options.container.parents("tr").prop("rowIndex"),
		// 获取当前列索引
		cellIndex = activeControl._options.container.parents("td").prop("cellIndex");
		// 调用对应的回写器回写数据
		var rs = this.controlType[controlType].call(this, activeControl, activeColumn);
		// 销毁活动控件
		activeControl.destroy();
		// 获取修改前数据
		var m, newValue, oldValue = container.attr("value"),
		// 获取数据集中当前行数据
		olddata = this.dataset.get(rowIndex - 1),
		newdata = {},
		// 获取当前行修改信息
		gird_modify = olddata.gird_modify;

		// 重设单元格显示值和真实值
		if(fastDev.isValid(activeIdDom)) {
			newValue = rs[1];
			// 回写当前单元格显示值与隐藏值
			container.attr("newValue", newValue).setText(newValue);
			// 回写关联ID单元格显示值与隐藏值
			activeIdDom.attr("newValue", rs[0]).setText(rs[0]);
			// 回写关联ID值至数据集
			newdata[activeColumn.idColumn] = rs[0];
		} else {
			newValue = rs[0];
			// 回写当前单元格显示值与隐藏值
			container.attr("newValue", newValue).setText(rs[1]);
		}
		// 回写当前值至数据集
		newdata[columnName] = newValue;

		// 如果当前值不等于原始值，添加修改列标识，增加修改列样式
		// 如果当前值等于原始值并且当前行不是新增行则删除修改列标识，删除修改列样式
		if(oldValue !== newValue) {
			if(gird_modify !== "all") {
				newdata.gird_modify = gird_modify ? columnName + "," : "," + columnName + ",";
			}
			container.addClass("ui-datagrid-change-cell");
			if(activeIdDom) {
				activeIdDom.addClass("ui-datagrid-change-cell");
			}
			
			this.dataset.update(function(index, data){
				if(data[keyword] === olddata[keyword]){
					return newdata;
				}
			});
		} else {
			if(!/all/.test(gird_modify)) {
				newdata.gird_modify = gird_modify.replace("," + columnName + ",", ",");
				container.removeClass("ui-datagrid-change-cell");
				if(activeIdDom) {
					activeIdDom.removeClass("ui-datagrid-change-cell");
				}
			}
		}
		
		// 重置活动项
		this._global.activeControl = this._global.activeColumn = this._global.activeIdDom = null;

		// 处理界面显示
		this.processingGrid();

		return true;
	},
	/**
	 * 不同类型控件行内编辑时的特殊处理
	 * @private
	 */
	controlType : {
		"TextBox" : function(activeControl) {
			var value = activeControl.getValue();
			return [value, value];
		},
		"CheckBoxGroup" : function(activeControl, columCfg) {
			// 复选框控件只能对应boolean列进行操作
			var value = activeControl.getValue();
			// 临时判断
			value = value === true ? "true" : "false";
			var text = value === "true" ? columCfg.trueText : columCfg.falseText;
			return [value, text];
		},
		"Select" : function(activeControl) {
			var value = activeControl.getValue(), text = activeControl.getText();
			return [value, text];
		},
		"DatePicker" : function(activeControl) {
			var value = activeControl.getValue();
			return [value, value];
		},
		"SelectTree" : function(activeControl) {
			var value = activeControl.getValue(), text = activeControl.getText();
			return [value, text];
		}
	},
	/**
	 * 多表头时，修正列配置
	 * @param {Array{JsonObject}} columns DataGrid列配置
	 * @param {Array{JsonObject}} childCols 伪列子列配置
	 * @param {Boolean} parseChildCol 当前方法是否在解析子列
	 * @param {Number} index 伪列中真实列时的修正索引值
	 * @private
	 */
	correctColumns : function(columns, childCols, parseChildCol, index) {
		childCols = childCols || columns;
		for(var i = 0, column; column = childCols[i]; i++) {
			// 如果当前列为伪列,则删除伪列，并获取下一个修正索引值
			if(column.columns) {
				if(parseChildCol !== true) {
					columns.splice(i, 1);
				}
				// 修正索引值以DataGrid列配置的第一个伪列索引值为初始值
				index = this.correctColumns(columns, column.columns, true, index || i);

			} else if(parseChildCol) {
				// 如果当前列是伪列中的真实列，则将此列增加至DataGrid列配置中
				columns.splice(index++, 0, column);
			}
		}
		return index;
	},
	/**
	 * 合并数据相同的单元格
	 * @private
	 */
	mergeCell : function() {
		var cellList = [],cells;
		var rows = this._global.dataContainer.find("tr:gt(0)");
		// 找出当前表格所有单元格对象形成一个二维数组
		rows.each(function(elem) {
			cells = fastDev(elem).find("td").elems;
			cellList.push(cells);
			fastDev.each(cells,function(cellIndex, elem){
				fastDev(elem).attr("realCellIndex", cellIndex);
			});
		});
		// 计算获得合并指令列表
		var statementList = this.getStatementList(0, this._global.dataColStart, this.dataset.getSize() - 1, cellList[0].length, cellList);

		// 执行合并指令 指令格式为 列:起始合并行-终止合并行
		for(var i = 0, statement; statement = statementList[i]; i++) {
			while(statement[0]) {
				// 解析指令
				var s = statement.pop(), statementInfo = s.split(":"), mergeInfo = statementInfo[1].split("-"), rowindex = parseInt(mergeInfo[0], 10), maxmergerow = parseInt(mergeInfo[1], 10) + 1, colindex = parseInt(statementInfo[0], 10);
				// 改变列的跨行数
				fastDev(cellList[rowindex][colindex]).prop("rowspan", maxmergerow - rowindex);
				// 删除多余列
				for(; rowindex + 1 < maxmergerow; rowindex++) {
					fastDev(cellList[rowindex+1][colindex]).remove();
				}
			}
		}
	},
	/**
	 * 获取合并指令列表
	 * @param {Number} rowStart 合并起始行
	 * @param {Number} cellStart 合并起始列
	 * @param {Number} rowEnd 合并终止行
	 * @param {Number} cellEnd 合并终止列
	 * @param {Array{Array{Element}}} cellList 二维单元格数组
	 * @private
	 */
	getStatementList : function(rowStart, cellStart, rowEnd, cellEnd, cellList) {
		var totalStatement = [], statementList = this.getStatement(cellStart, rowStart, rowEnd, cellList).slice(0);

		while(statementList[0]) {
			var statement = [statementList.shift()];
			for(var i = 0, colIndex = 0; i < statement.length && colIndex < cellEnd; i++) {
				var s = statement[i], mergeInfo = s.split(":");
				colIndex = mergeInfo[0];
				var rowstart = mergeInfo[1].split("-")[0], rowlen = mergeInfo[1].split("-")[1], param = this.getStatement(+colIndex + 1, parseInt(rowstart, 10), parseInt(rowlen, 10), cellList).slice(0);
				statement = statement.concat(param);
			}
			totalStatement.push(statement);
		}
		return totalStatement;
	},
	/**
	 * 获取合并指令
	 * @param {Number} colIndex 当前合并列索引
	 * @param {Number} rowstart 当前合并起始行索引
	 * @param {Number} rowlen 当前合并终止行索引
	 * @param {Array{Array{Element}}} cellList 二维单元格数组
	 * @private
	 */
	getStatement : function(colnum, rowstart, rowEnd, cellList) {
		var startRow = 0, statement = [], exec = false, count = 0, globaltext = "";
		for(; rowstart <= rowEnd; rowstart++) {
			var currtext = fastDev(cellList[rowstart][colnum]).find(".ui-datagrid-inner").attr("value");
			if(currtext !== globaltext) {
				globaltext = currtext;
				if( exec = !!count) {
					this.pushStatement(rowstart - (count + 1), count, colnum, statement);
					exec = false;
					count = 0;
					startRow = rowstart;
				}

			} else {
				count++;
			}
			if(rowstart === rowEnd) {
				exec = !!count;
			}
			if(exec) {
				this.pushStatement(rowstart - count, count, colnum, statement);
				count = 0;
			}
		}
		return statement;
	},
	/**
	 * 保存合并指令
	 * @param {Number} rowStart 合并起始行
	 * @param {Number} mergeCount 合并行数
	 * @param {Number} colIndex 列索引
	 * @param {Array{String}} statement 指令列表
	 * @private
	 */
	pushStatement : function(rowStart, mergeCount, colIndex, statement) {
		if(mergeCount) {
			statement.push(colIndex + ":" + rowStart + "-" + (rowStart + mergeCount));
		}
		return statement;
	},
	/**
	 * 更改显示状态
	 * @param {String} fieldName 列名
	 * @param {String} oper 操作码
	 * @private
	 */
	changeDisplayState : function(fieldName, oper) {
		var global = this._global, column, columns = this._options.columns, index = 0;
		// 查找目标列的索引值
		for(; column = columns[index]; index++) {
			if(column.name === fieldName) {
				column.hidden = oper === "hide";
				break;
			}
		}
		var header, body = global.dataContainer.find("tr").elems;
		// 普通情况下显示/隐藏标题列
		if(!fastDev.isValid(global.cloneColumns)) {
			header = global.headerContainer.find("tr").elems,
			// 隐藏/显示标题宽度限制列
			fastDev(header[0]).find("td:eq(" + index + ")")[oper]();
			// 隐藏标题
			fastDev(header[1]).find("td:eq(" + index + ")")[oper]();
		} else {
			// 多表头情况下显示/隐藏标题列
			this.buildTitleTpl(global.cloneColumns.slice(0));
			global.params.colTitleTpl = global.colTitleTpl;
			this.renderDynamicHtml(global.headerContainer.find("[name='header']"),"header");
			header = global.headerContainer.find("tr").elems;
			for(var cellIndex = 0; column = columns[cellIndex]; cellIndex++) {
				if(column.hidden === true) {
					// 隐藏/显示标题宽度限制列
					fastDev(header[0]).find("td:eq(" + cellIndex + ")").hide();
				} else {
					fastDev(header[0]).find("td:eq(" + cellIndex + ")").show();
				}
			}
		}

		// 显示/隐藏数据列
		for(var rowIndex = 0, tr; tr = body[rowIndex]; rowIndex++) {
			fastDev(tr).find("td:eq(" + index + ")")[oper]();
		}
		this.calculateWidth(this._options.width);
	},
	/**
	 * 隐藏列
	 * @param {String} fieldName 列名
	 * @member fastDev.Ui.DataGrid
	 */
	hideColumn : function(fieldName) {
		this.changeDisplayState(fieldName, "hide");
	},
	/**
	 * 显示列
	 * @param {String} fieldName 列名
	 * @member fastDev.Ui.DataGrid
	 */
	showColumn : function(fieldName) {
		this.changeDisplayState(fieldName, "show");
	},
	getColumnInfo : function(columns,index){
		for(var i=0,repair=0,column;column=columns[i];i++){
			if(column.hidden===true){
				repair++;
			}
			if(i-repair===index){
				return column;
			}
		}
	},
	resetActiveColumn : function(){
		this._global.activeControl = this._global.activeColumn = this._global.activeIdDom = null
	}
});

/**
 * @class fastDev.Ui.Editor
 * @extends fastDev.Ui.Component
 * 富文本框控件 富文本框主要支持对文本进行直接的编辑，如设置字体、粗体、高亮、列表等等，功能众多，开发起来工作量较大，现在网上有强大、稳定的第三方开源控件，本控件直接封装了百度ueditor组件，直接做接口适配封装后集成。有简单和完整两种模式，能在表单组件内使用。<p>
 * 注意事项：使用该控件的页面除引用框架的js外，还需要引用2个ueditor的js和1个css文件。
 * 控件不能缺少container属性。<p>
 * 作者： 姜玲
 *
 *			<div id="example" style="width:500px; height:400px;">
 *			<div itype="Editor" container="example" id="editor1" mode="complete"	 saveInstance="true" value="这是值"></div>
 *			</div>
 */
fastDev.define("fastDev.Ui.Editor", {
	extend : "fastDev.Ui.Component",
	alias : "Editor",
	_options : {
		/**
		 * 控件容器id
		 * @type {String}
		 */
		container : null,
		/**
		 * 用于设置控件没值时的提示文本
		 * @type {String}
		 */
		initialContent : '<span style=\"color:#ccc\">请输入详细内容</span>',
		/**
		 * 控件没值时，是否显示提示文本
		 * @type {Boolean}
		 */
		autoClearinitialContent : true,
		/**
		 * 初始值的url
		 * @type {String}
		 */
		dataSource : "",
		/**
		 * 用于设置控件的初始值
		 * @type {String}
		 */
		value : "",
		/**
		 * 设置名称
		 * @type {String}
		 */
		name : "editor",
		/**
		 * 设置id
		 * @type {String}
		 */
		id : "editor",
		/**
		 * 设置控件类型,有简单和完整simple/complete两种
		 * @type {String}
		 */
		mode : "simple",
		/**
		 * 设置控件工具栏，simple类型时使用
		 * @type {Array}
		 */
		toolbars : "",
		/**
		 * 允许的最大字符数
		 * @type {Number}
		 */
		maximumWords : 10000,
		/**
		 *  iframe的最小高度
		 * @type {Number}
		 */
		minFrameHeight : 320,
		/**
		 * 是否启用Dom结构显示
		 * @type {Boolean}
		 */
		elementPathEnabled : false,
		/**
		 * 是否开启字数统计
		 * @type {Boolean}
		 */
		wordCount : false,
		validateItems : {
			requires : false
		},		
		enableDataSet : false,
		enableInitProxy : false,
		enableDataProxy : false
	},
	_global : {
		editor : null,
		containerid : ""
	},
	/**
	 * 面板参数准备
	 * @protected
	 */
	ready : function(options, global) {
		// 初始化容器
		if(fastDev.isString(options.container)) {
			global.containerid = options.container;
		} else {
			global.containerid = fastDev(options.container).prop("id");
		}
		this.setID(options.id);
	},
	/**
	 * 初始化控件列表
	 * @param {Array} items数据项
	 * @protected
	 */
	construct : function(options, global) {
		var containerId = global.containerid, editor;
		//根据编辑器的其他的配置的属性，给编辑器进行配置
		try {
			if(options.mode === "simple") {
				editor = new baidu.editor.ui.Editor({
					toolbars : options.toolbars || [['FontFamily', 'FontSize', 'Bold', 'Italic', 'Underline', 'ForeColor', 'BackColor', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'Link', 'InsertUnorderedList', 'InsertOrderedList', 'Source']],
					elementPathEnabled : options.elementPathEnabled, //是否启用elementPath
					wordCount : options.wordCount, //是否开启字数统计
					initialContent : options.initialContent,
					minFrameHeight : options.minFrameHeight,
					textarea : options.name,
					autoClearinitialContent : options.autoClearinitialContent,
					maximumWords : options.maximumWords
				});
			} else {
				editor = new baidu.editor.ui.Editor({
					initialContent : options.initialContent,
					textarea : options.name,
					minFrameHeight : options.minFrameHeight,
					autoClearinitialContent : options.autoClearinitialContent,
					maximumWords : options.maximumWords
				});
			}
			editor.render(containerId);

			global.editor = editor;
			//表单必须是post模式，get模式提交不了那么多字符
			//this.storage($("#"+containerId));
			options.container = null;
		} catch(e) {
			throw e;
		}
	},
	/**
	 * 从一个数据源URL地址设置控件的值
	 * @param {String}
	 */
	setValueByUrl : function(url) {
		var options = this._options;
		var that = this;
		var editor = this._global.editor;
		fastDev.Ajax.doPost(url, {
			complete : function(data) {
				editor.setContent(data.text);
			}
		});
	},
	/**
	 * 设置id
	 * @param {String}
	 */
	setID : function(id) {
		if(!id) {
			id = fastDev.getID();
			this._options.id = id;
		}
	},
	/**
	 * 获取id
	 */
	getID : function() {
		var options = this._options;
		if(options.id) {
			return options.id;
		}
	},
	/**
	 * 设置值
	 * @param {String}
	 */
	setValue : function(value) {
		if(value) {
			var editor = this._global.editor;
			editor.setContent(unescape(value));
		}
	},
	/**
	 * 得到值
	 * @return {String}
	 */
	getValue : function() {
		var editor = this._global.editor;
		var result = editor.getContent();
		result = escape(result);
		return "" + result;
	},
	/**
	 * 得到文本
	 * @return {String}
	 */
	getText : function() {
		var editor = this._global.editor;
		var result = editor.getContentTxt();
		return "" + result;
	},
	/**
	 * 设置获取焦点　
	 */
	focus : function() {
		var editor = this._global.editor;
		editor.focus();
	}
	//	validate : function() {
	//			return talkweb.BaseControl.SimpleControl.Class.validate.call(this);
	//		}
});

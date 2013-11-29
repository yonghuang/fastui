(function() {
	fastDev.apply(fastDev.Ui.Component, {
		ready : function() {
			if(this._template) {
				this._template = fastDev.create("Template", {
					htmlList : this._template,
					component : this
				});
			}
		},
		construct : function() {

		},
		init : function(options, global) {
			var options = this.getOptions();
			this.setID && this.setID(options.id);
			if(options.saveInstance === true) {
				fastDev.Core.ControlBus.setInstance(this.getID(), this);
			}
			this.applyContainer();
		},
		getID : function() {
			return this[0] && this[0].getAttribute("id") || this.getOptions().id;
		},
		setID : function(id) {
			var options = this.getOptions();
			options.saveInstance === true && (id || ( id = talkweb.ControlBus.getID()));
			if(options.isReConstruct && options.isReConstruct === true) {
				id && this.setOptions({
					id : id
				});
			} else {
				id && this.attr("id", id);
			}
		},
		validate : function() {
			return talkweb.BaseControl.SimpleControl.Class.validate.call(this);
		},
		getInitURL : function() {
			var options = this.getOptions();
			return options.initSource || "";
		},
		/*
		 * Description:获取控件的数据值地址
		 * Param:none
		 * Return:dataSource 数据值地址
		 */
		getDataURL : function() {
			var options = this.getOptions();
			return options.dataSource || "";
		},
		/*
		 * Description:获取控件编码后的初始化数据地址
		 * Param:none
		 * Return:initSource 编码后的初始化数据地址
		 */
		getInitURLByEncode : function(reset) {
			return encodeURI(this.getInitURL(reset));
		},
		/*
		 * Description:获取控件编码后的数据值地址
		 * Param:none
		 * Return:dataSource 编码后的数据值地址
		 */
		getDataURLByEncode : function() {
			return encodeURI(this.getDataURL());
		},
		storage : function(obj, append) {
			append === true ? (this[0] || (this[0] = this.createFragment())) && this[0].appendChild(obj[0] || obj) : this[0] = obj;
			this.length = 1;
			return this;
		},
		find : function(condition) {
			var result, control = this[0] || document.body;
			result = $(control).find(condition);
			var tagName = result[0] ? result[0].tagName.toLowerCase() : "";
			if(tagName) {
				tagName = fastDev.Util.StringUtil.capitalize(tagName);
				Class = talkweb.BaseControl[tagName];
				if(Class) {
					return Class().reConstruct(result);
				}
			}
		}
	});
})()

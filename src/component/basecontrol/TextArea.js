(function() {
	
	talkweb.BaseControl.TextArea = function(settings){
		return fastDev.create("talkweb.BaseControl.TextArea.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.TextArea.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			initialContent : ""
		},
		construct : function() {
			var textarea = this.create("textarea");
			this.storage(textarea);
		},
		init : function(options) {
			options.readOnly ? this.setReadOnly(true) : this.setReadOnly(false);
			this.setInitContent();
		},
		setReadOnly : function(readOnly) {
			readOnly === true ? this.attr("readOnly", readOnly) : this.removeAttr("readOnly");
		},
		setValue : function(param) {
			if(param === "" || param === 0 || param) {
				this.attr("value", param);
				this.getOptions().initialContent && this.setStyle({
					color : "#075586"
				});
			}
		},
		getValue : function() {
			var options = this.getOptions();
			if(options.initialContent && options.initialContent === this.attr("value")) {
				return "";
			} else {
				return this.attr("value");
			}
		},
		getInitText : function() {
			return this.attr("value");
		},
		setInitContent : function() {
			var options = this.getOptions();
			if(options.initialContent) {
				this.setValue(options.initialContent);
				this.setStyle({
					color : "#cccccc"
				});
				var that = this;
				var focusIncon = function() {
					if(options.initialContent && options.initialContent === that.getInitText()) {
						that.setValue("");
						that.setStyle({
							color : "#075586"
						});
					}
					return that;
				};
				var blurIncon = function() {
					if(options.initialContent && !that.getInitText()) {
						that.setValue(options.initialContent);
						that.setStyle({
							color : "#cccccc"
						});
					}
					return that;
				};
				this.onFocus(focusIncon);
				this.onBlur(blurIncon);
			}
		}
	})
})()
(function() {

	talkweb.BaseControl.Text = function(settings) {
		return fastDev.create("talkweb.BaseControl.Text.Class", settings);
	};

	fastDev.define("talkweb.BaseControl.Text.Class", {
		extend : "talkweb.BaseControl.Input",
		_options : {
			id : null,
			name : null,
			className : null,
			value : null,
			initialContent : "",
			type : "text"
		},
		init : function() {
			this.setInitContent();
			//talkweb.BaseControl.Button.Class.superClass.init.call(this);
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
		setValue : function(param) {
			if(param === "" || param === 0 || param) {
				this.attr("value", param);
				this.getOptions().initialContent && this.setStyle({
					color : "#075586"
				});
			}
		},
		setInitContent : function(initialContent) {
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
					if(options.initialContent && (!that.getInitText())) {
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
	});
})()
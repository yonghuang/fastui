(function() {
	
	talkweb.BaseControl.Span = function(settings){
		return fastDev.create("talkweb.BaseControl.Span.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Span.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_global : {
			textNode : null
		},
		construct : function() {
			var span = this.create("span");
			this.storage(span);
		},
		setValue : function(value) {
			value && this.setText(value);
		},
		getValue : function() {
			return this.getText();
		},
		setWidth : function(width) {
			width && this.setStyle({
				display : "inline-block"
			});
			this.superClass.setWidth.call(this,width);
		},
		reConstruct : function(obj) {
			var clazz = talkweb.BaseControl.Span.Class.superClass;
			clazz.reConstruct_TextNode.call(this, obj);
			return clazz.reConstruct.call(this, obj);
		}
	})
})()
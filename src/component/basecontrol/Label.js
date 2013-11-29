(function() {
	talkweb.BaseControl.Label = function(settings){
		return fastDev.create("talkweb.BaseControl.Label.Class",settings);
	};
	
	fastDev.define("talkweb.BaseControl.Label.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			id : null,
			name : null,
			className : "label",
			value : "label:",
			target : ""
		},
		construct : function() {
			var label = this.create("label");
			this.storage(label);
		},
		setValue : function(value) {
			this.setText(value);
		},
		getValue : function() {
			return this.getText();
		},
		setTarget : function(target) {
			target && (this.addAttr(this.createAttr("for",target)));
		},
		getTarget : function() {
			return this.attr("htmlFor");
		},
		init : function(options){
			this.setTarget(options.target);
		},
		reConstruct :function(obj){
			obj instanceof Array && ( obj = obj[0]);
			this.reConstruct_TextNode.call(this,obj);
			return this.superClass.reConstruct.call(this,obj);
		}
	})
})()
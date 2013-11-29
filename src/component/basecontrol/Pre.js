(function() {
	
	talkweb.BaseControl.Pre = function(settings){
		return fastDev.create("talkweb.BaseControl.Pre.Class",settings)
	};
	
	fastDev.define("talkweb.BaseControl.Pre.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			id : null,
			name : null,
			className : "pre"
		},
		_global : {
			textNode : null
		},
		construct : function() {
 			var pre = this.create("pre");
 			this.storage(pre);
 		},
 		setValue : function( value ) {
 			value && this.setText(value);
 		},
 		getValue : function() {
 			return this.getText();
 		},
		reConstruct : function( obj ) { 
			this.reConstruct_TextNode.call(this, obj);
			return this.superClass.reConstruct.call(this, obj);
		}
	})

})()

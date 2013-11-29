(function(){
	fastDev.define("talkweb.BaseControl.Input",{
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			id : null,
			name : null,
			className : "input",
			value : null,
			readOnly : false,
			type : "text"
		},
		construct : function(){
			var input = this.create("input"),options = this.getOptions();
			input.setAttribute("type",options.type);
			this.storage(input);
		},
		init : function(){
			var options = this.getOptions();
			options.readOnly?this.setReadOnly(true):this.setReadOnly(false);
			//talkweb.BaseControl.Input.Class.superClass.init.call(this);
		},
		setReadOnly : function(readOnly){
			readOnly === true ? this.attr("readOnly",readOnly):this.removeAttr("readOnly");
		}
		
	});
	
})()
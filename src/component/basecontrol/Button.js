(function() {
	talkweb.BaseControl.Button = function(settings){
		return fastDev.create("talkweb.BaseControl.Button.Class",settings);
	}
	
	fastDev.define("talkweb.BaseControl.Button.Class",{
		extend : "talkweb.BaseControl.Input",
		_options : {
			id : null,
			name : null,
			className : "button",
			value : "button",
			type : "button",
			disabled:false
		},
		init :function(options){
			options.disabled === true && this.disabled();
		},
		disabled : function(){
    		this[0].disabled = true;    		
    	},
    	unDisabled : function(){
    		this[0].disabled = null;
    		try{
    		delete this[0].disabled;	
    		}catch(e){}
    	}
	})
})()
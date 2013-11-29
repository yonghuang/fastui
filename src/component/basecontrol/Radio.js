(function() { 
	
	talkweb.BaseControl.Radio = function(settings){
		return fastDev.create("talkweb.BaseControl.Radio.Class",settings);
	};
	
	fastDev.define("talkweb.BaseControl.Radio.Class",{
		extend :"talkweb.BaseControl.Input",
		_options :{
			id : null,
			name : null,
			className : null,
			value : "",
			type : "radio",
			checked:false
		},
		init :function(options){	
			options.checked && this.check();	
		},
		setName : function(name){
			name  || (name = talkweb.ControlBus.getID());
			talkweb.BaseControl.Radio.Class.superClass.setName.call(this,name);
		},
		check : function(){			
			this[0].checked = true;
    		this[0].defaultChecked = true;
		},
		uncheck : function(){		
			this[0].checked = false;
    		this[0].defaultChecked = false;
		},
		isChecked :function(){
			if(this[0].checked===undefined || this[0].checked===""){
				return this[0].defaultChecked;
			}
			else{
				return this[0].checked;
			}
		}
	})
})()
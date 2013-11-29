(function(){
	talkweb.BaseControl.CheckBox = function(settings){
		return fastDev.create("talkweb.BaseControl.CheckBox.Class",settings)	
	}
	
	fastDev.define("talkweb.BaseControl.CheckBox.Class",{
		extend : "talkweb.BaseControl.Input",
		_options : {
			id : null,
			name : null,
			className : null,
			value : "",
			type : "checkbox",
			checked:false
		},
		init :function(options){	
		debugger;
			if(""+options.checked === "true" || ""+options.checked === "1" ){
				this.check();
			}else{
				this.unCheck();
			}
			if(options.value){
				 this.attr("value", options.value);
			}	 
		},
    	check : function(){
    		this[0].checked = true;
    		this[0].defaultChecked = true;
    	},
		getValue : function() {
			return this.isChecked()?this.attr("value"):"";
		},
	//	setValue : function(param) {			
//			 if(typeof param === 'string') {
//				 this.attr("value", param);
//			 }else{
//				param===true? this.check() : this.unCheck(); 
//			 }
//		},
		setValue : function(param) {			
		debugger;
			 if(""+param === 'true' || ""+param === "1" ) {
				this.check();
			 }else if(""+param === 'false' || ""+param === "0" ){
				this.unCheck();
			 }else{
				  this.attr("value", param);
			 }
		},		
		getText : function() {
			return this.attr("value");
		},		
    	unCheck : function(){
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
	});
	
})()
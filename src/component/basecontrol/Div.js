(function(){
	talkweb.BaseControl.Div = function(settings){
		return fastDev.create("talkweb.BaseControl.Div.Class",settings);
	}
	
	fastDev.define("talkweb.BaseControl.Div.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		construct : function(){
			var div = this.create("div");
			this.storage(div);
		}
	});

})()
(function() {
	talkweb.BaseControl.Hidden = function(settings){
		return fastDev.create("talkweb.BaseControl.Hidden.Class",settings);
	}
	
	fastDev.define("talkweb.BaseControl.Hidden.Class",{
		extend : "talkweb.BaseControl.Input",
		_options :{
			type : "hidden"
		}
	});
})()
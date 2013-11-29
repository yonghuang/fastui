(function(){	
	talkweb.BaseControl.File = function(settings){
		return fastDev.create("talkweb.BaseControl.File.Class",settings);
	}
	fastDev.define("talkweb.BaseControl.File.Class",{
		extend : "talkweb.BaseControl.Input",
		_options : {
			type : "file",
			className : "file"
		}
	});
})();
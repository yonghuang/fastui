(function(){	
	
	talkweb.BaseControl.Password = function(settings){
		return fastDev.create("talkweb.BaseControl.Password.Class",settings);
	};
	
	fastDev.define("talkweb.BaseControl.Password.Class",{
		extend: "talkweb.BaseControl.Input",
		_options : {
			type : "password"
		}
	});
})();
(function(){
	
	talkweb.BaseControl.Body = function(){
		return fastDev.create("talkweb.BaseControl.Body.Class");
	}
	
	fastDev.define("talkweb.BaseControl.Body.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		construct :function(){
			var body = document.body;
			this.storage(body);
		}
	});
	
	
})()

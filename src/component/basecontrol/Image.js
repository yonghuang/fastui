(function() {
	talkweb.BaseControl.Image = function(settings){
		return fastDev.create("talkweb.BaseControl.Image.Class",settings);
	};
	
	fastDev.define("talkweb.BaseControl.Image.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			src : null
		},
		construct : function() {
			var image = this.create("img");
			this.storage(image);
		},
		init : function(options) {
			this.setSrc(options.src);
		},
		setSrc : function(src) {
			src && this.attr("src", src);
		},
		getSrc : function() {
			return this.attr("src");
		}
	});
})()

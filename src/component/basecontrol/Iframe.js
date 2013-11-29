(function() {
	talkweb.BaseControl.Iframe = function(settings){
		return fastDev.create("talkweb.BaseControl.Iframe.Class",settings);
	};
	
	fastDev.define("talkweb.BaseControl.Iframe.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			show : true,
			src : null,
			border : true,
			scrolling : "auto"
		},
		construct : function(options) {
			var iframe=this.create("iframe");
			this.setGlobal({iframe:iframe});
			this.storage(iframe);
		},
		init : function(options) {
			options.border === true ? this.showBorder() : this.hideBorder();
			options.show === true ? this.showIframe() : this.hideIframe();
			this.setSrc(options.src); options.border === true ? this.showBorder() : this.hideBorder();
			this.setScrolling(options.scrolling);
		},
		showIframe : function (){
			this.getGlobal().iframe.style.display = "block";
		},
		hideIframe : function (){
			this.getGlobal().iframe.style.display = "none";
		},
		setSrc : function(src) {
			src && this.attr("src", src);
		},
		getSrc : function() {
			return this.attr("src");
		},
		showBorder : function() {
			this.attr("frameborder","1");
		},
		hideBorder : function() {
			this.attr("frameborder","0"); 
		},
		setScrolling : function(scrolling){
			/yes|no|auto/.test(scrolling) && this.attr("scrolling",scrolling);
		},
		getScrolling :function(){
			return this.attr("scrolling");
		}
	});
})()
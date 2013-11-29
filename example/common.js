$(function() {
	// fastDev.Core.ControlBus.bindCheckComplete(function(msg){
		// fastDev.tips(msg);
	// });
	
	// fastDev.Core.ControlBus.checkSession("timeout.json",function(msg){
		// fastDev.tips(msg);
	// });
	fastDev.Core.ControlBus.compile();
	var dom= fastDev.Dom.createByHTML("<div style='padding:10px'><div id='uyan_frame'></div></div>");
	fastDev("body").append(dom);
	
});
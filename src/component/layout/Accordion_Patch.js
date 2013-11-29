(function() {
	talkweb.Components.Accordion = fastDev.apply(
	    function(settings){
		    return fastDev.create("fastDev.Ui.Accordion",settings);
	    },
		fastDev.Ui.Accordion);
		
	fastDev.Core.ClassManager.addAlias("talkweb.Components.Accordion","fastDev.Ui.Accordion");
	
	fastDev.apply(fastDev.Ui.Accordion._options, {
		expand : null,
		collect : null
	});
fastDev.apply(fastDev.Ui.Accordion, {
	ready:function(options, global){		
		options.onExpand =options.expand;
		options.onCollect =options.collect;
	}
	});
	
})()
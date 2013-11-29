(function() {
	talkweb.Components.Navigation = fastDev.apply(
	    function(settings){
		    return fastDev.create("fastDev.Ui.Navigation",settings);
	    },
		fastDev.Ui.Navigation);
		
	fastDev.Core.ClassManager.addAlias("talkweb.Components.Navigation","fastDev.Ui.Navigation");
	
	fastDev.apply(fastDev.Ui.Navigation._options, {
		click : null,
		expand : null,
		collect : null
	});
fastDev.apply(fastDev.Ui.Navigation, {
	ready:function(options, global){		
		options.onItemClick =options.click;
		options.onExpand =options.expand;
		options.onCollect =options.collect;
	}
	});
	
})()
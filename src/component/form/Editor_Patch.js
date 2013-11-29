	talkweb.Components.Editor = fastDev.apply(
	    function(settings){
		    return fastDev.create("fastDev.Ui.Editor",settings);
	    },
		fastDev.Ui.Editor);
		
	fastDev.Core.ClassManager.addAlias("talkweb.Components.Editor","fastDev.Ui.Editor");
	
	talkweb.Business.Chooseusers = fastDev.apply(
	    function(settings){
		    return fastDev.create("fastDev.Ui.Chooseusers",settings);
	    },
		fastDev.Ui.Chooseusers);
		
	fastDev.Core.ClassManager.addAlias("talkweb.Business.Chooseusers","fastDev.Ui.Chooseusers");
	talkweb.Components.FieldSet = fastDev.apply(
	    function(settings){
		    return fastDev.create("fastDev.Ui.FieldSet",settings);
	    },
		fastDev.Ui.FieldSet);
		
	fastDev.Core.ClassManager.addAlias("talkweb.Components.FieldSet","fastDev.Ui.FieldSet");
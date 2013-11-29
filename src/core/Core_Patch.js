fastDev.namespace("talkweb.Bus");

fastDev.apply(talkweb.Bus,{
	ready : function(pageConfig){
		fastDev(function(){
			talkweb.Bus.constructControl(pageConfig.items || []);
		});
		
	},
	constructControl : function(items){
		while(items[0]){
			var item = items.shift(),clazz = item.classPath.split(".")[1];
			fastDev.Patch[clazz].parseAttr(item.options);
		}
	}
})


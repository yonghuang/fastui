fastDev.apply({
	parseMapping : function(config,mapping){
		var key;
		fastDev.each(config,function(p,value){
			if(key = mapping[p]){
				config[key] = config[p];
				config[p] = null;
				delete config[p];
			}
		});
		return config;
	}
});

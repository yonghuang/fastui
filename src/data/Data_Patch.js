fastDev.apply(fastDev.Data.Reader,{
	read : function(data, type) {
		var method = "read" + fastDev.Util.StringUtil.capitalize(type || "json"),

		data = this[method](data);
		
		if(data.length && data[0].cacheData){
			return data[0].cacheData;
		}else{
			return data;
		}
	}
});

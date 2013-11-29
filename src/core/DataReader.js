fastDev.Core.DataBus.dataReader = function(data){
	return fastDev.isArray(data)?data[0].cacheData?data[0].cacheData:data:data.cacheData?data.cacheData:data;
};

// RadioGroup兼容子类 
fastDev.namespace("talkweb.Components");

fastDev.define("fastDev.Patch.RadioGroup",{
	extend : "fastDev.Ui.RadioGroup",
	alias : "Patch.RadioGroup",
	mapping :{
		"columnsCount" : "repeatItems",
		"columnsWidth" : "itemWidth",	
		"click" : "onValueChange"
	},
	// CheckBoxGroup兼容属性属性解析 
	parseAttr : function(config){
		return fastDev.create("Patch.RadioGroup",fastDev.parseMapping(config,this.mapping));
	}
});
talkweb.Components.RadioGroup = function(config){
	return fastDev.Patch.RadioGroup.parseAttr(config);
}
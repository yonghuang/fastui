// CheckBoxGroup兼容子类 
fastDev.namespace("talkweb.Components");

fastDev.define("fastDev.Patch.CheckBoxGroup",{
	extend : "fastDev.Ui.CheckBoxGroup",
	alias : "Patch.CheckBoxGroup",
	mapping :{
		"columnsCount" : "repeatItems",
		"columnsWidth" : "itemWidth",	
		"click" : "onValueChange"
	},
	// CheckBoxGroup兼容属性属性解析 
	parseAttr : function(config){
	  return fastDev.create("Patch.CheckBoxGroup",fastDev.parseMapping(config,this.mapping));
	},
	/**
	 * 根据html重新构建控件的方法
	 * @private
	 */
	reConstruct : function(obj) {
		var controlList = this._global.controlList || [];
		for(var i = 0; i < obj.length; i += 1) {
			controlList.push(talkweb.Components.CheckBoxGroup.CheckBox({}, false).reConstruct(obj[i]));
			var id = $(obj[i]).attr("id");
			id && (this._options.id = id);
		}
		this._options.isReConstruct = true;
		this._global.controlList = controlList;
		return this;
	}
});

talkweb.Components.CheckBoxGroup = function(config){
	return fastDev.Patch.CheckBoxGroup.parseAttr(config);
}



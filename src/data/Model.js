fastDev.define("fastDev.Data.Model", {
	alias : "Model",
	ready : function() {
		this.fields = {};
	},
	construct : function(options) {
		var fields = options.fields, mapper = options.mapper || {};
		for(var i = 0, field; field = fields[i]; i++) {
			this.addField(field, mapper);
		}
	},
	addField : function(config, mapper) {
		config = fastDev.isString(config) ? {
			name : config
		} : config;

		config.type = /String|Int|Float|Boolean|S_Array|S_Map|S_Tree/.test(config.type) ? config.type : "Object";

		switch(config.type) {
			case "Object":
			case "String" :
				config.defaultValue = this.convertString(config.defaultValue);
				break;
			case "Int" :
			case "Float" :
				config.defaultValue = /^(?:\d*\.|)\d+$/.test(config.defaultValue) ? config.defaultValue * 1 : 0;
				break;
			case "Boolean":
				config.defaultValue = config.defaultValue === true;
				break;
			case "S_Array":
			case "S_Map":
			case "S_Tree":
				config.structure = config.type;
				config.type = "Structure";
				break;
		}

		config.mapping = mapper[config.name] || config.mapping || "";
		config.convert = fastDev.isFunction(config.convert) ? config.convert : null;

		this.fields[config.name] = config;
	},
	objectify : function(data) {
		var fields = this.fields, option, value, type, convert, model;
		for(var name in fields) {
			option = fields[name];
			convert = option.convert || this["convert" + option.type];
			value = data[option.mapping];
			value = value === undefined ? this.getValue(data, name) : value;
			data[name] = (value === null || value === undefined) ? option.defaultValue : convert(value);
		}
		return data;
	},
	getValue : function(data, name){
		var path, len, value = data[name];
		if( value === undefined ){
			path = name.split(".");
			len = path.length;
			
			if( len === 1){
				return value;
			}
			
			for(var i = 0 ; i < len ; i ++){
				if((data = data[path[i]]) === undefined){
					break;
				}
			}
			return data;
			//for(var i = 0 ; data = data[path[i]] ; i++, value = data){}
		}
		return value;
	},
	convertString : function(value) {
		return value ? value + "" : "";
	},
	convertInt : function(value) {
		var m = /\d+/.exec(value);
		return m ? +m[0] : 0;
	},
	convertFloat : function(value) {
		var m = /(?:\d*\.|)\d+/.exec(value);
		return m ? +m[0] : 0;
	},
	convertBoolean : function(value) {
		return !!value;
	},
	convertObject : function(value) {
		return value;
	},
	convertStructure : function(value, type, model) {
		return fastDev.create(type, {
			data : value,
			model : model
		});
	}
});

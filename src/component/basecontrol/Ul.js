(function() {

	talkweb.BaseControl.Ul = function(settings) {
		return fastDev.create("talkweb.BaseControl.Ul.Class", settings);
	};

	fastDev.define("talkweb.BaseControl.Ul.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			items : null,
			onClass : "",
			unClass : ""
		},
		construct : function() {
			var ul = this.create("ul");
			this.storage(ul);
		},
		init : function(options) {
			this.constructItems(options.items);
		},
		constructItems : function(items) {
			var param, options = this.getOptions();
			if( items instanceof Array) {
				for(var i = 0, len = items.length; i < len; i += 1) {
					if( typeof items[i] !== "object") {
						param = {
							value : items[i]
						};

					} else {
						param = items[i];
					}
					options.unClass && (param.className = options.unClass);
					param.container = this;
					talkweb.BaseControl.Li(param);
				}
			}
		},
		clean : function() {
			var liList = this[0].childNodes;
			while(liList.length > 0) {
				this[0].removeChild(liList[0]);
			}
		},
		getValue : function(index) {
			return this.getLi(index).getValue();
		},
		select : function(index) {
			var options = this.getOptions();
			if((!index && index !== 0) || !options.onClass || !options.unClass)
				return;
			var li = talkweb.BaseControl.Li().reConstruct(this.find("." + options.onClass));
			li && li.setClass(options.unClass);
			this.getLi(index).setClass(options.onClass);
		},
		getLi : function(index) {
			return talkweb.BaseControl.Li().reConstruct(this.getChildNode(index));
		}
	});

	talkweb.BaseControl.Li = function(settings) {
		return fastDev.create("talkweb.BaseControl.Li.Class", settings);
	};

	fastDev.define("talkweb.BaseControl.Li.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			value : "",
			className : "",
			saveInstance : false
		},
		construct : function(param) {
			var li = this.create("li");
			this.storage(li);
		},
		setValue : function(value) {
			value && this.setText(value);
		},
		setID : function(id) {
			id && this.superClass.setID.call(this, id);
		},
		getValue : function() {
			return this.getText();
		},
		reConstruct : function(obj, reClass) {
			if(obj){
				this.reConstruct_TextNode.call(this, obj);
				return talkweb.BaseControl.Li.Class.superClass.reConstruct.call(this, obj);
			}
		}
	});

})()
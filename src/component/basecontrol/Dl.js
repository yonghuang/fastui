(function() {
	talkweb.BaseControl.Dl = function(settings){
		return fastDev.create("talkweb.BaseControl.Dl.Class",settings);
	}
	
	fastDev.define("talkweb.BaseControl.Dl.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			requires : false,
			head : null,
			body : null,
			ddClassName : "none",
			dtWidth : null,
			formWidth : 0,
			fieldset : false
		},
		construct : function() {
			var dl = this.create("dl");
			this.storage(dl);
		},
		constructItems : function() {
			var options = this.getOptions();
			var dtHeight, ddWidth = parseInt(parseInt(options.formWidth) * (parseInt(options.width) / 100));
			options.height && ( dtHeight = options.height.split("px")[0] * 1 + 4 + "px");
			if(options.head) {
				options.dtWidth && (ddWidth -= parseInt(options.dtWidth));
				talkweb.BaseControl.Dt({
					container : this,
					value : options.head,
					requires : options.requires,
					height : dtHeight,
					width : options.dtWidth
				})
			};
			options.body && talkweb.BaseControl.Dd({
				container : this,
				value : options.body,
				className : options.ddClassName,
				width : options.head ? (ddWidth - (options.fieldset === true ? 35 : 20)) + "px" : ddWidth + "px"
			});
			this.setOptions({
				height : null
			});
		},
		init : function() {
			this.constructItems();
		}
	});

	talkweb.BaseControl.Dt = function(settings) {
		return fastDev.create("talkweb.BaseControl.Dt.Class", settings);
	}

	fastDev.define("talkweb.BaseControl.Dt.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			value : null
		},
		construct : function() {
			var dt = this.create("dt");
			this.storage(dt);
		},
		setValue : function(value) {
			value && this.setText(value);
		},
		init : function(options) {
			options.requires === true && this.append(talkweb.BaseControl.Span({
				className : "redrequires",
				value : "*"
			}));
		}
	});

	talkweb.BaseControl.Dd = function(settings) {
		return fastDev.create("talkweb.BaseControl.Dd.Class", settings);
	}

	fastDev.define("talkweb.BaseControl.Dd.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			value : null
		},
		construct : function() {
			var dd = this.create("dd");
			this.storage(dd);
		},
		setValue : function(value) {
			this.append(value);
		}
	})
})()
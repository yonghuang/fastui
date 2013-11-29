(function() {
	
	talkweb.BaseControl.Form = function(settings){
		return fastDev.create("talkweb.BaseControl.Form.Class",settings);
	}
	
	fastDev.define("talkweb.BaseControl.Form.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			container : null,
			saveInstance : true,
			target : null,
			method : "get",
			enctype : null,
			action : null
		},
		construct : function() {
			var form = this.create("form");
			this.storage(form);
		},
		init : function(options) {
			this.setTarget(options.target);
			this.setMethod(options.method);
			this.setEnctype(options.enctype);
			this.setAction(options.action);
		},
		setTarget : function(target) {
			target && this.attr("target", target);
		},
		setMethod : function(method) {
			method && this.attr("method", method);
		},
		setEnctype : function(enctype) {
			var type = talkweb.ControlBus.getBrowser().type;
			enctype && (type === "msie" ?(this[0].encoding = enctype): (this[0].enctype=enctype));
		},
		setAction : function(action) {
			this.attr("action", action);
		},
		submit : function() {
			this[0].submit();
		},
		onSubmit : function(handle){
			$(this[0]).submit(handle);
			return this;
		},
		reConstruct : function(obj){
			this.storage(obj);
			return this;
		}
	});
	
})()
(function() { 
	
	talkweb.BaseControl.Anchor = function(settings){
		return fastDev.create("talkweb.BaseControl.Anchor.Class",settings);
	};
	
	fastDev.define("talkweb.BaseControl.Anchor.Class",{
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			target : "",
			href : "",
			className : "anchor",
			title : null
		},
		_global : {
			textNode : null
		},
		construct : function() {
			var a = this.create("a");
			this.storage(a);
		},
		init : function(options,global) {
			this.setHref(options.href);
			this.setTarget(options.target);
			this.setTitle(options.title);
		},
		setValue : function(value) {
			this.setText(value);
		},
		getValue : function() {
			return this.getText();
		},
		setHref : function(href) {
			href && this.attr("href", href);
		},
		getHref : function() {
			return this.attr("href");
		},
		setTarget : function(target) {
			target && this.attr("target", target);
		},
		getTarget : function() {
			return this.attr("target");
		},
		setTitle : function(text){
			text && this.attr("title",text);
		},
		getTitle : function(){
			return this.attr("title");
		},
		reConstruct :function(obj){
			this.reConstruct_TextNode.call(this,obj);
			return this.superClass.reConstruct.call(this,obj);
		}
	});
})()
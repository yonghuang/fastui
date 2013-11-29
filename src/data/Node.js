/**
 * @class fastDev.Data.Node
 */
fastDev.define("fastDev.Data.Node", {
	alias : "S_Node",
	prototype : function(setting) {
		this.id = setting.id;
		this.parentid = setting.parentid;
		this.text = setting.text;
		this.children = [];
	}
});

fastDev.Data.Node.constructor = function(setting) {
	return new this.prototype(setting);
};

fastDev.apply(fastDev.Data.Node.prototype.prototype, {
	/**
	 * 增加子节点 
	 * @param {fastDev.Data.Node} node
	 */
	addChild : function(node) {
		this.children.push(node);
		return this;
	},
	/**
	 * 删除子节点
	 * @param {fastDev.Data.Node} node
	 */
	removeChild : function(node) {
		if(!node) {
			return;
		}
		var id = node.id || node;
		for(var i = 0; node = this.children[i]; i++) {
			if(node.id === id) {
				this.children.splice(i, 1);
				break;
			}
		}
	},
	/**
	 * 更新当前节点属性 
	 * @param {Object} parentid
	 * @param {Object} text
	 */
	update : function(parentid, text) {
		this.parentid = parentid || this.parentid;
		this.text = text || this.text;
	},
	getSize : function() {
		return this.children.length;
	},
	sort : function() {
		if(this.children.length !== 0) {
			this.children.sort(this.comparator);
			for(var i = 0, node; node = this.children[i]; i++) {
				node.sort();
			}
		}
	},
	comparator : function(node1, node2) {
		return fastDev.comparator(node1.id, node2.id);
	},
	each : function(fn, level) {
		level++;
		for(var i = 0, len = this.children.length; i < len; i++) {
			fn.call(this.children[i], level, i === 0, i === len - 1, this.children[i].children.length === 0);
			this.children[i].each(fn, level);
		}
	}
});

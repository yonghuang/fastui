/**
 * @class fastDev.Data.Tree
 * 多叉树结构化对象，实现将普通的一维数组的树数据转化成多叉树结构的数据
 */
fastDev.define("fastDev.Data.Tree", {
	alias : "S_Tree",
	prototype : function(fields) {
		this.map = {};
		this.invalid = [];
		this.nodeclass = fields ? this.careteNodePrototype(fields) : fastDev.Data.Node;
	}
});

fastDev.apply(fastDev.Data.Tree.prototype.prototype, {
	/**
	 *  初始化节点之间的父子关系
	 */
	initNodes : function() {
		for(var i = 0, len = this.invalid.length, invalid = []; i < len; i++) {// 在无效节点数组中需找到有效节点
			var node = this.invalid[i], parentid = node.parentid, // 获取节点的父节点id
			parentnode = this.map[parentid];
			// 获取父节点

			if(parentnode) {// 如果父节点存在则将当前节点添加至父节点
				this.map[parentid].addChild(node);
			} else if(parentid === null || parentid === undefined || parentid === "") {// 如果没有父节点且节点中的父节点id无效则当前节点应是根节点
				this.root = node;
			} else {// 不满足以上条件的节点为游离在数结构之外的无效节点
				invalid.push(node);
			}
		}
		if(len !== 0 || len !== invalid.length) {
			this.invalid = invalid;
		}
	},
	/**
	 * 增加一个节点
	 * @param {JsonObject} nodeinfo 节点描述信息
	 */
	addNode : function(nodeinfo) {
		var node = this.map[nodeinfo.id], parentnode = this.map[nodeinfo.parentid];

		if(parentnode) {
			if(node) {
				this.updateNode(nodeinfo);
			} else {
				node = this.createNode(nodeinfo);
				parentnode.addChild(node);
			}
		} else {
			if(!node) {
				node = this.createNode(nodeinfo);
				this.invalid.push(node);
			}
		}
	},
	/**
	 * 创建一个节点对象
	 * @param {JsonObject} nodeinfo 节点描述信息
	 * @private
	 */
	createNode : function(nodeinfo) {
		var node = this.nodeclass.constructor(nodeinfo);
		this.map[nodeinfo.id] = node;
		return node;
	},
	/**
	 * 删除一个节点
	 * @param {String} id 节点id
	 */
	removeNode : function(id) {
		var ids = id.split(","), node, parentnode;
		for(var i = 0; id = ids[i]; i++) {
			node = this.map[id];
			if(!node) {
				continue;
			}
			parentnode = this.map[node.parentid];
			if(parentnode) {
				parentnode.removeChild(node);
			}
		}
	},
	/**
	 * 更改一个节点信息（节点ID不可更改）
	 * @param {JsonObject} nodeinfo
	 */
	updateNode : function(nodeinfo) {
		var id = nodeinfo.id, node = this.map[id];
		if(node) {
			node.update(nodeinfo.parentid, nodeinfo.text);
		}
	},
	/**
	 * 获取根节点
	 * @return {fastDev.Data.Node}
	 */
	getRoot : function() {
		return this.root;
	},
	/**
	 * 根据id指定获取节点
	 * @param {String} id 节点id
	 * @return {fastDev.Data.Node}
	 */
	getNode : function(id) {
		return this.map[id];
	},
	/**
	 * 移动节点至指定父节点
	 * @param {String} id 待移动节点id
	 * @param {String} parentid 目标节点id
	 */
	moveNode : function(id, parentid) {
		var node = this.map[id], parentnode = this.map[parentid];
		if(node && parentnode) {
			this.removeNode(id);
			parentnode.addChild(node);
		}
	},
	sort : function() {
		this.root.sort();
	},
	getSize : function() {
		return this.root.getSize();
	},
	/**
	 * 构建节点对象原型
	 * @param {Array} fields 属性数组
	 * @private
	 */
	careteNodePrototype : function(fields) {
		var prototype = [], nodeclass = function() {
		}, name;
		nodeclass.prototype = fastDev.Data.Node;
		nodeclass = new nodeclass();
		for(var key in fields) {
			prototype.push("\tthis." + key + " = " + "setting." + key + ";\n");
		}
		prototype.push("\tthis.children = [];\n");
		nodeclass.prototype = fastDev.Util.ObjectUtil.parseObject("setting", prototype.join(''));
		fastDev.apply(nodeclass.prototype.prototype, fastDev.Data.Node.prototype.prototype);
		return nodeclass;
		//this.nodeclass = nodeclass;
	},
	clean : function(){
		this.map = {};
		this.root = null;
	}
});

fastDev.Data.Tree.constructor = function(fields) {
	return new this.prototype(fields);
};

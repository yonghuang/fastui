(function() {
talkweb.Components.Tree = fastDev.apply(function(settings){
	return fastDev.create("fastDev.Ui.Tree",settings);
},fastDev.Ui.Tree);

fastDev.Core.ClassManager.addAlias("talkweb.Components.Tree","fastDev.Ui.Tree");

fastDev.apply(fastDev.Ui.Tree._options, {
		treeZindex : "2100",
		yccount : 300,
		dragBefore : null,
		dragAfter : null,
		addBefore : null,
		editBefore : null,
		delBefore : null,
		addAfter : null,
		editAfter : null,
		delAfter : null,
		onclick : null,
		dblclick : null,
		expand : null,
		collect : null,
		loadDataAfter : null
	});
fastDev.apply(fastDev.Ui.Tree, {
	ready:function(options, global){
		options.zindex = options.treeZindex;
		options.delayNum=options.yccount;
		options.onBeforeDrag=options.dragBefore;
		options.onAfterDrag=options.dragAfter;
		options.onBeforeAdd =options.addBefore;
		options.onBeforeEdit=options.editBefore;
		options.onBeforeDel =options.delBefore;
		options.onAfterAdd=options.addAfter;
		options.onAfterEdit =options.editAfter;
		options.onAfterDel =options.delAfter;
		options.onNodeClick =options.onclick;
		options.onNodeDblClick =options.dblclick;
		options.onExpand =options.expand;
		options.onCollect =options.collect;
		options.onAfterLoad=options.loadDataAfter;
	},
	/*
	 * 清空下拉框树的文本框与隐藏域中的值
	 */
	reSet : function() {
		this.clean();
	}
	});
	
})()
var submit = function() {
	var form = fastDev.getInstance("searchForm");
	var datagrid = fastDev.getInstance("datagrid");
	datagrid.refreshData(form.getItems());
};
var submitSuccess = function(data) {
	var datagrid = fastDev.getInstance("datagrid");
	datagrid.refreshData(data);
};
function del() {
	var datagrid = fastDev.getInstance("datagrid");
	var objects = datagrid.getValue();
	var ids = new Array();
	if (!!objects) {
		for ( var i = 0; i < objects.length; i++)
			ids.push(objects[i].id);
	}
	if(ids.length==0){
		fastDev.tips("请至少选择一条记录进行操作");
	}
	else	{		
		remove(ids.join(","));	
	}
}

function remove(idStr) {
	fastDev.confirm("确定删除该条记录？", "确认删除", function(response) {
		if (response) {
			fastDev.create("Proxy", {
				action : "data/del.jsp"
			}).save({
				ids : idStr
			}, function(data) {
				fastDev.alert(data.msg, "信息", "tip", function() {
					var array = idStr.split(",");
					for(var i=0;i<array.length;i++){
						var data = fastDev.getInstance("datagrid");
						data.delRow(array[i]);
					}
				});
			});
		}
	});
}

			
var dialog = null;
function add() {
	dialog=fastDev.create("Dialog",{
		content : getDbaddFormHtml(),
		title : "添加信息",
		width : "400px",
		height:"260px",
		allowResize : false,
		showCollapseBtn : false
	});
}
function edit(id) {
	dialog=fastDev.create("Dialog",{
		content : getDbeditFormHtml(id),
		title : "修改信息",
		width : "400px",
		height:"260px",
		allowResize : false,
		showCollapseBtn : false
	});
}
function operRenderer() {
	var width = $(this).width();
	return [
			'<div style="width:'
					+ width
					+ 'px;"><a href="javascript:void(0);" class="btn" style="margin-left:5px;" id="edit">修改</a>',
			'<a href="javascript:void(0);" class="btn" style="margin-left:5px;" id="delete">删除</a>']
			.join('');
}
function onRowClick(event, rowindex, data) {
	var target = event.target.id;
	if (target) {
		switch (target) {
		case 'edit':
			edit(data.id);			
			break;
		case 'delete':
			remove(data.id);
			break;
		}
	}
}


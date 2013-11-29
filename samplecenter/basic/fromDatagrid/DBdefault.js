var submit = function() {
	var form = fastDev.getInstance("dbjgSearchForm");
	var datagrid = fastDev.getInstance("datagrid");
	datagrid.refreshData(form.getItems());
};
var submitSuccess = function(data) {
	var datagrid = fastDev.getInstance("datagrid");
	datagrid.refreshData(data);
};

function deljigou() {
	var datagrid = fastDev.getInstance("datagrid");
	var objects = datagrid.getValue();
	var ids = new Array();
	if (!!objects) {
		for ( var i = 0; i < objects.length; i++)
			ids.push(objects[i].ouId);
	}
	if(ids.length==0){
		fastDev.tips("请至少选择一条记录进行操作");
	}
	else	{		
		deletejigou(ids.join(","));	
	}
}

function deletejigou(idStr) {
	fastDev.confirm("确定删除该条记录？", "确认删除", function(response) {
		if (response) {
			fastDev.create("Proxy", {
				action : "organization_deleteOrg.action"
			}).save({
				ids : idStr
			}, function(data) {
				fastDev.alert(data.msg, "信息", "tip", function() {
					fastDev.getInstance("datagrid").refreshData(true);
				});
			});
		}
	});
}

			
var dialog = null;
function addjigou() {
  dialog=fastDev.create('Window', {
		src : "addDB.html",
		title : "添加定编机构",
		width :700,
		height:330,
		allowResize : false,
		showMaxBtn : false,
		buttons : [{
			text : '保存',
			iconCls : 'icon-save',
			onclick : function(e,win,cwin, fd) {
				var form=fd.getInstance("addForm");
				form.submit();	
				win.close();
				var datagrid = fastDev.getInstance("datagrid");
				datagrid.refreshData(true);	
			}
		},{
			text : '重置',
			iconCls : 'icon-reset',
			onclick : function(e,win,cwin, fd) {
				var form=fd.getInstance("addForm");
				form.cleanData();
			}
		},{
		text : "关闭",
		iconCls : "icon-close",
		onclick : function(e,win) {
			win.close();
		}
		}]		
	});
}
function editjigou(id) {
  dialog=fastDev.create('Window', {
		src : "editDB.html?id="+id,
		title : "修改定编机构",
		width :700,
		height:330,
		allowResize : false,
		showMaxBtn : false,
		buttons : [{
			text : '保存',
			iconCls : 'icon-save',
			onclick : function(e,win,cwin, fd) {
				var form=fd.getInstance("editForm");
				form.submit();		
				win.close();
				var datagrid = fastDev.getInstance("datagrid");
				datagrid.refreshData(true);	
			}
		},{
			text : '重置',
			iconCls : 'icon-reset',
			onclick : function(e,win,cwin, fd) {
				var form=fd.getInstance("editForm");
				form.resetData();
			}
		},{
		text : "关闭",
		iconCls : "icon-close",
		onclick : function(e,win) {
			win.close();
		}
		}]		
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
			editjigou(data.ouId);			
			break;
		case 'delete':
			deletejigou(data.ouId);
			break;
		}
	}
}

function onAfterConstruct(){
//	this.setDataReqParam({"id":goodsId});
	this.setInitReqParam({"ouType":2});	
}
function treeclick(e,id,val){
	location.href="DBdefault.html?id="+id
}
function treeclick2(e,id,val){
	location.href="notDBdefault.html?id="+id
}
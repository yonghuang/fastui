var submitSuccess=function(data){
	fastDev.alert(data.msg, "信息提示", data.status,function(){
		if(data.status == 'ok') {
			parent.fastDev.getInstance("datagrid").refreshData(true);
			parent.dialog.close();	
		}
	});
};
function submitForm(){
	var form=fastDev.getInstance("addForm");
	form.submit();	
	dialog.close();
	var datagrid = fastDev.getInstance("datagrid");
	datagrid.refreshData(true);	
}
function resetForm(){
	var form=fastDev.getInstance("addForm");
	form.cleanData();
}
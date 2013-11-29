var request = fastDev.Browser.getRequest();//获取请求对象
var id = request['id'] || "";
var onBeforeReady =function(){	
	this.setOptions({dataSource:"data/from_load.jsp?id="+id});
};

var submitSuccess=function(data){
	fastDev.alert(data.msg, "信息提示", data.status,function(){
		if(data.status == 'ok') {
			parent.fastDev.getInstance("datagrid").refreshData(true);
			parent.dialog.close();	
		}
	});
};

//================配置信息=======================
//树的初始化url
var treeInitSource="tree_department_data.txt";

//===============================================
var selectDepartmentData=[];

if(fastDev.Ui.Window.getData("selectDepartmentData")){
	var dataTemp = fastDev.Ui.Window.getData("selectDepartmentData");
	for(var i=0,len=dataTemp.length;i<len;i++){
		selectDepartmentData.push(dataTemp[i]);
	}
}

function onBeforeReady(){
	var that = this;
	that.setOptions({
		initSource:treeInitSource
	});
}

function onNodeClick(e,id){
	var i,flag=true;name = this.getValByid(id);
	var pid = this.getParentid(id);
	for(i=0;i<selectDepartmentData.length;i++){
		if(selectDepartmentData[i]){
			if(selectDepartmentData[i].id==id){
				flag=false;
				selectDepartmentData.splice(i,1);
				var u = fastDev("#content-right-selected").find("div[uid='"+id+"']");
				u.remove(u);
				//获取已选择的总数
				fastDev("#selectedNum").setText(selectDepartmentData.length);
				break;
			}		
		}
	}
	if(flag){
		dynamicSelected(id,name,pid);
		//将选中的用户存入selectDepartmentData
		selectDepartmentData.push({"id":id,"name":name,"pid":pid});
		//获取已选择的总数
		fastDev("#selectedNum").setText(selectDepartmentData.length);
	}
}

//窗口打开后的反选
function onAfterInitRender(){
	var i;
	if(!selectDepartmentData[0]){
		return;
	}
	for(i=0;i<selectDepartmentData.length;i++){
		dynamicSelected(selectDepartmentData[i].id,selectDepartmentData[i].name,selectDepartmentData[i].pid);
		var tree = getCurrentTree();
		tree.setExpand(tree.getParentid(selectDepartmentData[i].id));
		var spanList = tree.find("li[id='"+selectDepartmentData[i].id+"']").find("span[class*='ui-tree-content']").elems[0];
		spanList.className = spanList.className + " ui-tree-selected";
	}
}
//渲染右侧已选用户的列表
function dynamicSelected(id,name,pid){
	var innerHTML;
	var sctObj = fastDev("#content-right-selected").elems[0];
	innerHTML = "<div uid='"+ id +"' pid='"+pid+"'  onclick='removeOne(this)' class='content-right-selected-pos'>"
					+"<div  class='content-right-selected-user'>"
						+"<span class='content-right-selected-user-span'>"+name+"</span>"
					+"</div>"
				+"</div>";
	sctObj.innerHTML = sctObj.innerHTML + innerHTML;
	//获取已选择的总数
	fastDev("#selectedNum").setText(selectDepartmentData.length);
}

//移除一个已选择的用户
function removeOne(obj){
	var id = obj.getAttribute("uid");
	var i,u = fastDev("#content-right-selected").find("div[uid='"+id+"']");
	u.remove(u);
	//遍历selectDepartmentData，将选中的用户删除
	for(i=0;i<selectDepartmentData.length;i++){
		if(selectDepartmentData[i].id===id){
			selectDepartmentData.splice(i,1);
		}
	}
	var tree = getCurrentTree();
	var ss = tree.find("li[id='"+id+"']").find("span[class*='ui-tree-content']").elems[0];
	ss.className = ss.className.replace(/ ui-tree-selected/,"");
	//获取已选择的总数
	fastDev("#selectedNum").setText(selectDepartmentData.length);

}
//全部清空
function removeAll(){
	var sctObj = fastDev("#content-right-selected").elems[0];
	sctObj.innerHTML="";
	selectDepartmentData=[];
	var tree = getCurrentTree();
	var ss = tree.find("span[class*='ui-tree-selected']").elems;
	for(var i=0;i<ss.length;i++){
		if(ss[i]){
			ss[i].className = ss[i].className.replace(/ ui-tree-selected/,"");
		}
	}
	//获取已选择的总数
	fastDev("#selectedNum").setText(selectDepartmentData.length);	
}
function getCurrentTree(){
	var tabsTitle = fastDev.getInstance("tabs").getCurrentTitle();
	var tree;
	if(tabsTitle=="选择部门"){
		tree = fastDev.getInstance("tree1");
	}else if(tabsTitle=="按角色选择"){
		tree = fastDev.getInstance("tree2");
	}
	return tree;
}
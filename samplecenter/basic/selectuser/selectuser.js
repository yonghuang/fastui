//=====================配置信息=========================
/**
 * 说明：
 * url_1是第一个tabs中的请求，url_2是第二个tabs中的请求
 * 如果url附带参数可以直接写在url的后面，也可以搜索相应方法中的post请求，将参数加入data中
 * tree1:树1的initSource;tree2:树1的initSource;nodeUrl:节点请求的action;chkUrl:复选框请求的action;
 * 说明:nodeUrl和chkUrl所请求的数据相同，chkUrl请求的是多个节点的数据.
 * 后台获取pid的数据格式为["2","3"],需要对字符串做处理，课参照list_data.jsp改动
 */
var url_1={"tree1":"tree_department_data.txt",
		"nodeUrl":"list_data.jsp",   //后台接收的参数为pid,数据格式:["2"]
		"chkUrl" : "list_data.jsp",   //后台接收的参数为pid,数据格式:["2","3"]
		"searchUrl" : "list_search_data.jsp"   //后台接收的参数为param
			};
var url_2={"tree2":"tree_role_data.txt",
		"nodeUrl":"list_data.jsp",
		"chkUrl" : "list_data.jsp",
		"searchUrl" : "list_search_data.jsp"
			};
//Ajax请求超时时间
var timeout = 500000;
//树所在的tabs标题，要与配置的一致.默认两个树的id为tree1,tree2.若改动则需要更改getCurrentTree()和onBeforeReady()方法中的判断的树id
var tree1Title="按部门选择";tree2Title="按角色选择";

//默认展示的节点id. (isFirst:是否默认展示第一个子节点;    nodeId:指定默认节点的id)
var defauleNode={"isFirst":true,"nodeId":""};

//过滤搜索框的正则表达式(过滤除英文字母和汉字之外的输入)
var searchReg = /[^(a-zA-Z\u4E00-\u9FA5)]/g;

//======================================================
//=================数据处理(不用配置)===================
//存放已被选择的人员id
var selectList=[];
//存放已选人员的详细信息，和本地的cache(selectData和selectDataList存放的都是人员信息，只是存放规则不同)
var selectData=[],selectDataList=[],cacheData=[];
//获取父页面存储的数据
if(fastDev.Ui.Window.getData("selectDataList")){
	var sl = fastDev.Ui.Window.getData("selectList");
	var length=sl.length;
	for(var i=0;i<length;i++){
		selectList.push(sl[i]);
	}
	var sd = fastDev.Ui.Window.getData("selectDataList");
	length = sd.length;
	var flag=true;
	for(var i=0;i<length;i++){
		flag=true;
		if(sd[i]){
			for(var k=0;k<selectData.length;k++){
				if(selectData[k].pid==sd[i].pid){
					selectData[k].data.push(sd[i]);
					flag=false;
					break;
				}
			}
			if(flag){
				selectData.push({"pid":sd[i].pid,"data":[sd[i]]});
			}
		}
	}
}
//======================================================
//======================功能代码========================
/**
 * 树复选框点击事件
 * @param {Object} event 点击事件event
 * @param {String} pid 被点击复选框节点的id
 */
function checkClick(event,pid){
	var that = this,pidArr = [],arr=[],isArr=[],i,j,flag=true;
	//判断是选中还是取消选中
	var idS = that.isChecked(pid);
	//获取选择节点所有子节点
	arr = that.findNodesByPid(pid);
	//存入子节点的id
	for(i=0;i<arr.length;i++){
		pidArr.push(arr[i].id);
	}
	//存入被点击的节点id
	pidArr.push(pid);
	if(idS){
		//判断选择的节点是否已展示在列表上，若已展示则全选
		var listPid = fastDev("#nodeName").elems[0].getAttribute("pid")||"";
		for(i=0;i<pidArr.length;i++){
			if(pidArr[i]==listPid){
				selectAll();
				pidArr.splice(i,1);
				break;
			}
		}
		//如果listPid为空则表示是在查询状态，根据pid选中查询出来的数据
		if(!listPid){
			for(i=0;i<pidArr[i];i++){
				var list = fastDev("#content-left-list").find("li[pid='"+pidArr[i]+"']").elems;
				for(j=0;j<list[j];j++){
					list[j].className = list[j].className + " list-selected";
				}
			}
		}
		for(i=pidArr.length-1;i>=0;i--){
			flag = true;
			for(j=0;j<cacheData.length;j++){
				if(cacheData[j].pid==pidArr[i]){
					//渲染右侧已选区域
					ckClickDynamicSelected(cacheData[j].data);
					flag=false;
					break;
				}
			}
			if(flag){
				isArr.push(pidArr[i]);
			}
		}
		//发送请求
		if(isArr[0]){
			var url="";
			var tabsTitle = fastDev.getInstance("tabs").getCurrentTitle();
			if(tabsTitle==tree1Title){
				url=url_1.chkUrl;
			}else if(tabsTitle==tree2Title){
				url=url_2.chkUrl;
			}
			fastDev.post(url,{
				data : {
					"pid" : isArr
				},
				timeout : timeout,
				success : function(data){
					ckClickDynamicSelected(data);
					var size = data.length;
					data[data.length-1]?"":size=data.length-1;
					//节点缓存，只向服务器请求1次
					var dPid;
					for(i=0;i<size;i++){
						//flag用作判断pid的数据是否已经被加载进去
						flag=true;
						dPid=data[i].pid;
						//遍历cacheData将传回的数据按格式传给cacheData
						for(j=0,len=cacheData.length;j<len;j++){
							if(cacheData[j].pid==dPid){
								cacheData[j].data.push(data[i]);
								flag=false;
								break;
							}
						}
						if(flag){
							cacheData.push({"pid":dPid,"data":[data[i]]});
						}
					}
				},
				error : function(data){
					return "错误详细信息:"+data;
				}
			});
		}
	}else {
		//清除左侧人员列表中选择的样式
		var listPid = fastDev("#nodeName").elems[0].getAttribute("pid");
		for(i=0,len=pidArr.length;i<len;i++){
			if(pidArr[i]==listPid){
				var list = fastDev("#content-left-list").find("li[class*='list-selected']").elems;
				for(var j=0;j<list.length;j++){
					list[j].className = list[j].className.replace(/ list-selected/,"");
				}
				break;
			}
		}
		ckClickRemove(pidArr);
		var selectNum = getCount();
		var sctObj = fastDev("#content-right-selected").elems[0];
		var showNum = sctObj.children.length||0;
		if(showNum<selectNum&&selectNum!=0){
			var innerHTML=[],id,pid,name,i;
			var count=0,flag=false;
    		for(i=0,len=selectData.length;i<len;i++){
    			for(var j=0,le=selectData[i].data.length;j<le;j++){
    				if(!selectData[i].data[j].isShow){
    					var se = selectData[i].data[j];
    					id = se.id;
    					pid = se.pid;
    					name = se.name;
    					innerHTML += getSelectedInnerHTML(id,pid,name);
    					selectData[i].data[j].isShow=true;
    					count++;
    					if(count>=200){
    						flag=true;
    						break;
    					}
    				}
    			}
    			if(flag){
    				break;
    			}
    		}
    		sctObj.innerHTML = sctObj.innerHTML + innerHTML;
			
		}

	}
}
/**
 * 树复选框渲染方法
 * @param {Object} data 渲染的数据
 */
function ckClickDynamicSelected(data){
	var sctObj = fastDev("#content-right-selected").elems[0];
	var innerHTML="",id,pid,name,size=data.length,i,j;
	data[data.length-1]?"":size=data.length-1;
	var count=sctObj.children.length||0,flag=true;
	for(i=0;i<size;i++){
		//判断是否已经选中，选中则推出循环
		if(data[i]){
			var dataId = data[i].id;
			var isContinue = false;
			for(j=0,jlen=selectList.length;j<jlen;j++){
				if(dataId==selectList[j]){
					isContinue=true;
					break;
				}
			}
			if(isContinue){
				continue;
			}
			id = data[i].id;
			pid = data[i].pid;
			name = data[i].name;
			count++;
			//数据存入selectData
			if(count>200){
				flag=false;
				saveSelectData(id,pid,name,flag);
			}else{
				flag=true;
				saveSelectData(id,pid,name,flag);
				innerHTML += getSelectedInnerHTML(id,pid,name);
			}
		}
	}
	sctObj.innerHTML = sctObj.innerHTML + innerHTML;
	//获取已选择的总数
	getCount();
}
/**
 * 树复选框清除事件
 * @param {Array} pidArr 被清除节点的id数组
 */
function ckClickRemove(pidArr){
	var i,j,sctObjArr,selected=fastDev("#content-right-selected");
	for(i=0,lenn=pidArr.length;i<lenn;i++){
		//一次选择所有pid下的人员，一次删除
		sctObjArr = selected.find("div[pid='"+pidArr[i]+"']");
		sctObjArr.remove(sctObjArr);
		//从selectData中倒叙删除
		for(j=selectData.length-1;j>=0;j--){
			if(selectData[j].pid==pidArr[i]){
				var temp = selectData[j].data;
				for(var k =0,len=temp.length;k<len;k++){
					var id = temp[k].id;
					for(var p=selectList.length;p>=0;p--){
						if(id==selectList[p]){
							selectList.splice(p,1);
							break;
						}
					}
				}
				selectData.splice(j,1);
				break;
			}
		}
	}
}
/**
 * 节点点击事件
 * @param {String} pid 点击节点的id
 */
function onNodeClick(e,pid){
	var pidArr = [],i,flag=true;
	pidArr.push(pid);
	var nodeName = this.getCurrentTxt();
	//搜索cacheData，若有则直接取节点数据
	for(i=0;i<cacheData.length;i++){
		if(cacheData[i].pid==pid){
			//渲染人员列表
			dynamicList(cacheData[i].data);
			//加入列标题
			var nodeTitle = fastDev("#nodeName");
			nodeTitle.setText(nodeName);
			nodeTitle.elems[0].setAttribute("pid",pid);
			flag=false;
			return;
		}
	}
	//cacheData没有数据时，发出请求
	if(flag){
		var url="";
		var tabsTitle = fastDev.getInstance("tabs").getCurrentTitle();
		if(tabsTitle==tree1Title){
			url=url_1.chkUrl;
		}else if(tabsTitle==tree2Title){
			url=url_2.chkUrl;
		}
		fastDev.post(url,{
			data : {
				"pid" : pidArr 
			},
			timeout : timeout,
			success : function(data){
				//渲染列表
				dynamicList(data);
				//加入列标题
				var nodeTitle = fastDev("#nodeName");
				nodeTitle.setText(nodeName);
				nodeTitle.elems[0].setAttribute("pid",pid);
				//节点缓存，只向服务器请求1次
				cacheData.push({"pid":pid,"data":data});
			},
			error : function(data){
				return "错误详细信息:"+data;
			}
		});
	}
}
/**
 * 在人员列表中单击选中的事件
 * @param {Object} obj   被点击列表的对象
 * @param {Boolean} isSearch   是否是搜索状态
 */
function select(e,obj,isSearch){
	var that = obj;
	var cls = that.className;
	var sctObj = fastDev("#content-right-selected").elems[0];
	//增加选中样式
	if(cls.indexOf(" list-selected")===-1){
		//渲染已选择的用户
		dynamicSelected(that,sctObj,isSearch);
	}else{
		that.className = that.className.replace(/ list-selected/,"");
		removeDom(that.getAttribute("uid"));
		//获取已选择的总数
		getCount();
	}
}
/**
 * 全选按钮点击事件
 */
function selectAll(){
	var i,j,k,innerHTML="",seList=[];
	var list = fastDev("#content-left-list").find("li").elems;
	var sctObj = fastDev("#content-right-selected").elems[0];
	//list长度大于1表示此列不为空
	var listPid = fastDev("#nodeName").elems[0].getAttribute("pid")||"";
	//判断是否有pid，没有 则不是搜索状态
	if(listPid!=""){
		if(list.length>1){
			//给未选中的人员加选中样式
			for(i=0,len = list.length;i<len;i++){
				if(list[i].className.indexOf(" list-selected")===-1){
					list[i].className = list[i].className + " list-selected";
				}else{
					seList.push(list[i].getAttribute("uid"));
				}
			}
			//搜索已选数据中的节点数据清除,好在后面统一添加进去
			for(i=0,len=selectData.length;i<len;i++){
				if(selectData[i].pid==listPid){
					selectData.splice(i,1);
					break;
				}
			}
			var count=sctObj.children.length||0,isShow=true;
			for(i=0,len=cacheData.length;i<len;i++){
				if(cacheData[i].pid==listPid){
					selectData.push({"pid":cacheData[i].pid});
					var cData = cacheData[i].data;
					selectData[selectData.length-1].data=[];
					var temp = selectData[selectData.length-1].data;
					for(j=0,jl=cData.length;j<jl;j++){
						temp.push({"id":cData[j].id,"name":cData[j].name,"pid":cData[j].pid});
					}
					
					for(j=0,l=cacheData[i].data.length;j<l;j++){
						var flag = true;
						for(k=0,le=seList.length;k<le;k++){
							if(seList[k]==cData[j].id){flag=false;seList.splice(k,1);break;}
						}
						if(flag&&cData[j]){
							selectList.push(cData[j].id);
							
							count++;
							//数据存入selectData
							if(count>200){
								isShow=false;
							}else{
								isShow=true;
								innerHTML += getSelectedInnerHTML(cData[j].id,cData[j].pid,cData[j].name);
							}
							var tm = selectData[selectData.length-1].data;
							for(var f=0,flen=tm.length;f<flen;f++){
								if(tm[f].id==cData[j].id){
									tm[f].isShow=isShow;
								}
							}
						}
					}
					break;
				}
			}
			sctObj.innerHTML = sctObj.innerHTML + innerHTML;
			var tree = getCurrentTree();
			tree.checkedById(listPid);
			//获取已选择的总数
			getCount();
		}else{
			var listdom = list[0];
			if(!listdom.getAttribute("isNoUser")){
				if(listdom.className.indexOf(" list-selected")===-1){
					dynamicSelected(listdom,sctObj);
					var ttr = getCurrentTree();
					var listPid = fastDev("#nodeName").elems[0].getAttribute("pid")||"";
					if(listPid!=""){
						ttr.checkedById(listPid);
					}
				}
			}
		}
	}else{
		//搜索状态时的全选
		var listTemp = fastDev("#content-left-list").find("li[class='list-1']").elems;
		var id,pid,name;
		var count=sctObj.children.length||0,isShow=true;
		
		for(i=0,len=listTemp.length;i<len;i++){
			if(listTemp[i].className.indexOf("list-selected")==-1){
				var lt = listTemp[i];
				id = lt.getAttribute("uid");
				pid = lt.getAttribute("pid");
				name = lt.getElementsByTagName("span")[1].innerText||listDom.getElementsByTagName("span")[1].innerHTML;
				
				count++;
				if(count>200){
					isShow=false;
					saveSelectData(id,pid,name,isShow);
				}else{
					isShow=true;
					saveSelectData(id,pid,name,isShow);
					innerHTML += getSelectedInnerHTML(id,pid,name);
				}
				
				lt.className = lt.className + " list-selected";
			}
		}
		sctObj.innerHTML = sctObj.innerHTML + innerHTML;
		getCount();
	}
	
}
/**
 * 移除一个已选择的用户
 * @param {Object} obj   被点击的对象
 */
function removeOne(obj){
	var uid = obj.getAttribute("uid");
	var container = fastDev("#content-left-list");
	var list = container.find("li[uid='"+uid+"']").elems[0];
	//点击左侧树切换列表后，会查不到原先的用户，做一个判断
	list?list.className = list.className.replace(/ list-selected/,""):"";
	removeDom(uid);
	var selectNum = getCount();
	var sctObj = fastDev("#content-right-selected").elems[0];
	var showNum = sctObj.children.length||0;
	if(showNum<selectNum&&selectNum!=0){
		var innerHTML=[],id,pid,name,i;
		var count=0,flag=false;
		for(i=0,len=selectData.length;i<len;i++){
			for(var j=0,le=selectData[i].data.length;j<le;j++){
				if(!selectData[i].data[j].isShow){
					var se = selectData[i].data[j];
					id = se.id;
					pid = se.pid;
					name = se.name;
					innerHTML += getSelectedInnerHTML(id,pid,name);
					selectData[i].data[j].isShow=true;
					count++;
					if(count>=200){
						flag=true;
						break;
					}
				}
			}
			if(flag){
				break;
			}
		}
		sctObj.innerHTML = sctObj.innerHTML + innerHTML;
		
	}
}
/**
 * 移除用户的执行方法
 * @param {String} uid   被移除的元素id
 */
function removeDom(uid){
	var pid,u = fastDev("#content-right-selected").find("div[uid='"+uid+"']");
	pid = u.elems[0].getAttribute("pid");
	//删除节点的选中状态
	var tree = getCurrentTree();
	tree.unCheckedById(pid);
	
	u.remove(u);
	removeSelectData(uid,pid);
}
/**
 * 删除已选择的人员
 * @param {String} uid   被移除的元素id
 */
function removeSelectData(id,pid){
	var j,k,length=selectData.length,listLength=selectList.length;
	for(j=0;j<length;j++){
		if(selectData[j].pid==pid){
			var flag=true;
			var len = selectData[j].data.length;
			for(k=0;k<len;k++){
				if(selectData[j].data[k].id==id){
					selectData[j].data.splice(k,1);
					flag = true;
					break;
				}
			}
			if(flag){
				break;}
		}
	}
	//删除已选人员
	for(j=0;j<listLength;j++){
		if(selectList[j]==id){
			selectList.splice(j,1);
		}
	}
}
//
/**
 * 渲染人员列表
 */
function dynamicList(data){
	var listHTML="",i,j,size = data.length,flag = false;
	var listObj = fastDev("#content-left-list").elems[0];
	data[data.length-1]?"":size--;
	if(data[0]){
		for(i=0;i<size;i++){
			//搜索已选人员，如果已经存在则显示已选中状态
			var id = data[i].id;
			for(j=0;j<selectList.length;j++){
				if(id==selectList[j]){
					flag=true;
					break;
				}
			}
			listHTML+=getListInnerHTML(data[i], flag);
			flag = false;
		}
	}else {
		listHTML="<li isNoUser='noUser' class='list-3'>无用户</li>";
	}
	listObj.innerHTML = listHTML;
}
/**
 * 渲染已选择的用户
 * @param {String} uid   被移除的元素id
 */
function dynamicSelected(listDom,sctObj,isSearch){
	var innerHTML="",uid,pid,name;
	uid = listDom.getAttribute("uid");
	for(var i = 0,len=selectList.length;i<len;i++){
		if(uid==selectList[i]){
			listDom.className = listDom.className + " list-selected";
			return;
		}
	}
	
	pid = listDom.getAttribute("pid");
	if(isSearch){
		name = listDom.getElementsByTagName("span")[1].innerText||listDom.getElementsByTagName("span")[1].innerHTML;
	}else{
		name = listDom.getElementsByTagName("span")[0].innerText||listDom.getElementsByTagName("span")[0].innerHTML;
	}
	listDom.className = listDom.className + " list-selected";

	
	//存储已选择的人员
	//默认直接渲染到页面上
	saveSelectData(uid,pid,name,true);
	//获得渲染的Html
	innerHTML += getSelectedInnerHTML(uid,pid,name);
	sctObj.innerHTML = innerHTML + sctObj.innerHTML;
	//获取已选择的总数
	getCount();
}
/**
 * 存储已选择的人员
 * @param {String} id   插入人员的id
 * @param {String} pid   插入人员的pid
 * @param {String} name   插入人员的name
 */
function saveSelectData(id,pid,name,isShow){
	var i,length=selectData.length,flag=true;
	if(selectData[0]){
		for(i=0;i<length;i++){
			if(selectData[i].pid==pid){
				selectData[i].data.push({"id":id,"name":name,"pid":pid,"isShow":isShow});
				flag=false;
				break;
			}
		}
	}
	if(flag){
		selectData.push({"pid":pid,"data":[{"id":id,"name":name,"pid":pid,"isShow":isShow}]});
	}
	selectList.push(id);
}
/**
 * 获取生成的已选人员html
 * @param {String} id   插入人员的id
 * @param {String} pid   插入人员的pid
 * @param {String} name   插入人员的name
 */
function getSelectedInnerHTML(id,pid,name){
	var innerHTML="";
	innerHTML = "<div uid='"+ id +"' pid='"+pid+"'  onclick='removeOne(this)' class='content-right-selected-pos'>"
		+"<div  class='content-right-selected-user'>"
				+"<span class='content-right-selected-user-span'>"+name+"</span>"
			+"</div>"
		+"</div>";
	return innerHTML;
}
/**
 * 获取生成的人员列表的html
 * @param {Object} data  人员数据
 * @param {Boolean}  flag  是否是选中状态
 */
function getListInnerHTML(data,flag){
	var listHTML="";
	if(flag){
		listHTML=listHTML+"<li uid='"+data.id+"' pid='"+data.pid+"' title='"+data.name+"' class='list-1 list-selected' onclick='select(event,this)'><div  class='list_div'><span>"+data.name+"</span></div></li>";
	}else {
		listHTML=listHTML+"<li uid='"+data.id+"' pid='"+data.pid+"' title='"+data.name+"' class='list-1' onclick='select(event,this)'><div  class='list_div'><span>"+data.name+"</span></div></li>";
	}
	return listHTML;
}
/**
 * 全部清空
 */
function removeAll(){
	var container = fastDev("#content-left-list");
	var list = container.find("li[class*='list-selected']").elems;
	var i,length=list.length;
	//清空左侧被选中的用户
	for(i=0;i<length;i++){
		list[i].className = list[i].className.replace(/ list-selected/,"");
	}
	var sctObj = fastDev("#content-right-selected").elems[0];
	sctObj.innerHTML="";
	selectData=[];
	selectList=[];
	var tree = getCurrentTree();
	tree.clearCheck();
	//获取已选择的总数
	getCount();
}
/**
 * 获取当前树
 */
function getCurrentTree(){
	var tabsTitle = fastDev.getInstance("tabs").getCurrentTitle();
	var tree;
	if(tabsTitle==tree1Title){
		tree = fastDev.getInstance("tree1");
	}else if(tabsTitle==tree2Title){
		tree = fastDev.getInstance("tree2");
	}
	return tree;
}
/**
 * 获取已选择的人员数并渲染到页面上
 */
function getCount(){
	var count=0;
	count = selectList.length;
	fastDev("#selectedNum").setText(count);
	return count;
}
/**
 * 窗口默认显示的用户列表(uid需要指定一个树节点的有效值，tree1是左侧树的id)
 */
function onAfterInitRender(){
	var pidArr = [];
	if(defauleNode.isFirst){
		var ss = fastDev.getInstance("tree1").getAllLeafItems();
		pidArr.push(ss[0].id);
	}else{
		pidArr.push(defauleNode.nodeId);
	}
	fastDev.post(url_1.nodeUrl,{
		data : {
			"pid" : pidArr
		},
		timeout : timeout,
		success : function(data){
			
			//渲染列表
			dynamicList(data);
			//渲染右侧已选人员列表
			backDynamicSelected();
			var nodeTitle = fastDev("#nodeName");
			//加入列标题
			nodeTitle.setText(fastDev.getInstance("tree1").getNodeByid(pidArr[0]).text);
			nodeTitle.elems[0].setAttribute("pid",pidArr[0]);
			cacheData.push({"pid":pidArr[0],"data":data});
		},
		error : function(data){
			return "错误详细信息:"+data;
		}
	});
}
/**
 * 窗口初始化反选时，渲染右侧已选用户的列表
 */
function backDynamicSelected(){
	var sctObj = fastDev("#content-right-selected").elems[0];
	var innerHTML=[],id,pid,name,i;
	var count=0,flag=false;
	for(i=0,len=selectData.length;i<len;i++){
		for(var j=0,le=selectData[i].data.length;j<le;j++){
			var se = selectData[i].data[j];
			
				id = se.id;
				pid = se.pid;
				name = se.name;
				innerHTML += getSelectedInnerHTML(id,pid,name);
				
				selectData[i].data[j].isShow=true;
				count++;
				if(count>=200){
					flag=true;
					break;
				}
		}
		if(flag){
			break;
		}
	}
	sctObj.innerHTML = sctObj.innerHTML + innerHTML;
	//获取已选择的总数
	getCount();
}
/**
 * 树初始化前添加initSource(id需与页面所配置的树id一致)
 */
function onBeforeReady(){
	var that = this;
	if(that._options.id=="tree1"){
		that.setOptions({
			initSource:url_1.tree1
		});
	}else if(that._options.id=="tree2"){
		that.setOptions({
			initSource:url_2.tree2
		});
	}
}
/**
 * 查询事件
 */
function searchontext(e){
	currKey=e.keyCode||e.which||e.charCode;
//	keyName = String.fromCharCode(currKey);
	if(currKey && currKey != 13){
		return;
	}else{
		searchli();
	}
}
//查询事件
function searchli(){
	var p = document.getElementById("searchBox").value;
	if(!p){
		return;
	}
	var param = p.replace(searchReg,"");
	//var param = p.replace(/[^(a-zA-Z\u4E00-\u9FA5)]/g,"");
	var url="";
	var tabsTitle = fastDev.getInstance("tabs").getCurrentTitle();
	if(tabsTitle==tree1Title){
		url=url_1.searchUrl;
	}else if(tabsTitle==tree2Title){
		url=url_2.searchUrl;
	}
	if(param==""){
		return;
	}
	fastDev.post(url,{
		data : {
			"param" : param
		},
		timeout : timeout,
		success : function(data){
			//渲染列表
			resultDynamicList(data,param);
			//加入列标题
			fastDev("#nodeName").setText("搜索结果");
			fastDev("#nodeName").elems[0].setAttribute("pid","");
		},
		error : function(data){
			return "错误详细信息:"+data;
		}
	});
}
/**
 * 搜索结果列表渲染
 * @param {Object} data   渲染的数据
 * @param {RegExp} param  搜索框正则表达式
 */
function resultDynamicList(data,param){
	var listHTML="",i,j,k,size = data.length,flag = false,reg,lightName,department="",lBracket,rBracket;
	var container = fastDev("#content-left").find("#content-left-list");
	var listObj = container.elems[0];
	data[data.length-1]?"":size=data.length-1;
	if(data.toString()){
		for(i=0;i<size;i++){
			id = data[i].id;
			for(j=0;j<selectData.length;j++){
				if(selectData[j].pid==data[i].pid){
					for(k=0;k<selectData[j].data.length;k++){
						if(selectData[j].data[k].id==id){
							flag = true;
							break;
						}
					}
					if(flag){break;}
				}
			}
			//是否有部门
			if(data[i].department){
				department=data[i].department;
				lBracket = "[";
				rBracket = "]";
			}else{
				department = "";
				lBracket = "";
				rBracket = "";
			}
			//添加高亮样式
			reg = new RegExp(param,"g");
			lightName = data[i].name.replace(reg,"<font style='background:#FF0' color='#FF0000'>"+param+"</font>");
			if(flag){
				listHTML=listHTML+"<li uid='"+data[i].id+"' pid='"+data[i].pid+"' title='"+data[i].name+"' class='list-1 list-selected' onclick='select(event,this,true)'><div  class='list_div'>"+ lBracket +"<span class='department'>"+department+"</span>"+ rBracket +"<span>"+lightName+"</span></div></li>";
				flag = false;
			}else {
				listHTML=listHTML+"<li uid='"+data[i].id+"' pid='"+data[i].pid+"' title='"+data[i].name+"' class='list-1' onclick='select(event,this,true)'><div  class='list_div'>"+ lBracket +"<span class='department'>"+department+"</span>"+ rBracket +"<span>"+lightName+"</span></div></li>";
			}
		}
	}else {
		listHTML="<li isNoUser='noUser' class='list-3'>没有搜索到用户</li>";
	}
	listObj.innerHTML = listHTML;
	
	for(i=0;i<size;i++){
		if(container.find("li[uid='"+ data[i].id +"']").elems.length>1){
			var sss = fastDev("#content-left-list").elems[0];
			var de = container.find("li[uid='"+ data[i].id +"']").find(".department'");
			var str = "";
			for(j=0;j<de.elems.length;j++){
				str = str + de.elems[j].innerHTML+",";
			}
			str = str.slice(0,str.length-1);
			de.elems[0].innerHTML = str;
			for(j=1;j<de.elems.length;j++){
				var liEle = de.elems[j].parentElement.parentElement;
				var liEleId = liEle.getAttribute("uid");
				for(k=0,len=selectList.length;k<len;k++){
					if(selectList[k]==liEleId){
						de.elems[0].parentElement.parentElement.className="list-1 list-selected";
					}
				}
				sss.removeChild(de.elems[j].parentElement.parentElement);
			}
		}
	}
}
/**
 * 隐藏左侧人员列表
 */
function hideList(e){
	fastDev("#content-left").hide();
	var t = this;
	this.setText("显示人员列表");
	t.setOptions({
		onclick : showList
	});
	fastDev("#content-right").css("width","100%");
}
/**
 * 显示左侧人员列表
 */
function showList(e){
	fastDev("#content-left").show();
	var t = this;
	this.setText("隐藏人员列表");
	t.setOptions({
		onclick : hideList
	});
	fastDev("#content-right").css("width","63%");
}
fastDev.ready(function(){
	var ele = document.getElementById("content-right-selected");
	
	ele.onscroll = function(){
			var nScrollTop = this.scrollTop;
        	var nScrollHight = this.scrollHeight;
        	var difference = nScrollHight-nScrollTop-this.offsetHeight;
        	var eleNumber=fastDev("#content-right-selected").elems[0].children.length;
        	var sctObj = fastDev("#content-right-selected").elems[0];
        	if(eleNumber>=200&&difference<200){
        		
        		var innerHTML=[],id,pid,name,i;
        		var count=0,flag=false;
        		for(i=0,len=selectData.length;i<len;i++){
        			for(var j=0,le=selectData[i].data.length;j<le;j++){
        				if(!selectData[i].data[j].isShow){
        					var se = selectData[i].data[j];
        					id = se.id;
        					pid = se.pid;
        					name = se.name;
        					innerHTML += getSelectedInnerHTML(id,pid,name);
        					selectData[i].data[j].isShow=true;
        					count++;
        					if(count>=200){
        						flag=true;
        						break;
        					}
        				}
        			}
        			if(flag){
        				break;
        			}
        		}
        		sctObj.innerHTML = sctObj.innerHTML + innerHTML;
        		
        	}
		};
	}
);
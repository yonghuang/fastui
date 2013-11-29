<%@page language="java" import="java.io.PrintWriter" import="java.util.*" import="java.lang.*"
	pageEncoding="utf-8"%>
<%
	String test = request.getParameter("page");
	String pageSize = request.getParameter("pageSize");
	
	String endDate = request.getParameter("endDate");
	String name = request.getParameter("name");
	String orgid = request.getParameter("orgid");
	if(orgid!=null){
		if(orgid.equals("1")){
	   		orgid = "研发部";
		}else if(orgid.equals("2")){
	    	orgid = "销售部";
		}
	}
	
	String startDate = request.getParameter("startDate");
	String type = request.getParameter("type");
	if(type!=null){
		if(type.equals("0")){
		    type = "奖";
		}else if(type.equals("1")){
		    type = "惩";
		}
	}

	String[] dataList = new String[12];
	dataList[0] = "{\"id\": \"1\",\"name\": \"张三\",\"orgname\": \"销售部\",\"type\": \"奖\",\"date\": \"2013-05-05\",\"remark\": \"无\"},";
	dataList[1] = "{\"id\": \"2\",\"name\": \"李四\",\"orgname\": \"研发部\",\"type\": \"惩\",\"date\": \"2013-04-22\",\"remark\": \"备注\"},";
	dataList[2] = "{\"id\": \"3\",\"name\": \"袁维\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-04-21\",\"remark\": \"无\"},";
	dataList[3] = "{\"id\": \"4\",\"name\": \"张琦\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-04-21\",\"remark\": \"无\"},";
	dataList[4] = "{\"id\": \"5\",\"name\": \"徐承\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-03-27\",\"remark\": \"无\"},";
	dataList[5] = "{\"id\": \"6\",\"name\": \"张鹏楠\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-03-11\",\"remark\": \"备注\"},";
	dataList[6] = "{\"id\": \"7\",\"name\": \"唐岳\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-03-02\",\"remark\": \"无\"},";
	dataList[7] = "{\"id\": \"8\",\"name\": \"张琦\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-02-14\",\"remark\": \"备注\"},";
	dataList[8] = "{\"id\": \"9\",\"name\": \"袁维\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2013-01-10\",\"remark\": \"无\"},";
	dataList[9] = "{\"id\": \"10\",\"name\": \"张鹏楠\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2012-11-25\",\"remark\": \"备注\"},";
	dataList[10] = "{\"id\": \"11\",\"name\": \"张鹏楠\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2012-11-11\",\"remark\": \"备注\"},";
	dataList[11] = "{\"id\": \"12\",\"name\": \"袁维\",\"orgname\": \"研发部\",\"type\": \"奖\",\"date\": \"2012-11-04\",\"remark\": \"无\"}";
	int[] flag = new int[12];
	for(int i=0;i<12;i++){   flag[i]=-2;}
	for(int i = 0;i<12;i++){
	    if(name==null||name==""){
	        if(flag[i]==0){
	            
	        }else{
	            flag[i] = 1;
	        }
	    }else {
	        if(dataList[i].indexOf(name)!=-1){
	            flag[i] = 1;
	        }else{
	            flag[i] = 0;
	            continue;
	        }
	    }
	    
	    if(orgid==null||orgid==""){
	        
	    }else {
	        if(flag[i]==1){
	            if(dataList[i].indexOf(orgid)==-1){
		            flag[i] = 0;
		            continue;
	            }
	        }
	    }
	    
		if(type==null||type==""){
	        
	    }else {
	        if(flag[i]==1){
	            if(dataList[i].indexOf(type)==-1){
		            flag[i] = 0;
		            continue;
	            }
	        }
	    }
		
		if(startDate==null||startDate==""){
	        
	    }else {
	        if(flag[i]==1){
	            String str = dataList[i].substring(dataList[i].indexOf("20"),dataList[i].indexOf("20")+10);
	            int result=str.compareTo(startDate);
	            if(result<0){
		            flag[i] = 0;
		            continue;
	            }
	        }
	    }
	    
		if(endDate==null||endDate==""){
	        
	    }else {
	        if(flag[i]==1){
	            String str = dataList[i].substring(dataList[i].indexOf("20"),dataList[i].indexOf("20")+10);
	            int result=str.compareTo(endDate);
	            if(result>0){
		            flag[i] = 0;
		            continue;
	            }
	        }
	    }
	    
	}
	
	pageSize = "10";
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	int count = 0;
	for(int i = 0;i<12;i++){
	    if(flag[i]==1){
	        count++;
	    }
	}
	if(count<=10){
	    if(test.equals("1")){
			if(pageSize.equals("10")){
			    data.append("[");
				for(int i=0;i<12;i++){
				    if(flag[i]==1){
				        data.append(dataList[i]);
				    }
				}
				data.append("]");
				info = "{\"pageSize\": 10,\"records\": 15,\"page\": 1,\"total\": 1}";
			}
		}
	}else{
	    if(test.equals("1")){
			if(pageSize.equals("10")){
			    data.append("[");
			    int pageCount = 0;
				for(int i=0;i<12;i++){
				    if(flag[i]==1){
				        data.append(dataList[i]);
					    pageCount++;
					    if(pageCount==10){
					        break;
					    }
				    }
				}
				data.append("]");
				info = "{\"pageSize\": 10,\"records\": 15,\"page\": 1,\"total\": 2}";
			}
		}else if(test.equals("2")){
			if(pageSize.equals("10")){
			    data.append("[");
			    int pageCount = 0;
			    for(int i=0;i<12;i++){
			        if(flag[i]==1){
			            pageCount++;
			        }
			        if(pageCount>=11){
			            data.append(dataList[i]);
			        }
			    }
			    data.append("]");
				info = "{\"pageSize\": 10,\"records\": 15,\"page\": 2,\"total\": 2}";
			}
		}
	}
	
	
	result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");

	PrintWriter pw = response.getWriter();
	
	
	
	pw.print(result.toString());
%>


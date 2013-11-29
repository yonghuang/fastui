<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	
	String orgid = request.getParameter("orgid");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if(orgid.equals("15")){
		
			data.append("[{\"empno\": \"2212\",\"name\": \"袁某\",\"department\": \"技术一组\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张旭\",\"department\": \"技术一组\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张小\",\"department\": \"技术一组\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐想\",\"department\": \"技术一组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐信用\",\"department\": \"技术一组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"许多\",\"department\": \"技术一组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"胡多多\",\"department\": \"技术一组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"许乐乐\",\"department\": \"技术一组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"苏晴晴\",\"department\": \"技术一组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"小汪汪\",\"department\": \"技术一组\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			info = "{\"pageSize\": 10,\"records\": 10,\"page\": 1,\"total\": 1}";
		
		
	}else if(orgid.equals("16")){
		
			data.append("[{\"empno\": \"1712\",\"name\": \"王航\",\"department\": \"技术二组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"田忌\",\"department\": \"技术二组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"张无忌\",\"department\": \"技术二组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"张晓楠\",\"department\": \"技术二组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐小妮\",\"department\": \"技术二组\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			info = "{\"pageSize\": 5,\"records\": 5,\"page\": 1,\"total\": 1}";
		}
	else  if(orgid.equals("17")){
			data.append("[{\"empno\": \"2212\",\"name\": \"王妃\",\"department\": \"技术三组\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"陈奕迅\",\"department\": \"技术三组\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"0143\",\"name\": \"后陪衬\",\"department\": \"技术三组\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true},");
			data.append("{\"empno\": \"1712\",\"name\": \"周杰伦\",\"department\": \"技术三组\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true},");
			data.append("{\"empno\": \"0743\",\"name\": \"辣妹子\",\"department\": \"技术三组\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true}]");
			info = "{\"pageSize\": 5,\"records\": 5,\"page\": 1,\"total\": 1}";
		}
		else  if(orgid.equals("2")){
			data.append("[{\"empno\": \"2212\",\"name\": \"郑小妮\",\"department\": \"技术部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"田心\",\"department\": \"技术部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true}]");
			
			info = "{\"pageSize\": 5,\"records\": 2,\"page\": 1,\"total\": 1}";
		}
		else  if(orgid.equals("3")){
			data.append("[{\"empno\": \"2212\",\"name\": \"王庆听\",\"department\": \"销售部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"王某某\",\"department\": \"销售部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"0143\",\"name\": \"王嘻嘻\",\"department\": \"销售部门\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true}]");
			
			info = "{\"pageSize\": 5,\"records\": 3,\"page\": 1,\"total\": 1}";
		}
		else  if(orgid.equals("4")){
			data.append("[{\"empno\": \"2212\",\"name\": \"许心悦\",\"department\": \"财务部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"许小小\",\"department\": \"财务部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true}]");
			
			info = "{\"pageSize\": 5,\"records\": 2,\"page\": 1,\"total\": 1}";
		}
		else  if(orgid.equals("5")){
			data.append("[{\"empno\": \"2212\",\"name\": \"苏琪\",\"department\": \"人资部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"素心\",\"department\": \"人资部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true}]");
			
			info = "{\"pageSize\": 5,\"records\": 2,\"page\": 1,\"total\": 1}";
		}
		else  if(orgid.equals("6")){
			data.append("[{\"empno\": \"2212\",\"name\": \"刘诗诗\",\"department\": \"行政部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"杨幂\",\"department\": \"行政部门\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true}]");
			
			info = "{\"pageSize\": 5,\"records\": 2,\"page\": 1,\"total\": 1}";
		}else  if(orgid.equals("1"))
		{
			data.append("[{\"empno\": \"2212\",\"name\": \"成就\",\"department\": \"公司\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"龚慧\",\"department\": \"公司\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true}]");
			
			info = "{\"pageSize\": 5,\"records\": 2,\"page\": 1,\"total\": 1}";
		}
		
	result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


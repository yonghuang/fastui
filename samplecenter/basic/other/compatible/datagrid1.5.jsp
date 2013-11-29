<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String requestRows = request.getParameter("page");
	String pageSize = request.getParameter("pageSize");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if(requestRows.equals("1")){
		if(pageSize.equals("10")){
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1713\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1714\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1715\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1716\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1717\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			info = "{\"pageSize\": 10,\"records\": 15,\"page\": 1,\"total\": 2}";
		}else{
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1713\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"}]");
			info = "{\"pageSize\": 5,\"records\": 15,\"page\": 1,\"total\": 3}";
		}
	}else if(requestRows.equals("2")){
		if(pageSize.equals("10")){
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维2\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦2\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠2\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true},");
			data.append("{\"empno\": \"1718\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳2\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true}]");
			info = "{\"pageSize\": 10,\"records\": 15,\"page\": 2,\"total\": 2}";
		}else{
			data.append("[{\"empno\": \"1714\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1715\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1716\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1717\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			info = "{\"pageSize\": 5,\"records\": 15,\"page\": 2,\"total\": 3}";
		}
	}else if(requestRows.equals("3")){
		if(pageSize.equals("5")){
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维2\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦2\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠2\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true},");
			data.append("{\"empno\": \"1718\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳2\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true}]");
			info = "{\"pageSize\": 5,\"records\": 15,\"page\": 3,\"total\": 3}";
		}
	}
	result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


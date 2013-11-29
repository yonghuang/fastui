<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String test = request.getParameter("page");
	String pageSize = request.getParameter("pageSize");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if(test.equals("1")){
		if(pageSize.equals("10")){
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"平台研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 1}";
		}
	}
	result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>
<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	data.append("[");
	StringBuilder formdata = new StringBuilder();
	formdata.append("{");	
	formdata.append("test5:{data:[{value:\"\",text:\"请选择\"},{value:\"test5_1\",text:\"test5_1\"},{value:\"test5_2\",text:\"test5_2\"}]}");
	formdata.append("}");
	data.append("{");
	data.append("cacheID:\"" + cacheID +  "\",");
	data.append("cacheData:" + formdata.toString());
	data.append("}");
	data.append("]");
	PrintWriter pw = response.getWriter();

	pw.print(data.toString());
%>


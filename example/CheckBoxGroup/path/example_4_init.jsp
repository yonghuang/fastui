<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	data.append("[");
	StringBuilder formdata = new StringBuilder();
	formdata.append("{");	
	formdata.append("test:{data:[{value:\"test12\",text:\"旅游\"},{value:\"test22\",text:\"唱歌\"}]}");
	//formdata.append("radiogroup:{data:[{value:\"test1\",text:\"测试1\"},{value:\"test2\",text:\"测试2\"},{value:\"test3\",text:\"测试3\"},{value:\"test4\",text:\"测试4\"}]},");
	//formdata.append("checjboxgroup:{data:[{value:\"test1\",text:\"测试1测试11测试1\"},{value:\"test2\",text:\"测试2\"}]},");
	formdata.append("}");
	data.append("{");
	data.append("cacheID:\"" + cacheID +  "\",");
	data.append("cacheData:" + formdata.toString());
	data.append("}");
	data.append("]");
	PrintWriter pw = response.getWriter();

	pw.print(data.toString());
%>


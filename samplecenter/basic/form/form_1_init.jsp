<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder formdata = new StringBuilder();
	formdata.append("{");	
	formdata.append("radio1:[{value:\"man\",text:\"男\"},{value:\"woman\",text:\"女\"}],");
	formdata.append("check1:[{value:\"test1\",text:\"测试1\"},{value:\"test3\",text:\"测试3\"}],");
	formdata.append("select1:[{value:\"test1\",text:\"测试1\"},{value:\"test2\",text:\"测试2\"}],");
	formdata.append("selecttree1:[{\"id\":\"1\",\"pid\":\"0\",\"val\":\"教育部\"},{\"id\":\"2\",\"pid\":\"1\",\"val\":\"云南大学\"}]");
	formdata.append("}");	
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	data.append("[{value:\"test1\",text:\"测试11\"},{value:\"test2\",text:\"测试22\"}]");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID +  "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	out.print(result.toString());
%>


<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	data.append("[{value:\"man\",text:\"男\"},{value:\"woman\",text:\"女\"}]");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID +  "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	out.print(result.toString());
%>


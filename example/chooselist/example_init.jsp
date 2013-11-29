<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	data.append("[{value:\"test1\",text:\"test1\"},{value:\"test2\",text:\"test2\"},");
	data.append("{value:\"test3\",text:\"test3\"},{value:\"test4\",text:\"test4\"}]");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID + "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


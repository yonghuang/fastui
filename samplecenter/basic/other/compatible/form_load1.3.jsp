<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder formdata = new StringBuilder();
	formdata.append("{aaa:\"aaa1\",bbb:\"bbb1\",test2:\"test2\",test3:\"test3_2\",test4:\"test4_1\",test522:\"1\",test6:\"eee\",test13:\"2009-10-10\"}");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID + "\",");
	result.append("cacheData:" + formdata.toString());
	result.append("}");
	result.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


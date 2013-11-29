<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder formdata = new StringBuilder();
	formdata.append("{}");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID + "\",");
	result.append("cacheData:" + formdata.toString());
	result.append("}");
	result.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


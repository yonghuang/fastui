<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder formdata = new StringBuilder();
	formdata.append("{\"editor1\":\"表单给的值\"}");	
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


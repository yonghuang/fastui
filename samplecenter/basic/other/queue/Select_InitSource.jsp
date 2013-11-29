<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	StringBuilder data = new StringBuilder();
	Thread.currentThread().sleep(1000);
	data.append("[{\"text\": \"汉族\",\"value\": \"01\"},");
	data.append("{\"text\": \"土家族\",\"value\": \"02\"},");
	data.append("{\"text\": \"苗族\",\"value\": \"03\"},");
	data.append("{\"text\": \"羌族\",\"value\": \"04\"}]");
	PrintWriter pw = response.getWriter();
	pw.print(data.toString());
%>


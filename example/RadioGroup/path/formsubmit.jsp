<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String data = request.getParameter("testDemo");
	System.out.println(data);
	PrintWriter pw = response.getWriter();
	pw.print("{msg:\"ok\"}");
%>


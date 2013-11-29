<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String data = request.getParameter("data");
	
	PrintWriter pw = response.getWriter();
	pw.print("{msg:"+data+"}");
%>


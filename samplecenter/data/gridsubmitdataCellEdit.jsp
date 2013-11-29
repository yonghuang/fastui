<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String data = request.getParameter("data");
	StringBuilder result = new StringBuilder();
	System.out.println(data);
	PrintWriter pw = response.getWriter();
	pw.print(data);
%>


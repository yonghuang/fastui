<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
	
<%
	String test = request.getParameter("id");
	String result = "Hello world 我是"+id;
	PrintWriter pw = response.getWriter();
	pw.print(result);
%>
<%=result%>

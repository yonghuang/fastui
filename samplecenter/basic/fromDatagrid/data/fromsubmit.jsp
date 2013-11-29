<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	PrintWriter pw = response.getWriter();	
	String data = request.getParameter("data");	
	pw.print("{msg:'提交"+data+"成功'}");
%>


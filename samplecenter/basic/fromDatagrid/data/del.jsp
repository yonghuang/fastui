<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	PrintWriter pw = response.getWriter();	
	String data = request.getParameter("ids");	
	pw.print("{msg:'删除"+data+"成功'}");
%>


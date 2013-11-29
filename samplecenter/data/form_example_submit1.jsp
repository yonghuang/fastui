<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String txt1 = request.getParameter("txt1.aa");
	String pwd1 = request.getParameter("pwd1.cc");
	String area1 = request.getParameter("area1");
	PrintWriter pw = response.getWriter();
	pw.print("{txt1:'"+txt1+"',pwd1:'"+pwd1+"',area1:'"+area1+"'}");
%>


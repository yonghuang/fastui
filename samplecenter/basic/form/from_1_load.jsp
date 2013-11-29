<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder formdata = new StringBuilder();
	formdata.append("{txt1:\"text1\",pwd1:\"text2\",area1:\"aaa\",autotxt1:\"woman\",autotxt11:\"test2\",");
	formdata.append("select1:\"test1\",radio1:\"1\",selecttree:\"1\",");
	formdata.append("check1:\"test1\",data1:\"2012-02-24\"}");	
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


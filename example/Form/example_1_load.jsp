<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	StringBuilder formdata = new StringBuilder();
	formdata.append("{txt1:\"text1\",pwd1:\"password1\",area1:\"textarea1\",radio1:\"woman1\",check1:\"test2\",autotxt1:\"sss\", autotxt11:\"aaa\",select1:\"test1\",selecttree1:\"1111\",data1:\"2008-08-08\"}");	
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


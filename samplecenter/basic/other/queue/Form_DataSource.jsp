<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	
	String s1=request.getParameter("flowinfo");
	
	StringBuilder formdata = new StringBuilder();
	formdata.append("{name:\"张三\",address:\"湖南省长沙市\",nation:\"01\",hobby:[1,2,3],remark:\"这家伙很懒，什么都没有留下！\"}");	
	PrintWriter pw = response.getWriter();
	System.out.print("s1="+s1);
	pw.print(formdata.toString());
%>


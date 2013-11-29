<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	StringBuilder data = new StringBuilder();
	String s1=request.getParameter("value");	

	if(s1.equals("admin")){
		data.append("抱歉，这个用户名已经被占用了！");
	}

	PrintWriter pw = response.getWriter();
	pw.print(data.toString());
	
%>

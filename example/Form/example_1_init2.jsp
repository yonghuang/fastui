<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder formdata = new StringBuilder();	
	formdata.append("[{\"id\":\"select1\",\"data\":[{\"value\":\"test1\",\"text\":\"测试111\"},{\"value\":\"test2\",\"text\":\"测试211\"}]}]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String data = "[{\"id\":\"1\",\"pid\":\"0\",\"val\":\"信息系统部\",\"asyn\":\"true\"},{\"id\":\"2\",\"pid\":\"0\",\"val\":\"业务支撑中心\",\"asyn\":\"true\"},{\"id\":\"3\",\"pid\":\"0\",\"val\":\"产品中心\",\"asyn\":\"true\"},{\"id\":\"103\",\"pid\":\"0\",\"val\":\"总裁办公室\",\"asyn\":\"true\"},{\"id\":\"113\",\"pid\":\"103\",\"val\":\"总裁\"}]";
	PrintWriter pw = response.getWriter();
	pw.print(data);
%>

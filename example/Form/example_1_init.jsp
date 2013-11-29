<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder formdata = new StringBuilder();
	formdata.append("[{id:\"radio1\",data:[{value:\"man1\",text:\"男1\"},{value:\"woman1\",text:\"女1\"}]},");
	formdata.append("{id:\"check1\",data:[{value:\"test1\",text:\"测试1\"},{value:\"test2\",text:\"测试2\"},{value:\"test3\",text:\"测试3\"}]},");
	formdata.append("{id:\"autotxt1\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\", \"Derrick1\", \"Eden1\", \"Emmanuel1\", \"Franklin1\", \"Felix1\", \"Gavin1\", \"Greg1\", \"Harlan1\"]},");
	formdata.append("{id:\"autotxt11\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\", \"Derrick1\", \"Eden1\", \"Emmanuel1\", \"Franklin1\", \"Felix1\", \"Gavin1\", \"Greg1\", \"Harlan1\"]},");
	formdata.append("{id:\"select1\",data:[{value:\"test1\",text:\"测试111\"},{value:\"test2\",text:\"测试211\"}]},");
	formdata.append("{id:\"selecttree1\",data:[{\"id\":\"11111\",\"pid\":\"0\",\"val\":\"教育部11\"},{\"id\":\"21111\",\"pid\":\"11111\",\"val\":\"云南大学11\"},{\"id\":\"71111\",\"pid\":\"11111\",\"val\":\"西安大学11\"},{\"id\":\"81111\",\"pid\":\"11111\",\"val\":\"西安大学11\"}]}]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


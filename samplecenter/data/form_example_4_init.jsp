<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder formdata = new StringBuilder();
	formdata.append("[{id:\"radio1\",data:[{value:\"man1\",text:\"男2\"},{value:\"woman1\",text:\"女2\"}]},");
	formdata.append("{id:\"check1\",data:[{value:\"test1\",text:\"测试21\"},{value:\"test2\",text:\"测试22\"},{value:\"test3\",text:\"测试23\"}]},");
	formdata.append("{id:\"autotxt1\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\"]},");
	formdata.append("{id:\"select1\",data:[{value:\"test1\",text:\"测试3111\"},{value:\"test2\",text:\"测试3211\"}]},");
	formdata.append("{id:\"selecttree1\",data:[{id:\"1\",pid:\"0\",val:\"测试\"},{id:\"2\",pid:\"1\",val:\"测试2\"}]}]");
	out.println(formdata);
%>


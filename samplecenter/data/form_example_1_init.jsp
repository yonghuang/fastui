<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder formdata = new StringBuilder();
	formdata.append("[{id:\"radio1\",data:[{value:\"man1\",text:\"男1\"},{value:\"woman1\",text:\"女1\"}]},");
	formdata.append("{id:\"check1\",data:[{value:\"test1\",text:\"测试1\"},{value:\"test2\",text:\"测试2\"},{value:\"test3\",text:\"测试3\"}]},");
	formdata.append("{id:\"autotxt1\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\", \"Derrick1\", \"Eden1\", \"Emmanuel1\", \"Franklin1\", \"Felix1\", \"Gavin1\", \"Greg1\", \"Harlan1\"]},");
	formdata.append("{id:\"autotxt11\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\", \"Derrick1\", \"Eden1\", \"Emmanuel1\", \"Franklin1\", \"Felix1\", \"Gavin1\", \"Greg1\", \"Harlan1\"]},");
	formdata.append("{id:\"selecttree1\",data:[{pid:\"0\",id:\"1\",val:\"text1\"},{pid:\"0\",id:\"1111\",val:\"text11\"},{pid:\"0\",id:\"2\",val:\"text2\"},{pid:\"0\",id:\"3\",val:\"text3\"},{pid:\"0\",id:\"4\",val:\"text4\"},{pid:\"0\",id:\"5\",val:\"text5\"},{pid:\"0\",id:\"6\",val:\"text6\"},{pid:\"0\",id:\"7\",val:\"text7\"},{pid:\"0\",id:\"8\",val:\"text8\"},{pid:\"0\",id:\"9\",val:\"text9\"},{pid:\"0\",id:\"10\",val:\"text10\"},{pid:\"1\",id:\"11\",val:\"text11\"},{pid:\"2\",id:\"12\",val:\"text12\"},{pid:\"3\",id:\"13\",val:\"text13\"},{pid:\"4\",id:\"14\",val:\"text14\"},{pid:\"5\",id:\"15\",val:\"text15\"},{pid:\"6\",id:\"16\",val:\"text16\"},{pid:\"7\",id:\"17\",val:\"text17\"},{pid:\"8\",id:\"18\",val:\"text18\"},{pid:\"9\",id:\"19\",val:\"text19\"},{pid:\"10\",id:\"20\",val:\"text20\"},{pid:\"11\",id:\"21\",val:\"text21\"},{pid:\"12\",id:\"22\",val:\"text22\"},{pid:\"13\",id:\"23\",val:\"text23\"},{pid:\"14\",id:\"24\",val:\"text24\"}]},");
	formdata.append("{id:\"select1\",data:[{value:\"test1\",text:\"测试111\"},{value:\"test2\",text:\"测试211\"}]}]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


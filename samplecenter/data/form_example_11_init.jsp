<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder formdata = new StringBuilder();
	
	
	
	
	formdata.append("[{id:\"radio1\",data:[{value:\"man1\",text:\"男1\"},{value:\"woman1\",text:\"女1\"}]},");
	formdata.append("{id:\"check1\",data:[{value:\"test1\",text:\"测试1\"},{value:\"test2\",text:\"测试2\"},{value:\"test3\",text:\"测试3\"}]},");
	formdata.append("{id:\"autotxt1\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\", \"Derrick1\", \"Eden1\", \"Emmanuel1\", \"Franklin1\", \"Felix1\", \"Gavin1\", \"Greg1\", \"Harlan1\"]},");
	formdata.append("{id:\"autotxt11\",data:[\"Aaron1\", \"Abel1\", \"Baird1\", \"Barnett1\", \"Carr1\", \"Christian1\", \"David1\", \"Derrick1\", \"Eden1\", \"Emmanuel1\", \"Franklin1\", \"Felix1\", \"Gavin1\", \"Greg1\", \"Harlan1\"]},");
	formdata.append("{id:\"selecttree1\",data:[{pid:\"0\",id:\"1\",val:\"text1\",name:\"ee\"},{pid:\"0\",id:\"1111\",val:\"text11\",name:\"ee1\"},{pid:\"0\",id:\"2\",val:\"text2\",name:\"ee2\"},{pid:\"0\",id:\"3\",val:\"text3\",name:\"ee3\"},{pid:\"0\",id:\"4\",val:\"text4\",name:\"ee4\"},{pid:\"0\",id:\"5\",val:\"text5\",name:\"ee5\"},{pid:\"0\",id:\"6\",val:\"text6\",name:\"ee6\"},{pid:\"0\",id:\"7\",val:\"text7\",name:\"ee7\"},{pid:\"0\",id:\"8\",val:\"text8\",name:\"ee8\"},{pid:\"0\",id:\"9\",val:\"text9\",name:\"ee9\"},{pid:\"0\",id:\"10\",val:\"text10\",name:\"ee10\"},{pid:\"1\",id:\"11\",val:\"text11\",name:\"ee11\"},{pid:\"2\",id:\"12\",val:\"text12\",name:\"ee12\"},{pid:\"3\",id:\"13\",val:\"text13\",name:\"e13e\"},{pid:\"4\",id:\"14\",val:\"text14\",name:\"ee14\"},{pid:\"5\",id:\"15\",val:\"text15\",name:\"ee15\"},{pid:\"6\",id:\"16\",val:\"text16\",name:\"ee16\"},{pid:\"7\",id:\"17\",val:\"text17\",name:\"ee17\"},{pid:\"8\",id:\"18\",val:\"text18\",name:\"ee18\"},{pid:\"9\",id:\"19\",val:\"text19\",name:\"ee19\"},{pid:\"10\",id:\"20\",val:\"text20\",name:\"ee20\"},{pid:\"11\",id:\"21\",val:\"text21\",name:\"ee21\"},{pid:\"12\",id:\"22\",val:\"text22\",name:\"ee22\"},{pid:\"13\",id:\"23\",val:\"text23\",name:\"ee23\"},{pid:\"14\",id:\"24\",val:\"text24\",name:\"ee24\"}]},");
	formdata.append("{id:\"select1\",data:[{value:\"test1\",text:\"测试111\",id:\"aa\"},{value:\"test2\",text:\"测试211\",id:\"bb\"}]}]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


<%@ page language="java" pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	String value = request.getParameter("param");
	StringBuffer data = new StringBuffer();
	StringBuffer result = new StringBuffer();	
	data.append("[{pid:\"0\",id:\"1\",val:\"text1\"},{pid:\"0\",id:\"1111\",val:\"text11\"},{pid:\"0\",id:\"2\",val:\"text2\"},{pid:\"0\",id:\"3\",val:\"text3\"},{pid:\"0\",id:\"4\",val:\"text4\"},{pid:\"0\",id:\"5\",val:\"text5\"},{pid:\"0\",id:\"6\",val:\"text6\"},{pid:\"0\",id:\"7\",val:\"text7\"},{pid:\"0\",id:\"8\",val:\"text8\"},{pid:\"0\",id:\"9\",val:\"text9\"},{pid:\"0\",id:\"10\",val:\"text10\"},{pid:\"1\",id:\"11\",val:\"text11\"},{pid:\"2\",id:\"12\",val:\"text12\"},{pid:\"3\",id:\"13\",val:\"text13\"},{pid:\"4\",id:\"14\",val:\"text14\"},{pid:\"5\",id:\"15\",val:\"text15\"},{pid:\"6\",id:\"16\",val:\"text16\"},{pid:\"7\",id:\"17\",val:\"text17\"},{pid:\"8\",id:\"18\",val:\"text18\"},{pid:\"9\",id:\"19\",val:\"text19\"},{pid:\"10\",id:\"20\",val:\"text20\"},{pid:\"11\",id:\"21\",val:\"text21\"},{pid:\"12\",id:\"22\",val:\"text22\"},{pid:\"13\",id:\"23\",val:\"text23\"},{pid:\"14\",id:\"24\",val:\"text24\"}]");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID +  "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	out.print(result.toString());
%>


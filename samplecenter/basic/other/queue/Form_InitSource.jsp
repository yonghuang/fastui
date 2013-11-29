<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder formdata = new StringBuilder();
	formdata.append("[{id:\"hobby\",data:[{value:\"1\",text:\"旅游\"},{value:\"2\",text:\"唱歌\"},{value:\"3\",text:\"跳舞\"},{value:\"4\",text:\"音乐\"},{value:\"5\",text:\"电影\"}]}]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


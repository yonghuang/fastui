<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String test = request.getParameter("value");
	if(test == null){
		test = "";
	}
	StringBuilder data = new StringBuilder();
	if(test.equals("data1")){
			data.append("[{\"text\": \"数据1-1\",\"value\": \"data1-1\"},");
			data.append("{\"text\": \"数据1-2\",\"value\": \"data1-2\"},");
			data.append("{\"text\": \"数据1-3\",\"value\": \"data1-3\"},");
			data.append("{\"text\": \"数据1-4\",\"value\": \"data1-4\"}]");
	}else if(test.equals("data2")){
			data.append("[{\"text\": \"数据2-1\",\"value\": \"data2-1\"},");
			data.append("{\"text\": \"数据2-2\",\"value\": \"data2-2\"},");
			data.append("{\"text\": \"数据2-3\",\"value\": \"data2-3\"},");
			data.append("{\"text\": \"数据2-4\",\"value\": \"data2-4\"}]");
	}else if(test.equals("data3")){
			data.append("[{\"text\": \"数据3-1\",\"value\": \"data3-1\"},");
			data.append("{\"text\": \"数据3-2\",\"value\": \"data3-2\"},");
			data.append("{\"text\": \"数据3-3\",\"value\": \"data3-3\"},");
			data.append("{\"text\": \"数据3-4\",\"value\": \"data3-4\"}]");
	}else if(test.equals("data4")){
			data.append("[{\"text\": \"数据4-1\",\"value\": \"data4-1\"},");
			data.append("{\"text\": \"数据4-2\",\"value\": \"data4-2\"},");
			data.append("{\"text\": \"数据4-3\",\"value\": \"data4-3\"},");
			data.append("{\"text\": \"数据4-4\",\"value\": \"data4-4\"}]");
	}else{
		data.append("[]");
	}
	PrintWriter pw = response.getWriter();
	pw.print(data.toString());
%>


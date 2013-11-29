<%@ page language="java" pageEncoding="utf-8"%>
<%
	String value = request.getParameter("param");
	StringBuffer data = new StringBuffer();
	StringBuffer result = new StringBuffer();
	//data.append("[{\"pid\":\"-1\", \"id\":\"0\",\"val\":\"根节点\",\"ismen\":\"0\"}");
	data.append(",{\"pid\":\"0\",\"id\":\"1\",\"val\":\"最近联系人\",\"ismen\":\"0\"},{\"pid\":\"1\",\"id\":\"2\",\"val\":\"测试数据2\",\"ismen\":\"1\"},{\"pid\":\"1\",\"id\":\"3\",\"val\":\"测试数据3\",\"ismen\":\"1\"},{\"pid\":\"1\",\"id\":\"4\",\"val\":\"测试数据4\",\"ismen\":\"1\"},{\"pid\":\"0\",\"id\":\"5\",\"val\":\"办公室\",\"ismen\":\"0\"},{\"pid\":\"5\",\"id\":\"6\",\"val\":\"测试数据6\",\"ismen\":\"1\"},{\"pid\":\"5\",\"id\":\"7\",\"val\":\"测试数据7\",\"ismen\":\"1\"},{\"pid\":\"5\",\"id\":\"8\",\"val\":\"测试数据8\",\"ismen\":\"1\"},{\"pid\":\"0\",\"id\":\"9\",\"val\":\"测试数据\",\"ismen\":\"0\"},{\"pid\":\"9\",\"id\":\"10\",\"val\":\"测试数据10\",\"ismen\":\"1\"},{\"pid\":\"9\",\"id\":\"11\",\"val\":\"测试数据11\",\"ismen\":\"1\"},{\"pid\":\"9\",\"id\":\"12\",\"val\":\"测试数据12\",\"ismen\":\"1\"},{\"pid\":\"0\",\"id\":\"13\",\"val\":\"测试数据人13\",\"ismen\":\"1\"},{\"pid\":\"0\",\"id\":\"14\",\"val\":\"测试数据人14\",\"ismen\":\"1\"},{\"pid\":\"0\",\"id\":\"15\",\"val\":\"测试数据15\",\"ismen\":\"0\"}");
	for(int i=30; i<100; i++){
		data.append(",{\"pid\":\"2\",\"id\":\"" + i +"\",\"val\":\"子节点" + i + "\",\"ismen\":\"1\"}");
	}
	for(int i=101; i<200; i++){
		data.append(",{\"pid\":\"3\",\"id\":\"" + i +"\",\"val\":\"子节点" + i + "\",\"ismen\":\"1\"}");
	}
	for(int i=201; i<400; i++){
		data.append(",{\"pid\":\"4\",\"id\":\"" + i +"\",\"val\":\"子节点" + i + "\",\"ismen\":\"1\"}");
	}
	for(int i=401; i<600; i++){
		data.append(",{\"pid\":\"5\",\"id\":\"" + i +"\",\"val\":\"子节点" + i + "\",\"ismen\":\"1\"}");
	}
	data.append("]");
	out.print(data.toString());
%>

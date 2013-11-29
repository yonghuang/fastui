<%@ page language="java" pageEncoding="utf-8"%>
<%
	String value = request.getParameter("param");
	StringBuffer data = new StringBuffer();
	StringBuffer result = new StringBuffer();
	data.append("[{\"pid\":\"-1\",\"id\":\"0\",\"val\":\"枝节点0\"}");
	for(int i=1;i<40;i++){
		data.append(",{\"pid\":\"0\",\"id\":\"" + i +"\",\"val\":\"枝节点" + i + "\"}");
		for(int j=1;j<26;j++){
			data.append(",{\"pid\":\""+i+"\",\"id\":\"" + i+"_"+j+"\",\"val\":\"枝节点" + i +"_"+j+ "\"}");
		}
	}
	data.append("]");
	out.print(data.toString());
%>

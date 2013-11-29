<%@ page language='java' import='java.io.PrintWriter'
	pageEncoding='utf-8'%>
<%
	StringBuilder formdata = new StringBuilder();
	String id = request.getParameter("id");
	if(id.equals("1")){
	formdata.append("{'id':'1','name':'张三','type':'0','orgid':'2','date':'2013-05-05','remark' :'无'}");
	}else if(id.equals("2")){
	formdata.append("{'id':'2','name':'李四','type':'0','orgid':'1','date':'2012-04-04','remark' :'备注'}");	
	}
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


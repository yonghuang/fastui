<%@ page language='java' import='java.io.PrintWriter'
	pageEncoding='utf-8'%>
<%
	StringBuilder formdata = new StringBuilder();
	formdata.append("{'type':[{value:'0',text:'奖'},{value:'1',text:'惩'}]}");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>
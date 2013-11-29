<%@ page language='java' import='java.io.PrintWriter'
	pageEncoding='utf-8'%>
<%
	StringBuilder formdata = new StringBuilder();
	formdata.append("{'orgid':[{value:'1',text:'研发部'},{value:'2',text:'销售部'}],'type':[{value:'0',text:'奖'},{value:'1',text:'惩'}]}");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


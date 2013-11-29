    <%@ page language="java" import="java.io.PrintWriter"
             pageEncoding="utf-8"%>
            <%
	String cacheID = request.getParameter("cacheID");
	String requestRows = request.getParameter("rows");
	String requestpage = request.getParameter("page");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	if(requestRows.equals("5")){
		if(requestpage!=null && requestpage.equals("2")){
			data.append("{data:");
			data.append("[");
			data.append("{name:\"test6\",sex:\"man\",age:\"25\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test7\",sex:\"man\",age:\"28\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test8\",sex:\"woman\",age:\"29\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test9\",sex:\"woman\",age:\"22\",date:\"2011-10-13 12:00:00:0\"}");
			data.append("],");
			data.append("info:{total:9,page:"+requestpage+",records:2,rows:"+requestRows+"}}");
		}else{
			data.append("{data:");
			data.append("[");
			data.append("{name:\"test1\",sex:\"man\",age:\"20\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test2\",sex:\"woman\",age:\"22\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test3\",sex:\"man\",age:\"23\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test4\",sex:\"man\",age:\"22\",date:\"2011-10-13 12:00:00:0\"},");
			data.append("{name:\"test5\",sex:\"woman\",age:\"21\",date:\"2011-10-13 12:00:00:0\"}");
			data.append("],");
			data.append("info:{total:9,page:"+requestpage+",records:2,rows:"+requestRows+"}}");
		}
	}else{
			data.append("{data:");
			data.append("[");
			data.append("],");
			data.append("info:{total:0,page:0,records:0,rows:0}}");
	}
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID + "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


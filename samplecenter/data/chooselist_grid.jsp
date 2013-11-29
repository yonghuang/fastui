<%@page language="java" pageEncoding="utf-8"%>
<%
	String currentPage = request.getParameter("page");
	String pageSize = request.getParameter("pageSize");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if (currentPage.equals("1")) {
		if (pageSize.equals("10")) {
			data.append("[{\"empno\": \"2001\",\"name\": \"关羽\"},");
			data.append("{\"empno\": \"2002\",\"name\": \"曹操\"},");
			data.append("{\"empno\": \"2003\",\"name\": \"周瑜\"},");
			data.append("{\"empno\": \"2004\",\"name\": \"孙权\"},");
			data.append("{\"empno\": \"2005\",\"name\": \"张飞\"},");
			data.append("{\"empno\": \"2006\",\"name\": \"马超\"},");
			data.append("{\"empno\": \"2007\",\"name\": \"赵云\"},");
			data.append("{\"empno\": \"2008\",\"name\": \"诸葛亮\"},");
			data.append("{\"empno\": \"2009\",\"name\": \"黄忠\"},");
			data.append("{\"empno\": \"2010\",\"name\": \"刘备\"}]");
			info = "{\"pageSize\": 10,\"records\": 10,\"page\": 1,\"total\": 1}";
		} else {
			data.append("[{\"empno\": \"2001\",\"name\": \"关羽\"},");
			data.append("{\"empno\": \"2002\",\"name\": \"曹操\"},");
			data.append("{\"empno\": \"2003\",\"name\": \"周瑜\"},");
			data.append("{\"empno\": \"2004\",\"name\": \"孙权\"},");
			data.append("{\"empno\": \"2005\",\"name\": \"张飞\"}]");
			info = "{\"pageSize\": 5,\"records\": 10,\"page\": 1,\"total\": 2}";
		}
	} else if (currentPage.equals("2")) {
		if (pageSize.equals("5")) {
			data.append("[{\"empno\": \"2006\",\"name\": \"马超\"},");
			data.append("{\"empno\": \"2007\",\"name\": \"赵云\"},");
			data.append("{\"empno\": \"2008\",\"name\": \"诸葛亮\"},");
			data.append("{\"empno\": \"2009\",\"name\": \"黄忠\"},");
			data.append("{\"empno\": \"2010\",\"name\": \"刘备\"}]");
			info = "{\"pageSize\": 5,\"records\": 10,\"page\": 2,\"total\": 2}";
		}
	}
	result.append("{");
	result.append("info:" + info + ",");
	result.append("data:" + data.toString());
	result.append("}");
	out.print(result.toString());
%>
<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%


String test = request.getParameter("page");
	String pageSize = request.getParameter("pageSize");
	//String test = request.getParameter("empno");
	
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if(test.equals("1"))
	{
	if(pageSize.equals("10"))
	{
	

	
		
		data.append("[{\"empno\": \"0001\",\"name\": \"卡通陶瓷杯\",\"address\": \"景德镇\",\"mader\":\"凯通\",\"date\":\"2012-10-10\",\"price\":\"11.8\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0002\",\"name\": \"dell笔记本\",\"address\": \"美国\",\"mader\":\"dell\",\"date\":\"2012-10-10\",\"price\":\"5680\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0003\",\"name\": \"小米手机\",\"address\": \"北京\",\"mader\":\"小米\",\"date\":\"2012-10-10\",\"price\":\"1999\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0004\",\"name\": \"the new ipad\",\"address\": \"美国加州\",\"mader\":\"苹果公司\",\"date\":\"2012-10-10\",\"price\":\"3366\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0005\",\"name\": \"ipad保护套\",\"address\": \"南京\",\"mader\":\"ESR\",\"date\":\"2012-10-10\",\"price\":\"99\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0006\",\"name\": \"婴儿餐椅\",\"address\": \"徐州\",\"mader\":\"小硕士婴儿用品\",\"date\":\"2012-10-10\",\"price\":\"328\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0007\",\"name\": \"绿茶\",\"address\": \"长沙\",\"mader\":\"云雾茶叶\",\"date\":\"2012-10-10\",\"price\":\"189\",\"class\":\"A等品\"}]");
			
			info = "{\"pageSize\": 10,\"records\": 7,\"page\": 1,\"total\": 7}";
		}
		else if(pageSize.equals("5"))
		{
			data.append("[{\"empno\": \"0001\",\"name\": \"卡通陶瓷杯\",\"address\": \"景德镇\",\"mader\":\"凯通\",\"date\":\"2012-10-10\",\"price\":\"11.8\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0002\",\"name\": \"dell笔记本\",\"address\": \"美国\",\"mader\":\"dell\",\"date\":\"2012-10-10\",\"price\":\"5680\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0003\",\"name\": \"小米手机\",\"address\": \"北京\",\"mader\":\"小米\",\"date\":\"2012-10-10\",\"price\":\"1999\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0004\",\"name\": \"the new ipad\",\"address\": \"美国加州\",\"mader\":\"苹果公司\",\"date\":\"2012-10-10\",\"price\":\"3366\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0005\",\"name\": \"ipad保护套\",\"address\": \"南京\",\"mader\":\"ESR\",\"date\":\"2012-10-10\",\"price\":\"99\",\"class\":\"A等品\"}]");
		info = "{\"pageSize\": 5,\"records\": 5,\"page\": 1,\"total\": 7}";
		}
	
	}
	else if(test.equals("2")){
		
			
				data.append("[{\"empno\": \"0006\",\"name\": \"婴儿餐椅\",\"address\": \"徐州\",\"mader\":\"小硕士婴儿用品\",\"date\":\"2012-10-10\",\"price\":\"328\",\"class\":\"A等品\"},");
		data.append("{\"empno\": \"0007\",\"name\": \"绿茶\",\"address\": \"长沙\",\"mader\":\"云雾茶叶\",\"date\":\"2012-10-10\",\"price\":\"189\",\"class\":\"A等品\"}]");
				
			info = "{\"pageSize\": 5,\"records\": 2,\"page\": 2,\"total\": 7}";
	
		}
		
	
	
		result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


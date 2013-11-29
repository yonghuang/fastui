<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String test = request.getParameter("empno");
	
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if(test.equals("0001"))
	{
		data.append("[{\"empno\": \"0001\",\"selldate\": \"2000-1-1\",\"number\": \"1000\",\"remark\":\"过年咯\"},");
		data.append("{\"empno\": \"0001\",\"selldate\": \"2000-1-2\",\"number\": \"10\",\"remark\":\"放假了\"}]");
		
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
	}
	else if(test.equals("0002")){
		
				data.append("[{\"empno\": \"0002\",\"selldate\": \"2012-11-6\",\"number\": \"10\",\"remark\": \"销售量不大\"},");
			data.append("{\"empno\": \"0002\",\"selldate\": \"2012-11-12\",\"number\": \"200\",\"remark\": \"销售火爆\"}]");
			
			
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
		}
		else if(test.equals("0003")){
		
				data.append("[{\"empno\": \"0003\",\"selldate\": \"2012-11-6\",\"number\": \"10\",\"remark\": \"淡淡的\"},");
			data.append("{\"empno\": \"0003\",\"selldate\": \"2012-11-12\",\"number\": \"200\",\"remark\": \"跑款\"}]");
			
			
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
		}
				else if(test.equals("0004")){
		
				data.append("[{\"empno\": \"0004\",\"selldate\": \"2012-11-6\",\"number\": \"10\",\"remark\": \"七上八下\"},");
			data.append("{\"empno\": \"0004\",\"selldate\": \"2012-11-12\",\"number\": \"200\",\"remark\": \"七七八八\"}]");
			
			
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
		}
		else if(test.equals("0005")){
		
				data.append("[{\"empno\": \"0005\",\"selldate\": \"2012-11-6\",\"number\": \"10\",\"remark\": \"库存不够了\"},");
			data.append("{\"empno\": \"0005\",\"selldate\": \"2012-11-12\",\"number\": \"200\",\"remark\": \"需要进货了\"}]");
			
			
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
		}
				else if(test.equals("0006")){
		
				data.append("[{\"empno\": \"0006\",\"selldate\": \"2012-11-6\",\"number\": \"10\",\"remark\": \"马上备货\"},");
			data.append("{\"empno\": \"0006\",\"selldate\": \"2012-11-12\",\"number\": \"200\",\"remark\": \"利润低\"}]");
			
			
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
		}
				else if(test.equals("0007")){
		
				data.append("[{\"empno\": \"0007\",\"selldate\": \"2012-11-6\",\"number\": \"10\",\"remark\": \"利润高\"},");
			data.append("{\"empno\": \"0007\",\"selldate\": \"2012-11-12\",\"number\": \"200\",\"remark\": \"需要进货了\"}]");
			
			
			
			info = "{\"pageSize\": 2,\"records\": 2,\"page\": 1,\"total\": 2}";
	
		}
	
	
		result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


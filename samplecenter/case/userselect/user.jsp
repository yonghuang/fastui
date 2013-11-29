<%@page language="java" pageEncoding="utf-8"%>
<%
	String orgid = request.getParameter("value");

	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	if (orgid.equals("2")) {
		
			data.append("[{\"text\": \"马超\",\"value\": \"001\"},");
			data.append("{\"text\": \"赵云\",\"value\": \"002\"},");
			data.append("{\"text\": \"诸葛亮\",\"value\": \"003\"},");
			data.append("{\"text\": \"刘备\",\"value\": \"004\"}]");
			
		}
		else if (orgid.equals("3"))
		{
		data.append("[{\"text\": \"唐僧\",\"value\": \"0001\"},");
			data.append("{\"text\": \"白马\",\"value\": \"0002\"},");
			data.append("{\"text\": \"猪八戒\",\"value\": \"0003\"},");
			data.append("{\"text\": \"孙悟空\",\"value\": \"0004\"}]");
		}
		else if (orgid.equals("4"))
		{
		data.append("[{\"text\": \"李亚鹏\",\"value\": \"00001\"},");
			data.append("{\"text\": \"笑傲江湖\",\"value\": \"00002\"},");
			data.append("{\"text\": \"逍遥游\",\"value\": \"00003\"},");
			data.append("{\"text\": \"任盈盈\",\"value\": \"00004\"}]");
		}
		else if (orgid.equals("5"))
		{
		data.append("[{\"text\": \"陈奕迅\",\"value\": \"20001\"},");
			data.append("{\"text\": \"王菲\",\"value\": \"20002\"},");
			data.append("{\"text\": \"莫文蔚\",\"value\": \"20003\"},");
			data.append("{\"text\": \"萧敬腾\",\"value\": \"20004\"}]");
		}
	
	
	out.print(data.toString());
%>
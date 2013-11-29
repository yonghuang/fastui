<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%

	StringBuilder data = new StringBuilder();
	String s1=request.getParameter("id");
	
		String data1 = "[{\"id\":\"4\",\"pid\":\"1\",\"val\":\"办公室\",\"asyn\":\"true\"},{\"id\":\"42\",\"pid\":\"1\",\"val\":\"小白\"}]";
		String data2 = "[{\"id\":\"5\",\"pid\":\"2\",\"val\":\"张三1\"},{\"id\":\"58\",\"pid\":\"2\",\"val\":\"李四1\"},{\"id\":\"13\",\"pid\":\"2\",\"val\":\"李涡1\"},{\"id\":\"44\",\"pid\":\"2\",\"val\":\"王五1\"}]";
		String data3 = "[{\"id\":\"6\",\"pid\":\"3\",\"val\":\"张三2\"},{\"id\":\"49\",\"pid\":\"3\",\"val\":\"李四2\",\"chk\":false},{\"id\":\"23\",\"pid\":\"3\",\"val\":\"李涡2\"},{\"id\":\"34\",\"pid\":\"3\",\"val\":\"王五2\"}]";
		String data4 = "[{\"id\":\"7\",\"pid\":\"4\",\"val\":\"张三3\"},{\"id\":\"11\",\"pid\":\"4\",\"val\":\"李四3\"},{\"id\":\"33\",\"pid\":\"4\",\"val\":\"李涡3\"},{\"id\":\"24\",\"pid\":\"4\",\"val\":\"王五3\"}]";

		String data13 = "[{\"id\":\"118\",\"pid\":\"13\",\"val\":\"总裁秘书\"}]";

if(s1.equals("1"))
data.append(data1);
else if(s1.equals("2"))
data.append(data2);
else if(s1.equals("3"))
data.append(data3);	
else if(s1.equals("4"))
data.append(data4);	
else if(s1.equals("13"))
data.append(data13);	


	PrintWriter pw = response.getWriter();
	pw.print(data.toString());
	
%>

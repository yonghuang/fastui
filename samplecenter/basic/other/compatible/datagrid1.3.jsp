<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	String requestRows = request.getParameter("rows");
	String requestpage = request.getParameter("page");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	if(requestRows.equals("10")){
		if(requestpage!=null && requestpage.equals("1")){
			data.append("{data:");
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1713\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1714\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":\"false\",\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1715\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1716\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1717\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}],");
			data.append("info:{total:10,page:"+requestpage+",records:1,rows:"+requestRows+"}}");
		}else{
			data.append("{data:");
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1713\",\"name\": \"徐承\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"}],");
			data.append("info:{total:10,page:"+requestpage+",records:1,rows:"+requestRows+"}}");
		}
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


<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String test = request.getParameter("page");
	String pageSize = request.getParameter("pageSize");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	String info = "";
	
		if(pageSize.equals("100")){
			data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
			data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
				data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			info = "{\"pageSize\": 100,\"records\": 300,\"page\":"+test+",\"total\": 3}";
		}else{
				data.append("[{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
			data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
						data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
						data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"},");
			
						data.append("{\"empno\": \"2212\",\"name\": \"袁维\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"2320\",\"name\": \"张琦\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 4632,\"datesemployed\": \"2012-05-17\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"0143\",\"name\": \"张鹏楠\",\"department\": \"技术研发部\",\"position\": \"position1\",\"pay\": 3230,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"前端工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承1\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-30\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承2\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承3\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":false,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承4\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承5\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"1712\",\"name\": \"徐承6\",\"department\": \"技术研发部\",\"position\": \"position2\",\"pay\": 4373,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"后台工程师\"},");
			data.append("{\"empno\": \"0743\",\"name\": \"唐岳\",\"department\": \"技术研发部\",\"position\": \"position3\",\"pay\": 6300,\"datesemployed\": \"2012-01-31\",\"isuse\":true,\"positionName\":\"技术经理\"}]");
			

			info = "{\"pageSize\": 50,\"records\": 300,\"page\":"+test+",\"total\": 6}";
		}
	
	result.append("{");
	result.append("info:"+info+",");
	result.append("data:" + data.toString());
	result.append("}");
	PrintWriter pw = response.getWriter();
	pw.print(result.toString());
%>


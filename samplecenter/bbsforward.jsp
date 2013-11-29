<%@ page language="java" pageEncoding="utf-8"%>

<%
	String ip = request.getRemoteAddr();
	if(ip.matches("192\\.168.*") == true){
		response.sendRedirect("http://192.168.143.39/bbs/forum.php");
	}else{
		response.sendRedirect("http://222.247.54.22:9095/bbs/forum.php");
	}
%>
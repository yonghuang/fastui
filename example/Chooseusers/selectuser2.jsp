<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
	
<%


	String cacheID = request.getParameter("cacheID");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
//	data.append("[{\"text\":\"信息化部管理员审核\",\"value\":\"infomen^0\"},{\"text\":\"部门领导审核\",\"value\":\"deptleader^0\"}]");

data.append("[{\"text\":\"本部门领导审核\",\"value\":\"theDeptHeader^0\",\"selected\":true},{\"text\":\"结束\",\"value\":\"End^0\"},{\"text\":\"相关业务部门领导审核\",\"value\":\"relatedBusinessDeptHeader^1\"}]");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID + "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(data.toString());
%>


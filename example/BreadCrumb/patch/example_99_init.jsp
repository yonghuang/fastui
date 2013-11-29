<%@ page language="java" pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	String value = request.getParameter("param");
	StringBuffer data = new StringBuffer();
	StringBuffer result = new StringBuffer();
	data.append("[{value :\"汽车之家\",href : \"http://www.autohome.com.cn/\"}, {value : \"汽车报价\",href : \"http://car.autohome.com.cn/\"}, {value : \"宝骏\",href : \"http://car.autohome.com.cn/price/brand-120.html\"},{value : \"上汽通用五菱\",href : \"http://car.autohome.com.cn/price/brand-120-59.html\"},{value : \"宝骏630\",href : \"http://car.autohome.com.cn/price/series-2236.html\"}]");
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID +  "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	out.print(result.toString());
%>


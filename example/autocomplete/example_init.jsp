<%@ page language="java" pageEncoding="utf-8"%>
<%
	String cacheID = request.getParameter("cacheID");
	String param = request.getParameter("param");
	StringBuilder result = new StringBuilder();
	StringBuilder data = new StringBuilder();
	if (param != null) {
		if (param.equals("我")) {
			data.append("[\"我的\",\"我去\",\"我我我\",\"我我我我\"]");
		} else if (param.equals("b")) {
			data.append("[\"ba\",\"bb\",\"bc\",\"bd\"]");
		} else if (param.equals("c")) {
			data.append("[\"ca\",\"cb\",\"cc\",\"cd\"]");
		} else if (param.equals("a")){
			data.append("[\"aaa\",\"aab\",\"aac\",\"aad\"]");
		}else {
			data.append("");
		}
	} else {
		data.append("");
	}
	result.append("[");
	result.append("{");
	result.append("cacheID:\"" + cacheID +  "\",");
	result.append("cacheData:" + data.toString());
	result.append("}");
	result.append("]");
	out.print(result.toString());
%>


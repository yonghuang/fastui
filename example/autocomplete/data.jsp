<%@page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String q = request.getParameter("q");
	if (q != null) {
		String[] array = "Aaron,Abel,Baird,Barnett,Carr,Christian,David,Derrick,Eden,Emmanuel,Franklin,Felix,Gavin,Greg,Harlan,Jack,Jeff,Kelly,King,Lance,Levi,Marcus,Newman,Norton,Ivan,Oscar,Peter,Quinn,Robin,Simon,Sam,Tiffany,Virgil,Will,Xavier,Zachary".split(",");
		StringBuilder data = new StringBuilder();
		for (String r : array){
			if (r.indexOf(q) != -1) {
				data.append("{\"text\":\"" + r + "\",\"value\":\"" + r + "\"},");
			}
		}
		if (data.length() > 0){
			q = data.substring(0, data.length() - 1);
		} else {
			q = "";
		}
		q = "[" + q + "]";
	  
	} else {
		q = "[]";
	}
	PrintWriter pw = response.getWriter();
	pw.print(q);
%>


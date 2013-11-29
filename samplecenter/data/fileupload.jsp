<%@page import="com.talkweb.twdpe.web.upload.impl.File"%>
<%@page import="com.talkweb.twdpe.core.util.json.JsonObject"%>
<%@page import="com.talkweb.twdpe.core.util.json.JsonArray"%>
<%@page import="com.talkweb.twdpe.core.config.ConfigManager"%>
<%@page import="com.talkweb.twdpe.web.upload.impl.FileUploadServiceImpl"%>
<%@page import="com.talkweb.twdpe.web.upload.FileUploadService"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	request.setCharacterEncoding("utf-8");
	String type = request.getParameter("type");
	String path = null;
	if (type != null) {
		path = ConfigManager.getInstance().getAppConfig().get("upload.system").get(type);
	}
	if (path == null) {
		path = ConfigManager.getInstance().getAppConfig().get("upload.system").get("path");
	}
	FileUploadService server = new FileUploadServiceImpl();
	server.setStoragePath(path);
	server.setServletContext(this.getServletContext());
	String maxSize = request.getParameter("maxSize");
	if (maxSize != null) {
		server.setMaxSize(Long.parseLong(maxSize));	
	}
	JsonArray array = new JsonArray();
	JsonObject json = null;
	try {
		for (File file : server.getFilesInLocal(request)) {
			json = new JsonObject();
			json.put("name", file.getName());
			json.put("url", file.toString());
			json.put("size", file.length());
			json.put("type", file.getContentType());
			json.put("missing", file.isMissing());
			json.put("allowed", file.isAllowed());
			json.put("path", file.getRelativePath());
			array.add(json);
		}
	} catch(Exception e) {
		json = new JsonObject();
		json.put("missing", true);
		array.add(json);
	} finally {
		out.println(array.toString());
	}
%>

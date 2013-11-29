<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="java.util.regex.Pattern"%>
<%@page import="java.io.FilenameFilter"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
    //------------------图片存储配置----------------------------
    String relativePath = "upload/uploadimages"; //图片的存储相对路径(相对于服务器上web应用的根目录)，可以自行更改。更改时注意，路径名最前和最后不要加反斜杠(/)。
    String typeAllowed = "gif|jpeg|jpg|png|bmp"; //图片格式过滤
    request.setCharacterEncoding("utf-8"); //字符编码集设置
    //------------------华丽的分割线----------------------------
    String path = application.getRealPath("/").replace("\\", "/") + relativePath;
    String action = request.getParameter("action");
    if ("get".equalsIgnoreCase(action)) {
		List<String> fileList = getFiles(path, typeAllowed);
		String[] files = fileList.toArray(new String[fileList.size()]);
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < files.length; i++) {
		    if (i > 0) {
			sb.append("ue_separate_ue");
		    }
		    sb.append(relativePath + "/" + files[i]);
		}
		out.print(sb.toString());
    }
%>
<%!private List<String> getFiles(String path, String type) {
	List<String> files = new ArrayList<String>();
	if (path != null) {
	    File dir = new File(path);
	    if (dir.isDirectory()) {
		for (File file : dir.listFiles()) {
		    if (file.isDirectory()) {
			files.addAll(getFiles(file.getPath(), type));
		    } else {
			if (Pattern.matches(".+[.](?i)(" + type + ")", file.getName())) {
			    files.add(file.getName());
			}
		    }
		}
	    }
	}
	return files;
    }%>
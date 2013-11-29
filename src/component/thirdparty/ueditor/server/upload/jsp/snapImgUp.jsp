<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.io.FileWriter"%>
<%@page import="org.apache.commons.fileupload.util.Streams"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.BufferedOutputStream"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.util.UUID"%>
<%@page import="java.util.regex.Pattern"%>
<%@page import="org.apache.commons.fileupload.FileItem"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
    //------------------图片上传配置----------------------------
    String relativePath = "upload/uploadimages"; //图片的存储相对路径(相对于服务器上web应用的根目录)，可以自行更改。更改时注意，路径名最前和最后不要加反斜杠(/)。
    String typeAllowed = "gif|png|jpg|jpeg|bmp"; //图片允许的格式
    long sizeLimited = 1000 * 1024; //图片允许的大小，单位字节。（此处是1000KB）
    //------------------华丽的分割线----------------------------
    String log = "log.txt"; //日志文件名
    String url = "";
    String state = "SUCCESS";//文件上传状态,当成功时返回SUCCESS，其余值将直接返回对应字符窜并显示在图片预览框，同时可以在前端页面通过回调函数获取对应字符窜
    String savePath = application.getRealPath("/").replace("\\", "/") + relativePath;
    File dir = new File(savePath);
    if (!dir.isDirectory()) {
		dir.mkdirs();
    }
    File logFile = new File(savePath + "/" + log);
    if (!logFile.isFile()) {
		logFile.createNewFile();
    }
    request.setCharacterEncoding("utf-8");
    if (ServletFileUpload.isMultipartContent(request)) {
		try {
		    DiskFileItemFactory factory = new DiskFileItemFactory();
		    factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
		    factory.setSizeThreshold(10 * 1024);
		    ServletFileUpload upload = new ServletFileUpload(factory);
		    @SuppressWarnings("unchecked")
		    List<FileItem> items = upload.parseRequest(request);
		    String fileName = null;
		    if (items.size() == 0) {
			state = "图片保存失败！";
		    } else {
			for (FileItem item : items) {
			    if (!item.isFormField() && (fileName = item.getName()) != null
				    && !"".equals(fileName = fileName.trim())) {
				String type = fileName.substring(fileName.lastIndexOf(".") + 1);
				if (!Pattern.matches("(?i)(" + typeAllowed + ")", type)) { //类型验证
				    state = "不支持的图片类型！";
				    break;
				}
				if (item.getSize() > sizeLimited) { //大小验证
				    state = "图片大小超出限制！";
				    break;
				}
				String file = UUID.randomUUID().toString() + "." + type;
				url = relativePath + "/" + file;
				BufferedInputStream bis = new BufferedInputStream(item.getInputStream());
				BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(savePath
					+ "/" + file)));
				Streams.copy(bis, bos, true);
				FileWriter writer = null;
				try {
				    writer = new FileWriter(new File(savePath + "/" + log), true); //写日志
				    writer.append(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())
					    + " UPLOAD - " + getClientIPAddress(request) + " " + item.getName() + " "
					    + item.getContentType() + System.getProperty("line.separator"));
				} catch (Exception e) {
				} finally {
				    if (writer != null) {
					try {
					    writer.close();
					} catch (Exception e) {
					}
				    }
				}
			    }
			}
		    }
		} catch (Exception e) {
		    state = "图片保存失败！";
		}
    }
    out.print("{\"url\":\"" + url + "\",\"state\":\"" + state + "\"}");
%>
<%!private String getClientIPAddress(HttpServletRequest request) {
	String ip = request.getHeader("x-forwarded-for");
	if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	    ip = request.getHeader("Proxy-Client-IP");
	}
	if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	    ip = request.getHeader("WL-Proxy-Client-IP");
	}
	if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	    ip = request.getRemoteAddr();
	}
	return ip;
    }%>
<%@page import="org.apache.commons.fileupload.util.Streams"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.BufferedOutputStream"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.util.UUID"%>
<%@page import="java.util.regex.Pattern"%>
<%@page import="org.apache.commons.fileupload.FileItem"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
    //------------------文件上传配置----------------------------
    String relativePath = "upload/uploadfiles"; //文件的存储相对路径(相对于服务器上web应用的根目录)，可以自行更改。更改时注意，路径名最前和最后不要加反斜杠(/)。
    String typeAllowed = "rar|doc|docx|zip|pdf|txt|swf|wmv"; //文件允许的格式
    long sizeLimited = 100 * 1024 * 1024; //文件允许的大小，单位字节。（此处是100MB）
    request.setCharacterEncoding("utf-8");//字符编码集设置
    //------------------华丽的分割线----------------------------
    String state = "SUCCESS"; //文件上传状态,当成功时返回SUCCESS,其余值将直接返回对应字符串
    String url = "";
    String type = "";
    String savePath = application.getRealPath("/").replace("\\", "/") + relativePath;
    File dir = new File(savePath);
    if (!dir.isDirectory()) {
		dir.mkdirs();
    }
    if (ServletFileUpload.isMultipartContent(request)) {
		try {
		    DiskFileItemFactory factory = new DiskFileItemFactory();
		    factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
		    factory.setSizeThreshold(2 * 1024 * 1024);
		    ServletFileUpload upload = new ServletFileUpload(factory);
		    @SuppressWarnings("unchecked")
		    List<FileItem> items = upload.parseRequest(request);
		    String fileName = null;
		    if (items.size() == 0) {
			state = "文件大小可能超出服务器配置！";
		    } else {
			for (FileItem item : items) {
			    if (!item.isFormField() && (fileName = item.getName()) != null
				    && !"".equals(fileName = fileName.trim())) {
				type = fileName.substring(fileName.lastIndexOf(".") + 1);
				if (!Pattern.matches("(?i)(" + typeAllowed + ")", type)) { //类型验证
				    state = "不支持的文件类型！";
				    break;
				}
				if (item.getSize() > sizeLimited) { //大小验证
				    state = "文件大小超出限制！";
				    break;
				}
				String file = UUID.randomUUID().toString() + "." + type;
				url = relativePath + "/" + file;
				BufferedInputStream bis = new BufferedInputStream(item.getInputStream());
				BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(savePath
					+ "/" + file)));
				Streams.copy(bis, bos, true);
			    }
			}
		    }
		} catch (Exception e) {
		    state = "文件保存失败！";
		}
    }
    out.print("{\"state\":\"" + state + "\",\"url\":\"" + url + "\",\"fileType\":\"" + type + "\"}");
%>
<%@page import="org.apache.commons.fileupload.FileItem"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.commons.fileupload.util.Streams"%>
<%@page import="java.io.BufferedOutputStream"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.util.UUID"%>
<%@page import="java.util.regex.Pattern"%>
<%@page import="org.apache.commons.fileupload.FileItemStream"%>
<%@page import="org.apache.commons.fileupload.FileItemIterator"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    //------------------图片上传配置----------------------------
    String relativePath = "upload/uploadimages"; //图片的存储相对路径(相对于服务器上web应用的根目录)，可以自行更改。更改时注意，路径名最前和最后不要加反斜杠(/)。
    String typeAllowed = "gif|jpeg|jpg|png|bmp"; //图片允许上传的格式
    long sizeLimited = 1024 * 1024; //文件大小限制，单位字节(此处是1MB)。
    request.setCharacterEncoding("utf-8"); //字符编码集设置
    //------------------华丽的分割线----------------------------
    String savePath = application.getRealPath("/").replace("\\", "/") + relativePath; //文件存储路径
    File dir = new File(savePath);
    if (!dir.isDirectory()) {
        dir.mkdirs();
    }
    if (ServletFileUpload.isMultipartContent(request)) {
        DiskFileItemFactory dff = new DiskFileItemFactory();
        dff.setRepository(new File(System.getProperty("java.io.tmpdir")));
        dff.setSizeThreshold(1024 * 1024);
        ServletFileUpload sfu = new ServletFileUpload(dff);
        @SuppressWarnings("unchecked")
        List<FileItem> items = sfu.parseRequest(request);
        String title = ""; //图片标题
        String url = ""; //图片地址
        String fileName = "";
        String realFile = "";
        String state = "SUCCESS";
        for (FileItem item : items) {
            try {
            if (!item.isFormField() && item.getName().length() > 0) {
                fileName = item.getName();
                if (!Pattern.matches(".+[.](?i)(" + typeAllowed + ")", fileName)) {//类型验证
                state = "TYPE";
                break;
                }
                if (item.getSize() > sizeLimited) { //大小验证
                state = "SIZE";
                break;
                }
                realFile = UUID.randomUUID().toString() + fileName.substring(fileName.lastIndexOf("."));
                url = relativePath + "/" + realFile;
                BufferedInputStream bis = new BufferedInputStream(item.getInputStream());//获得文件输入流
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(new File(savePath + "/"
                    + realFile)));
                Streams.copy(bis, bos, true);//开始把文件写到你指定的上传文件夹
            } else {
                String fname = item.getFieldName();
                if (fname.indexOf("pictitle") != -1) {
                title = item.getString(request.getCharacterEncoding());
                }
            }
            } catch (Exception e) {
            state = "ERROR";
            break;
            }
        }
        title = title.replace("&", "&amp;").replace("'", "&#039;").replace("\"", "&quot;").replace("<", "&lt;")
            .replace(">", "&gt;");
        out.print("{\"url\":\"" + url + "\",\"title\":\"" + title + "\",\"state\":\"" + state + "\"}");
    }
%>

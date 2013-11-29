<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.BufferedOutputStream"%>
<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.util.UUID"%>
<%@page import="java.io.IOException"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.net.URL"%>
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    //------------------图片存储配置----------------------------
    String relativePath = "upload/uploadimages"; //图片的存储相对路径(相对于服务器上web应用的根目录)，可以自行更改。更改时注意，路径名最前和最后不要加反斜杠(/)。
    String[] contentType = { ".gif", ".png", ".jpg", ".jpeg", ".bmp" }; //文件允许格式
    long sizeLimited = 3000 * 1024; //文件大小限制，单位字节（此处是3000KB）
    request.setCharacterEncoding("utf-8"); //字符编码集设置
    //------------------华丽的分割线----------------------------
    String savePath = application.getRealPath("/").replace("\\", "/") + relativePath; //文件存储路径
    File saveDir = new File(savePath);
    if (!saveDir.exists()) {
        saveDir.mkdirs();
    }
    String urls = request.getParameter("content");
    List<String> names = new ArrayList<String>(); //用于保存文件名
    if (urls != null) {
        for (String url : urls.replace("UE_SEPARATE_UE", "ue_separate_ue").split("ue_separate_ue")) {
            int last = url.lastIndexOf(".");
            String imgType = null;
            if (last != -1) {
            imgType = url.substring(url.lastIndexOf("."));
            } else {
            names.add("error!");
            continue;
            }
            boolean allowed = false;
            if (imgType != null) {
            for (String type : contentType) {
                if (type.equalsIgnoreCase(imgType)) {
                allowed = true;
                break;
                }
            }
            }
            if (allowed) {
            BufferedInputStream bis = null;
            BufferedOutputStream bos = null;
            String fileName = null;
            try {
                URL resource = new URL(url);
                HttpURLConnection con = (HttpURLConnection) resource.openConnection();
                if (con.getResponseCode() == 200 && con.getContentType().indexOf("image") != -1
                    && con.getContentLength() != -1 && con.getContentLength() < sizeLimited) {
                fileName = UUID.randomUUID().toString() + imgType;
                File file = new File(savePath + fileName);
                if (file.createNewFile()) {
                    byte[] buffer = new byte[10 * 1024];
                    int length = -1;
                    bis = new BufferedInputStream(con.getInputStream());
                    bos = new BufferedOutputStream(new FileOutputStream(file));
                    while ((length = bis.read(buffer, 0, buffer.length)) != -1) {
                    bos.write(buffer, 0, length);
                    }
                    names.add(relativePath + "/" + fileName);
                } else {
                    throw new Exception();
                }
                } else {
                throw new Exception();
                }
            } catch (Exception e) {
                names.add("error!");
            } finally {
                try {
                if (bis != null) {
                    bis.close();
                }
                } catch (Exception e) {
                }
                try {
                if (bos != null) {
                    bos.close();
                }
                } catch (Exception e) {
                }
            }
            } else {
            names.add("error!");
            }
        }
    }
    StringBuilder sb = new StringBuilder();
    sb.append("{\"url\":\"");
    for (int i = 0; i < names.size(); i++) {
        if (i > 0) {
            sb.append("ue_separate_ue");
        }
        sb.append(names.get(i));
    }
    sb.append("\",\"tip\":\"远程图片抓取成功！\",\"srcUrl\":\"" + urls + "\"}");
    out.print(sb.toString());
%>
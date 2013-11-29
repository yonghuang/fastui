<%@page import="java.io.BufferedInputStream"%>
<%@page import="java.net.URL"%>
<%@page import="java.net.URLEncoder"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    request.setCharacterEncoding("utf-8");  //字符编码集设置
    String key = request.getParameter("searchKey");
    String type = request.getParameter("videoType");
    String url = "http://api.tudou.com/v3/gw?method=item.search&appKey=myKey&format=json&kw="
            + URLEncoder.encode(key, request.getCharacterEncoding()) + "&pageNo=1&pageSize=20&channelId="
            + URLEncoder.encode(type, request.getCharacterEncoding()) + "&inDays=7&media=v&sort=s";
    try {
        URL resource = new URL(url);
        BufferedInputStream is = new BufferedInputStream(resource.openStream());
        StringBuilder sb = new StringBuilder();
        byte[] buffer = new byte[2 * 1024];
        int length = -1;
        while ((length = is.read(buffer, 0, buffer.length)) != -1) {
            sb.append(new String(buffer, 0, length, "utf-8"));
        }
        is.close();
        out.print(sb.toString());
    } catch (Exception e) {
    }
%>

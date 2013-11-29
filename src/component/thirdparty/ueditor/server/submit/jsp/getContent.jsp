<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<%
    request.setCharacterEncoding("utf-8"); //字符编码集设置
    String content = request.getParameter("myEditor"); //文本编辑器的内容
    String content1 = request.getParameter("myEditor1"); //文本编辑器的内容
    String temp = content;
    String temp1 = content1;
    HTMLEncoder encoder = new HTMLEncoder();
    content = encoder.encode(content);
    content1 = encoder.encode(content1);
    //存入数据库或者其他操作
    //-------------

    //-------------
    //显示
    out.print("第1个编辑器的值");
    out.print(temp);
    out.print("第2个编辑器的值");
    out.print(temp1);
    out.print("<input type='button' value='点击返回' onclick='window.history.go(-1)' />");
%>
<%!final class HTMLEncoder {
    String encode(String s) {
        if (s != null) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
            case (int) '&':
            sb.append("&amp;");
            break;
            case (int) '"':
            sb.append("&quot;");
            break;
            case (int) '\'':
            sb.append("&#039;");
            break;
            case (int) '<':
            sb.append("&lt;");
            break;
            case (int) '>':
            sb.append("&gt;");
            break;
            default:
            sb.append(c);
            }
        }
        s = sb.toString();
        }
        return s;
    }
    }%>

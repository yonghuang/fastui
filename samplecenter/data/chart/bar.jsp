<%@page import="jofc2.model.elements.BarChart.Style"%>
<%@page import="jofc2.model.Chart"%>
<%@page import="jofc2.model.elements.BarChart"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Random"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	List datas = new ArrayList();

	Random random = new Random();

	// 生成一些模拟数据
	for (int i = 0; i < 9; i++) {
		datas.add(random.nextInt(10));
	}
	
	BarChart bar = new BarChart(Style.GLASS);
	bar.addValues(datas);
	
	Chart chart = new Chart("柱状图");
	
	chart.addElements(bar);
	
	out.print(chart.toDebugString());
%>
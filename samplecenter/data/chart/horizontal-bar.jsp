<%@page import="jofc2.model.axis.YAxis"%>
<%@page import="jofc2.model.axis.XAxis"%>
<%@page import="jofc2.model.Chart"%>
<%@page import="java.util.Random"%>
<%@page import="jofc2.model.elements.HorizontalBarChart"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	Chart chart = new Chart("水平柱状图");

	HorizontalBarChart bar = new HorizontalBarChart();

	Random random = new Random();

	// 生成一些模拟数据
	int left = 0, right = 0;
	bar.addBar(0, right = random.nextInt(4) + 2);
	left = right;
	bar.addBar(left, right = random.nextInt(10 - left) + left + 1);
	left = right;
	bar.addBar(left, 11);
	
	bar.setTooltip("#left# 月 至 #right# 月");

	chart.addElements(bar);

	XAxis xAxis = new XAxis();
	xAxis.setLabels(new String[] { "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" });
	xAxis.setOffset(false);
	chart.setXAxis(xAxis);

	YAxis yAxis = new YAxis();
	yAxis.setLabels(new String[] { "计划A", "计划B", "计划C" });
	yAxis.setRange(1, 3, 1);
	yAxis.setOffset(true);
	chart.setYAxis(yAxis);

	out.print(chart.toDebugString());
%>
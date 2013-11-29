<%@page import="jofc2.model.axis.XAxisLabels"%>
<%@page import="jofc2.model.axis.XAxis"%>
<%@page import="jofc2.model.axis.YAxis"%>
<%@page import="jofc2.model.elements.AreaHollowChart"%>
<%@page import="jofc2.model.Chart"%>
<%@page import="java.util.Random"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	List datas = new ArrayList();
	Random random = new Random();
	for (double i = 0.0; i < 6.2; i+= 0.2) {
		datas.add(Math.sin(i) * 1.9);
	}
	
	AreaHollowChart area = new AreaHollowChart();
	area.setWidth(2);
	area.setColour("#838A96");
	area.setFillColor("#E01B49");
	area.setFillAlpha(0.4f);
	area.addValues(datas);

	Chart chart = new Chart("区域图");
	
	chart.addElements(area);
	
	YAxis yAxis = new YAxis();
	yAxis.setRange(-2, 2, 2);
	yAxis.setOffset(false);
	
	chart.setYAxis(yAxis);
	
	XAxis xAxis = new XAxis();
	XAxisLabels xLabels = new XAxisLabels();
	xLabels.setSteps(4);
	
	List labels = new ArrayList();
	labels.add(xLabels);
	xAxis.addLabels(labels);
	
	chart.setXAxis(xAxis);
	
	out.print(chart.toDebugString());
%>
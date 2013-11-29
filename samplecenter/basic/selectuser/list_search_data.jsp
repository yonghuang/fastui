<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String param = request.getParameter("param");
	StringBuilder formdata = new StringBuilder();
	System.out.println(param);
	formdata.append("[");
	
	String[] dataList = new String[27];
	dataList[0]="{id:\"1\",name:\"丁志杰\",pid:\"3\",department:\"烟草事业部\"}";
	dataList[1]="{id:\"5\",name:\"李道广\",pid:\"3\",department:\"烟草事业部\"}";
	dataList[2]="{id:\"6\",name:\"甘国华\",pid:\"3\",department:\"烟草事业部\"}";
	dataList[3]="{id:\"7\",name:\"陈大庆\",pid:\"3\",department:\"烟草事业部\"}";
	
	dataList[4]="{id:\"2\",name:\"孙耀华\",pid:\"2\",department:\"软件营销中心\"}";
	dataList[5]="{id:\"3\",name:\"李鹏\",pid:\"2\",department:\"软件营销中心\"}";
	dataList[6]="{id:\"4\",name:\"吴泽仁\",pid:\"2\",department:\"软件营销中心\"}";
	dataList[7]="{id:\"11\",name:\"杨金林\",pid:\"2\",department:\"软件营销中心\"}";
	dataList[8]="{id:\"12\",name:\"陈志红\",pid:\"2\",department:\"软件营销中心\"}";
	dataList[9]="{id:\"13\",name:\"莫一平\",pid:\"2\",department:\"软件营销中心\"}";
	dataList[10]="{id:\"100000\",name:\"詹立明\",pid:\"2\",department:\"软件营销中心\"}";
	
	dataList[11]="{id:\"8\",name:\"邓自力\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[12]="{id:\"9\",name:\"李晓宏\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[13]="{id:\"10\",name:\"詹立明\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[14]="{id:\"11\",name:\"杨金林\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[15]="{id:\"12\",name:\"陈志红\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[16]="{id:\"13\",name:\"莫一平\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[17]="{id:\"14\",name:\"江从平\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[18]="{id:\"15\",name:\"刘颖鹏\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[19]="{id:\"16\",name:\"刘琳\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[20]="{id:\"17\",name:\"周意龙\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[21]="{id:\"18\",name:\"黄德湘\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[22]="{id:\"19\",name:\"刘若\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[23]="{id:\"20\",name:\"王昊辰\",pid:\"4\",department:\"数据业务中心\"}";
	dataList[24]="{id:\"21\",name:\"刘小姣\",pid:\"4\",department:\"数据业务中心\"}";
	
	dataList[25]="{id:\"22\",name:\"张三\",pid:\"5\",department:\"管理业务中心\"}";
	dataList[26]="{id:\"23\",name:\"李四\",pid:\"5\",department:\"管理业务中心\"}";
	
	for(int i = 0;i<27;i++){
	    if(dataList[i].indexOf(param)!=-1){
	        formdata.append(dataList[i]+",");
        }	    
	}
	formdata.deleteCharAt(formdata.length()-1);
	
	formdata.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
	
	
%>


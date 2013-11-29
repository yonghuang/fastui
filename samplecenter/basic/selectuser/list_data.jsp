<%@ page language="java" import="java.io.PrintWriter"
	pageEncoding="utf-8"%>
<%
	String idArr = request.getParameter("pid");
	idArr = idArr.replace("[","");
	idArr = idArr.replace("]","");
	idArr = idArr.replace("\"","");
	String[] id = idArr.split(",");
	StringBuilder formdata = new StringBuilder();
	formdata.append("[");
	for(int i=0;i<id.length;i++){
	    if(id[i].equals("2")){
	        formdata.append("{id:\"2\",name:\"孙耀华\",pid:\"2\"},");
			formdata.append("{id:\"3\",name:\"李鹏\",pid:\"2\"},");
			formdata.append("{id:\"4\",name:\"吴泽仁\",pid:\"2\"},");
			formdata.append("{id:\"100000\",name:\"詹立明\",pid:\"2\"},");
			formdata.append("{id:\"11\",name:\"杨金林\",pid:\"2\"},");
			formdata.append("{id:\"12\",name:\"陈志红\",pid:\"2\"},");
			formdata.append("{id:\"13\",name:\"莫一平\",pid:\"2\"},");
		}else if(id[i].equals("3")){
		    formdata.append("{id:\"1\",name:\"丁志杰\",pid:\"3\"},");
			formdata.append("{id:\"5\",name:\"李道广\",pid:\"3\"},");
			formdata.append("{id:\"6\",name:\"甘国华\",pid:\"3\"},");
			formdata.append("{id:\"7\",name:\"陈大庆\",pid:\"3\"},");
		}else if(id[i].equals("4")){
		    formdata.append("{id:\"8\",name:\"邓自力\",pid:\"4\"},");
			formdata.append("{id:\"9\",name:\"李晓宏\",pid:\"4\"},");
			formdata.append("{id:\"10\",name:\"詹立明\",pid:\"4\"},");
			formdata.append("{id:\"11\",name:\"杨金林\",pid:\"4\"},");
			formdata.append("{id:\"12\",name:\"陈志红\",pid:\"4\"},");
			formdata.append("{id:\"13\",name:\"莫一平\",pid:\"4\"},");
			formdata.append("{id:\"14\",name:\"江从平\",pid:\"4\"},");
			formdata.append("{id:\"15\",name:\"刘颖鹏\",pid:\"4\"},");
			formdata.append("{id:\"16\",name:\"刘琳\",pid:\"4\"},");
			formdata.append("{id:\"17\",name:\"周意龙\",pid:\"4\"},");
			formdata.append("{id:\"18\",name:\"黄德湘\",pid:\"4\"},");
			formdata.append("{id:\"19\",name:\"刘若\",pid:\"4\"},");
			formdata.append("{id:\"20\",name:\"王昊辰\",pid:\"4\"},");
			formdata.append("{id:\"21\",name:\"刘小姣\",pid:\"4\"},");
		}else if(id[i].equals("5")){
		    formdata.append("{id:\"22\",name:\"张三\",pid:\"5\"},");
		}else if(id[i].equals("6")){
		    for(int j=5500;j<6000;j++){
	            formdata.append("{id:\""+j+"\",name:\""+j+"\",pid:\"6\"},");
	        }
		}else if(id[i].equals("9")){
		    for(int j=101;j<300;j++){
	            formdata.append("{id:\""+j+"\",name:\""+j+"\",pid:\"9\"},");
	        }
		}else if(id[i].equals("8")){
		    for(int j=301;j<5300;j++){
	            formdata.append("{id:\""+j+"\",name:\""+j+"\",pid:\"8\"},");
	        }
		}else if(id[i].equals("101")){
	            formdata.append("{id:\"3\",name:\"李鹏\",pid:\"101\"},");
		}else if(id[i].equals("102")){
	            formdata.append("{id:\"4\",name:\"吴泽仁\",pid:\"102\"},");
		}else if(id[i].equals("103")){
		    formdata.append("{id:\"11\",name:\"杨金林\",pid:\"103\"},");
			formdata.append("{id:\"12\",name:\"陈志红\",pid:\"103\"},");
			formdata.append("{id:\"13\",name:\"莫一平\",pid:\"103\"},");
		}
	}
	
	formdata.append("]");
	PrintWriter pw = response.getWriter();
	pw.print(formdata.toString());
%>


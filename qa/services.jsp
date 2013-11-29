<%@page import="java.io.RandomAccessFile"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.Date"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.OutputStreamWriter"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.File"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String formType = request.getParameter("formtype");

	Map<String, String> data = new HashMap<String, String>();

	File dataFile = null;

	String fileName = null;

	String crlf = System.getProperty("line.separator");

	String path = "qa/";
	
	File logFile = new File(request.getRealPath(path + "log.txt"));

	String version = null;

	String sequence = null;

	String summary = null;

	if ("bugform".equals(formType)) {

		data.put("bugno", sequence = request.getParameter("bugno"));
		data.put("version", request.getParameter("version"));
		data.put("cause", request.getParameter("cause"));
		data.put("browser", request.getParameter("browser"));
		data.put("solution", request.getParameter("solution"));
		data.put("test", request.getParameter("test"));
		data.put("coder", request.getParameter("coder"));
		data.put("personLiable", request.getParameter("personLiable"));
		data.put("fixedVersion",
				version = request.getParameter("fixedVersion"));
		data.put("bugsynopsis",
				summary = request.getParameter("bugsynopsis"));

		fileName = "qa-bug.json";

		dataFile = new File(request.getRealPath(path + fileName));

	} else {

		data.put("impno", sequence = request.getParameter("impno"));
		data.put("project", request.getParameter("project"));
		data.put("content", request.getParameter("content"));
		data.put("type", request.getParameter("type"));
		data.put("design", request.getParameter("design"));
		data.put("test", request.getParameter("i_test"));
		data.put("coder", request.getParameter("i_coder"));
		data.put("personLiable", request.getParameter("i_personLiable"));
		data.put("fixedVersion",
				version = request.getParameter("i_fixedVersion"));
		data.put("impsynopsis",
				summary = request.getParameter("impsynopsis"));

		fileName = "qa-improvements.json";

		dataFile = new File(request.getRealPath(path + fileName));

	}

	summary = "[" + sequence + "]" + summary.replace("\n", "；");

	data.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
			.format(new Date()));
			
	if (!logFile.isFile()) {
		logFile.createNewFile();
	}
		
	PrintWriter logger = new PrintWriter(new OutputStreamWriter(
			new FileOutputStream(logFile, true), "UTF-8"));

	try {

		if (!dataFile.isFile()) {
			dataFile.createNewFile();
		}
		
		File tempFile = new File(request.getRealPath(path
				+ System.currentTimeMillis()));

		tempFile.createNewFile();

		PrintWriter writer = new PrintWriter(new OutputStreamWriter(
				new FileOutputStream(tempFile, true), "UTF-8"));

		writer.println("[");

		writer.println("\t{");

		int i = 0, len = data.size();

		for (String key : data.keySet()) {
			String value = data.get(key);
			writer.println("\t\t\""
					+ key
					+ "\": \""
					+ (value == null ? "" : value.replace("\"",
							"&ldquo;").replace("\n", "<br/>")) + "\""
					+ (++i == len ? "" : ","));
		}

		writer.print("\t}");
		writer.flush();

		BufferedReader reader = new BufferedReader(
				new InputStreamReader(new FileInputStream(dataFile),
						"UTF-8"));

		String line = null;

		boolean isEmpty = true;

		while ((line = reader.readLine()) != null
				&& !"".equals(line = line.trim())) {
			isEmpty = false;
			if ("[".equals(line)) {
				continue;
			} else if ("{".equals(line)) {
				writer.println(", {");
			} else if ("}".equals(line)) {
				writer.print("\t}");
			} else if (line.startsWith("}")) {
				writer.println("\t" + line);
			} else if ("]".equals(line)) {
				writer.println(crlf + "]");
			} else {
				writer.println("\t\t" + line);
			}
		}

		if (isEmpty) {
			writer.println(crlf + "]");
		}

		reader.close();

		writer.flush();
		writer.close();

		dataFile.delete();
		tempFile.renameTo(dataFile);

		dataFile = new File(request.getRealPath(path + "readme.txt"));

		if (!dataFile.isFile()) {
			dataFile.createNewFile();
		}

		RandomAccessFile accesser = new RandomAccessFile(dataFile, "rw");
		tempFile = new File(request.getRealPath(path
				+ System.currentTimeMillis() + "r"));
		FileOutputStream fos = new FileOutputStream(tempFile, true);

		long pointer, beginPointer;
		String trimed = null;
		int num = 0;
		int length = 0;
		boolean append = false;
		boolean found = false;
		boolean marked = false;
		byte[] buffer = new byte[1024 * 2];

		while ((length = accesser.read(buffer)) != -1) {
			fos.write(buffer, 0, length);
		}
		fos.close();

		accesser.seek(pointer = beginPointer = 3);

		while ((line = accesser.readLine()) != null) {
			if ((trimed = line.trim()).startsWith("*")) {
				if (trimed.startsWith("*" + version)) {
					found = true;
				} else if (found) {
					marked = trimed.startsWith("bugform"
							.equals(formType) ? "*Bug"
							: "*Improvements");
				} else {
					break;
				}
			} else if (marked) {
				if ("".equals(trimed)) {
					accesser.seek(pointer);
					accesser.write((++num + "." + summary + crlf)
							.getBytes("UTF-8"));
					append = true;
					break;
				} else {
					num = Integer.parseInt(trimed.substring(0,
							trimed.indexOf(".")));
				}
			}
			pointer = accesser.getFilePointer();
		}

		if (!found) {
			accesser.seek(beginPointer);
			accesser.write(("*" + version + crlf).getBytes("UTF-8"));
			accesser.write(("*Bug Fixed" + crlf).getBytes("UTF-8"));
			if ("bugform".equals(formType)) {
				accesser.write(("1." + summary + crlf)
						.getBytes("UTF-8"));
			}
			accesser.write(crlf.getBytes("UTF-8"));
			accesser.write(("*Improvements" + crlf).getBytes("UTF-8"));
			if (!"bugform".equals(formType)) {
				accesser.write(("1." + summary + crlf)
						.getBytes("UTF-8"));
			}
			accesser.write((crlf + crlf).getBytes("UTF-8"));
			pointer = beginPointer;
			append = true;
		}

		if (append) {
			RandomAccessFile tempAccesser = new RandomAccessFile(
					tempFile, "r");
			tempAccesser.seek(pointer);
			while ((length = tempAccesser.read(buffer)) != -1) {
				accesser.write(buffer, 0, length);
			}
			tempAccesser.close();
		}

		accesser.close();
		tempFile.delete();

		out.print("Done!");
		
		logger.println(data.get("datetime") + " ok");

	} catch (Throwable e) {

		out.print("Error!");
		System.out.println(e.getMessage());
		logger.println(data.get("datetime") + " error! [" + e.getMessage() + "]");
		
	}
	
	logger.close();
	
%>
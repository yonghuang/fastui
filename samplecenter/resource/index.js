var displayExample = false, tabs, initCode = false, initData = false, exampleUrl, dataUrl,apiUrl,winHeight,isCodeView;

fastDev(function() {
	var winWidth = fastDev(window).width();
	winHeight = fastDev(window).height();
	fastDev(".ui-layout").css({
		width : winWidth,
		height : winHeight - 56
	});
	fastDev(".ui-layout-center").css("width", winWidth - (winWidth*0.19));
	
	fastDev(".ui-layout-arrow-left").bind("click",function(event){
		if(/left/.test(event.target.className)){
			fastDev(".ui-layout-left").animate({width:"0px"});
			fastDev(".ui-layout-handle-left").animate({left:"0px"});
			fastDev(".ui-layout-center").animate({left:winWidth*0.005,width:winWidth-(winWidth*0.005)-2});
			tabs && tabs.resize(winWidth-(winWidth*0.005)-2+"px");
		}else{
			fastDev(".ui-layout-left").animate({width:winWidth*0.185});
			fastDev(".ui-layout-handle-left").animate({left:winWidth*0.185});
			fastDev(".ui-layout-center").animate({left:winWidth*0.19,width:winWidth - (winWidth*0.19)});
			tabs && tabs.resize(winWidth - (winWidth*0.19)+"px");
		}
		fastDev(event.target).toggleClass("ui-layout-arrow-left,ui-layout-arrow-right");
	});
	fastDev(".ui-layout-show-down").bind("click",function(event){
		if(/down/.test(event.target.className)){
			fastDev("#content").animate({height:winHeight-80});
			fastDev("#description").animate({height:"8px"});
			if(isCodeView){
				fastDev(".cm-s-default").height(winHeight-160);
			}else{
				fastDev(".cm-s-default").height(winHeight-115);
			}
			tabs && tabs.resize(null,winHeight-90+"px");
		}else{
			fastDev("#content").animate({height:(winHeight-75)*0.75});
			fastDev("#description").animate({height:(winHeight-75)*0.23+15});
			if(isCodeView){
				fastDev(".cm-s-default").height(winHeight-288);
			}else{
				fastDev(".cm-s-default").height(winHeight-248);
			}
			tabs && tabs.resize(null,(winHeight-75)*0.75+"px");
		}
		fastDev(event.target).toggleClass("ui-layout-show-down,ui-layout-show-up");
	});
});

function openExample(event,id) {
	var node = this.getNodeByid(id);
	exampleUrl = node["exampleUrl"] || "";
	dataUrl = node["dataUrl"] || "";
	apiUrl ="doc/index.html#!/"+ node["apiUrl"];
	if(!exampleUrl){
		return;
	}
	
	if(!displayExample) {
		initExample();
	}
	tabs.setUrlByTitle("示例", exampleUrl);
	tabs.setActiveTabByTitle("示例");
	fastDev(".CodeMirror").remove();
	initCode = false;
	initData = false;

	fastDev(function() {
		if(exampleUrl) {
			fastDev.queue.add({
				url : exampleUrl,
				complete : readCode
			});
		}
		if(dataUrl) {
			fastDev.queue.add({
				url : dataUrl,
				complete : readData
			});
		}else{
			fastDev("#data").prop("value","无数据结构");
		}
	});
}

function initExample() {
	$("#indexPage").css("display", "none");
	$("#api").css("display","none");
	$("#examplePage").removeCss("display", "block");
	displayExample = true;
	tabs = fastDev.create("Tabs", {
		onTabClick : tabClick,
		container : "content",
		items : [{
			title : "示例"
		}, {
			title : "代码",
			type : "div",
			content : fastDev('<div style="margin:10px"><input itype="Button" text="运行代码" onclick="runCode()"></input></div><textarea id="code" name="code"></textarea>')
		}, {
			title : "数据结构",
			type : "div",
			content : fastDev('<textarea id="data" name="data"></textarea>')
		}],
		tools : [{
			text : "查看API",
			onclick : runApi
		}]
	});
	fastDev.Core.ControlBus.compile();
}

function readData(rsp) {
	var data = rsp.text;
	fastDev("#data").prop("value", data);
}

function readCode(rsp) {
	var code = rsp.text;
	var description;
	if(/<title>([\w\W]*)<\/title>/.exec(code)) {
		description = "<h3>示例说明：</h3>" + RegExp.$1;
	}
	fastDev("#code").prop("value", code);
	if(/^<[\w\W]*>$/.test(description)) {
		fastDev("#des_content").empty().append(fastDev(description));
	} else {
		fastDev("#des_content").empty().addText(description);
	}
}

function runApi(){
	window.open(apiUrl);
}

function tabClick(event,title) {
	if(initCode === false && title === "代码") {
		codeEditor = CodeMirror.fromTextArea(document.getElementById("code"), {
			mode : "text/html",
			tabMode : "indent",
			height : "500px",
			width : "100%"
		});
		initCode = true;
	}
	
	if(initData === false && title === "数据结构") {
		if(/json/.test(dataUrl)) {
			CodeMirror.fromTextArea(document.getElementById("data"), {
				mode : "text/typescript",
				tabMode : "indent",
				height : "500px",
				width : "100%"
			});
		} else {
			CodeMirror.fromTextArea(document.getElementById("data"), {
				mode : "text/x-java",
				tabMode : "indent",
				height : "500px",
				width : "100%"
			});
		}
		initData = true;
	}
	isCodeView = (title === "代码");
	if(fastDev(".ui-layout-show-down").isEmpty()){
		if(isCodeView){
			fastDev(".cm-s-default").height(winHeight-160);
		}else{
			fastDev(".cm-s-default").height(winHeight-110);
		}
	}else{
		if(isCodeView){
			fastDev(".cm-s-default").height(winHeight-288);
		}else{
			fastDev(".cm-s-default").height(winHeight-248);
		}
		
	}
	
}

function runCode() {
	var text = codeEditor.getValue();
	var host = /(.*8888\/)/.exec(window.location.href)[1];
	text = text.replace(/<script.*fastDev-import.*<\/script>/, "<script src=" + host + "src/fastDev-import.js" + "></script>").replace(/((?:\.\.\/)+data\/)/g, "data/").replace(/<script.*parsepath.*<\/script>/, "<script src=" + host + "samplecenter/resource/parsepath.js" + "></script>");
	var winname = window.open("example.html", "_blank", '');
	winname.document.open('text/html', 'replace');
	winname.document.write(text);
	winname.document.close();
}

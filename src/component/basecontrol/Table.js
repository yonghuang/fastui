(function() {
	
	talkweb.BaseControl.Table = function(settings){
		return fastDev.create("talkweb.BaseControl.Table.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Table.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			rows : 0,
			cols : 0,
			value : null,
			tdMode : "talkweb.BaseControl.Td.Class",
			thMode : "talkweb.BaseControl.Th.Class",
			theadMode : "talkweb.BaseControl.Thead.Class",
			className : "table",
			thList : null,
			thead : null,
			tbody : null
		},
		construct : function(options) {
			var table = this.create("table");
			this.storage(table);
		},
		init : function(options) {
			var newOptions = {};
			// init thead
			if(options.thList) {
				newOptions.thead = this.createThead(options.thList);
			}
			// init tbody
			newOptions.tbody = this.createTbody(options);
			// init tfoot
			this.setOptions(newOptions);
			this.setValue(options.value);
		},
		setValue : function(value) {
			var options = this.getOptions(), cols, i = 0, j, tr, trClass, v, td;
			if(!options.tbody){
				return;
			}
			if( value instanceof Array) {
				while(value[0]) {
					cols = value.shift(), tr = this.getRow(i), trClass = i % 2 == 0 ? "none" : "t1", j = 0;
					(tr && tr.setClass(trClass)) || ( tr = talkweb.BaseControl.Tr({
						container : options.tbody,
						className : trClass
					}));
					if( cols instanceof Array) {
						while(cols[0] === "" || cols[0] === 0 || cols[0]) {
							v = cols.shift(), td = tr.getCell(j);
							if(td) {
								fastDev.create(options.tdMode).reConstruct(td).setValue(v);
							} else {
								fastDev.create(options.tdMode,{
									container : tr,
									value : v
								});
							}
							j += 1;
						}
					}
					i += 1;
				}
			}
		},
		getRow : function(index) {
			var tr = this.find("tbody>tr:eq("+index+")");
			return talkweb.BaseControl.Tr().reConstruct(tr);
		},
		setTitle : function(thList) {
		    //console.log(options.thead);
			var options = this.getOptions();
			var thead = (options.thead && options.thead.setValue(thList)) || this.createThead(thList);
			//console.log(thead);
			this.setOptions({
				thead : thead
			});
		},
		createTbody : function(options) {
			var tbody = talkweb.BaseControl.Tbody({
				saveInstance : true,
				container : this
			});
			for(var i = 0; i < options.rows; i += 1) {
				var trClass = i % 2 == 0 ? "" : "t1";
				var tr = talkweb.BaseControl.Tr({
					container : tbody,
					className : trClass
				});
				for(var j = 0; j < options.cols; j += 1) {
					fastDev.create(options.tdMode,{
						container : tr
					});
				}
			}
			return tbody;
		},
		createThead : function(thList) {
			var options = this.getOptions();
			//console.log(options.theadMode);
			//console.log(options.thMode);
			return fastDev.create(options.theadMode,{
			//return fastDev.create("talkweb.BaseControl.Thead.Class",{
				container : this,
				value : thList,
				thMode : options.thMode
			});
		},
		cleanData : function() {
			var i = 0, tr = this.getRow(i);
			while(tr && tr[0]) {
				var j = 0;
				var td = tr.getCell(j);
				while(td) {
					td.innerHTML = "";
					td = tr.getCell(j += 1);
				}
				tr = this.getRow(i += 1);
			}
		},
		setCellStyle : function(data) {
			for(var i in data ) {
				var trId = data[i];
				for(var j in trId ) {
					var tr = this.getRow(j);
					for(var k in trId[j] ) {
						td = tr.getCell(k);
						td && (td.className = trId[j][k]);
					}
				}
			}
		},
		setColStyle : function(data) {
			//console.log("data",data);
			var i = 0, tr = this.getRow(i);
			while(tr && tr[0]) {
				var j = 0;
				var td = tr.getCell(j);
				while(td) {
					data[j] && (td.className = data[j]);
					td = tr.getCell(j += 1);
				}
				tr = this.getRow(i += 1);
			}
		},
		setTheadStyle : function(data) {
			var tr = this.getOptions().thead.getRow();
			for(var i in data ) {
				tr.getTh(i).className = data[i];
			}
		},
		hideColumn : function(index) {
			var options = this.getOptions(), tr, td, th, i = 0;
			tr = options.thead.getRow();
			tr[0] && ( th = tr.getTh(index));
			th && ( th = talkweb.BaseControl.Th({}, false).reConstruct(th));
			//th.hide();
			th && th[0] && (th[0].className = "hide");
			tr = this.getRow(i);
			while(tr[0]) {
				tr = this.getRow(i);
				if(tr[0]) {
					td = tr.getCell(index);
					td && ( td = options.tdMode({}, false).reConstruct(td));
					//td.hide();
					td && (td[0].className = "hide");
					//td.style.display = "none";
					i++;
				}
			}
			return this;
		},
		showColumn : function(index) {
			var options = this.getOptions(), tr, td, th, i = 0;
			tr = options.thead.getRow();
			tr[0] && ( th = tr.getTh(index));
			th && ( th = talkweb.BaseControl.Th({}, false).reConstruct(th));
			th[0].className = "show";
			tr = this.getRow(i);
			while(tr[0]) {
				tr = this.getRow(i);
				if(tr[0]) {
					td = tr.getCell(index);
					td && ( td = options.tdMode({}, false).reConstruct(td));
					td[0].className = "show";
					i++;
				}
			}
			return this;
		}
	});
	
	talkweb.BaseControl.Thead = function(settings){
		return fastDev.create("talkweb.BaseControl.Thead.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Thead.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			thMode : null,
			items : null
		},
		construct : function() {
			var thead = this.create("thead");
			this.storage(thead);
		},
		setID : function(id) {
			id && talkweb.BaseControl.Thead.Class.superClass.setID.call(this, id);
		},
		init : function(options) {
			options.items && this.setValue(options.items);
		},
		setValue : function(value) {
			var options = this.getOptions();
			this.reset();
			var tr = talkweb.BaseControl.Tr({
				container : this
			});
			//console.log("value",value);
			for(var i = 0; i < value.length; i += 1) {
				fastDev.create(options.thMode,{
					container : tr,
					value : value[i]
				});
			}
		},
		reset : function() {
			var childList = this[0].getElementsByTagName("*");
			for(var i = 0; i < childList.length; i += 1) {
				this[0].removeChild(childList[i]);
			}
		},
		getRow : function() {
			var tr = this.find("tr")[0];
			return fastDev.create("talkweb.BaseControl.Tr.Class").reConstruct(tr);
		}
	});
	
	talkweb.BaseControl.Tbody = function(settings){
		return fastDev.create("talkweb.BaseControl.Tbody.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Tbody.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		construct : function() {
			var tbody = this.create("tbody");
			this.storage(tbody);
		}
	});

	talkweb.BaseControl.Tfoot = function(settings){
		return fastDev.create("talkweb.BaseControl.Tfoot.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Tfoot.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		construct : function() {
			var tfoot = this.create("tfoot");
			this.storage(tfoot);
		}
	});
	
	talkweb.BaseControl.Tr = function(settings){
		return fastDev.create("talkweb.BaseControl.Tr.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Tr.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		construct : function() {
			var tr = this.create("tr");
			this.storage(tr);
		},
		getCell : function(index) {
			var td = this.find("td:eq("+index+")");
			return td?td[0]:null;
		},
		getTh : function(index) {
			var th = this.find("th")[index];
			return th;
		}
	});

	talkweb.BaseControl.Td = function(settings){
		return fastDev.create("talkweb.BaseControl.Td.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Td.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			rowSpan : 0,
			colSpan : 0,
			value : ""
		},
		_global : {
			textNode : null
		},
		construct : function(param) {
			var td = this.create("td");
			this.storage(td);
		},
		reConstruct : function(obj, reClass) {
			this.reConstruct_TextNode.call(this, obj);
			return talkweb.BaseControl.Td.Class.superClass.reConstruct.call(this, obj);
		},
		init : function(options) {
			this.setRowSpan(options.rowSpan);
			this.setColSpan(options.colSpan);
		},
		setRowSpan : function(rowSpan) {
			rowSpan && this.attr("rowspan", rowSpan);
		},
		setColSpan : function(colSpan) {
			colSpan && this.attr("colSpan", colSpan);
		},
		setValue : function(value) {
			this.setText(value);
			this.setTitle && this.setTitle(value);
		},
		getValue : function() {
			return this.getText();
		},
		setTitle : function(text) {
			this.attr("title", text);
		},
		setClassName : function(text) {
			this.attr("class", text);
		}
	});

	talkweb.BaseControl.Th = function(settings){
		return fastDev.create("talkweb.BaseControl.Th.Class",settings);
	};

	fastDev.define("talkweb.BaseControl.Th.Class", {
		extend : "talkweb.BaseControl.SimpleControl",
		_options : {
			value : null
		},
		_global : {
			textNode : null
		},
		construct : function(param) {
			var th = this.create("th");
			this.storage(th);
		},
		setValue : function(value) {
			this.setText(value);
		},
		getValue : function() {
			this.getText();
		},
		reConstruct : function(obj) {
			this.reConstruct_TextNode.call(this, obj);
			return talkweb.BaseControl.Th.Class.superClass.reConstruct.call(this, obj);
		}
	})

})()
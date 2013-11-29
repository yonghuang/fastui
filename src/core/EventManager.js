/**
 * @class fastDev.Core.EventManager 
 * @singleton
 * 事件管理器，当前页面所有通过控件库Api绑定的事件都会在这里进行记录并管理
 */

fastDev.Core.EventManager = {
	_handleMap : {},
	_eventMap : {},
	/**
	 * 
	 * @param {Object} handle
	 * @param {Object} context
	 * @private
	 */
	createHandle : function(handle, context) {
		var event_handle = function(event) {
			event = event || window.event;
			if(event.type) {
				if(!event.target){
					event.target =  event.srcElement || event.toElement;
				}
				if(event.pageX || event.offsetX){
					var offset = fastDev.Dom.offset(event.target);
					event.pageX = offset.left + event.offsetX;
					event.pageY = offset.top + event.offsetY;
				}
			}
			return event_handle.handle.call(context, event);
		};
		event_handle.handle = handle;
		return event_handle;
	},
	/**
	 * 
	 * @param {Object} elem
	 * @param {Object} type
	 * @param {Object} handle
	 */
	bindEvent : function(elem, type, handle) {
		var eventManager = fastDev.Core.EventManager, 
		// 事件id
		eventkey = fastDev.Dom.attr(elem, "eventkey") || fastDev.getID(),
		// 保存原始句柄
		primary = handle,
		// 事件句柄ID
		handleID = fastDev.getID(),
		// 获取句柄存储对象
		handleMap = eventManager.getHandleMap(),
		// 获取事件信息存储对象
		eventMap = eventManager.getEventMap(), eventInfo = eventMap[eventkey] = eventMap[eventkey] || {},
		// 获取当前事件类型信息
		eventType = eventInfo[type] = eventInfo[type] || {};

		handle = eventManager.createHandle(handle, elem);

		handleMap[handleID] = handle;

		eventType[handleID] = primary;

		fastDev.Dom.attr(elem, "eventkey", eventkey);

		fastDev.Event.bind(elem, type, handle);

	},
	/**
	 * 
	 * @param {Object} elem
	 * @param {Object} type
	 * @param {Object} handle
	 */
	unbind : function(elem, type, handle) {
		var eventManager = fastDev.Core.EventManager, eventkey = fastDev.Dom.attr(elem, "eventkey");
		if(!eventkey) {
			return;
		}

		var eventMap = eventManager.getEventMap(), handleMap = eventManager.getHandleMap(),
		// 删除事件信息
		handleInfoList = eventManager.removeEventInfo(eventkey, type, handle);
		if(!fastDev.isValid(handleInfoList)){
			return ;
		}
		while(handleInfoList[0]) {
			var handleInfo = handleInfoList.shift(), handleID = handleInfo.key;
			// 取消绑定
			handle = handleMap[handleID];
			fastDev.Event.unbind(elem, handleInfo.type, handle);
			// 删除句柄
			handleMap[handleID] = null;

			handle = null;
			handleInfo = null;
			delete handleMap[handleID];

		}
	},
	/**
	 * 获取函数句柄存储对象
	 * @return {JsonObject}
	 */
	getHandleMap : function() {
		return this._handleMap;
	},
	/**
	 * 获取事件信息存储对象
	 * @return {JsonObject}
	 */
	getEventMap : function() {
		return this._eventMap;
	},
	/**
	 * 删除事件信息
	 * @param {String} eventkey 事件信息主键
	 * @param {String} type 事件类型
	 * @param {Function} handle 函数句柄
	 * @param {eventInfo} eventInfo 事件信息
	 */
	removeEventInfo : function(eventkey, type, handle, eventInfo) {
		var handleInfoList = [],eventMap = this._eventMap;

		eventInfo = eventInfo || eventMap[eventkey];

		if(!eventInfo) {
			return [];
		}

		if(fastDev.isString(type)) {
			var eventType = eventInfo[type];

			if(!eventType) {
				return;
			}

			var removeAll = !fastDev.isFunction(handle);

			for(var key in eventType) {
				if(removeAll || eventType[key] === handle) {
					eventType[key] = null;
					delete eventType[key];
					handleInfoList.push({
						type : type,
						key : key
					});
					break;
				}

			}

		} else {
			for(var p in eventInfo) {

				var handleInfo = this.removeEventInfo(null, p, null, eventInfo);
				
				eventInfo[p] = null;
				delete eventInfo[p];
				
				handleInfoList = handleInfoList.concat(handleInfo);
			}
			
			eventMap[eventkey] = null;
			delete eventMap[eventkey];
		}

		return handleInfoList;
	}
};

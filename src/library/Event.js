/**
 * 事件操作类，主要处理各种浏览器之间事件操作的兼容性问题
 * @class fastDev.Event
 * @author 袁刚
 * @singleton
 */
fastDev.Event = {
	special : {
		beforeunload:{
			bind : function(handle){
				if ( fastDev.isWindow( this ) ) {
					this.onbeforeunload = handle;
				}
			},
			unbind : function(handle){
				if ( this.onbeforeunload === handle ) {
					this.onbeforeunload = null;
				}
			}
		},
		selectstart : {
			bind : function(handle){
				this.onselectstart = handle;
			},
			unbind : function(handle){
				if ( this.onselectstart === handle ) {
					this.onselectstart = null;
				}
			}
		}
	},
	/**
	 * 绑定事件
	 * @param {Element} elem Dom元素
	 * @param {String} type 事件类型
	 * @param {Function} handle 事件句柄
	 */
	bind : function(elem, type, handle) {
		if(!fastDev.isFunction(handle)) {
			return;
		}
		
		var special = this.special[type] || {};
		
		if( !special.bind || special.bind.call( elem, handle ) === false){
			if(elem.addEventListener) {
				elem.addEventListener(type, handle, false);
			} else if(elem.attachEvent) {
				elem.attachEvent("on" + type, handle);
			}
		}
		
	},
	/**
	 * 删除绑定事件
	 * @param {Element} elem Dom元素
	 * @param {String} type 事件类型
	 * @param {Function} handle 事件句柄
	 */
	unbind : function(elem, type, handle) {
		if(!fastDev.isFunction(handle)) {
			return;
		}
		
		var special = this.special[type] || {};
		
		if( !special.unbind || special.unbind.call( elem, handle ) === false){
			if(elem.removeEventListener) {
				elem.removeEventListener(type, handle, false);
			} else if(elem.detachEvent) {
				elem.detachEvent("on" + type, handle);
			}
		}
	},
	/**
	 * 停止事件传播
	 * @param {Event} event 事件对象
	 */
	stopBubble : function(event) {
		if(!fastDev.isValid(event)){
			return;
		}
		if(event.stopPropagation) {
			event.stopPropagation();
			event.preventDefault();
		} else {
			event.cancelBubble = true;
			event.returnValue = false;
		}
	}
};

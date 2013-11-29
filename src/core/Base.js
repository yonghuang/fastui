fastDev.apply({
	/**
	 * 类定义方法
	 * @param {String} classname 完整的类名(如:fastDev.Ui.DataGrid)
	 * @param {JsonObject} config 类配置信息
	 * @member fastDev
	 */
	define : function(classname, config) {
		// 检查类名是否完整
		if(/([\w\.]*)\.([\w]*)/.exec(classname) === null) {
			return;
		}
		var Class, supClass, prop,
		// 根据类路径建立所属命名空间
		space = fastDev.namespace(RegExp.$1);
		// 解析继承关系
		Class = fastDev.parseExtend(config.extend);
		// 注册类
		fastDev.Core.ClassManager.regClass(classname, Class, config.alias);

		// 继承父类配置项及全局配置
		fastDev.each("_options _global".split(" "), function(i, name) {
			prop = ( prop = Class[name]) ? fastDev.clone(prop) : {};
			Class[name] = fastDev.apply(prop, config[name]);
			delete config[name];
		});

		// 扩展类属性以及方法
		fastDev.apply(Class, config);

		// 将当前类注册至命名空间中
		space[RegExp.$2] = Class;
	},
	/**
	 * 解析继承关系
	 * @private
	 */
	parseExtend : function(supClass) {
		var Class;
		if(supClass) {
			supClass = fastDev.Core.ClassManager.getClass(supClass);
			Class = fastDev.extend(supClass);
		} else {
			Class = {};
		}
		return Class;
	},
	/**
	 * 类实例创建
	 * @param {String} className 类名
	 * @param {Object} settings 示例配置信息
	 * @return {Object}
	 * @member fastDev
	 */
	create : function(className, settings) {
		var instance, options, global,
		// 解析类名获得对应的类
		Class = fastDev.Core.ClassManager.getClass(className);

		try {
			if(!Class.prototype) {
				instance = fastDev.clone(Class),
				// 继承父类配置
				options = fastDev.clone(instance._options),
				// 继承父类全局空间
				global = fastDev.clone(instance._global);
				// 读入用户配置、全局配置以及默认配置
				instance._options = fastDev.apply(options, (window.ui_global_config && window.ui_global_config[className]), settings);
				instance._global = global;
				// 执行实例初始化
				fastDev.constructInstance(instance, !Class.extend);
			} else {
				instance = fastDev.instantiation(Class, settings || {});
			}
			return instance;
		} catch(e) {
			if(!Class) {
				fastDev.addError("fastDev","create","类[" + className + "]不存在，无法创建实例");
			} else {
				fastDev.addError("fastDev","create", e.message);
			}
		} 
	},
	/**
	 * 按自定义流程执行类实例化
	 * @param {Object} Class 类
	 * @param {JsonObject} option 实例化参数
	 * @member fastDev
	 * @private
	 */
	instantiation : function(Class, settings) {
		return Class.constructor(settings);
	},
	/**
	 * 按内部流程执行类实例化
	 * @param {Object} instance 实例
	 * @return {Object}
	 * @member fastDev
	 * @private
	 */
	constructInstance : function(instance, nobase) {
		var options = instance._options, global = instance._global, name,
		// 如当前实例所属类没有父类，则走简易流程提升性能
		method = nobase ? fastDev.execMethod : fastDev.execAllSuperClassMethod;
		fastDev.each("ready construct init".split(" "), function(index, name) {
			try {
				return method(instance, name, options, global);
			} catch(e) {
				fastDev.addError(instance.alias, name, "控件初始化逻辑代码执行错误，请联系开发人员", e.message);
			}
		});
		return instance;
	},
	/**
	 * 类继承方法
	 * @param {Object} supClass 父类
	 * @return {Object}
	 * @member fastDev
	 */
	extend : function(supClass) {
		var subClass = fastDev.clone(supClass);
		subClass.superClass = supClass;
		return subClass;
	},
	/**
	 * 从顶层父类开始依次执行指定方法
	 * @param {Object} context 实例对象
	 * @param {String} methodName 方法名称
	 * @member fastDev
	 * @private
	 */
	execAllSuperClassMethod : function(context, methodName) {
		var currContext = context,
		// 获取当前类别名 
		alias = context.alias,
		// 获取父类作用域
		superContext = context.superClass,
		// 构建流程方法执行队列,将当前作用域的流程方法添加至队列
		execQueue = [context[methodName]],
		// 缓存流程方法参数
		options = context._options, global = context._global,
		// 生成流程方法的回调方法名称
		handleName = fastDev.Util.StringUtil.capitalize(methodName);
		// 递归查找所有父类并把流程方法添加至队列
		while(superContext) {
			if(superContext[methodName] && context[methodName] !== superContext[methodName]) {
				execQueue.splice(0, 0, superContext[methodName]);
			}
			context = superContext;
			superContext = context.superClass;
		}
		try{
			// 触发流程方法执行之前事件
			fastDev.fire(options["onBefore" + handleName], currContext);
		}catch(e){
			fastDev.addError(alias, "onBefore" + handleName, "回调事件执行出错，请检查对应的回调函数", e.message);
		}

		for(var i = 0, method; method = execQueue[i]; i += 1) {
			// 从顶层父类开是执行流程方法
			if(method.call(currContext, options, global) === false) {
				return false;
			}
		}
		
		try{
			// 触发流程方法执行之后事件
			fastDev.fire(options["onAfter" + handleName], currContext);
		}catch(e){
			fastDev.addError(alias, "onAfter" + handleName, "回调事件执行出错，请检查对应的回调函数", e.message);
		}
	},
	execMethod : function(context, methodName) {
		var options = context._options, global = context._global, method = context[methodName];
		if(method && method.call(context, options, global));
	},
	/**
	 * 是否DomObject对象
	 * @param {Object} value
	 * @return {Boolean}
	 * @member fastDev
	 */
	isDomObject : function(value) {
		return fastDev.Core.DomObject.isPrototypeOf(value);
	}
});

/**
 * @class fastDev.Core.Base
 * @singleton
 * 所有控件的父类，定义了通用的各控件通用的属性、事件以及方法，规定了控件的创建流程(ready->construct->init)
 */
fastDev.define("fastDev.Core.Base", {
	_options : {
		/**
		 * 控件准备方法调用之前执行
		 * @event
		 */
		onBeforeReady : fastDev.noop,
		/**
		 * 控件准备方法调用之后执行
		 * @event
		 */
		onAfterReady : fastDev.noop,
		/**
		 * 控件构造方法调用之前执行
		 * @event
		 */
		onBeforeConstruct : fastDev.noop,
		/**
		 * 控件构造方法调用之后执行
		 * @event
		 */
		onAfterConstruct : fastDev.noop,
		/**
		 * 控件初始化方法调用之前执行
		 * @event
		 */
		onBeforeInit : fastDev.noop,
		/**
		 * 控件初始化方法调用之后执行
		 * @event
		 */
		onAfterInit : fastDev.noop,
		/**
		 * 控件销毁方法调用之前执行
		 * @event
		 */
		onBeforeDestroy : fastDev.noop,
		/**
		 * 控件销毁方法调用之后执行
		 * @event
		 */
		onAfterDestroy : fastDev.noop
	},
	_global : {},
	/**
	 * 保存控件配置信息方法
	 * @param {JsonObject} config 配置信息
	 */
	setOptions : function(config) {
		fastDev.apply(this._options, config);
		return this;
	},
	/**
	 * 获取控件配置信息方法
	 * @return {JsonObject} options
	 */
	getOptions : function() {
		return this._options;
	},
	/**
	 * 保存控件全局信息方法
	 * @param {JsonObject} config 配置信息
	 * @protected
	 */
	setGlobal : function(config) {
		fastDev.apply(this._global, config);
	},
	/**
	 * 获取控件全局信息方法
	 * @return {JsonObject} global
	 * @protected
	 */
	getGlobal : function() {
		return this._global;
	},
	/**
	 * 组件参数准备方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	ready : fastDev.noop,
	/**
	 * 组件构造方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	construct : fastDev.noop,
	/**
	 * 组件初始化方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 * @protected
	 */
	init : fastDev.noop,
	/**
	 * 组件销毁方法
	 * @param {Object} options 当前控件配置信息
	 * @param {Object} global 当前控件全局信息
	 */
	destroy : fastDev.noop

});


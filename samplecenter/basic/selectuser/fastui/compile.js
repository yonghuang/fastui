fastDev(function() {
	if(fastDev.isFunction(window.onBeforeCompile)) {
		onBeforeCompile();
	}
	fastDev.Core.ControlBus.compile();
	if(fastDev.isFunction(window.onAfterCompile)) {
		onAfterCompile();
	}
});
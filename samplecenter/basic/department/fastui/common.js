/**
 * 检查session是否过期
 */
//function validateSessionExpire() {
//	fastDev.Core.ControlBus.checkSession('portal_validateSessionExpire.action', function(msg) {
//		fastDev.alert('登陆超时，请重新登陆', '信息提示', 'warning', function(){
//			top.location = '../component/login.html';
//		});
//	});
//}
/**
 * 取得资源所拥有的权限进行权限控制，同时支持对DataGrid设定高度
 * @param type
 * @param datagrid
 */
//function showResourceModes(type, datagrid) {
//	fastDev.create('Proxy', {
//		action: 'accessmode_getPrivilegeResourceModes.action'
//	}).save({
//		module: type
//	}, function(result) {
//		//alert(JSON.stringify(result));
//		if (result!=null){
//			for(var i = 0; i < result.length; i++) {
//				fastDev('[id=' + result[i] + ']').show();
//			}
//		}
//		if(datagrid) {
//			var height = datagrid.getOptions().height;
//			datagrid.setHeight(height);
//		}
//	});
//}

//fastDev(function() {
//	validateSessionExpire();
//});
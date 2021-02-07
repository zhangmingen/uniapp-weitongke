/**
 * @description 验证登录权限,接受一个回调函数,登录则执行回调函数,非登录状态则跳转登录页
 * @param {Function} cb = 回调函数
 * */
function actionAuth (cb){
	if(global.token){
		cb && cb();
	}else{
		const pages = getCurrentPages();
		const lastPage = '/'+pages.pop().route;
		let	path = '/fu-templete/pages/login-templete/login-templete001/login-password';
		if(lastPage == path) return ;
		uni.navigateTo({
			url: path
		})
	}
}

module.exports = {
  actionAuth,
}

export default {

	/*========================================
	=            public interface            =
	========================================*/

	// type 1=注册(未注册手机号),2=忘记密码(已经注册的手机号),3=短信登录,4修改手机号5绑定手机号
	GetVerifyCode: '/v1/5b5bdc44796e8', // 发送验证码
	postRegisterByMobile: '/v1/5cad9f63e4f94', //注册
	postloginByAccount: '/v1/5c78dbfd977cf', //密码登录
	postMyCenter: '/v1/5f92c867d264b', //个人主页
	postForgetPassword: '/v1/5caeeba9866aa', // 忘记密码
	publicGetAgreement: '/v1/5f8908cabea8a', // 注册协议 隐私协议 关于我们
	PostHelpList: '/v1/5f8956828fa20', // 帮助中心
	PostContactList: '/v1/5f89534bad7cc', // 联系我们
	PostNotLoginClassList: '/v1/5f89593a14ae5', // 同课列表（未登录）
	PostWeChatPayList:'/v1/5f9cbeeb0a808',  //同课支付规则
	PostUnifiedOrder:'/v1/5d784b976769e',  //统一下单
	PostWeChatPayOrder:'/v1/5d7868c138418', //微信公众号支付
	PostMasterList:'/v1/5f991f95b9343', //名师排行
	PostOpenClassList:'/v1/5f99531396993', //名师公开课
	PostClassList:'/v1/5f97c4cb84871', //同课列表
	PostIsLike:'/v1/5f9285e767282', //点赞
	PostClassItem:'/v1/5f9a26067c8c2', //课程详情
	PostSignUp:'/v1/5f9a7b2fdbdd6', //立即报名
	PostConfirmPayment:'/v1/5f9a8aac1aee7', //确认支付
	getShareConfig:'/v1/5fdca195e36ac', //公众号分享
	postuserinfo:'/v1/5f8932e3cc558', //修改个人资料
	postTeacher:'/v1/5f9b8f15b7919', //老师报名领课
}

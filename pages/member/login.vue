<template>
	<view class="member">
		<view class="login-top">
			<image src="../../static/imgs/member-logo.png" mode="aspectFill" class="logo-img"></image>
		</view>
		<!-- nav -->
		<scroll-view scroll-x class="nav text-center text-lg">
			<view class="cu-item nav-item nav_act text-333 text-bold">
				<view>登录</view>
				<view class="solid_act bg-theme"></view>
			</view>
			<view class="cu-item nav-item" @tap="handleJump" data-url="/pages/member/register">
				<view>注册</view>
				<view class="solid_act bg-theme"></view>
			</view>
		</scroll-view>
		<!-- content -->
		<view class="member-form padding-lr-lg padding-top">
			<!-- 登录 -->
			<view class="member-login">
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-phone.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" type="number" placeholder="请输入手机号" v-model="phone" maxlength="11" />
					<!-- <text class="text-blu text-sm text-bold">本机号码</text> -->
				</view>
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-password.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" :password="loginPw" type="text" placeholder="请输入密码（6至12位）" maxlength="16"
					 v-model="password" @confirm="reg" />
					<image :src="loginPw?'../../static/imgs/login-eye1.png':'../../static/imgs/login-eye.png'" mode="aspectFill" class="icon-img"
					 @tap="loginPw=!loginPw"></image>
				</view>
				<view class="text-right padding-right padding-bottom-xl"><text class="text-org text-sm text-bold" @tap="handleJump"
					 data-url="/pages/member/forgetPassword">忘记密码</text></view>
				<button class="edit-btn login-submit text-xl text-white" :loading="is_click" @tap="reg">登录</button>
				<view class="compact-login text-center text-bold">
					<view class="text-sm text-666 padding-bottom-xs">点击“登陆”即代表已阅读并同意本平台</view>
					<view class="text-blu text-sm"><text @tap="handleJump" data-url="/pages/member/userAgreement?id=1">《用户协议》</text><text
						 class="text-666">和</text><text @tap="handleJump" data-url="/pages/member/userAgreement?id=2">《隐私协议》</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	import {
		validate
	} from '@/common/utils/index'
	export default {
		data() {
			return {
				code: "", //微信授权code
				is_click: false, //加载动画
				// 登录密码隐藏显示
				loginPw: true,
				// 输入信息
				phone: '', //手机号
				password: '', //密码
			}
		},
		onBackPress() {
			return true
		},
		onLoad() {
			_this = this;
		},
		onShow() {
			var code = this.urlResolve().code;
			const local = (window.location.href); // 对当前地址用encodeURIComponent进行编码
			if (!code) {
				window.location.href =
					'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4a93109fb28061a&redirect_uri=' + encodeURIComponent(
						local, "UTF-8") + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
			} else {
				this.code = code;
			}
		},
		methods: {
			//获取code
			urlResolve() {
				var url = location.search; //获取url中"?"符后的字符串
				var theRequest = new Object(); //声明一个对象
				if (url.indexOf("?") != -1) {
					var str = url.substr(1);
					var strs = str.split("&");
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
					}
				}
				return theRequest;
			},
			//登录
			reg() {
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				if (_this.is_click) {
					return;
				}
				let {
					phone,
					password,
					code
				} = _this;

				if (!phone) {
					_this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					_this.$message.info('请输入正确的手机号');
					return false;
				}
				if (!validate(password, 'password')) {
					_this.$message.info('请输入字母加数字6-12位密码');
					return false;
				}

				let clientId = 'clientId'
				let appSystem = 'appSystem'

				// #ifdef APP-PLUS
				clientId = plus.push.getClientInfo().clientid || '';
				appSystem = uni.getSystemInfoSync().platform == 'ios' ? 1 : 2;
				// #endif



				_this.is_click = true;
				_this.$api.post(global.apiUrls.postloginByAccount, {
					mobile: phone,
					password: password,
					code: code
				}).then(res => {
					_this.is_click = false;
					if (res.data.code == 1 && res.data.data) {
						_this.$message.info(res.data.msg);
						global.token = res.data.data.userinfo.user_token
						global.userInfo = res.data.data.userinfo
						uni.setStorageSync('USER_TOKEN', global.token)
						uni.setStorageSync('USER_INFO', global.userInfo)
						uni.$emit('appLoginSuccess', {
							msg: '登录成功'
						})
						let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
						let curParam = routes[routes.length - 1].options; //获取路由参数
						setTimeout(() => {
							if (curParam.url) {
								var linkurl = curParam.url;
								uni.reLaunch({
									url: linkurl
								})
							} else {
								uni.reLaunch({
									url: "/pages/home/home"
								})
							}
						}, 500)

					} else if (res.data.code == 40163) {
						_this.$message.info('code失效需重新登录');
						setTimeout(function() {
							const local = (window.location.href); // 对当前地址用encodeURIComponent进行编码
							window.location.href =
								'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4a93109fb28061a&redirect_uri=' +
								encodeURIComponent(
									local, "UTF-8") + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
						})
					} else {
						_this.$message.info(res.data.msg);
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.member {
		background-image: url(../../static/imgs/bg-member.png);
		background-position: left top;
		background-size: 266rpx 326rpx;
		background-repeat: no-repeat;
	}

	.logo-img {
		display: block;
		width: 208rpx;
		height: 88rpx;
		margin: 0 auto;
	}

	.cu-item {
		line-height: 50rpx;

		&:first-child {
			padding-right: 50rpx;
		}
	}

	.icon-img {
		width: 38rpx;
		height: 38rpx;
		margin-top: -1rpx;
	}

	.login-top {
		padding: 64rpx 0;
	}

	.nav_act {
		font-size: 40rpx;
	}

	.nav_act .solid_act {
		width: 24rpx;
		height: 6rpx;
		border-radius: 3rpx;
		margin: 0 auto;
	}

	.member-input {
		height: 96rpx;
		line-height: 96rpx;
		background: #F6F7F9;
		border-radius: 50rpx;
		padding: 0 32rpx;
		margin-bottom: 40rpx;

		input {
			padding: 0 20rpx;
		}
	}

	.login-submit {
		text-align: center;
		width: 670rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(315deg, #7ED04C 0%, #46C171 100%);
		box-shadow: 0px 2rpx 30rpx rgba(131, 185, 40, 0.2);
		border-radius: 49rpx;
		margin: 0 auto;
		margin: 0;
		padding: 0 !important;
		outline: none; //消除默认点击蓝色边框效果

		&:after {
			border: none;
		}
		input{
			padding: 0;
			margin: 0;
		}
	}

	.compact-login {
		width: 100%;
		margin-top: 285rpx;
	}


	.edit-btn {}
</style>

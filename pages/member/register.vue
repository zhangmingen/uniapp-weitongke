<template>
	<view class="member">
		<view class="login-top">
			<image src="../../static/imgs/member-logo.png" mode="aspectFill" class="logo-img"></image>
		</view>
		<!-- nav -->
		<scroll-view scroll-x class="nav text-center text-lg">
			<view class="cu-item nav-item" @tap="jumpLogin">
				<view>登录</view>
				<view class="solid_act bg-theme"></view>
			</view>
			<view class="cu-item nav-item nav_act text-333 text-bold">
				<view>注册</view>
				<view class="solid_act bg-theme"></view>
			</view>
		</scroll-view>
		<!-- content -->
		<view class="member-form padding-lr-lg padding-top">
			<!-- 注册 -->
			<view class="member-regist">
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-phone.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
					<!-- <text class="text-blu text-sm text-bold">本机号码</text> -->
				</view>
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-code.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
					<button class="yanZhengMa text-blu text-sm text-bold" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
				</view>
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-password.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" :password="registPw" type="text" v-model="password" minlength="6" maxlength="12"
					 placeholder="请输入密码（6至12位）" />
					<image :src="registPw?'../../static/imgs/login-eye1.png':'../../static/imgs/login-eye.png'" mode="aspectFill"
					 class="icon-img" @tap="registPw=!registPw"></image>
				</view>
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-password.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" :password="registPw1" type="text" v-model="password1" minlength="6" maxlength="12"
					 placeholder="请确认密码（6至12位）" />
					<image :src="registPw1?'../../static/imgs/login-eye1.png':'../../static/imgs/login-eye.png'" mode="aspectFill"
					 class="icon-img" @tap="registPw1=!registPw1"></image>
				</view>
				<view class="flex align-center justify-between member-input">
					<image src="../../static/imgs/login-invite.png" mode="aspectFill" class="icon-img"></image>
					<input class="uni-input flex-sub" @input="edti" :disabled="inviteStatus" type="text" maxlength="12" v-model="invite_code"
					 placeholder="请输入邀请码（选填）" />

				</view>
				<button class="login-submit text-xl text-white" @tap="reg"  :loading="is_click">下一步</button>
				<view class="text-blu text-sm text-bold text-center padding-top-xl"><text class="text-666">请阅读</text><text @tap="handleJump"
					 data-url="/pages/member/userAgreement?id=1">《用户协议》</text><text class="text-666">和</text><text @tap="handleJump"
					 data-url="/pages/member/userAgreement?id=2">《隐私协议》</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	let _this;
	import {
		validate
	} from '@/common/utils/index';
	let timer1 = null;
	export default {
		data() {
			return {
				// 登录密码隐藏显示
				loginPw: true,
				// 注册密码隐藏显示
				registPw: true,
				registPw1: true,
				// 输入信息
				phone: '', //手机号
				vercode: '', //验证码
				password: '', //密码
				password1: '', //确认密码
				is_click: false, // 登录按钮加载动画
				verCodeBtnLoading: false, //获取验证码loading
				time: 60, //倒计时60S
				beginning: false, //显示倒计时
				invite_code: '',
				inviteStatus: false,
				timer: null
			}
		},
		onLoad(option) {
			_this = this;
			_this.invite_code = option.invite_code || "";
			if (_this.invite_code) {
				_this.inviteStatus = true;
				global.inviteCode = true;
			}
		},
		methods: {
			// 邀请码输入
			edti(e) {
				e.detail.value = e.detail.value.replace(/[\u4e00-\u9fa5]/ig, ' ')
				this.invite_code = e.detail.value
			},
			//发送验证码
			handleSendVerCode() {
				let {
					phone
				} = this;
				if (!validate(phone, 'phone')) {
					_this.$message.info('请正确输入手机号');
					return false;
				}
				if (_this.beginning) return false;
				if (_this.verCodeBtnLoading) return false;
				_this.verCodeBtnLoading = true;
				_this.$api.post(global.apiUrls.GetVerifyCode, {
						mobile: phone,
						is_test:"1",
						type: '1'
					})
					.then(res => {
						_this.verCodeBtnLoading = false;
						if (res.data.code == 1) {
							_this.$message.info('验证码已发送');
							_this.beginning = true;
							//显示倒计时
							clearInterval(_this.timer);
							//开始倒计时
							_this.timer = setInterval(() => {
								if (_this.time == 1) {
									//倒计时结束
									clearInterval(_this.timer);
									_this.time = 60;
									_this.beginning = false;
									return;
								}
								_this.time--;
							}, 1000);
						} else {
							_this.$message.info(res.data.msg);
						}
					});
			},
			//注册
			reg() {
				if (_this.is_click) {
					return;
				}
				let {
					phone,
					vercode,
					password,
					invite_code
				} = this;
				if (!phone) {
					_this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					_this.$message.info('请输入正确的手机号');
					return false;
				}
				if (!vercode) {
					_this.$message.info('验证码不能为空');
					return false;
				}

				if (this.password !== this.password1) {
					_this.$message.info('两次密码输入不一致');
					return false;
				}

				if (!validate(password, 'password')) {
					_this.$message.info('请输入字母加数字6-12位密码');
					return false;
				}

				var loginInfo = {
					mobile: phone,
					code: vercode,
					type: 1,
					password: password,
					invite_code: invite_code
				}



				if (timer1) {
					clearTimeout(timer1);
				}
				timer1 = setTimeout(() => {

					_this.is_click = true;
					_this.$api.post(global.apiUrls.postRegisterByMobile, loginInfo)
						.then(res => {
							_this.is_click = false;
							if (res.data.code == 1 && res.data.data) {
								_this.$message.info(res.data.msg);
								global.token = res.data.data.userinfo.user_token
								global.userInfo = res.data.data.userinfo
								uni.setStorageSync('USER_TOKEN', global.token)
								uni.setStorageSync('USER_INFO', global.userInfo)
								uni.$emit('appLoginSuccess', {
									msg: '注册成功'
								})
								// if (global.inviteCode) {
								// 	setTimeout(() => {
								// 		// 下载app 页面
								// 		uni.navigateTo({
								// 			url:"/pages/home/download"
								// 		})
								// 	}, 500)   
								// } else {
								setTimeout(() => {
									uni.navigateTo({
										url: "/pages/member/editData"
									})
								}, 500)
								// }
							} else {
								_this.$message.info(res.data.msg);
							}
						})
				}, 300);
			}
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
		border: 0;
		input {
			font-size: 32rpx;
		}
		&::after{
			border: 0;
		}
	}

	.compact-login {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		padding-bottom: 74rpx;
	}

	.yanZhengMa {
		background: none;
		height: 90upx;
		line-height: 90upx;
		padding: 0;

		&:after {
			border: none;
		}
	}
</style>

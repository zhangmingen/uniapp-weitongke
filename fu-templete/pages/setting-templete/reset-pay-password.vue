<template>
	<view class="">
		<view class="per">
			<view class="padding fu-flex fu-flex-center">
				<text class="">当前手机号：{{ userInfo.mobile || '' }}</text>
			</view>
			<view class="cu-list menu">
				<view class="cu-item">
					<view class="content flex"><input type="number" value="" maxlength="4" v-model="code" placeholder="请输入验证码" placeholder-style="color:#999;" /></view>
					<view class="">
						<button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
					</view>
				</view>
			</view>
		</view>
		<view class="btn_cloce" style="padding:30rpx;"><fu-button :loading="loading" type="primary" @click="tappass">验证</fu-button></view>
		<!-- 支付密码弹窗 -->
		<fu-payment-password ref="paymentPassword" :showClose="false" :mode="mode" @submit="submitHandle" />
	</view>
</template>

<script>
import fuPaymentPassword from '@/components/fu-payment-password/sanshui-payment-password/index.vue';
import { validate } from '@/common/utils/index';
let _this;
export default {
	data() {
		return {
			userInfo: {}, //用户信息
			pay_password: '', //支付密码
			code: '', //验证码
			mobile: '', //手机号
			mode: 2, //支付密码弹窗类型
			loginBtnLoading: false, // 登录按钮加载动画
			verCodeBtnLoading: false, // 获取验证码按钮是否可点击
			timerInterVal: null, //定时器对象
			time: 60, //倒计时60S
			beginning: false, //显示倒计时
			is_click: false ,//是否可提交
			loading: false,	//是否显示验证按钮login
		};
	},
	components: {
		fuPaymentPassword
	},
	onLoad() {
		_this = this;
		this.userInfo = uni.getStorageSync('USER_INFO');
		this.getMobile();
	},
	methods: {
		getMobile() {
			//获取手机号
			this.$api.post(global.apiUrls.postUserGet_user_phone).then(res => {
				if (res.data.code == 1) {
					this.mobile = res.data.data;
				}
			});
		},
		forgetPwd() {
			//修改支付密码
			this.$api
				.post(global.apiUrls.postUserForget_pay_password, {
					pay_password: this.pay_password,
					code: this.code,
					mobile: this.mobile,
					type: 6
				})
				.then(res => {
					uni.hideLoading();
					_this.$message.info(res.data.msg);
					if (res.data.code == 1) {
						setTimeout(() => {
							uni.navigateBack();
							return;
						}, 1200);
					} else {
						this.hideModal();
					}
				});
		},
		submitHandle(e) {
			//输入密码完成
			if (e.type == 'reset') {
				this.pay_password = e.value;
				this.forgetPwd();
			}
		},
		showModal() {
			//显示密码输入组件
			this.$refs.paymentPassword.modalFun('show');
		},
		hideModal() {
			//隐藏密码输入组件
			this.$refs.paymentPassword.modalFun('hide');
		},
		tappass() {
			//点击验证按钮
			if (!this.code) {
				_this.$message.info('验证码不能为空');
				return false;
			}
			this.loading = true;
			this.$api
				.post(global.apiUrls.postUserCheck_verify_code, {
					code: this.code,
					mobile: this.mobile,
					type: 6
				})
				.then(res => {
					this.loading = false;
					if (res.data.code == 1) {
						this.showModal();	//显示密码弹窗
					} else {
						_this.$message.info(res.data.msg);
					}
				}).catch(()=>{
					this.loading = false;
				});
		},
		handleSendVerCode() {
			let phone = this.mobile;
			if (!phone) {
				_this.$message.info('请输入手机号');
				return false;
			}
			if (!validate(phone, 'phone')) {
				_this.$message.info('请输入正确的手机号');
				return false;
			}
			if (this.beginning) return false;
			this.verCodeBtnLoading = true;
			this.beginning = true;

			this.$api
				.post(global.apiUrls.GetVerifyCode, {
					is_test: global.IS_DEV,
					mobile: phone,
					type: '6'
				})
				.then(res => {
					this.verCodeBtnLoading = false;
					if (res.data.code == 1) {
						clearInterval(_this.timerInterVal);
						//开始倒计时
						_this.timerInterVal = setInterval(() => {
							if (_this.time == 1) {
								//倒计时结束
								clearInterval(_this.timerInterVal);
								_this.time = 60;
								_this.beginning = false;
								return;
							}
							_this.time--;
						}, 1000);
						_this.$message.info('验证码为' + res.data.data.code + '请注意查收');
					} else {
						_this.$message.info(res.data.msg);
					}
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f8f8f8;
}

.yanZhengMa {
	position: absolute;
	padding: 0;
	right: 0;
	color: #2999f8;
	font-size: 28rpx;
	background: none;
	height: 90upx;
	line-height: 90upx;
	top: 0;

	&:after {
		border: none;
	}
}

.types {
	width: 686upx;
	position: absolute;
	bottom: 32rpx;
	height: 88upx;
	color: #ffffff;
	line-height: 88upx;
	background: linear-gradient(90deg, rgba(73, 170, 52, 1) 0%, rgba(33, 154, 60, 1) 100%);
	border-radius: 45rpx;
	opacity: 1;
	margin: 0 auto;
}

.per {
	padding: 0 20upx;
	font-size: 28upx;
	background-color: #fff;

	.per_row {
		padding: 30upx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #ededed;

		.row_right {
			text-align: right;

			.aa {
				color: #999999;
				display: inline-block;
				margin-right: 10upx;
			}
		}
	}
}

.out_login {
	margin-top: 30%;
	line-height: 88upx;
	background-color: rgb(0, 129, 255);
	color: #fff;
	text-align: center;
	border-radius: 45px;
	margin-left: 25upx;
	margin-right: 25upx;
}

.btn_cloce {
	width: 100%;
	text-align: center;
	margin-top: 32rpx;
	position: absolute;
	bottom: 16px;
	left: 0;
}
</style>

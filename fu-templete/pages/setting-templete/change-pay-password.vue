<template>
	<view>
		<!-- 验证支付密码 -->
		<fu-payment-password ref="paymentPassword" :mode="mode" @submit="submitHandle" @cancel="togglePayment" />
	</view>
</template>

<script>
	import fuPaymentPassword from '@/components/fu-payment-password/sanshui-payment-password/index.vue'
	export default {
		data() {
			return {
				mode: 0, //支付密码组件的类型
				check_pay_password: false, //是否有支付密码
				pay_password: '', //原支付密码
			};
		},
		components: {
			fuPaymentPassword
		},
		onLoad() {
			this.checkIfPayPwd();
		},
		onReady() {},
		methods: {
			checkIfPayPwd() { //检测是否设置支付密码
				this.$api.get(global.apiUrls.postUserCheck_pay_password).then(res => {
					if (res.data.code == 1) {
						if (res.data.data.falg) { //有密码-去修改
							this.mode = 3
						} else { //没有密码 - 去设置
							this.mode = 2
						}
						this.showModal(); //唤起弹窗
					}
				});
			},
			showModal() { //显示密码输入组件
				this.$refs.paymentPassword.modalFun('show');
			},
			hideModal() { //重新输入
				this.$refs.paymentPassword.clearAll();
			},
			togglePayment(e) { //关闭密码框
				uni.navigateBack();
			},
			submitHandle(e) { //输入完成
				console.log(e);
				if (e.type == 'reset') { //设置新密码
					this.setPayPwd(e);
				} else if (e.type == 'verify') { //旧密码 -- 验证
					this.pay_password = e.value;
				} else if (e.type == 'modify') { //新密码 -- 提交
					this.changePayPwd(e)
				}
			},
			// GetVerifyCode
			setPayPwd(e) { //设置密码-执行接口
				this.$api.post(global.apiUrls.postUserSet_pay_password, {
					set_pay_password: e.value
				}).then(res => {
					uni.hideLoading();
					this.$message.info(res.data.msg);
					if (res.data.code == 1) {
						setTimeout(() => {
							uni.navigateBack();
							return;
						}, 1200)
					} else {
						this.hideModal();
					}
				});
			},
			changePayPwd(e) { //修改密码-执行接口
				this.$api.post(global.apiUrls.postUserUpdate_pay_password, {
					pay_password: this.pay_password,
					new_pay_password: e.value,
				}).then(res => {
					uni.hideLoading();
					this.$message.info(res.data.msg);
					if (res.data.code == 1) {
						setTimeout(() => {
							uni.navigateBack();
							return;
						}, 1200)
					} else {
						this.hideModal();
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.types {
		width: 686upx;
		height: 88upx;
		color: #fff;
		line-height: 88upx;
		background: linear-gradient(90deg, rgba(73, 170, 52, 1) 0%, rgba(33, 154, 60, 1) 100%);
		opacity: 1;
		border-radius: 40px;
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
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
	}
</style>

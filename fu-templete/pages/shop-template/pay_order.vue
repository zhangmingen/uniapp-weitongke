<template>
	<view class="page">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content" class="text-black">收银台</block>
		</cu-custom>
		<view class="price-box">
			<view>
				<text class="text-price icon"></text>
				<text class="price">{{orderInfo.payable_money}}</text>
			</view>
		</view>
		<view class="pay-type-list">
			<view class="padding-bottom text-bold">支付方式</view>
			<view class="type-item b-b" @click="changePayType('balance')" v-if="canUseBalance">
				<view class="margin-right">
					<image class="block-44" src="/static/shop/ye.png"></image>
				</view>
				<view class="con">
					<text class="tit">余额支付</text>
					<text class="text-999 text-sm">可用余额: {{user_money}}</text>
				</view>
				<label class="radio">
					<radio class="radio-scale" :checked='payType == "balance"' :disabled="!canUseBalance" />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType('wxpay')">
				<view class="margin-right">
					<image class="block-44" src="/static/shop/wx.png"></image>
				</view>
				<view class="con">
					<text class="tit">微信支付</text>
				</view>
				<label class="radio">
					<radio class="radio-scale" :checked='payType == "wxpay"' />
					</radio>
				</label>
			</view>
			<!-- #ifndef MP-WEIXIN -->
			<view class="type-item b-b" @click="changePayType('alipay')">
				<view class="margin-right">
					<image class="block-44" src="/static/shop/zfb.png"></image>
				</view>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio class="radio-scale" :checked='payType == "alipay"' />
					</radio>
				</label>
			</view>
			<!-- #endif -->
			<view class="type-item b-b" @click="changePayType('mix')" v-if="canUseMix">
				<view class="margin-right">
					<image class="block-44" src="/static/shop/ye.png"></image>
				</view>
				<view class="con">
					<text class="tit">组合支付(余额可抵扣: <text class="text-theme text-price margin-left-xs">{{user_money}}</text>)</text>
				</view>
				<label class="radio">
					<radio class="radio-scale" :checked='payType == "mix"' :disabled="!canUseMix" />
					</radio>
				</label>
			</view>
		</view>
		<button class="cu-btn bottom-btn" @click="submit">确认支付</button>
		<FuPayKeyboard
			ref="passkeyborad"
			:show="payShow"
			:money="orderInfo.payable_money"
			@close="payClose"
			@callback="paymentByBalance"
		></FuPayKeyboard>
	</view>
</template>

<script>
  import FuPayKeyboard from '@/components/fu-pay-keyboard/fu-pay-keyboard.vue';
	export default {
    components: {
      FuPayKeyboard
    },
		data() {
			return {
				payType: 'balance',
				orderInfo: {},
				user_money: 0,
				order_money: 0,
				order_sn: '',
				order_type: 3,
				payShow: false,
				canUseBalance: false, // 余额是否可用
				canUseMix: false, // 是够可用混合支付
				loading: false, // 按钮状态
			};
		},
		onLoad(options) {
			this.order_sn = options.order_sn;
			this.order_type = options.order_type;
			this.loadData();
		},
		methods: {
			// 获取订单及余额数据
			loadData(){
				let request1 = this.$api.get(global.apiUrls.getOrderDetail, {order_sn: this.order_sn,order_type: this.order_type});
				let request2 = this.$api.post(global.apiUrls.getMyMoney);
				Promise.all([request1,request2])
				.then(res => {
					console.log('promise all',res);
					if(res[0].data.code == 1){
						this.orderInfo = res[0].data.data;
						this.order_money = Number(res[0].data.data.payable_money);
					}
					if(res[1].data.code == 1){
						this.user_money = Number(res[1].data.data.user_money);
					}
					// 余额为零 禁止使用余额支付 禁止使用混合支付
					if (this.user_money == 0) {
						this.canUseBalance = false;
						this.canUseMix = false;
						this.payType = 'wxpay';
					}
					// 余额小于订单金额 禁止使用余额支付 可以使用组合支付
					if(this.user_money > 0 && this.user_money < this.order_money){
						this.canUseBalance = false;
						this.canUseMix = true;
						this.payType = 'mix';
					}
					// 用户余额大于订单余额时 可使用余额支付 不能用组合支付
					if(this.user_money >= this.order_money){
						this.canUseBalance = true;
						this.canUseMix = false;
						this.payType = 'balance';
					}
				}).catch(err => {
					console.log(err);
				})
			},
			// 关闭支付密码输入框
			payClose() {
				this.payShow = false;
			},
			// 选择支付方式
			changePayType(type) {
				if (type == 'balance' && !this.canUseBalance) return ;
				if(type == 'mix' && !this.canUseMix) return ;
				this.payType = type;
			},
			// 确认支付
			submit() {
				// 防止二次点击
				if(this.loading) return ;
				this.loading = true;
				this.callPay();
			},
			// 判断调用哪种支付方式
			callPay(){
				if (this.payType == 'wxpay') {
					this.paymentByWxpay(this.order_sn);
				} else if (this.payType == 'alipay') {
					this.paymentByAlipay(this.order_sn);
				}else if(this.payType == 'mix'){
					this.paymentByMix(this.order_sn);
				}else {
					this.paymentByBalanceIsSetPass();
				}
			},
			// 余额支付判断是否设置了支付密码
			paymentByBalanceIsSetPass(){
				this.$api.post(global.apiUrls.isSetPay, {
					pay_money: this.orderInfo.payable_money
				}).then(res => {
					if (res.data.code == 1) {
            if(res.data.data.falg == 1){
              this.loading = false;
              this.payShow = true;
            }else{
              this.$message.info(res.data.msg);
              setTimeout(() => {
              	this.loading = false;
                this.$urouter.navigateTo('/fu-templete/pages/setting-templete/change-pay-password');
              }, 800);
            }
					} else {
						this.loading = false;
						this.$message.info(res.data.msg);
					}
				}).catch(err => {
					this.loading = false;
				})
			},
			// 余额支付
			paymentByBalance(pass){
				this.$api.post(global.apiUrls.balancepayOrder, {
					order_sn: this.order_sn,
					pay_password: pass
				}).then(res => {
					if (res.data.code == 1) {
						this.$message.info('支付成功');
						this.$refs.passkeyborad.close();
						this.paySuccess(this.order_sn);
					} else {
						this.$message.info(res.data.msg);
						this.$refs.passkeyborad.clear();
					}
				})
			},
			// 微信支付
			paymentByWxpay(sn){
				this.$api.post(global.apiUrls.wxpayOrder, {
					order_sn: sn,
					// #ifdef MP-WEIXIN
					ismini: 1,
					// #endif
				}).then(res => {
					console.log("微信支付回调",res);
					if (res.data.code == 1) {
            let data = res.data.data;
						uni.requestPayment({
							provider: 'wxpay',
							// #ifdef MP-WEIXIN
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							// #endif
							// #ifdef APP-PLUS
							orderInfo: data,
							// #endif
							success: (e) => {
								console.log('success',e)
								if (e.errMsg == 'requestPayment:ok') {
									this.paySuccess(sn)
								}
							},
							fail: (e) => {
								console.log('fail',e);
								// #ifdef APP-PLUS
								if (e.errMsg == 'requestPayment:fail canceled') {
								// #endif
								// #ifndef APP-VUE
								if (e.errMsg == 'requestPayment:fail cancel') {
								// #endif
                  this.$message.info('取消支付');
								} else {
                  this.$message.info("支付失败,原因为: " + e.errMsg);
								}
							},
							complete: () => {
								this.loading = false;
							}
						});
					}else {
						this.loading = false;
            this.$message.info("订单无效，支付失败!");
					}
				}).catch(err => {
					this.loading = false;
					console.error('微信支付失败 =>',err);
				})
			},
			// 支付宝支付
			// #ifndef MP-WEIXIN
			paymentByAlipay(sn){
				this.$api.post(global.apiUrls.alipayOrder, {
					order_sn: sn,
					ismini: 0
				}).then(res => {
					console.log("支付宝支付回调",res);
					if (res.data.code == 1) {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: res.data.data,
							success: (e) => {
								if (e.errMsg == 'requestPayment:ok') {
									this.paySuccess(sn);
								}
							},
							fail: (e) => {
								if (e.errMsg == 'requestPayment:fail canceled') {
                  this.$message.info('取消支付');
								} else {
                  this.$message.info("支付失败,原因为: " + e.errMsg);
								}
							},
							complete: () => {
								this.loading = false;
							}
						})
					} else {
						this.loading = false;
            this.$message.info("订单无效，支付失败");
					}
				}).catch(err => {
					this.loading = false;
					console.log("支付宝支付失败 => ",err);
				})
			},
			// #endif
			// 混合支付
			paymentByMix(sn){
				console.log("执行混合支付");
				this.$api.post(global.apiUrls.mixinpayOrder,{
					order_sn: sn,
					ismini: 1,
					balance: this.user_money,
				}).then(res => {
					console.log('混合支付',res);
					if(res.data.code == 1){
						uni.requestPayment({
							provider: 'wxpay',
							// #ifdef MP-WEIXIN
							timeStamp: res.data.data.timeStamp,
							nonceStr: res.data.data.nonceStr,
							package: res.data.data.package,
							signType: res.data.data.signType,
							paySign: res.data.data.paySign,
							// #endif
							// #ifdef APP-PLUS
							orderInfo: res.data.data,
							// #endif
							success: (e) => {
								uni.hideLoading();
								console.log(e)
								if (e.errMsg == 'requestPayment:ok') {
									this.paySuccess(sn);
								}
							},
							fail: (e) => {
								uni.hideLoading();
								if (e.errMsg == 'requestPayment:fail canceled') {
                  this.$message.info('取消支付');
								} else {
                  this.$message.info("支付失败,原因为: " + e.errMsg);
								}
							},
							complete: () => {
								this.loading = false;
							}
						});
					}else{
						this.loading = false;
						this.$message.info(res.data.msg);
					}
				}).catch(err => {
					this.loading = false;
					console.error('混合支付 - 微信支付失败 =>',err);
				})
			},
			// 支付成功
			paySuccess(sn){
        this.$urouter.redirectTo({
          url: '/fu-templete/pages/shop-template/pay_success',
          params: {
            order_sn: sn,
            order_type: 3,
          }
        })
			},
		},
		onBackPress(e) {
			if (e.from == 'backbutton') {
				uni.showModal({
					title: '确认要离开收银台?',
					content: '您的订单在15分钟内未支付将被取消,请尽快完成支付',
					cancelText: '继续支付',
					confirmText: '确认离开',
					success: (res) => {
						if (res.confirm) {
							uni.navigateBack();
						}
					}
				})
				return true;
			} else {
				return false;
			}
		}
	}
</script>

<style lang='scss' scoped>
	.radio-scale {
		transform: scale(0.7);
	}

	.price-box {
		background-color: #fff;
		height: 220rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		color: #F02325;

		.icon {
			font-size: 30rpx;
		}

		.price {
			font-size: 56rpx;
		}
	}

	.pay-type-list {
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: 28rpx;
			color: #333333;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $uni-font-size-sm;
			color: #909399;
		}
	}

	.block-44 {
		width: 44rpx;
		min-width: 44rpx;
		height: 44rpx;
		min-height: 44rpx;
	}

	.bottom-btn {
		position: fixed;
		bottom: 40rpx;
		bottom: calc(40rpx + constant(safe-area-inset-bottom));
		bottom: calc(40rpx + env(safe-area-inset-bottom));
		left: 32rpx;
		right: 32rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;
		background: linear-gradient(90deg, rgba(240, 34, 36, 1) 0%, rgba(251, 71, 71, 1) 100%);
		border-radius: 50rpx;
	}
</style>

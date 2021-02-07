<template>
	<view class="pay">
		<view class="text-center bg-white" v-if="userInfo">
			<view class="pay-top"><text class="text-64 text-bold text-org padding-right-sm">{{userInfo.user_virtual_money | integerFilter}}</text>同币</view>
			<view class="text-blu pay-top-text">同币仅用于购买本平台虚拟内容</view>
		</view>
		<view class="padding margin-top-sm bg-white">
			<view class="text-lg text-bold text-black">选择数量</view>
			<view class="flex flex-wrap justify-between">
				<view class="text-center margin-top num-box" :class="priceAct==index?'border-gre':''" v-for="(item,index) in paylist"
				 :key="index" @tap="selectPirce(index)">
					<view class="text-sm text-333 padding-top padding-bottom-xs"><text class="text-xxl text-org text-bold padding-right-xs">{{item.virtual_money | integerFilter}}</text>同币</view>
					<view class="text-bold">{{item.pc_price | integerFilter}}元</view>
				</view>
				<view class="text-center margin-top num-box pt-66" :class="priceAct==66?'border-gre':''" @tap="selectPirce(66)"
				 v-if="paylist.length">
					<view class="text-lg" v-if="priceAct!==66">自定义金额</view>
					<view class="text-lg flex align-center" v-else><input class="uni-input padding-left-sm" maxlength="12" :auto-focus="priceAct==66"
						 type="number" v-model="payPrice" placeholder="输入金额" /><text class="padding-bottom-xxs padding-right-xs">元</text></view>
				</view>
			</view>
		</view>
		<view class="padding margin-top-sm bg-white">
			<view class="text-lg text-bold text-black">充值方式</view>
			<view class="padding-top flex align-center justify-between">
				<view class="flex align-center">
					<image src="../../static/imgs/weixin.png" mode="aspectFill" class="pay-img margin-right-sm"></image><text>微信</text>
				</view>
				<image src="../../static/imgs/wx_pay.png" mode="aspectFill" class="tick-img"></image>
			</view>
		</view>
		<view class="text-lg text-bold pay-btn" @tap="payment">确认支付</view>
		<view class="padding-lr pay-hint">
			<view class="p">• 使用同币购买的商品为虚拟内容服务，请注意在购买后不支持 退订、转让及退换。</view>
			<view class="p">• 同币为虚拟币，充值获得的同币不会过期，但无法提现或转 赠他人。</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: global.userInfo,
				paylist: [],
				priceAct: null, // 选择充值金额
				payPrice: '', //自定义充值金额
			}
		},
		onShow() {
			this.userInfo = global.userInfo;
			this.getPaylist();
		},
		methods: {
			// 获取支付规则
			getPaylist() {
				let _this = this;
				uni.showLoading();
				this.$api.post(global.apiUrls.PostWeChatPayList).then(res => {
					setTimeout(function() {
						uni.hideLoading();
					}, 300);
					if (res.data.code == 1) {
						_this.paylist = res.data.data;
					}
				})
			},
			// 选择金额
			selectPirce(index) {
				this.priceAct = index;
			},
			// 获取最新用户数据
			getData() {
				let _this = this;
				this.$api.post(global.apiUrls.postMyCenter).then(res => {
					var res = res.data;
					if (res.code == 1) {
						global.userInfo = res.data;
						uni.setStorageSync('USER_INFO', global.userInfo);
						_this.userInfo = global.userInfo;
					}
				})
			},
			// 发起支付
			payment() {
				var _this = this;
				var r = /^\+?[1-9][0-9]*$/;
				if (this.priceAct == null) return this.$message.info('请选择充值金额');
				if (this.priceAct == 66 && !r.test(this.payPrice)) return this.$message.info('请输入充值金额(整数)');
				// 同意下单
				var unifiedOrder = {
					order_type: 2,
					pay_type: 'wxpay',
					pay_models_type: 'pc_price'
				}
				// 判断是否是自定义金额
				if (this.priceAct == 66) {
					unifiedOrder.order_money = this.payPrice;
					unifiedOrder.payable_money = this.payPrice;
				} else {
					unifiedOrder.product_id = this.paylist[this.priceAct].id;
					unifiedOrder.payable_money = this.paylist[this.priceAct].pc_price;
				}
				uni.showLoading();
				this.$api.post(global.apiUrls.PostUnifiedOrder, unifiedOrder).then(res => {
					if (res.data.code !== '1') return this.$message.info(res.data.msg);
					var order_sn = res.data.data.order_sn;
					// // 获取支付参数发起支付
					this.$api.post(global.apiUrls.PostWeChatPayOrder, {
						order_sn,
						pay_type: 'JSAPI'
					}).then(res => {
						var res = res.data
						if (res.code == 1) {
							uni.hideLoading()
							let pay = res.data;
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": pay.appId, //公众号名称，由商户传入     
									"timeStamp": pay.timeStamp, //时间戳，自1970年以来的秒数     
									"nonceStr": pay.nonceStr, //随机串     
									"package": pay.package,
									"signType": pay.signType, //微信签名方式：     
									"paySign": pay.sign, //微信签名 
								},
								function(res) {
									if (res.err_msg == "get_brand_wcpay_request:ok") {
										_this.getData();

										var pages = getCurrentPages(); //当前页
										var beforePage = pages[pages.length - 2]; //上个页面
										if (beforePage.getData) beforePage.getData();
										setTimeout(function() {
											uni.navigateBack({
												delta: 1
											});
										}, 500)
										// uni.navigateTo({
										// 	url: "/pages/home/home"
										// })
									} else {
										console.log(res)
									}
									// 使用以上方式判断前端返回,微信团队郑重提示：
									//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
								}
							)
						} else {
							_this.$message.info(res.msg)
						}
					})


					// 		// uni.requestPayment({
					// 		// 	provider: channel,
					// 		// 	orderInfo: pay, //微信、支付宝订单数据
					// 		// 	success: function(res) {
					// 		// 		console.log('success:' + JSON.stringify(res));
					// 		// 		_this.$store.commit('zhiFu', !_this.zhifu);
					// 		// 		uni.redirectTo({
					// 		// 			url: '/pages/goods/paySuccess?paytype=' + paytype + '&amount=' + amount + '&orderid=' + _this.orderid
					// 		// 		})
					// 		// 	},
					// 		// 	fail: function(err) {
					// 		// 		_this.$api.msg('取消支付')
					// 		// 		console.log('fail:' + JSON.stringify(err));
					// 		// 		// uni.navigateBack();
					// 		// 	}
					// 		// });
					// 	} else if (res.code == 2) {
					// 		// uni.redirectTo({
					// 		// 	url: '/pages/goods/paySuccess?paytype=' + paytype + '&amount=' + amount + '&orderid=' + _this.orderid +
					// 		// 		'&typeStatus=' + _this.typeStatus + '&is_house=' + _this.is_house
					// 		// })
					// 	} else {
					// 		// _this.$api.msg(res.msg)
					// 		// is_again = false;
					// 	}
					// })

					// uni.request({
					//     url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb4a93109fb28061a&redirect_uri=https%3A%2F%2Fwtk.qmyxjy.com%2Findex.php%2Findex%2Fpay%2Fget_wxpay&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect', //仅为示例，并非真实接口地址。
					// 	method:"GET",
					//     data: {},
					//     header: {
					//         'Content-Type': 'application/x-www-form-urlencoded',
					//     },
					//     success: (res) => {
					//         console.log(res.data);
					//     }
					// });
				})
			}

		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #F6F7F9;
	}

	.num-box.border-gre {
		border: 1px solid #FF5916;
	}

	.pay-solid {
		width: 100%;
		height: 20rpx;
		background: #F6F7F9;
	}

	.pay-img {
		width: 52rpx;
		height: 52rpx;
	}

	.tick-img {
		width: 36rpx;
		height: 36rpx;
	}

	.text-64 {
		font-size: 64rpx;
	}

	.pay-top {
		padding-top: 48rpx;
	}

	.pay-top-text {
		padding: 24rpx 0 32rpx;
	}

	.num-box {
		display: inline-block;
		width: 216rpx;
		height: 168rpx;
		border: 1px solid #BFBFBF;
		border-radius: 16rpx;
	}

	.pt-66 {
		padding-top: 66rpx;
	}

	.pay-btn {
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		color: #FFFFFF;
		background: #83B928;
		border-radius: 50rpx;
		margin: 64rpx auto 48rpx;
	}

	.pay-hint {
		padding-bottom: 30rpx;

		view {
			line-height: 50rpx;
		}
	}

	.padding-bottom-xxs {
		padding-bottom: 6rpx;
	}
</style>

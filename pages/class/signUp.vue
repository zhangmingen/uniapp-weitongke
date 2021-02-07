<template>
	<view class="padding-top sign-up" v-if="SD">
		<class-item :data="SD" @refreshdata="refreshdata" :nolink="true"></class-item>
		<!-- 账户余额 -->
		<view class="balance-box flex justify-between align-center">
			<view class="text-sm">
				<text class="text-df text-bold">帐户余额：</text><text class="text-org text-xl text-bold" >{{userinfo.user_virtual_money | integerFilter}}</text><text
				 class="padding-left-xs padding-right-sm">同币</text><text class="text-org" v-if="SD.price*1 > userinfo.user_virtual_money*1">(不足支付)</text>
			</view>
			<view class="bg-org pay-btn text-sm" @tap="handleJump" data-url="/pages/home/pay">立即充值</view>
		</view>
		<view class="padding text-sm text-999">
			<view>• 您将购买的商品为虚拟内容服务，请注意在购买后不支持退订、转让及退换，请斟酌后再确认。
			</view>
			<view class="padding-top-xs">• 完成支付后可在“订单”中查看和使用。</view>
		</view>
		<!-- 确认支付 -->
		<view class="pay-box flex justify-between align-center">
			<view class="text-sm">
				<text class="text-df text-bold">应付金额：</text><text class="text-org text-xl text-bold">{{SD.price | integerFilter}}</text><text
				 class="padding-left-xs padding-right-sm text-org">同币</text>
			</view>
			<view class="yes-pay-btn text-df bg-de text-bold" v-if="SD.price*1 > userinfo.user_virtual_money*1">确认支付</view>
			<view class="yes-pay-btn text-df bg-org text-bold" @tap="payFun(SD.order_id)" v-else>确认支付</view>
		</view>
		<!-- modal -->
		<view class="sign-up-modal">
			<class-modal :show="close" @hideModal="hideModal(SD.id)">
				<view class="text-left padding-lr-lg">
					<view class="text-df text-333 padding-bottom-sm">
						购买成功，您已成功支付{{SD.price | integerFilter}}同币。
					</view>
					<view class="text-sm text-666">
						请在微同课App“订单”中查看和使用，不要错过了时间哦！
					</view>
				</view>
			</class-modal>
		</view>
	</view>
</template>

<script>
	import classItem from '@/components/class-item/class-item.vue'
	export default {
		data() {
			return {
				userinfo: global.userInfo,
				// 模态框
				close: false,
				// 课程详情数据
				SD: null
			}
		},
		components: {
			classItem
		},
		onShow() {
			this.userinfo = global.userInfo;
			this.getData()
		},
		onLoad(option) {
			// 报名课程id
			this.getItem(option.id);
		},
		methods: {
			// 获取最新用户数据
			getData() {
				let _this = this;
				this.$api.post(global.apiUrls.postMyCenter).then(res => {
					var res = res.data;
					if (res.code == 1) {
						global.userInfo = res.data;
						uni.setStorageSync('USER_INFO', global.userInfo);
						_this.userinfo = global.userInfo;
					}
				})
			},
			hideModal(id) {
				this.close = false;
				var pages = getCurrentPages(); //当前页
				var beforePage = pages[pages.length - 3]; //上上个页面
				if(beforePage.refreshdatanum) beforePage.refreshdatanum(id);
				uni.navigateBack({
					delta: 2
				});
			},
			// 确认支付
			payFun(id) {
				uni.showLoading();
				let _this = this;
				this.$api.post(global.apiUrls.PostConfirmPayment, {
						id: id
					})
					.then(res => {
						uni.hideLoading();
						if (res.data.code == 1) {
							this.close = true;
						} else {
							_this.$message.info(res.data.msg);
						}
					})
			},
			// 立即报名获取数据
			getItem(id) {
				uni.showLoading();
				let _this = this;
				this.$api.post(global.apiUrls.PostSignUp, {
						id: id,
						is_gzh: 1
					})
					.then(res => {
						if (res.data.code == 1) {
							uni.hideLoading();
							_this.SD = res.data.data;
						}

					})
			},
			// 子组件方法
			refreshdata(userid) {
				var _this = this;
				var SD = this.SD;
				this.$nextTick(function() {
					SD.is_follow == 1 ? SD.is_follow = 0 : SD.is_follow = 1;
					console.log(SD)
					_this.SD = SD;
				})
			}
		}
	}
</script>

<style scoped>
	.sign-up /deep/ .class_item {
		padding-bottom: 0;
	}

	.sign-up /deep/ .box-solid-bottom {
		background-color: #FFFFFF !important;
	}

	.sign-up-modal /deep/ .pt-99 {
		padding-top: 55rpx;
	}

	.sign-up-modal /deep/ .slot-padding {
		padding-bottom: 60rpx;
	}

	.balance-box {
		height: 90rpx;
		line-height: 90rpx;
		background-color: #F6F7F9;
		padding: 0 30rpx;
		border-radius: 4px;
	}

	.pay-btn {
		display: inline-block;
		width: 180rpx;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 44rpx;
		text-align: center;
	}

	.pay-box {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #FFFFFF;
		padding: 0 30rpx;
		box-shadow: 0px -1px 0px #EEEEEE;
	}

	.yes-pay-btn {
		width: 220rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 44rpx;
	}
</style>

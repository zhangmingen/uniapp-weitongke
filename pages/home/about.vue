<template>
	<view class="about">
		<view class="text-center about-top">
			<image src="../../static/imgs/logo.png" class="about-logo" mode="aspectFill"></image>
		</view>
		<view class="text-df padding">
			<view class="padding-bottom-xs text-indent">{{showData||''}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showData: null
			}
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				let _this = this;
				uni.showLoading({
					title: '加载中...'
				});
				this.$api.post(global.apiUrls.publicGetAgreement).then(res => {
					var res = res.data;
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					if (res.code == 1) {
						_this.showData = res.data.about_us
					}
				})
			}
		}
	}
</script>

<style scoped>
	.about-top {
		padding: 129rpx 0 72rpx;
	}

	.about-logo {
		width: 270rpx;
		height: 114rpx;
	}
</style>

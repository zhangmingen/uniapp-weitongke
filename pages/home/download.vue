<template>
	<view class="master-list">
		<view class="list-top">
			<image src="../../static/imgs/bg-master.png" class="bg-master" mode="aspectFill"></image>
		</view>
		<view>
			<image src="../../static/logo.png" class="logo" mode=""></image>
		</view>
		<view class="pt-100">
			<view class="flex align-center download" @tap="sharefun(1)">
				<image src="../../static/anzhuo.png" mode="aspectFill"></image>
				<view class="text-center text-theme flex-sub text-lg text-bold">Android 下载</view>
			</view>
			<view class="flex align-center download" @tap="sharefun(2)">
				<image src="../../static/pingguo.png" mode="aspectFill"></image>
				<view class="text-center text-theme flex-sub text-lg text-bold">IOS 下载</view>
			</view>
		</view>
		<view class="shareArrow text-center" v-if="shareStatus">
			<image src="../../static/live_weixin.png" mode="aspectFill" class="shareimg"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shareStatus: false
			}
		},
		methods: {
			sharefun(ind) {
				let ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					this.shareStatus = true;
				}else if(ind==1){
					// 安卓
				}else if(ind==2){
					// 苹果
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #F6F7F9;
	}

	.shareArrow {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
	}

	.shareimg {
		display: block;
		margin: 0 auto;
		margin-top: 10%;
		width: 740rpx;
		height: 535rpx;
	}

	.download {
		width: 400rpx;
		height: 88rpx;
		line-height: 88rpx;
		border: 2px solid #83B928;
		margin: 0 auto;
		margin-top: 40rpx;
		border-radius: 44rpx;
		padding-left: 30rpx;

		image {
			width: 56rpx;
			height: 56rpx;
		}
	}

	.pt-100 {
		padding-top: 200rpx;
	}

	.logo {
		display: block;
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		margin: 0 auto;
		margin-top: -220rpx;
	}

	.master-list {
		background-color: #F6F7F9;
	}

	.list-top {
		position: relative;
	}

	.bg-master {
		width: 100%;
		height: 370rpx;
	}

	.top-item {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.item {
		width: 702rpx;
		height: 190rpx;
		background-color: #FFFFFF;
		border-radius: 16px;
		margin: 0 auto;

		.pl-24 {
			padding-left: 24rpx;
		}

		.master-head-img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}
	}

	.ranktext {
		width: 90rpx;
		text-align: center;
	}
</style>

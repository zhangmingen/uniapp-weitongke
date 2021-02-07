<template>
	<view class="home">
		<view class="top text-white">
			<image src="../../static/imgs/bg-home.png" mode="aspectFill" class="bg-home"></image>
			<view class="flex align-center justify-between home-mine">
				<view class="flex align-center padding-left">
					<view class="" @tap="handleJump" data-url="/pages/member/homeeditData">
						<u-image :src="userInfo.head_img_url || userInfo.head_img || '/static/imgs/user.png'" mode="aspectFill" width="130rpx" height="130rpx" border-radius="50%" class="home-head"
						 :lazy-load="true"></u-image>
					</view>
					<view class="padding-left-sm" v-if="userInfo">
						<view class="text-xl text-bold text-200" @tap="handleJump" data-url="/pages/member/homeeditData">{{userInfo.user_nickname || '微同课'}}</view>
						<view class="text-sm padding-top-xs">{{userInfo.auth_status==1?'未认证':userInfo.auth_status==2?'实名':'教师'}}<text
							 v-if="userInfo.vip_name">・{{userInfo.vip_name}}</text></view>
					</view>
					<view class="text-xl text-bold padding-left-sm" v-else @tap="jumpLogin">您还没有登录</view>
				</view>
				<view class="balance-box text-sm flex align-center padding-left-sm" v-if="userInfo">
					<text class="text-bold" :class="userInfo&&userInfo.user_virtual_money.length>8?'':'text-xl'">{{userInfo.user_virtual_money | integerFilter}}</text>
					<text class="padding-left-xs padding-right-sm">同币</text>
					<view class="pay-btn margin-right-sm" @tap="handleJump" data-url="/pages/home/pay">充值</view>
				</view>
			</view>
		</view>
		<!-- content -->
		<view class="padding-lr">
			<view class="home-nav" @tap="locationHref">
				<view class="flex align-center justify-between padding-top padding-bottom-sm solid-bottom">
					<view class="flex align-center">
						<image src="../../static/imgs/yaoqing.png" class="nav-icon" mode=""></image>
						<text class="text-df padding-left-xs">邀请赚币</text>
					</view>
					<image src="../../static/imgs/right.png" mode="" class="right-icon"></image>
				</view>
			</view>
			<view class="home-nav" @tap="handleJump" data-url="/pages/home/help">
				<view class="flex align-center justify-between padding-top padding-bottom-sm solid-bottom">
					<view class="flex align-center">
						<image src="../../static/imgs/bangzhu.png" class="nav-icon" mode=""></image>
						<text class="text-df padding-left-xs">帮助中心</text>
					</view>
					<image src="../../static/imgs/right.png" mode="" class="right-icon"></image>
				</view>
			</view>
			<view class="home-nav" @tap="handleJump" data-url="/pages/home/about">
				<view class="flex align-center justify-between padding-top padding-bottom-sm solid-bottom">
					<view class="flex align-center">
						<image src="../../static/imgs/guanyu.png" class="nav-icon" mode=""></image>
						<text class="text-df padding-left-xs">关于我们</text>
					</view>
					<image src="../../static/imgs/right.png" mode="" class="right-icon"></image>
				</view>
			</view>
			<view class="home-nav" @tap="handleJump" data-url="/pages/home/contact">
				<view class="flex align-center justify-between padding-top padding-bottom-sm solid-bottom">
					<view class="flex align-center">
						<image src="../../static/imgs/lianxi.png" class="nav-icon" mode=""></image>
						<text class="text-df padding-left-xs">联系我们</text>
					</view>
					<image src="../../static/imgs/right.png" mode="" class="right-icon"></image>
				</view>
			</view>
		</view>
		<!-- 推出登录测试用 -->
		<view class="text-lg text-blod flex align-center justify-center padding-lr padding-tb-xs" @tap="exitfun">
			退出登录(测试用)
		</view>
		<!-- 下载app -->
		<view class="download-btn text-lg text-blod text-white flex align-center justify-center" @tap="handleJump" data-url="/pages/home/download">
			<image src="../../static/imgs/download.png" mode="aspectFill" class="margin-right-xs"></image>下载App
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: global.userInfo
			}
		},
		onShow() {
			//获取最新数据
			this.getData();
		},
		methods: {
			locationHref() {
				window.location.href = "https://app.vtongke.com/h5/pages/home/invite";
			},
			exitfun() {
				global.token = ''
				global.userInfo = null
				uni.removeStorageSync('USER_TOKEN')
				uni.removeStorageSync('USER_INFO')
				this.jumpLogin();
			},
			getData() {
				let _this = this;
				this.$api.post(global.apiUrls.postMyCenter).then(res => {
					var res = res.data;
					if (res.code == 1 && res.data) {
						global.userInfo = res.data;
						uni.setStorageSync('USER_INFO', global.userInfo);
						_this.userInfo = global.userInfo;
					} else {
						this.jumpLogin();
					}
				})
			}
		}

	}
</script>

<style lang="less" scoped>
	.bg-home {
		background: linear-gradient(136deg, #99D337 0%, #83B928 100%);
		width: 100%;
		height: 300rpx;
	}

	.top {
		position: relative;

		.home-mine {
			position: absolute;
			width: 100%;
			height: 130rpx;
			left: 0;
			top: 0;
			bottom: 0;
			margin: auto 0;
		}
	}

	.home-head {
		width: 130rpx;
		height: 130rpx;
		border-radius: 50%;
	}

	.balance-box {
		height: 96rpx;
		background-color: rgba(255, 255, 255, .27);
		border-radius: 50px 0px 0px 50px;
	}

	.pay-btn {
		width: 76rpx;
		height: 48rpx;
		line-height: 46rpx;
		text-align: center;
		border: 1px solid #FFFFFF;
		border-radius: 8rpx;
	}

	.text-200 {
		width: 210rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.home-nav {
		.nav-icon {
			width: 40rpx;
			height: 40rpx;
		}

		.right-icon {
			width: 12rpx;
			height: 21rpx;
		}
	}

	.download-btn {
		position: fixed;
		bottom: 86rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 400rpx;
		height: 88rpx;
		line-height: 88rpx;
		background: #83B928;
		border-radius: 50rpx;

		image {
			width: 32rpx;
			height: 32rpx;
		}
	}
</style>

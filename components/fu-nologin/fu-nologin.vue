<template>
	<view class="box">
		<view class="box2">
			<text class="title">欢迎加入,请登录/注册享超值优惠!</text>
			<view class="btn" @click="tologin">立即登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			tologin(){
        this.$urouter.navigateTo('/fu-templete/pages/login-templete/login-templete001/login-password');
			}
		}
	}
</script>

<style lang="scss" scoped>
.box{
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 0 36rpx 10rpx;
	.box2{
		height: 90rpx;
		background-color: rgba(0,0,0,.6);
		border-radius: 24rpx;
		padding: 20rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title{
			font-size: 24rpx;
			color: #FFFFFF;
		}
		.btn{
			width: 130rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 24rpx;
			background: linear-gradient(90deg,rgba(255,20,80,1) 0%,rgba(240,35,37,1) 100%);
			border-radius: 8rpx;
		}
	}
}
</style>

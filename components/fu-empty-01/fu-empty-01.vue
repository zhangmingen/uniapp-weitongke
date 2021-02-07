<template>
  <view class="box">
    <image class="image" src="/static/empty/empty05.png"></image>
    <text class="text">{{title}}</text>
  </view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '暂无相关内容'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box{
    padding: 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.image{
			width: 629rpx;
			height: 423rpx;
		}
		.text{
			margin-top: 40rpx;
			font-size: 28rpx;
			color: #999999;
		}
	}

</style>

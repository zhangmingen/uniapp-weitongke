<template>
	<swiper
		class="swiper-box"
		indicator-dots
		indicator-active-color="#FFFFFF"
		circular
		autoplay
		easing-function="easeInOutCubic"
	>
		<block v-for="(item,index) in lists" :key="index">
			<swiper-item class="swiper-item">
				<view class="swiper-item-img" @click="navTo(item.path)">
					<image :src="item.thumb" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</block>
	</swiper>
</template>

<script>
	export default {
		props: {
			lists: {
				type: Array,
				default(){
					return []
				},
			}
		},
		methods: {
			navTo(path){
				if(path){
          this.$urouter.navigateTo(path);
				}
			},
		}
	}
</script>

<style lang="scss">
	.swiper-box {
		height: 380rpx;
    border-radius: 8rpx;
    overflow: hidden;
	}
	.swiper-item-img {
		width: 100%;
		height: 100%;
    background-color: #EEEEEE;
    border-radius: 8rpx;
	}
	.swiper-item image {
		width: 100%;
		height: 100%;
    border-radius: 8rpx;
	}
</style>

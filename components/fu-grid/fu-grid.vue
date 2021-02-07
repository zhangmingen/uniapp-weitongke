<template>
	<view class="padding-lr padding-top" style="box-shadow: 0 0 10rpx #eee;">
		<swiper class="swiper" @change="swiperChange">
			<block v-for="(item,i) in navs" :key="i">
				<swiper-item class="flex">
					<block v-for="(ele,j) in item" :key="j">
						<view class="sub-item flex-sub flex flex-direction justify-center align-center" @click="navTo(ele.href,ele.is_login)">
							<image class="block-48" :src="ele.thumb" mode="aspectFit" lazy-load></image>
							<text class="text-xs text-333 margin-top-xs">{{ele.name}}</text>
						</view>
					</block>
				</swiper-item>
			</block>
		</swiper>
		<view class="padding-tb-xs flex justify-center">
			<view class="bar flex round overflow">
				<block v-for="(item,index) in navs" :key="index">
					<view class="bar_item bg-gray" :class="{'active': current == index}"></view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
    name: 'fu-grid',
		data() {
			return {
				navs: [],
				current: 0,
			};
		},
		methods: {
			getNavs() {
				this.$api.post(global.apiUrls.postHomeGrid, {
					typeid: 6
				}).then(res => {
					console.log(res, "金刚区");
					if (res.data.code == 1) {
						let list = res.data.data;
						for(let i=0,l=list.length;i<l;i+=5){
							this.navs.push(list.slice(i,i+5));
						}
					}
				})
			},
			navTo(path,auth){
				if (auth) {
					this.$util.actionAuth(() => {
						uni.navigateTo({
							url: path
						})
					})
				} else {
					uni.navigateTo({
						url: path
					})
				}
			},
			swiperChange(e){
				this.current = e.detail.current;
			}
		},
		created(){
			this.getNavs();
		}
	}
</script>

<style lang="scss" scoped>
	.swiper{
		height: 160rpx;
	}
	.block-48 {
		width: 90rpx;
		min-width: 90rpx;
		height: 90rpx;
		min-height: 90rpx;
    background-color: #EEEEEE;
		image{
			width: 100%;
			height: 100%;
		}
	}

	.sub-item{
		position: relative;
		.jiaobiao {
			position: absolute;
			top: 10rpx;
			right: 20rpx;
			width: 35rpx;
			height: 35rpx;
			color: #fff;
			background: $fu-main-color;
			border-radius: 50% 50% 0 50%;
			font-size: 20rpx;
			text-align: center;
			line-height: 35rpx;
			z-index: 999;
		}
		.scale-up{
			width: 54rpx;
			height: 30rpx;
			line-height: 30rpx;
			right: 0;
			border-radius: 15rpx 15rpx 15rpx 0;
		}
	}

	.bar{
		.bar_item{
			width: 30rpx;
			height: 6rpx;
			background: #F2F3F5;
			border-radius: 6rpx;
		}
		.bar_item+.bar_item{
			margin-left: 10rpx;
		}
		.bar_item.active{
			background: #F02325;
		}
	}

	.fade{
		animation:fade 1.5s infinite;
	}
	@keyframes fade {
	  0% {
	      opacity: 0;
	  }

	  100% {
	      opacity: 1;
	  }
	}

	.scale-up{
		animation:scale-up 1.5s infinite;
	}
	@keyframes scale-up {
    0% {
        transform: scale(.2)
    }

    100% {
        transform: scale(1)
    }
	}

</style>

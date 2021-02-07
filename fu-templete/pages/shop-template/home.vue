<template>
	<view class="container">
		<!-- 头部 -->
		<view class="cu-custom" :style="[{height: CustomBar+'px',backgroundColor: bgColor}]" :animation="animationData">
			<view class="cu-bar fixed" :style="{height: CustomBar+'px',paddingTop: StatusBar+'px',backgroundColor: bgColor}" :animation="animationData">
				<view class="action text-white" v-if="showBar">
					犇腾家 | <text class="text-sm" style="margin-left: 10rpx;">人性化电商领跑者</text>
				</view>
				<view v-else class="search-form radius animation-slide-bottom" @tap="navToSearch">
					<text class="cuIcon-search"></text>
				</view>
			</view>
		</view>
		<!-- 搜索条 -->
		<view class="cu-bar search" :style="[{'min-height': '80rpx',backgroundColor: bgColor}]" :animation="animationData">
			<view class="search-form radius" @tap="navToSearch">
				<text class="cuIcon-search"></text>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="padding-lr padding-top-xs swiper-wrap">
			<view class="swiper-bg" :style="[{backgroundColor: bgColor}]" :animation="animationData"></view>
			<fu-swiper :lists="banners" @change="changeColor"></fu-swiper>
		</view>
		<!-- 九宫格 -->
		<fu-grid ref="grid"></fu-grid>
		<!-- 广告位 -->
		<!-- <fu-advert :typeid="6"></fu-advert> -->
		<!-- 为你推荐 -->
		<fu-waterflow ref="guess"></fu-waterflow>
		<!-- 未登录 -->
		<fu-nologin v-if="!isLogin"></fu-nologin>
	</view>
</template>
<script>
  import FuGrid from '@/components/fu-grid/fu-grid.vue';
  import FuAdvert from '@/components/fu-advert/fu-advert.vue';
	export default {
		components: {
      FuGrid,
      FuAdvert,
		},
		data() {
			return {
				showBar: true,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				banners: [],
				banner: null, // 广告图
				bgColor: 'rgb(227,65,47)',
				animationData: {},
        isLogin: false,
			};
		},
		onLoad(options) {
			this.loadData();
		},
		onShow() {
			if (global.token) {
        this.isLogin = true;
			}
		},
		onPullDownRefresh() {
			this.loadData();
			this.$refs.guess && this.$refs.guess.refresh();

			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom(e) {
			this.$refs.guess && this.$refs.guess.loadData();
		},
		onPageScroll(e) {
			this.showBar = e.scrollTop >= 40 ? false : true;
		},
		methods: {
      // 首页数据
			loadData() {
				this.getSwiper();
			},
      // 去搜索
      navToSearch(){
        this.$urouter.navigateTo('/fu-templete/pages/search-template/search');
      },
			// 轮播图
			getSwiper() {
				this.$api.post(global.apiUrls.postAdvert,{
          typeid: 3
        })
        .then(res => {
          console.log("轮播图", res.data);
          if (res.data.code == 1) {
            this.banners = res.data.data;
          }
        })
			},
			// 改变颜色
			changeColor(e) {
				const color = `rgb(${e[0]},${e[1]},${e[2]})`;
				this.bgColor = color;
				var animation = uni.createAnimation({
					duration: 700,
					timingFunction: 'linear',
				})
				this.animation = animation
				animation.backgroundColor(this.bgColor).step()
				this.animationData = animation.export();
			},
		},
		onShareAppMessage() {
			return {
				title: '犇腾家全新亮相!百亿补贴好货抢不停!犇腾家全新亮相!',
				path: '/fu-templete/pages/shop-template/home',
			}
		}
	};
</script>
<style lang="scss" scoped>
	.container {
		background-color: #F8F8F9;
	}

	.newVip{
	  width: 686rpx;
	  height: 464rpx;
	  position: relative;
	  margin: 10rpx auto 0;
	  overflow: hidden;
	  z-index: 3;
	  .bg_vip{
	   width: 686rpx;
	   height: 464rpx;
	   position: absolute;
	   left: 0;
	   top: 0;
	   z-index: -1;
	  }
	  .vip_title{
		  padding-right: 30rpx;
		  width: 100%;
		  height: 108rpx;
		  display: flex;
		  justify-content: flex-end;
		  align-items: center;
		  font-size:24rpx;
		  font-family:PingFang SC;
		  font-weight:400;
		  color:rgba(255,255,255,1);
	  }
	  .vip_goods{
		  overflow: hidden;
		  width:646rpx;
		  height:338rpx;
		  background:rgba(255,255,255,0.95);
		  border-radius:24rpx;
		  margin: 0 20rpx 20rpx;
		  display: flex;
		  flex-wrap: nowrap;
		  padding: 30rpx 20rpx;
		  .goods_item:nth-child(2){
			  margin: 0 23rpx;
		  }
		  .goods_item{
			  display: flex;
			  flex-flow: column;
			  width: 186rpx;
			  image{
				  width: 186rpx;
				  height: 186rpx;
			  }
			  .tips{
				font-size:24rpx;
				color:rgba(17,17,17,1);
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			  }
			  .money{
				  font-size: 18rpx;
				  color: #F31813;
				  text{
					 font-size:28rpx;
					 font-family:Arial;
					 font-weight:bold;
				  }

			  }
		  }
	  }
	 }




	.life_type {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;

		.life_title {
			font-size: 24rpx;
			text-align: center;
			color: #FFFFFF;
			padding-right: 10rpx
		}

		.life_item {
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: space-between;
			flex-wrap: nowrap;

			.items {
				width: 140rpx;
				height: 40rpx;
				border-radius: 20rpx;
				background: rgba(221, 221, 221, 0.5);
				font-size: 24rpx;
				text-align: center;
				color: #FFFFFF;
				line-height: 40rpx;
			}

		}
	}

	.cu-custom {
		.search-form {
			width: 100%;
			line-height: 52upx;
			height: 52upx;
		}
	}

	.cu-bar.search {
		.search-form {
			height: 56rpx;
			line-height: 56rpx;
		}
	}

	.header {
		height: 100rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;

		.header-search {
			width: 690rpx;
			height: 64rpx;
			background-color: rgba(246, 246, 246, 1);
			padding: 0 24rpx;
			display: flex;
			align-items: center;
			font-family: 'PingFang SC';
			border-radius: 34rpx;
			color: #BFBFBF;
		}

		.header-message {
			display: flex;
			align-items: center;

			image {
				width: 48rpx;
				height: 48rpx;
			}
		}
	}

	.swiper-wrap {
		position: relative;
		overflow: hidden;
		width: 750rpx;
		height: 320rpx;

		.swiper-bg {
			height: 200rpx;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			border-radius: 0 0 50% 50%;
		}
	}

	.banner-wrap {
		position: relative;
		overflow: hidden;
	}

	.banner-box {
		background-size: cover;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.banner-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			margin-left: 154rpx;

			.banner-info-title {
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #F2D7BD;
			}

			.banner-info-sub {
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #EAE8E7;
				margin-top: 10rpx;
			}
		}

		.banner-action {
			width: 155rpx;
			height: 56rpx;
			background: linear-gradient(63deg, rgba(247, 226, 191, 1) 0%, rgba(227, 186, 153, 1) 100%);
			opacity: 1;
			border-radius: 28rpx;
			margin-right: 34rpx;
			font-size: 24rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(21, 33, 43, 1);
			line-height: 56rpx;
			text-align: center;
		}
	}

	.banner-floor {
		height: 240rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.notice-wrap {
		background-color: #F8F8F8;
		display: flex;
		height: 64rpx;
		align-items: center;
		padding: 0 16rpx;

		.swiper-box {
			height: 64rpx;
			width: 100%;

			.swiper-item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				// .swiper-item-text{
				// 	width: 100%;
				// }
			}
		}
	}

	.block-38 {
		width: 38rpx;
		height: 38rpx;
	}

	.block-30 {
		width: 30rpx;
		height: 30rpx;
	}

	.block-250 {
		width: 224rpx;
		min-width: 224rpx;
		height: 224rpx;
		min-height: 224rpx;
	}

	.className {
		margin: 0;
		font-size: 22rpx;
	}

	.block-7828 {
		width: 78rpx;
		height: 28rpx;
	}

	image {
		width: 100%;
		height: 100%;
	}

	.buy-notice {
		position: fixed;
		left: 50rpx;
		z-index: 999;
	}

	.info {
		height: 30rpx;

		.info-title {
			width: 80rpx;
			line-height: 30rpx;
			text-align: center;
		}

		.info-number {
			width: 70rpx;
			line-height: 22rpx;
			text-align: center;
			border: 4rpx solid $fu-main-color;
			border-left: none;
		}
	}

	.titles {
		padding: 20rpx 32rpx;

		.name {
			font-size: 40rpx;
			line-height: 48rpx;
			color: #333333;
			font-weight: bold;

			image {
				width: 34rpx;
				height: 34rpx;
				margin-right: 18rpx;
			}
		}

		.desc {
			width: 120rpx;
			height: 46rpx;
			background: linear-gradient(90deg, rgba(240, 34, 36, 1) 0%, rgba(251, 71, 71, 1) 100%);
			font-size: 24rpx;
			color: #FFFFFF;
			line-height: 46rpx;
			text-align: center;
			border-radius: 23rpx;
		}
	}

	.top-tab {
		width: 100%;
		height: 100upx;
		background-color: #FFFFFF;

		.title {
			font-style: italic;
		}

		.tab-item {
			.time {
				color: #373737;
				font-size: 30rpx;
				line-height: 34rpx;

				&.active {
					color: #F31813;
					font-size: 40rpx;
				}
			}

			.state {
				color: #999999;
				font-size: 20rpx;
				line-height: 32rpx;
				margin-top: 10rpx;

				&.active {
					width: 120rpx;
					height: 32rpx;
					background: linear-gradient(126deg, rgba(243, 24, 14, 1) 0%, rgba(255, 101, 48, 1) 100%);
					text-align: center;
					border-radius: 20rpx;
					color: #FFFFFF;
				}
			}
		}

		.current {}
	}

	.sckill-list {
		height: 876rpx;
	}

	.guess {
		width: 100%;
		text-align: center;
		font-size: 40rpx;
	}

	.guesstitles {
		background: #FAFAFA;
	}

	.block-24 {
		width: 24rpx;
		min-width: 24rpx;
		height: 24rpx;
		min-height: 24rpx;
	}

	ben-search-swiper {
		width: 100%;
	}

	.float-banner {
		width: 240rpx;
		height: 235rpx;
		position: fixed;
		bottom: 240rpx;
		z-index: 996;
		transition: all 0.35s ease-in-out;
		image {
			width: 100%;
			height: 100%;
		}
		.close-btn {
			width: 36rpx;
			height: 36rpx;
			line-height: 36rpx;
			background-color: rgba(200,200,200,.8);
			text-align: center;
			position: absolute;
			display: flex;
			align-items: center;
			border-radius: 50%;
			font-size: 24rpx;
			justify-content: center;
			color: #FFFFFF;
			top: 20rpx;
			right: 46rpx;
			z-index: 996;
		}
	}
	.live-box{
		width: 686rpx;
		height: 199rpx;
		position: relative;
		.live-item{
			position: absolute;
			width: 145rpx;
			height: 145rpx;
			top: 28rpx;
			left: 38rpx;
			background-color: rgba(255,255,255,.5);
			z-index: 99;
			border-radius: 28rpx;
			overflow: hidden;
			.swiper{
				width: 100%;
				height: 100%;
			}

		}
	}
</style>

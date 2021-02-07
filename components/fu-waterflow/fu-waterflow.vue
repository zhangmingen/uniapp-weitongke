<template>
	<view class="wrap">
		<view class="title text-lg text-bold text-center flex justify-center align-center">
			<image src="/static/shop/l.png" mode=""></image>
			为你推荐
			<image src="/static/shop/r.png" mode=""></image>
		</view>
		<view class="content">
      <view class="grid col-2">
        <block v-for="(item,index) in lists" :key="item.name">
          <view class="padding-lr-xs">
            <fu-goods-block :info="item"></fu-goods-block>
          </view>
        </block>
      </view>
		</view>
		<uni-load-more :status="status" v-if="lists.length > 5"></uni-load-more>
	</view>
</template>

<script>
	export default {
		props:['num','titleNone'],
		data() {
			return {
				lists: [],
				status: 'more',
				page: 1,
			};
		},
		methods: {
			loadData(){
				if(this.status != 'more') return;
				this.status = 'loading';
				this.$api.post(global.apiUrls.postRecomment, {
					type: 0,
					page: this.page,
					size: this.num || 10,
				})
				.then(res => {
					console.log("推荐商品", res)
					if (res.data.code == 1) {
						if (this.page == 1) this.lists = [];
						this.lists.push(...res.data.data.data);
						if (res.data.data.data.length < 10) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
							this.page++;
						}
						uni.stopPullDownRefresh();
					}else{
						this.status = 'more';
						uni.stopPullDownRefresh();
					}
				})
				.catch(err => {
					console.log("获取推荐列表 ERROR => ",err);
					this.status = 'more';
					uni.stopPullDownRefresh();
				})
			},
			refresh(){
				this.page = 1;
				this.status = 'more';
				this.loadData();
			}
		},
		created() {
			this.loadData();
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		.title{
			height: 100rpx;
			line-height: 100rpx;
			image{
				width: 48rpx;
				height: 32rpx;
				margin: 0 24rpx;
			}
		}
		.content{
			padding: 0 20rpx;
		}
	}

</style>

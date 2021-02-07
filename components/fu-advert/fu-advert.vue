<template>
	<view class="overHidden">
		<view class="flex padding-lr-sm padding-top-xs" v-if="imgs.length == 1">
			<image class="flex-sub padding-lr-xs" v-for="(item,index) in imgs" :src="item.thumb" mode="aspectFit" @click="navTo(item.href)" :key="index" style="height: 198rpx;"></image>
		</view>
		<view class="flex padding-lr padding-top-xs row-2" v-if="imgs.length == 2">
			<image class="image flex-sub radius-24" v-for="(item,index) in imgs" :src="item.thumb" mode="aspectFill" @click="navTo(item.href)" :key="index" style="height: 178rpx;"></image>
		</view>
		<view class="padding-lr-sm padding-top-xs flex" v-if="imgs.length == 3">
			<view class="flex-sub padding-lr-xs" style="width: 335rpx;height: 210rpx;">
				<image :src="imgs[0].thumb" mode="aspectFit" @click="navTo(imgs[0].href)" style="height: 100%;"></image>
			</view>
			<view class="flex-sub padding-lr-xs" style="width: 335rpx;height: 210rpx;">
				<image class="flex-sub" v-if="index>0" :class="index==1?'margin-bottom-xs':''" v-for="(item,index) in imgs" :src="item.thumb" mode="aspectFit" @click="navTo(item.href)" :key="index" style="height: 100rpx; display: block;"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['typeid'],
		data(){
			return{
				imgs:[]
			}
		},
		created() {
			this.loadData();
		},
		methods:{
			loadData(){
				this.$api.post(global.apiUrls.postAdvert)
        .then(res => {
					console.log("广告位", res);
					if (res.data.code == 1) {
						this.imgs = res.data.data['首页广告'];
					}
				}).catch(err => {
					console.log("广告图 ERROR: ",err);
				})
			},
			navTo(path) {
				if(path.includes('type=tabbar')){
					uni.switchTab({
						url: path
					})
				}else if(path.includes('isLogin=true')){
					this.$util.actionAuth(() => {
						uni.navigateTo({
							url: path
						});
					})
				}else{
					uni.navigateTo({
						url: path
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.row-2{
		.image+.image{
			margin-left: 20rpx;
		}
	}
	.radius-24{
		border-radius: 24rpx;
	}
  image{
    background-color: #EEEEEE;
  }

</style>

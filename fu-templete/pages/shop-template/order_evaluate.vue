<template>
	<view class="page bg-white">
		<cu-custom bgColor="bg-white" :isBack="true">
			<view slot="content">商品评价</view>
		</cu-custom>
		<view class="padding-lr flex padding-tb-sm bg-white" style="width: 100%;overflow: hidden;">
			<view class="radius block-120">
				<image class="radius" :src="goods_thumb" mode="aspectFill"></image>
			</view>
			<view class="padding-left-sm flex-sub flex flex-direction justify-between align-start">
				<text class="text-sm text-cut-2">{{goods_name}}</text>
				<view class="flex">
					<view>
						<block v-for="item in levels" :key="item">
							<image class="img-32 margin-left-xs"
								:src="(item <= level)?'/static/shop/stard2.png':'/static/shop/star2.png'"
								mode="aspectFill"
								@click="changeLevel(item)"
							></image>
						</block>
					</view>
					<view class="star_txt">{{star_txt}}</view>
				</view>
			</view>
		</view>
		<view class="padding">
			<view class="floor_marks">
				<view class="floor-title">评论</view>
				<textarea class="floor_marks-content padding-sm border radius bg-gray" placeholder="符合评价规则,评价超过10个字即可获得积分" v-model="marks"></textarea>
			</view>
			<view class="floor_imgs margin-top">
				<view class="floor-title">添加图片</view>
				<fu-upload :col="4" :max="4" :defaultList="images" @change="chooseImages"></fu-upload>
			</view>
			<view class="floor_3 margin-top">
				<view class="flex align-center justify-start" @tap="handleSwitch">
					<radio :checked="anonymous" color="#ff7b47" style="transform:scale(0.7)"></radio>
					<text class="margin-left">匿名评价</text>
				</view>
			</view>
		</view>
		<button class="cu-btn submit-btn" @click="handleSubmit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				levels: [1,2,3,4,5],
				level: 5,
				imgs: [],
				imgs_ids: [],
				anonymous: false,
				marks: '',
				images: [],
				star_txt:'非常好',
				order_sn: null,
				goods_thumb: null,
				goods_name: '',
			};
		},
		methods: {
			// 切换是否匿名
			handleSwitch(){
				this.anonymous = !this.anonymous;
			},
			chooseImages(val){
				this.images = val;
			},
			changeLevel(item){
				this.level = item;
				switch(item){
					case 1:
						this.star_txt="非常差";
						break;
					case 2:
						this.star_txt="差";
						break;
					case 3:
						this.star_txt="一般";
						break;
					case 4:
						this.star_txt="好";
						break;
					case 5:
						this.star_txt="非常好";
						break;
				}
			},
			//提交评价
			handleSubmit(){
				const uid = global.userInfo && global.userInfo.id || 0;
				if(!this.marks) return this.$message.info('请输入您的评价');
				let data = {
					order_sn: this.order_sn,
          star: this.level,
          content: this.marks,
          thumb: this.images.join(","),
          type: this.anonymous ? 1 : 0,
				}
				this.$api.post(global.apiUrls.postOrderEvaluate,data)
				.then(res => {
					console.log("评价",res);
					if(res.data.code == 1){
            this.$message.info('评论成功');
            setTimeout(function() {
            	uni.navigateBack();
            }, 800);
					}else{
            this.$message.info(res.data.msg);
          }
				})
			}
		},
		onLoad(options) {
			const {order_sn,goods_thumb,goods_name,goods_id,sku_id} = options;
			this.goods_thumb = goods_thumb;
      this.goods_name = goods_name;
			this.order_sn = order_sn;
			this.goods_id = goods_id;
			this.sku_id = sku_id;
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		min-height: 100vh;
		padding-bottom: 120rpx;
		padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	}
	.floor-title{
		height: 80upx;
		font-weight: bold;
	}
	.floor_marks{
		width: 100%;
		.floor_marks-content{
			width: 100%;
		}
	}
	.floor_imgs{
		image{
			margin-right: 20upx;
		}
	}
	.submit-btn{
		position: fixed;
		bottom: 30rpx;
		bottom: calc(30rpx + constant(safe-area-inset-bottom));
		bottom: calc(30rpx + env(safe-area-inset-bottom));
		left: 30rpx;
		right: 30rpx;
		height: 88rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 88rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		z-index: 9999;
    background-color: $fu-main-color;
	}
	.evaluate-level{
		font-size: 32rpx;
		color: #333333;
		line-height: 62rpx;
	}
	.img-32{
		width: 32rpx;
		height: 32rpx;
	}
	.star_txt{
		font-size: 26rpx;
		color: #666;
		padding-left: 20rpx;
	}
	.block-120{
		width: 120rpx;
		height: 120rpx;
		min-width: 120rpx;
		min-height: 120rpx;
    background-color: #EEEEEE;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>

<template>
	<view class="page">
    <view class="cu-custom bg-white solid-bottom" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
      <view class="cu-bar bg-white fixed solid-bottom" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
        <view class="search-form round" @tap="navToSearch">
          <text class="cuIcon-search"></text>
          <!-- <text class="">小米手机</text> -->
        </view>
      </view>
    </view>
		<view :style="{height: 'calc(100% - '+CustomBar+'px)'}" class="content">
			<scroll-view class="left" scroll-y>
				<block v-for="(item,index) in lists" :key="index">
					<view class="item text-center" :class="{'active': index == currentIndex}" @click="handleSelect(item,index)">
						{{item.name}}
					</view>
				</block>
			</scroll-view>
			<view class="right">
				<scroll-view class="classify-box" scroll-y>
					<block v-for="(item,i) in level2" :key="item.id">
						<view class="text-df flex text-333 padding-tb-sm text-center"><view></view>{{item.name}}<view></view></view>
						<view class="cu-list grid col-3 no-border">
							<view class="cu-item flex justify-center align-center" v-for="(ele,j) in item.child" :key="ele.id" @click="navToList(ele.id)">
								<view class="block-120 bg-gray">
									<image :src="ele.thumb" mode="aspectFill" lazy-load></image>
								</view>
								<text class="text-333 text-sm">{{ele.name}}</text>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
        StatusBar: this.StatusBar,
				currentIndex: 0,
				lists: [],
				banners: [],
				search_val:'',
				search_index: 0,
			}
		},
		computed: {
			level2(){
				return this.lists[this.currentIndex] && this.lists[this.currentIndex].child || [];
			}
		},
		onLoad(){
			this.loadData();
		},
		methods: {
			// 选择大类
			handleSelect(item,index){
				this.currentIndex = index;
			},
			// 获取分类
			loadData(){
        this.$api.post(global.apiUrls.postGoodsGetCategoryList)
        .then(res => {
          if(res.data.code == 1){
            console.log('分类',res)
            this.lists = res.data.data;
          }else{
            this.$message.error(res.data.msg);
          }
        })
			},
			// 去分类列表页
			navToList(cid){
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/classify_goods_list',
          params: {
            cid: cid
          }
        });
			},
			navToSearch(){
        this.$urouter.navigateTo('/fu-templete/pages/search-template/search');
			},
		}
	}
</script>

<style lang='scss' scoped>
	.page{
		height: 100vh;
		.content{
			display: flex;
			.left{
				width: 168rpx;
				min-width: 168rpx;
				height: 100%;
				background-color: #F8F8F8;
				.item{
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					transition: all 0.2s;
					font-size: 24rpx;
					color: 666;
				}
				.item.active{
					color: $fu-main-color;
					background-color: #FFFFFF;
					font-size: 32rpx;
				}
			}
			.right{
				flex: 1;
				background-color: #FFFFFF;
			}
		}
	}
	.right{
		height: 100%;
		display: flex;
		flex-direction: column;
		.swiper-box{
			padding: 24rpx;
			.swiper{
				height: 180rpx;
				.swiper-item{
					.swiper-item-img{
						width: 100%;
						height: 100%;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
		.classify-box{
			height: 100%;
			padding: 0 24rpx;
			.block-120{
				width: 120rpx;
				min-width: 120rpx;
				height: 120rpx;
				min-height: 120rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.cu-bar .search-form{
		line-height: 52rpx;
		height: 52rpx;
	}
	.text-df{
		justify-content: center;
		align-items: center;
		view{
			width: 120rpx;
			height: 3rpx;
			background: #ccc;
			margin: 0 15rpx;
		}
	}
</style>

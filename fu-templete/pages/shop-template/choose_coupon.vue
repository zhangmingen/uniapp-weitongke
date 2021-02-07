<template>
	<view class="page">
		<scroll-view scroll-y class="content" v-if="list.length > 0">
			<checkbox-group>
				<block v-for="(item,index) in list" :key="item.id">
					<label @click="choose(item,index)">
						<view class="flex padding-lr margin-tb-sm height-150 wrap">
							<view class="flex align-center justify-center">
								<checkbox
									class='round'
									:class="item.checked ? 'checked' : ''"
									:checked="item.checked ? true : false"
									:value="item.id+''"
									style="transform:scale(0.7)"
								></checkbox>
							</view>
							<view class="flex-sub margin-left-sm bg-white shadow radius list-item flex align-center padding-lr-sm">
								<view class="left radius">
									<text class="text-price">{{item.money | filterPrice}}</text>
								</view>
								<view class="right flex-sub flex">
									<view class="flex-sub padding-left-sm flex flex-direction justify-around">
										<text class="text-sm text-333 text-cut">{{item.coupon_name}}</text>
										<text class="text-sm" v-if="item.type == 1">使用限制：无限制</text>
										<text class="text-cut text-333 text-sm" v-else>使用限制：满{{item.min_order_money}}元使用</text>
										<text class="text-cut text-sm text-999 margin-top-xs">有效期至：{{item.end_time}}</text>
									</view>
								</view>
							</view>
						</view>
					</label>
				</block>
			</checkbox-group>
		</scroll-view>
		<view class="kong flex flex-direction justify-center align-center" v-else>
      <fu-empty-01 title="暂无可用优惠券"></fu-empty-01>
		</view>
		<view class="bottom-bar padding-lr-xs flex justify-end align-center">
			<view class="margin-right text-df">已选{{curCoupon ? '1' : '0'}}张,共抵扣<text class="text-red">{{curCoupon ? curCoupon.money : '0'}}</text>元</view>
			<button class="cu-btn shadow round fu-bgcred text-white" style="width: 160rpx;" @click="confirm">确认</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cids: '',
				order_price: '',
				coupon_id: '',
				list: [],
				curIndex: -1,
				all_money:''
			};
		},
		computed: {
			curCoupon(){
				if(this.curIndex == -1) return null;
				return this.list[this.curIndex];
			},
		},
		onLoad(options) {
			const {coupon_id,order_price,cid,all_money} = options;
			if(order_price){
				this.order_price = order_price
			}
			if(coupon_id){
				this.coupon_id = coupon_id;
			}
			if(cid){
				this.cids = cid;
			}
			if(all_money){
				this.all_money = all_money;
			}
			this.getCouponList();
		},
		filters: {
			filterPrice(val){
				return val.toString().split('.')[0]
			}
		},
		methods: {
			getCouponList(){
				this.$api.post(global.apiUrls.postOrderCanUseCoupon,{
					money: this.order_price,
					category_id: this.cids,
					all_money:this.all_money
				}).then(res => {
					console.log("可用优惠券列表: ", res);
				    if (res.data.code == 1) {
				        this.list = res.data.data;
						this.initSelected();
				    }
				});
			},
			// 初始化默认选中的优惠券
			initSelected(){
				if(!this.coupon_id) return ;
				this.list.forEach((item,index) => {
					if(item.id == this.coupon_id){
						item.checked = true;
						this.curIndex = index;
					}else{
						item.checked = false;
					}
				})
			},
			// 切换选中
			choose(item,idx){
				if(item.checked){
					item.checked = false;
					this.curIndex = -1;
				}else{
					item.checked = true;
					this.curIndex = idx;
				}
				this.list.forEach((ele,index) => {
					if(index !== idx ){
						ele.checked = false;
					}
				})
			},
			// 确认选用优惠券
			confirm(){
				uni.$emit('select_coupon',this.curCoupon);
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100%;
		min-height: 100%;
		background-color: #F6F6F6;
		.content{
			height: calc(100% - 100rpx);
			height: calc(100% - 100rpx - constant(safe-area-inset-bottom));
			height: calc(100% - 100rpx - env(safe-area-inset-bottom));
		}
		.kong{
			height: 60vh;
		}
	}
	.bottom-bar{
		height: 100rpx;
		height: calc(100rpx + constant(safe-area-inset-bottom));
		height: calc(100rpx + env(safe-area-inset-bottom));
		box-shadow: 0 0 15rpx #EEEEEE;
		position: fixed;
		bottom: 0;
		bottom: constant(safe-area-inset-bottom);
		bottom: env(safe-area-inset-bottom);
		left: 0;
		right: 0;
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #FFFFFF;
	}
	.height-150{
		height: 150rpx;
	}
	.list-item{
		.left{
			width: 120rpx;
			min-width: 120rpx;
			height: 120rpx;
			color: $fu-main-color;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 48rpx;
			font-weight: bold;
		}
	}
	.block-262{
		width: 262rpx;
		height: 262rpx;
		min-width: 262rpx;
		min-height: 262rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}


</style>

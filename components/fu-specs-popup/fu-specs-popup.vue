<template>
	<uni-popup ref="spec" type="bottom" :maskClick="true" @touchmove="">
		<view class="wrap">
			<view class="flex justify-between">
				<view class="margin-right">
					<image class="block-150 radius bg-gray" mode="aspectFill" :src="info.thumb"></image>
				</view>
				<view class="flex-sub flex flex-direction justify-end">
					<view class="text-xl fu-cred text-bold">
						<text class="text-price text-df"></text>
						<text class="">{{ info.price}}</text>
					</view>
					<view class="text-sm text-999 margin-top-xs">库存 {{stock}}</view>
					<view class="text-df text-666 margin-top-xs" v-if="info.is_spec == 1">已选择: {{selectedSpec}}</view>
				</view>
				<view class="close-box">
					<text class="cuIcon-close" @tap="close"></text>
				</view>
			</view>
			<view class="margin-top" v-if="speclist.length > 0">
				<block v-for="(item, index) in speclist" :key="index">
					<view>
						<view class="text-sm text-333 text-bold padding-bottom-sm">{{ item.name }}</view>
						<view class="item">
							<block v-for="(item2, index2) in item.spec_value" :key="index2">
								<view
									class="item-tag"
									:class="{'active': selectIndex[index] == index2,'disable': item2.disabled == true}"
									@tap="selectSpec(item2, index,index2)"
								>
									{{ item2.item }}
								</view>
							</block>
						</view>
					</view>
				</block>
			</view>
			<view class="margin-top">
				<view class="flex justify-between align-center padding-tb-sm">
					<view class="text-666 text-df">数量</view>
					<uni-number-box :value="number" :min="min" :max="max" @change="setnumber" :step="1"></uni-number-box>
				</view>
				<view class="text-right text-theme text-sm" v-if="limit>0">此商品限购{{limit}}件</view>
			</view>
			<view class="margin-top flex round overHidden">
				<view v-if="type == 'all' || type == 'cart'" class="flex-sub btn color1" @tap.stop="handleAddCart">加购物车</view>
				<view v-if="type == 'all' || type == 'buy'" class="flex-sub btn color2" @tap.stop="handleBuyNow">立即抢购</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		props: {
			speclist: {
				type: Array,
				default () {
					return []
				}
			},
			skulist: {
				type: Array,
				default () {
					return []
				}
			},
			currentId: {
				type: [String, Number],
				default: 0,
			},
			info: {
				type: Object,
			},
			limit: {
				type: Number,
				default: 0,
			}
		},
		data() {
      console.log('info',this.info)
			return {
				/**
				 * 加入类型
				 * 点击加购物车打开弹窗,只展示加购物车按钮 (type: cart)
				 * 点击立即购买打开痰喘,只展示立即购买按钮 (type: buy)
				 * 点击规格栏目打开弹窗,两个按钮都展示 (type: all)
				 * */
				type: 'all', //
				selectArr: [], // 选中的值
				selectIndex: [], // 选中的index
				shopItemInfo: {}, // 匹配字典
				number: 1, // 数量
				stock: 0,
				min: 1,
				max: 100,
			};
		},
		computed: {
			selectedSpec(){
				return this.selectArr.join('-');
			}
		},
    watch: {
      info(val){
        this.stock = val.stock;
      }
    },
		methods: {
			// 初始化规格
			init() {
				let skuInfo = this.skulist.find(item => item.sku_id == this.currentId);
				this.selectArr = skuInfo.sku_spec;
				this.speclist.forEach((item,index) => {
					item.spec_value.forEach((item2,index2) => {
						item2.disabled = false;
						if(skuInfo.sku_spec[index] == item2.item){
							this.selectIndex.push(index2);
						}
					})
				})
				this.checkItem();
				this.checkInpath(-1);
			},
			//
			checkItem() {
				let result = this.skulist.reduce(
					(arrs, items) => {
						return arrs.concat(
							items.sku_spec.reduce(
								(arr, item) => {
									return arr.concat(
										arr.map((item2) => {
											if (!this.shopItemInfo.hasOwnProperty([...item2, item])) {
												this.shopItemInfo[[...item2, item]] = items;
											}
											return [...item2, item];
										})
									);
								},
								[
									[]
								]
							)
						);
					},
					[
						[]
					]
				);
			},
			//
			checkInpath(clickIndex) {
				for (let i = 0, len = this.speclist.length; i < len; i++) {
					if (i == clickIndex) {
						continue;
					}
					let len2 = this.speclist[i].spec_value.length;
					for (let j = 0; j < len2; j++) {
						if (this.selectIndex[i] != -1 && this.selectIndex[i] == j) {
							continue;
						}
						let choose_copy = [...this.selectArr];
						this.$set(choose_copy, i, this.speclist[i].spec_value[j].item);
						let choose_copy2 = choose_copy.filter(
							(item) => item !== "" && typeof item != "undefined"
						);
						if (this.shopItemInfo.hasOwnProperty(choose_copy2)) {
							this.$set(this.speclist[i].spec_value[j], "disabled", false);
						} else {
							this.$set(this.speclist[i].spec_value[j], "disabled", true);
						}
					}
				}
				this.$emit('changeSpec',this.shopItemInfo[this.selectArr]);
				this.setStock(this.shopItemInfo[this.selectArr]);
			},
			//
			selectSpec(item, index, index2) {
				if (item.disabled) return;
				if (this.selectIndex[index] == index2) return;
				if (this.selectArr[index] != item.item) {
					this.$set(this.selectArr, index, item.item);
					this.$set(this.selectIndex, index, index2);
				} else {
					this.$set(this.selectArr, index, "");
					this.$set(this.selectIndex, index, -1);
				}
				this.checkInpath(index);
			},
			// 设置数量
			setnumber(e){
				this.number = e;
				this.$emit('changeNumber',e);
			},
			//
			setStock(skuInfo){
				const { stock } = skuInfo;
				this.stock = stock;
				let limit = this.limit;
				if(limit == 0){
					this.max = stock;
				}else{
					let n = stock > limit ? limit : stock;
					this.max = n;
				}
			},
			// 打开弹窗
			open(type) {
				this.type = type || 'all';
				this.$refs.spec.open();
			},
			// 关闭弹窗
			close() {
				this.$refs.spec.close();
			},
			// 加入购物车
			handleAddCart(){
				this.close();
				this.$emit('addCart');
			},
			// 立即购买
			handleBuyNow(){
				this.close();
				this.$emit('buyNow');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.close-box {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background-color: rgba(0, 0, 0, .1);
			display: flex;
			align-items: center;
			justify-content: center;
			color: #999999;
			font-size: 28rpx;
			font-weight: bold;
		}
		.item{
			display: flex;
			flex-wrap: wrap;
			.item-tag{
				display: inline-block;
				font-size: 24rpx;
				color: #333;
				background-color: #F5F5F5;
				padding: 12rpx 24rpx;
				border-radius: 100rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border: 2rpx solid #F5F5F5;
			}
			.item-tag.active{
				background-color: #FFF2EF;
				color: #f8324b;
				border-color: #f8324b;
			}
			.item-tag.disable{
				color: #CCCCCC!important;
			}
		}
		.btn {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #FFFFFF;
		}
	}

	.block-150 {
		width: 150rpx;
		height: 150rpx;
		min-width: 150rpx;
		min-height: 150rpx;
	}

	.color1 {
		background-color: #343434;
	}

	.color2 {
		background-color: #f8324b;
	}
  .overHidden{
    overflow: hidden;
  }
</style>

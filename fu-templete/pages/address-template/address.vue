<template>
	<view class="page">
		<radio-group>
			<view class="list-box">
				<block v-for="(item, index) in address_list" :key="index">
					<view class="list-item" @click="handleClick(item)">
						<label class="item-left">
							<view class="left-radio" v-if="is_change == 1">
								<radio style="transform: scale(0.7);" :value="item.address_id+''" :checked="item.is_default=='1'"></radio>
							</view>
							<view class="left-info">
								<view class="info-top">
									<text>{{ item.name }}</text>
									<text class="margin-left-sm">{{ item.mobile | filterMobile }} <text class="tag" v-if="item.is_default == 1">默认</text> </text>
								</view>
								<view class="info-bot text-cut">{{ item.province }} {{ item.city }} {{ item.district }} {{ item.address }}</view>
							</view>
						</label>
						<view class="item-right" @click.stop="edit(item)">编辑</view>
					</view>
				</block>
			</view>
		</radio-group>
		<!-- 空列表展示 -->
		<view v-if="address_list.length == 0 && isInit" class="text-xl text-center text-gray flex flex-direction align-center justify-center" style="height: 50vh;">
      <image src="../../../static/empty/empty07.png"></image>
			<text class="margin-top">您未添加任何地址</text>
		</view>
		<view class="bottom-action padding-lr flex justify-around">
			<!-- #ifdef MP-WEIXIN -->
      <fu-button type="success" shape="circle" @click="toLeadWc" :customStyle="customStyle">导入微信地址</fu-button>
			<!-- <view class="cu-btn block round text-white bg-green height-88" @tap="toLeadWc">导入微信地址</view> -->
			<!-- #endif -->
      <fu-button type="primary" shape="circle" @click="add_Addr" :customStyle="customStyle">新增收货地址</fu-button>
			<!-- <view class="cu-btn block round bg-red height-88" @tap="add_Addr">新增收货地址</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkInx: 0, //选中地址的下标
				address_list: [],
				is_change: 0,
				choose_id: 0,
				edit_id: 0,
				backData: null, // 选中返回值
        isInit: false,
        customStyle: {
          flex: 1
        }
			};
		},
		onShow() {
			this.getMsg();
		},
		onLoad(options) {
			const {type = 0, id = 0} = options;
			this.is_change = type;
			this.choose_id = id;
		},
		onUnload() {
			if (this.is_change == 1) {
				uni.$emit('select_address', this.backData);
			}
		},
		onPullDownRefresh() {
			this.getMsg();
		},
		filters: {
			filterMobile(val) {
				if (!val) return '';
				return val.substr(0, 3) + '****' + val.substr(-4);
			}
		},
		methods: {
			getMsg() {
				// 获取地址列表
				this.$api.post(global.apiUrls.getUserAddressAddressList).then(res => {
					console.log("地址列表", res);
          if(res.data.code == 1){
            this.address_list = res.data.data;
            this.isInit = true;
            // 如果是下单页跳过来的,作如下处理
            if (this.is_change == 1) {
            	let addrObj = this.address_list.find((item) => {
            		return item.address_id == this.choose_id;
            	});
            	if (!addrObj) {
            		addrObj = this.address_list.find((item) => {
            			return item.is_default == 1;
            		})
            	}
            	if (!addrObj) {
            		addrObj = this.address_list[0];
            	}
            	if (!addrObj) {
            		addrObj = null;
            	}
            	this.backData = addrObj;

            }
          }else{
            this.$message.info(res.data.msg);
						this.address_list = [];
						this.backData = null;
          }
          this.$nextTick(function(){
          	uni.stopPullDownRefresh();
          })
				});
			},
			handleClick(item){
				if (this.is_change == 1) {
					this.backData = item;
					uni.navigateBack();
				}
			},
			// 编辑地址
			edit(item) {
				this.edit_id = item.address_id;
				this.add_Addr(item);
			},
			// 添加地址
			add_Addr(item) {
				//添加收货地址  或  修改地址
				uni.navigateTo({
					url: '/fu-templete/pages/address-template/add_address?id=' + (item.address_id || '')
				});
			},
			// 导入微信地址
			toLeadWc(){
				uni.chooseAddress({
					success: (res) => {
						console.log(res);
						let data = {
							userName: res.userName,
							telNumber: res.telNumber,
							provinceName: res.provinceName || res.cityName,
							cityName: res.cityName,
							countyName: res.countyName,
							detailInfo: res.detailInfo,
							is_change: this.is_change
						};
						if(this.is_change == 1){
              this.$urouter.redirectTo({
                url: '/fu-templete/pages/address-template/add_address_wc',
                params: data
              })
						}else{
              this.$urouter.navigateTo({
                url: '/fu-templete/pages/address-template/add_address_wc',
                params: data
              })
						}
					}
				})
			},
      serialize(data){
      	let str = '';
      	Object.keys(data).forEach(key => {
      		str += key + '=' + data[key] + '&'
      	})
      	str = str.substr(0,str.length - 1);
      	return str;
      }
		}
	};
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #FFFFFF;
    padding-bottom: 160rpx;
    padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
	}

	.list-box {
		width: 750rpx;

		.list-item {
			width: 100%;
			height: 120rpx;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #efefef;
			display: flex;
			padding: 0 30rpx;

			.item-left {
				width: 600rpx;
				display: flex;

				.left-radio {
					width: 60rpx;
					min-width: 60rpx;
					height: 120rpx;
					display: flex;
					justify-content: flex-start;
					align-items: center;
				}

				.left-info {
					width: 540rpx;
					flex: 1;
					height: 120rpx;

					.info-top {
						margin-top: 20rpx;
						font-size: 28rpx;
						line-height: 1.5;
						color: #333333;
						font-weight: bold;
            display: flex;
            align-items: center;
            .tag{
              display: inline-block;
              width: 70rpx;
              height: 30rpx;
              line-height: 30rpx;
              font-size: 20rpx;
              margin-left: 10rpx;
              background-color: #F02523;
              color: #FFFFFF;
              text-align: center;
              border-radius: 4rpx;
            }
					}

					.info-bot {
						margin-top: 10rpx;
						font-size: 28rpx;
						color: #999999;
					}
				}
			}

			.item-right {
				width: 90rpx;
				min-width: 90rpx;
				height: 120rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #ef4b66;
			}
		}
	}

	.bottom-action {
		position: fixed;
		right: 0;
		left: 0;
		bottom: 50rpx;
		bottom: calc(50rpx + constant(safe-area-inset-bottom));
		bottom: calc(50rpx + env(safe-area-inset-bottom));
		view{
			flex: 1;
			margin: 0 15rpx;
		}
	}
  .height-88{
    height: 88rpx;
  }
</style>

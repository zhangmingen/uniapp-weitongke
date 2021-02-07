<template>
	<view >
    <view class="Address"  @tap="handleJump" :data-url="'/fu-templete/pages/location-templete/location'">
    	<text>{{location}}</text>
    </view>
		<view class="Address" @click="chooseLocation">
			<text>{{Address}}</text>
		</view>
		<view class="Address" >
			<text>省</text>
			<text>{{province}}</text>
		</view>
		<view class="Address">
			<text>市</text>
			<text>{{city}}</text>
		</view>
		<view class="Address">
			<text>区</text>
			<text>{{district}}</text>
		</view>
		<view class="Address">
			<text>详细地址</text>
			<text>{{shopAddressDetail}}</text>
		</view>
		<view class="Address">
			<text>纬度</text>
			<text>{{latitude}}</text>
		</view>
		<view class="Address">
			<text>经度</text>
			<text>{{longitude}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				location: '点击选择定位', //定位区县
				latitude:'',//纬度
				longitude:'',//经度
				Address:'点击地图选点',//展示地址
				province:'',//省
				city:'',//市
				district:'',//区
				shopAddressDetail:'',//详细地址
			}
		},
		onLoad() {
			let that = this;
			try {
				const city_data = uni.getStorageSync('city_data');
				if (city_data && city_data.disDes) {
					that.location = city_data.disDes;
					that.getShopLocation2();
				} else {
					that.getShopLocation();
				}
			} catch (e) {
				that.getShopLocation();
			}
			uni.$on("changeLocation", function(data) {
				that.location = data.disDes;
				that.shopList = [];
			})
		},
		methods: {
			getShopLocation() {

				let _this = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						if (res.address) {
							_this.latitude = res.latitude;
							_this.longitude = res.longitude;
							_this.location = res.address.district;
						}
					},
				});
			},
			getShopLocation2() {
				uni.showLoading({
					title:'获取定位中'
				})
				let _this = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						uni.hideLoading()
						if (res.address) {
							_this.latitude = res.latitude;
							_this.longitude = res.longitude;
						}
					},
				});
			},
			chooseLocation(){
				let _this = this;
				uni.chooseLocation({
					type: 'gcj02',
					geocode:true,
					success: function (res) {
						var point = new plus.maps.Point(res.longitude, res.latitude);
						plus.maps.Map.reverseGeocode(
							point,
							{},
							function(event) {
								let address = event.address;//全部地址
								var reg = /.+?(省|市|自治区|自治州|县|区)/g;
								let addressList=address.match(reg).toString().split(",");
								_this.province = addressList[0] //省
								_this.city = addressList[1]//市
								_this.district = addressList[2]//区
								_this.longitude = point.longitude //经度
								_this.latitude = point.latitude//纬度
								let shopAddress = addressList[0] + addressList[1] + addressList[2] //省市区
								_this.shopAddressDetail = address.substring(shopAddress.length,address.length)//详细地址
							},
							function(e) {}
						);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
  page{
    background-color: #FFFFFF;
   /*  头部 */
   .header {width: 100%;display: flex;align-items: center;background: linear-gradient(132deg, rgba(226, 35, 26, 1) 0%, rgba(200, 37, 25, 1) 100%);box-sizing: border-box;
   	padding: 0 32rpx;position: fixed;top: 0;left: 0;z-index: 5;
   	.location {display: flex;align-items: center;
   		text {font-size: 28rpx;color: #fff;
   			&.iconfont {margin-left: 10rpx;}
   		}
   	}
   	.search {flex: 1;display: flex;align-items: center;height: 58rpx;background-color: #fff;border-radius: 29rpx;margin: 0 24rpx;padding: 0 24rpx;
   		icon {font-size: 10rpx;margin-right: 12rpx;}
   		input {flex: 1;font-size: 28rpx;color: #333;}
   	}
   }
   .Address{
   	display: flex;
   	justify-content: space-between;
   	padding: 0 16px;
   	border-bottom: 1px solid #eee;
   	line-height: 45px;
   	text{
   		font-size: 15px;
   		color: #333333;
   	}
   }
  }

</style>

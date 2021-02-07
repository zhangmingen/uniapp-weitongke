<template>
	<view class="page">
		<view class="addAddr">
			<view class="cell">
				<text class="title">收货人</text>
				<input type="text" maxlength="8" v-model="name" placeholder="姓名" />
			</view>
			<view class="cell">
				<text class="title">联系电话</text>
				<input type="number" v-model="phone" maxlength="11" placeholder="手机号" />
			</view>
			<view class="cell">
				<text class="title">所在地区</text>
				<view class="flex flex-sub">
					<input class="flex-sub" type="text" disabled v-model="address" placeholder="请选择" @click="showMulLinkageThreePicker" />
				</view>
			</view>
			<view class="cell">
				<text class="title">详细地址</text>
				<input type="text" v-model="addressDesc" maxlength="50" placeholder="详细地址(50字内)" />
			</view>
			<view class="flex justify-between cell margin-top">
				<view class="">设为默认收货地址</view>
				<switch @change="handleSwitch" :class="is_default?'checked':''" :checked="is_default?true:false"></switch>
			</view>
		</view>
		<view class="padding-lr" style="margin-top: 50rpx;">
      <fu-button type="primary" shape="circle" @click="submit">保存并使用该地址</fu-button>
		</view>
		<w-picker mode="region" default-type="value" @confirm="onConfirm($event)" ref="region"></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
			wPicker
		},
		computed: {
			address() {
				return this.province + this.city + this.district;
			},
		},
		data() {
			return {
				phone: '', // 联系电话
				name: '', // 收货人
				is_default: true, // 是否默认
				province: '', // 省
				city: '', //市
				district: '', //区
				addressDesc: '', // 详细地址
				is_change: 0, //是否是从下单页面进来1是
			};
		},
		onLoad(options) {
			let {userName,telNumber,provinceName,cityName,countyName,detailInfo,is_change = 0} = options;
			this.name = userName;
			this.phone = telNumber;
			this.province = provinceName;
			this.city = cityName;
			this.district = countyName;
			this.addressDesc = detailInfo;
			this.is_change = is_change;
		},
		methods: {
			// 地址选择回调
			onConfirm(val) {
				this.province = val.obj.province.label;
				this.city = val.obj.city.label;
				this.district = val.obj.area.label;
				this.addressDesc = '';
			},
			// 选择设为默认
			handleSwitch() {
				this.is_default = !this.is_default
			},
      showMulLinkageThreePicker() {
      	uni.hideKeyboard();
      	this.$refs.region.show();
      },
			// 提交
			submit() {
				// 表单验证
				if (this.name.trim() == '') {
					this.$message.info('请输入收货人姓名');
          this.name = '';
					return false;
				};
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
          let text = !this.phone ? '请输入手机号码' : '请填写正确手机号码';
          this.$message.info(text);
					return false;
				}
				if (this.address == '') {
					this.$message.info('请选择所在地区');
					return false;
				}
				if (this.addressDesc.trim() == '') {
					this.$message.info('请填写所在街道或门牌号');
          this.addressDesc = '';
					return false;
				}
				let data = {
					name: this.name, // 姓名
					mobile: this.phone, // 手机
					is_default: this.is_default ? 1 : 0, // 是否默认地址
					address: this.addressDesc, // 详细地址
					province: this.province,
					city: this.city,
					district: this.district,
				}
				let url = global.apiUrls.postUserAddressAddAddress;
				// 提交
				console.log(data);
				this.$api.post(url, data)
				.then(res => {
					console.log("增加地址:",res);
					if (res.data.code == 1) {
						this.$message.info(res.data.msg);
						// let addr = res.data.data[0];
						// addr.address_id = addr.id;
						// if(this.is_change == 1){
						// 	uni.$emit('select_address', addr);
						// }
						setTimeout(() => {
							uni.navigateBack()
						}, 800);
					}else{
						this.$message.info(res.data.msg);
					}
				}).catch(err => {
					console.log("err: ", err);
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background: #FFFFFF;
	}

	.addAddr {
		padding: 0 20upx;

		.uni-list-cell {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 20upx 0;
			box-sizing: border-box;
			height: 100upx;
			font-size: 30upx;
			background: #fff;

			switch {
				transform: scale(0.7)
			}
		}

		.addr {
			font-size: 32upx;
			padding: 30upx 0;
			border-bottom: 1px solid #f5f5f7;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;

			.addr_title {
				display: inline-block;
				width: 180rpx;
			}

			.chose_addr {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				width: 70%;
			}
		}

		.cell {
			font-size: 32upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			height: 110upx;
			border-bottom: 1px solid #f5f5f7;

			.title {
				display: inline-block;
				width: 180rpx;
			}

			input {
				flex: 1;
				color: #999999;
			}
		}

		.address {
			display: flex;
			flex-direction: column;
			font-size: 32upx;

			.title {
				line-height: 110upx;
			}

			textarea {
				height: 120upx;
			}
		}

		.tips {
			padding: 20upx 0;
			font-size: 26upx;
		}
	}
  .height-88{
    height: 88rpx;
  }
</style>

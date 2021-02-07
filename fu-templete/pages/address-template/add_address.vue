<template>
	<view class="page">
		<view class="addAddr">
			<view class="cell">
				<text class="title">收货人</text>
				<input type="text" maxlength="8" v-model="name" placeholder="姓名" />
			</view>
			<view class="cell">
				<text class="title">联系电话</text>
				<input type="number" maxlength="11" v-model="phone" placeholder="手机号" />
        <text v-if="phone.length > 0" class="margin-right cuIcon-roundclose" @click="clear" style="font-size: 36rpx;"></text>
			</view>
			<view class="cell">
				<text class="title">所在地区</text>
				<view class="flex flex-sub" >
					<input class="flex-sub" type="text" disabled="" v-model="address" placeholder="请选择" @click="showMulLinkageThreePicker" />
					<text class="margin-right cuIcon-locationfill" @click="location"></text>
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
		<view class="padding-lr" style="margin-top: 100rpx;">
      <fu-button type="primary" shape="circle" @click="sub_sure">提交</fu-button>
		</view>
    <view class="padding-lr" style="margin-top: 50rpx;">
      <fu-button  v-if="edit_id" shape="circle" type="error" @click="delAddr">删除地址</fu-button>
    </view>
		<w-picker
			mode="region"
			default-type="value"
			@confirm="onConfirm($event)"
			ref="region"
		></w-picker>
	</view>
</template>

<script>
	import amapFile from './libs/amap-wx.js';
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
			wPicker
		},
		computed: {
			address(){
				return this.province + this.city + this.district;
			},
		},
		data() {
			return {
				phone: '', // 联系电话
				name: '', // 收货人
				is_default: true, // 是否默认
				edit_id: null, // 是否是修改收货地址
				myAmapFun: null, // 高德地图实例
				province: '', // 省
				city: '', //市
				district: '', //区
				addressDesc: '', // 详细地址
        customStyle: {
          'backgroundColor': '#cccccc',
          'color': '#ffffff',
        }
			};
		},
		onLoad(options) {
      // 换成自己的key
			this.myAmapFun = new amapFile.AMapWX({key: 'da1c01509a0dbea0bff1d85d45edc378'});
			//如果是修改地址
			if (options.id) {
				console.log("修改地址",options.id);
				this.edit_id = options.id;
				uni.setNavigationBarTitle({
					title: '编辑收货地址'
				});
				this.get_editAddress();
			}else{
        this.autoGetLocation()
				// this.phone = global.userInfo && global.userInfo.mobile || '';
				this.name = global.userInfo && global.userInfo.user_name || '';
			}
		},
		methods: {
			//获取修改地址信息
			get_editAddress() {
				this.$api.post(global.apiUrls.postUserAddressGetOneAddress, {
					address_id: this.edit_id
				}).then(res => {
					console.log(res, '修改的信息');
          if(res.data.code == 1){
            let data = res.data.data;
            this.name = data.name;
            this.phone = data.mobile;
            this.province = data.province;
            this.city = data.city;
            this.district = data.district;
            this.addressDesc = data.address;
            this.is_default = data.is_default == '1' ? true : false;
          }else{
            this.$message.info(res.data.msg);
          }
				}).catch(err => {
          this.$message.error(err.msg);
					console.log(err);
				})
			},
			// 三级联动选择
			showMulLinkageThreePicker() {
				uni.hideKeyboard();
				this.$refs.region.show();
				console.log("???")
			},
			// 地址选择回调
			onConfirm(val) {
				this.province = val.obj.province.label;
				this.city = val.obj.city.label;
				this.district = val.obj.area.label;
				// this.addressDesc = '';
			},
      // 选择设为默认
			handleSwitch() { 
				this.is_default = !this.is_default
			},
			// 定位地址
			location(){
        uni.chooseLocation({
          success: (res) => {
            console.log(res,'地图');
            this.myAmapFun.getRegeo({
              location: res.longitude+','+res.latitude,
            	success: (data) => {
            		//成功回调
            		console.log('sdk回调',data);
            		let regeoData = data[0].regeocodeData.addressComponent;
            		this.province = regeoData.province;
            		this.city = regeoData.city;
            		this.district = regeoData.district;
            		this.addressDesc = res.name;
            	},
            	fail: (info) => {
            		//失败回调
            		console.log(info)
            	}
            })
          }
        })
			},
      autoGetLocation(){
        uni.getLocation({
          geocode: true,
          success: (adr) => {
            console.log(adr)
            // #ifdef APP-PLUS
            let address = adr.address;
            this.province = address.province;
            this.city = address.city;
            this.district = address.district;
            this.addressDesc = address.street+address.streetNum+address.poiName;
            // #endif
            // #ifndef APP-PLUS
            this.myAmapFun.getRegeo({
              location: adr.longitude+','+adr.latitude,
            	success: (data) => {
            		//成功回调
            		console.log('sdk回调',data);
            		let regeoData = data[0].regeocodeData.addressComponent;
            		this.province = regeoData.province;
            		this.city = regeoData.city;
            		this.district = regeoData.district;
            		this.addressDesc = data[0].desc;
            	},
            	fail: (info) => {
            		//失败回调
            		console.log(info)
            	}
            })
            // #endif
          }
        })
      },
			sub_sure() { //提交
				// 表单验证
				if (this.name.trim() == '') {
          this.$message.info('请输入收货人姓名');
          this.name = '';
					return false;
				};
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
          let text = !this.phone ? '请输入手机号' : '手机号格式不正确';
          this.$message.info(text);
					return false;
				}
				if (this.address.trim() == '') {
					this.$message.info('地区不能为空');
					return false;
				}
				if (this.addressDesc.trim() == '') {
					this.$message.info('详细地址不能为空');
          this.addressDesc = '';
					return false;
				}

				let data = {
					name: this.name, // 姓名
					mobile: this.phone, // 手机
					is_default: this.is_default ? '1' : '0', // 是否默认地址
					address: this.addressDesc, // 详细地址
					province: this.province,
					city: this.city,
					district: this.district,
				}
				// 判断提交的接口
				let url = global.apiUrls.postUserAddressAddAddress;
				if (this.edit_id) {
					data.address_id = this.edit_id
					url = global.apiUrls.postUserAddressEditAddress;
				}
				// 提交
				this.$api.post(url, data)
					.then(res => {
						console.log(res, '添加/编辑成功');
            if(res.statusCode == 200){
              if(res.data.code == 1){
                this.$message.info('保存成功')
                setTimeout(() => {
                	uni.navigateBack()
                }, 800);
                uni.$emit('updataList',data)
              }else{
                this.$message.info(res.data.msg)
              }
            }
					})
					.catch(err => {
						console.log("err: ", err);
					})
			},
			delAddr(){
				let address_id = this.edit_id;
        global.customShowModalPopup({
          content: '是否删除该地址',
          success: (res) => {
            if(res.confirm){
              this.$api.post(global.apiUrls.postUserAddressDelAddress, { address_ids: address_id })
              .then(res => {
                  console.log(res);
                  if(res.data.code == 1){
                    uni.navigateBack();
                  }else{
                    this.$message.info(res.msg);
                  }
                });
            }
          }
        })
			},
      clear(){
        this.phone = '';
      }
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

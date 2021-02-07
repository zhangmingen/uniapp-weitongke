<template>
	<view class="grace-idcard-main">
		<view>
			<view class="cu-list menu">
				<view class="cu-item arrow">
					<view class="content" style="display: flex;justify-content: space-between;">
						<text class="text-grey">姓名</text>
						<input type="text" class="input" v-model="name" placeholder="请输入真实姓名"></input>
					</view>
				</view>
				<view class="cu-item arrow">
					<view class="content" style="display: flex;justify-content: space-between;">
						<text class="text-grey">身份证号</text>
						<input class="input" type="idcard" v-model="idCardNo" placeholder="请输入身份证号"></input>
					</view>
				</view>
			</view>
			<view class="grace-idcard-text">
				身份证照片 ( 个人信息面 )
			</view>
			<view class="grace-idcard-items">
				<view class="img">
					<image :src="idcard_front" @tap="selectImg1" mode="widthFix"></image>
				</view>
			</view>
			<view class="grace-idcard-text">
				身份证照片 ( 国徽图案面 )
			</view>
			<view class="grace-idcard-items">
				<view class="img">
					<image :src="idcard_reverse" @tap="selectImg2" mode="widthFix"></image>
				</view>
			</view>
			<view style="margin-top:50rpx;">
				<button type="primary" class="btn-primary bg-theme round" @tap="uploadCards">提交认证</button>
			</view>
		</view>
		<!-- <view v-if="false" style="margin-top:300rpx;">
			<view v-if="status == 0">
				<view style="padding:10px; text-align:center;color:#3688FF">实名认证中,请耐心等待</view>
			</view>
			<view v-if="status == 1">
				<view style="padding:10px; text-align:center;color:green">实名认证通过</view>
			</view>
			<view v-if="status == 2">
				<view style="padding:10px; text-align:center;color:#999999">实名认证被拒绝</view>
				<view style="padding:10px; text-align:center;color:#999999">原因：{{reason}}</view>
			</view>
		</view> -->
	</view>
</template>
<script>
	var _self;
  import { API_BASE_URL } from '@/common/config.js'
  import { validate } from '@/common/utils/index';
	export default {
		data() {
			return {
				name: "",
				idCardNo: "",
				idcard_front: '../../../../static/user/idcard1.png',
				idcard_reverse: '../../../../static/user/idcard2.png',
				idcard_front_path: "",
				idcard_reverse_path: "",
				status: 99, //99表示都不显示
				reason: "",
        baseurl:''
			};
		},
		onLoad: function() {
      this.baseurl = `${API_BASE_URL}`
			_self = this;
			this.get_cert();
		},
		methods: {
			get_cert: function() {
				this.$api.post(global.apiUrls.user_certification_status).then(res => {
					_self.status = res.data.status
					if (res.data.status == 2) {
						_self.reason = res.data.reason
					}
					if (res.data.status < 99) {
						if (res.data.status == 0) {
							this.$Common.alert('实名认证中,请耐心等待', () => {
								uni.navigateBack();
							})
						} else if (res.data.status == 1) {
							this.$Common.alert('实名认证通过', () => {
								uni.navigateBack();
							})
						} else if (res.data.status == 2) {
							this.$Common.alert('实名认证被拒绝，原因：' + _self.reason, () => {
								uni.navigateBack();
							})
						}
					}
				})
			},
			selectImg1: function() {
				uni.hideKeyboard(); //关闭软键盘
				uni.chooseImage({
					count: 1,
					success: function(res) {
						_self.idcard_front = res.tempFilePaths[0];
					}
				})
			},
			selectImg2: function() {
				uni.hideKeyboard(); //关闭软键盘
				uni.chooseImage({
					count: 1,
					success: function(res) {
						_self.idcard_reverse = res.tempFilePaths[0];
					}
				})
			},
			previewImg1: function() {
				uni.previewImage({
					urls: [_self.idcard_front]
				});
			},
			previewImg2: function() {
				uni.previewImage({
					urls: [_self.idcard_reverse]
				});
			},
			uploadCards: function() {
				uni.hideKeyboard(); //关闭软键盘
				if (this.name == '') {
					uni.showToast({
						title: "请填写姓名",
						icon: "none"
					});
					return;
				}
				if (this.idCardNo == '') {
					uni.showToast({
						title: "请填写正确的身份证号",
						icon: "none"
					});
					return;
				};
        if (!validate(this.idCardNo,'idcard')) {
        	uni.showToast({
        		title: "请填写正确的身份证号",
        		icon: "none"
        	});
        	return;
        };
				if (this.idcard_front == '../../../../static/user/idcard1.png') {
					uni.showToast({
						title: "请选择身份证正面照片",
						icon: "none"
					});
					return;
				}
				if (this.idcard_reverse == '../../../../static/user/idcard2.png') {
					uni.showToast({
						title: "请选择身份证反面照片",
						icon: "none"
					});
					return;
				}
				// 因底层限制一次上传一个
				uni.showLoading({
					title: "上传中"
				});
				// 上传正面
				var uploadTask1 = uni.uploadFile({
					url: this.baseurl + global.apiUrls.uploadImg,
					filePath: _self.idcard_front,
					fileType: 'image',
					name: 'file[]',
					success: function(uploadFileRes) {
						// 上传成功后返回服务器端保存的路径
						var rescult = JSON.parse(uploadFileRes.data);
						_self.idcard_front_path = rescult.data[0].path
						// 上传背面
						var uploadTask2 = uni.uploadFile({
							url: _self.baseurl + global.apiUrls.uploadImg,
							filePath: _self.idcard_reverse,
							fileType: 'image',
							name: 'file[]',
							success: function(uploadFileRes) {
								// 上传成功后返回服务器端保存的路径
								var rescult = JSON.parse(uploadFileRes.data);
								_self.idcard_reverse_path = rescult.data[0].path
								var formData = {
									name: _self.name,
									idcard_no: _self.idCardNo,
									idcard_front: _self.idcard_front_path,
									idcard_reverse: _self.idcard_reverse_path
								}
								_self.$api.post(global.apiUrls.user_certification, formData).then(res => {
									uni.showToast({
										title: res.data.msg,
										icon: "none"
									})
									if (res.data.code == 1) {
										setTimeout(function() {
											uni.navigateBack()
										}, 1000)
									}
								})
								// 至此2张照片上传完毕
								uni.hideLoading();
							}
						});
					}
				});
			}
		}
	}
</script>
<style>
	page {
		background: #F8F8F8;
	}

	.grace-idcard-main {
		margin: 25rpx;
	}

	.grace-idcard-desc {
		background: #FFFFFF;
		color: #666666;
		line-height: 1.8em;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.grace-idcard-text {
		line-height: 1.8em;
		margin-top: 30rpx;
		color: #666666;
	}

	.grace-idcard-items {
		background: #FFFFFF;
		padding: 30rpx 150rpx;
		margin-top: 25rpx;
		border-radius: 10rpx;
	}

	.grace-idcard-items .img image {
		width: 100%;
	}

	.grace-form .grace-items {
		border-bottom: 1px solid #ccc;
	}

	.input {
		text-align: right;
		flex-grow: 1;
	}
</style>

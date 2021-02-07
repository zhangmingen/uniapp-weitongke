<template>
	<view class="edit-data">
		<view class="edit-top">
			<image src="../../static/imgs/bg-edit.png" mode="aspectFill" class="bg-edit"></image>
			<image src="../../static/imgs/edit-logo.png" mode="aspectFill" class="edit-logo"></image>
		</view>
		<form @submit="formSubmit">
			<view class="padding-sm edit-box">
				<!-- 头像 -->
				<view @tap="chooseImage">
					<u-image class="edit-user" width="104rpx" height="104rpx" border-radius="50%" :src="head_img || thumb" mode="aspectFill" :lazy-load="true"></u-image>
				</view>
				<!-- 昵称 -->
				<view class="flex solid-bottom item">
					<text class="text-lg text-bold edit-title">昵称</text>
					<input class="uni-input flex-sub text-lg text-right" type="text" placeholder="请填写昵称" name="user_nickname"
					 maxlength="10" v-model="user_nickname" />
					<label class="cuIcon-right text-bf text-lg visibility-hidden"></label>
				</view>
				<!-- 性别 -->
				<label class="flex solid-bottom item">
					<text class="text-lg text-bold edit-title">性别</text>
					<picker @change="bindPickerChange" :value="sexIndex" :range="sex" name="sex" class="flex-sub text-lg text-right">
						<text v-if="sexIndex>0">{{sex[sexIndex]}}</text>
						<text class="text-grey" v-else>请选择性别</text>
					</picker>
					<text for="sex" class="cuIcon-right text-bf text-lg"></text>
				</label>
				<!-- 出生 -->
				<view class="flex solid-bottom item">
					<text class="text-lg text-bold edit-title">出生</text>
					<picker :end="yearEnd" @change="bindDateChange" :value="dateValue" mode="date" fields="year" name="birth_year"
					 class="flex-sub text-lg text-right">
						<text class="text-grey" v-if="dateValue=='请选择年份'">{{dateValue}}</text>
						<text v-else>{{dateValue}}</text>
					</picker>
					<text class="cuIcon-right text-bf text-lg"></text>
				</view>
				<!-- 地区 -->
				<view class="flex solid-bottom item">
					<text class="text-lg text-bold edit-title">地区</text>
					<view class="flex-sub text-lg text-right view-picker" @tap="toggleTab()">
						<text v-if="name=='请选择省份'" class="text-grey">{{name}}</text>
						<text v-else>{{name}}</text>
					</view>
					<text class="cuIcon-right text-bf text-lg"></text>
				</view>
				<!-- 简介 -->
				<view class="textarea-edit">
					<view class="padding-top padding-bottom-sm"><text class="text-lg text-bold edit-title">简介</text></view>
					<view class="content">
						<textarea maxlength="200" @input="textareaAInput" v-model="about" placeholder="多行文本输入框"></textarea>
						<view class="num">{{about.length}}/200</view>
					</view>
				</view>
				<!-- 插入图片 -->
				<view class="flex align-center justify-between">
					<view class="padding-top-sm text-blu flex align-center">
						<image src="../../static/imgs/img.png" class="img-icon margin-right-xs" mode="aspectFill"></image>插入图片
					</view>
					<view class="action">
						{{imgList.length}}/4
					</view>
				</view>
				<view class="cu-form-group padding-0 padding-top-sm">
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
							<image :src="imgList[index]" mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap="ChooseImagePhotos" v-if="imgList.length<4">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 保存按钮 -->
			<view class="padding-tb-lg">
				<button class="edit-btn" :loading="isLoading" formType="submit" type="primary">完成编辑</button>
			</view>
		</form>
		<w-picker mode="region" :defaultVal="defaultVal" :hideArea="true" @confirm="onConfirm" ref="region" themeColor="#007aff"></w-picker>
	</view>
</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import {
		UploadImage
	} from '@/common/utils/index';
	let timer = null;
	export default {
		data() {
			return {
				isLoading: false, // 是否加载中
				userInfo: {},
				head_img: '', // 用户头像
				head_img_id: '', // 用户头像id
				user_nickname: '', // 用户昵称
				sexIndex: 0,
				sex: ['请选择性别', '男', '女'],
				dateValue: "请选择年份",
				mobile: '', // 手机号码
				name: "请选择省份", //地区text
				mode: "region",
				defaultVal: [1], // 城市编码
				city1: [], // 对应的省市区
				thumb: global.SYSTEM_CONFIG.defaultAvatar,
				about: '', //简介
				imgList: [], //简介图片
				imgList_id: [], //简介图片id
				yearEnd: '2020', //出生年份限制时间
			}
		},
		components: {
			wPicker
		},
		onLoad(option) {
			let userInfo = global.userInfo;
			this.userInfo = userInfo;
			this.head_img_id = userInfo.head_img_id;
			this.head_img = userInfo.head_img ? userInfo.head_img : '';
			this.user_nickname = userInfo.user_nickname;
			this.sexIndex = userInfo.sex=='男' ? 1 : 2;
			this.dateValue = userInfo.birth_year ? userInfo.birth_year : '请选择年份';
			this.mobile = userInfo.mobile;
			this.name = userInfo.province ? userInfo.province : '请选择省份';
			this.about = userInfo.introduction ? userInfo.introduction : '';
			this.defaultVal = userInfo.address ? userInfo.address_code : [1];
			this.imgList = userInfo.introduction_img_url || [];
			this.imgList_id = userInfo.introduction_img.split(',');

			// 监听上传头像
			uni.$on('uAvatarCropper', path => {
				this.uploadUserImg(path);
			})
			// 获取当前年份
			this.yearEnd = (new Date).getFullYear() + '';
		},
		onUnload() {
			uni.$off("uAvatarCropper");
		},
		methods: {
			toggleTab() {
				this.$refs[this.mode].show();
			},

			// 性别选择
			bindPickerChange: function(e) {
				this.sexIndex = e.detail.value;
			},

			// 生日选择
			bindDateChange: function(e) {
				this.dateValue = e.detail.value;
			},
			// 简介
			textareaAInput(e) {
				this.about = e.detail.value
			},

			// 所在地选择
			onConfirm(result) {
				let {
					province,
					city,
					area
				} = result.obj;
				let text = [province.label];
				let code = [province.value];
				this.name = text[0];
				this.city1 = text;
				this.defaultVal = code;
			},
			chooseImage() {
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						// 抽离出uview-ui中的头像裁剪插件来使用
						uni.navigateTo({
							url: '../../fu-templete/pages/mine-template/u-avatar-cropper/u-avatar-cropper?destWidth=150&rectWidth=250&fileType="jpg"&myImgUrl=' +
								res.tempFilePaths[0],
							animationDuration: 0
						})
					}
				});
			},
			ChooseImagePhotos() {
				let _this = this;
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						if (_this.imgList.length + res.tempFilePaths.length > 4) return _this.$message.info('最多上传4张图片');
						uni.showLoading();
						new UploadImage(res.tempFilePaths, {
							complete: function(res) {
								if (res.length) {
									for (var i = 0; i < res.length; i++) {
										_this.imgList = _this.imgList.concat(res[i].path);
										_this.imgList_id = _this.imgList_id.concat(res[i].id);
										if (i == res.length) uni.hideLoading();
									}
								}
							}
						});
					}
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张照片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1);
							this.imgList_id.splice(e.currentTarget.dataset.index, 1);
						}
					}
				})
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			// 表单提交
			formSubmit: function(e) {
				if (this.isLoading) return;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					var formData = e.detail.value;

					// 添加头像
					formData.head_img = this.head_img_id;

					// 处理生日字段
					formData.birth_year = formData.birth_year.indexOf('选择') != -1 ? '' : formData.birth_year;

					// 所在地
					formData.province = this.name.indexOf("选择") != -1 ? '' : this.name;

					// 简介
					formData.introduction = this.about ? this.about : '';

					// 简介图片
					formData.introduction_img = this.imgList_id.length > 0 ? this.imgList_id.join(',') : 99;

					// 进行表单验证操作
					let validateRes = this.doValidate(formData);
					if (validateRes) {
						this.$message.info(validateRes);
						return;
					}

					// 保存注册信息
					global.loginInfo = formData;
					uni.navigateTo({
						url: "/pages/member/interest?edit=true"
					})
					// this.isLoading = true;
					// this.$api.post(global.apiUrls.editUserinfo, formData).then(res => {
					// 	setTimeout(() => {
					// 		this.isLoading = false;
					// 	}, 500)
					// 	if (res.data.code == 1) {
					// 		// 更新本地缓存
					// 		uni.setStorageSync('USER_INFO', res.data.data.userinfo);

					// 		// 更新global
					// 		global.userInfo = res.data.data.userinfo;
					// 		this.$message.info('修改成功');
					// 		setTimeout(() => {
					// 			uni.navigateBack();
					// 		}, 500);
					// 	}
					// })
				}, 300);
			},

			// 进行表单字段值校验
			doValidate(formData) {
				// 昵称
				if (!formData.user_nickname) {
					return '请输入您的用户昵称';
				}

				if (formData.user_nickname.length > 10) {
					return '请检查您的昵称(最多10个字符)'
				}

				// 性别
				if (formData.sex == 0) {
					return '请选择您的性别'
				}

				// 生日
				if (!formData.birth_year) {
					return '请选择您的出生年份';
				}
				// 省份
				if (this.name.indexOf("选择") != -1) {
					return '请选择省份';
				}
				return '';
			},

			// 上传用户头像
			uploadUserImg(blob) {
				uni.showLoading()
				let _this = this;
				// 开始上传
				new UploadImage([blob], {
					complete: function(res) {
						uni.hideLoading();
						if (res.length) {
							_this.head_img = res[0].path;
							_this.head_img_id = res[0].id;
						}
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #F6F7F9;
	}

	.edit-top {
		position: relative;

		.bg-edit {
			width: 100%;
			height: 360rpx;
			background: linear-gradient(136deg, #99D337 0%, #83B928 100%);
		}

		.edit-logo {
			position: absolute;
			right: 0;
			left: 0;
			top: 64rpx;
			width: 208rpx;
			height: 88rpx;
			margin: 0 auto;
		}
	}

	.edit-box {
		width: 702rpx;
		background-color: #FFFFFF;
		margin: 0 auto;
		border-radius: 16px;
		position: relative;
		margin-top: -150rpx;

		.item {
			height: 108rpx;
			line-height: 108rpx;
		}

		.edit-user {
			display: block;
			width: 104rpx;
			height: 104rpx;
			margin: 0 auto;
			border-radius: 50%;
		}

		.edit-title {
			margin-top: -2rpx;
		}

		input,
		picker,
		.view-picker {
			height: 100%;
			line-height: 108rpx;
			padding-right: 24rpx;
		}
	}

	.textarea-edit {
		textarea {
			width: 100%;
			height: 320rpx;
			background: #F6F7F9;
			border-radius: 16rpx;
			padding: 24rpx;
		}

		.content {
			position: relative;

			.num {
				height: 40rpx;
				line-height: 20rpx;
				position: absolute;
				bottom: 20rpx;
				right: 20rpx;
				background-color: #FFFFFF;
				padding: 10rpx;
				border-radius: 20rpx;
			}
		}
	}

	.edit-btn {
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(315deg, #7ED04C 0%, #46C171 100%);
		box-shadow: 0px 2rpx 30rpx rgba(131, 185, 40, 0.2);
		border-radius: 49rpx;
	}

	.img-icon {
		width: 32rpx;
		height: 32rpx;
	}
</style>

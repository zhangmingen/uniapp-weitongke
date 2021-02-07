<template>
	<view class="edit-data">
		<view class="edit-top">
			<image src="../../static/imgs/bg-edit.png" mode="aspectFill" class="bg-edit"></image>
			<image src="../../static/imgs/edit-logo.png" mode="aspectFill" class="edit-logo"></image>
		</view>
		<form @submit="formSubmit">
			<view class="padding-sm edit-box">
				<view class="text-lg text-bold text-center padding-tb-lg">请至少勾选3项您感兴趣的分类</view>
				<view class="flex flex-wrap text-center text-lg">
					<label class="basis-df padding-tb" @tap="checkFun(index)" v-for="(item,index) in checkbox" :key="item.aid">
						<checkbox :class="item.checked?'checked':''" :checked="item.checked?true:false" :value="item.name" class="margin-right-sm"></checkbox>{{item.name}}
					</label>
				</view>
			</view>
			<!-- 保存按钮 -->
			<view class="padding-tb-lg">
				<button class="edit-btn" :loading="isLoading" formType="submit" type="primary">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	let timer = null;
	export default {
		data() {
			return {
				isLoading: false, // 是否加载中
				checkbox: [], //兴趣分类
				userInfo: global.userInfo,
				edit:""
			}
		},
		onShow() {
			this.userInfo = global.userInfo;
			// 获取注册信息
			if (!global.loginInfo) uni.reLaunch({
				url: "/pages/member/register"
			})
		},
		onLoad(options) {
			this.edit = options.edit || "";
			if (options.edit == 'true' && !global.loginInfo) {
				uni.reLaunch({
					url: "/pages/home/home"
				})
			}
			this.getClassListFun();
		},
		methods: {
			checkFun(ind) {
				var item = this.checkbox;
				item[ind].checked = !item[ind].checked;
				this.checkbox = item
			},
			// 表单提交
			formSubmit: function(e) {
				let _this = this;
				// 存放已选分类id
				var aidArr = [];
				if (this.isLoading) return;
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					var filterCheckbox = _this.checkbox.filter(function(item) {
						return item.checked == true;
					})
					if (filterCheckbox.length < 3) return _this.$message.info('至少勾选三项');
					for (var i = 0; i < filterCheckbox.length; i++) {
						aidArr.push(filterCheckbox[i].aid)
					}
					// 获取注册信息
					var loginInfo = Object.assign({}, global.loginInfo);
					// 向注册信息添加注册信息
					loginInfo.interest = aidArr.join(',');
					loginInfo.type = 1;
					_this.isLoading = true;
					_this.$api.post(global.apiUrls.postuserinfo, loginInfo)
						.then(res => {
							_this.isLoading = false;
							if (res.data.code == 1 && res.data.data) {
								_this.$message.info(res.data.msg);
								setTimeout(() => {
									if (global.inviteCode) {
										// 下载app 页面
										uni.navigateTo({
											url: "/pages/home/download"
										})
									} else {
										if (this.edit=='true') {
											uni.navigateBack({
												delta: 2
											})
										} else {
											global.token = ''
											global.userInfo = null
											uni.removeStorageSync('USER_TOKEN')
											uni.removeStorageSync('USER_INFO')
											_this.jumpLogin()
										}
									}
								}, 500)
							} else {
								_this.$message.info(res.data.msg);
							}
						})
				}, 300);
			},
			// 获取同课列表
			getClassListFun() {
				uni.showLoading()
				let _this = this;
				this.$api.post(global.apiUrls.PostNotLoginClassList, {})
					.then(res => {
						if (res.data.code == 1) {
							uni.hideLoading();
							for (var i = 0; i < res.data.data.length; i++) {
								if (_this.edit=='true') {
									if (global.userInfo.interest.indexOf(res.data.data[i].aid) >= 0) {
										res.data.data[i].checked = true;
									} else {
										res.data.data[i].checked = false;
									}
								} else {
									res.data.data[i].checked = false;
								}
							}
							_this.checkbox = res.data.data;
						}
					})
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

		label {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.edit-btn {
		width: 686rpx;
		height: 88rpx;
		background: linear-gradient(315deg, #7ED04C 0%, #46C171 100%);
		box-shadow: 0px 2rpx 30rpx rgba(131, 185, 40, 0.2);
		border-radius: 49rpx;

		&:after {
			border: none;
		}
	}

	checkbox {
		width: 40rpx;
		height: 40rpx;
	}

	.edit-box /deep/ .uni-checkbox-wrapper,
	.edit-box /deep/ .uni-checkbox-input {
		color: #7ED04C !important;
		box-sizing: border-box;
		width: 40rpx;
		height: 40rpx;
	}

	.edit-box /deep/ uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #7ED04C !important;
	}

	.edit-box /deep/ uni-checkbox::before {
		right: 4rpx
	}
</style>

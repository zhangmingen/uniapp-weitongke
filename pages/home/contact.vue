<template>
	<view class="contact padding">
		<view class="text-center">
			<image :src="showData.contact_us_image||''" mode="aspectFill" class="contact-img"></image>
		</view>
		<view class="text-lg" v-if="showData.work_time">
			<view class="padding-top">工作时间：{{showData.work_time || ''}}</view>
			<view class="flex align-center padding-top">客服微信：{{showData.service_code || ''}} <view class="copy" @tap="copy(showData.service_code)">复制</view>
			</view>
			<view class="flex align-center padding-top">客服电话：{{showData.service_phone}} <a class="phone" :href="'tel:'+showData.service_phone">
					<image src="../../static/imgs/phone.png" mode=""></image>拨打电话
				</a></view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				showData:{}
			}
		},
		onShow() {
			this.getData()
		},
		methods: {
			copy(content) {
				const result = this.h5Copy(content)
				if (result === false) {
					uni.showToast({
						title: '不支持',
					})
				} else {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			},
			h5Copy(content) {
				if (!document.queryCommandSupported('copy')) {
					// 不支持
					return false
				}
				let textarea = document.createElement("textarea")
				textarea.value = content
				textarea.readOnly = "readOnly"
				document.body.appendChild(textarea)
				textarea.select() // 选择对象
				textarea.setSelectionRange(0, content.length) //核心
				let result = document.execCommand("copy") // 执行浏览器复制命令
				textarea.remove()
				return result
			},
			getData() {
				let _this = this;
				uni.showLoading();
				this.$api.post(global.apiUrls.PostContactList).then(res => {
					var res = res.data;
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					if (res.code == 1) {
						_this.showData = res.data
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.contact-img {
		width: 686rpx;
		height: 350rpx;
	}

	.copy {
		padding: 0 14rpx;
		height: 40rpx;
		line-height: 38rpx;
		border: 1px solid #2B98FA;
		border-radius: 20rpx;
		color: #2B98FA;
		margin-left: 20rpx;
	}

	.phone {
		padding: 0 14rpx;
		height: 40rpx;
		line-height: 40rpx;
		background: #FFFFFF;
		border: 1px solid #83B928;
		border-radius: 20rpx;
		color: #83B928;
		margin-left: 20rpx;
		text-decoration: none;

		image {
			width: 20rpx;
			height: 20rpx;
		}
	}
</style>

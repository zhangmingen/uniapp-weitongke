<template>
	<view class="page">
		<fu-parse :content="body"></fu-parse>
	</view>
</template>

<script>
	import {
		message
	} from "@/common/utils/index";
	import fuParse from "@/components/fu-parse/fu-parse";
	export default {
		data() {
			return {
				body: '',
				id: 1
			};
		},
		components: {
			fuParse
		},
		onLoad(options) {
			this.id = options.id;
			// setTimeout(() => {
			uni.setNavigationBarTitle({
				title: options.id == 1 ? '用户协议' : '隐私协议'
			})
			// }, 500)
			this.getData()
		},
		methods: {
			getData(id) { //获取协议
				uni.showLoading({
					title: '加载中...'
				});
				this.$api.post(global.apiUrls.publicGetAgreement).then(res => {
					var res = res.data;
					setTimeout(function() {
						uni.hideLoading();
					}, 500);
					if (res.code == 1) {
						if (this.id == 1) {
							this.body = res.data.user_agreement;
						} else {
							this.body = res.data.privacy_agreement;
						}
					}
				})
			}

		}
	}
</script>

<style lang="scss">
	.page {
		background: #fff;
		overflow: hidden;
		height: 100vh;
		padding: 20upx;
		overflow-y: scroll;
	}
</style>

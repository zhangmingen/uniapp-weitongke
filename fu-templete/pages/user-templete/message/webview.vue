<template>
	<view>
		<web-view :webview-styles="webviewStyles" class="webView" v-if="url" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'',	//链接地址
				webviewStyles: {
					progress: {
						color: '#4EC520'
					}
				}
			};
		},
		onLoad(e) {
			console.log(e);
			this.url = e.url;
			uni.setNavigationBarTitle({
				title: e.name || '网址'
			});
		}
	}
</script>

<style lang="scss">
	.webView{
		width: 100%;
		height: 100%;
	}
</style>

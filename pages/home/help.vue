<template>
	<view class="help padding-lr">
		<view class="help-box padding-tb solid-bottom" v-for="(item,index) in showData" :key="index">
			<view class="flex align-center justify-between text-lg" @click="toggleFun(index)">
				<text class="text-bold">{{item.title}}</text>
				<text class="text-black cuIcon-unfold unfoldIcon" :class="item.checked?'icon-act':''"></text>
			</view>
			<view class="padding-top-sm text-666" :class="item.checked?'':'icon-hidden'">
				{{item.content}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showData:[]
			}
		},
		onShow() {
			this.getData()
		},
		methods: {
			toggleFun(index) {
				this.showData[index].checked = !this.showData[index].checked;
				this.showData = this.showData
			},
			getData() {
				let _this = this;
				uni.showLoading();
				this.$api.post(global.apiUrls.PostHelpList).then(res => {
					var res = res.data;
					setTimeout(function() {
						uni.hideLoading();
					}, 300);
					if (res.code == 1) {
						for (var i = 0; i < res.data.data.length; i++) {
							res.data.data[i].checked = false;
							if(i==0){
								res.data.data[i].checked = true;
							}
						}
						_this.showData = res.data.data;
					}
				})
			}
		}
	}
</script>

<style scoped>
	.unfoldIcon {
		transition: all .3s;
	}

	.icon-act {
		transform: rotate(180deg);
	}

	.icon-hidden {
		display: none;
	}
</style>

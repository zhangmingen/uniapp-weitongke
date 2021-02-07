<template>
	<view class="cu-modal" :class="show?'show':''">
		<view class="cu-dialog modal">
			<view class="text-bold text-xl pt-99">
				微同课App提示您
			</view>
			<view class="slot-padding text-df">
				<slot></slot>
			</view>
			<view class="">
				<image src="../../static/imgs/yes.png" mode="aspectFill" class="yes-img" @tap.stop="hideModal"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['show'],
		methods: {
			hideModal() {
				this.$emit('hideModal')
			}
		}
	}
</script>

<style>
	.modal {
		width: 552rpx;
		height: 466rpx;
	}

	.yes-img {
		width: 212rpx;
		height: 98rpx;
	}

	.pt-99 {
		padding-top: 99rpx;
	}
	.slot-padding {
		padding: 32rpx 0 91rpx;
	}
</style>

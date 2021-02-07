<template>
	<view class="warp">
		<view
			@tap="handleJump"
			:data-url="'/fu-templete/pages/user-templete/message/message-list?id=' + item.msg_type + '&name=' + item.name"
			class="list"
			v-for="(item, index) in list"
			:key="index"
		>
			<view class="consult">
				<view class="flex justify-between">
					<text class="title">{{ item.name }}</text>
					<text class="title" v-if="item.new_msg.length != 0">{{ item.new_msg.create_time || '' }}</text>
				</view>
				<view v-if="item.new_msg.is_read == 0" class="content flex justify-between align-center">
					<text>{{ item.new_msg.title || '' }}</text>
					<text class="mark"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: []
		};
	},
	onLoad() {
		/* 获取设备ID用作消息推送 start */
		// #ifdef APP-PLUS
		let client_id = plus.push.getClientInfo().clientid;
		console.log('设备client_id：'+ client_id);
		if (client_id) {
			this.$api.post(global.apiUrls.postUserSet_client_id, { client_id: client_id }).then(result => {
				console.log( '设备储存' , result );
				if (result.code == 1) {
					//更新为新的client_id
				}
			});
		}
		// #endif
		/* 获取设备ID end */
	},
	onShow() {
		this.gettype();
	},
	methods: {
		gettype() {
			//获取消息类型+最新消息
			this.$api.get(global.apiUrls.getOperationGetSystemMsgType).then(res => {
				if (res.data.code == 1) {
					this.list = res.data.data;
				} else {
					this.$message.info(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	height: 100%;
	font-size: 28upx;
	background: #f9f9f9;
	.warp {
		background: #fff;
		.list {
			padding: 25upx 25upx;
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			border-bottom: 1px solid #eee;

			.consult {
				width: 100%;
				height: 80upx;
				color: #999;
				.title:nth-of-type(1) {
					color: #333;
					font-size: 30rpx;
					line-height: 42rpx;
				}

				.title:nth-of-type(2) {
					font-size: 24upx;
					color: #999 !important;
					line-height: 42rpx;
				}
				.content {
					font-size: 28upx;
					color: #666666;
					line-height: 40upx;
				}
			}
		}
		.mark {
			width: 10px;
			height: 10px;
			background: #f5222d;
			display: block;
			border-radius: 50%;
			overflow: hidden;
		}
	}
}
</style>

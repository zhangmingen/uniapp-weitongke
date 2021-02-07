<template>
	<view class="" v-if="data">
		<view class="class_item" @tap="handleJump" :data-url="!nolink?'/pages/class/classDetail?id='+data.id:''">
			<view class="text-black text-bold overflowhidden2"><text class="text-theme padding-right-xs">{{data.cate_name}}</text>{{data.title}}</view>
			<view class="text-sm flex align-center padding-tb-sm text-666">
				<image :src="data.type==1?'../../static/imgs/zhobo.png':data.type==2?'../../static/imgs/lubo.png':'../../static/imgs/zanban.png'"
				 mode="aspectFill" class="class_status_img"></image>
				<text class="margin-lr">共{{data.total_section}}讲</text>
				<text>授课{{data.total_time}}分钟</text>
			</view>
			<view class="text-sm padding-bottom multi-line2">{{data.sign_time}}</view>
			<view class="flex justify-between">
				<view class="user_head">
					<u-image :src="data.head_img" mode="aspectFill" width="88rpx" height="88rpx" border-radius="50%" class="head_img" :lazy-load="true"></u-image>
					<image v-if="data.is_follow==0 && data.is_me==0" src="../../static/imgs/add.png" mode="aspectFill" class="attention_img"
					 @tap.stop="islike(data.user_id)"></image>
					<image v-else-if="data.is_follow==1 && data.is_me==0" src="../../static/imgs/tick.png" mode="aspectFill" class="attention_img"
					 @tap.stop="islike(data.user_id)"></image>
				</view>
				<view class="flex-sub flex justify-between" style="align-items: center !important;">
					<view class="flex flex-direction justify-between padding-tb-xs">
						<view class="text-df text-black overflowhidden text-bold">{{data.user_nickname}}</view>
						<view  class="text-sm text-666 overflowhidden padding-top-xs">{{data.label}}</view>
					</view>
					<view class="text-right flex flex-direction justify-between padding-tb-xs flex-shrink ">
						<view class="text-org"><text class="text-xl padding-right-xs">{{data.price | integerFilter}}</text><text class="text-sm">同币</text></view>
						<view class="text-xs text-999">剩{{data.residue_num}}个名额</view>
					</view>
				</view>
			</view>
			<view class="box-solid-bottom"></view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['data', 'nolink'],
		methods: {
			islike(userid) {
				let _this = this;
				this.$api.post(global.apiUrls.PostIsLike, {
						user_id: userid
					})
					.then(res => {
						if (res.data.code == 1) {
							_this.$message.info(res.data.msg);
							this.$emit('refreshdata', userid);
						}
					})
			}
		}
	}
</script>

<style>
	/* 课程列表 */
	.class_item {
		background-color: #FFFFFF;
		padding: 30rpx;
		padding-top: 0;
	}

	.class_status_img {
		width: 126rpx;
		height: 36rpx;
	}

	.user_head {
		position: relative;
		height: 88rpx;
		margin-right: 24rpx;
	}

	.head_img {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
	}

	.attention_img {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 30rpx;
		height: 30rpx;
	}

	.box-solid-bottom {
		width: 686rpx;
		height: 8rpx;
		background: #F6F7F9;
		margin: 30rpx auto 0;
	}

	.overflowhidden {
		width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	.overflowhidden2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>

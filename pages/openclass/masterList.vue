<template>
	<view class="master-list">
		<view class="list-top">
			<image src="../../static/imgs/bg-master.png" class="bg-master" mode="aspectFill"></image>
			<view class="item padding top-item" v-if="auth_status&&auth_status==3 && userData">
				<view class="text-xl text-bold ranktext">{{userData.rank}}</view>
				<view class="flex align justify-between">
					<view class="flex align-center">
						<u-image :src="userData.head_img_url || '../../static/imgs/master-head.png'" mode="aspectFill" width="90rpx"
						 height="90rpx" border-radius="50%" class="master-head-img" :lazy-load="true"></u-image>
						<text class="text-lg text-bold padding-left-xs line300">{{userData.user_nickname}}</text>
					</view>
					<view class="text-sm text-bold text-right flex flex-direction justify-between">
						<view class="text-blu">{{userData.video_num}}微讲·{{userData.answer_num}}微问·{{userData.course_num}}同课</view>
						<view class="text-org">{{userData.fans_num}}粉丝</view>
					</view>
				</view>
			</view>
			<view class="item padding top-item flex align-center justify-center" v-else>
				<text class="text-lg text-bold padding-left-xs">您还不是老师,无法进行排名</text>
			</view>
		</view>
		<!-- content -->
		<view class="list-box margin-tb" v-if="listData.length>0">
			<view class="item padding-sm pb-0" v-for="(item,index) in listData" :key="index">
				<view class="text-xl text-bold ranktext num">{{item.rank}}</view>
				<view class="flex align justify-between padding-bottom-sm solid-bottom">
					<view class="flex align-center">
						<u-image :src="item.head_img_url || '../../static/imgs/master-head.png'" mode="aspectFill" width="90rpx" height="90rpx"
						 border-radius="50%" class="master-head-img" :lazy-load="true"></u-image>
						<text class="text-lg text-bold padding-left-xs line300">{{item.user_nickname}}</text>
					</view>
					<view class="text-sm text-bold text-right flex flex-direction justify-between">
						<view class="text-blu">{{item.video_num}}微讲·{{item.answer_num}}微问·{{item.course_num}}同课</view>
						<view class="text-org">{{item.fans_num}}粉丝</view>
					</view>
				</view>
			</view>
			<view class="text-grey text-center padding-bottom text-xs padding-top" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
		</view>
		<view class="text-center" v-else>
			<image src="../../static/nodata.png" mode="aspectFit" class="nodata"></image>
			<view class="text-center text-grey text-sm">这里还没有内容</view>
		</view>
	</view>
</template>

<script>
	import pagingList from '@/common/minix/paging_list.js'
	export default {
		// 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				userData: null,
				auth_status: null,
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.PostMasterList,
				// 需要配置pagingList
				userDataStatus: true,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 额外参数
				user_nickname: ''
			}
		},
		onShow() {
			// await this.$onLaunched;
			// 配置允许请求并主动发起第一页请求
			this.allowOnloadGetList = true
			this.pagingListGetLists()
			if (global.userInfo) {
				this.auth_status = global.userInfo.auth_status;
			}
		},
		methods: {
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					user_nickname: ''
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	page {
		background: #F6F7F9;
	}

	.master-list {
		background-color: #F6F7F9;
	}

	.list-top {
		position: relative;
	}

	.bg-master {
		width: 100%;
		height: 270rpx;
	}

	.top-item {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.item {
		width: 702rpx;
		height: 190rpx;
		background-color: #FFFFFF;
		border-radius: 16px;
		margin: 0 auto;

		.pl-24 {
			padding-left: 24rpx;
		}

		.master-head-img {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}
	}

	.list-box {
		.item {
			width: 686rpx;
			height: 172rpx;
			border-radius: 0;

			&:first-child {
				border-radius: 16rpx 16rpx 0 0;
			}

			&:last-child {
				border-radius: 0 0 16rpx 16rpx;
			}

			&:nth-child(1) {
				background: url(../../static/imgs/one.png);
				background-size: 100%;

				.solid-bottom::after {
					border: 0;
				}

				.num {
					color: #FFBD46;
				}
			}

			&:nth-child(2) {
				background: url(../../static/imgs/two.png);
				background-size: 100%;

				.solid-bottom::after {
					border: 0;
				}

				.num {
					color: #BDC1CE;
				}
			}

			&:nth-child(3) {
				background: url(../../static/imgs/three.png);
				background-size: 100%;

				.solid-bottom::after {
					border: 0;
				}

				.num {
					color: #FF915F;
				}
			}
		}
	}

	.ranktext {
		width: 90rpx;
		text-align: center;
	}
</style>

<template>
	<view class="warp">
		<view class="list" @longtap="delMessage(item)" v-for="(item, index) in listData" :key="index">
			<view class="times">
				<text class="text">{{ item.create_time }}</text>
			</view>
			<view class="consult" @tap="goDetail(item)">
				<view class="title">{{ item.title }}</view>
				<view class="content">{{ item.content }}</view>
			</view>
		</view>
		<!-- 分页组件 -->
		<fast-ui-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
		 :list-data-length="listDataLength"></fast-ui-empty>
	</view>
</template>
<script>
	import fastUiEmpty from "@/components/fu-empty/fu-empty.vue"
	import pagingList from '@/common/minix/paging_list.js'
	export default {
		components:{
			fastUiEmpty
		},
		mixins: [pagingList],
		data() {
			return {
				minixPagingListsApi: global.apiUrls.getOperationGetSystemMsgList,
				allowOnloadGetList: false,
				pageingListApiMethod:"get",
				msg_type: 0 //消息类型
			};
		},
		onLoad(e) {
			this.setSysTitle(e);
			this.msg_type = e.id;
			this.allowOnloadGetList = true;
			this.pagingListGetLists();
		},
		onPullDownRefresh() {
			this.pagingListToggle()
		},
		methods: {
			delMessage(item) { //删除当前项
				global.customShowModalPopup({
					title: '提示',
					content: '确定删除此消息？',
					success: (data) => {
						if (data.confirm) {
							this.$api.post(global.apiUrls.postOperationDelSystemMsg, {
								id: item.id
							}).then(res => {
								if (res.data.code == 1) {
									this.pagingListToggle(); //刷新列表
								} else {
									this.$message.info(res.msg)
								}
							})
						} else if (data.cancel) {
							// console.log('用户点击取消');
						}
					}
				})
			},
			setSysTitle(e) { //设置系统导航
				uni.setNavigationBarTitle({
					title: e.name || '消息通知'
				});
			},
			goDetail(item) { //点击当前通知
				console.log(item)
				if (item.action == 2) {
					let a = JSON.parse(item.custom)
					// #ifdef APP-PLUS
					plus.runtime.openURL(a.url);
					// #endif
					// #ifndef APP-PLUS
					uni.navigateTo({
						url:`/fu-templete/pages/user-templete/message/webview?name=${item.title}&url=${a.url}`
					})
					// #endif
				} else if (item.action == 3 || item.action == 4) {
					let a = JSON.parse(item.custom)
					this.$message.info('跳转订单详情页面，订单id是' + a.order_sn)
				} else if (item.action == 1) {
					this.$message.info('跳转首页')
					uni.reLaunch({
						url:"/pages/tab/tab01/index"
					})
				} else if (item.action == 5) {
					// this.$message.info('这是一个弹窗提醒')
					let a = JSON.parse(item.custom)
					global.customShowModalPopup({
					  title: a.title,
					  content: a.content,
					  showCancel:false,
					  success: function (res) {
					    if (res.confirm) {
					      console.log('用户点击确定');
					    } else if (res.cancel) {
					      console.log('用户点击取消');
					    }
					  }
					})
				} else if (item.action == 0) {
					this.$message.info('跳转消息详情页面，id是' + item.id)
				}
			},
			//请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					msgtype: this.msg_type,
					page_size: 10
				}
			},
		},
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		font-size: 28upx;
		background: #f9f9f9;

		.warp {
			padding: 0 32rpx 32rpx;

			.list {
				.times {
					text-align: center;

					.text {
						display: inline-block;
						margin: 25rpx auto;
						font-size: 22rpx;
						line-height: 30rpx;
						color: #FFFFFF;
						padding: 1rpx 10rpx;
						border-radius: 5rpx;
						background: #cccccc;
						text-align: center;
					}
				}

				.consult {
					padding: 25upx;
					width: 100%;
					border-radius: 10rpx;
					background: #fff;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					color: #999;

					.title {
						font-size: 32rpx;
						color: #000000;
						line-height: 40rpx;
						padding-bottom: 20rpx;
					}

					.content {
						font-size: 28upx;
						line-height: 50upx;
						color: rgba(0, 0, 0, 0.4);
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
	}
</style>

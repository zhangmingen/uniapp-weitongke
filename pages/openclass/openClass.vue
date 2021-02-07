<template>
	<view class="pt120" >
		<view class="fixed-top bg-white">
			<!-- nav -->
			<view class="class_nav" v-if="navArr.length>0">
				<scroll-view :scroll-into-view="scrollId" scroll-with-animation="true" class="bg-white nav text-df" scroll-x="true">
					<view class="cu-item" :class="index==TabCur?'text-theme nav_act text-bold':''" v-for="(item,index) in navArr" :key="index"
					 @tap="tabSelect" :id="'scroll'+index" :data-id="index">
						<view>{{item.name}}</view>
						<view class="solid_act bg-theme"></view>
					</view>
				</scroll-view>
				<view class="unfold_btn text-xl text-bold" @tap="unfoldFun">
					<text class="lg text-black cuIcon-unfold"></text>
				</view>
			</view>
			<view>
				<!-- 分界线 -->
				<view class="boundary" v-if="unfoldStatus && navArr.length>0"></view>
				<!-- 展开分类 -->
				<view class="unfold_box text-df" v-else>
					<view class="unfold_nav" :class="index==TabCur?'act':''" v-for="(item,index) in navArr" :key="index" @tap="tabSelect"
					 :id="'scroll'+index" :data-id="index">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- content -->
		<view>
			<view class="class_list padding-top-sm" v-if="listData.length>0">
				<class-item v-for="(item,index) in listData" :key="item.id" :data="item" @refreshdata="refreshdata"></class-item>
			</view>
			<view class="text-center" v-else>
				<image src="../../static/nodata.png" mode="aspectFit" class="nodata"></image>
				<view class="text-center text-grey text-sm">这里还没有内容</view>
			</view>
			<view class="text-grey text-center padding-bottom text-xs" v-if="pagingListLoadedAll&&listData.length>5">我们是有底线的～</view>
		</view>

		<!-- 遮罩层 -->
		<view class="mask" v-if="!unfoldStatus" @tap.stop="unfoldFun" @touchmove.stop.prevent></view>
	</view>
</template>

<script>
	import classItem from '@/components/class-item/class-item.vue'
	import pagingList from '@/common/minix/paging_list.js'
	let timer = null;
	export default {
		// 第二步 混入pagingList
		mixins: [pagingList],
		data() {
			return {
				navArr: [],
				TabCur: 0,
				// nav锚链接id
				scrollId: '',
				// 展开按钮
				unfoldStatus: true,
				// 配置分页接口地址
				minixPagingListsApi: global.apiUrls.PostOpenClassList,
				// 默认进去不请求
				allowOnloadGetList: false,
				// 额外参数分类id
				classId: "",
			};
		},
		onLoad() {
			// await this.$onLaunched;
			// 配置允许请求并主动发起第一页请求
			this.allowOnloadGetList = true
			this.pagingListGetLists();
			this.getClassListFun();
		},
		components: {
			classItem
		},
		methods: {
			// 使用pagingListPostData方法为请求分页接口时加入额外参数
			pagingListPostData() {
				return {
					cate_id: this.classId
				}
			},
			// 切换分类
			tabSelect(e) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					if (this.TabCur == e.currentTarget.dataset.id) return this.unfoldStatus = true;
					this.TabCur = e.currentTarget.dataset.id;
					// 分类id
					this.classId = this.navArr[this.TabCur].aid;
					this.unfoldStatus = true;
					this.$nextTick(function() {
						this.scrollId = e.currentTarget.id;
					})
					this.pagingListToggle();
				}, 300);
			},
			// 展开分类
			unfoldFun() {
				this.unfoldStatus = !this.unfoldStatus;
			},
			// 获取同课列表
			getClassListFun() {
				uni.showLoading()
				let _this = this;
				this.$api.post(global.apiUrls.PostNotLoginClassList, {})
					.then(res => {
						if (res.data.code == 1) {
							uni.hideLoading();
							res.data.data.unshift({
								aid: "",
								name: "全部分类"
							});
							_this.navArr = res.data.data;
						}
					})
			},
			// 子组件方法
			refreshdata(userid) {
				var listData = this.listData;
				for (var i = 0; i < listData.length; i++) {
					if (listData[i].user_id == userid) {
						listData[i].is_follow == 1 ? listData[i].is_follow = 0 : listData[i].is_follow = 1;
					}
				}
				this.listData = listData;
			},
			// 更新剩余名额
			refreshdatanum(id) {
				var listData = this.listData;
				for (var i = 0; i < listData.length; i++) {
					if (listData[i].id == id) {
						listData[i].residue_num = listData[i].residue_num - 1;
					}
				}
				this.listData = listData;
			}
		}
	}
</script>

<style scoped>
	/* nav */
	.pt120 {
		padding-top: 120rpx;
	}

	.class_nav {
		position: relative;
		padding: 14rpx 0 6rpx;
		padding-right: 100rpx;
	}

	.cu-item {
		height: 80rpx;
		line-height: 60rpx;
	}

	.nav_act .solid_act {
		width: 32rpx;
		height: 6rpx;
		border-radius: 3rpx;
		margin: 0 auto;
	}



	/*  nav展开*/
	.unfold_btn {
		position: absolute;
		width: 100rpx;
		height: 98rpx;
		line-height: 90rpx;
		right: 0;
		top: 0;
		text-align: center;
		background-color: rgba(255, 255, 255, .85);
	}

	.unfold_box {
		border-top: 1px solid #EEEEEE;
		padding: 15rpx 10rpx;
	}

	.unfold_nav {
		display: inline-block;
		height: 64rpx;
		padding: 12rpx 24rpx;
		background-color: #EEEEEE;
		border-radius: 32rpx;
		margin: 10rpx;
	}

	.unfold_nav.act {
		background-color: #FF5916;
		color: #FFFFFF;
	}
</style>

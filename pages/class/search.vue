<template>
	<view class="pt110">
		<view class="fixed-top bg-white">
			<view class="cu-bar bg-white search">
				<view class="search-form round margin-0">
					<text class="cuIcon-search text-black flex-shrink"></text>
					<input type="text" class="text-df" placeholder="请输入关键词" focus="true" confirm-type="search" maxlength="20" v-model="search"
					 @confirm="searchData"></input>
					<text class="text-gray cuIcon-roundclosefill flex-shrink" @tap="search = ''" v-if="search.length>0"></text>
				</view>
				<view class="margin-left" @tap="linkback">取消</view>
			</view>
		</view>
		<!-- 搜索记录 -->
		<view class="padding-lr">
			<view class="flex justify-between align-center padding-tb solid-bottom" @tap="searchHistory(item)" v-for="(item,index) in history"
			 :key="index">
				<view class="flex justify-between align-center">
					<image src="../../static/imgs/time.png" class="time_img" mode="aspectFill"></image>
					<text class="text-333 inputlength">{{item}}</text>
				</view>
				<image src="../../static/imgs/close.png" class="close_img" mode="aspectFill" @tap.stop="closeFun(item)"></image>
			</view>
			<view class="text-sm text-999 padding-tb text-center" @tap="clearHistory" v-if="history.length>0">
				清除搜索记录
			</view>
		</view>
		<!-- 分界线 -->
		<view class="boundary margin-top-sm"></view>
		<!-- 热门直播 -->
		<view class="padding">
			<view class="flex align-center padding-bottom">
				<image src="../../static/imgs/hot.png" class="hot-img" mode="aspectFill"></image>
				<text class="text-lg text-bold">热门搜索</text>
			</view>
			<view class="hot-box text-666" v-for="(item,index) in navArr" :key="index" @tap="searchHot(item.name)">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 搜索记录
				history: [],
				// 搜索内容
				search: "",
				// 热门搜索
				navArr: [],
				// 搜索分类
				classType:1
			};
		},
		onShow() {
			this.history = uni.getStorageSync("searchHistory") || []
		},
		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.type == 3 ? '同课·关注·搜索' : options.type == 2?'同课·推荐·搜索':'同课·发现·搜索'
			})
			this.classType = options.type || 1;
			this.getClassListFun();
		},
		methods: {
			linkback(){
				uni.navigateBack({
					delta:1
				})
			},
			// 获取同课列表
			getClassListFun() {
				let _this = this;
				this.$api.post(global.apiUrls.PostNotLoginClassList, {})
					.then(res => {
						if (res.data.code == 1) {
							_this.navArr = res.data.data;
						}
					})
			},
			// 检索本地记录是否搜过该记录并搜索
			searching(historyData, val) {
				var history;
				let historyExists = historyData.findIndex((function(a) {
					return a == val;
				}))
				if (historyExists >= 0) {
					historyData.splice(historyExists, 1)
					history = [val, ...historyData]
				} else {
					history = [val, ...historyData];
				}
				var searchJob = this.search;
				var that = this;

				// 保存到data
				this.history = history;
				// 保存到本地
				uni.setStorageSync("searchHistory", history);

				// 跳转搜索页面
				uni.navigateTo({
					url: '/pages/class/searchResult?type=' + this.classType+'&keyword='+this.search,
				})
			},
			// 搜索热门
			searchHot(val) {
				let historyData = this.history
				// 保存到data
				this.search = val;
				this.searching(historyData, val)
			},
			// 搜索记录
			searchHistory(val) {
				this.search = val;
				this.searchData();
			},
			// 删除单条记录
			closeFun(val) {
				var historyData = this.history;
				let historyExists = historyData.findIndex((function(a) {
					return a == val;
				}))
				if (historyExists >= 0) {
					historyData.splice(historyExists, 1);
					// 保存到data
					this.history = historyData;
					// 保存到本地
					uni.setStorageSync("searchHistory", historyData);
				}
			},
			// 清除全部记录
			clearHistory() {
				this.history = [];
				// 清除本地记录
				uni.removeStorageSync("searchHistory");
			},
			// 回车搜索
			searchEnter() {
				this.searchData()
			},
			// 搜索符合要求的数据
			searchData() {
				let val = this.search;
				if (val.length <= 0) return this.$message.info("搜索内容不能为空")
				this.searching(this.history, val);
			},
		}
	}
</script>

<style scoped>
	.pt110 {
		padding-top: 110rpx;
	}

	.hot-img {
		width: 32rpx;
		height: 32rpx;
		margin-right: 6rpx;
	}

	.hot-box {
		display: inline-block;
		padding: 10rpx 18rpx;
		background: #F6F6F6;
		border-radius: 27px;
		margin: 10rpx 12rpx;
	}

	.time_img {
		width: 30rpx;
		height: 30rpx;
		margin-right: 19rpx;
	}

	.close_img {
		width: 22rpx;
		height: 22rpx;
	}

	.inputlength {
		width: 600rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}
</style>

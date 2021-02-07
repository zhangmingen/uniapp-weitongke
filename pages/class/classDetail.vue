<template>
	<view class="pb-100" v-if="SD">
		<image :src="SD.thumb_image_url" mode="aspectFill" class="cover-img"></image>
		<!-- nav -->
		<scroll-view scroll-x class="bg-white nav text-center text-lg solid-bottom padding-top-xs">
			<view class="cu-item nav-item" :class="index==TabCur?'nav_act text-theme text-bold':''" v-for="(item,index) in navArr"
			 :key="index" @tap="tabSelect" :data-id="index">
				<view>{{item}}</view>
				<view class="solid_act bg-theme"></view>
			</view>
		</scroll-view>
		<!-- content -->
		<view class="padding">
			<!-- 信息 -->
			<view v-if="TabCur==0" class="text-df">
				<view class="flex algin padding-bottom">
					<text class="text-bold padding-right flex-shrink">课题</text>
					<view>{{SD.title}}</view>
				</view>
				<view class="flex algin padding-bottom">
					<text class="text-bold padding-right flex-shrink">分类</text>
					<view>{{SD.cate_name}}</view>
				</view>
				<view class="flex algin padding-bottom">
					<text class="text-bold padding-right flex-shrink">课型</text>
					<view>{{SD.type_name}}</view>
				</view>
				<view class="flex algin padding-bottom" v-if="SD.sign_up">
					<text class="text-bold padding-right flex-shrink">上限</text>
					<view>
						<text class="padding-right flex-shrink">{{SD.sign_up}}人</text>
						<text class="text-sm text-org">剩{{SD.residue_num}}个名额</text>
					</view>
				</view>
				<view class="flex algin padding-bottom" v-if="SD.sign_down">
					<text class="text-bold padding-right flex-shrink">下限</text>
					<view>
						<text class="padding-right">{{SD.sign_down}}人</text>
						<text class="text-sm text-blue">离老师开课要求还差{{SD.insufficient}}人</text>
					</view>
				</view>
				<view class="flex algin padding-bottom">
					<text class="text-bold padding-right flex-shrink">容量</text>
					<view>共{{SD.total_section}}讲，授课{{SD.total_time}}分钟</view>
				</view>
				<view class="flex algin padding-bottom">
					<text class="text-bold padding-right flex-shrink">时间</text>
					<view>{{SD.create_time}}</view>
				</view>
				<view class="flex algin padding-bottom">
					<text class="text-bold padding-right flex-shrink">学费</text>
					<view>
						<text class="text-lg text-bold text-org">{{SD.price | integerFilter}}</text>
						<text class="text-sm"> 同币</text>
					</view>
				</view>
				<view class="flex algin padding-bottom" v-if="SD.teacher_arr.length>0 || SD.type==3">
					<text class="text-bold padding-right flex-shrink">老师</text>
					<view v-if="SD.teacher_arr.length>0">
						<view class="flex align-center padding-bottom-sm" v-for="(item,index) in SD.teacher_arr" :key="index">
							<view class="user_head">
								<u-image :src="item.head_img" mode="aspectFill" width="88rpx" height="88rpx" border-radius="50%" class="head_img" :lazy-load="true"></u-image>
								<image src="../../static/imgs/add.png" mode="aspectFill" class="attention_img" v-if="item.is_follow==0 && item.is_me==0"
								 @tap.stop="islike(item.id)"></image>
								<image src="../../static/imgs/tick.png" mode="aspectFill" class="attention_img" v-else-if="item.is_follow==1 && item.is_me==0" @tap.stop="islike(item.id)"></image>
							</view>
							<view class="flex flex-direction justify-between padding-tb-xs">
								<view class="text-df text-black text-bold">{{item.user_nickname}}</view>
								<view class="text-sm text-666 overflowhidden">{{item.label}}</view>
							</view>
						</view>
					</view>
					<view v-else>
						已有{{SD.teacher_sign_num}}位老师领取 <text class="teacherbtn" @tap="teacherfun(SD.id)">点击报名讲课</text>
					</view>
				</view>
			</view>
			<!-- 简介 -->
			<view v-if="TabCur==1" class="text-df">
				<view class=""> {{SD.short_detail}} </view>
				<image class="padding-top about-img" :src="item" mode="aspectFill" v-for="(item,index) in SD.content_img_url" :key="index"></image>
			</view>
			<!-- 课表 -->
			<view v-if="TabCur==2" class="text-df">
				<view class="flex algin padding-bottom" v-for="(item,index) in SD.section" :key="index">
					<text class="text-bold padding-right flex-shrink w110rpx">第{{index+1}}讲</text>
					<view class="solid-bottom flex-sub">
						<view class="padding-bottom-sm padding-right-sm">{{item.title}}</view>
						<view class="flex align-center justify-between padding-bottom-sm" v-if="item.status==0" @tap="close = true">
							<view class="text-sm text-grey flex align-center" >
								上直播课
								<image src="../../static/imgs/zhobogray.png" class="huifang-img" mode="aspectFill"></image>
							</view>
							<view class="text-sm text-999">{{item.live_date}}<text class="padding-left-xs"></text> {{item.start_time}}上课</view>
						</view>
						<view class="flex align-center justify-between padding-bottom-sm" v-else-if="item.status==1" @tap="close = true">
							<view class="text-sm text-org flex align-center" >
								<image src="../../static/imgs/huifang.png" class="huifang-img" mode="aspectFill"></image>
								观看回放
							</view>
							<view class="text-sm text-999">{{item.down_time}}下架</view>
						</view>
						<view class="flex align-center justify-between padding-bottom-sm" v-else-if="item.status==2" @tap="close = true">
							<view class="text-sm text-org flex align-center" >
								<image src="../../static/imgs/zhibohot.png" class="huifang-img" mode="aspectFill"></image>
								上直播课
							</view>
							<view class="text-sm text-999">{{item.end_time}}下课</view>
						</view>
						<view class="flex align-center justify-between padding-bottom-sm" v-else-if="item.status==3" @tap="close = true">
							<view class="text-sm text-org flex align-center" >
								<text class="text-grey">{{item.duration}}分钟</text>
								<image src="../../static/imgs/huifang.png" class="huifang-img" mode="aspectFill"></image>
								现在观看
							</view>
							<view class="text-sm text-999">{{item.down_time}}下架</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部导航 -->
		<view class="flex align-center bottom-nav text-center text-lg text-bold">
			<view class="flex-sub text-theme bg-org-rgba" @tap="freeDemo" v-if="SD.is_audition && SD.type!=2">免费试听</view>
			<view class="flex-sub text-theme bg-org-rgba" v-if="!SD.is_audition || SD.type==2">暂无试听</view>
			<view class="flex-sub bg-theme text-white" v-if="SD.is_sign_order==2">已购买</view>
			<view class="flex-sub bg-theme text-white" v-if="SD.is_sign_order!=2" @tap="signUpfun(SD.id)">立即报名</view>
		</view>
		<!-- modal -->
		<class-modal :show="close" @hideModal="hideModal">
			请前往App微同课观看
		</class-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur: 0,
				navArr: ['信息', '简介', '课表'],
				close: false,
				SD: null,
				optionId:''
			};
		},
		onLoad(option) {
			this.optionId = option.id
		},
		onShow(){
			// 直播课详情id
			this.getItem(this.optionId);
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			hideModal() {
				this.close = false
			},
			// 立即报名
			signUpfun(id) {
				uni.showLoading();
				let _this = this;
				this.$api.post(global.apiUrls.PostSignUp, {
						id: id,
						is_gzh: 1
					})
					.then(res => {
						if (res.data.code == '1') {
							uni.navigateTo({
								url: "/pages/class/signUp?id=" + id
							})
						} else if (res.data.code == '0') {
							_this.$message.info(res.data.msg)
						}
						uni.hideLoading();
					})
			},
			// 立即报名
			teacherfun(id) {
				uni.showLoading();
				let _this = this;
				this.$api.post(global.apiUrls.postTeacher, {
						course_id: id,
					})
					.then(res => {
						if (res.data.code == '1') {
							_this.$message.info(res.data.msg)
							setTimeout(function(){
								uni.navigateBack()
							},500)
						} else {
							_this.$message.info(res.data.msg)
						}
						uni.hideLoading();
					})
			},
			// 免费试听
			freeDemo() {
				this.close = true
			},
			// 获取详情
			getItem(id) {
				uni.showLoading()
				let _this = this;
				this.$api.post(global.apiUrls.PostClassItem, {
						id: id
					})
					.then(res => {
						if (res.data.code == 1) {
							uni.hideLoading();
							_this.SD = res.data.data;
						}
					})
			},
			// 点赞
			islike(userid) {
				let _this = this;
				this.$api.post(global.apiUrls.PostIsLike, {
						user_id: userid
					})
					.then(res => {
						if (res.data.code == 1) {
							_this.$message.info(res.data.msg);
							var teacherArr = _this.SD.teacher_arr;
							for (var i = 0; i < teacherArr.length; i++) {
								if (teacherArr[i].id == userid) {
									teacherArr[i].is_follow == 1 ? teacherArr[i].is_follow = 0 : teacherArr[i].is_follow = 1;
								}
							}
							_this.SD.teacher_arr = teacherArr;
							var pages = getCurrentPages(); //当前页
							var beforePage = pages[pages.length - 2]; //上个页面
							if(beforePage.refreshdata) beforePage.refreshdata(userid);
							
						}
					})
			}
		}
	}
</script>

<style scoped>
	.teacherbtn{
		display: inline-block;
		background-color: #FF5916;
		color: #FFFFFF;
		padding: 8rpx 10rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		margin-left: 10rpx;
	}
	.w110rpx {
		width: 80rpx;
	}

	.cover-img {
		width: 100%;
		height: 428rpx;
	}

	.nav_act .solid_act {
		width: 32rpx;
		height: 6rpx;
		border-radius: 3rpx;
		margin: 0 auto;
	}

	.nav-item {
		line-height: 60rpx;
		padding: 0 60rpx;
	}

	.huifang-img {
		width: 32rpx;
		height: 32rpx;
		margin-right: 6rpx;
		margin-left: 6rpx;
	}

	.bg-org-rgba {
		background-color: rgba(131, 185, 40, .1);
	}

	.bottom-nav {
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		height: 100rpx;
		line-height: 100rpx;
		background-color: #FFFFFF;
	}

	.pb-100 {
		padding-bottom: 100rpx;
	}

	.overflowhidden {
		width: 450rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	.about-img {
		width: 100%;
	}
</style>

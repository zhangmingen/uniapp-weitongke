<template>
	<view class="content" style="">
		<view v-if="list.length!=0" v-for="(item, index) in list" :key="index" id="list">
			<view v-if="!item.is_receive">
				<view class="items" @tap="change_coupon(item)" style="box-shadow:0px 0px 16px rgba(51,51,51,0.1);height: 177rpx;">
					<view class="flex justify-center align-center" style="width: 211rpx;height: 177rpx;background:linear-gradient(90deg,rgba(82,174,49,1) 0%,rgba(33,154,60,1) 100%);border-radius: 10rpx 0 0 10rpx;">
						<view class="flex" style="flex-direction: column;text-align: center;">
							<text class="text-sl" style="color: #fff;">{{item.money}}</text>
							<text class="text-xs" style="color: #fff;">全场通用</text>
						</view>
					</view>
					<view class="flex justify-center align-center" style="width: 50%;height: 177rpx;">
						<view class="flex" style="flex-direction: column;font-size: 24upx;line-height: 34rpx;margin-left: 20rpx;">
							<text class="text-xs text-bold" style="color: ;">满{{item.min_order_money}}可用</text>
							<text class="text-xs" style="color: ;margin-top: 5upx;">有效期至：{{item.end_time}}</text>
							<text class="text-xs" style="color: ;margin-top: 5upx;" @tap="Ishare(item)">详细信息 <text :class="item.share?'cuIcon-unfold':'cuIcon-fold'"></text></text>
							</text>
						</view>
					</view>
					<view class="flex justify-center align-center" style="width: 25%;height: 177rpx;margin-left: 30upx;"
					 @tap="addTime">
						<view class="flex" style="flex-direction: column;text-align: center;">
							<button class="cu-btn round sm detal margin-left-sm" @tap="receive(item.id, index)">领取</button>
						</view>
					</view>
				</view>
				<view v-if="item.share" class="padding-left"><text class="text-xs " style="margin: 0 0 0 5upx;">{{item.name||''}}</text></view>
			</view>
			<view v-else>
				<view class="items"  @tap="change_coupon(item)" style="box-shadow:0px 0px 16px rgba(51,51,51,0.1);height: 177rpx;">
					<view class="flex justify-center align-center" style="width: 211rpx;height: 177rpx;background:#BFBFBF;">
						<view class="flex" style="flex-direction: column;text-align: center;">
							<text class="text-sl text-gray">{{parseInt(item.money)}}</text>
							<text class="text-xs text-grey">全场通用</text>
						</view>
					</view>
					<view class="flex justify-center align-center" style="width: 45%;height: 177rpx;">
						<view class="flex" style="flex-direction: column;font-size: 24upx;line-height: 34rpx;margin-left: 20rpx;">
							<text class="text-xs " style="color: #999999;">满{{item.min_order_money}}可用</text>
							<text class="text-xs text-gray" style="margin-top: 5upx;">有效期至：{{item.end_time}}</text>
							<text class="text-xs text-gray" style="color: ;margin-top: 5upx;" @tap="Ishare(item)">详细信息 <text :class="item.share?'cuIcon-unfold':'cuIcon-fold'"></text></text>
						</view>
					</view>
					<view>

					</view>
					<view class="flex justify-center align-center" style="width: 35%;height: 177rpx;">
						<view class="flex" style="flex-direction: column;text-align: center;">
							<button class="cu-btn round sm yesdetal margin-left-sm">已领取</button>
							<!-- <text class="" style="color: #999999;padding-left: 20upx;">已领取</text> -->
						</view>
					</view>
				</view>
				<view v-if="item.share" class="padding-left"><text class="text-xs " style="margin: 0 0 0 5upx;">{{item.name||''}}</text></view>
			</view>
		</view>
		<view class="flex align-center justify-center flex-direction" style="width: 100%;height: 600rpx;" v-if="list.length==0">
			<image src="http://yfs.huaiyangren.cntis/images/mescroll/mescroll-empty.png" mode="" style="width: 300rpx;height: 304rpx;"></image>
			<text class="text-gray margin-top">暂无可领优惠券</text>
		</view>
	</view>
</template>

<script>
    var _self;
	export default {
		data() {
			return {
				list: []
			};
		},
        onLoad() {
            _self = this;
            this.get_coupon_type_list();
        },
		methods: {
			Ishare(item){
				item.share = !item.share
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				console.log(this.TabCur);
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				console.log(this.scrollLeft);
			},
			get_coupon_type_list() {
                var user = uni.getStorageSync('USERINFO');
                var data = {};
                data.method = 2
                console.log(user.id);
                if(user.id > 0){
                    data.user_id = user.id
                }
			    this.$Request.get(this.$api.operation.get_coupon_type_list, data).then(res => {
			        if (res.code == 1) {
						res.data.forEach(item=>{
							item.share=false
						})
			            _self.list = res.data;
			        }
			    });
			},
            receive(cid,index){
                this.$Request.post(this.$api.operation.receive_coupon, {cid:cid}).then(res => {
                    uni.showToast({
                        title:res.msg,
                        icon:"none"
                    })
                    if (res.code == 1) {
                        _self.list[index].is_receive = 1;
                    }
                });
            },
			toPage: function(page) {
				uni.navigateTo({
					url: page
				});
			},
		}
	}
</script>

<style>
	.items .lingqu{
		-webkit-writing-mode: vertical-rl;
		writing-mode: vertical-rl;
		font-size: 26rpx;
		color: #fff;
		letter-spacing: 1.7px;
		width: 100rpx;
		display: flex;
		align-items: center;
	}
	.items .leftBox .left text{
		font-size: 48rpx;
		margin-left: 10rpx;
	}
	.items .leftBox .left{
		font-weight: bold;
		color: #FB5248;
		letter-spacing: 1.7px;
		font-size: 28rpx;
		width: 120rpx;
	}
	.items .leftBox .middle::before,.items .leftBox .middle::after{
		content: ' ';

	}
	.items .leftBox{
		display: flex;
		align-items: center;
		height: 100%;
	}
	.items .leftBox .middle text:nth-of-type(1){
		color: #333333;
		font-weight: bold;
		font-size: 30rpx;
	}
	.items .leftBox .middle text:nth-of-type(2){
		color: #999;
		font-size: 22rpx;
	}
	.items .leftBox .middle text:nth-of-type(3){
		color: #999;
		font-size: 22rpx;
	}
	.items .leftBox .middle{
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin-left: 30rpx;
	}
	.items{
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* padding: 0 0 0 20rpx; */
	}
	.detal{
		background:linear-gradient(270deg,rgba(33,154,60,1) 0%,rgba(82,174,49,1) 100%) !important;
		color: #fff !important;
	}
	.yesdetal{
		background:#BFBFBF !important;
		color: #fff !important;
	}
	.gray .leftBox .middle text:nth-of-type(1){
		color: #999 !important;
	}
	.gray .leftBox .left{
		color: #999;
	}
	.gray{
		background-image: url(http://yfs.huaiyangren.cntis/images/invite/img_yhjxx@2x.png) !important;
	}
	.items{
		width: 612rpx;
		height: 164rpx;
		margin: 0 auto 30rpx;
		background-image: url(http://yfs.huaiyangren.cntis/images/invite/bg_youhuijuan@2x.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
	.bg_bai > text::after{
		content: '';
		display: inline-block;
		width: 70rpx;
		height: 1px;
		background: #EE6A37;
		margin-left: 50rpx;
	}
	.bg_bai > text::before{
		content: '';
		display: inline-block;
		width: 70rpx;
		height: 1px;
		background: #EE6A37;
		margin-right: 50rpx;
	}
	.bg_bai > text{
		display: flex;
		color: #EE6A37;
		align-items: center;
		justify-content: center;
		line-height: 150rpx;
		font-size: 34rpx;
		letter-spacing: 1.3px;
	}
	.bg_bai{
		width: 690rpx;
		height: 50vh;
		background-image: url(http://yfs.huaiyangren.cntis/images/invite/bg_bai@2x.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		margin: 0 auto 30rpx;
		position:fixed;
		left: 30rpx;
		bottom: 20rpx;
		z-index: 2;
		overflow-y: scroll;
	}
	.content > image:nth-of-type(2){
		width: 568rpx;
		height: 256rpx;
		display: block;
		margin: 0 auto 0;
		padding-top: 100rpx;
		position:relative;
		z-index: 2;
	}
	.content > image:nth-of-type(1){
		width: 750rpx;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	page{
		/* background: rgb(236, 84, 19); */
		background: #FFFFFF;
	}
	.xian {
		background: transparent;
		width: 630rpx;
		border: 0;
		border-top: 1px dashed #f1f1f1;
		display: block;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 80rpx;
	}

	.items {
		width: 700rpx;
		height: 250rpx;
		background: #fff;
		margin: 30rpx auto 0;
		border-radius: 20rpx;
		position: relative;
		/* padding: 35rpx 30rpx 13rpx; */
		display: flex;
		font-size: 28rpx;
	}

	/* .items::after {
		content: '';
		display: inline-block;
		padding: 0 !important;
		font-size: 0 !important;
		width: 28rpx;
		height: 28rpx;
		box-sizing: border-box;
		border-radius: 50%;
		border-left: 14.2rpx solid #FFFFFF;
		border-top: 14.2rpx solid #FFFFFF;
		border-bottom: 14.2rpx solid transparent;
		border-right: 14.2rpx solid transparent;
		transform: rotate(228deg);
		position: absolute;
		right: 176.2rpx;
		top: 0rpx;
	}

	.items::before {
		content: '';
		display: inline-block;
		padding: 0 !important;
		font-size: 0 !important;
		width: 28rpx;
		height: 28rpx;
		box-sizing: border-box;
		border-radius: 50%;
		border-left: 14.2rpx solid #ffffff;
		border-top: 14.2rpx solid #ffffff;
		border-bottom: 14.2rpx solid transparent;
		border-right: 14.2rpx solid transparent;
		transform: rotate(48deg);
		position: absolute;
		right: 176.2rpx;
		bottom: -15rpx;
	} */

	.nav {
		margin-bottom: 20upx;
	}

	.nav .cu-item.cur {
		position: relative;
		border-bottom: 0;
	}

	.nav .cu-item.cur::after {
		content: '';
		display: none;
	}
</style>

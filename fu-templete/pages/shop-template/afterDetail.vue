<template>
	<view class="page">
		<!-- <cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">服务单详情</block>
		</cu-custom> -->
		<view>
			<!-- 进度 -->
			<view class="">
				<view class="padding bg-gradual-orange">
					<uni-steps :options="steps" :active="speed" activeColor="#ffffff" deactiveColor="rgba(255,255,255,.5)"></uni-steps>
				</view>
				<view class="margin-lr radius-20 bg-white padding" style="transform: translateY(-20rpx);">
					<text class="text-sm">{{statusStr}}</text>
				</view>
			</view>
			<!-- 退款信息 -->
			<view class="padding-lr" v-if="false">
				<view class="radius-20 bg-white padding flex justify-between">
					<view class="text-bold text-333 text-df">退款总额</view>
					<view class="text-price text-bold text-df text-theme">269.00</view>
				</view>
			</view>
			<!-- 商品信息 -->
			<view class="padding-lr margin-top-sm" v-if="goodsInfo">
				<view class="radius-20 bg-white padding">
					<view class="text-bold text-333 text-df">商品信息</view>
					<view class="margin-top-sm flex">
						<view class="block-150 margin-right-sm">
							<image class="radius" :src="goodsInfo.thumb" mode="aspectFill"></image>
						</view>
						<view class="flex-sub flex flex-direction justify-between">
							<view class="text-sm text-cut-2">{{goodsInfo.name}}</view>
							<view class="">
								<text class="text-xs">
									<text class="text-999 margin-right-xs">单价:</text>
									<text class="text-bold text-price text-333">{{goodsInfo.goods_money}}</text>
								</text>
								<text class="text-xs margin-left">
									<text class="text-999 margin-right-xs">申请数量: </text>
									<text class="text-bold text-333">{{goodsInfo.num}}</text>
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 服务单信息 -->
			<view class="padding-lr margin-top-sm">
				<view class="radius-20 bg-white padding">
					<view class="list-item">
						<text class="title">服务单号 </text>
						<text class="text-sm">{{afterInfo && afterInfo.server_sn}}</text>
					</view>
					<view class="list-item">
						<text class="title">申请时间</text>
						<text class="text-sm">{{afterInfo && afterInfo.create_time | parseTime}}</text>
					</view>
					<view class="list-item">
						<text class="title">服务类型</text>
						<text class="text-sm">{{afterInfo && afterInfo.refund_type}}</text>
					</view>
					<view class="list-item">
						<text class="title">申请原因</text>
						<text class="text-sm">{{afterInfo && afterInfo.refund_content}}</text>
					</view>
				</view>
			</view>
		</view>
    <view class="padding-lr margin-top-sm" v-if="imgs">
    	<view class="radius-20 bg-white padding">
    		<view class="text-bold text-333 text-df">退款凭证照片</view>
    		<view class="margin-top-sm flex flex-wrap">
    			<view class="block-150 margin-right-sm margin-top-sm" v-for="(item,index) in imgs" :key="index">
    				<image class="radius" :src="item" mode="aspectFill"></image>
    			</view>
    		</view>
    	</view>
    </view>
		<view class="solid-top bottom-action" v-if="status == 0 || status == 1">
			<button v-if="status == 0" class="cu-btn line-black round sm line-theme add" @click="cancelAfter">取消申请</button>
			<button v-if="status == 1 && afterInfo.refund_type == '2'" class="cu-btn line-black round sm line-theme margin-left add" @click="sendLog">寄回商品</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				steps: [
					{title: '提交申请'},
					{title: '商家审核'},
					{title: '商家收货'},
					{title: '退款'},
					{title: '完成'}
				],
				speed: 0,
				goodsInfo: null,
				afterInfo: null,
				status: 0,
				statusStr: '',
        imgs:[]
			};
		},
		filters: {
			parseTime(val){
				if(!val) return '';
				let date = new Date(val*1000);
				let year = date.getFullYear();
				let month = (date.getMonth() + 1) + '';
				let day = date.getDate()+'';
				let hour = date.getHours()+'';
				let minute = date.getMinutes()+'';
				let second = date.getSeconds()+'';

				if(month.length == 1) month = '0'+month;
				if(day.length == 1) day = '0'+day;
				if(hour.length == 1) hour = '0'+hour;
				if(minute.length == 1) minute = '0'+minute;
				if(second.length == 1) second = '0'+second;
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
			}
		},
		methods: {
			// 取消售后
			cancelAfter(){
        let that = this
				that.$api.post(global.apiUrls.getGoodsAfterSaleCentel,{
					id: that.id,
				}).then(res => {
					console.log(res)
          that.$message.info(res.data.msg);
					if(res.data.code == 1){
						setTimeout(()=>{
              that.getData();
            },500)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 提交物流信息
			sendLog(){
				this.$urouter.navigateTo({
				  url: '/fu-templete/pages/shop-template/afterExpress',
				  params: {
				    id: this.id
				  }
				})

			},
			getData(){
        let that = this
				that.$api.post(global.apiUrls.getGoodsAfterSaleDetaile,{
					id: that.id
				}).then(res => {
					console.log(res);
					if(res.data.code == 1){
						let data = res.data.data[0];
						console.log(data)
						that.goodsInfo = data.goods_info;
            that.imgs = data.refund_picture;
						that.afterInfo = {
							server_sn: data.server_no,
							create_time: data.create_time,
							refund_content: data.refund_content,
							refund_type: data.refund_type,
						}
						that.status = data.status;
            console.log(that.status)
						that.filterStatus(data.status);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			filterStatus(status){
        console.log(status)
        let that = this
				switch(Number(status)){
					case -2:
						that.statusStr = '服务已取消,如有需要可在售后申请页重新提交服务单';
						that.steps = [{title: '提交申请'},{title: '服务单已取消'}];
						that.speed = 1;
					break;
					case -1:
						that.statusStr = '商家已驳回,如有疑问请联系商家客服';
						that.steps = [{title: '提交申请'},{title: '商家驳回'}];
						that.speed = 1;
					break;
					case 0:
						that.statusStr = '您的服务单已申请成功,待售后审核中';
						that.speed = 0;
					break;
					case 1:
						if(that.afterInfo.refund_type == '1'){
							that.steps = [{title: '提交申请'},{title: '商家审核'},{title: '退款'},{title: '完成'}];
							that.statusStr = '商家已同意您的售后申请,将在(1-3)工作日内退款';
						}else{
							that.statusStr = '商家已同意您的售后申请,请尽快寄回商品';
						}
						that.speed = 1;
					break;
					case 2:
						that.statusStr = '商家已收货,将在(1-3)工作日内退款';
						that.speed = 2;
					break;
					case 3:
						if(that.afterInfo.refund_type == '退款'){
							that.steps = [{title: '提交申请'},{title: '商家审核'},{title: '退款'},{title: '完成'}];
							that.speed = 3;
						}
						that.statusStr = '服务已完成,感谢您对犇腾家的支持';
						that.speed = 4;
					break;
				}
			},
		},
		onLoad(options) {
			const {id} = options;
			this.id = id;
			this.getData();
		}
	}
</script>

<style lang="scss" scoped>
	.block-150{
		width: 150rpx;
		min-width: 150rpx;
		height: 150rpx;
		min-height: 150rpx;
    background-color: #EEEEEE;
		image{
			width: 100%;
			height: 100%;
		}
	}
  .add{
    background: $fu-btn-bg !important;
    color: $uni-text-color-inverse;
  }
	.list-item{
		word-break: break-all;
		.title{
			display: inline-block;
			width: calc(4em + 30rpx);
			font-size: 24rpx;
		}
	}
	.list-item+.list-item{
		margin-top: 20rpx;
	}
	.bottom-action{
		background-color: #FFFFFF;
		height: 100rpx;
		height: calc(100rpx + constant(safe-area-inset-bottom));
		height: calc(100rpx + env(safe-area-inset-bottom));
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 32rpx;


	}
</style>

<template>
	<view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view v-for="(item,index) in navs" :key="index" class="cu-item flex-sub" :class="item.status == TabCur ? 'cur' : ''" @tap="tabSelect(item.status)" :data-id="1">{{item.name||''}}</view>
			</view>
		</scroll-view>
		<view v-for="(item, index) in listData" :key="index" id="list">
			<view class="coup">
				<view class="items">
					<view class="flex justify-center align-center " :class="item.status==1?'Addresstrue':'addsfrom'" style="">
						<view class="flex " style="flex-direction: column;text-align: center;">
							<text class="text-sl" style="color: #fff;">{{item.money}}</text>
							<text class="text-xs" style="color: #fff;">{{item.coupon_name}}</text>
						</view>
					</view>
					<view class="flex margin-left-sm align-center" style="width: 45%;height: 177rpx;">
						<view class="flex flex-direction " style="font-size: 24upx;line-height: 60rpx;">
							<text class="text-xs text-bold">满{{item.min_order_money}}可用</text>
							<text class="text-xs" style="margin-top: 5upx;">有效期至：{{item.end_time}}</text>
							</text>
						</view>
					</view>
					<view class="flex justify-center align-center" style="width: 25%;height: 177rpx;margin-left: 30upx;"
					 @tap="addTime">
						<view class="flex" style="">
							<button class="cu-btn round sm " :class="item.status==1?'ctr':''">{{item.status==1?'未使用':'已失效'}}</button>
						</view>
					</view>
				</view>
				<view v-if="item.share" class="padding-left"><text class="text-xs " style="margin: 0 0 0 5upx;">{{item.content||''}}</text></view>
			</view>
		</view>
    <fu-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
     :list-data-length="listDataLength"></fu-empty>

	</view>
</template>

<script>
   import pagingList from '@/common/minix/paging_list.js'
	let _self;
	export default {
     mixins: [pagingList],
		data() {
			return {
        navs:[
          {status:1,name:'全部'},
          {status:2,name:'未使用'},
          {status:3,name:'已失效'}
        ],
				TabCur: 1,
				scrollLeft: 0,
        hidden: false,
        minixPagingListsApi: global.apiUrls.get_user_coupn,
        pageingListApiMethod:"get",
				// list: {},
				// is_change: 0,
				// order_price: 0,
				// share:false
			};
		},
		onLoad(e) {
			_self = this;
		},
		onShow() {

		},
		onNavigationBarButtonTap(e){
			uni.navigateTo({
				url:'/pages/center/coupon/get_coupon'
			})
		},
		methods: {
			Ishare(item){
				item.share = !item.share
			},
			tabSelect(status) {
        console.log(this.pagingListAllowLoadMore)
        if(!this.pagingListAllowLoadMore) return false
				this.TabCur = status;
       this.pagingListToggle()
			},
      pagingListPostData() {
        let { navs , TabCur} = this
      	return {
      		type: this.TabCur
      	}
      },
		}
	};
</script>

<style lang="scss">
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

	.coup{
		width: 700rpx;
		/* height: 250rpx; */
		background: #fff;
		margin: 30rpx auto 0;
		border-radius: 20rpx;
		position: relative;
		font-size: 28rpx;
	}
	.items {
		width: 700rpx;
		height: 200rpx;
		display: flex;

	}
	.detal{
		background:linear-gradient(270deg,rgba(33,154,60,1) 0%,rgba(82,174,49,1) 100%) !important;
		color: #fff !important;
	}
	.yesdetal{
		background:#BFBFBF !important;
		color: #fff !important;
	}
	.items::after {
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
	}
  .Addresstrue{
    min-width: 211rpx;
    height: 100%;
    background:$fu-main-color;
    border-radius: 20rpx;
  }
	.nav {
		margin-bottom: 20upx;
	}

	.nav .cu-item.cur {
		position: relative;
		border-bottom: 0;
		color: $fu-main-color;
		border-bottom: 1rpx solid $fu-main-color;
	}

	.nav .cu-item.cur::after {
		content: '';
		display: none;
	}
  .addsfrom{
    min-width: 211rpx;height: 177rpx;background:$fu-type-info;
  }
  .ctr{
    background:$fu-type-primary;
    color: $fu-type-error-light;
  }
</style>

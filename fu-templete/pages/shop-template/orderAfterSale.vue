<template>
	<view class="page">
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index == current?'cur':''" v-for="(item,index) in navs" :key="index" @tap="tabSelect(item.type,index)">
					{{item.title}}
				</view>
			</view>
		</scroll-view>
		<view :style="{height: 'calc(100% - '+CustomBar+'px - 100rpx)'}">

				<block v-for="(item,index) in listData" :key="index">
					<view class="margin-bottom-sm bg-white padding-lr padding-tb-sm">
						<view class="flex justify-between">
							<text class="text-sm text-666">服务单号: {{item.server_no}}</text>
							<text class="text-sm text-bold">
                {{item.status | filterStatus}}
              </text>
						</view>
						<view class="flex margin-top-sm" @click="toDetail(item)">
							<view class="block-150 margin-right-sm">
								<image class="radius" :src="item.goods_thumb" mode="aspectFill"></image>
							</view>
							<view class="flex-sub">
                <!-- {{item.goods_name}} -->
								<view class="text-df text-cut-2">{{item.goods_name}}</view>
								<view class="text-sm text-999 margin-top-sm">数量: {{item.num}}</view>
							</view>
						</view>
						<view class="flex justify-end" v-if="item.status >=0 && item.status < 2">
							<button :loading="is_click" v-if="item.status == 0 " class="cu-btn line-theme round sm add" :disabled="false" @click.stop="cancelAfter(item)">取消申请</button>
              <button v-if="status == 1 && item.refund_type == '2'" class="cu-btn line-black round sm line-theme margin-left add" @click="sendLog">寄回商品</button>
            </view>
					</view>
				</block>
		</view>
    <fu-empty :paging-list-loaded-all="pagingListLoadedAll" :paging-list-no-list-data="pagingListNoListData"
     :list-data-length="listDataLength"></fu-empty>
	</view>
</template>

<script>
     import pagingList from '@/common/minix/paging_list.js'
	export default {
    mixins: [pagingList],
		data() {
			return {
				CustomBar: this.CustomBar,
				type: 'apply',
        is_click:false,
				navs: [
					{title: '申请中',type: 'apply'},
					{title: '已处理',type: 'deal'},
				],
				current: 0,
         hidden: false,
         minixPagingListsApi: global.apiUrls.getGoodsAfterSale,
         pageingListApiMethod:"get",
			};
		},
    filters: {
    	filterStatus(val){
    		switch (val){
    			case 0: return '申请中';
    			case 1: return '商家已同意';
    			case 2: return '商家已收回';
    			case 3: return '商家已打款';
    			case -1: return '商家驳回';
    			case -2: return '用户取消';
    			default: return '';
    		}
    	}
    },
		methods: {
      toDetail(item){
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/afterDetail',
          params: {
            id: item.id
          }
        })
      },
			// 取消申请
			cancelAfter(item){
        let that = this
        if(that.is_click) return

        that.is_click = true
				that.$api.post(global.apiUrls.getGoodsAfterSaleCentel,{
          id:item.id
        })
				.then(res => {
					console.log(res);
				  that.$message.info(res.data.msg);
					if(res.data.code == 1){
            that.is_click = false
						that.tabSelect(that.type,that.current)
					}
				})
				.catch(err => {
					console.log("err: " + JSON.stringify(err));
				})
			},
			// 申请售后
      pagingListPostData() {
        let { navs , TabCur} = this
      	return {
      		type:  this.type
      	}
      },
			tabSelect(type,index){
        console.log(this.pagingListAllowLoadMore)
         if(!this.pagingListAllowLoadMore) return false
            this.current = index;
            this.type = type;
        this.pagingListToggle()

			}
		},
	}
</script>

<style lang="scss" scoped>
  .add{
    background: $fu-btn-bg !important;
    color: $uni-text-color-inverse;
  }
	.page{
		height: 100%;
		min-height: 100%;
		max-height: 100%;
	}
	.block-150{
		width: 150rpx;
		mim-width: 150rpx;
		height: 150rpx;
		min-height: 150rpx;
    background-color: #EEEEEE;
		image{
			width: 100%;
			height: 100%;
		}
	}
.nav .cu-item.cur {
		position: relative;
		border-bottom: 0;
		color: $fu-main-color;
		border-bottom: 1rpx solid $fu-main-color;
	}
</style>

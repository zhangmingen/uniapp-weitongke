<template>
  <view class="page">
    <view class="navbar solid-top">
      <block v-for="(item, index) in navList" :key="index">
        <view class="nav-item" :class="{current: tabCurrentIndex === index}" @click="tabClick(index)">
          {{item.text}}
        </view>
      </block>
    </view>
    <view class="list">
      <block v-for="(item,index) in lists" :key="index">
        <view class="order-item" @click="navToOrderDetail(item)">
          <view class="i-top b-b">
            <text class="time">
              <text>订单编号: {{item.order_sn}} </text>
            </text>
            <text class="state">{{item.status | filterStatus}}</text>
          </view>
          <view class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goods" :key="goodsIndex">
            <image class="goods-img radius" :src="goodsItem.goods_thumb" mode="aspectFill"></image>
            <view class="right padding-lr">
              <view class="text-df text-333 text-cut-2">{{goodsItem.goods_name}}</view>
              <view class="text-sm text-999 text-cut">{{goodsIndex.sku_name}}</view>
              <view class="flex justify-between align-center">
                <text class="text-lg text-theme text-price">{{goodsItem.goods_money}}</text>
                <text class="text-xs text-999">x {{goodsItem.num}}</text>
              </view>
              <view class="text-right" v-if="goodsItem.order_refund_status==0" style="color: rgb(247, 173, 50); font-size: 24rpx;">售后中</view>
              <view class="text-right" v-if="goodsItem.order_refund_status==-2" style="color: rgb(247, 173, 50); font-size: 24rpx;">用户取消</view>
              <view class="text-right" v-if="goodsItem.order_refund_status==-1" style="color: rgb(247, 173, 50); font-size: 24rpx;">驳回</view>
              <view class="text-right" v-if="goodsItem.order_refund_status==1" style="color: rgb(247, 173, 50); font-size: 24rpx;">同意</view>
              <view class="text-right" v-if="goodsItem.order_refund_status==2" style="color: rgb(247, 173, 50); font-size: 24rpx;">确认收回</view>
              <view class="text-right" v-if="goodsItem.order_refund_status==3" style="color: rgb(247, 173, 50); font-size: 24rpx;">退款成功</view>
            </view>
          </view>
          <view class="price-box">
            <view>
            </view>
            <view>
              合计：
              <text class="price">{{item.payable_money}}</text>
            </view>
          </view>
          <view class="action-box">
            <button class="action cu-btn round" v-if="item.status == 4 || item.status == 3 || item.status == 6 || item.status == 7"
              @click.stop="delOrder(item.order_sn)">删除订单</button>
            <!-- 取消订单 为支付 0 -->
            <button class="action cu-btn recom" v-if="item.status == 0" @tap.stop="cancelOrder(item.order_sn)">取消订单</button>
            <!-- 去支付 未支付 0 -->
            <button class="action cu-btn round bgclor" style=" color: #FFFFFF;" v-if="item.status == 0" @click.stop="toPay(item.order_sn, item.order_type)">去支付</button>
            <!-- 可提醒发货 已付款 1 拼团商品除外 预售商品除外  -->
            <view class="" v-if="item.status == 1 && item.order_type != 5 && item.status != 2">
              <button v-if="item.is_remind.info==0" class="action cu-btn round" @click.stop="remindOrder(item.order_sn)">提醒发货</button>
              <button class="cu-btn round action have_click" disabled="false" v-else>已提醒</button>
            </view>
            <!-- 申请售后 已完成 3 已评价  -->
            <!-- <button class="action cu-btn round" v-if="item.status >= 1 && item.status <= 4" @click="aftersalesOrder(item)">{{i18n[13]}}</button> -->
            <!-- <button class="action cu-btn round bgclor" style=" color: #FFFFFF; border: none;" v-if="item.status != 0"
              @click.stop="again(item)">再来一单</button> -->
            <!-- 确认收货  已发货 2 -->
            <button class="action cu-btn round" v-if="item.status == 2 && item.status != 5" @click.stop="receiveOrder(item.order_sn)">确认收货</button>
            <!-- 评价 已完成 3 -->
            <!-- <button class="action cu-btn round" v-if="item.status == 3" @click.stop="commentOrder(item.order_sn)">{{i18n[14]}}</button> -->
          </view>
        </view>
      </block>
    </view>
    <!-- 空布局 -->
    <fu-empty-01 v-if="lists.length == 0 && isInit"></fu-empty-01>
    <!-- 加载状态 -->
    <uni-load-more v-if="lists.length > 5" :status="status"></uni-load-more>
  </view>
</template>

<script>
  const tabs = [{
      state: 0,
      text: '全部',
      type: 'all',
    },
    {
      state: 1,
      text: '待付款',
      type: 'unpay',
    },
    {
      state: 2,
      text: '待发货',
      type: 'unship',
    },
    {
      state: 3,
      text: '待收货',
      type: 'unreceive',
    },
    {
      state: 4,
      text: '已完成',
      type: 'finish',
    },
  ];
  export default {
    data() {
      return {
        tabCurrentIndex: 0,
        navList: Object.freeze(tabs),
        lists: [],
        page: 1,
        size: 10,
        status: 'more',
        isInit: false,
        cancelSn: null,
      };
    },
    filters: {
    	filterStatus(val){
    		switch (val){
    			case 0: return '待付款';
    			case 1: return '已付款';
    			case 2: return '已发货';
    			case 3: return '已完成';
    			case 4: return '已评价';
    			case 5: return '售后中';
    			case 6: return '售后完成';
    			case 7: return '售后驳回';
    			case -1: return '已取消';
    			default: return '';
    		}
    	}
    },
    onLoad(options) {
      const { type = 'all' } = options;
      const _item = this.navList.find((item) => {
        return item.type == type
      })
      this.tabCurrentIndex = _item.state;
      this.type = _item.type;
    },
    onShow() {
      this.page = 1;
      this.status = 'more';
      this.getOrderList();
    },
    onPullDownRefresh() {
      this.refreshOrderList();
    },
    methods: {
      // 顶部tab点击
      tabClick(index) {
        this.tabCurrentIndex = index;
        this.type = this.navList[index].type;
        this.refreshOrderList();
      },
      // 获取列表
      getOrderList(){
        if(this.status != 'more') return ;
        this.status = 'loading';
        let data = {
        	type: this.type,
        	page: this.page,
        	size: this.size,
        }
        this.$api.post(global.apiUrls.getOrderList,data)
        .then(res => {
          console.log('订单列表',res);
        	if(res.data.code == 1){
        		var curPageData = res.data.data.list;
        		if(this.page == 1) this.lists = [];
        		this.lists = this.lists.concat(curPageData);
            if(curPageData >= this.size){
              this.statsus = 'noMore';
            }else{
              this.status = 'more';
              this.page++;
            }
        	}else{
            this.$message.info(res.data.msg);
        	}
          this.isInit = true;
          uni.stopPullDownRefresh();
        })
        .catch(err => {
          uni.stopPullDownRefresh();
        })
      },
      // 取消订单
      cancelOrder(sn){
        global.customShowModalPopup({
          title: '提示',
          content: '确定要取消订单吗?',
          success: (res) => {
            if(res.confirm){
              this.$api.post(global.apiUrls.postCancelOrder, {
              	order_sn: sn,
              	// return_id: reasonId
              }).then(res => {
              	console.log("取消订单操作",res);
              	// this.$refs.popup.close();
              	if (res.data.code == 1) {
              		this.$message.info('提交成功,正在为您取消订单');
              		setTimeout(() => {
                    this.refreshOrderList();
              		},800)
              	}
              }).catch(err => {
              	console.log("err: " + JSON.stringify(err));
              })
            }
          }
        })
      },
      // 删除订单
      delOrder(sn) {
        global.customShowModalPopup({
          title: '确认删除此订单?',
          content: '删除后不可恢复',
          success: (res) => {
          	if(res.confirm){
          		this.$api.post(global.apiUrls.postDelOrder, {
          			order_sn: sn
          		})
          		.then(res => {
          			console.log("删除回调: " ,res);
          			this.$message.info('删除成功');
                setTimeout(() => {
                  let _index = this.lists.findIndex(item => item.order_sn == sn);
                  this.lists.splice(_index,1);
                },600)
          		})
          		.catch(err => {
          			console.log("err: " + JSON.stringify(err));
          		})
          	}
          }
        })
      },
      // 去支付
      toPay(sn, type){
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/pay_order',
          params: {
            order_sn: sn,
            order_type: type,
          }
        })
      },
      // 提醒发货
      remindOrder(sn){
        this.$api.post(global.apiUrls.postRemindShipment,{order_sn: sn})
        .then(res => {
        	// console.log("res: " + JSON.stringify(res));
        	this.$message.info('已提醒,请耐心等待');
          this.refreshOrderList();
        })
        .catch(err => {
        	console.log("err: " + JSON.stringify(err));
        })
      },
      // 确认收货
      receiveOrder(sn){
        global.customShowModalPopup({
          title: '提示',
          content: '您是否确认收到货物?',
          success: (res) => {
            this.$api.post(global.apiUrls.postConfirmOrder,{order_sn: sn})
            .then(res => {
            	console.log("res: " + JSON.stringify(res));
              this.refreshOrderList();
            })
            .catch(err => {
            	console.log("err: " + JSON.stringify(err));
            })
          }
        })
      },
      // 查看订单详情
      navToOrderDetail(item){
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/order_detail',
          params: {
            order_sn: item.order_sn,
            status: item.status,
            order_type: item.order_type,
          }
        })
      },
      // 重置列表
      refreshOrderList(){
        this.page = 1;
        this.status = 'more';
        this.getOrderList();
      }
    },
  }
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
  }

  .navbar {
    display: flex;
    height: 40px;
    padding: 0 5px;
    background: #FFFFFF;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .06);

    .nav-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 15px;
      color: #333333;
      position: relative;

      &.current {
        color: $fu-main-color;

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 44px;
          height: 0;
          border-bottom: 2px solid $fu-main-color;
        }
      }
    }
  }

  .order-item{
  	display: flex;
  	flex-direction: column;
  	padding-left: 30upx;
  	background: #fff;
  	margin-top: 16upx;
  	border-radius: 16rpx;
  	.i-top{
  		display: flex;
  		align-items: center;
  		height: 80upx;
  		padding-right:30upx;
  		font-size: 28rpx;
  		color: #333333;
  		position: relative;
  		.time{
  			flex: 1;
  		}
  		.state{
  			color: $fu-main-color;
  		}
  		.del-btn{
  			padding: 10upx 0 10upx 36upx;
  			font-size: 24rpx;
  			color: #F8F8F8;
  			position: relative;
  			&:after{
  				content: '';
  				width: 0;
  				height: 30upx;
  				border-left: 1px #CCCCCC;
  				position: absolute;
  				left: 20upx;
  				top: 50%;
  				transform: translateY(-50%);
  			}
  		}
  	}
  	/* 多条商品 */
  	.goods-box{
  		height: 160upx;
  		padding: 20upx 0;
  		white-space: nowrap;
  		.goods-item{
  			width: 120upx;
  			height: 120upx;
  			display: inline-block;
  			margin-right: 24upx;
  		}
  		.goods-img{
  			display: block;
  			width: 100%;
  			height: 100%;
        background-color: #EEEEEE;
  		}
  	}
  	/* 单条商品 */
  	.goods-box-single{
  		display: flex;
  		padding: 20upx 0;
  		.goods-img{
  			display: block;
  			width: 150upx;
  			height: 150upx;
        background-color: #EEEEEE;
  		}
  		.right{
  			flex: 1;
  			display: flex;
  			flex-direction: column;
  			justify-content: space-between;
  			overflow: hidden;
  			.attr-box{
  				font-size: 24rpx;
  				color: #F8F8F8;
  				padding: 10upx 12upx;
  			}
  		}
  	}

  	.price-box{
  		display: flex;
  		justify-content: space-between;
  		align-items: center;
  		padding: 20upx 30upx 20upx 0;
  		font-size: 24rpx;
  		color: #333333;
  		.num{
  			margin: 0 8upx;
  			color: #333333;
  		}
  		.price{
  			font-size: 40rpx;
  			color: #333333;
  			&:before{
  				content: '￥';
  				font-size: 24rpx;
  				margin: 0 2upx 0 8upx;
  			}
  		}
  	}
  	.action-box{
  		display: flex;
  		justify-content: flex-end;
  		align-items: center;
  		height: 100upx;
  		position: relative;
  		padding-right: 30rpx;
  		.action{
  			width: 130rpx;
  			height: 50rpx;
  			font-size: 24rpx;
        border-radius: 50rpx;
        line-height: 50rpx;
  			padding: 0;
  			color: #666666;
  			background-color: #FFFFFF;
  			border: 1rpx solid #666666;
  			margin-left: 20rpx;
  		}
  		&> .action:last-child {
        background-color: #f02523;
  			color: #FFFFFF;
        border: none;
  		}
      .action+.action{
        margin-left: 20rpx;
      }
  	}
  }
</style>

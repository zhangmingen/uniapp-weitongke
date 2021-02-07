<template>
  <view class="page">
    <view class="cu-custom header">
      <view class="cu-bar fixed bg" :style="{height: CustomBar+'px',paddingTop: StatusBar+'px'}">
        <view class="action" @tap="back">
          <text class="cuIcon-back"></text>
        </view>
        <view class="content" :style="[{top: StatusBar+'px'}]">订单详情</view>
      </view>
      <view :style="{height: CustomBar+'px'}"></view>
      <view class="flex flex-direction" :style="{height: 'calc(100% - '+CustomBar+'px)'}">
        <view class="flex-sub text-lg text-white flex justify-center align-end padding-bottom-sm">
          <text><text class="cuIcon-present margin-right-sm"></text> {{orderStatus | filterStatus}}</text>
        </view>
        <view class="flex-sub text-f8 text-sm flex justify-center align-start">
          <text v-if="orderStatus == 0">{{downTime.hours}}小时{{downTime.minutes}}分钟后未支付订单将自动取消</text>
        </view>
      </view>
    </view>
    <view class="box">
      <!-- 地址栏 -->
      <view class="padding-lr-sm margin-bottom-sm" v-if="addrInfo">
        <view class="bg-white radius-20 flex padding">
          <view class="text-theme margin-right-sm">
            <text class="cuIcon-locationfill"></text>
          </view>
          <view class="flex-sub">
            <view class="text-333 text-df text-bold">
              <text>{{addrInfo.receiver_name}}</text>
              <text class="margin-left">{{addrInfo && addrInfo.receiver_mobile | filterMobile}}</text>
            </view>
            <view class="margin-top-xs text-cut-2 text-999 text-sm">地址: {{addrInfo.receiver_address}}</view>
          </view>
        </view>
      </view>
      <!-- 主要订单信息 -->
      <view class="padding-lr-sm margin-bottom-sm">
        <view class="padding bg-white radius-20">
          <block v-for="(item, index) in goodsInfo" :key="index">
            <view>
              <view class="flex padding-tb-sm" @click="navToGoodsDetail(item)">
                <image class="img-150 radius" :src="item.goods_thumb" mode="aspectFill"></image>
                <view class="goods-info margin-left-sm">
                  <view class="text-sm text-2b text-cut">{{ item.goods_name }}</view>
                  <view class="text-sm text-999 margin-bottom text-cut">{{ item.sku_name }}</view>
                  <view class="flex justify-between">
                    <text class="text-lg text-bold text-333">
                      <text class="text-price text-xs"></text>
                      {{item.shop_price}}
                    </text>
                    <text class="text-lg text-333 text-bold">
                      <text class="text-xs margin-right-xs">x</text>
                      {{item.num}}
                    </text>
                  </view>
                </view>
              </view>
              <view class="text-right margin-bottom-sm" v-if="item.refund_info && item.refund_info.status==0" style="color: rgb(247, 173, 50); font-size: 24rpx;">售后中</view>
              <view class="text-right margin-bottom-sm" v-if="item.refund_info && item.refund_info.status==-2" style="color: rgb(247, 173, 50); font-size: 24rpx;">用户取消</view>
              <view class="text-right margin-bottom-sm" v-if="item.refund_info && item.refund_info.status==-1" style="color: rgb(247, 173, 50); font-size: 24rpx;">驳回</view>
              <view class="text-right margin-bottom-sm" v-if="item.refund_info && item.refund_info.status==1" style="color: rgb(247, 173, 50); font-size: 24rpx;">同意</view>
              <view class="text-right margin-bottom-sm" v-if="item.refund_info && item.refund_info.status==2" style="color: rgb(247, 173, 50); font-size: 24rpx;">确认收回</view>
              <view class="text-right margin-bottom-sm" v-if="item.refund_info && item.refund_info.status==3" style="color: rgb(247, 173, 50); font-size: 24rpx;">确认打款</view>
              <view class="flex justify-end">
                <button class="cu-btn round line-theme margin-left-sm sm" v-if="orderStatus >= 1 && orderStatus <= 4 && (!item.refund_info || (item.refund_info && item.refund_info.status == -1) || (item.refund_info && item.refund_info.status == -2))"
                  @tap="afterSaleOrder(item)">申请售后</button>
                <button class="cu-btn round line-theme margin-left-sm sm" v-if="item.refund_info" @tap="toAfterDetail(item.refund_info.id)">查看售后详情</button>
                <button class="cu-btn round line-theme margin-left-sm sm" v-if="item.refund_info" @tap="toCustomer(item)">联系客服</button>
                <button class="cu-btn round line-theme margin-left-sm sm" v-if="orderStatus == 3 && item.is_evaluate == 0" @tap="evaluateOrder(item)">评价</button>
              </view>
            </view>
          </block>
          <view class="solid-top margin-top padding-top-xs">
            <view class="flex justify-between align-center text-sm padding-tb-sm">
              <text class="text-999">商品总额</text>
              <text class="text-333 text-bold">¥ {{order_money}}</text>
            </view>
            <view class="flex justify-between align-center text-sm padding-tb-sm">
              <text class="text-999">优惠券</text>
              <text class="text-333 text-bold">- ¥ {{coupon_money}}</text>
            </view>
            <view class="flex justify-between align-center text-sm padding-tb-sm">
              <text class="text-999">运费</text>
              <text v-if="express_price" class="text-333 text-bold">¥ {{express_price}}</text>
              <text v-else class="text-333 text-bold">免邮</text>
            </view>
            <view class="flex justify-between align-center text-sm padding-tb-sm" v-if="false">
              <text class="text-999">定金</text>
              <text class="text-333 text-bold">¥ {{'25'}}</text>
            </view>
            <view class="flex justify-between align-center text-sm padding-tb-sm" v-if="false">
              <text class="text-999">尾款支付时间</text>
              <text class="text-333 text-bold">{{'2020-05-25'}}</text>
            </view>
            <view class="flex justify-end align-center padding-top-sm">
              <text v-if="orderStatus == 0" class="text-sm text-999 margin-right">需付款:</text>
              <text v-else class="text-sm text-999 margin-right">应付款:</text>
              <!-- <text v-else class="text-sm text-999 margin-right">应付尾款:</text> -->
              <text class="text-333 text-bold">
                <text class="text-price text-sm"></text>
                <text class="text-xl">{{payable_money}}</text>
              </text>
            </view>
          </view>
        </view>
      </view>
      <!-- 次要订单信息 -->
      <view class="padding-lr-sm margin-bottom-sm">
        <view class="padding bg-white radius-20 text-sm text-333">
          <view class="list-item flex align-center" v-if="marks">
            <view class="title">订单备注:</view>
            <view class="text-sm" style="word-break: break-all;">{{marks}}</view>
          </view>
          <view class="list-item flex">
            <view class="title">订单编号:</view>
            <view class="text-sm">{{order_sn}}</view>
          </view>
          <view class="list-item flex">
            <view class="title">下单时间:</view>
            <view class="text-sm">{{createTime}}</view>
          </view>
          <view class="list-item flex" v-if="payType">
            <view class="title">支付金额:</view>
            <view class="text-sm text-price">{{payable_money}}</view>
          </view>
          <view class="list-item flex" v-if="payType">
            <view class="title">支付方式:</view>
            <view class="text-sm">{{payType | filterPay}}</view>
          </view>
          <view class="list-item flex" v-if="payTime && orderStatus != 0 && orderStatus != -1">
            <view class="title">支付时间:</view>
            <view class="text-sm">{{payTime}}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部按钮组 -->
    <view class="goods-actions bg-white padding-lr-sm" v-if="orderStatus <= 4">
      <button class="cu-btn round margin-left-sm" v-if="orderStatus == 4 || orderStatus == 3 || orderStatus == -1 "
        @tap="delOrder">删除订单</button>
      <button class="cu-btn round margin-left-sm" v-if="orderStatus == 0" @tap="cancelOrder">取消订单</button>
      <button class="cu-btn round margin-left-sm" v-if="orderStatus == 0" @tap="toPay">去付款</button>
      <button class="cu-btn round margin-left-sm" v-if="(orderStatus == 1 && !final_order) || (orderStatus == 1 && final_order && final_order.pay_status == 1)"
        @tap="remindOrder">提醒发货</button>
      <button class="cu-btn round margin-left-sm" v-if="orderStatus >= 2 && orderStatus <= 4" @tap="seelogs">查看物流</button>
      <button class="cu-btn round margin-left-sm" v-if="orderStatus == 2" @tap="receiveOrder">确认收货</button>
    </view>
  </view>
</template>

<script>
  const statusObj = {
    '-1': '已取消',
    '0': '等待买家付款中',
    '1': '订单已付款，等待卖家发货',
    '2': '卖家已发货',
    '3': '交易成功',
    '4': '订单已评价',
    '5': '售后处理中',
    '6': '退款成功',
  };
  export default {
    data() {
      return {
        StatusBar: this.StatusBar,
        CustomBar: this.CustomBar,
        order_sn: null, // 订单编号
        order_type: null, // 订单类型
        orderStatus: null, // 订单状态
        createTime: '', // 下单时间
        addrInfo: null, // 下单地址
        goodsInfo: [], // 下单商品
        feightInfo: 0, // 运费
        goodsPrice: 0, // 商品金额
        payType: null, // 支付类型
        payTime: null, // 支付时间
        order_money: 0, //商品总额
        coupon_money: 0, // 优惠金额
        payable_money: 0, // 实付款
        express_price: 0, // 运费
        endtime: '', // 倒计时
        marks: '',
        final_order: null,
        cancelReason: [],
        radio: null,
        timer: null,
        downTime: {
          hours: 0,
          minutes: 0,
        },
        o_status: null,
        status: null,
        is_remind: null,
        ad_img: [],
        openModel: '',
        news_type: '',
      };
    },
    onLoad(option) {
      const {
        order_sn,
        status,
        order_type,
        o_status,
        openModel,
        news_type
      } = option;
      this.order_sn = order_sn;
      this.order_type = order_type;
      this.o_status = o_status;
      this.status = status;
      if (openModel) {
        this.openModel = 'share'
      }
      if (news_type) {
        this.news_type = 'shipped'
      }
      uni.$on('updateOrderDetail', data => {
        this.getData();
      });
    },
    onShow() {
      this.getData();
    },
    methods: {
      // 获取订单详情
      getData() {
        const data = {
          order_sn: this.order_sn,
          order_type: this.order_type,
          is_son: 1,
        }
        this.$api.get(global.apiUrls.getOrderDetail, data)
          .then(res => {
            console.log("订单详情: ", res);
            if (res.data.code == 1) {
              const data = res.data.data;
              this.goodsInfo = data.order_goods_list;
              this.orderStatus = data.status;
              this.order_sn = data.order_sn;
              this.createTime = data.create_time;
              this.payTime = data.pay_time;
              this.payType = data.pay_type;
              this.coupon_money = data.coupon_money;
              this.order_money = data.order_money;
              this.payable_money = data.payable_money;
              this.express_price = data.order_info && data.order_info.express_price;
              this.marks = data.order_info && data.order_info.remark;
              this.is_remind = data.is_remind;
              if (data.cancel_time) {
                this.endtime = data.cancel_time;
                this.initDownTime(data.cancel_time);
              }
              if (data.order_type == 7) {
                this.final_order = data.final_order;
              }
              if (data.order_info && data.order_info.address_id) {
                this.addrInfo = {
                  receiver_mobile: data.order_info.receiver_mobile,
                  receiver_name: data.order_info.receiver_name,
                  receiver_address: `${data.order_info.province} ${data.order_info.city} ${data.order_info.district} ${data.order_info.receiver_address}`,
                }
              }
              uni.stopPullDownRefresh();
            }
          })
          .catch(err => {
            console.log("err: " + JSON.stringify(err));
          })
      },
      toAfterDetail(id) {
        this.$urouter.navigateTo({
          url: '',
          params: {
            id: id
          }
        })
      },
      // 开启倒计时
      initDownTime(time) {
        if (this.timer) {
          clearInterval(this.timer)
        };
        let endTime = time * 1000;
        let nowTime = new Date().getTime();
        let timeleft = endTime - nowTime;
        if (timeleft > 0) {
          let hours = parseInt(timeleft / (1000 * 60 * 60) % 24);
          let minutes = parseInt(timeleft / (1000 * 60) % 60);
          this.downTime.hours = hours;
          this.downTime.minutes = minutes;
        }
        this.timer = setInterval(() => {
          let endTime = time * 1000;
          let nowTime = new Date().getTime();
          let timeleft = endTime - nowTime;
          if (timeleft > 0) {
            let hours = parseInt(timeleft / (1000 * 60 * 60) % 24);
            let minutes = parseInt(timeleft / (1000 * 60) % 60);
            this.downTime.hours = hours;
            this.downTime.minutes = minutes;
          } else {
            clearInterval(this.timer);
            this.getData();
            this.timer = null;
          }
        }, 1000 * 60);
      },
      // 取消订单
      cancelOrder() {
        global.customShowModalPopup({
          title: '提示',
          content: '确定要取消订单吗?',
          success: (res) => {
            if (res.confirm) {
              this.$api.post(global.apiUrls.postCancelOrder, {
                order_sn: this.order_sn,
              }).then(res => {
                console.log("取消订单操作", res);
                if (res.data.code == 1) {
                  this.$message.info('提交成功,正在为您取消订单');
                  setTimeout(() => {
                    this.getData();
                  }, 800);
                }
              })
            }
          }
        })
      },
      // 删除订单
      delOrder() {
        global.customShowModalPopup({
          title: '确认删除此订单?',
          content: '删除后不可恢复',
          success: (res) => {
            if (res.confirm) {
              this.$api.post(global.apiUrls.postDelOrder, {
                  order_sn: this.order_sn
                })
                .then(res => {
                  console.log("res: " + JSON.stringify(res));
                  if (res.data.code == 1) {
                    this.$message.info('删除成功');
                    uni.$emit('refreshOrder');
                    setTimeout(function() {
                      uni.navigateBack();
                    }, 800);
                  }
                })
            }
          }
        })
      },
      // 去支付
      toPay() {
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/pay_order',
          params: {
            order_sn: this.order_sn,
            order_type: this.order_type,
          }
        })
      },
      // 联系客服
      toCustomer(item) {
        let data = {
          order_sn: this.order_sn,
          orderStatus: statusObj[this.orderStatus],
          createTime: this.createTime,
          goods_thumb: item.goods_thumb,
          goods_name: item.goods_name,
          goods_price: item.goods_money,
          goods_id: item.goods_id,
          user_name: this.addrInfo.receiver_name,
          user_phone: this.addrInfo.receiver_mobile,
          user_address: this.addrInfo.receiver_address,
        }
        try {
          uni.setStorageSync('CustomerCacheData', data);
        } catch (err) {
          console.log(err);
        }

        this.$urouter.navigateTo({
          url: '/pages/center/message/customer_list',
          params: {}
        })
      },
      // 提醒发货
      remindOrder(sn) {
        this.$api.post(global.apiUrls.postRemindShipment, {
            order_sn: this.order_sn
          })
          .then(res => {
            if (res.data.code == 1) {
              this.$message.info('已提醒,请耐心等待');
              this.$set(this.is_remind, 'info', 1)
            }
          })
      },
      // 确认收货
      receiveOrder() {
        global.customShowModalPopup({
          title: '提示',
          content: '您是否确认收到货物?',
          success: (res) => {
            if (res.confirm) {
              this.$api.post(global.apiUrls.postConfirmOrder, {
                  order_sn: this.order_sn
                })
                .then(res => {
                  console.log("res: " + JSON.stringify(res));
                  if (res.data.code == 1) {
                    this.getData();
                    uni.$emit('refreshOrder');
                  }
                })
            }
          }
        });
      },
      // 查看物流
      seelogs() {
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/order_logs',
          params: {
            order_sn: this.order_sn
          }
        })
      },
      // 订单评价
      evaluateOrder(item) {
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/order_evaluate',
          params: {
            order_sn: this.order_sn,
            order_type: this.order_type,
            goods_thumb: item.goods_thumb,
            goods_name: item.goods_name,
          }
				})
			},
			// 申请售后
			afterSaleOrder(item) {
				item.order_sn = this.order_sn;
				item.status=this.status;
				this.$urouter.navigateTo({
					url: '/fu-templete/pages/shop-template/afterSale',
          params: {
              order_sn:item.order_sn,
              goods_id:item.goods_id
          }
				})
			},
			// 返回
      back(){
				if(this.openModel == 'share'){
					uni.reLaunch({
						url: '/pages/tabbar/index'
					});
				}else if(this.news_type=='shipped'){
					uni.reLaunch({
						url: '/pages/tabbar/center'
					});
				}else{
					uni.navigateBack({
						delta: 1
					});
				}
			},
			// 去商品详情
			navToGoodsDetail(item){
        this.$urouter.navigateTo({
          url: '/fu-templete/pages/shop-template/goods_detail',
          params: {
            goods_id: item.goods_id,
            sku_id: item.sku_id,
          }
        })
      },
    },
    filters: {
      filterStatus(val) {
        val = val + '';
        if (!val) return '';
        return statusObj[val + ''];
      },
      filterPay(val) {
        const datas = {
          'balance': '余额支付',
          'wxpay': '微信支付',
          'alipay': '支付宝支付',
          'minipay': '小程序支付',
          'minipay_mix': '小程序支付'
        }
        return datas[val];
      },
      filterMobile(val) {
        if (!val) return '';
        return val.substr(0, 3) + '****' + val.substr(-4);
      }
    },
    onUnload() {
      uni.$off('updateOrderDetail');
      if (this.timer) clearInterval(this.timer);
    },
    onPullDownRefresh() {
      this.getData();
    }
  };
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100%;
    background-color: #F8F8F8;
    padding-bottom: 100rpx;
    padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));

    .header {
      height: 330rpx;
      background: linear-gradient(to right, #ff1e4b, #ff4724);
      color: #FFFFFF;

      .bg {
        background: linear-gradient(to right, #ff1e4b, #ff4724);
      }
    }

    .box {
      width: 100%;
      transform: translateY(-45rpx);

      .order-type {
        height: 150rpx;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
      }

      .scroll-box {
        height: calc(100% - 200rpx);
      }
    }
  }

  .box {
    .list-item {
      .title {
        min-width: calc(4em + 15px);
        font-size: 24rpx;
      }
    }

    .list-item+.list-item {
      margin-top: 20rpx;
    }
  }

  .block-140 {
    width: 140rpx;
    min-width: 140rpx;
    height: 140rpx;
    min-height: 140rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .color-999 {
    flex: 0 0 auto;
  }

  .beizhu {
    line-height: 48upx;
    font-size: 28upx;
    margin-left: 30upx;
  }

  .address-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .address-icon {
    width: 120rpx;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .title {
    width: 120rpx;
  }

  .order-info {
    line-height: 88rpx;

    .title {
      width: 180rpx;
    }
  }

  .order-info-bottom {
    display: flex;
    justify-content: flex-end;
  }

  .goods-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;

    &>view {
      width: 100%;
    }
  }

  .block-100 {
    width: 100rpx;
    height: 100rpx;
  }

  .goods-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    height: calc(100rpx + constant(safe-area-inset-bottom));
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .cu-btn {
      color: #333;
      border: 1rpx solid #333;
      font-size: 24rpx;
      background-color: #FFFFFF;
      margin-right: 20rpx;
    }

    .cu-btn:last-child {
      border: none;
      background: linear-gradient(270deg, rgba(255, 71, 24, 1) 0%, rgba(241, 35, 19, 1) 100%);
      color: #FFFFFF;
    }
  }

  .refound-info {
    .info-row {
      height: 88upx;
      line-height: 88upx;
      font-size: 32upx;
      color: #333333;

      .title {
        display: inline-block;
        width: 160upx;
      }
    }
  }

  .reset-btn {
    width: 495upx;
    height: 88upx;
    border-radius: 88upx;
    border: 1upx solid #ff7a40;
    background-color: #ffffff;
    color: #ff7a40;
    font-size: 28upx;
    line-height: 88upx;
  }

  .img-150 {
    width: 150rpx;
    height: 150rpx;
    background-color: #EEEEEE;
  }

  .block {
    padding-bottom: 70rpx;
  }

  .radio-title {
    width: 500rpx;
  }

  .radio-scale {
    transform: scale(0.7);
  }

  .cu-form-group {
    padding: 0;
  }

  .text-f8 {
    color: #FFF8F8;
  }

  .text-2b {
    color: #2b2b2b;
  }

  .block-80 {
    width: 80rpx;
    height: 80rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
</style>

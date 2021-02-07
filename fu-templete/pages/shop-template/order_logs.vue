<template>
  <view class="page">
    <view class="list">
      <view class="list-item">
        <view class="title">物流公司:</view>
        <view class="sub">
          <text>{{express_name || '暂无物流公司信息'}}</text>
        </view>
      </view>
      <view class="list-item">
        <view class="title">快递单号:</view>
        <view class="sub">
          <text>{{express_no || '暂无物流单号信息'}}</text>
          <!-- #ifndef H5 -->
          <text v-if="express_no" class="tag cuIcon-copy" @tap="copy"></text>
          <!-- #endif -->
        </view>
      </view>
    </view>
    <view class="step-box">
      <uni-steps
        :options="logs"
        direction="column"
        :active="1"
      ></uni-steps>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        order_sn: null,
        express_name: '',
        express_no: '',
        logs: [{
            title: '买家下单',
            desc: '2018-11-11'
          },
          {
            title: '卖家发货',
            desc: '2018-11-12'
          },
          {
            title: '买家签收',
            desc: '2018-11-13'
          },
          {
            title: '交易完成',
            desc: '2018-11-14'
          },
        ]
      };
    },
    onLoad(options) {
      const { order_sn } = options;
      this.order_sn = order_sn;
      this.getData();
    },
    methods: {
      getData() {
        this.$api.post(global.apiUrls.postOrderLogs, {
            order_sn: this.order_sn
          })
          .then(res => {
            console.log("物流信息", res.data);
            if (res.data.code == 1) {
              this.express_name = res.data.data.express_company;
              this.express_no = res.data.data.express_no;
            }
          })
      },
      // #ifndef H5
      // 复制快递号
      copy(){
        uni.setClipboardData({
          data: this.express_no,
          success: () => {
            this.$message.info('复制成功');
          }
        });
      },
      // #endif
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
    background-color: #FFFFFF;
    .list{
      padding: 0 32rpx;
      .list-item{
        height: 100rpx;
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid #c8c7cc;
        .title{
          font-size: 28rpx;
          color: #333333;
        }
        .sub{
          flex: 1;
          padding-left: 24rpx;
          color: #666666;
          .tag{
            margin-left: 24rpx;
          }
        }
      }
    }
    .step-box{
      padding: 32rpx;
    }
  }
</style>

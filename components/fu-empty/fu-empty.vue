<template>
  <view>
    <view class="loading-wapper" v-if="!pagingListLoadedAll && !pagingListNoListData">
      <view class="loading-icon"></view>
      <text class="loading-txt">加载中</text>
    </view>
    <view class="loading-wapper" v-if="pagingListLoadedAll && !pagingListNoListData && listDataLength != 0">
      <text class="loading-txt">{{pagingListLoadedAllText}}</text>
    </view>
    <view class="public-page-empty" v-if="(pagingListLoadedAll && pagingListNoListData) || (pagingListLoadedAll && listDataLength == 0)">
      <image :src="emptyImages[emptyImage]['image']" :style="{width: emptyImages[emptyImage]['width'], height: emptyImages[emptyImage]['height']}"></image>
      <view class="txt">{{pagingListNoListDataText}}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "mj-empty",
  props: {
    pagingListLoadedAll: {
      type: Boolean,
      default: false
    },
    pagingListNoListData: {
      type: Boolean,
      default: false
    },
    listDataLength: {
      type: Number,
      default: 0
    },
    pagingListLoadedAllText: {
      type: String,
      default: '已加载全部数据'
    },
    pagingListNoListDataText: {
      type: String,
      default: '暂无数据'
    },
    emptyImage: {
      type: String,
      default: 'order'
    }
  },
  data() {
    return {
      emptyImages: {
        collection: {  // 收藏
          image: '/static/empty/empty10.png',
          width: '326rpx',
          height: '333rpx'
        },
        order: {  // 订单
          image: '/static/empty/empty11.png',
          width: '400rpx',
          height: '294rpx'
        },
        message: {  // 消息
          iamge: '/static/empty/empty12.png',
          width: '750rpx',
          height: '527rpx'
        },
        coupons: {  // 优惠券
          iamge: '/static/empty/empty13.png',
          width: '438rpx',
          height: '356rpx'
        },
      }
    }
  },
  methods: {

  }
}

</script>

<style scoped lang="scss">
.loading-wapper {
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20upx;

  &.mj {
    display: flex;
  }

  text {
    font-size: 24upx;
    color: #999999;
  }
}

.loading-icon {
  margin: 0 10upx;
  width: 40upx;
  height: 40upx;
  display: inline-block;
  vertical-align: middle;
  -webkit-animation: a 1s steps(12) infinite;
  animation: a 1s steps(12) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
}

.loading-txt {
  font-size: 24upx;
  font-weight: normal;
  line-height: 40upx;
  color: #999999;
}

@-webkit-keyframes a {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

@keyframes a {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn)
  }
}

.public-page-empty {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 120upx 0 0 0;

  .txt {
    font-size: 28upx;
    color: $uni-text-color;
    text-align: center;
    line-height: 100upx;
    color: #999;
  }
  .loadTips{
    line-height: 30upx;
  }

  .btn {
    width: 260upx;
    height: 78upx;
    line-height: 78upx;
    background: linear-gradient(309deg, rgba(254, 49, 0, 1) 0%, rgba(255, 90, 16, 1) 100%);
    opacity: 1;
    border-radius: 44upx;
    font-size: 28upx;
    color: #fff;
    text-align: center;
    margin-top: 100upx;
  }
}
</style>

<template>
  <view>
    <fu-popup ref="popup" mode="bottom" @change="handleChange">
      <view class="container">
        <view class="container-top" v-if="detail">
          <view class="header">
            <view class="lside">分享至</view>
            <view class="rside"><text>分享转发，奖励红花</text> <image src="/static/global_pop/more009.png"></image></view>
          </view>
          <view class="cate-wrapper">
            <view class="item">
              <image src="/static/global_pop/more001.png"></image>
              <view class="txt">微信好友</view>
            </view>
            <view class="item">
              <image src="/static/global_pop/more002.png"></image>
              <view class="txt">朋友圈</view>
            </view>
            <view class="item">
              <image src="/static/global_pop/more003.png"></image>
              <view class="txt">QQ好友</view>
            </view>
            <view class="item">
              <image src="/static/global_pop/more004.png"></image>
              <view class="txt">新浪微博</view>
            </view>
            <view class="item">
              <image src="/static/global_pop/more005.png"></image>
              <view class="txt">复制链接</view>
            </view>
          </view>
          <view class="cate-wrapper">
            <view class="item" @click="handleJump" :data-url="'/pages/contents/report/index?id=' + options.id">
              <image src="/static/global_pop/more006.png"></image>
              <view class="txt">投诉</view>
            </view>
            <view class="item">
              <image src="/static/global_pop/more007.png"></image>
              <view class="txt">{{detail.is_concern == 1 ? '已关注' : '关注'}}</view>
            </view>
            <view class="item">
              <image src="/static/global_pop/more008.png"></image>
              <view class="txt">收藏</view>
            </view>
          </view>
        </view>
        <view class="container-bottom">
          <view class="btn" @click="handleChoose">取消</view>
        </view>
      </view>
    </fu-popup>
  </view>
</template>

<script>
// import LANGUAGE_DATA from '@/common/language/language.js'
// import uniPopup from '../base/uni-popup/uni-popup.vue';
export default {
  name: 'custom-pop-pay',
  components: {
    // uniPopup
  },
  data() {
    return {
      // LANGUAGE_DATA,
      options: null,
      detail: null,

    }
  },
  methods: {
    show(options) {
      this.options = options
      // this.$api.get(global.apiUrls.getWorkWorkDetail, { id: options.id }).then(res => {
      //   if(res.data.code == 1){
      //     this.detail = res.data.data
      //   }
      // })
      this.$refs.popup.open()
    },

    handleChoose() {
      this.$refs.popup.close()
    },

    handleChange(e) {
      this.$emit('handleChange', e)
    }
  }
};

</script>

<style lang="scss">
.container {
  width: 100%;
  height: 613upx;
  background-color: #fff;
  // border-radius: 24upx 24upx 0 0;

  .container-top {
    padding: 0 32upx;

    .header {
      display:flex;
      justify-content: space-between;
      width: 100%;
      height: 105upx;
      align-items: center;

      .lside {
        font-size: 32upx;
      }

      .rside {
        font-size: 24upx;
        display: flex;
        align-items: center;

        text {
          line-height: 1;
          padding-right: 10upx;
        }
      }

      image {
        width: 30upx;
        height: 30upx;
      }
    }

    .cate-wrapper {
      height: 194upx;
      display: flex;
      align-items: center;
      position: relative;

      &:after {
        @include bottom-line(#eee);
      }

      .item {
        width: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        image {
          width: 80upx;
          height: 80upx;
        }

        .txt {
          font-size: 26upx;
          color: #666666;
          padding: 24upx 0 0;
          line-height: 1;
        }
      }
    }

    .reason-scroll-view {
      height: 300upx;
      width: 100%;
    }

    .reason-wrapper {
      position: relative;

      &:after {
        @include top-line(#F2F2F2);
      }

      .reason-title {
        font-size: 28upx;
        color: #333;
        padding: 40upx 0 30upx;
      }

      .reason {
        display: flex;
        flex-wrap: wrap;

        .item {
          padding: 0 24upx;
          height: 60upx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26upx;
          color: #333;
          border-radius: 30upx;
          border: 1upx solid #EFEFEF;
          margin: 0 32upx 32upx 0;
        }
      }
    }
  }

  .container-bottom {
    height: 120upx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32upx;
    color: #333333;

    &:active {
      background-color: $fu-bg-color;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 120upx;
    }
  }
}
</style>

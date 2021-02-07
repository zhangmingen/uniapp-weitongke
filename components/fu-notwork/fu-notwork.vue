<template>
  <view class="fu-notwork" v-if="!isConnected">
    <view class="fu-count-df" v-if="mode == 'full'" :style="{ zIndex: zIndex }">
      <image class="icon" :src="image" mode="aspectFit"></image>
      <view class="tips"> {{tips}} </view>
      <view class="text-gray text-sm margin-bottom-sm">
        请检查网络，或者前往<text class="text-blue">设置</text>
      </view>
      <view @click="getNetworkStattus">点击刷新</view>
    </view>

    <view class="fu-count-tips" v-if="mode == 'tips'">
      <text></text><text>{{tips}}</text>
    </view>
  </view>
</template>

<script>
/**
 * fu-notwork 无网络提示
 * @description 该组件无需任何配置，引入即可，内部自动处理所有功能和事件。
 * @property {String} mode full 全屏模式 | tips 占位模式 | toast 提示框模式 | modal 弹框模式
 * @property {String} tips 没有网络时的提示语（默认哎呀，网络信号丢失）
 * @property {String Number} zIndex 组件的z-index值（默认1080）
 * @property {String} image 无网络的图片提示，可用的src地址或base64图片
 * @event {Function} retry 用户点击页面的"重试"按钮时触发
 * @example <fu-notwork></fu-notwork>
 */
export default {
  name: 'fu-notwork',
  props: {

    // 组件模式 默认全屏模式 、tips 占位模式 、toast 提示框模式
    mode: {
      type: String,
      default () {
        return 'full'
      }
    },

    tips: {
      type: String,
      default () {
        return '哎呀，网络信号丢失'
      }
    },

    zIndex: {
      type: [String, Number],
      default () {
        return 100
      }
    },

    image: {
      type: String,
      default () {
        return 'data:image/png;base64,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'
      }
    }
  },
  data() {
    return {
      isConnected: true
    }
  },
  created() {
    // 监听网络状态的变化
    uni.onNetworkStatusChange((res) => {
      console.log(res)
      this.isConnected = res.isConnected;
      if (this.isConnected) {
        this.$emit('retry', { msg: '网络链接成功', networkType: res.networkType });
      } else {
        if (this.mode == 'toast') {
          this.$message.info(this.tips)
        }
      }
    })

    this.getNetworkStattus();
  },
  methods: {

    // 功能：获取当前网络状态
    getNetworkStattus() {
      uni.getNetworkType({
        success: (res) => {
          // console.log(res.networkType);
          if (res.networkType == 'none') {
            this.isConnected = false;

            switch (this.mode) {
              case 'modal':
                global.customShowModalPopup({
                  title: '提示',
                  content: this.tips,
                  success: (res) => {
                    if (res.confirm) {

                    }
                  }
                })
                break;
              case 'toast':
                this.$message.info(this.tips)
                break;
              default:
                this.$message.info({
                  content: '无网络链接',
                  position: 'top'
                })
                break;
            }

          } else {
            this.isConnected = true;
            this.$emit('retry', { msg: '网络链接成功', networkType: res.networkType })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.#{$fu-prefix} {
  &-notwork {
    color: #666;

    .#{$fu-prefix}-count-df {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: white;
      text-align: center;
      padding-top: 380rpx;

      .icon {
        width: 200rpx;
        height: 200rpx;
        margin-bottom: 20rpx;
      }

      .tips {
        margin-bottom: 20rpx;
      }
    }

    .#{$fu-prefix}-count-tips {
      font-size: 24rpx;
      line-height: 80rpx;
      background-color: #FFDFDF;
      color: #666;
      text-align: center;
    }
  }
}
</style>

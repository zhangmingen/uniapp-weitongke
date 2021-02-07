<template>
	<view>
		<view class="feedback-list">
      <view class="feedback-list-item" v-for="(item, index) in list" :key="index">
        <view class="feedback-list-item-row">
          <view class="left-box">
            <view class="left-icon">问</view>
          </view>
          <view class="right-box">
            <view class="title text-cut">{{item.body}}</view>
            <view class="sub-title">
              <text class="fu-mr20">反馈类型: {{item.type}} </text>
              <text style="display: block;">反馈时间: {{item.create_time | formatDate('YYYY-MM-DD')}}</text>
            </view>
            <view class="img-list solid-bottom" v-if="item.thumb.length">
              <block v-for="(imgItem, imgIndex) in item.thumb" :key="imgIndex">
                <image class="img-list-item" @tap="ViewImage(item.thumb, imgIndex)" :src="imgItem" mode="widthFix"></image>
              </block>
            </view>
          </view>
        </view>
        <view class="feedback-list-item-row" v-if="item.replay">
          <view class="left-box">
            <view class="left-icon">答</view>
          </view>
          <view class="right-box">
            <view class="reply-title">{{item.replay}}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-if="isInitEnd && !len" class="text-xl text-center text-gray flex flex-direction align-center justify-center" style="height: 50vh;">
      <image src="/static/empty/empty07.png"></image>
    	<text class="margin-top">暂无反馈内容~</text>
    </view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
        isInitEnd: false,   //  是否初始化请求结束
				list: [],
			}
		},
    computed:{
      len(){
        return this.list.length;
      }
    },
		onLoad() {
			this.get_list()
		},
		methods: {
			get_list() {
				this.$api.get(global.apiUrls.myFeedback).then(res => {
          this.isInitEnd = true;
					if (res.data.code == 1) {
						this.list = res.data.data
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				});
			},

      // 预览图片
      ViewImage(list, index) {
        uni.previewImage({
          urls: list,
          current: index
        });
      },
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF !important;
	}

  .feedback-list{
    padding: 0 32rpx;
  }

  .feedback-list-item{
    margin-top: 50rpx;
    margin-bottom: 80rpx;
    .feedback-list-item-row{
      display: flex;

      .left-box{
        flex-shrink: 0;
        margin-right: 30rpx;

        .left-icon{
          width: 80rpx;
          height: 80rpx;
          border-radius: 80rpx;
          background-color: #ffff7f;
          text-align: center;
          line-height: 80rpx;
          font-size: 48rpx;
          color: #FFFFFF;
        }
      }

      .right-box{
        flex: 1;
        .title{
          width: 550rpx;
          height: 60rpx;
          line-height: 60rpx;
          font-size: 34rpx;
          // font-weight: 600;
        }

        .sub-title{
          color: #bfbfbf;
        }

        .reply-title{
          padding-top: 20rpx;
          font-size: 36rpx;
        }

        .img-list{
          position: relative;
          margin: 20rpx 0 10rpx;
          padding-bottom: 10rpx;
          display: flex;


          // @include bottom-line(#333333);

          .img-list-item{
            margin: 20rpx;
            display: inline-block;
            width: 100rpx;
            height: 100rpx;
            border-radius: 20rpx;

            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
  }

	/* .card {
		min-height: 120rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.1);
	}
	.emptybox{
		margin-top:300rpx;
	} */
</style>

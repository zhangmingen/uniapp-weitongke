<template>
  <view class="change">
    <form @submit="formSubmit">
      <view class="warp">
        <!-- 反馈类型 -->
        <view class="feedback">
          <view class="feedback_top padding">反馈类型</view>
          <view class="feedback_reason">
            <view class="margin-top-xs text-cut" v-for="(item, index) in types" :key="index" :class="item.id == active ? 'active' : ''" @click="reason(item.id)">{{ item.title }}</view>
          </view>
        </view>

        <!-- 反馈内容 -->
        <view class="feedback_content">
          <view class="feedback_content_top padding">反馈内容（ {{bodyLen}}/200 ）</view>
          <view class="content ">
            <textarea name="body" v-model="body" maxlength="200" placeholder="问题描述的越详细.有助于我们更快的解决问题" placeholder-style="font-size:28rpx" class="padding text-black" />
          </view>
        </view>

        <!-- 图片 -->
        <view class="cu-form-group" v-if="thumb_status === '1'">
          <view class="grid col-4 grid-square flex-sub">
            <view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage(index)" :data-url="index">
              <image :src="item.path" mode="aspectFill"></image>
              <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index"><text class="cuIcon-close"></text></view>
            </view>
            <view class="solids" @tap="ChooseImage" v-if="imgList.length < 3"><text class="cuIcon-cameraadd"></text></view>
          </view>
        </view>
      </view>

      <!-- 联系方式 - 手机号码 -->
      <view class="feedback_contact margin-top" v-if="contact_status === '1'">
        <view class="feedback_contact_top">请留下您的联系方式</view>
        <view class="feedback_contact_content flex"><input type="number" name="contact" v-model="contact" maxlength="11" placeholder="请输入您的手机号码" /></view>
      </view>

      <!-- 联系方式 - qq -->
      <view class="feedback_contact margin-top" v-if="qq_status === '1'">
        <view class="feedback_contact_top">请留下您的联系方式</view>
        <view class="feedback_contact_content flex"><input type="number" name="qq_contact" v-model="qq_contact" maxlength="11" placeholder="请输入您的QQ号码" /></view>
      </view>

      <!-- 联系方式 - 邮箱 -->
      <view class="feedback_contact margin-top" v-if="email_status === '1'">
        <view class="feedback_contact_top">请留下您的联系方式</view>
        <view class="feedback_contact_content flex"><input type="text" name="email_contact" maxlength="50" v-model="email_contact" placeholder="请输入您的邮箱" /></view>
      </view>


      <view class="bg-white footer-yy">
        <!-- <button class="btn-primary round" formType="submit" type="primary">提交</button> -->
        <fu-button class="button" formType="submit" ripple shape="circle" throttle-time="300" type="primary">提交</fu-button>
      </view>
    </form>
  </view>
</template>

<script>
import { validate } from '@/common/utils/index';
// import { UploadImg } from '@/common/utils/upload-image.js'
import { UploadImage } from '@/common/utils/index';
import { UPLOAD_IMAGE_URL } from '@/common/config.js';
var _self;
export default {
  data() {
    return {
      // 反馈类型
      types: [],
      active: 1,

      imgList: [],
      imgpath: [],
      count: 3,
      images: [],
      body: '',
      contact: '', // 手机号码
      qq_contact: '', // QQ
      email_contact: '', // 邮箱

      // 显示状态类型判断
      thumb_status: '1', // 是否显示图片上传
      contact_status: '1', // 是否显示手机号码
      email_status: '1', // 是否显示邮箱
      qq_status: '1' // 是否显示QQ号码
    };
  },
  computed:{
    bodyLen(){
      return this.body.length;
    }
  },
  onLoad() {
    _self = this;
    this.get_feedback_type();
  },
  onNavigationBarButtonTap() {
    this.$urouter.navigateTo('/fu-templete/pages/user-templete/feedback/myFeedback');
  },
  methods: {
    reason(type) {
      this.active = type;
    },
    get_feedback_type() {
      let that = this;
      this.$api
        .post(global.apiUrls.feedbackTypes)
        .then(res => {
          let result = res.data.data;
          that.types = result.types;
          that.thumb_status = result.thumb_status; // 是否显示图片上传
          that.contact_status = result.contact_status; // 是否显示手机号码
          that.email_status = result.email_status; // 是否显示邮箱
          that.qq_status = result.qq_status; // 是否显示QQ号码
        })
        .catch(err => {
          console.log(err);
        });
    },
    ChooseImage() {
      let self = this;
      // 从相册中选择图片
      uni.chooseImage({
        count: this.count - this.imgList.length, // 默认3
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;

          // 开始上传
          new UploadImage(tempFilePaths, {
            complete: function(res) {
              // 上传成功 返回数据格式为数组 [ { id: '', path: '' } ]
              self.imgList.push(...res);
            }
          });
        }
      });
    },
    ViewImage(inx) {
      let arr = this.imgList.map(item => {
        return item.path;
      });
      uni.previewImage({
        urls: arr,
        current: inx
      });
    },
    DelImg(e) {
      uni.showModal({
        title: '友情提示',
        content: '确定要删除图片吗？',
        cancelText: '取消',
        confirmText: '确定',
        success: res => {
          if (res.confirm) {
            this.imgList.splice(e.currentTarget.dataset.index, 1);
          }
        }
      });
    },
    formSubmit: function(e) {
      let _this = this;

      //进行表单检查
      var formData = e.detail.value;

      formData.type = this.active;

      // 对图片进行处理操作
      let imgarr = this.imgList.map(item => {
        return item.id;
      });
      formData.thumb = imgarr.join(',');

      // 对表单数据进行校验，
      let errMsg = this.doValidate(formData);
      if (errMsg) {
        this.$message.info(errMsg);
        return;
      }

      // if (!formData.body) {
      //   uni.showToast({ title: '反馈内容不能为空', icon: 'none' });
      //   return false;
      // }
      // let imgarr = this.imgList.map(item => {
      //   return item.id;
      // });
      // formData.thumb = imgarr.join(',');

      // formData.type = this.active;
      // if (formData.contact && !validate(formData.contact, 'phone')) return this.$message.info('请正确输入手机号');
      this.$api.post(global.apiUrls.feedbackAdd, formData).then(res => {
        // console.log(res);
        // uni.showToast({
        //   title: ,
        //   icon: 'none'
        // });
        this.$message.info(res.data.msg);
        console.log(res);
        if (res.data.code == 1) {
          setTimeout(() => {
            // uni.navigateBack();
            _this.$urouter.redirectTo('/fu-templete/pages/user-templete/feedback/myFeedback');
          }, 1200);
        }
      });
    },

    // 进行表单校验
    doValidate(formData) {
      console.log(formData);
      let { body, contact, qq_contact, email_contact} = formData;
      if (!body || !body.trim()) {
        return '反馈内容不能为空';
      }
      if(contact){
        if(!validate(contact, 'phone')){
          return '请检查您的手机号码格式';
        }
      }
      if(qq_contact){
        if(!validate(qq_contact, 'isqq')){
          return '请检查您的QQ号码格式';
        }
      }
      if(email_contact){
        if(!validate(email_contact, 'email')){
          return '请检查您的邮箱格式';
        }
      }
      return '';
    }
  }
};
</script>

<style lang="scss">
page {
  height: calc(100%);
  font-size: 28upx;
  color: #333;
  background: #f6f6f6;
  .change {
    .warp {
      width: 100%;
      background: #fff;
      border-bottom: 20upx solid #fff;
      .feedback {
        padding: 0 25upx;
        .feedback_top {
          margin-bottom: 24upx;
          height: 30upx;
          line-height: 30upx;

          color: $uni-text-color;
          font-size: $uni-font-size-lg;
          font-weight: bold;
        }
        .feedback_reason {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          .margin-top-xs {
            width: 29.33%;
            // height: 70upx;
            // line-height: 70upx;
            padding: 18rpx 20rpx;
            text-align: center;
            font-size: 26upx;
            border-radius: 30upx;
            color: #333333;
            background-color: #eeeeee;

            &.active {
              color: $uni-text-color-inverse;
              background-color: $fu-bg-color;
              // background-color: red;
            }
          }
        }
      }
      .feedback_content {
        padding: 0 25upx;
        .feedback_content_top {
          margin-top: 20rpx;
          margin-bottom: 16upx;
          height: 30upx;
          line-height: 30upx;
          color: $uni-text-color;
          font-size: $uni-font-size-lg;
          font-weight: bold;
        }
        .content {
          textarea {
            width: 100%;
            font-size: 32upx;
            color: #333333;
          }
        }
        image {
          width: 164upx;
          height: 164upx;
          margin-bottom: 18upx;
        }
      }
    }
    .feedback_contact {
      padding: 0 25upx;
      background: #fff;
      .feedback_contact_top {
        height: 80upx;
        line-height: 80upx;
        color: $uni-text-color;
        font-size: $uni-font-size-lg;
        font-weight: bold;
      }
      .feedback_contact_content {
        input {
          height: 80upx;
          width: 100%;
          // width: auto;
          display: flex;
          flex-wrap: wrap;
          flex-direction: row;
          align-items: center;
          border-bottom: 2upx solid #eee;
        }
      }
    }
    .sub {
      margin-top: 30%;
      line-height: 88upx;
      background-color: rgb(0, 129, 255);
      color: #fff;
      text-align: center;
      border-radius: 45px;
      margin-left: 25upx;
      margin-right: 25upx;
    }
  }
}
.footer-yy {
  padding-top: 136upx;
  padding-bottom: 100upx;
  button {
    width: 95%;
    background-color: #4db34a;
  }
}
</style>

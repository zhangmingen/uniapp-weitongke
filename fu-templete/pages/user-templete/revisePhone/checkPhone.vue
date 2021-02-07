<template>
  <view class="">
    <view class="per">
      <view class="padding fu-flex fu-flex-center">
        <text class="">当前手机号：{{ mobileX || '' }}</text>
      </view>
      <view class="cu-list menu" v-show="change==0">
        <view class="cu-item" :class="menuArrow?'arrow':''">
          <view class="content flex">
            <input type="number" value="" v-model="code" placeholder="请输入验证码" placeholder-style="color:#999;" />
            <view class="get-code" @click="getCode()">{{getCodeText}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="btn_cloce" style="padding:30rpx;" >
      <view class="types" @click="submit">下一步</view>
    </view>
  </view>
</template>

<script>
  import { validate } from '@/common/utils/index.js'
  export default {
    data() {
      return {
        islogin: 0,
        menuArrow: false,
        getCodeBtnColor: "#259B3B",
        jiupassword: '',
        xinpassword: '',
        new_mobile: '',
        mobile: "",
        mobileX:'',
        code: '',
        codeNew:'',
        getCodeText: '获取验证码',
        getCodeisWaiting: false,
        code_id: 0,
        change:0
      };
    },
    onLoad() {
      this.getMobile()
      var user = uni.getStorageSync('USERINFO');
      if (user.id > 0) {
        this.islogin = 1
      }
    },
    onBackPress() {
      uni.hideKeyboard()
    },
    methods: {
      getMobile(){  //获取手机号
        this.$api.post(global.apiUrls.postUserGet_user_phone, {
        }).then(res => {
          var mobile = res.data.data.substr(0,3)+"****"+res.data.data.substr(7);
          this.mobile = res.data.data
          this.mobileX = mobile
        })
      },
      getCode() {
        uni.hideKeyboard()

        if (this.getCodeisWaiting) {
          return;
        }
        if (!validate(this.mobile ,'phone')) {
          this.$message.info(!this.mobile ? '请输入手机号' : '请填写正确手机号码')
          return false;
        }
        this.getCodeText = "发送中..."
        this.getCodeisWaiting = true;
        this.getCodeBtnColor = "#BFBFBF"
        let user_id = uni.getStorageSync('USER_INFO').id
        this.$api.post(global.apiUrls.GetVerifyCode, {
          is_test: global.IS_DEV,
          mobile: this.mobile,
          type: '4',
          user_id: user_id,
        }).then(res => {
          var res = res.data
          console.log(res)
          // this.$message.info(res.msg)
          if (res.code == 1) {
            this.code_id = 1;
            this.$message.info('验证码为' + res.data.code + '请注意查收')
            this.setTimer();
          } else {
            this.getCodeText = '获取验证码';
            this.getCodeBtnColor = "#259B3B";
            this.getCodeisWaiting = false;
          }
        })
      },
      setTimer() {
        let holdTime = 60;
        this.getCodeText = "重新获取(60)"
        this.Timer = setInterval(() => {
          if (holdTime <= 0) {
            this.getCodeisWaiting = false;
            this.getCodeBtnColor = "#F74D58";
            this.getCodeText = "获取验证码"
            clearInterval(this.Timer);
            return;
          }
          this.getCodeText = "重新获取(" + holdTime + ")"
          holdTime--;

        }, 1000)
      },
      submit() {
        var type = this.change
        if (!this.mobile) {
          this.$message.info('请输入手机号');
          return false;
        }
        if (!validate(this.mobile ,'phone')) {
          this.$message.info(!this.mobile ? '请正确输入手机号' : '请填写正确手机号码')
          return false;
        }
        if (!this.code_id) {
          this.$message.info('请先获取验证码')
          return false;
        }
        if (!this.code) {
          this.$message.info('请输入验证码')
          return false;
        }

       let data = {mobile:this.mobile,code:this.code,type:4,is_test:global.IS_DEV}
       this.$api.post(global.apiUrls.PostUserCheckVerifyCode, data)
          .then(res => {
            var res = res.data
            this.$message.info(res.msg)
            if (res.code == 1) {
              this.$urouter.navigateTo({
                url: '/fu-templete/pages/user-templete/revisePhone/revisePhone',
                params: {}
              })
            }
          });
      }
    }
  };
</script>

<style lang="scss">
  .get-code {
    position: absolute;
    height: 90upx;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    color: $fu-main-color;
    // border-left: solid 1upx #fff;
    z-index: 3;

    &:after {
      content: " ";
      width: 1upx;
      height: 50upx;
      background-color: #fff;
      position: absolute;
      z-index: 3;
      left: 0;
      top: 20upx;
    }
  }

  .types {
    width: 686upx;
    height: 88upx;
    color: #FFFFFF;
    line-height: 88upx;
    background: $fu-main-color;
    opacity: 1;
    border-radius: 40px;
    margin: 0 auto;
  }

  .per {
    padding: 0 20upx;
    font-size: 28upx;
    background-color: #fff;

    .per_row {
      padding: 30upx 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ededed;

      .row_right {
        text-align: right;

        .aa {
          color: #999999;
          display: inline-block;
          margin-right: 10upx;
        }
      }
    }
  }

  .out_login {
    margin-top: 30%;
    line-height: 88upx;
    background-color: rgb(0, 129, 255);
    color: #fff;
    text-align: center;
    border-radius: 45px;
    margin-left: 25upx;
    margin-right: 25upx;
  }

  .btn_cloce {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
  }
</style>

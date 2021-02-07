<template>
	<view class="grace-body">
		<form @submit="formSubmit" class="grace-form grace-margin-top">

      <!-- 顶部头像模块 -->
      <view class="head_list cu-list menu">
				<view class="cu-item arrow">
				    <view class="content" style="display: flex;justify-content: space-between;align-items: center;">
				      <text class="text-grey">头像</text>
              <view class="demo-face grace-relative grace-img-in">
                <image :src="head_img || thumb" mode="widthFix" @tap="chooseImage"></image>
              </view>
				    </view>
				</view>
			</view>

			<view class="cu-list menu">

        <!-- 昵称 -->
				<view class="cu-item arrow">
				    <view class="content" style="display: flex;justify-content: space-between;">
				        <text class="text-grey">昵称</text>
                <input type="text" class="input" name="user_nickname" maxlength="10" v-model="user_nickname" placeholder="请输入昵称" style="text-align: right;"></input>
				    </view>
				</view>

        <!-- 性别 -->
				<view class="cu-item arrow">
				    <view class="content" style="display: flex;justify-content: space-between;">
				        <text class="text-grey">性别</text>
						<picker @change="bindPickerChange" :value="sexIndex" :range="sex" name="sex">
							<text>{{sex[sexIndex]}}</text>
						</picker>
				    </view>
				</view>

        <!-- 生日 -->
			  <view class="cu-item arrow">
            <view class="content" style="display: flex;justify-content: space-between;">
			          <text class="text-grey">生日</text>
                <picker @change="bindDateChange" :value="dateValue" mode="date" name="birthday">
                    <text>{{dateValue}}</text>
                </picker>
			      </view>
			  </view>

        <!-- 手机号 -->
				<navigator url="bind_mobile" class="cu-item arrow">
				    <view class="content" style="display: flex;justify-content: space-between;">
				        <text class="text-grey">手机号</text>
						<text class="">{{mobile}}</text>
				    </view>
				</navigator>

        <!-- 所在地 -->
				<view class="cu-item arrow">
				    <view class="content" style="display: flex;justify-content: space-between;">
				        <text class="text-grey address">所在地</text>
						<view class="other text-cut" @tap="toggleTab()">
						    {{name}}
						</view>
				    </view>
				</view>

        <!-- 保存按钮 -->
        <view style="padding:30rpx;">
          <button class="btn-primary bg-theme round" :loading="isLoading" formType="submit" type="primary">保存</button>
        </view>

      </view>
		</form>


    <w-picker
      mode="region"
      :defaultVal="defaultVal"
      @confirm="onConfirm"
      ref="region"
      themeColor="#f00"
    ></w-picker>
	</view>
</template>
<script>
import wPicker from "@/components/w-picker/w-picker.vue";
import { UploadImage } from '@/common/utils/index';
// const Checker = require("@/common/js/formValidation.js")
let timer = null;
export default {
    components: {
      wPicker
    },
    data() {
        return {
          isLoading: false,  // 是否加载中
            userInfo:{},
            head_img: '',   // 用户头像
            user_nickname: '',  // 用户昵称
            sexIndex : 0,
            sex : ['请选择性别', '男', '女'],
            dateValue : "请选择生日",
            mobile: '',  // 手机号码
            name:"点击选择",
            mode:"region",
            defaultVal: [1,0,0],  // 城市编码
            city1: [],  // 对应的省市区
            thumb:global.SYSTEM_CONFIG.logo
        }
    },
    onLoad(option){
      let userInfo = Object.assign({}, global.userInfo);
      this.userInfo = userInfo;
      this.head_img = userInfo.head_img ? userInfo.head_img : '';
      this.user_nickname = userInfo.user_nickname;
      this.sexIndex = userInfo.sex ? userInfo.sex : 0;
      this.dateValue = userInfo.birthday ? userInfo.birthday : '请选择生日';
      this.mobile = userInfo.mobile;
      this.name = userInfo.address ? userInfo.address : '点击选择';
      this.defaultVal = userInfo.address ? userInfo.address_code : [1,0,0];

      // 监听上传头像
      uni.$on('uAvatarCropper', path => {
        this.uploadUserImg(path);
      })
    },
    onUnload() {
      uni.$off("uAvatarCropper");
    },
    methods:{
        toggleTab(){
        	this.$refs[this.mode].show();
        },

        // 性别选择
        bindPickerChange:function(e){
            this.sexIndex = e.detail.value;
        },

        // 生日选择
        bindDateChange : function(e){
            this.dateValue = e.detail.value;
        },

        // 所在地选择
        onConfirm(result){
          let { province, city, area } = result.obj;
          let text = [province.label, city.label, area.label];
          let code = [province.value, city.value, area.value];
          this.name = text.join("-");
          this.city1 = text;
          this.defaultVal = code;
        },

        chooseImage() {
        	uni.chooseImage({
        		count: 1, // 默认9
        		sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        		sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        		success: res => {
              // 抽离出uview-ui中的头像裁剪插件来使用
              uni.navigateTo({
                url: '/fu-templete/pages/mine-template/u-avatar-cropper/u-avatar-cropper?destWidth=150&rectWidth=250&fileType="jpg"&myImgUrl='+ res.tempFilePaths[0],
                animationDuration: 0
              })
        		}
        	});
        },

        // 表单提交
        formSubmit : function(e){
            if(this.isLoading) return ;
            if(timer) {
              clearTimeout(timer);
            }
            timer = setTimeout(() => {
              var formData = e.detail.value;

              // 添加头像
              formData.head_img = this.head_img;

              // 处理生日字段
              formData.birthday = formData.birthday.indexOf('选择') != -1 ? '' : formData.birthday;

              // 所在地
              formData.address = this.name.indexOf("选择") != -1 ? '' : this.name;
              formData.address_code = this.defaultVal;

              // 添加用户ID
              formData.user_id = this.userInfo.id ? this.userInfo.id : '';

              // 进行表单验证操作
              let validateRes = this.doValidate(formData);
              if(validateRes){
                this.$message.info(validateRes);
                return ;
              }

              this.isLoading = true;
              this.$api.post(global.apiUrls.editUserinfo, formData).then(res => {
                setTimeout(()=>{
                   this.isLoading = false;
                }, 500)
                if(res.data.code == 1){
                  // 更新本地缓存
                  uni.setStorageSync('USER_INFO',res.data.data.userinfo);

                  // 更新global
                  global.userInfo = res.data.data.userinfo;
                  this.$message.info('修改成功');
                  setTimeout(() => {
                     uni.navigateBack();
                  }, 500);
                }
              })
            }, 300);
        },

        // 进行表单字段值校验
        doValidate(formData){
          // 昵称
          if(!formData.user_nickname){
            return '请输入您的用户昵称';
          }

          if(formData.user_nickname.length > 10){
            return '请检查您的昵称(最多10个字符)'
          }

          // 性别
          if(formData.sex == 0){
            return '请选择您的性别'
          }

          // 生日
          if(!formData.birthday){
            return '请选择您的生日';
          }

          return '';
        },

        // 上传用户头像
        uploadUserImg(blob){
         uni.showLoading()
          let _this = this;
          // 开始上传
          new UploadImage([blob], {
            complete: function(res) {
              uni.hideLoading();
              if(res.length){
                _this.head_img = res[0].path;
              }
            }
          });
        }
    },
}
</script>
<style lang="scss">
.demo text{margin:10upx;}
.demo-face{width:100rpx; height:100rpx;}
.demo-face image{width:100rpx; height:100rpx; border-radius:60rpx;}
.picker{background:#00B26A; width:100%; line-height:40px;}

.head_list{
	background: #fff;
	padding: 20rpx 0;
}
.other{
  width: 500rpx;
  text-align: right;
}
.address{
  display: inline-block;
  width: 110rpx;
}
</style>

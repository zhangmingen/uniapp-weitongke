<template>
	<view class="warp">
		<!-- 顶部 -->
		<view class="cu-bar" :style="[{height: CustomBar+'px',paddingTop: StatusBar+'px'}]">
			<view class="action fu-iconfont" @tap="BackPage">&#xe7be;</view>
		</view>
		<!-- //背景图 -->
		<image src="@/fu-templete/static/login/login-bg.png" mode="" class="bg_img"></image>
		<view class="login-title">
			<view class="logo">欢迎来到fust-UI</view>
		</view>
		<!-- 注册 -->
		<view class="login-phone form-wapper">
			<view class="login_tit">账号</view>
			<view class="phone input-wapper">
				<view class="mobile rside">
					<input focus placeholder-class="input-placeholder" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
				</view>
			</view>
			<view class="login_tit">验证码</view>
			<view class="code input-wapper">
				<view class="rside">
					<input placeholder-class="input-placeholder" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
					<button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
				</view>
			</view>
			<view class="login_tit">密码</view>
			<view class="phone input-wapper">
				<view class="mobile rside" style="display: flex;justify-content: space-between;width: 100%;height: 100%;">
					<input style="width: 80%;" placeholder-class="input-placeholder" v-if="type == 'password'" type="password" v-model="password" placeholder="请输入字母加数字(6-12位)" minlength="6"
					 maxlength="12" />
           <input style="width: 80%;" placeholder-class="input-placeholder" v-if="type == 'text'" type="text" v-model="password" placeholder="请输入字母加数字(6-12位)" minlength="6"
            maxlength="12" />
           <view class="">
             <text class="iconfont fu-iconfont" :data-type="type" @click.stop="is_kejian" v-if="type == 'text'">&#xe7e6;</text>
             <text class="iconfont fu-iconfont" :data-type="type" @click.stop="is_kejian" v-if="type == 'password'" >&#xe7e9;</text>
           </view>
					<!-- <text class="iconfont icon-yanjing1" :data-type="type" @click.stop="is_kejian" :class="type=='password'?'':'act'"></text> -->
				</view>
			</view>
      <view class="login_tit">邀请码（选填）</view>
      <view class="code input-wapper">
      	<view class="rside">
      		<input placeholder-class="input-placeholder" @input="edti" type="text" maxlength="12" v-model="invite_code" placeholder="请输入邀请码" />

      	</view>
      </view>
			<view class="paw">
				<!-- <view class="" @tap="toCodeLogin">验证码登录</view> -->
			</view>
		</view>

		<!-- 注册按钮 -->
		<button type="primary" :loading="is_click" class="login-btn" @tap="reg" style="margin-top: 24upx;">注册</button>
		<!-- 协议 -->
		<view class="xieyi_txt">
			<!-- <view v-if="!is_agree" @tap="agree(0)">
				<text class="iconfont icon-checkbox-o"></text>阅读并同意
			</view>
			<view v-if="is_agree" @tap="agree(1)">
				<text class="iconfont icon-checkbox_on"></text>阅读并同意
			</view> -->
			<!-- <text @tap="clickNo">《用户协议》</text>和<text @tap="clickNo">《隐私政策》</text> -->
		</view>
	</view>
</template>
<script>
	let _this;
	import {
		validate
	} from '@/common/utils/index'
	export default {
		data() {
			return {
				phone: '', //手机号
				vercode: '', //验证码
				password: '', //密码
				is_click: false, // 登录按钮加载动画
				verCodeBtnLoading: false,
				time: 60, //倒计时60S
				beginning: false, //显示倒计时
				type: 'password', //密码类型
				is_agree: false ,// 协议
        invite_code:''
			};
		},
		onLoad() {
			_this = this;
		},
		methods: {
      clickNo(){
        _this.$message.info('不要点击了，还没开放了');
      },
			//协议是否选中事件
			agree(val) {
				if (val == 0) {
					_this.is_agree = true;
				} else {
					_this.is_agree = false;
				}
			},
			//切换可见
			is_kejian(e) {
				let type = e.currentTarget.dataset.type;
				if (type == 'password') {
					_this.type = 'text';
				} else {
					_this.type = 'password';
				}
			},
			//返回上一页
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			//发送验证码
			handleSendVerCode() {
				let {
					phone
				} = this;
				if (!validate(phone, 'phone')) {
					_this.$message.info('请正确输入手机号');
					return false;
				}
				if (_this.beginning) return false;
				if (_this.verCodeBtnLoading) return false;
				_this.verCodeBtnLoading = true;
				_this.$api.post(global.apiUrls.GetVerifyCode, {
				    is_test: global.IS_DEV,
				    mobile: phone,
				    type: '1'
				  })
        .then(res => {
					_this.verCodeBtnLoading = false;
					if (res.data.code == 1) {
						_this.$message.info('验证码为' + res.data.data.code + '请注意查收');
						_this.beginning = true;
						//显示倒计时
            clearInterval(_this.timer);
						//开始倒计时
						_this.timer = setInterval(() => {
							if (_this.time == 1) {
								//倒计时结束
								clearInterval(_this.timer);
								_this.time = 60;
								_this.beginning = false;
								return;
							}
							_this.time--;
						}, 1000);
					} else {
						_this.$message.info(res.data.msg);
					}
				});
			},
      edti(e){
        e.detail.value = e.detail.value.replace(/[\u4e00-\u9fa5]/ig,' ')
        this.invite_code = e.detail.value
      },
			//注册
			reg() {
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				if (_this.is_click) {
					return;
				}
				let {
					phone,
					vercode,
					password,
          invite_code
				} = this;
				if (!phone) {
					_this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					_this.$message.info('请输入正确的手机号');
					return false;
				}
				if (!vercode) {
					_this.$message.info('验证码不能为空');
					return false;
				}
        
				if (!validate(password, 'password')) {
					_this.$message.info('请输入字母加数字6-12位密码');
					return false;
				}
				// if(invite_code){
				// 	if (!validate(invite_code, 'invitecode')) {
				// 		_this.$message.info('请输入正确格式的邀请码');
				// 		return false;
				// 	}
				// }

				// if (!_this.is_agree) {
				// 	_this.$message.info('请勾选协议');
				// 	return false;
				// }

				_this.is_click = true;
				_this.$api.post(global.apiUrls.postRegisterByMobile, {
				    mobile: phone,
				    code: vercode,
            type:1,
            password:password,
            client_id:'',
            invite_code:invite_code
				  })
        .then(res => {
					_this.is_click = false;
					if (res.data.code == 1 && res.data.data) {
            _this.$message.info(res.data.msg);
            global.token = res.data.data.userinfo.user_token
            global.userInfo = res.data.data.userinfo
            uni.setStorageSync('USER_TOKEN', global.token)
            uni.setStorageSync('USER_INFO', global.userInfo)
            uni.$emit('appLoginSuccess', {
              msg: '注册成功'
            })
            setTimeout(()=>{
              uni.reLaunch({
                url: '/pages/tab/tab01/index',
              })
            },500)
					} else {
						_this.$message.info(res.data.msg);
					}
				})
			}
		}
	};
</script>
<style lang="scss">
	// 头部返回键 start
	.cu-bar .action {position: relative;z-index: 5;}
	// 头部返回键 end
	// 主体 start
	.warp {
		background: #fff;min-height: 100vh;
		.login_tit{margin-top:28upx;font-size:30upx;color:#333;font-weight:700}
		.bg_img{width:100%;height:441upx;position:absolute;left:0;top:0;z-index:2}
		.login-title {
			position: relative;z-index: 9;
			.logo{padding-top:128upx;width:100%;padding-left:75upx;box-sizing:border-box;font-size:56upx;font-weight:500}
		}

		.form-wapper {
			position:relative;width:100%;box-sizing:border-box;padding:92upx 75upx 20upx;border-radius:10upx;z-index:99;
			.input-wapper {
				display:flex;flex-direction:row;width:100%;flex-wrap:wrap;align-items:center;position:relative;color:#333;height:100upx;border-bottom:1px solid #eee;
				.rside{flex:1}
				.iconfont{font-size:40upx;color:#bfbfbf;line-height: 100rpx;}
				input{height:90upx;box-sizing:border-box;border:none!important;width:calc(100% - 80px)}
				.input-placeholder{color:#bfbfbf;font-size:30upx;font-weight:400}
				.icon-yanjing1{position:absolute;right:0;top:50%;transform:translate(0, -50%);color:#999}
				.icon-yanjing1.act{color:$fu-main-color}
				.icon-yanjing1.act:before{content:"\e681"}
			}

			.yanZhengMa {
				position:absolute;padding:0;right:0;color:$fu-main-color;font-size:28rpx;background:none;height:90upx;line-height:90upx;top:0;
				&:after {border: none;}
			}
			.paw{line-height:80upx;width:94%;height:80upx;margin:0 3%;text-align:right;display:flex;justify-content:flex-end;color:$fu-main-color;font-size:24upx}
		}

		.login-btn {
			display:block;line-height:90upx;text-align:center;margin:0 75upx;height:90upx;font-size:32upx;color:#fff;background:$fu-main-color;opacity:1;border-radius:50upx;background-blend-mode:normal,normal;
			&:after {border: 0;}
		}
	}
	// 主体 end

	// 隐私协议样式 start
	.xieyi_txt {
		position:absolute;left:50%;transform:translateX(-50%);bottom:40upx;display:flex;justify-content:center;text-align:center;margin-top:32upx;font-size:$uni-font-size-base;color:#90959b;width:100%;
		.iconfont{color:#90959b;margin-right:8upx}
		.icon-checkbox_on,text{color:#333}
	}
	// 隐私协议样式 end
</style>

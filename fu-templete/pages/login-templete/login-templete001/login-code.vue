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

		<!-- 验证码登录 -->
		<view class="login-phone form-wapper">
			<view class="login_tit">账号</view>
			<view class="phone input-wapper">
				<view class="mobile rside">
					<input placeholder-class="input-placeholder" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
				</view>
			</view>
			<view class="login_tit">验证码</view>
			<view class="code input-wapper">
				<view class="rside">
					<input placeholder-class="input-placeholder" type="number" maxlength="4" v-model="vercode" placeholder="请输入验证码" />
					<button class="yanZhengMa" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{ beginning ? time + 's后重新获取' : '获取验证码' }}</button>
				</view>
			</view>
			<view class="paw">
				<view @tap="handleJump" data-type="REDIRECT" :data-url="PAGE_BASE_URL + 'login-password'">密码登录</view>
			</view>
		</view>

		<!-- 立即登录按钮 -->
		<button type="primary" :loading="is_click" class="login-btn" shape="circle" @click="handleLogin">立即登录</button>

		<!-- 快捷登陆 start -->
		<view class="quick">
			<view class="quick-title"><text class="line"></text><text class="txt">快捷登录</text><text class="line"></text></view>
			<view class="sanfang">
				<image @click="wxLogin" src="@/fu-templete/static/login/login-quick-001.png" mode=""></image>
			</view>
		</view>
		<!-- 快捷登陆 end -->
	</view>
</template>
<script>
  let _this;
	import {
		validate
	} from '@/common/utils/index';
	export default {
		data() {
			return {
				phone: '', //手机号
				vercode: '', //验证码
				is_click: false,
				verCodeBtnLoading: false, // 是否显示加载图标
				time: 60, //倒计时60S
				beginning: false ,//显示倒计时
				PAGE_BASE_URL: '/fu-templete/pages/login-templete/login-templete001/', // 页面基础路径
			};
		},
    onLoad(){
     _this = this;
    },
		methods: {
			// 立即登录
			handleLogin() {
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				if (_this.is_click) {
					return;
				}
				let {
					phone,
					vercode,
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
				_this.is_click = true;
				_this.$api.post(global.apiUrls.postUserMobileLogin, {
            mobile: phone,
            code:vercode,
          })
					.then(res => {
						if (res.data.code == 1 && res.data.data) {
							_this.$message.info(res.data.msg);
							uni.setStorageSync('USER_TOKEN', global.token)
							uni.setStorageSync('USER_INFO', global.userInfo)
							global.token = res.data.data.userinfo.user_token
							global.userInfo = res.data.data.userinfo
							uni.$emit('appLoginSuccess', {
							  msg: '登录成功'
							})
							setTimeout(()=>{
							  uni.reLaunch({
							    url: '/pages/tab/tab01/index',
							  })
							},500)

						}else{
              _this.$message.info(res.data.msg);
            }
						this.is_click = false;
					})
			},
			//返回上一页
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 发送验证码
			handleSendVerCode() {
				let {
					phone
				} = this;
				if (!phone) {
					this.$message.info('请输入手机号');
					return false;
				}
				if (!validate(phone, 'phone')) {
					this.$message.info('请正确输入手机号');
					return false;
				}
				if (this.beginning) return false;

				this.verCodeBtnLoading = true;
				this.beginning = true;
				this.$api.post(global.apiUrls.GetVerifyCode, {
            is_test: global.IS_DEV,
            mobile: phone,
            type: '3'
          })
					.then(res => {
						_this.verCodeBtnLoading = false;
						if (res.data.code == 1) {
							//开始倒计时
              clearInterval(_this.timer);
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
              _this.$message.info('验证码为' + res.data.data.code + '请注意查收')
						} else {
							_this.$message.info(res.data.msg);
						}
					}).catch(function(err){
						console.log(err);
					})
			},
			// 微信登录
			wxLogin() {
				let _this = this;
				// #ifdef APP-PLUS
				if (plus.runtime.isApplicationExist({
						pname: 'com.tencent.mm',
						action: 'weixin://'
					})) {
					uni.getProvider({
						service: 'oauth',
						success: function(res) {
							//支持微信、qq和微博等
							if (~res.provider.indexOf('weixin')) {
								_this.wx_login_fn();
							}
						},
						fail: function(err) {
							console.log(err)
						}
					});
				} else {
					this.$message.info('请安装微信后再使用此功能')
				}
				// #endif
			},
			wx_login_fn() {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
                // console.log(infoRes)
								uni.showLoading({
									title: '加载中'
								})
								let {
									nickName,
									avatarUrl,
									gender
								} = infoRes.userInfo;
                // #ifdef APP-PLUS
                  let  clientId = plus.push.getClientInfo().clientid || '';
                  let  appSystem = uni.getSystemInfoSync().platform == 'ios' ? 1 : 2;
                // #endif
								_this.$api.post(global.apiUrls.postUserSocialLogin, {
								  type: 1,
								  wx_unionid: infoRes.userInfo.unionId,
								  qq_unionid: '',
								  wb_unionid: '',
								  clientId: clientId || '',
								  appSystem: appSystem || '',
								  nickname: nickName,
								  avatar: avatarUrl,
								  gender: gender,
								}).then(res => {
                  global.tempUserLoginInfo = infoRes.userInfo;
									uni.hideLoading();
									if (res.data.code == 1) {
										_this.$message.info(res.date.msg);
                    global.token = res.data.data.userinfo.user_token
                    global.userInfo = res.data.data.userinfo
                    uni.setStorageSync('USER_TOKEN', global.token)
                    uni.setStorageSync('USER_INFO', global.userInfo)
										setTimeout(()=>{
										  uni.reLaunch({
										    url: '/pages/tab/tab01/index',
										  })
										},500)

									} else if (res.data.code == -999) {

                    _this.$urouter.redirectTo({
                      url: _this.PAGE_BASE_URL + 'bind-tel',
                      params: {
                        unionId: infoRes.userInfo.unionId,
                        openId: infoRes.userInfo.openId,
                        sex: infoRes.userInfo.gender,
                        nickName: infoRes.userInfo.nickName,
                        avatarUrl: infoRes.userInfo.avatarUrl
                      }})
                    // 点击手机号账号登录按钮
									} else if (res.code == -1) {
										_this.$message.info(res.data.msg);
										return;
									}
								}).catch(err => {
									uni.hideLoading();
									console.log(err)
								});
							}
						});
					},
					error: function(err) {
						uni.hideLoading()
						console.log(err)
					}
				});
			}
		}
	}
</script>
<style lang="scss">
// 头部返回键
	.cu-bar .action {position: relative;z-index: 5;}
	// 主体 start
	.warp{
		background:#fff;min-height:100vh;
		.login_tit{margin-top:28upx;font-size:30upx;color:#333;font-weight:700}
		.bg_img{width:100%;height:441upx;position:absolute;left:0;top:0;z-index:2}
		.login-title{
			position:relative;z-index:9;
			.logo{padding-top:128upx;padding-left:75upx;font-size:56upx;font-weight:500}
		}
		.form-wapper,.logo{width:100%;box-sizing:border-box}
		.form-wapper{
			position:relative;padding:92upx 75upx 20upx;border-radius:10upx;z-index:99;
			.input-wapper{
				display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;position:relative;color:#333;height:100upx;border-bottom:1px solid #eee;
				.rside{flex:1}
				.iconfont{font-size:40upx;color:#bfbfbf}
				input{height:90upx;border:none!important;width: calc(100% - 80px);}
				.input-placeholder{color:#bfbfbf;font-size:30upx;font-weight:400}
				.icon-yanjing1{position:absolute;right:0;top:50%;transform:translate(0, -50%);color:#999}
				.icon-yanjing1.act{color:$fu-main-color}
				.icon-yanjing1.act:before{content:"\e681"}
			}
			.yanZhengMa{
				position:absolute;padding:0;right:0;color:$fu-main-color;font-size:28rpx;background:none;height:90upx;line-height:90upx;top:0;
				&:after{border:none}
			}
			.paw{line-height:80upx;width:94%;height:80upx;margin:0 3%;text-align:right;display:flex;justify-content:flex-end;color:$fu-main-color;font-size:24upx}
			}
			.login-btn{
				display:block;line-height:90upx;text-align:center;margin:0 75upx;height:90upx;font-size:32upx;color:#fff;background:$fu-main-color;opacity:1;border-radius:50upx;background-blend-mode:normal,normal;
				&:after{border:0}
			}
			.quick{
				text-align:center;
				.quick-title{
					margin:120upx 0 50upx;display:flex;align-items:center;justify-content:center;
					.txt{font-size:28upx;color:#999;padding:0 20upx}
					.line{
						display:block;width:160upx;position:relative;
						&:after{content:'';position:absolute;z-index:0;bottom:0;left:0;width:100%;border-bottom:1px solid #eee;transform:scaleY(0.5);transform-origin:0 0}
						}
					}
					image{width:80upx;height:80upx;margin:0 35upx}
			}
	}
	// 主体 end
</style>

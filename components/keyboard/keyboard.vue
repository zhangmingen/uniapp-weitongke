<template>
	<view class="keyborad" :style="{transform:show_key?'translateY(0)':'translateY(100%)'}">
		<view class="key_main">
			<view class="main_title">
				<!-- <image src="/static/del_1.png" mode="aspectFill" ></image> -->
        <image src="/fu-templete/static/wallet/del_1.png" mode="" @tap="hideFun"></image>
				<text>请输入支付密码</text>
			</view>
			<view class="main_content">
				<view class="content_num">
					<view v-for="item in inputArray" :key="item" class="content_item">{{password[item-1] ? '●' :''}}</view>
				</view>
				<view class="main_forget" @tap="forgetFun">忘记密码</view>
			</view>
			<view class="main_keyboard">
				<view class="key_num" v-for="item in numberArray" :key="item" @tap="inputNumFun({num:item})">{{item}}</view>
				<view class="key_null"></view>
				<view class="key_0"  @tap="inputNumFun({num:0})">0</view>
				<view class="key_del" @tap="delNumFun">
					<image src="/static/del_2.png" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			show_key:Boolean
		},
		computed:{},
		data(){
			return{
				inputArray:[1,2,3,4,5,6],//输入密码的长度
				numberArray:[1,2,3,4,5,6,7,8,9],//密码键盘的数字
				password:'',//密码
			}
		},
		methods:{
			inputNumFun(op){
				let _this = this
				if(_this.password.length <=6){
					_this.password += op.num
					if(_this.password.length == 6){
						_this.$emit('getPassword',{password:_this.password})
						setTimeout(()=>{
              _this.password = []
            },500)
					}
				}

			},
			delNumFun(){
				if(this.password.length == 0) return
				this.password = this.password.substring(0,this.password.length - 1)
				console.log("删除后的结果",this.password)
			},
			forgetFun(){
				uni.showToast({
					title:'忘记密码操作',
					icon:'none'
				})
			},
			hideFun(){
				console.log("close")
				this.$emit('hideFun')
			}
		}
	}
</script>

<style lang="scss">
	.keyborad{background: rgba(1,1,1,0.5) !important;width:100vw;height: 100vh;position: fixed;bottom: 0px;top:0px;left:0px;right:0px;z-index:100;display: flex;flex-direction: column;justify-content: flex-end;transform: translateY(100%);transition:all 0.4s;
		.key_main{ width:100vw;height: 900rpx;background: rgba(245,245,245,0.9);box-sizing: border-box;display: flex;flex-direction: column;justify-content: space-between;
			.main_title{ font-size:34rpx;color: #000000;height: 100rpx;display: flex;align-items: center;letter-spacing: 2rpx;width:100%;box-sizing: border-box;padding:0px 20rpx;border-bottom:2rpx solid #e1e1e1;
				image{ width:48rpx;height: 48rpx;position: relative;z-index:10}
				text{ flex:1;margin-left:-48rpx;display: flex;justify-content: center;}
			}
			.main_content{ width:100%;box-sizing: border-box;padding:0px 30rpx;margin-top:40rpx;
				.content_num{ width:100%;height: 100rpx;border:2rpx solid #DBDBDB;border-radius: 10rpx;display: flex;align-items: center;
					.content_item{ flex: 1;height: 100%;border-right: 2rpx solid #DBDBDB;display: flex;justify-content: center;align-items: center;}
					.content_item:last-child{ border-right:none}
				}
				.main_forget{ display: flex;justify-content: center;align-items: center;width:100%;font-size:28rpx;color: #007AFF;margin-top:40rpx}
			}
			.main_keyboard{ width:100%;height: 500rpx;background: #FFFFFF;display: flex;flex-flow: wrap;
				.key_null,.key_del{ background: #e2e7eb;}
				image{ width:48rpx;height: 48rpx;}
				.key_num,.key_null,.key_del,.key_0{ width:250rpx;height: 125rpx;display: flex;align-items: center;justify-content: center;}
				.key_num{ border-right:2rpx solid #f1f4f4;border-bottom:2rpx solid #f1f4f4;box-sizing: border-box;}
				.key_num:nth-child(8){border-bottom: none;}
				.key_0{ border-top:2rpx solid #f1f4f4}
			}
		}
	}
</style>

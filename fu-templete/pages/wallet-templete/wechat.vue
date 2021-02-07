<template>
	<view class="page-user">
		<view class="alipay_main">
			<view class="alipay_box">
				<text>姓名</text>
				<input type="text" placeholder="请输入真实姓名，需与认证信息一致" v-model="name" />
			</view>
			<view class="alipay_cont">
				<text class="alipay_pa">微信收款二维码<text>（仅限一张）</text></text>
				<image @tap="ChooseImage" :src="logo" mode=""></image>
			</view>
		</view>
		<view class="bottom_btn" @click="tijiao">提交</view>
	</view>
</template>

<script>
  import { UploadImage } from '@/common/utils/index';
export default {
	data() {
		return {
      type: '',
      name: '',
      is_click: false,
      logo: '../../static/wallet/up.png',
	  // logo: 'http://111.229.13.202:3210/uploads/images/d5/ee853a141576b25916772c4bdf189a.png',
      count: 1,
      images: [],
	  imagesId:''
		};
	},
	onLoad() {
		this.Detail();
	},
	methods: {
		ChooseImage() {
      let self = this;
      // 从相册中选择图片
      uni.chooseImage({
        count: this.count - this.images.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;
          // 开始上传
          new UploadImage(tempFilePaths, {
            complete: function(res) {
              // 上传成功 返回数据格式为数组 [ { id: '', path: '' } ]
              console.log(res, 'UploadImage')
              self.logo = res[0].path;
            }
          })
        }
      });
		},
		Detail(){
			let _this = this;
			_this.$api.get(global.apiUrls.getWithdrawAccount, {
			  account_type: 1
			}).then(res => {
			  console.log(res, 'get_withdraw_account');
			  if(res.data.code == 1){
			     _this.name = res.data.data.true_name
			     _this.logo = res.data.data.qrcode
			  }
			}).catch(err => {
			   console.log(err, 'get_withdraw_account')
			})
		},
		tijiao(){
      let reg = /^[\u0391-\uFFE5]+$/;
      let _this = this
      if (!_this.name) {
        _this.$message.info('请输入姓名');
        return false;
      }
      if(!reg.test(_this.name)){
          console.log('asd')
          _this.name = ''
           _this.$message.info('姓名输入有误');
           return
      }
			if(_this.is_click){
				return
			}
			let{name,imgs,USER_TOKEN,TOKEN}=this;

      if (_this.logo == '../../static/wallet/up.png') {
        _this.$message.info('收款码未上传');
        return false;
      }
			_this.is_click = true;

      _this.$api.post(global.apiUrls.postBindWithdrawAccount, {
        true_name: name,
        qrcode: _this.logo,
        account_type: 1,
        is_default: 0,
        account_id:'1'
      }).then(res => {
        if(res.data.code == 1){
            _this.$message.info(res.data.msg);
           setTimeout(()=>{
              uni.navigateBack();
           },500)
        }
      }).catch(err => {
         console.log(err, 'bind_withdraw_account')
      })
		}
	}
};
</script>

<style lang="scss">
	.alipay_main .alipay_cont .up_img{
		position: relative;
		display: inline-block;
		margin-right: 30upx;
		margin-bottom: 30upx;
		float: left;
		image{
			margin-top: 0;
		}
		.del-tag{
			position: absolute;
			top: -12upx;
			right: -12upx;
			width: 24upx;
			height: 24upx;
			border-radius: 50%;
			text{
				font-size: 24upx;
				display: block;
				width: 24upx;
				text-align: center;
			}
		}
	}
	.bottom_btn{
		width: calc(100% - 60upx);
		margin: 100upx auto;
		height: 88upx;
		background: $fu-btn-bg;
		border-radius:44upx;
		font-size: 32upx;
		color: white;
		line-height: 88upx;
		text-align: center;
	}
	.alipay_main{
		width: 100%;
		height: auto;
		overflow: hidden;
		background: white;
		.alipay_box{
			width: 100%;
			height: auto;
			overflow: hidden;
			position: relative;
			padding: 0 30upx;
			&:before{
				content: '';
				position: absolute;
				height: 1px;
				background: #EEEEEE;
				left: 30upx;
				right: 0;
				bottom: 0;
				transform: scaleY(0.5);
			}
			text{
				font-size: 30upx;
				color: #333333;
				line-height: 99upx;
				display: block;
				float: left;
			}
			input{
				display: block;
				float: left;
				height: 99upx;
				font-size: 30upx;
				color: #333;
				line-height: 99upx;
				width: 80%;
				padding-left: 20upx;
			}
		}
		.alipay_cont{
			width: 100%;
			height: auto;
			padding: 30upx;
			.alipay_pa{
				font-size: 30upx;
				color: #333;
				display: block;
				margin-bottom: 20upx;	;
				line-height:32upx;
				text{
					font-size: 24upx;
					color: #999999;
				}
			}
			image{
				display: block;
				width: 144upx;
				height: 144upx;
				margin-top: 27upx;
			}
		}
	}

</style>

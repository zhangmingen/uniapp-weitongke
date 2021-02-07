<template>
	<view class="page bg-white">
		<view class="goods-wrap bg-white padding">
				<view class="flex padding-tb-sm">
					<image class="img-150" :src="items.img_url||'http://erp.baoyiart.com/uploads/images/20200928/74cbabea98cb4c210362ce7af829ff91.jpg'" mode="aspectFill"></image>
					<view class="goods-info margin-left-sm">
						<view class="text-df text-black text-cut-2">{{items.goods_name||''}}</view>
						<view class="text-sm text-grey">白色<text class="text-df" style="float: right;">x{{items.num}}</text></view>
						<view class="flex justify-between">
							<text class="text-df" style="color: #333333;">¥{{items.goods_money||''}}</text>
						</view>
					</view>
				</view>
		</view>
		<view class="cu-form-group">
			<view class="title">售后选择</view>
			<picker @change="statsChange" :value="statindex" :range="staicon">
				<view class="picker">
					{{staicon[statindex]}}
				</view>
			</picker>
		</view>
			<view class="cu-form-group">
				<view class="title">{{staicon[statindex]}}原因</view>
				<picker @change="reasonChange" :value="select_reason" :range="reasons">
					<view class="picker">
						{{reasons[select_reason]}}
					</view>
				</picker>
			</view>
			<view class="cu-form" >
				<view class="title">退款说明</view>
				<textarea class="wen" value="" v-model="texts" placeholder="请在此描述申请售后服务的原因" />
			</view>
      <view class="alipay_cont flex">
        <image v-if="arrList.length<3" :src="logo" mode="" @tap="ChooseImage"></image>
        <view v-if="arrList.length!=0" class="margin-left-xs" v-for="(item,index) in arrList" :key="index">
          <image  :src="item.path" mode=""></image>
        </view>
      </view>
		<button class="ben-btn submit-btn" @click.stop="handleSubmit">提交</button>
	</view>
</template>

<script>
    import { UploadImage } from '@/common/utils/index';
     import { UPLOAD_IMAGE_URL } from '@/common/config.js';
	export default {
		data() {
			return {
				order_sn: null,
				goodsInfo: [],
        logo: '../../static/wallet/up.png',
				imgs: [],
				tem_imgs: [],
				states: ['已收到货','未收到货'],// 货物状态
				reasons: ['不喜欢','质量问题','不合适','七天无理由退货'],// 退款原因
				staicon: ['退款','退货退款'],// 退款原因
				statindex:0,
				money: 0,
        items:'',
				free: 0,
				marks: '',
				select_state: 0,
				select_reason: 0,
				images: [],
				texts: '',
				order_id:0,
				address_id:0,
				poid:'',
				type:'',
				total_price:0,
				kuainame:'',
				kuaidan:'',
        arrList:[]
			};
		},
		methods: {
			//获取售后信息
			getData(){

				this.$api.get(global.apiUrls.getOrderDetail, {
				  order_sn: this.order_sn,
          order_type:12,
          goods_id:this.goods_id
				})
				.then(res => {
				 console.log(res)
				  if(res.data.code == 1){
              this.items = res.data.data

				  }
				})
			},
      //上传图片
      ChooseImage() {
        let self = this;
        // 从相册中选择图片
        uni.chooseImage({
          count: this.count - this.images.length, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          success: function(res) {
            console.log(res)
            const tempFilePaths = res.tempFilePaths;
            // 开始上传
            new UploadImage(tempFilePaths, {
              complete: function(res) {
                // 上传成功 返回数据格式为数组 [ { id: '', path: '' } ]
                console.log(JSON.stringify(res), 'UploadImage')
                self.arrList.push(res[0]) ;
              }
            })
          }
        });
      },

			reasonChange(e){
        console.log(e)
				this.select_reason = e.detail.value;
			},
			statsChange(e){
				this.statindex = e.detail.value;
			},
			// 提交
			handleSubmit(){
				uni.hideKeyboard();
				let that = this
				if(!that.texts){
          that.$message.info('请输入退款说明');
          return
        }
        let arr = ''
        if(that.arrList){
          that.arrList.map(item=>{
            arr+=item.id+','
          })
          arr = arr.substring(0,arr.length-1)
        }
				let goods = {
					order_sn: that.order_sn,
					refund_type: that.statindex+1,
					refund_reason: that.reasons[that.select_reason],
					refund_content: that.texts,
          goods_id:that.goods_id,
          goods_money:that.items.goods_money,
          num:that.items.num
				}
        if(arr){
          goods.refund_picture = arr
        }
				that.$api.post(global.apiUrls.postGoodsAfterSale,goods)
				.then(res => {
					console.log(res);
          that.$message.info(res.data.msg);
					if(res.data.code == 1){
						setTimeout(function() {
							uni.navigateBack()
						}, 800)
					}
				})
				.catch(err => {
					console.log("err: " + JSON.stringify(err));
				})
			}
		},
		onLoad(option) {
			this.order_sn = option.order_sn;
      this.goods_id = option.goods_id;
      this.getData()
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100%;
	}
  page{
    background: #FFFFFF;
  }
  .alipay_cont {
    width: 100%;
    height: auto;
    padding: 10upx 30upx;
    .alipay_pa {
      font-size: 30upx;
      color: #333;
      display: block;
      margin-bottom: 20upx;
      ;
      line-height: 32upx;

      text {
        font-size: 24upx;
        color: #999999;
      }
    }

    image {
      display: block;
      width: 144upx;
      height: 144upx;
      margin-top: 27upx;
    }
  }
  .text-cut-2{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
.row{
	height: 100upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.title{
	display: inline-block;
	// width: 160upx;
}
.submit-btn{
	position: fixed;
	bottom: 30rpx;
	left: 30rpx;
	right: 30rpx;
	height: 88rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 88rpx;
	color: #FFFFFF;
	background:$fu-btn-bg;
	font-size: 32rpx;
}
.absolute-btn{
	height: 88rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 88rpx;
	color: #FFFFFF;
	background-color: #FF7A40;
	font-size: 32rpx;

}
.wen{
	width: 100%;
	height: 272rpx;
	border: 1rpx solid #E8E8E8;
	margin-top: 24rpx;
	padding: 24rpx;
	background-color: #FCFCFC;
}
.popup-title{
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	.close{
		position: absolute;
		top: 0;
		right: 0;
		width: 40upx;
		height: 40upx;
	}
}
.popup-item{
	height: 100upx;
	line-height: 100upx;
	color: #666;
	font-size: 28upx;
	&.active{
		color: #FF7A40;
	}
}
.cu-form{
	padding:0 32rpx;
	margin-bottom: 20rpx;
}
.cform{
	display: flex;
	.tloe{
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
		width: 180rpx;
		font-size: 12px;
	}
	.kuio{
		font-size: 14px;
		line-height: 50rpx;
		width: 500rpx;
		height: 50rpx;
		border: 1px solid #CCCCCC;
	}
}
.img-120{
	width: 120rpx;
	height: 120rpx;
}
.img-32{
	width: 32rpx;
	height: 32rpx;
}
.img-150{
	width: 150rpx;
	height: 150rpx;
}
.goods-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	overflow: hidden;
	& > view {
		width: 100%;
	}
}
</style>

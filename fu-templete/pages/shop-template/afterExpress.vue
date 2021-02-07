<template>
	<view>
		<view class="padding-lr margin-top-sm">
			<view class="padding bg-white radius-20">
				<view class="list-item flex">
					<text class="title">退货地址</text>
					<text class="flex-sub  text-df">{{sender && sender.address}}</text>
				</view>
				<view class="list-item flex">
					<text class="title">收件人</text>
					<text class="flex-sub text-cut text-df">{{sender && sender.name}}</text>
				</view>
				<view class="list-item flex">
					<text class="title">联系电话</text>
					<text class="flex-sub text-cut text-df">{{sender && sender.mobile}}</text>
				</view>
			</view>
		</view>
		<view class="padding-lr margin-top-sm">
			<view class="padding bg-white radius-20">
				<view class="list-item flex" @click="chooseExpress">
					<text class="title">物流公司</text>
					<picker class="flex-sub" @change="pickerChange" :value="current" :range="picker" range-key="name">
						<view class="picker text-df flex justify-between align-center">
							<text class="text-333 text-df">{{current > -1 ? picker[current].name : '选择物流公司'}}</text>
							<text class="cuIcon-right text-999"></text>
						</view>
					</picker>
				</view>
				<view class="list-item flex">
					<text class="title">运单单号</text>
					<input class="flex-sub text-df" v-model="express_no"  placeholder="请输入快递单号" />
				</view>
			</view>
		</view>
		<button :loading="is_click" class="action-btn cu-btn bg-theme round" @click="handleSubmit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				sender: null,
				express_no: '',
				express_id: '',
				express_name: '',
				current: -1,
        is_click:false,
				picker: [],
			};
		},
		methods: {
			// 获取退货地址
			chooseExpress(){
        let that = this
				that.$api.post(global.apiUrls.getGoodsAfterSaleafterExpress,{
					id: that.id,
				}).then(res => {
					console.log(res)
					if(res.data.code == 1){
						let data = res.data.data.sender;
						that.sender = {
							address: data.province+data.city+data.area+data.address,
							name: data.name,
							mobile: data.phone,
						}
					}
				}).catch(err => {
					console.log(err)
				})

			},
			// 获取物流公司列表
			getExpressList(){
        let that = this
				that.$api.post(global.apiUrls.getGoodsAfterSaleGetLog)
				.then(res => {
					if(res.data.code == 1){
						that.picker = res.data.data.list;
					}
				})
				.catch(err => {
					console.log(err)
				})

			},
			// 物流公司选择
			pickerChange(e){
        console.log(e)
				this.current = e.detail.value;
				this.express_id = this.picker[this.current].aid;
			},
			// 提交
			handleSubmit(){
        let that = this
				if(!that.id) return that.$message.info('无效的售后单');
				if(!that.express_no) return that.$message.info('无效的物流单号');
				if(!that.express_id) return that.$message.info('无效的物流公司');
				let data = {
					id: that.id,
					express_no: that.express_no,
					express_company_id: that.express_id,
				}
				that.$api.post(global.apiUrls.getGoodsAfterlog,data)
				.then(res => {
					console.log(res);
					if(res.data.code == 1){
            that.$message.info('物流信息已提交售后,等待商家审核')
						setTimeout(function(){
							uni.navigateBack();
						},800)

					}else{
            that.$message.info(res.msg);
					}

				})
				.catch(err => {
					console.log(err)
				})
			},
			//
		},
		onLoad(options) {
			const {id} = options;
			this.id = id;
			this.chooseExpress();
			this.getExpressList();
		}
	}
</script>

<style lang="scss" scoped>
.list-item{
	.title{
		width: calc(4em + 40rpx);
		font-size: 28rpx;
	}
	text{
		display: inline-block;
	}
}
.list-item+.list-item{
	margin-top: 20rpx;
}
.action-btn{
	position: fixed;
	left: 32rpx;
	right: 32rpx;
	bottom: 50rpx;
	bottom: calc(50rpx + constant(safe-area-inset-bottom));
	bottom: calc(50rpx + env(safe-area-inset-bottom));
	height: 88rpx;
  background: $fu-btn-bg !important;
  color: $uni-text-color-inverse;
}
</style>

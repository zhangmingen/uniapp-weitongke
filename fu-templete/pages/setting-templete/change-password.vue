<template>
    <view class="">
        <view class="per">
         <view class="cu-list menu">
         	<view class="cu-item" :class="menuArrow?'arrow':''">
         		<view class="content flex">
         			<text class="padding-right">旧 密 码</text>
         			<input type="password" value="" password="true" v-model="oldPassworl" placeholder="请输入当前密码" placeholder-style="color:#999;" />
         		</view>
         	</view>
         	<view class="cu-item" :class="menuArrow?'arrow':''">
         		<view class="content flex">
         			<text class="padding-right">新 密 码</text>
         			<input type="password" value="" password="true" v-model="newPassworl" placeholder="请输入新密码" placeholder-style="color:#999;" />
         		</view>
         	</view>
         	<view class="cu-item" :class="menuArrow?'arrow':''">
         		<view class="content flex">
         			<text class="padding-right-sm">确认密码</text>
         			<input type="password" value="" password="true" v-model="confirmPassworl" placeholder="请再次输入新密码" placeholder-style="color:#999;" />
         		</view>
         	</view>
         </view>
        </view>
        <view class="btn_cloce" style="padding:30rpx;" >
			<fu-button type="primary" @click="tappass">提交</fu-button>
		</view>
    </view>
</template>

<script>
import {
	validate
} from '@/common/utils/index'
export default {
    data() {
        return {
			menuArrow: false,
			oldPassworl: '',
			newPassworl: '',
			confirmPassworl: ''
        };
    },
    onLoad() {
    },
    methods: {
		tappass() {
			if (!this.oldPassworl) {
				uni.showToast({
					title: '请输入旧密码',
					icon: 'none'
				});
				return false;
			}
			if (!validate(this.oldPassworl, 'password')) {
				this.$message.info('请输入字母加数字6-12位旧密码');
				return false;
			}
			if (!this.newPassworl) {
				uni.showToast({
					title: '请输入新密码',
					icon: 'none'
				});
				return false;
			}
			if (!validate(this.newPassworl, 'password')) {
				this.$message.info('请输入字母加数字6-12位新密码');
				return false;
			}
			if(this.oldPassworl === this.newPassworl){
				uni.showToast({
						title: '新密码与旧密码一致，请重新输入',
						icon: 'none'
					});
				return false;
			}
			if (this.newPassworl != this.confirmPassworl || !this.confirmPassworl) {
				uni.showToast(
					!this.confirmPassworl ?
					{
						title: '请输入确认新密码',
						icon: 'none'
					} :
					{
						title: '新密码不一致，请重新输入',
						icon: 'none'
					}
				);
				return false;
			}
			let formData = {
				security_code: this.oldPassworl,
				password: this.newPassworl,
				password_code: this.confirmPassworl
			}
			this.$api.post(global.apiUrls.postForgetPasswordCode,formData).then(res => {
				this.$message.info(res.data.msg)
				if (res.data.code == 1) {
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}
			});
		}
    }
};
</script>

<style lang="scss">
	page{
		background: #F8F8F8;
	}
	.types{
		width: 686upx;
		position: absolute;
		bottom: 32rpx;
		height: 88upx;
		color: #FFFFFF;
		line-height: 88upx;
		background:linear-gradient(90deg,rgba(73,170,52,1) 0%,rgba(33,154,60,1) 100%);
		border-radius: 45rpx;
		opacity:1;
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
.btn_cloce{
	width: 100%;
	text-align: center;
	margin-top: 32rpx;
	position: absolute;
	bottom: 16px;
	left: 0;
}
</style>

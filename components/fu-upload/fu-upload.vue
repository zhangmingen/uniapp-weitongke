<template>
	<view class="cu-form-group">
		<view class="grid grid-square flex-sub" :class="['col-'+col]">
			<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage" :data-url="item.path">
				<image :src="item.path" mode="aspectFill"></image>
				<view class="cu-tag bg-red" v-if="!item.loading || item.loading == '100%'" @tap.stop="DelImg" :data-index="index">
					<text class='cuIcon-close'></text>
				</view>
				<view class="progress-mask flex justify-center align-center padding-lr-sm" v-else>
					<view class="cu-progress bg-mask round xs">
						<view class="bg-white" :style="{ width: item.loading}"></view>
					</view>
				</view>
				<view class="progress-mask flex justify-center align-center text-white" v-if="item.error" @tap.stop="DelImg" :data-index="index">
					<text class="cuIcon-roundclose"></text>
				</view>
			</view>
			<view class="solids" @tap="ChooseImage" v-if="imgList.length < max">
				<slot>
					<text class='cuIcon-cameraadd'></text>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
  import { UPLOAD_IMAGE_URL } from '@/common/config.js'
	export default {
		props: {
			col: {
				type: [Number, String],
				default: 4,
			},
			max: {
				type: [Number, String],
				default: 8,
			},
			defData: {
				type: Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				imgList: this.defData,
				loadUrl: UPLOAD_IMAGE_URL,
				count: 0, // 记录选择的图片张数
			};
		},
		computed: {
			previewList(){
				return  this.imgList.map(item => {
					return item.path
				})
			}
		},
		methods: {
			// 选择图片
			ChooseImage() {
				// if(this.count) return ;
				uni.chooseImage({
					count: this.max - this.imgList.length,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.count = res.tempFilePaths.length;
						const data = res.tempFilePaths.map(item => {
							let data = {
								path: item,
								loading: '0%',
								task: null,
								error: false,
								id: null,
							};
							this.uploadImage(data);
							return data;
						})
						this.imgList = this.imgList.concat(data);
					},
					fail: (error) => {
						console.log("error: " + JSON.stringify(error));
					}
				});
			},
			// 上传图片
			uploadImage(data) {
				const uploadTask = uni.uploadFile({
					url: this.loadUrl,
					filePath: data.path,
					name: 'file',
          formData: {
            'module': '',
            'dir': '',
          },
					success: (uploadFileRes) => {
						const response = JSON.parse(uploadFileRes.data);
						if(response.code == 1){
							data.end = true;
							data.task = null;
							data.url = response.data[0].path;
							data.id = response.data[0].id;
						}else{
							data.end = true;
							data.task.abort();
							data.task = null;
							data.error = true;
							uni.showToast({
								icon: 'none',
								title: response.msg
							})
						}
						this.count--;
						if(this.count === 0){
							this.handleChange();
						}
					},
					fail:(error) => {
						data.end = true;
						data.task.abort();
						data.task = null;
						data.error = true;
						uni.showToast({
							icon: 'none',
							title: '上传失败,请检查网络设置'
						})
						console.log("error: " + JSON.stringify(error));
					}
				});
				data.task = uploadTask;
				uploadTask.onProgressUpdate((res) => {
					data.loading = res.progress + '%';
				});
			},
			// 预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.previewList,
					current: e.currentTarget.dataset.url
				});
			},
			// 删除图片
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1);
			},
			// 触发change事件
			handleChange(){
				let _imgs = this.imgList.map(item => {
					if(item.error){
						return '';
					}else{
						return item.id;
					}
				})
				this.$emit('change',_imgs);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.progress-mask{
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.6);
		z-index: 10;
	}

</style>

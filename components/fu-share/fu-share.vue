<template>
	<view>
		<fu-popup v-model="sharePopup" mode="bottom" :safe-area-inset-bottom="true" :mask-close-able="false" border-radius="16">
			<view class="wrap">
				<view class="flex">
					<view class="flex-sub text-center">分享到</view>
					<view class="cuIcon-close" @tap.stop="close"></view>
				</view>
				<view class="padding-tb">
          <!-- #ifdef APP-PLUS -->
					<view class="grid col-4">
						<block v-for="(item,index) in shareList" :key="index">
							<view v-if="provider.includes(item.type)" class="height-200 flex flex-direction align-center justify-center" @tap.stop="share(item)">
								<image class="block-85" :src="item.icon" mode="aspectFill"></image>
								<text class="margin-top-xs text-sm">{{item.title}}</text>
							</view>
						</block>
					</view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="grid col-2">
            <view>
              <button class="height-200 flex flex-direction align-center justify-center cu-btn bg-white" open-type="share">
              	<image class="block-85" src="/static/share/weixin.png" mode="aspectFill"></image>
              	<text class="margin-top-xs text-sm">微信好友</text>
              </button>
            </view>
            <view>
              <button class="height-200 flex flex-direction align-center justify-center cu-btn bg-white" @tap.stop="createPoster">
              	<image class="block-85" src="/static/share/poster.png" mode="aspectFill"></image>
              	<text class="margin-top-xs text-sm">二维码海报</text>
              </button>
            </view>
          </view>
          <!-- #endif -->
				</view>
			</view>
		</fu-popup>
		<fu-popup v-model="posterPopup" mode="bottom" :safe-area-inset-bottom="true" :mask-close-able="false" border-radius="16">
			<view class="wrap">
				<view class="flex align-center justify-between">
					<view class="text-df text-333">保存到相册</view>
					<view class="cuIcon-close text-333" @click.stop="close"></view>
				</view>
				<view class="margin-top flex justify-center align-center">
					<image class="preview-image" :src="previewImageUrl" mode="aspectFill"></image>
				</view>
				<view class="margin-top" @click="saveImage">
					<button class="action2 cu-btn block round">保存图片</button>
				</view>
			</view>
		</fu-popup>
		<view class="offset-canvas">
			<canvas canvas-id="poster-canvas" style="width: 375px;height: 550px;"></canvas>
		</view>
	</view>
</template>

<script>
	const providers = [
		{
			title: '微信好友',
			icon: require('@/static/share/weixin.png'),
			type: 'weixin',
			scene: 'WXSceneSession'
		},
		{
			title: '朋友圈',
			icon: require('@/static/share/pengyouquan.png'),
			type: 'weixin',
			scene: 'WXSenceTimeline'
		},
		{
			title: 'QQ好友',
			icon: require('@/static/share/qq.png'),
			type: 'qq'
		},
		{
			title: '复制链接',
			icon: require('@/static/share/copy.png'),
			type: 'link'
		},
		{
			title: '二维码海报',
			icon: require('@/static/share/poster.png'),
			type: 'image'
		}
	];
	export default {
		data() {
			return {
				ctx: null,
				info: null,
				previewImageUrl: '',
				shareList: Object.freeze(providers),
				provider: [], // 已配置的服务供应商
        sharePopup: false,
        posterPopup: false,
			}
		},
		methods: {
			// 打开弹窗
			open() {
        this.sharePopup = true;
			},
			// 关闭弹窗
			close() {
        this.sharePopup = false;
        this.posterPopup = false;
			},
			// 初始化分享数据
			init(info) {
				this.info = info;
        this.sharePopup = false;
        this.posterPopup = true;
        this.initCanvas();
			},
			// 获取服务商列表
			getProvider() {
				uni.getProvider({
					service: "share",
					success: (data) => {
						console.log('已配置的分享服务', data);
						this.provider = [...data.provider, 'link', 'image'];
					}
				})
			},
			// 分享
			share(item) {
					let _scene = '';
					let _provider = item.type;
					let _type = 0;
					switch(_provider){
						case 'weixin':
							_scene = item.scene;
						case 'qq':
							_type = 1;
						case 'sinaweibo':
							uni.share({
								provider: _provider,
								type: _type,
								title: this.info.title,
								scene: _scene,
								summary: this.info.summary,
								href: this.info.href,
								imageUrl: this.info.thumb,
								success: (res) => {
									this.close();
								},
								fail: (err) => {
									console.log('分享失败',err);
                  this.$message.error('分享失败,请检查是否安装了相应软件');
								}
							});
						break;
						case 'link':
							uni.setClipboardData({
								data: this.info.href,
								success: () => {
                  this.$message.success('复制成功')
									this.close();
								}
							});
						break;
						case 'image':
							this.createPoster();
						break;
					}
			},
			// 生成海报
			createPoster(){
        this.$util.actionAuth(() => {
          this.$emit('getPosterInfo');
        })
			},
      // 初始化画布
      initCanvas(){
        uni.showLoading({
          title: '海报生成中...',
          mask: true,
        })
        console.log('开始绘图',this.info);
        this.ctx = uni.createCanvasContext('poster-canvas',this);
        setTimeout(() => {
          this.drawBack();
        },200)
      },
			// 绘制背景
			drawBack(){
				let ctx = this.ctx;
				ctx.setFillStyle('#FFFFFF');
				ctx.fillRect(0,0,375,550);
				ctx.draw(false,() => {
					console.log("背景绘制成功");
					this.drawUserInfo();
				});
			},
			// 绘制个人信息
			async drawUserInfo(){
				let ctx = this.ctx;
				await new Promise(resolve => {
					uni.getImageInfo({
						src: this.info.avatar,
						success: (res) => {
							console.log('头像图片',res);
							let {width,height,path} = res;
							if(width > height){
								let startX = (width - height) / 2;
								ctx.drawImage(res.path,startX,0,height,height,20,20,50,50);
							}else if(width < height){
								let startY = (height - width) / 2;
								ctx.drawImage(res.path,0,startY,width,width,20,20,50,50);
							}else{
								ctx.drawImage(res.path,20,20,50,50);
							}
							resolve();
						},
						fail: (err) => {
							uni.hideLoading();
							this.$message.info('获取头像信息失败');
							console.log("获取图片信息失败",err);
						}
					})
				});

        // this.drawText(ctx,'白茶清欢无别事,为安徽省地哈啊死活俺啥都奥OA闪动hi懊悔的哦',90,40,265,1,'#333333',18);
				ctx.setFillStyle('#333333');
				ctx.setFontSize(18);
				ctx.fillText(this.info.name,90,40);
				ctx.setFillStyle('#999999');
				ctx.setFontSize(16);
				ctx.fillText('推荐一个好物给你,请查收',90,65);
				ctx.draw(true,() => {
					console.log('个人信息绘制成功');
					this.drawGoodsImage();
				});
			},
			// 绘制商品图片
			async drawGoodsImage(){
				let ctx = this.ctx;
				await new Promise(resolve => {
					uni.getImageInfo({
						src: this.info.imageUrl,
						success: (res) => {
							console.log('商品图片',res)
							let {width,height,path} = res;
							if(width > height){
								let startX = (width - height) / 2;
								ctx.drawImage(res.path,startX,0,height,height,20,90,335,335);
							}else if(width < height){
								let startY = (height - width) / 2;
								ctx.drawImage(res.path,0,startY,width,width,20,90,335,335);
							}else{
								ctx.drawImage(res.path,20,90,335,335);
							}
							resolve();
						},
						fail: (err) => {
							uni.hideLoading();
							console.log("商品图片绘制失败",err)
							this.$message.info('获取商品图片信息失败');
						}
					})
				});
				ctx.draw(true,() => {
					console.log("商品图片绘制成功");
					this.drawGoodsInfo();
				});
			},
			// 绘制商品名称价格
			drawGoodsInfo(){
				let ctx = this.ctx;
				ctx.setFillStyle('#333333');
				ctx.setFontSize(18);
				ctx.fillText(this.info.title.substr(0,20)+'...',20,455);
				ctx.setFontSize(14);
				ctx.setFillStyle('#d55034');
				ctx.fillText('￥'+this.info.price,20,485);
				ctx.draw(true,() => {
					console.log("商品信息绘制成功");
					// this.drawCode();
          this.exportImage();
				});
			},
			// 绘制二维码
			async drawCode(){
				let ctx = this.ctx;
				await new Promise(resolve => {
					uni.getImageInfo({
						src: this.info.code,
						success: (res) => {
							console.log('二维码信息',res);
							let {width,height,path} = res;
							if(width > height){
								let startX = (width - height) / 2;
								ctx.drawImage(res.path,startX,0,height,height,275,445,80,80);
							}else if(width < height){
								let startY = (height - width) / 2;
								ctx.drawImage(res.path,0,startY,width,width,275,445,80,80);
							}else{
								ctx.drawImage(res.path,275,445,80,80);
							}
							resolve();
						},
						fail: (err) => {
							console.log('二维码绘制失败',err);
							uni.hideLoading();
							this.$message.info('获取二维码信息失败');
						}
					})
				});
				ctx.draw(true,() => {
					console.log("二维码绘制成功");
					this.exportImage();
				})
			},
			// 导出图片
			exportImage(){
				uni.canvasToTempFilePath({
					canvasId: 'poster-canvas',
					success: (res) => {
						uni.hideLoading();
						console.log('导出图片成功',res);
						this.previewImageUrl = res.tempFilePath;
					},
					fail: (err) => {
						uni.hideLoading();
						console.log("导出图片失败",err);
					}
				},this);
			},
			// 保存图片
			saveImage(){
				uni.saveImageToPhotosAlbum({
					filePath: this.previewImageUrl,
					success: (res) => {
						console.log(res);
						this.$message.info('保存成功');
						this.close();
					}
				})
			},
      /**
       * @description 绘制图片通用方法
       * @param {Object} ctx - canvas上下文
       * @param {String} 图片路径 - canvas上下文
       * */
      async drawImage(ctx,path,){


      },
      /**
       * @description 绘制文本通用方法
       * @param {Object} ctx - canvas上下文
       * @param {String} text - 文本
       * @param {Number} startX - X轴开始位置
       * @param {Number} startY - Y轴开始位置
       * @param {Number} limitWidth - 文字绘制区限制宽度
       * @param {Number} limitLine - 文字绘制限制行数
       * @param {String} color - 文字颜色
       * @param {Number} size - 字体大小
       * */
      drawText(ctx,text,startX,startY,limitWidth,limitLine,color,size){
        let metrics = ctx.measureText(text);
        const {width} = metrics;
        console.log(metrics);

      },
		},
		created() {
      console.log('组件 created');
			this.getProvider();
		},
    mounted() {
      console.log('组件 mounted');
    }
	}
</script>

<style lang="scss" scoped>
	.wrap{
		padding: 30rpx;
	}
	.block-85 {
		width: 85rpx;
		height: 85rpx;
	}

	.height-200 {
		height: 200rpx;
	}
	.action2{
		height: 80rpx;
		background-color: #f02523;
		font-size: 32rpx;
		color: #FFFFFF;
	}
	.preview-image{
		width: 375rpx;
		height: 550rpx;
    border-radius: 8rpx;
		box-shadow: 0 0 10rpx rgba(0,0,0,.2);
	}
	.offset-canvas{
		position: fixed;
		top: -1000px;
		left: 0;
		z-index: 9999;
	}
</style>

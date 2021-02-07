<template>
	<view class="ss-modal-body" :class="{'ss-modal-active' : animation, 'ss-modal-H5Top': _H5Top, 'ss-modal-H5Bottom': _H5Bottom}" :data-platform="platform">
		<view class="ss-modal" :class="'ss-modal-' + position +' ' + 'ss-modal-' + mode">
			<slot></slot>
		</view>
		<view v-if="_mask" class="uni-mask" @touchmove.stop.prevent="moveHandle" catchtouchmove="true" @click.stop="hide()"></view>
	</view>
</template>

<script>
	const systemInfo = uni.getSystemInfoSync();
	export default {
		data () {
			return {
				animation: false,
				platform: systemInfo.platform
			}
		},
		props: {
			/*
			* 参数说明（定位）
			*/
			position: {//可能值  top  left  right bottom middle
				type: String,
				default: 'middle'
			},
			/*
			* 参数说明
			* full 宽度100%
			* insert 80%宽度内联小框
			* cover 宽度高度100%
			*/
			mode: {
				type: String,
				default: 'full'
			},
			mask: {
				type: [Boolean, String],
				default: true
			},
			/*
			* H5置顶
			*/
			H5Top: {
				type: [Boolean, String],
				default: true
			},
			/*
			* H5置底
			*/
			H5Bottom: {
				type: [Boolean, String],
				default: true
			},
		},
		computed: {
			_mask() {
				return String(this.mask) === 'false' ? false : true;
			},
			_H5Top() {
				return String(this.H5Top) === 'false' ? false : true;
			},
			_H5Bottom() {
				return String(this.H5Bottom) === 'false' ? false : true;
			}
		},
		watch: {
			animation(val) {
				this.$emit('change', val);
			}
		},
		methods: {
			moveHandle() {
				return ;
			},
			show () {
				this.animation = true;
				return true;
			},
			hide () {
				this.animation = false;
				return false;
			},
			toggle () {
				return !this.animation ? this.show() : this.hide()
			}
		}
	}
</script>

<style lang="scss">
	// 弹窗公用样式
	.ss-modal-body{
		box-sizing: border-box;
		opacity: 0;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		transform: translateX(0);
		transition: all .2s linear;
		z-index: 98;
		&.ss-modal-active{
			pointer-events: auto;
			opacity: 1;
		}
	}
	
	/* #ifdef H5 */
		.ss-modal-body.ss-modal-H5Top{
			top: 0;
			z-index: 999;
		}
		.ss-modal-body.ss-modal-H5Bottom{
			bottom: 0;
			z-index: 999;
		}
	/* #endif */
	
	.ss-modal-body .uni-mask{
		z-index: 1;
	}
	.ss-modal{
		position: fixed;
		z-index: 2;
		transition: inherit;
		/deep/ .gmy-float-touch{
			display: none;
		}
	}
	.ss-modal-middle{
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.ss-modal-cover{
		width: 100%;
		// width: 100vw;
		width: calc(100% + 3px);
		// width: calc(100vw + 2px);//清除translate带来了计算误差
		height: 100%;
		// height: 100vw;
		height: calc(100% + 3px);
		// height: calc(100vh + 2px);//清除translate带来了计算误差
		left: 0;
		top: 0;
		transform: translate(100%, 0);
	}
	.ss-modal-top{
		left: 50%;
		z-index: 98;
		width: 100%;
		height: auto;
		transform: translate(-50%, -100%);
		& + .uni-mask{
			z-index: 97;
		}
	}
	.ss-modal-full{
		width: 100%;
		width: calc(100% + 3px);//清除translate带来了计算误差
		left: 0;
		transform: translate(0, -100%);
	}
	.ss-modal-full.ss-modal-top{
		transform: translate(0, -200%);
	}
	.ss-modal-full.ss-modal-bottom{
		transform: translate(0, 100%);
		transition: inherit;
	}
	.ss-modal-right{
		right: 0;
		max-width: 80%;
	}
	.ss-modal-left{
		left: 0;
		max-width: 80%;
	}
	.ss-modal-middle.ss-modal-insert {
		min-width: 380rpx;
		min-height: 380rpx;
		max-width: 102%;
		max-height: 80%;
		transform: translate(-50%, -50%);
		background: none;
		box-shadow: none;
	}
	.ss-modal-body{
		opacity: 0;
		pointer-events: none;
	}
	.ss-modal-active{
		opacity: 1;
		pointer-events: auto;
		.ss-modal-top{
			top: 44px;
			transform: translate(-50%, 0);
		}
		.ss-modal-full{
			transform: translate(0, -50%);
		}
		.ss-modal-full.ss-modal-top{
			transform: translate(0, 0);
		}
		.ss-modal-bottom{
			transform: translate(0, 0);
		}
		.ss-modal-cover{
			transform: translate(0, 0);
		}
	}
	.ss-modal-bottom{
		bottom: 0;
	}
</style>

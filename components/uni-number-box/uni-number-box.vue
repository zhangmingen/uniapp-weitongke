<template>
	<view class="uni-numbox">
		<view :class="{'uni-numbox--disabled': inputValue <= min || disabled}" class="uni-numbox__minus" @click.stop="_calcValue('minus')">－</view>
		<input :disabled="disabled" class="uni-numbox__value" type="number" @blur="_onBlur" v-model="inputValue">
		<view :class="{'uni-numbox--disabled': inputValue >= max || disabled}" class="uni-numbox__plus" @click.stop="_calcValue('plus')">＋</view>
	</view>
</template>
<script>
	export default {
		name: 'UniNumberBox',
		props: {
			value: {
				type: [Number, String],
				default: 1
			},
			min: {
				type: Number,
				default: 1
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: 0,
                timer: null,
			}
		},
		watch: {
			value(val) {
				this.inputValue = +val;
			},
            inputValue(newVal,oldVal){
                if(+newVal != +oldVal){
                    if(this.timer) clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
						if(newVal){
							this.$emit('change',newVal);
						}
                    },300)
                }
            }
		},
		created() {
			this.inputValue = +this.value;
		},
		methods: {
			_calcValue(type) {
				if (type === 'minus' && !this.disabled && this.value==1) return this.$message.info('不能再少了呦~');
				if (this.disabled) return ;
				const scale = this._getDecimalScale()
				let value = this.inputValue * scale
				let step = this.step * scale
				if (type === 'minus') {
					value -= step;
                    if(value < (this.min * scale)) return ;
                    if(value > (this.max * scale)) {
                        value = this.max * scale;
                    };
				} else if (type === 'plus') {
					value += step
                    if(value > (this.max * scale)) return ;
                    if(value < (this.min * scale)) {
                        value = this.min * scale;
                    };
				}
				this.inputValue = String(value / scale);
			},
			_getDecimalScale() {
				let scale = 1
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length)
				}
				return scale
			},
			_onBlur(event) {
				let value = event.detail.value
				if (!value) {
					this.inputValue = this.min;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
	.uni-numbox {
		display: inline-flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 46upx;
		position: relative
	}
	.uni-numbox__minus,
	.uni-numbox__plus {
		margin: 0;
		width: 46upx;
		font-size: 32upx;
		height: 100%;
		line-height: 46upx;
		text-align: center;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #333;
		position: relative;
		font-weight: bold;
	}

	.uni-numbox__value {
		position: relative;
		background-color: #f9f9f9;
		width: 100upx;
		height: 100%;
		text-align: center;
		padding: 0;
		border-radius: 8rpx;
	}
	.uni-numbox--disabled {
		color: silver;
		/* background: #f9f9f9; */
	}
</style>

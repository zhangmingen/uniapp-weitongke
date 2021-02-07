<template>
  <view>
    <sanshuiModal ref="ssModal" :mode="_parentMode" :position="_parentPosition" @change="changeModal">
      <view class="digital-keyboard-modal" :class="'digital-keyboard-modal-' + _mode">
        <view class="dk-close" v-if="_mode !== 1 && _mode !== 4 && showClose" @click="close()">
          <icon type="clear" color="#333" :size="u50"></icon>
        </view>
        <swiper class="dk-swiper" :current="current">
          <swiper-item @touchmove.prevent.stop>
            <view class="dk-title">{{_titleObj.title}}</view>
            <view class="dk-subtitle">{{_titleObj.subTitle}}</view>
            <view class="pwd-box clearfix" @click="getKeyboard">
              <view class="pwd-text" v-for="(item,index) in _digits" :key="index" :data-index="index" :class="{active:(activeInput == index)}">{{payPassWord[index]}}</view>
            </view>
          </swiper-item>
          <!-- 设置新支付密码 -->
          <block v-if="_mode === 2 || _mode === 5">
            <swiper-item @touchmove.prevent.stop>
              <view class="dk-title">{{_titleObj.title}}</view>
              <view class="dk-subtitle">{{_titleObj.twoSubTitle}}</view>
              <view class="pwd-box clearfix" @click="getKeyboard">
                <view class="pwd-text" v-for="(item,index) in _digits" :key="index" :data-index="index" :class="{active:(activeInput==index)}">{{payPassWord[index]}}</view>
              </view>
            </swiper-item>
          </block>
          <!-- 修改支付密码 -->
          <block v-else-if="_mode === 3">
            <swiper-item @touchmove.prevent.stop>
              <view class="dk-title">{{_titleObj.twoTitle}}</view>
              <view class="dk-subtitle">{{_titleObj.twoSubTitle}}</view>
              <view class="pwd-box clearfix" @click="getKeyboard">
                <view class="pwd-text" v-for="(item,index) in _digits" :key="index" :data-index="index" :class="{active:(activeInput==index)}">{{payPassWord[index]}}</view>
              </view>
            </swiper-item>
            <swiper-item @touchmove.prevent.stop>
              <view class="dk-title">{{_titleObj.threeTitle}}</view>
              <view class="dk-subtitle">{{_titleObj.threeSubTitle}}</view>
              <view class="pwd-box clearfix" @click="getKeyboard">
                <view class="pwd-text" v-for="(item,index) in _digits" :key="index" :data-index="index" :class="{active:(activeInput==index)}">{{payPassWord[index]}}</view>
              </view>
            </swiper-item>
          </block>
        </swiper>
        <block v-if="_mode !== 1 && _mode !== 4">
          <view class="pwd-tips">支付密码为6位数字，用于提现、设置密保、添加银行卡等操作，可保障资金安全</view>
          <view class="pwd-tips pwd-tips-errot">{{msgText}}</view>
        </block>
        <view class="pwd-forget">
          <text v-if="_forget && _mode === 1" @click="forgetPwd">忘记支付密码</text>
        </view>
        <view class="digital-keyboard" :class="{'digital-keyboard-show' : dkFlag || _mode === 1 || _mode === 4}">
          <view class="dk-down" v-if="_mode !== 1 && _mode !== 4">
            <block v-if="showPrevText">
              <view class="dk-submit dk-return" @click="changeSwiper(-1)">上一步</view>
            </block>
            <svg class="icon icon-down" aria-hidden="true" @click="getKeyboard">
              <use xlink:href="#icon-down"></use>
            </svg>
            <block v-if="trigger === 'auto'">
              <view class="dk-submit" @click="submit(true)">完成</view>
            </block>
          </view>
          <view class="digital-key-box clearfix">
            <view class="num" v-for="item in digitalList" :key="item" :class="{'no-num':(item === '' || item === '-1')}"
              @click="getKeyNumber(item)">{{item}}</view>
          </view>
        </view>
      </view>
    </sanshuiModal>
  </view>
</template>

<script>
  /* 密码弹窗插件，请移步：https://ext.dcloud.net.cn/plugin?id=555 */
  /* mode 的可选值
    1 支付密码校验（用于校验安全）
    2 设置支付密码（2步  输入=》确认输入）
    3 修改支付密码（3步 原支付密码=》输入=》确认输入）
    4 找回登录密码（同mode = 1一样，就怕后端校验接口不一样而额外添加的一个mode）
    5 重置支付密码（同mode = 2一样，2步  输入=》确认输入） 
   */
  //依赖的弹窗模块
  import sanshuiModal from '@/components/fu-payment-password/sanshui-modal/index.vue'
  export default {
    components: {
      sanshuiModal
    },
    data() {
      return {
        activeInput: 0, //当前输入的下标
        digitalList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '-1'], //键盘
        paymentPwd: '', //支付密码内容
        dkFlag: true, //支付密码键盘的显示与隐藏
        current: 0,
        paymentPwds: [], //上一次支付密码内容,历史支付密码,
        msgText: '',
        u50: uni.upx2px(50)
      };
    },
    props: {
			showClose: {	//是否显示关闭按钮
				type: Boolean,
				default: true
			},
      value: {
        type: String,
        default: ''
      },
      digits: {
        type: [Number, String],
        default: 6
      },
      forget: {
        type: Boolean,
        default: true
      },
      /*
       *	可选值说明（这一个顺序最好不要改，跟当前步骤步进行有关系，自动提交要用到mode跟current的判断  是否要自动提交）
       *	1 支付密码校验（用于校验安全）
       *	2 设置支付密码（2步  输入=》确认输入）
       *	3 修改支付密码（3步 原支付密码=》输入=》确认输入）
       *	4 找回登录密码(同mode = 1一样，就怕后端校验接口不一样而额外添加的一个mode)
       *	5 重置支付密码
       */
      mode: {
        type: [Number, String],
        default: 1
      },
      /*
       *	可选值说明
       *	hand 手动
       *	auto 自动
       */
      trigger: {
        type: String,
        default: 'auto'
      },
      userName: {
        type: String,
        default: ''
      }
    },
    computed: {
      payPassWord() {
        var payPassWord = this.paymentPwd.split('') || [];
        payPassWord.fill('*');
        return payPassWord;
      },
      _forget() {
        return String(this.forget) === 'false' ? false : true;
      },
      _digits() {
        return isNaN(this.digits) ? 6 : parseInt(this.digits);
      },
      _mode() {
        if (isNaN(this.mode) || !this.mode) {
          return 1;
        }
        return +this.mode
      },
      _titleObj() {
        let arr = [{
            title: '输入支付密码',
            subTitle: '请输入支付密码'
          },
          {
            title: '设置支付密码',
            subTitle: '请设置支付密码',
            twoSubTitle: '请再次输入支付密码以确认'
          },
          {
            title: '修改支付密码',
            twoTitle: '设置支付密码',
            threeTitle: '设置支付密码',
            subTitle: '请输入支付密码 以验证身份',
            twoSubTitle: '请设置新的支付密码',
            threeSubTitle: '请再次输入支付密码以确认',
          },
          {
            title: '输入支付密码',
            subTitle: '请输入支付密码'
          },
          {
            title: '重置支付密码',
            subTitle: '请输入支付密码',
            twoSubTitle: '请再次输入支付密码以确认'
          }
        ]
        return arr[this._mode - 1];
      },
      _parentMode() {
        return this._mode === 1 || this._mode === 4 ? 'full' : 'cover';
      },
      _parentPosition() {
        return this._mode === 1 || this._mode === 4 ? 'bottom' : 'middle';
      },
      showPrevText() {
        return this.current >= (this._mode - 1) || (this._mode === 5 && this.current > 0) ? true : false;
      }
    },
    methods: {
      // 模态框显示或者关闭的回调
      changeModal(e) { // 返回是一个Boolean值
        if (e) {
          this.current = 0;
          this.dkFlag = true; //默认拉起键盘
        } else {
          this.dkFlag = false; //默认收起键盘
          this.clearAll();
        }
      },
      /*
      	pro可选址
      	show	显示
      	hide	隐藏
      	toggle	动态判断
      */
      modalFun(pro) {
        this.$refs.ssModal[pro]();
      },
      clear() {
        this.paymentPwd = '';
        this.activeInput = 0;
        this.paymentPwds.splice(this.current, 1);
      },
      clearAll() {
        this.paymentPwd = '';
        this.activeInput = 0;
        this.current = 0;
        this.paymentPwds = [];
      },
      showError(msg) {
        if (!msg) return this.msgText = '';
        if (this._mode !== 1 && this._mode !== 4) {
          this.msgText = msg;
        } else {
          uni.showToast({
            title: msg
          })
        }
      },
      forgetPwd() {
        console.log('这里是忘记密码跳转逻辑');
      },
      cancel() {
        this.$emit('cancel');
      },
      close() {
        let tips = '';
        if (this._mode === 2) {
          tips = '您是否要放弃设置支付密码';
        } else if (this._mode === 5) {
          tips = '您是否要放弃重置支付密码';
        } else {
          tips = '您是否要放弃修改支付密码';
        }
        uni.showModal({
          title: '关闭提示',
          content: tips,
          confirmText: '我再想想',
          cancelText: '关闭',
          success: (res) => {
            if (!res.confirm) {
              this.modalFun('hide');
							this.cancel();
            }
          }
        })
      },
      submit(clickFlag) { //clickFlag主动点击
        if (this.trigger !== 'auto' && !clickFlag) return;
        if (this.paymentPwd.length !== this._digits) {
          this.showError('请输入' + this._digits + '位支付密码');
        } else {
          this.showError('');
          if (this._mode === 5 || this._mode === 4 || this.current >= (this._mode - 1)) {
            if (this._mode === 5 && this.current === 0) { //下一步，再次输入
              return this.changeSwiper(1);
            }
            if (this.current > 0) { //需要校验2次支付密码的是否相等
			 console.log( this.paymentPwd,this.paymentPwds[this.current - 1] );
              if (this.paymentPwd !== this.paymentPwds[this.current - 1]) {
                this.showError('两次支付密码输入不一致');
                this.paymentPwd = '';
                this.paymentPwds[this.current] = '';
				this.clear();
                return;
              }
              this.showError('');
              if (this._mode === 2) { //设置支付密码
                uni.showLoading({
                  title: '正在设置密码'
                });
                // 如果不把逻辑卸载这里面，直接把setTimeout删除即可
                // uni.hideLoading();
                this.$emit('submit', { //这里是传出去给调用者的，参数任意下，只要能区分就行
                  type: 'reset',
                  value: this.paymentPwd
                });
                // this.modalFun('hide');
              } else { //修改支付密码
                uni.showLoading({
                  title: '正在重置密码'
                });
                // 如果不把逻辑卸载这里面，直接把setTimeout删除即可
                this.$emit('submit', {
                  type: 'modify',
                  value: this.paymentPwd
                });
                // this.modalFun('hide');
              }
              return;
            }
            this.checkSafePwd('check');
          } else {
            if (this._mode === 3 && this.current === 0) { //校验支付密码正确性
              this.checkSafePwd('verify');
              return;
            }
            this.changeSwiper(1);
          }
        }
      },
      checkSafePwd(type) {
        // uni.showLoading({
        //   title: '校验支付密码中'
        // });
        console.log(type);
        if (type == 'verify') { //输出验证
          this.$emit('submit', { //设置或者重置新支付密码
            type: 'verify',
            value: this.paymentPwd
          });
          this.changeSwiper(1); //执行下一步
          return;
        }
        if (type === 'check') {
          this.$emit('submit', { //设置或者重置新支付密码
            type: 'check',
            value: this.paymentPwd
          });
          this.modalFun('hide');
        } else {
          this.changeSwiper(1); //执行下一步
        }

        // setTimeout(() => {//模拟请求，把这个换成ajax请求哈，或者emit出去 外面去请求，但是建议都集成在这边 省的写一堆重置代码
        // 	uni.hideLoading();
        // 	let response = {//模拟返回
        // 		code: 1,
        // 		msg: '密码正确'
        // 	}
        // 	if(response.code === 1){
        // 		if(type === 'check'){
        // 			this.$emit('submit', {//设置或者重置新支付密码
        // 				type: 'check',
        // 				value: this.paymentPwd
        // 			});
        // 			this.modalFun('hide');
        // 		}else{
        // 			this.changeSwiper(1);//执行下一步
        // 		}
        // 	}else{
        // 		this.clear();
        // 		if(type !== 'check'){
        // 			this.showError(response.msg);
        // 		}
        // 	}
        // }, 1000)
      },
      changeSwiper(num) {
        if (isNaN(num)) {
          num = 1;
        }
        this.current += num;
        this.paymentPwd = this.paymentPwds[this.current] || '';
		if(this.paymentPwd.length == 0){ 
			this.activeInput = 0;
		}else { 
			this.activeInput = this.paymentPwd.length - 1; 
		}
      },
      getKeyNumber(val) {
        let paymentPwdArr = this.paymentPwd.split('');
        if (val === '' || (val != -1 && paymentPwdArr.length === this._digits)) { //空或者已经达到最大值
          if (paymentPwdArr.length === this._digits && this.trigger === 'auto') {
            this.submit();
            return;
          }
          return false;
        } else if (val != -1) { //数字输入
          paymentPwdArr.splice(this.activeInput, 0, val);
          this.activeInput++;
          this.paymentPwd = paymentPwdArr.join('');
          this.paymentPwds[this.current] = this.paymentPwd;
          if (paymentPwdArr.length === this._digits && this.trigger === 'auto') {
            this.submit();
            return;
          }
        } else { //删除
          if (this.activeInput >= 0) {
            this.activeInput !== 0 && this.activeInput--;
            paymentPwdArr.splice(this.activeInput - 1, 1);
            this.paymentPwd = paymentPwdArr.join('');
            this.paymentPwds[this.current] = this.paymentPwd;
          }
        }
      },
      getKeyboard(e) {
        let index = e && e.target.dataset.index;
        if (index === undefined) {
          this.activeInput = -1;
          this.dkFlag = false
          return;
        }
        var _length = this.paymentPwd.length;
        this.activeInput = index <= _length ? index : _length;
        this.dkFlag = true;
      }
    }
  }
</script>

<style lang="scss">
  .digital-keyboard-modal {
    height: 100%;
    background-color: #fff;

    &.digital-keyboard-modal-1,
    &.digital-keyboard-modal-4 {
      height: auto;
      border-radius: 20px 20px 0px 0px;
      background: #fff url(data:image/png;base64,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) center top / 100% auto no-repeat;
      padding-padding: 0;
      padding-padding: constant(safe-area-inset-top);
      padding-padding: env(safe-area-inset-top);
    }

    &.digital-keyboard-modal-2,
    &.digital-keyboard-modal-5,
    &.digital-keyboard-modal-3 {
      padding-top: calc( var(--status-bar-height) + 180rpx );

      .dk-title {
        color: #000;
      }

      .digital-keyboard {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        position: fixed;
        left: 0;
        bottom: 0;
      }
    }

    .dk-title {
      font-size: 36rpx;
      font-weight: 800;
      color: #fff;
      line-height: 90rpx;
      text-align: center;
    }

    .dk-swiper {
      height: 260rpx;
    }

    .dk-submit {
      position: absolute;
      right: 0;
      top: 0;
      padding: 0 20rpx;
      color: #38f;
      font-size: 28rpx;
      line-height: 70rpx;
    }

    .dk-return {
      right: auto;
      left: 0;
    }


    .dk-close {
      position: fixed;
      left: 30rpx;
      top: calc( var(--status-bar-height) + 30rpx );
    }

    .dk-subtitle {
      font-size: 24rpx;
      color: rgba(152, 152, 148, 1);
      line-height: 3;
      text-align: center;
    }

    .dk-down {
      text-align: center;
      line-height: 70rpx;
      box-shadow: 0 0 0 2rpx #eee;

      .icon {
        width: 40rpx;
        height: 40rpx;
      }
    }

    .pwd-tips {
      color: #666;
      font-size: 24rpx;
      line-height: 1.5;
      padding: 15rpx 100rpx;
    }

    .pwd-tips-errot {
      color: #ff4242;
      font-size: 30rpx;
      text-align: center;
    }

    .pwd-forget {
      font-size: 24rpx;
      color: #26C6B3;
      padding: 20rpx 0 30rpx;
      text-align: center;
      line-height: 33rpx;
    }

    .digital-keyboard {
      box-shadow: 0 -1rpx 0 3rpx #eee;
      width: 100%;
      transition: all .2s linear;
      transform: translateY(100%);
    }

    /* 键盘 */
    .digital-key-box {
      box-shadow: 0 0 0 2rpx #eee;
      position: relative;
      overflow: hidden;
      width: 100%;
    }

    .digital-keyboard-show {
      transform: translateY(0);
    }

    .num {
      transition: all .2s linear;
      float: left;
      background-color: #fff;
      box-shadow: 0 0 0 2rpx #eee;
      width: 33.33333333%;
      cursor: pointer;
      height: 100rpx;
      text-align: center;
      color: #333;
      line-height: 100rpx;
      font-size: 55rpx;
      font-weight: bold;
      position: relative;
      overflow: hidden;

      &:after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        //设置径向渐变
        background-image: radial-gradient(circle, rgba(0, 0, 0, .65) 20%, transparent 20%);
        background-repeat: no-repeat;
        background-position: 50%;
        transform: scale(5);
        opacity: 0;
        transition: transform .2s ease-in-out, opacity .3s ease-in-out;
      }

      &:active:after {
        transform: scale(0);
        opacity: .5;
        //设置初始状态
        transition: 0s;
      }
    }

    .num:nth-of-type(3n+1) {
      border-bottom: 0;
      border-left: 0;
    }

    .num:nth-of-type(3n+2) {
      border-bottom: 0;
      border-left: 0;
      border-right: 0;
    }

    .num.no-num {
      background-color: #f2f2f2;
      font-size: 0;
    }


    .num:last-child {
      background: #f2f2f2 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAilBMVEUAAADLy8vLy8vLy8vMzMzMzMzY2NjMzMzMzMzQ0NDOzs7MzMzMzMzNzc3Pz8/T09PMzMzNzc3Nzc3Nzc3Ly8vMzMzMzMzMzMzOzs7MzMzNzc3MzMzOzs7Ozs7Q0NDMzMzMzMzMzMzOzs7Ozs7Ly8vMzMzMzMzMzMzMzMzOzs7MzMzMzMzMzMzMzMzKmFAsAAAALXRSTlMAQICZ9vAD+uoMG+eyRCsHwV5RJfvhjEw2yGdWMiEX7NWjOhL83JKGeinNu3IVbGIkAAADJklEQVR42u2Z2XLiQAxFBY3xBhgw+2IWkxAg+v/fm6lJKgGBkbrHKl76PFJQOm7crWsZPB6Px+PxeDwej0dGsm/UzB7kZJMIFYiOCYhYz1GJcCCqP0Y9hsCSp6jIJgaGXoSqLLn6G9TlCE9ZbVAZA8+YBcigK7BvIYOuQIOpry3QDZFBV2DK1NcWmI6QQVdgyNTXFlgekEFXYCD8cTeG4Rafcl7GUDQjO4EFSggG399+tlsn7a+OVqlp3OuffvbrqLo+fBPP5QKfKKJxdcdgBR9XmS6UCnygiIhfs8NNq+0IBSYoFGDv2tEUrtnJBCYoZUYMuLR1Fgm8o5gOs3NJ3pyiRMCgBQ1ydoY3eZdcfy+QCOzQhqBHumcLf2gRu3WEvEB7h3ZEOclvwY/bDG4oxsgLtDtoS0rW4JQ+/jx5Q0aA1BcTrEilf1c6Tu68GAH7+pVrvUXcFnf/DC+QXdCNVhduiPv9WJAsqUDWR1dGZL9lmV2yNF/a6M7h98RxSZbmt1U6s4BKlshhnOvTruuYbIzN+cvkDqdkYaCoI/++wwOOKBJYYB3s4A6DMoEd1mPQBqfObuCCtdBpu402DPTrWgBKHskEOlgDxnm8ZuBdYxP8tmFeoIuodhCVc8na8ZruzSC7CAQaITLwDZkiz3mG6ZjWkaTs2T1pmf+cRqUnEoneaEyDZcgKuM/j0vz+vm/NgOZ1RsDdYLymO//hXbEPWAGYuRikyePBejglBqeIEXCbyganqsH6iBr0AkbAZS5N/+vVpjqqQvfACDhM5pfP4v9hKExHxvndRIfGf+Z87PMCkNsYJOThnAvLe0bA9v3QnAx22R6Vixr5WmzQvznsRnxYHjAC1u/o8qvrF+SEMmUErA3m5c3jF2dgxFkqkRpEs6+G28QnXArmGcFUBimeVjOG9p4JPZtjDpBNrNJk8Ya1so1s42yxRU14ASgZA2UB3kBfAMozMigLQMwYKAswgxt9AWZ0pS/ADO8UBF5mYMDNQF9APMLVGbCRIb4iC3itQZjAaw2OAC81OGcgMZigEiYGGeWwqcDnCjwej8fj8Xg8Ho/nL38AXRgT/6dxCesAAAAASUVORK5CYII=) center center / auto 50rpx no-repeat;
    }

    .pwd-box {
      padding-left: 10rpx;
      position: relative;
      text-align: center;
    }

    .pwd-text {
      position: relative;
      line-height: 110rpx;
      vertical-align: middle;
      text-align: center;
      font-size: 50rpx;
      font-weight: bold;
      width: 92rpx;
      height: 92rpx;
      margin-right: 10rpx;
      display: inline-block;
      box-shadow: 0 0 0 2rpx #ccc;
      overflow: hidden;
    }

    .pwd-text.active:after {
      -webkit-animation: twinkle 1s infinite;
      animation: twinkle 1s infinite;
      height: 70%;
      width: 4rpx;
      content: '';
      position: absolute;
      top: 15%;
      left: 50%;
      margin-left: -2rpx;
      background-color: #4fa5e1;
    }

    @keyframes twinkle {
      from {
        background-color: #4fa5e1;
      }

      to {
        background-color: transparent;
      }
    }
  }
</style>

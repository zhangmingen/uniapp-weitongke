---
title: fu-notwork 断网检测
sidebarDepth: 0
meta:
  - http-equiv: Pragma
    content: no-cache
  - http-equiv: Cache-Control
    content: no-cache
  - http-equiv: Expires
    content: 0
  - name: description
    content: fu-notwork 断网检测
  - name: keywords
    content: fu-notwork 断网检测 | 断网检测组件 | uniapp 断网检测
---

# fu-notwork 断网检测


## 平台差异

|  App   | H5  |  微信小程序   | 支付宝小程序  |  百度小程序   | 头条小程序  | 头条小程序  |
|  :----:  | :----:  |  :----:  | :----:  |  :----:  | :----: | :----:  |
|    √   | √     | √      | √     | √      | √     |  √   |

## 基本使用
```vue
<template>
  <view>
    <view class="fu-text">
      这里是页面正式内容
    </view>
    <fu-network></fu-network>
  </view>
</template>
```

## API

### Props
|  参数   | 说明  |  类型   | 默认值  |
|  :----  | :----  |  :----:  | :----:  |
|    mode   | 组件模式    | String     | full：全屏显示 |
|    tips   | 没有网络时的提示语    | String      |   哎呀，网络信号丢失   |
|    zIndex | `mode=full`时组件的定位层级   | String、Number    | 100  |
|    image   | 无网络的图片提示，可用的src地址或base64图片     | String      | -     |

### mode

|参数值|说明|
|----|----|
| full   |  全屏模式  |
|  tips  |   占位模式 |
|  toast  |   提示框模式 |
|  modal  |   弹框模式 |

### Events

|事件名|说明|回调参数|
|----|----|----|
| retry |  由断网状态到有网络状态触发 | {msg:'网络链接成功',networkType:'当前网络类型'} |










<div class="demo-model">
  <div class="model-content">
    <iframe :src="TEMPLETE_BASE_URL + '/fu-components/pages/notwork/index'" class="iframe"></iframe>
  </div>
</div>

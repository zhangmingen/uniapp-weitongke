var faceRecognition = uni.requireNativePlugin('BenBen-FaceRecognition');
faceRecognition.show({"command":"renzheng","certName":"张三","certNo":"xxxxxx"}, function (result) {
        uni.showToast({
            title:result
        })
    });
//初始化接口
{"command":"init"}
//初始化返回数据
{"type":"init","metaInfos":"xxxxx"}
//认证接口
{"command":"renzheng","zimId":"xxxxxxx"}
//返回结果
{"type":"result","info":"xxxx"}


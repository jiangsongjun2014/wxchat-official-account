module.exports = message => {
	var option = {
		toUserName: message.FromUserName,
		fromUserName: message.ToUserName,
		createTime: Date.now(),
		msgType: message.MsgType,
		content: "你好"
	}
	
	if (message.MsgType == 'text') {
		if (message.Content == 1) {
			option['content'] = "哈哈哈哈哈哈哈"
		} else if (message.Content == 2) {
			option['content'] = "啊啊啊啊啊啊啊"
		} else if (message.Content.includes("3")) {
			option['content'] = "嗯嗯嗯嗯嗯嗯"
		}
	} else if (message.MsgType == 'image') {
		option['mediaId'] = message.MediaId
	} else if (message.MsgType == 'voice') {
		option['mediaId'] = message.MediaId
	} else if (message.MsgType == 'video') {
		option['mediaId'] = message.MediaId
	} else if (message.MsgType == 'location') {
		option['msgType'] = 'text'
		option['content'] = `地理位置纬度:${message.Location_X};地理位置经度:${message.Location_Y};地理位置信息:${message.Label};`
	} else if (message.MsgType == 'event') {
		if (message.Event == 'subscribe') {
			option['msgType'] = 'text'
			option['content'] = "欢迎您的关注"
		} else if (message.Event == 'unsubscribe') {
			console.log( message.FromUserName + "取关")
		} else if (message.Event == 'CLICK') {
			option['msgType'] = 'text'
			option['content'] = "你点击了菜单" + message.EventKey
		}
	}
	
	return option
}
var sha1 = require("sha1")
var config = require("../config/config.js")
var {getUserDataAsync, parseXmlAsync, formatJsonAsync} = require("../utils/tool.js")
var messageTemplate = require('../template/messageTemplate')
var receiveTemplate = require("../template/receiveTemplate")

module.exports = () => {
	return async (req, res, next) => {
		// 获取微信发送过来的参数；在req.query获取signature，echostr，timestamp，nonce
		var {signature, echostr, timestamp, nonce} = req.query
		var {token} = config
		// 获取签名
		var sha1Str = sha1([timestamp, nonce, token].sort().join(""))
		// 处理不同的微信请求
		if(req.method == "GET") {
			// 验证服务器签名
			if (sha1Str === signature) {
				res.send(echostr)
			} else {
				res.end("error")
			}
		} else if (req.method == "POST") {
			// 验证服务器签名
			if (sha1Str !== signature) {
				res.end("error")
			}
			
			// 获取微信发送的XML数据
			const xmldata = await getUserDataAsync(req)
			
			// 解析XML数据为JSON
			const jsondata = await parseXmlAsync(xmldata)
			
			// 格式化JSON数据
			const message = await formatJsonAsync(jsondata)
			
			// 处理接收的消息
			var option = receiveTemplate(message)
			
			// 处理回复的消息
			var sendmessage = messageTemplate(option)
			
			res.send(sendmessage)
			
		} else {
			res.end("error")
		}
	}
}
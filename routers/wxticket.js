var express = require('express');
var router = express.Router();
var sha1 = require("sha1")
var wxticket = require("../wxchat/wxticket")
var {url} = require("../config/config")
var {getUserDataAsync} = require("../utils/tool")

router.post("/wxticket",  (req, res) => {
	
	// 获取加密参数
	wxticket.fecthJsapiTicket().then(data => {
		// 获取数据
		var ticket = data.ticket
		var noncestr = String(Math.random()).split(".")[1]
		var timestamp = Date.now()
		// 生成数组
		var arr = [ `noncestr=${noncestr}`, `jsapi_ticket=${ticket}`, `timestamp=${timestamp}`, `url=${url}/search`]
		// 排序拼接成字符串
		var str =arr.sort().join("&")
		// sha1加密
		var signature = sha1(str)
		// 响应数据
		res.json({
			ret: '0',
			msg: "",
			data: {
				signature: signature,
				timestamp: timestamp,
				noncestr: noncestr
			}
		})
	}).catch(err => {
		res.json({
			ret: '1',
			msg: "wxticket接口存在问题" + err,
			data: ''
		})
	})
	
})

module.exports = router;
var express = require('express');
var router = express.Router();
var {getUserDataAsync, getParamsDataAsync} = require("../utils/tool")
var wxauth = require("../wxchat/wxauth")

router.post("/wxlogin", (req, res) => {
	
	// 获取用户发送的数据
	getUserDataAsync(req).then(async data => {
		// 转换字符串数据为对象
		var codeData = await getParamsDataAsync(data)
		// 根据code获取授权的access_token
		var accessData = await wxauth.fecthCodeAccessToken(codeData.code)
		// console.log(accessData)
		// 授权获取用户信息
		var userData = await wxauth.getUserInfo(accessData)
		// 响应给前端
		res.send(userData)
	})
	
})

module.exports = router;
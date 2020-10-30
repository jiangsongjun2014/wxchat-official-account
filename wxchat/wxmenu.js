var request = require("request-promise-native")
var menuTemplate = require("../template/menuTemplate")
var {createMenuUrl, deleteMenuUrl} = require("../utils/url")
var wxchat = require("./wxchat")

class wxMenu {
	
	// 创建自定义菜单
	createMenu(menu){
		return new Promise( async (resolve, reject) => {
			var data = await wxchat.fecthAccessToken()
			var url = `${createMenuUrl}?access_token=${data.access_token}`
			var result = await request({method: "POST", url, json: true, body: menu})
			resolve(result)
		})
	}
	
	// 删除自定义菜单
	deleteMenu (){
		return new Promise (async (resolve, reject) => {
			var data = await wxchat.fecthAccessToken()
			var url = `${deleteMenuUrl}?access_token=${data.access_token}`
			var result = await request({method: "GET", url, json: true})
			resolve(result)
		})
	}
}

// // 创建自自定义菜单
// (async () => {
// 	var wx = new wxMenu()
// 	// 删除
// 	var result = await wx.deleteMenu()
// 	console.log(result)
// 	// 创建
// 	result = await wx.createMenu(menuTemplate)
// 	console.log(result)
// })()

module.exports = new wxMenu()
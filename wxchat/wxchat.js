/*
	设计思路：
	1：读取本地文件
		1：本地有文件：判断是否过期
			1：过期了，重新发送请求access_token，保存到本地文件，覆盖之前的文件
			2：没有过期，直接使用
		2：本地没有文件，发送请求获取access_token，保存到本地文件，直接使用
*/ 

var request = require("request-promise-native")
var {appID, appsecret} = require("../config/config")
var menuTemplate = require("../template/menuTemplate")
var {accessTokenUrl, jsapiTicketUrl, 
	createMenuUrl, deleteMenuUrl,
	authAccessTokenUrl, refreshAccessTokenUrl, userInfoUrl} = require("../utils/url")
var {writeFileAsync, readFileAsync} = require("../utils/tool")


// 设计一个微信操作类
class Wxchat {
	// 构造函数
	constructor() {}
	
	// 获取access_token
	getAccessToken(){
		// 获取AccessToken地址
		var url = `${accessTokenUrl}&appid=${appID}&secret=${appsecret}`
		return new Promise((resolve, reject) => {
			request({method: "GET", url, json: true}).then(res => {
				// 获取access_token和expires_in，修改expires_in过期时间
				res.expires_in = Date.now() + (res.expires_in - 300) * 100
				// 将res以成功册状态返回出去
				resolve(res)
			}).catch(err => {
				// 将err以失败的状态返回
				reject("getAccessToken这里出了问题" + err)
			})
		})
	}
	
	// 保存access_token
	saveAccessToken(accessToken) {
		// 转换AccessToken
		accessToken = JSON.stringify(accessToken)
		// 写入AccessToken文件
		return writeFileAsync(accessToken, "./accessToken.txt")
	}
	
	// 读取access_token
	readAccessToken(){
		// 读取AccessToken文件
		return readFileAsync("./accessToken.txt")
	}
	
	// 验证access_token
	isVaildAccessToken(data){
		if (!data && !data.access_token && !data.expires_in) {
			return false
		}
		// 判断获取额时间戳和现在的时间戳比较
		return data.expires_in > Date.now()
	}
	
	// 获取一个没有过期的access_token
	fecthAccessToken(){
		// 读取AccessToken
		return this.readAccessToken().then(async res => {
			// 读取成功 验证AccessToken
			if (this.isVaildAccessToken(res)) {
				// 没有过期 返回AccessToken
				return Promise.resolve(res)
			} else {
				// 已经过期 获取AccessToken
				var res = await this.getAccessToken()
				// 获取成功 保存AccessToken
				await this.saveAccessToken(res)
				// 保存成功 返回AccessToken
				return Promise.resolve(res)
			}
		}).catch(async err => {
			// 读取失败 获取AccessToken
			var res = await this.getAccessToken()
			// 获取成功 保存AccessToken
			await this.saveAccessToken(res)
			// 保存成功 返回AccessToken
			return Promise.resolve(res)
		}).then(res => {
			return Promise.resolve(res)
		})
	}
	
	// 创建菜单
	createMenu(menu){
		return new Promise( async (resolve, reject) => {
			var data = await this.fecthAccessToken()
			var url = `${createMenuUrl}?access_token=${data.access_token}`
			var result = await request({method: "POST", url, json: true, body: menu})
			resolve(result)
		})
	}
	
	// 删除菜单
	deleteMenu (){
		return new Promise (async (resolve, reject) => {
			var data = await this.fecthAccessToken()
			var url = `${deleteMenuUrl}?access_token=${data.access_token}`
			var result = await request({method: "GET", url, json: true})
			resolve(result)
		})
	}

	// 获取jsapi_ticket
	getJsapiTicket(){
		return new  Promise(async (resolve, reject) => {
			var data = await this.getAccessToken()
			var url = `${jsapiTicketUrl}?access_token=${data.access_token}&type=jsapi`
			request({method: "GET", url, json: true}).then(res => {
				res.expires_in = Date.now() + (res.expires_in - 300) * 100
				resolve({
					ticket: res.ticket,
					expires_in: res.expires_in
				})
			}).catch(err => {
				reject("getJsapiTicket这里出了问题" + err)
			})
		})
	}
	
	// 保存jsapi_ticket
	saveJsapiTicket(ticket) {
		// 转换AccessToken
		ticket = JSON.stringify(ticket)
		// 写入ticket文件
		return writeFileAsync(ticket, "./ticket.txt")
	}
	
	// 读取jsapi_ticket
	readJsapiTicket(){
		// 读取ticket文件
		return readFileAsync("./ticket.txt")
	}
	
	// 验证jsapi_ticket
	isVaildJsapiTicket(data){
		if (!data && !data.access_token && !data.expires_in) {
			return false
		}
		return data.expires_in > Date.now()
	}
	
	// 获取一个没有过期的jsapi_ticket
	fecthJsapiTicket(){
		return this.readJsapiTicket().then(async res => {
			if (this.isVaildJsapiTicket(res)) {
				return Promise.resolve(res)
			} else {
				var res = await this.getJsapiTicket()
				await this.saveJsapiTicket(res)
				return Promise.resolve(res)
			}
		}).catch(async err => {
			var res = await this.getJsapiTicket()
			await this.saveJsapiTicket(res)
			return Promise.resolve(res)
		}).then(res => {
			return Promise.resolve(res)
		})
	}
	
	// 根据code获取授权的access_token
	getCodeAccessToken(code){
		return new Promise((resolve, reject) => {
			var url = `${authAccessTokenUrl}?appid=${appID}&secret=${appsecret}&code=${code}&grant_type=authorization_code`
			request({method: "GET", url, json: true}).then(res => {
				res.expires_in = Date.now() + (res.expires_in - 300) * 100
				resolve(res)
			}).catch(err => {
				reject("getCodeAccessToken这里出了问题" + err)
			})
		})
	}
	
	// 根据refresh_token刷新授权的access_token
	refreshCodeAccessToken(refreshToken){
		return new Promise((resolve, reject) => {
			var url = `${refreshAccessTokenUrl}?appid=${appID}&grant_type=refresh_token&refresh_token=${refreshToken}`
			request({method: "GET", url, json: true}).then(res => {
				res.expires_in = Date.now() + (res.expires_in - 300) * 100
				resolve(res)
			}).catch(err => {
				reject("refreshCodeAccessToken这里出了问题" + err)
			})
		})
	}
	
	// 写入授权的access_token
	saveCodeAccessToken(codeAccessToken){
		codeAccessToken = JSON.stringify(codeAccessToken)
		return writeFileAsync(codeAccessToken, "./codeAccessToken.txt")
	}
	
	// 读取授权的access_token
	readCodeAccessToken(){
		return readFileAsync("./codeAccessToken.txt")
	}
	
	// 验证授权的access_token
	isVaildCodeAccessToken(data){
		if (!data && !data.access_token && !data.expires_in) {
			return false
		}
		return data.expires_in > Date.now()
	}
	
	// 获取一个根据没有过期的授权的access_token
	fecthCodeAccessToken(code) {
		// 读取授权的access_token
		return this.readCodeAccessToken().then(res => {
			// 文件存在 判断是否过期
			// console.log("文件存在")
			if(this.isVaildCodeAccessToken(res)) {
				console.log("文件存在,没有过期")
				// 文件没有过期 直接读取
				return Promise.resolve(res)
			} else {
				console.log("文件存在,已经过期")
				// 文件已经过期 刷新授权的access_token
				this.refreshCodeAccessToken(res.refresh_token).then(codeAccessToken => {
					this.saveCodeAccessToken(codeAccessToken)
					return Promise.resolve(codeAccessToken)
				})
			}
		}).catch( async () => {
			console.log("文件不存在")
			// 文件不存在 获取授权的access_token
			var codeAccessToken = await this.getCodeAccessToken(code)
			// 获取成功保存文件
			await this.saveCodeAccessToken(codeAccessToken)
			// 返回授权的access_token
			return Promise.resolve(codeAccessToken)
		}).then(res => {
			return Promise.resolve(res)
		})
	}
	
	// 获取用户信息
	getUserInfo(accessData){
		console.log(accessData)
		return new Promise((resolve, reject) => {
			var url = `${userInfoUrl}?access_token=${accessData.access_token}&openid=${accessData.openid}&lang=zh_CN`
			request({method: "GET", url, json: true}).then(res => {
				resolve(res)
			}).catch(err => {
				reject("getUserInfo出现了 问题" + err)
			})
		})
	}

}

// 获取access_token
// (async () => {
// 	var wx = new Wxchat()
	
// 	var result = await wx.fecthAccessToken()
// 	console.log(result)
// })()

// 获取jsapi_ticket
// (async () => {
// 	var wx = new Wxchat()
	
// 	var result = await wx.fecthJsapiTicket()
// 	console.log(result)
// })()

// 创建自自定义菜单
// (async () => {
// 	var wx = new Wxchat()

// 	// 删除
// 	var result = await wx.deleteMenu()
// 	console.log(result)
// 	// 创建
// 	result = await wx.createMenu(menuTemplate)
// 	console.log(result)
// })()

// 暴露出去
module.exports = new Wxchat()
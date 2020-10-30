var request = require("request-promise-native")
var {appID, appsecret} = require("../config/config")
var {jsapiTicketUrl} = require("../utils/url")
var {writeFileAsync, readFileAsync} = require("../utils/tool")
var wxchat = require("./wxchat")

class wxticket {
	
	// 获取jsapi_ticket
	getJsapiTicket(){
		return new  Promise(async (resolve, reject) => {
			var data = await wxchat.getAccessToken()
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
		return wxchat.readJsapiTicket().then(async res => {
			if (wxchat.isVaildJsapiTicket(res)) {
				return Promise.resolve(res)
			} else {
				var res = await wxchat.getJsapiTicket()
				await wxchat.saveJsapiTicket(res)
				return Promise.resolve(res)
			}
		}).catch(async err => {
			var res = await wxchat.getJsapiTicket()
			await wxchat.saveJsapiTicket(res)
			return Promise.resolve(res)
		}).then(res => {
			return Promise.resolve(res)
		})
	}
}

// 获取jsapi_ticket
// (async () => {
// 	var wx = new wxticket()
// 	var result = await wx.fecthJsapiTicket()
// 	console.log(result)
// })()

module.exports = new wxticket()
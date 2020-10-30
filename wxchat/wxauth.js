var request = require("request-promise-native")
var {appID, appsecret} = require("../config/config")
var {authAccessTokenUrl, refreshAccessTokenUrl, userInfoUrl} = require("../utils/url")
var {writeFileAsync, readFileAsync} = require("../utils/tool")

class wxauth {
	
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
				console.log(res)
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

module.exports = new wxauth()
var request = require("request-promise-native")
var {appID, appsecret} = require("../config/config")
var {accessTokenUrl} = require("../utils/url")
var {writeFileAsync, readFileAsync} = require("../utils/tool")

class wxAccessToken {
	
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
}

// 获取access_token
// (async () => {
// 	var wx = new wxAccessToken()
	
// 	var result = await wx.fecthAccessToken()
// 	console.log(result)
// })()

module.exports = new wxAccessToken()
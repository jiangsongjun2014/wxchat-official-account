var {parseString} = require("xml2js")
var {writeFile, readFile} = require("fs")
var {resolve} = require("path")

module.exports = {
	
	// 获取用户发送的数据
	getUserDataAsync(req){
		return new Promise((resolve, reject) => {
			var xmlData = "";
			req.on("data", data => {
				// 接收数据
				xmlData += data.toString()
			});
			req.on("end", () => {
				// 接收完毕
				resolve(xmlData)
			})
		})
	},
	
	// 处理字符串拼接数据
	getParamsDataAsync(params){
		return new Promise((resolve, reject) => {
			if (typeof params != 'string') { return {} }
			var value = {}
			if (params.indexOf('&') !== -1) {
				params = params.split('&')
				for (let val in params) {
					if (params[val].indexOf('=') !== -1) {
						var item = params[val].split('=')
						value[item[0]] = item[1]
					}
				}
			} else if (params.indexOf('=') !== -1) {
				var item = params.split('=')
				value[item[0]] = item[1]
			} else {
				resolve(params)
			}
			resolve(value)
		})
	},
	
	// 解析xml数据
	parseXmlAsync(xmldata) {
		return new Promise((resolve, reject) => {
			parseString(xmldata, {tirm: true}, (err, data) => {
				if (err) {
					reject("jsondata出现了问题" + err)
				} else {
					resolve(data)
				}
			})
		})
	},
	
	// 格式化Json数据
	formatJsonAsync(jsondata) {
		return new Promise ((resolve, reject) => {
			let message = {}
			jsondata = jsondata.xml
			if (typeof jsondata == 'object') {
				for (let i in jsondata) {
					let value = jsondata[i]
					if (Array.isArray(value) && value.length > 0) {
						message[i] = value[0]
					}
				}
			}
			resolve(message)
		})
	},
	
	// 写入文件
	writeFileAsync(data, fileName){
		var filepath = resolve(__dirname, fileName)
		return new Promise((resolve, reject) => {
			writeFile(filepath, data, err => {
				if (!err) {
					resolve(data)
				} else {
					reject("writeFileAsync出了问题" + err)
				}
			})
		})
	},
	
	// 读取文件
	readFileAsync(fileName){
		var filepath = resolve(__dirname, fileName)
		return new Promise((resolve, reject) => {
			readFile(filepath, (err,data) => {
				if (!err) {
					data = JSON.parse(data)
					resolve(data)
				} else {
					reject("readFileAsync出了问题" + err)
				}
			})
		})
	},
	
	
}
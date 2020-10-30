var express = require("express")
var router = require("./routers/index")
var render = require("./render/index")
var ejs = require("./views/index")
var wxmessage = require("./wxchat/wxmessage")

var app = express()

ejs(app)
router(app)
render(app)

app.use(wxmessage())

app.listen(4000, () => {
	console.log("服务器启动了")
})
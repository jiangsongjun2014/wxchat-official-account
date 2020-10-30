const wxticket = require("./wxticket.js")
const wxlogin = require("./wxlogin.js")

module.exports = app => {
	app.use('', wxticket)
	app.use('', wxlogin)
}
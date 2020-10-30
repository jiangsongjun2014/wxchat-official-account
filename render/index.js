const authview = require("./authview.js")
const ticketview = require("./ticketview.js")

module.exports = app => {
	app.use('', authview)
	app.use('', ticketview)
}
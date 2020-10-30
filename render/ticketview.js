var express = require('express');
var router = express.Router();

router.get("/ticketview", (req, res) => {
	res.render("ticketview")
})

module.exports = router;
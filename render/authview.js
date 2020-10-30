var express = require('express');
var router = express.Router();

router.get("/authview", (req, res) => {
	res.render("authview")
})

module.exports = router;
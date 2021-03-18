const { generate } = require("../controllers/fixtures");
const { Router } = require("express");
const router =  Router();

router.post("/init", generate);
module.exports = router;
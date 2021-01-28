const { generate } = require("../controllers/fixtures");
const { Router } = require("express");
const router =  Router();

router.post("/generate", generate);
module.exports = router;

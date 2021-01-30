const { generate } = require("../controllers/fixtures");
const { Router } = require("express");
const router =  Router();

router.post("/generate", () => console.log('Deleted by Saliou'));
module.exports = router;

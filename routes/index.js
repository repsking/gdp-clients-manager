const express = require('express');
const router = express.Router();
const env = require('dotenv').config().parsed

/* GET home page. */
router.get('/', function(req, res) {
  console.log(process.env.SECRET);

  res.status(200).json({ title: 'Express' });
});

module.exports = router;

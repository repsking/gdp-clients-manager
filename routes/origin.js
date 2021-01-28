const Origin = require('../models/Origin')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Origin);

module.exports = router;
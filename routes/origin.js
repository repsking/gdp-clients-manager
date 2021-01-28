const Origin = require('../models/origin')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Origin);

module.exports = router;
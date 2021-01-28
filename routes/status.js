const Status = require('../models/status')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Status);

module.exports = router;
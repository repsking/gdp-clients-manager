const Status = require('../models/demandStatus')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Status);

module.exports = router;
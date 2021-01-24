const Demands = require('../models/demands')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Demands);

module.exports = router;
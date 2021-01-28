const Role = require('../models/role')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Role);

module.exports = router;
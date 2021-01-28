const Role = require('../models/Role')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(Role);

module.exports = router;
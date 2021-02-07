const Status = require('../models/status')
const router = require('./utils/crud')(Status);

module.exports = router;
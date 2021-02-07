const Status = require('../models/status')
const crud = require('./utils/crud');
const router = crud(Status);

module.exports = router;
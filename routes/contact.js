const Contact = require('../models/contact')
const router = require('./utils/crud')(Contact);

module.exports = router;
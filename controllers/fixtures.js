const Origin = require('../models/origin');
const Status = require('../models/status');
const {controller, ACTION} = require('./utils/controller')
const {origins, status} = require('../models/fixtures');

  
exports.generate = controller(() => Promise.all(
  [
    Origin.insertMany(origins),
    Status.insertMany(status)
  ]), ACTION.INFORM)
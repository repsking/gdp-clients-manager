const Origin = require('../models/origin');
const Role = require('../models/role');
const Status = require('../models/status');
const controller = require('./utils/controller')
const {origins, roles, status} = require('../models/fixtures');

  
exports.generate = controller(async (req,res) => {
    await Promise.all([
        Origin.insertMany(origins),
        Role.insertMany(roles),
        Status.insertMany(status)
      ]);
    res.status(201).json({message: "All created"});
  })
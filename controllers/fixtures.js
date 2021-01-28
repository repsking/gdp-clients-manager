const Origin = require('../models/origin');
const Role = require('../models/role');
const DemandeStatus = require('../models/demandStatus');
const ctrlWrapper = require('./utils/ctrlWrapper')

const {
    origins,
    roles,
    demandStatus,
  } = require('../fixtures');


const creators = [
    Origin.insertMany(origins),
    Role.insertMany(roles),
    DemandeStatus.insertMany(demandStatus)
  ];
  
exports.createFixtures = ctrlWrapper(async (req,res) => {
    await Promise.all(creators);
    res.status(201).json({message: "All created"});
  })
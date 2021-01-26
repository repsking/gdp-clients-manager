const {login, newUser, getUsers} = require('../controllers/user');
const User = require('../models/user')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(User);

router.post('/login', login);
router.post('/newuser', newUser);

module.exports = router;
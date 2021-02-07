const {login, newUser, getUsers} = require('../controllers/user');
const User = require('../models/user')
const generateCrud = require('./utils/generateCrud');
const router = generateCrud(User);
const { authUser } = require('../middlewares/auth');


router.post('/login', login);
router.post('/newuser', authUser, newUser);

module.exports = router;
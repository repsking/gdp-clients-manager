const {login, newUser} = require('../controllers/user');
const User = require('../models/user')
const crud = require('./utils/crud');
const router = crud(User);
const { authUser } = require('../middlewares/auth');

router.post('/login', login);
router.post('/newuser', authUser, newUser);

module.exports = router;
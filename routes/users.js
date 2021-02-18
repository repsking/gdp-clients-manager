const {login, newUser, changePassword} = require('../controllers/user');
const User = require('../models/user')
const crud = require('./utils/crud');
const { authUser, authRole } = require('../middlewares/auth');
const { ROLES } = require('../config/roles')

// FIXME: Change needAuth to true when the fix about authentifiaction and role handling is pushed in crud util
const router = crud(User, {needAuth: false, role: ROLES.admin});

router.post('/login', login);
router.post('/newuser', authUser, authRole(ROLES.admin), newUser);
router.put('/changePassword', authUser, changePassword);

module.exports = router;
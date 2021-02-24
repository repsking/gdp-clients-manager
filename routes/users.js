const { login, newUser, changePassword } = require('../controllers/user');
const User = require('../models/user')
const crud = require('./utils/crud');
const { authUser, authRole } = require('../middlewares/auth');
const { ROLES } = require('../config/roles')
//FIXME: Priorize the following routes and put the crud after cause sometimes we have routes conflict
const router = crud(User, { noUpdate: true, needAuth: true, role: ROLES.admin });

router.post('/login', login);
router.post('/newuser', authUser, authRole(ROLES.admin), newUser);
router.put('/changePassword', authUser, changePassword);

module.exports = router;
const { login, newUser, changePassword, updateUserInfo, getContributors } = require('../controllers/user');
const User = require('../models/user')
const crud = require('./utils/crud');
const { authUser, authRole } = require('../middlewares/auth');
const { ROLES } = require('../config/roles')
//FIXME: Priorize the following routes and put the crud after cause sometimes we have routes conflict
const router = crud(User, { noGet:true, noUpdate: true, needAuth: true, role: ROLES.admin });

router.post('/login', login);
router.get('/contributors', authUser, authRole(ROLES.contributor), getContributors);
router.post('/newuser', authUser, authRole(ROLES.admin), newUser);
router.put('/changePassword', authUser, changePassword);
router.put('/updateUser', authUser, updateUserInfo);

module.exports = router;
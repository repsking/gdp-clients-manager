const {PROSPECT_FORMS} = require('../config/actions')
const express = require('express');
const router = express.Router();
const {controller, ACTION} = require('../controllers/utils/controller')
const { NotFoundError } = require('../Errors')


router.get('/',controller(() => PROSPECT_FORMS, ACTION.RESULT));
router.get('/:name', controller(({params}) => {
    const res = PROSPECT_FORMS.find(({name}) => name === params.name);
    if(!res) throw NotFoundError('Action Not Found');
    return res;
}, ACTION.RESULT));

module.exports = router;
const express = require('express');
const { authUser, authRole } = require('../../middlewares/auth')
const { ApiError } = require('../../Errors');
const { controller, ACTION } = require('../../controllers/utils/controller');

module.exports = (Collection, { noCreate, noCreateMany, noList, noGet, noSearch, noUpdate, noCount, noDelete, needAuth, role } = {}) => {

    const create = controller(async({ body }) => {
        const result = new Collection({...body });
        if (result) await result.save();
        return result;
    }, ACTION.CREATE);

    const createMany = controller(async({ body: { collections } }) => {
        const result = await Collection.insertMany(collections);
        if (result) await result.save();
        return result;
    }, ACTION.CREATE);

    const list = controller(() => Collection.find(), ACTION.RESULT);

    const search = controller(({ params }) => {
        return Collection.find({ $text: { $search: params.query } });
    }, ACTION.RESULT);

    const count = controller(() => Collection.count(), ACTION.RESULT);

    const get = controller(async({ params }) => {
        const result = await Collection.findOne({ _id: params.id });
        if (!result) throw ApiError('Ressource Not found', 404);
        return result;
    }, ACTION.RESULT);

    const update = controller(({ params: { id: _id }, body }) => {
        return Collection.updateOne({ _id }, {...body });
    }, ACTION.INFORM);

    const remove = controller(({ params: { id: _id } }) => Collection.deleteOne({ _id }), ACTION.INFORM);

    const router = express.Router();
    const middlewares = [];
    if (needAuth) {
        middlewares.push(authUser)
        if (role) middlewares.push(authRole(role))
    }

    !noList && router.get('/', middlewares, list);
    !noCount && router.get('/count', middlewares, count);
    !noSearch && router.get('/search/:query', middlewares, search);
    !noGet && router.get('/:id', middlewares, get);
    !noCreate && router.post('/', middlewares, create);
    !noCreateMany && router.post('/many', middlewares, createMany);
    !noUpdate && router.put('/:id', middlewares, update);
    !noDelete && router.delete('/:id', middlewares, remove);
    return router;
}
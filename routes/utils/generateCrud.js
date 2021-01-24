const express = require('express');
const auth = require('../../middlewares/auth')
const ApiError = require('../../Errors/ApiError')


module.exports = (Collection, options = {}) => {

  const create = async ({body}, res, next) => {
    try {
        const result = new Collection({...body});
        if(result) await result.save();
        res.status(201).json(result);
    } catch (error) {        
        next(error)
    }
}

const list = async (req, res, next) => {
    try {
        const list = await Collection.find();
        res.json(list);
    } catch (error) {
        next(error)
    }
};

const search = async ({params}, res, next) => {
    try {
        const list = await Collection.find({$text: { $search: params.query }});
        res.json(list);
    } catch (error) {
        next(error)
    }
};

const count = async (req, res, next) => {
    // TODO: Think about to add some filters option in req var
  try {
      const count = await Collection.count();
      res.json(count);
  } catch (error) {
    next(error)
  }
};

const one = async ({params: {id: _id}}, res, next) => {
    try {
        const result = await Collection.findOne({_id}).populate('*');
        if(!result) throw ApiError('Ressource Not found', 404)
        res.json(result);
    } catch (error) {
        next(error)
    }
}

const update = async ({params: {id: _id}, body}, res, next) => {
    try {
        await Collection.updateOne({_id}, {...body});
        res.status(200).end();
    } catch (error) {
        next(error)
    }
}
const remove = async ({params: {_id}}, res, next) => {
    try {
        await Collection.deleteOne({_id});
        res.status(200).end();
    } catch (error) {
        next(error)
    }
}

const router = express.Router();

if(options.needAuth) router.use(auth);

router.get('/', list);
router.get('/count', count);
router.get('/search/:query', search);
router.get('/:id', one);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
return router;
}
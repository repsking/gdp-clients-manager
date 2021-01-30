module.exports = cb => async (req,res,next) => {
    try {
        const result = await cb(req,res, next);
        return result;
    } catch(e) {
        next(e)
    }   
}
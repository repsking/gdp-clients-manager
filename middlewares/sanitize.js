const xss = require("xss");

const clean = obj => {
    const res = {};
    for (const field in obj) {
        res[field] = xss(obj[field]);
    }
    return res;
};

const sanitize = (req, res , next) => {
   const { body = {}, params = {} } = req;
   req.body = clean(body);
   req.params = clean(params);
   next();
};

exports.sanitize = sanitize;
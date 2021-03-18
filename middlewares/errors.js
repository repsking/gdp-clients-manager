const { ValidationError, BulkWriteError } = require('../Errors/consts')

// Middleware to check all kind of errors which come from the API
module.exports = (err, req, res, next) => {
    if (err) {
        switch (err.name) {
            case ValidationError:
                err.isHandled = true;
                err.status = 422;
                break;
            case BulkWriteError:
                err.isHandled = true;
                err.status = 400;
                break;
        }
        if (!err.isHandled) {
            console.log("\x1b[31m", "*** An unhandled error occuring ***");
            console.warn("\x1b[0m", err);
            console.log("\x1b[31m", "*** Error End ***");
        }
        const resp = {
            status: err.status || 500,
            data: err.data
        }
        const unexpectedMsg = 'An unexpected error has occurred. Please contact your server manager to solve this problem';
        resp.message = (process.env.NODE_ENV === 'development' || resp.status < 500)
            ? (err.message || err)
            : unexpectedMsg;

        res.status(resp.status).json(resp);
    }
};
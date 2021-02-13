class ApiError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        this.isHandled = true;
        this.name = "ApiError";
    }
}

class ServerError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.isHandled = true;
        this.name = "ServerError";
    }
}

exports.ApiError = ApiError;
exports.ServerError = ServerError;

exports.ForbiddenError = class ForbiddenError extends ApiError {
    constructor(message) {
        super(message || 'Ressource is forbidden You need a greater access', 403);
    }
}

class NotFoundError extends ApiError {
    constructor(message) {
        super(message || 'Ressoure Not Found', 404);
    }
}
exports.NotFoundError = (message) => new NotFoundError(message);

exports.NotAuthorizedError = class NotAuthorizedError extends ApiError {
    constructor(message) {
        super(message || 'User Not authorized to access to this ressource', 401);
    }
}

exports.PasswordsDontMatch = class PasswordsDontMatch extends ApiError {
    constructor() {
        super("Passwords don't match", 400);
    }
}

exports.WeakStrengthPassword = class WeakStrengthPassword extends ApiError {
    constructor() {
        super("Password strength is too weak", 400);
    }
}
module.exports = class ApiError extends Error {
    constructor(message, status = 400) {
      super(message);
      this.status = status;
      this.isHandled = true;
      this.name = "ApiError" 
    }
  }
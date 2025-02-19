class ErrorClass extends Error {
    constructor(message, statuscode) {
        super();
        //console.log(statuscode)

        this.message = message;
        this.statusCode = statuscode;
        this.status = `${statuscode}`.startsWith("4") ? "fail" : "error";

        Error.captureStackTrace(this , this.constructor);
    }
}

module.exports = ErrorClass;

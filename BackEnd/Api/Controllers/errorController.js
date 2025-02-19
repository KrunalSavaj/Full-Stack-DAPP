module.exports = (err, req, res, next) => {
    // console.log(err.statusCode)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "fail";
    err.message = err.message || "No meassege";

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};

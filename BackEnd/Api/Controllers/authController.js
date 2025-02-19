const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const ErrorClass = require("../../errorClass");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, req, res) => {
    // console.log(user)
    const token = signToken(user._id);

    // res.cookie("jwt", token, {
    //     expires: new Date(
    //         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    //     ),
    //     httpOnly: true,
    //     secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    // });

    ///  Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.signup = async (req, res, next) => {
    //console.log("sign upppppp")
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, req, res);
};
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new ErrorClass("Please provide email and password!", 400));
    }

    // 2)  Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    //console.log(user)

    if (!user || !(await user.correntPassword(password, user.password))) {
        return next(new ErrorClass("Incorrect email or password", 401));
    }

    // 3)  If everything ok, send token to client
    createSendToken(user, 200, req, res);
};

exports.ff = async (req, res, next) => {
    console.log("fffffffffffffffff");
    next();
};

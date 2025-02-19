const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Password are not the same!",
        },
    },
});

userSchema.pre("save", async function (next) {
    // Only run this function if password was actully modified
    if (!this.isModified("password")) return next();

    //  Hash the password with cost of 12
    this.passwordConfirm = undefined;

    // Delete passwordConfirm field
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // This  points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correntPassword = async function (
    candidatePassword,
    userPassword
) {
    return candidatePassword == userPassword;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    ///  False means Not  changed
    return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

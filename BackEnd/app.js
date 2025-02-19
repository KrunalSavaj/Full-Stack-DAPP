const express = require("express");
const cors = require("cors");

const nftRouter = require("./Api/Routers/nftRouter");
const userRouter = require("./Api/Routers/userRouter");
const errorController = require("./Api/Controllers/errorController");

// MIDDALEWARE
const app = express();
app.use(express.json({ limit: "100kb" }));

app.use(cors());
app.options("*", cors());

//  3)  ROUTES
app.use("/api/v1/NFTs", nftRouter);
app.use((req, res, next) => {
    console.log("hiiiiiiiiiiiiii");
    next();
});
app.use("/api/v1/user", userRouter);

app.use(errorController);

module.exports = app;

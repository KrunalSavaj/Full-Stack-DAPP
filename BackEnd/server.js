const mongoose = require("mongoose");
// const next = require("next");
const dotenv = require("dotenv");

const dev = process.env.NODE_ENV != "production";
// const nextServer = next({ dev });
//const handle = nextServer.getRequestHandler();

dotenv.config({ path: "./config.env" });
const app = require("./app");

//const DB = process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD);
const DB = `${process.env.DATABASE}Project`;

mongoose.connect(DB,{useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false,})
    .then(() => console.log("DB connection successful!"));

const port = 3000;

app.listen(port, () => {
    console.log(`Jay swaminarayan`);
});

// let server;
// nextServer.prepare().then(() => {
//     app.get("*", (req, res) => {
//         return handle(req, res);
//     });

// });

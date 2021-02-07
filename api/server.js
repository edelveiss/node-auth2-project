const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
//const session = require("express-session");
//const knexSessionStore = require("connect-session-knex")(session);
const jwt = require("jsonwebtoken");
const restricted = require("../auth/restricted-middleware.js");
const checkDepartment = require("../auth/check-department-middleware.js");
const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

// const sessionConfig = {
//   name: "tzsession",
//   secret: "myspeshulsecret",
//   cookie: {
//     maxAge: 1000 * 60 * 60,
//     secure: false, // should be true in production
//     httpOnly: true,
//   },
//   resave: false,
//   saveUninitialized: false,

//   //now session will be created in our db, not in a memory
//   //   store: new knexSessionStore({
//   //     knex: require("../database/connection.js"),
//   //     tablename: "sessions",
//   //     sidfieldname: "sid",
//   //     createtable: true,
//   //     clearInterval: 1000 * 60 * 60,
//   //   }),
// };

server.use(helmet());
server.use(express.json());
server.use(cors());
//server.use(session(sessionConfig));
server.use("/api/auth", authRouter);
server.use(
  "/api/users",
  restricted,
  //checkDepartment("administration", "finance"),
  checkDepartment(),
  usersRouter
);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;

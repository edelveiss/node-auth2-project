const router = require("express").Router();

const Users = require("./users-model.js");
//const restricted = require("../auth/restricted-middleware.js");
//const checkDepartment = require("../auth/check-department-middleware.js");

//----------------------------------------------------------------------------//
// This is where we use checkRole(). "1" is the ID for the "Admin" role. Calling
// checkRole(1) returns a middleware function that checks to see 1) if the
// decoded token on the req object has a "role" property, and 2, if that
// property has the value of "1".
//----------------------------------------------------------------------------//
//router.get("/", checkDepartment("finance"), (req, res) => {
// router.get("/", (req, res) => {

//   Users.find()
//     .then((users) => {
//       res.status(200).json(users);
//     })
//     .catch((err) => res.send(err));
// });
router.get("/", (req, res) => {
  Users.findBy({ department: req.decodedJwt.department.toLowerCase() })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;

const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

const Users = require("../users/users-model.js");
const { isValid } = require("../users/users-service.js");

//----------------------------------------------------------------------------//
// return a token after registration, so they can begin using it
//----------------------------------------------------------------------------//
router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        const token = generateToken(user);
        res.status(201).json({ data: user, jwt_token: token });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

//----------------------------------------------------------------------------//
// When someone successfully authenticates, reward them with a token, so they
// don't have to authenticate again.
//----------------------------------------------------------------------------//
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome to our API, ${user.username}!`,
            //token,
            jwt_token: token,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password shoud be alphanumeric",
    });
  }
});
router.get("/logout", function (req, res) {
  res.status(200).json({ GoodBye: "GoodBye" });
});
// router.get("/logout", (req, res) => {
//   if (req.session) {
//     req.session.destroy((err) => {
//       if (err) {
//         res.status(500).json({ errorMessage: "Failed to logout" });
//       } else {
//         res.status(200).json({ message: "Successfully logged out" });
//       }
//     });
//   }
// });
//----------------------------------------------------------------------------//
// This is a helper method that helps us stay DRY (we generate tokens in both
// the POST /api/auth/register handler, and the POST /ap/auth/login handler).
//----------------------------------------------------------------------------//
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const options = {
    expiresIn: "2h",
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;

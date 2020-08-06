//----------------------------------------------------------------------------//
// This is a middleware "factory" - a "higher order function" that returns a
// customized function, based on its parameters.
//
// When a user successfully logs in or registers, a token is created and saved
// on the request object. If the request comes in AFTER login/registration, it
// should include the token, which, upon initial verification, should be saved
// to the req object as req.decodedJwt.
//
// This middleware method checks the decodedJwt for a "department" property.

//----------------------------------------------------------------------------//
function makeCheckDepartmentMiddleware(department) {
  return function (req, res, next) {
    //mw function
    //or if (req.decodedJwt.department && req.decodedJwt.department.includes(department))
    // if (req.decodedJwt.department && req.decodedJwt.department === department) {
    console.log("req.body.department", req);

    if (req.decodedJwt.department) {
      next();
    } else {
      res.status(403).json({ you: "do not have the power" });
    }
  };
}

module.exports = makeCheckDepartmentMiddleware;

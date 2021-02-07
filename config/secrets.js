//----------------------------------------------------------------------------//
// Just a module to centralize our JWT signing secret, so we don't end up with
// bugs becaue of mismatched secrets on token signing and token verifying.
//
// Also prevents us from having to save secrets in a public SCM system like
// github, where it could be vulnerable.
//----------------------------------------------------------------------------//
module.exports = {
  jwtSecret: process.env.JWT_SECRET || "wethotuwasatoad",
};

const firebase = require("../firebase"); 
const {getAuth} = require("firebase/auth");
const auth = getAuth(firebase);

function extractErrorCode(error) {
    const msg = error.message || '';
    const startIndex = msg.lastIndexOf('(auth/');
    const endIndex = msg.lastIndexOf(')');
    if (startIndex !== -1 && endIndex !== -1) {
        return msg.substring(startIndex + 6, endIndex);
    }
    return null;
}

const isAuthenticated = (req, res, next) => {
    const user = auth.currentUser;
    if (!user) {
      res.redirect("/");
    } else {
      next();
    }
  };
module.exports = {extractErrorCode,isAuthenticated}
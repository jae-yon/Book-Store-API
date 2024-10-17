const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

const ensureAuthoriation = (req, res) => {
  try {
    let receivedToken = req.headers["authorization"];
    let verifiedToken = jwt.verify(receivedToken, process.env.PRIVATE_KEY);

    return verifiedToken.id;
  } catch (error) {
    console.log(error.name);
    console.log(error.message);
    return error;
  }
}

module.exports = ensureAuthoriation;
/* eslint no-useless-escape: 0 */


require('dotenv').config();
const secredKey = process.env.JWT_SECRET;
const urlRegex = /https?:\/\/[-a-zA-Z0-9._~:/?#\[\]@!$&'()*\+,;=]{5,}/;


module.exports = { secredKey, urlRegex };
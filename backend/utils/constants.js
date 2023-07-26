/* eslint no-useless-escape: 0 */


require('dotenv').config();
const { JWT_SECRET: secredKey = 'test-secred-key' } = process.env;
const urlRegex = /https?:\/\/[-a-zA-Z0-9._~:/?#\[\]@!$&'()*\+,;=]{5,}/;

console.log(secredKey)
module.exports = { secredKey, urlRegex };
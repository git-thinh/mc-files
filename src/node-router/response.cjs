const _send = require('./send.cjs');

module.exports = function (request, response) {
  response.send = _send;
};

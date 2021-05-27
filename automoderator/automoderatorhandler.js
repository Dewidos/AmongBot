const capsProtector = require('./capsProtector');

module.exports = (message, client) => {
    capsProtector(message, client);
};
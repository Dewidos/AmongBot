const capsProtector = require('./capsprotector');

module.exports = (message, client) => {
    capsProtector(message, client);
};
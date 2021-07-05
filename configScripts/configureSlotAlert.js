const configureNextThing = require('./../commands/konfiguracja').configureNextThing;

module.exports = (client, configChannel, thingsToConfigure) => configureNextThing(client, configChannel, thingsToConfigure);
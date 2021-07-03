const { configureNextThing } = require('./../commands/konfiguracja');

module.exports = (client, configChannel, thingsToConfigure) => configureNextThing(client, configChannel, thingsToConfigure);
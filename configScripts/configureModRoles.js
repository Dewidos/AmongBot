const configureNextThing = require('./../commands/konfiguracja').configureNextThing;

module.exports = (client, configChannel, thingsToConfigure) => {
    console.log("hej didżej");
    
    configChannel.send("Wskaż mi proszę role moderatorskie tego serwera. Wystarczy że oznaczysz każdą z nich w osobnej wiadomości. Gdy skończysz, wpisz **/koniec**");

    var moderatorRoles = [];
    var done = false;

    var callback = function(message) {
        if (configChannel.id != message.channel.id || message.author.bot) return;
        
        if (message.content.toLowerCase() == "/koniec") {
            if (moderatorRoles.length <= 0) {
                configChannel.send("Wskazanie jakiejkolwiek roli bądź ról moderatorskich jest wymagane!");
                return;
            } else {
                client.removeListener('message', callback);
                done = true;
                return;
            }
        }

        let roleID = message.content.replace(/[\\<>@#&!]/g, "");

        if (isNaN(parseInt(roleID))) {
            configChannel.send("Identyfikator roli zawsze jest liczbą! Spróbuj jeszcze raz.");
            return;
        }

        if (typeof configChannel.guild.roles.cache.get(roleID) === 'undefined') {
            configChannel.send("Nie znalazłem takiej roli na tym serwerze. Spróbuj jeszcze raz.");
            return;
        }

        moderatorRoles.push(roleID);

        message.react('👍');
    };

    client.addListener('message', callback);

    var waitForUser = () => {
        if (done == false) {
            setTimeout(waitForUser, 50);
            return;
        }

        thingsToConfigure[0] = moderatorRoles;
        console.log(require('./../commands/konfiguracja'));
        configureNextThing(client, configChannel, thingsToConfigure);
    };

    waitForUser();
};
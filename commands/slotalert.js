module.exports = {
    "name": "slotalert",
    "description": "Powiadamia o zwolnieniu slota na kanale głosowym.",
    execute(message, args, client) {
        try {    
            if (client.configFile.find(c => c.guildId == message.guild.id).vcNotifyConfig.length == 0) {
                message.channel.send("Najpierw musisz ustawić listę kodów kanałów głosowych! Polecam skontaktować się z administracją w tym celu.");
                return;
            }
            
            if (typeof args[0] == 'undefined' || args[0] == "") {
                message.channel.send(`Musisz podać kod kanału głosowego. Jeżeli chcesz wyświetlić listę kodów, wpisz **${client.prefix + this.name} -kody**`);
                return;
            }

            if (args[0] == "-kody") {
                var messageToSend = "**__Kody kanałów głosowych:__**\n";

                for (const configObject of client.configFile.find(e => e.guildId == message.guild.id).vcNotifyConfig) {
                    messageToSend = messageToSend + `\n**${configObject.vcKey}** - ${configObject.vcName}`;
                }

                message.channel.send(messageToSend);
                return;
            }

            var config = client.configFile.find(e => e.guildId == message.guild.id);

            if (typeof config == 'undefined') {
                message.channel.send("Błąd konfiguracji! Skontaktuj się z administracją.");
                return;
            }

            var link = config.vcNotifyConfig.find(e => e.vcKey == args[0]);

            if (typeof link == 'undefined') {
                message.channel.send(`Podałeś błędny kod kanału głosowego! Jeżeli chcesz wyświetlić listę kodów, wpisz **${client.prefix + this.name} -kody**`);
                return;
            }

        } catch (error) {
            message.channel.send("Błąd konfiguracji! Skontaktuj się z administracją.");
            console.error(error);
        }

        var counter = 0;
        try {
            message.guild.members.cache.forEach(m => {
                if (m.voice.channel != null) {
                    if (m.voice.channel.id == link.vcId) {
                        counter++;
                    }
                }
            });
        } catch (error) {
            message.channel.send("Błąd konfiguracji! Skontaktuj się z administracją.");
            console.error(error);
            return;
        }

        if (counter < 10) {
            message.channel.send("Na tym kanale głosowym jest już wolne miejsce!");
            return;
        }

        var possibleDuplicate = config.vcNotifyLinks.find(l => l.userId == message.author.id);

        if (typeof config.vcNotifyLinks != 'undefined' && typeof possibleDuplicate != 'undefined' && possibleDuplicate.voiceChannelId == link.vcId) {
            message.channel.send("Ustawiłeś już sobie powiadomienie o miejscu na tym kanale głosowym!");
            return;
        }
        
        config.vcNotifyLinks.push({
            "userId": message.author.id,
            "voiceChannelId": link.vcId,
            "voiceChannelName": link.vcName
        });

        message.channel.send("Zostaniesz poinformowany gdy zwolni się miejsce na kanale :smiley:");
    }
};
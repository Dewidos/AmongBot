const Discord = require('discord.js');

module.exports = async function (voiceState, client) {
    var config = client.configFile.find(c => c.guildId == voiceState.guild.id);

    if (typeof config === 'undefined') {
        console.error("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
        return;
    }

    var usersOnChannel = new Array();

    voiceState.guild.members.cache.forEach(m => {
        if (m.voice.channel != null) {
            if (m.voice.channel.id == config.waitroomChannelId) {
                usersOnChannel.push(m);
            }
        }
    });

    if (usersOnChannel.length <= 0) return;

    for (const waitingMember of usersOnChannel) {

        var memberChecker = async () => {
            for (const gameChannel of config.vcNotifyConfig) {
                if (!gameChannel.canWait) continue;

                var counter = 0;
                voiceState.guild.members.cache.forEach(m => {
                    if (m.voice.channel != null) {
                        if (m.voice.channel.id == gameChannel.vcId) {
                            counter++;
                        }
                    }
                });

                if (!(counter >= 5 && counter < 10)) continue;

                waitingMember.voice.setChannel(gameChannel.vcId);
                break;
            }

            return new Promise(
                resolve => setTimeout(resolve, 300)
            );
        }

        await memberChecker();
    }
}
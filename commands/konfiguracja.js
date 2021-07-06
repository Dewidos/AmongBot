const Discord = require("discord.js");
const configureModRoles = require('./../configScripts/configureModRoles');
const configureModUpdateNotifications = require('./../configScripts/configureModUpdateNotifications');
const configureSlotAlert = require('./../configScripts/configureSlotAlert');
const configureWaitroom = require('./../configScripts/configureWaitroom');

module.exports = {
    "name": "konfiguracja",
    "description": "Skonfiguruj mnie na tym serwerze!",
    execute(message, args, client) {
        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (typeof config === 'undefined') {
            if (message.author.id != message.guild.ownerID && message.author.id != "514138172070952961") {
                message.channel.send("Pierwszą konfigurację przeprowadzić moze tylko właściciel!");
                return;
            }
        } else {
            if (typeof config.moderatorRoles === 'undefined' || config.moderatorRoles.length <= 0) {
                message.channel.send("Niepoprawny format pliku konfiguracyjnego. Skontaktuj się z twórcami bota.");
                return;
            }

            let hasPermission = false;

            config.moderatorRoles.forEach(role => {
                if (message.member.roles.cache.has(role)) {
                    hasPermission = true;
                }
            });

            if (!hasPermission) {
                message.channel.send("Nie masz wystarczających uprawnień!");
                return;
            }
        }

        message.guild.channels.create(`konfiguracja-${client.user.username}`, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                },
                {
                    id: client.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                }
            ]
        }).then(configChannel => {
            let infoEmbed = new Discord.MessageEmbed()
                .setColor('#34c6eb')
                .setTitle("Rozpocznijmy konfigurację!")
                .setDescription("Odpręż się, a ja zadam Tobie kilka pytań. Spokojnie, nie potrwa to zbyt długo.")
                .setFooter("Polecam się na przyszłość :)");

            configChannel.send(infoEmbed);

            var thingsToConfigure = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

            configChannel.send("Najpierw powiedz mi, czy chcesz używać funkcji bota związanych z grą **AmongUs**. Wystarczy że napiszesz *tak*, bądź *nie*.");

            var enableAmongFeatures = null;

            var callback = function(message) {
                if (configChannel.id != message.channel.id || message.author.bot) return;
                
                switch (message.content.toLowerCase()) {
                    case "tak":
                    case "yes":
                        enableAmongFeatures = true;
                        break;
                    case "nie":
                    case "no":
                        enableAmongFeatures = false;
                        break;
                    default:
                        configChannel.send("Przepraszam, ale nie rozumiem. Abym zrozumiał, użyj proszę słowa *tak*, albo słowa *nie*.");
                        return;
                }

                client.removeListener('message', callback);
            }

            client.addListener('message', callback);

            var waitForUserAnswer = () => {
                if (enableAmongFeatures === null) {
                    setTimeout(waitForUserAnswer, 50);
                    return;
                }
                
                if (enableAmongFeatures === false) {
                    thingsToConfigure[1] = 0;
                    thingsToConfigure[2] = 0;
                    thingsToConfigure[3] = 0;
                }

                var enableForFunFeatures = null;

                var forFunCallback = function(message) {
                    if (configChannel.id != message.channel.id || message.author.bot) return;
                    
                    switch (message.content.toLowerCase()) {
                        case "tak":
                        case "yes":
                            enableForFunFeatures = true;
                            break;
                        case "nie":
                        case "no":
                            enableForFunFeatures = false;
                            break;
                        default:
                            configChannel.send("Przepraszam, ale nie rozumiem. Abym zrozumiał, użyj proszę słowa *tak*, albo słowa *nie*.");
                            return;
                    }
    
                    client.removeListener('message', forFunCallback);
                }

                client.addListener('message', forFunCallback);
    
                this.configureNextThing(client, configChannel, thingsToConfigure);
            }
            
            waitForUserAnswer();           
        }).catch(console.error);
    },
    configureNextThing(client, configChannel, thingsToConfigure) {     for (const key in thingsToConfigure) {
            const decision = thingsToConfigure[key];
            console.log(thingsToConfigure);

            if (decision == 1) {
                switch (key) {
                    case "0":
                        configureModRoles(client, configChannel, thingsToConfigure);
                        return;
                    case "1":
                        configureModUpdateNotifications(client, configChannel, thingsToConfigure);
                        return;
                    case "2":
                        configureSlotAlert(client, configChannel, thingsToConfigure);
                        return;
                    case "3":
                        configureWaitroom(client, configChannel, thingsToConfigure);
                }
            } else continue;
        }

        configChannel.send("Dziękuję za pomyślną konfigurację!");

        /*client.configFile.push({
            "guildId": configChannel.guild.id,
            "modUpdateChannelId": thingsToConfigure[1],
            "waitroomChannelId": thingsToConfigure[3],
            // Role of verified player
            "verifiedRoleId": thingsToConfigure[6],
            "shipChannelId": thingsToConfigure[4],
            "lvlNotifyChannel": thingsToConfigure[5],
            "marryChannelId": thingsToConfigure[8],
            "muteRole": thingsToConfigure[9],
            "polecAdminaChannelId": thingsToConfigure[10],
            // Role of verified server user
            "verificationRole": thingsToConfigure[7],
            // Deprecated -> "verificationChannel": "",
            "speakToBotChannelId": thingsToConfigure[11],
            "countingChannelId": thingsToConfigure[12],
            "repeatingChannelId": thingsToConfigure[13],
            "botDmForwardChannel": thingsToConfigure[14],
            "levelRoles": [
                {
                    "roleFor1Lvl": "850033254668304384",
                    "roleFor5Lvl": "850033980216311819",
                    "roleFor10Lvl": "850034522141491251",
                    "roleFor25Lvl": "850034775481778177"
                }
            ],
            "actualConfigNumber": 1,
            "vcNotifyLinks": [],
            "vcNotifyConfig": function(){
                if (thingsToConfigure[2] == 0) return [];
                
                return thingsToConfigure[2];
            }(),
            "moderatorRoles": thingsToConfigure[0],
            "warningRoles": [],
            "autoModConfig": [
                {
                    "name": "CapsProtector",
                    "capsLetterCount": 6
                },
                {
                    "name": "FloodProtector",
                    "messagesPerSecond": 3
                }
            ]
        });*/

        setTimeout(() => configChannel.delete("Skończono konfigurację."), 5000);
    }
}
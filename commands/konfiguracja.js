const Discord = require("discord.js");

module.exports = {
    "name": "konfiguracja",
    "description": "Skonfiguruj mnie na tym serwerze!",
    async execute(message, args, client) {
        var config = client.configFile.find(c => c.guildId == message.guild.id);

        if (typeof config === 'undefined') {
            if (message.author.id != message.guild.ownerID) {
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

        await message.guild.channels.create(`konfiguracja-${client.user.username}`, {
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
        }).then(async configChannel => {
            let infoEmbed = new Discord.MessageEmbed()
                .setColor('#34c6eb')
                .setTitle("Rozpocznijmy konfigurację!")
                .setDescription("Odpręż się, a ja zadam Tobie kilka pytań. Spokojnie, nie potrwa to zbyt długo.")
                .setFooter("Polecam się na przyszłość :)");

            configChannel.send(infoEmbed);

            var moderatorRoles = await this.configureModRoles(message, client, configChannel);

            configChannel.send("Dobrze, zapisałem już sobie role moderatorskie. Teraz powiedz mi, czy chcesz używać funkcji bota związanych z grą **AmongUs**. Wystarczy że napiszesz *tak*, bądź *nie*.");

            var enableAmongFeatures = false;

            while (true) {
                let lastMessageID = configChannel.lastMessageID;

                while (lastMessageID == configChannel.lastMessageID);

                switch (configChannel.lastMessage.content.toLowerCase()) {
                    case "tak":
                    case "yes":
                        enableAmongFeatures = true;
                        break;
                    case "nie":
                    case "no":
                        enableAmongFeatures = false;
                        break;
                    default:
                        await configChannel.send("Przepraszam, ale nie rozumiem. Abym zrozumiał, użyj proszę słowa *tak*, albo słowa *nie*.");
                        continue;
                }

                break;
            }

            var amongUsConfig = null;

            if (enableAmongFeatures) amongUsConfig = await this.configureAmongUs(message, client, configChannel);

            configChannel.send(amongUsConfig);

            configChannel.send("Na razie to koniec, później będzie więcej rzeczy do skonfigurowania.");

            setTimeout(() => configChannel.delete("Skończono konfigurację."), 5000);
        }).catch(console.error);



        /*client.configFile.push({
            "guildId": message.guild.id,
            "modUpdateChannelId": "849017058061713458",
            "waitroomChannelId": "849018859079860225",
            "verifiedRoleId": "849963726384005131",
            "shipChannelId": "849920599090397204",
            "lvlNotifyChannel": "850016147805962310",
            "marryChannelId": "849920409520177172",
            "muteRole": "849922393127649311",
            "verificationChannel": "849964812934053898",
            "polecAdminaChannelId": "849930174722998303",
            "verificationRole": "849990322952208434",
            "speakToBotChannelId": "849920572779659264",
            "countingChannelId": "849920671513444362",
            "repeatingChannelId": "849920629901099018",
            "botDmForwardChannel": "856145551685845013",
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
            "vcNotifyConfig": [],
            "moderatorRoles": moderatorRoles,
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
    },
    // Moderation features
    async configureModRoles(message, client, configChannel) {
        configChannel.send("Wskaż mi proszę role moderatorskie tego serwera. Wystarczy że oznaczysz każdą z nich w osobnej wiadomości. Gdy skończysz, wpisz **/koniec**");

        var moderatorRoles = [];

        while (true) {
            let lastMessageID = configChannel.lastMessageID;

            while (lastMessageID == configChannel.lastMessageID);

            if (configChannel.lastMessage.content.toLowerCase() == "/koniec") {
                if (moderatorRoles.length <= 0) {
                    configChannel.send("Wskazanie jakiejkolwiek roli bądź ról moderatorskich jest wymagane!");
                    continue;
                } else break;
            }

            let roleID = configChannel.lastMessage.content.replace(/[\\<>@#&!]/g, "");

            if (isNaN(parseInt(roleID))) {
                configChannel.send("Identyfikator roli zawsze jest liczbą! Spróbuj jeszcze raz.");
                continue;
            }

            if (typeof await message.guild.roles.fetch(roleID).catch(() => { }) === 'undefined') {
                configChannel.send("Nie znalazłem takiej roli na tym serwerze. Spróbuj jeszcze raz.");
                continue;
            }

            moderatorRoles.push(roleID);

            configChannel.lastMessage.react('👍');
        }

        return moderatorRoles;
    },
    // Among Us Features
    async configureAmongUs(message, client, configChannel) {
        await this.configureWaitroom(message, client, configChannel);
        await this.configureSlotAlert(message, client, configChannel);
        await this.configureModUpdateNotifications(message, client, configChannel);

        return true;
    },
    async configureWaitroom(message, client, configChannel) {

    },
    async configureSlotAlert(message, client, configChannel) {

    },
    async configureModUpdateNotifications(message, client, configChannel) {

    }
}
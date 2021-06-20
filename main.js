const keepAlive = require('./server');
const runAutomoderator = require('./automoderator/automoderatorhandler');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const waitroomHandler = require('./waitroom');
const Client = new Discord.Client();
const speakToBot = require('./speakingToBot');
const fs = require('fs');
const poleceniaHandler = require('./poleceniaHandler');
const dmHandler = require('./dmHandler');

Client.commands = new Discord.Collection();

Client.configFile = JSON.parse(fs.readFileSync('./appconfig.json', 'utf8'));
Client.configFile.forEach(e => e.vcNotifyLinks = []);

Client.punishments = JSON.parse(fs.readFileSync('./punishments.json', 'utf8'));
Client.rank = JSON.parse(fs.readFileSync('./rank.json', 'utf8'));
Client.forFun = JSON.parse(fs.readFileSync('./forfun.json', 'utf8'));
Client.poleceni = JSON.parse(fs.readFileSync('./poleceni.json', 'utf8'));
Client.economy = JSON.parse(fs.readFileSync('./economy.json', 'utf8'));

Client.reactionCallbacks = new Array();

Client.on('messageReactionAdd', async (reaction, user) => {
    if (Client.reactionCallbacks.length <= 0) return;

    for (const callbackIndex in Client.reactionCallbacks) {
        if (await Client.reactionCallbacks[callbackIndex](reaction, user)) Client.reactionCallbacks.splice(callbackIndex, 1);
    }
});

const nextRefreshTime = new Date();

// Aktualizacje modów ----------

var lastUpdateDate = new Date();
var firstFetch = true;

var lastImpostorUpdateDate = new Date();
var firstImpostorFetch = true;

// -----------------------------

Client.prefix = "ab!";
Client.stringPrefix = "!";

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
}

const speakFunctionsFiles = fs.readdirSync('./dialogs/').filter(file => file.endsWith('.js'));
Client.speakFunctions = new Object();

for (const file of speakFunctionsFiles) {
    const speakFunction = require(`./dialogs/${file}`);
    const functionName = file.split('.')[0];

    Client.speakFunctions[functionName] = speakFunction;
}

Client.on('message', async message => {
    if (message.partial) await message.fetch();

    if (message.channel.type == "dm") {
        dmHandler(message, Client);
        return;
    }
    
    refreshHandler(message.guild);
    checkChannels(message);

    var config = Client.configFile.find(c => c.guildId == message.guild.id);

    if (typeof config === 'undefined') {
        message.channel.send("Błąd konfiguracji!");
        return;
    }

    const channelID1 = config.speakToBotChannelId;
    const channelID2 = config.countingChannelId;
    const channelID3 = config.repeatingChannelId;
    const shipChannelID = config.shipChannelId;

    speakToBot(message, Client, channelID1, Client.stringPrefix);

    addExperience(message);
    liczenie(message, channelID2);

    if (message.content.startsWith(Client.prefix) && !message.author.bot) {
        const args = message.content.slice(Client.prefix.length).split(/ +/);
        var command = args.shift().toLowerCase();
        console.log(command);
        try {           
            var possibleCommand = null;

            Client.commands.forEach(c => {
                if (typeof c.aliases === 'undefined' && possibleCommand == null) {
                    possibleCommand = null;
                } else if (typeof c.aliases !== 'undefined') {
                    if (typeof c.aliases.find(a => a == command) !== 'undefined') possibleCommand = c;
                };
            });

            if (typeof possibleCommand !== 'undefined' && possibleCommand != null) command = possibleCommand.name;
            
            Client.commands.get(command).execute(message, args, Client);

            Client.updateConfig();
        } catch (error) {
            message.channel.send(`Nie znam takiej komendy :tired_face:. Jeżeli chcesz poznać listę moich komend, wpisz **${Client.prefix}info -komendy**.`);
            console.error(error);
        }
    } else if (!message.author.bot) {
        if (!message.content.startsWith(`${Client.prefix}ship`) && message.channel.id == shipChannelID) {
            let marryChannel = message.guild.channels.cache.get(shipChannelID);

            if (!marryChannel) {
                message.channel.send("Błędne ID kanału do komendy ab!ship");
                return;
            }

            marryChannel.messages.delete(message);
        }

        if (message.channel.id == config.polecAdminaChannelId) poleceniaHandler(message, Client);

        runAutomoderator(message, Client);
        jakiswkuriwajacychuj(channelID3, message);
    }
});

function checkChannels(message) {

    if (message.channel.id == '849930174722998303') {

        if (message.content.startsWith("ab!")) return;
        else {
            if (!message.author.bot) {
                message.channel.messages.delete(message);
            } else {
                return;
            }
            
        }


    }


}

Client.on('voiceStateUpdate', vState => {
    checkFreeSlots();
    waitroomHandler(vState, Client);
});

Client.on('guildCreate', guild => {
    Client.configFile.push({
        "guildId": guild.id,
        "modUpdateChannelId": "0",
        "vcNotifyLinks": [],
        "vcNotifyConfig": []
    });
});

Client.once('ready', () => {
    console.log("Bot has been initialized! Hello world!");
})

function checkUpdates() {
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var releaseDate = Date.parse(response[0].published_at);

            if ((lastUpdateDate != releaseDate) && !firstFetch) {
                for (const guild of Client.guilds.cache) {
                    var guildConfig = Client.configFile.find(c => c.guildId == guild.id);

                    if (guildConfig.modUpdateChannelId == 0) continue;

                    var infoChannel = guild.channels.cache.get(guildConfig.modUpdateChannelId);

                    infoChannel.send(`**Wyszła nowa wersja Town Of Us!** Jej numerek to: **${response[0].tag_name}**. Link do pobrania: https://github.com/slushiegoose/Town-Of-Us`);
                }
                lastUpdateDate = releaseDate;
            }
            else if (firstFetch) {
                lastUpdateDate = releaseDate;
                firstFetch = false;
            }
        }
        else {
            console.error(`Github's servers returned ${xhr.status} code, while checking Town Of Us`);
        }
    }

    xhr.open('GET', 'https://api.github.com/repos/slushiegoose/Town-Of-Us/releases', true);
    xhr.send(null);

    var xhrI = new XMLHttpRequest();

    xhrI.onload = function () {
        if (xhrI.status === 200) {
            var response = JSON.parse(xhrI.responseText);
            var releaseDate = Date.parse(response[0].published_at);

            if ((lastImpostorUpdateDate != releaseDate) && !firstImpostorFetch) {
                for (const guild of Client.guilds.cache) {
                    var guildConfig = Client.configFile.find(c => c.guildId == guild.id);
                    var infoChannel = guild.channels.cache.get(guildConfig.modUpdateChannelId);

                    infoChannel.send(`**Wyszła nowa wersja Town Of Impostors!** Jej numerek to: **${response[0].tag_name}**. Link do pobrania: https://github.com/Town-of-Impostors/TownOfImpostors`);
                }
                lastImpostorUpdateDate = releaseDate;
            }
            else if (firstImpostorFetch) {
                lastImpostorUpdateDate = releaseDate;
                firstImpostorFetch = false;
            }
        }
        else {
            console.error(`Github's servers returned ${xhrI.status} code, while checking Town Of Impostors`);
        }
    }

    xhrI.open('GET', 'https://api.github.com/repos/Town-of-Impostors/TownOfImpostors/releases', true);
    xhrI.send(null);
}


function liczenie(message, channelToLiczenie) {

    if (message.author.bot) return;

    var config = Client.configFile.find(c => c.guildId == message.guild.id);

    if (typeof config === 'undefined') {
        console.error("Config error!");
        return;
    }

    var number = config.actualConfigNumber;

    if (message.channel.id != channelToLiczenie) return;

    console.log(`${message.content} = ${number}`);

    if (message.content == number) {

        config.actualConfigNumber = number + 1;

    } else {
        message.channel.messages.delete(message);
    }

    Client.updateConfig();
}

function addExperience(message) {
    if (message.author.bot) return;
    var rank = Client.rank.find(e => e.guildID == message.guild.id);

    if (typeof rank === 'undefined') {
        console.error("rank.json file error");
        return;
    }

    var rankOfPlayer = rank.textChannelRank.find(r => r.userID == message.author.id);

    if (typeof rankOfPlayer === 'undefined') {
        rankOfPlayer = rank.textChannelRank.push({
            "userID": message.author.id,
            "experienceToNextLvl": "50",
            "experience": "0",
            "level": "0"
        });
    }

    var experienceToGet = message.content.length;

    if (experienceToGet > 15) experienceToGet = 15;

    var playerExp = parseInt(rankOfPlayer.experience) + experienceToGet;
    rankOfPlayer.experience = playerExp.toString();

    var experienceToNextLvl = parseInt(rankOfPlayer.experienceToNextLvl);
    var playerLvl = parseInt(rankOfPlayer.level);

    if (playerExp >= experienceToNextLvl) {
        playerLvl += 1;
        rankOfPlayer.level = playerLvl.toString();

        var config = Client.configFile.find(c => c.guildId == message.guild.id);

        var lvlNotifyChannel = message.guild.channels.cache.get(config.lvlNotifyChannel);
        var messageSender = message.member;
        
        lvlNotifyChannel.send(`**Gratulacje <@${message.author.id}>!** Udało ci się wbić **${playerLvl} poziom!**`);

        experienceToNextLvl *= 1.30;

        if (rankOfPlayer.level >= 1 && rankOfPlayer.level < 5) {
          
            messageSender.roles.add(`850033254668304384`);

            experienceToNextLvl = 500;

        } else if (rankOfPlayer.level >= 5 && rankOfPlayer.level < 10) {

            messageSender.roles.add(`850033980216311819`);

        } else if (rankOfPlayer.level >= 10 && rankOfPlayer.level < 25) {

            messageSender.roles.add(`850034522141491251`);

        } else if (rankOfPlayer.level >= 25) {

            messageSender.roles.add(`850034775481778177`);

        }
        rankOfPlayer.experienceToNextLvl = experienceToNextLvl.toString();
    }

    Client.updateConfig(true);
}
function checkFreeSlots() {
    for (const guildConfig of Client.configFile) {
        if (guildConfig.vcNotifyLinks.length == 0) continue;

        try {
            var guild = Client.guilds.cache.get(guildConfig.guildId);
        } catch (error) {
            console.error(error);
        }

        for (const linkIndex in guildConfig.vcNotifyLinks) {
            var link = guildConfig.vcNotifyLinks[linkIndex];

            var counter = 0;
            guild.members.cache.forEach(m => {
                if (m.voice.channel != null) {
                    if (m.voice.channel.id == link.voiceChannelId) {
                        counter++;
                    }
                }
            });

            if (counter < 10) {
                guild.members.cache.get(link.userId).send(`<@${link.userId}> Kanał głosowy ${link.voiceChannelName} jest już wolny!`);
                guildConfig.vcNotifyLinks.splice(linkIndex, 1);
            }
        }
    }
}

function jakiswkuriwajacychuj(channelID, message) {

    
    
    

    if (message.channel.id == channelID) {

        var messageToSend = message.content.replace("@everyone", "everyone");

        var messageToSend = messageToSend.replace("@here", "here");

        if (messageToSend != message.content) {
        message.channel.send("```"+ messageToSend +"```");
        return;
        } 

        var wkurwiajacawiadomosc = message.content.toLowerCase();

        if (wkurwiajacawiadomosc == "jestem debilem" || wkurwiajacawiadomosc == "jestem idiotą" || wkurwiajacawiadomosc == "jestem śmieciem" || wkurwiajacawiadomosc == "jestem głupi") {
            message.channel.send("Tak, jesteś zgodze się");
        } else if (wkurwiajacawiadomosc == "bot jest głupi" || wkurwiajacawiadomosc == "jesteś głupi") {
            message.channel.send("chyba ty")
        } else {
            message.channel.send(message.content);
        }

    } else {
        return;
    }


}

function refreshHandler(guild) {
    if (new Date() <= nextRefreshTime) return;

    nextRefreshTime.setMinutes(nextRefreshTime.getMinutes() + 5);

    checkUpdates();
    refreshMutes(guild);
}

function refreshMutes(guild) {
    var punishments = Client.punishments.find(p => p.guildId == guild.id);

    if (typeof punishments === 'undefined') {
        console.error("Can't get to mutes when refreshing them.");
        return;
    }

    if (typeof punishments.mutes === 'undefined' || punishments.mutes.length <= 0) return;

    var dateNow = new Date();

    for (const mute of punishments.mutes) {
        if (!mute.expires) continue;

        let muteExpiryDate = new Date(mute.expires);

        let mutedPlayer = guild.members.cache.get(mute.userId);

        if (!mutedPlayer) {
            try {
                punishments.mutes.splice(punishments.mutes.indexOf(mute), 1);
            } catch (error) {
                console.error(error);
            }
        }

        if (dateNow < muteExpiryDate) continue;

        mutedPlayer.roles.remove('841617507168288798');

        try {
            punishments.mutes.splice(punishments.mutes.indexOf(mute), 1);
        } catch (error) {
            console.error(error);
        }
    }

    Client.updateConfig();
}

Client.updateConfig = (expUpdate = false) => {
    if (!expUpdate) {
        try {
            var config = Client.configFile;
        } catch (error) {
            console.error(error);
        }

        fs.writeFileSync('./appconfig.json', JSON.stringify(config));

        try {
            var punishments = Client.punishments;
        } catch (error) {
            console.error(error);
        }

        fs.writeFileSync('./punishments.json', JSON.stringify(punishments));

        try {
            var forFun = Client.forFun;
        } catch (error) {
            console.error(error);
        }

        fs.writeFileSync('./forfun.json', JSON.stringify(forFun));

        try {
            var economy = Client.economy;
        } catch (error) {
            console.error(error);
        }

        fs.writeFileSync('./economy.json', JSON.stringify(economy));

        try {
            var poleceni = Client.poleceni;
        } catch (error) {
          console.error(error);
        }

        fs.writeFileSync('./poleceni.json', JSON.stringify(poleceni));
    } else {
        try {
            var rank = Client.rank;
        } catch (error) {
            console.error(error);
        }

        fs.writeFileSync('./rank.json', JSON.stringify(rank));
    }

    console.log("Saved config!");
}

keepAlive();
Client.login(process.env['TOKEN']);
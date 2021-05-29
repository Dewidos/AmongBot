const keepAlive = require('./server');
const runAutomoderator = require('./automoderator/automoderatorhandler');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const waitroomHandler = require('./waitroom');
const Client = new Discord.Client();
const fs = require('fs');
Client.commands = new Discord.Collection();

Client.configFile = JSON.parse(fs.readFileSync('./appconfig.json', 'utf8'));
Client.configFile.forEach(e => e.vcNotifyLinks = []);

Client.punishments = JSON.parse(fs.readFileSync('./punishments.json', 'utf8'));
Client.rank = JSON.parse(fs.readFileSync('./rank.json', 'utf8'));

// Aktualizacje modów ----------

var lastUpdateDate = new Date();
var firstFetch = true;

var lastImpostorUpdateDate = new Date();
var firstImpostorFetch = true;

var lastUpdateFetchTime;

// -----------------------------

Client.prefix = "ab!";

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
}

Client.on('message', message => {
    checkUpdates();

    const channelID = '847800029103128586';

    addExperience(message);

    if (message.content.startsWith(Client.prefix) && !message.author.bot) {
        const args = message.content.slice(Client.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        try {
            Client.commands.get(command).execute(message, args, Client);

            Client.updateConfig();
        } catch (error) {
            message.channel.send(`Nie znam takiej komendy :tired_face:. Jeżeli chcesz poznać listę moich komend, wpisz **${Client.prefix}info -komendy**.`);
            console.error(error);
        }
    } else if (!message.author.bot) {
        runAutomoderator(message, Client);
        jakiswkuriwajacychuj(channelID, message);
    }
});

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
    if (firstImpostorFetch || firstFetch) {
        lastUpdateFetchTime = new Date();
    }
    else
    {
        var dateNow = new Date();
        dateNow.setDate(dateNow.getDate() - 1);

        if (!(dateNow >= lastUpdateFetchTime)) return;
        else lastUpdateFetchTime = new Date();
    }
    
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
        if (xhr.status === 200)
        {
            var response = JSON.parse(xhr.responseText);
            var releaseDate = Date.parse(response[0].published_at);

            if ((lastUpdateDate != releaseDate) && !firstFetch)
            {
                for (const guild of Client.guilds.cache) {
                    var guildConfig = Client.configFile.find(c => c.guildId == guild.id);

                    if (guildConfig.modUpdateChannelId == 0) continue;

                    var infoChannel = guild.channels.cache.get(guildConfig.modUpdateChannelId);

                    infoChannel.send(`**Wyszła nowa wersja Town Of Us!** Jej numerek to: **${response[0].tag_name}**. Link do pobrania: https://github.com/slushiegoose/Town-Of-Us`);
                }
                lastUpdateDate = releaseDate;
            }
            else if (firstFetch)
            {
                lastUpdateDate = releaseDate;
                firstFetch = false;
            }
        }
        else
        {
            console.error(`Github's servers returned ${xhr.status} code, while checking Town Of Us`);
        }
    }
        
    xhr.open('GET', 'https://api.github.com/repos/slushiegoose/Town-Of-Us/releases', true);
    xhr.send(null);

    var xhrI = new XMLHttpRequest();

    xhrI.onload = function() {
        if (xhrI.status === 200)
        {
            var response = JSON.parse(xhrI.responseText);
            var releaseDate = Date.parse(response[0].published_at);

            if ((lastImpostorUpdateDate != releaseDate) && !firstImpostorFetch)
            {
                for (const guild of Client.guilds.cache) {
                    var guildConfig = Client.configFile.find(c => c.guildId == guild.id);
                    var infoChannel = guild.channels.cache.get(guildConfig.modUpdateChannelId);

                    infoChannel.send(`**Wyszła nowa wersja Town Of Impostors!** Jej numerek to: **${response[0].tag_name}**. Link do pobrania: https://github.com/Town-of-Impostors/TownOfImpostors`);                
                }
                lastImpostorUpdateDate = releaseDate;                
            }
            else if (firstImpostorFetch)
            {
                lastImpostorUpdateDate = releaseDate;
                firstImpostorFetch = false;
            }
        }
        else
        {
            console.error(`Github's servers returned ${xhrI.status} code, while checking Town Of Impostors`);
        }
    }
        
    xhrI.open('GET', 'https://api.github.com/repos/Town-of-Impostors/TownOfImpostors/releases', true);
    xhrI.send(null);
}

function addExperience(message) {
    var rank = Client.rank.find(e => e.guildID == message.guild.id);

    if (typeof rank === 'undefined') {
        console.error("rank.json file error");
        return;
    }

    var rankofplayer = rank.textChannelRank.find(r => r.userID == message.author.id);

    if (typeof rankofplayer === 'undefined') {
        rankofplayer = rank.textChannelRank.push({
            "userID": message.author.id,
            "experienceToNextLvl": "50",
            "experience": "0",
            "level": "0"
        });
    }

    if (message.author.bot) return;

    var expiriencetoget = Math.floor(Math.random()*10+1);

    rankofplayer.experience = (parseInt(rankofplayer.experience) + experiencetoget).toString();
    //levelup
    var expirienceofplayer = parseInt(rankofplayer.experience);
    var expiriencetogefornextplayerlvl = parseInt(rankofplayer.experienceToNextlvl);
    var acctuallvlofplayer = parseInt(rankofplayer.level);

    if (expirienceofplayer >= expiriencetogefornextplayerlvl) {
        rankofplayer.level = acctuallvlofplayer + 1;

        var channeltosendnextlvlmessage = message.guild.channels.cache.get('841712082306334750');

        var messagesender = message.guild.members.cache.get(message.author.id);
        channeltosendnextlvlmessage.send(`**Gratulacje: <@${rankofplayer.userID}> Udało ci się wbić kolejny lvl! To już twój: ${rankofplayer.level}lvl!**`);
        
        var nextlvlplayer = expiriencetogefornextplayerlvl * 3;
        nextlvlplayer.toString();
        
        rankofplayer.experienceToNextLvl = nextlvlplayer;

        if (rankofplayer.level >= 1 && rankofplayer.level < 5) {
            messagesender.roles.add('841264313087033374');
        } else if (rankofplayer.level >= 5 && rankofplayer.level < 10) {
            messagesender.roles.add('841264314937114644');
        } else if (rankofplayer.level >= 10 && rankofplayer.level < 25) {
            messagesender.roles.add('841264317076996096');
        } else if (rankofplayer.level == 25) {
            messagesender.roles.add('841711436752486425');
        }
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

        var wkurwiajacawiadomosc = message.content.toLowerCase();

        if (wkurwiajacawiadomosc == "jestem debilem" || wkurwiajacawiadomosc == "jestem idiotą" || wkurwiajacawiadomosc == "jestem śmieciem" || wkurwiajacawiadomosc == "jestem głupi") {
            message.channel.send("Tak, jesteś zgodze się");
        } else if (wkurwiajacawiadomosc == "bot jest głupi" || wkurwiajacawiadomosc == "jesteś głupi"){
            message.channel.send("chyba ty")
        } else {
          message.channel.send(message.content);
        }

    } else {
        return;
    }

    
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
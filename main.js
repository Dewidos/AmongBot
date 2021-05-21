var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
Client.commands = new Discord.Collection();

var lastUpdateDate = new Date();
var firstFetch = true;

const prefix = "ab!";

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
}

Client.on('message', message => {
    checkUpdates();
    if (message.content.startsWith(prefix) && !message.author.bot) {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        try {
            Client.commands.get(command).execute(message, args);
        } catch (error) {
            message.channel.send(`Nie znam takiej komendy :tired_face:. Jeżeli chcesz poznać listę moich komend, wpisz **${prefix}help**.`);
            console.error(error);
        }
    }
});

function checkUpdates() {
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function() {
        if (xhr.status === 200)
        {
            var response = JSON.parse(xhr.responseText);
            var releaseDate = Date.parse(response[0].published_at);

            if (lastUpdateDate != releaseDate && !firstFetch)
            {
                console.log("Mamy update!");
                lastUpdateDate = releaseDate;
            }
            else if (firstFetch)
            {
                firstFetch = false;
            }
        }
    }
        
    xhr.open('GET', 'https://api.github.com/repos/slushiegoose/Town-Of-Us/releases', true);
    xhr.send(null);
}

Client.login("ODQ0OTI2NzE3MDg0MDQxMjM4.YKZhUw.LACq4pIL6MAufhWJgPS-NIXCG1g");
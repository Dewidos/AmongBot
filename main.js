const Discord = require('discord.js');
const Client = new Discord.Client();
const fs = require('fs');
Client.commands = new Discord.Collection();

const prefix = "ab!";

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command);
}

Client.once('ready', () => {
    console.log("Dziala");
});

Client.on('message', message => {
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

Client.login("ODQ0OTI2NzE3MDg0MDQxMjM4.YKZhUw.DhKuyKEHH8V4d8cBjvwld1qt8T4");
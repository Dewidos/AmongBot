const Discord = require('discord.js');

module.exports = async (message, client) => {

    var config = client.configFile.find(c => c.guildId == message.guild.id);

    if (typeof config === 'undefined') {
        message.channel.send("Błąd konfiguracji bota!");
        return;
    }

    var poleceni = client.poleceni.find(e => e.guildId == message.guild.id);

    if (typeof poleceni === 'undefined') {
        message.channel.send("Błąd konfiguracji systemu poleceń!");
        return;
    }

    var reason, ocena, id;

    const messageFetched = message;

    let lines = messageFetched.content.split("\n");

    lines.forEach(l => lines[lines.indexOf(l)] = l.split(": "));

    try {
        if (lines.length != 3) throw new Error("Za mało pól polecenia!");

        let idLine = lines.find(l => l[0].toLowerCase() == "nazwa");

        if (typeof idLine === 'undefined') throw new Error("Musisz podać ID bądź oznaczyć polecanego admina!");

        id = idLine[1].replace(/[\\<>@#&!]/g, "");

        let markLine = lines.find(l => l[0].toLowerCase() == "ocena");

        if (typeof markLine === 'undefined') throw new Error("Musisz podać ocenę admina (liczba od 1 do 5)!");

        ocena = parseInt(markLine[1]);

        if (typeof ocena === 'undefined' || isNaN(ocena) || Math.floor(ocena) != ocena || !(ocena <= 5 || ocena > 0)) throw new Error("Oceną musi być liczba od 1 do 5!");

        let reasonLine = lines.find(l => ["za", "powód", "dlaczego"].includes(l[0].toLowerCase()));

        if (typeof reasonLine === 'undefined') throw new Error("Musisz podać nam dlaczego chcesz polecić tego admina!");

        reason = reasonLine[1];
    } catch (error) {
        message.channel.send(error.message);
        return;
    }

    if (message.author.id == id) {
        message.channel.send("Nie możesz sam sobie wystawić pochwały!");
        return;
    }

    if (config.moderatorRoles.length <= 0) {
        message.channel.send("Błąd konfiguracji! Nikt nie skonfigurował roli moderatorskich.");
        return;
    }

    var adminDoPolecenia = message.guild.members.cache.get(id);

    if (typeof adminDoPolecenia === 'undefined') {
        message.channel.send("Nie znalazłem żadnego administratora o takim ID!");
        return;
    }

    var hasPermission = true;

    config.moderatorRoles.forEach(role => {
        if (message.member.roles.cache.has(role)) {
            hasPermission = false;
        }
    });

    if (!hasPermission) {
        message.channel.send("Administrator nie może wystawiać pochwał!");
        return;
    }

    var isAdmin = false;

    config.moderatorRoles.forEach(role => {
        if (adminDoPolecenia.roles.cache.has(role)) {
            isAdmin = true;
        }
    });

    if (!isAdmin) {
        message.channel.send("Nie znalazłem żadnego administratora o takim ID!");
        return;
    }

    var poleceniaTegoGracza = poleceni.polecenia.find(p => p.ktoPoleca == message.author.id && p.userId == id);

    if (typeof poleceniaTegoGracza !== 'undefined') {
        message.channel.send("Już raz poleciłeś tego admina!");
        return;
    }

    poleceni.polecenia.push({
        "userId": id,
        "stars": ocena,
        "reason": reason,
        "ktoPoleca": message.author.id
    });

    var embed = new Discord.MessageEmbed()
        .setColor('#34c6eb')
        .setTitle("Twoje polecenie zostało przekazane do bazy danych :smiley:")
        .setDescription(`**Poleciłeś gracza <@${id}>\nZa:** ${reason}\n**Twoja ocena:** ${ocena}`)
        .setFooter("Pamiętaj, nie możesz polecić tego samego admina kilka razy!");

    message.channel.send(embed);

}
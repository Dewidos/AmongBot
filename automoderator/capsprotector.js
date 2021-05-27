const warnScript = require('./../commands/warn');

module.exports = (message, client) => {
    var config = client.configFile.find(c => c.guildId == message.guild.id);

    if (typeof config === 'undefined' || typeof config.autoModConfig === 'undefined') {
        console.error("Błąd konfiguracji automoda!");
        return;
    }

    var protectorConfig = config.autoModConfig.find(c => c.name == "CapsProtector");

    if (typeof protectorConfig === 'undefined') return;

    var punishments = client.punishments.find(p => p.guildId == message.guild.id);

    if (typeof punishments === 'undefined') {
        console.error("Błąd konfiguracji kar!");
        return;
    }
    
    var msgContent = message.content;
    msgContent = msgContent.toLowerCase();

    var counter = 0;
    var maxCapsCount = 0;
    for (const key of msgContent) {
        if (key == ' ') continue;
        
        var index = msgContent.indexOf(key);

        if (message.content[index] != key) counter++;
        else counter = 0;

        if (counter > maxCapsCount) maxCapsCount = counter;
    }

    try {
        
        var player = message.member;
        
        var warnCapsCount = 6;

        if (typeof protectorConfig.capsLetterCount !== 'undefined') warnCapsCount = protectorConfig.capsLetterCount;

        if (maxCapsCount >= warnCapsCount) {
            punishments.warnings.push({
                "userId": message.author.id,
                "issuerId": '844926717084041238',
                "warnId": punishments.nextWarnId,
                "reason": "CapsProtector Automod Module"
            });
    
            var nextId = parseInt(punishments.nextWarnId);
            nextId++;
            punishments.nextWarnId = nextId.toString();

            warnScript.giveWarnRole(punishments.warnings.filter(w => w.userId == message.author.id).length, player, config.warningRoles);
            client.updateConfig();
        }

    } catch (error) {
        console.log(error);
        return;
    }
};
module.exports = {
    "name": "otpwkurw",
    "description": "Maszynka do wkurwiania otp.",
    execute(message, args, client) {
        if (typeof args[0] === 'undefined' || args[0] == "") return;

        if (message.channel.isText()) return;

        switch (args[0]) {
            case "tak":
                client.wkurwEnabled = true;
                break;
            case "nie":
                client.wkurwEnabled = false;    
                break;
            default:
                break;
        }

        this.wkurwHandler(message.channel);
    },
    async wkurwHandler(channel) {
        console.log("H2O");
        if (client.wkurwEnabled) {
            channel.join().then(() => setTimeout(() => {
                channel.leave().then(() => setTimeout(() => {
                    this.wkurwHandler(channel);
                }, 1000));
            }, 1000));
        }
    }
}
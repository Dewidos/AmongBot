module.exports = {
    "name": "otpwkurw",
    "description": "Maszynka do wkurwiania otp.",
    execute(message, args, client) {
        console.log("H2O");
        console.log(args);
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
                return;
        }

        this.wkurwHandler(message.channel);
    },
    async wkurwHandler(channel) {
        if (client.wkurwEnabled) {
            channel.join().then(() => setTimeout(() => {
                channel.leave().then(() => setTimeout(() => {
                    this.wkurwHandler(channel);
                }, 1000));
            }, 1000));
        }
    }
}
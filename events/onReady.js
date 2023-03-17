const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const date = new Date();
        const [day, month, year, hours, minutes] = [
            date.getDate(),
            date.getMonth(),
            date.getFullYear(),
            date.getHours(),
            date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        ];
        client.user.setActivity('the mayor', { type: ActivityType.Listening });
        console.log(`${client.user.tag} online.\n${month+1}/${day}/${year} ${hours}:${minutes}`);
    }
}
const { Events, ActivityType } = require('discord.js');

// Grab channel IDs
let channelLibrary;
let channelWorkout;

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
            date.getMinutes(),
        ];
        client.user.setActivity('the mayor', { type: ActivityType.Listening });
        console.log(`${client.user.tag} online.\n${month+1}/${day}/${year} ${hours}:${minutes}`);
        channelLibrary = client.channels.cache.find(ch => ch.name === "the-library" && ch.guild.id === process.env.SERVER.toString());
        channelWorkout = client.channels.cache.find(ch => ch.name === 'diet-slash-exercise' && ch.guild.id === process.env.SERVER.toString());
    }
}
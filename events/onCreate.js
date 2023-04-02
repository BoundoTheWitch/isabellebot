const { Events } = require('discord.js');
const db = require('../database');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        const client = require('../app');
        const msgId = message.id;
        const msgContent = message.content.toString();
        const username = message.author.username;
        const channelname = message.channel.name;

        if (message.author.bot)
            return;

        db.newMessage(msgId, channelname, username, msgContent);
    }
}
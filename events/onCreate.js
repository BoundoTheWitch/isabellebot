const { Events } = require('discord.js');
const db = require('../stars-db');

module.exports = {
    name: Events.MessageCreate,
    execute(message) {
        const client = require('../app');
        const msgId = message.id;
        const msgContent = message.content.toString();
        const userId = message.member.id;
        const channelId = message.channelId;

        if (message.author.bot)
            return;

        db.newMessage(msgId, channelId, userId, msgContent);
    }
}
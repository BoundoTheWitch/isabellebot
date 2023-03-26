const { Events, ActivityType } = require('discord.js');
const db = require('../stars-db');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const date = new Date();
        const [day, month, year, hours, minutes] = [
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear(),
            date.getHours(),
            date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        ];

        const guild = client.guilds.cache.get(process.env.SERVER);
        let usr = await guild.members.fetch();
        let chnl = await guild.channels.fetch();
        let users = [];
        let channels = [];



        usr.forEach(data => {
            if (data.user.bot) return;
            else
                users.push({ 'user_id': data.user.id, 'username': data.user.username });
        });

        chnl.forEach(data => {
            if (data.type !== 0) return;
            else
                channels.push({ 'channel_id': data.id, 'channel_name': data.name });
        });

        await db.updateUsersChannels(users, channels);


        console.log(`${client.user.tag} online.\n${month}/${day}/${year} ${hours}:${minutes}`);
    }
}
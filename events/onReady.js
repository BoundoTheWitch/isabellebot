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
        let res = await guild.members.fetch();
        let users = [];
        res.forEach(data => {
            if (data.user.bot) return;
            else
                users.push({ 'user_id': data.user.id, 'username': data.user.username });
        });

        await db.updateUsers(users);

        console.log(`${client.user.tag} online.\n${month}/${day}/${year} ${hours}:${minutes}`);
    }
}
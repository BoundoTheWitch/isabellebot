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
        
        console.log(`${client.user.tag} online.\n${month}/${day}/${year} ${hours}:${minutes}`);
    }
}
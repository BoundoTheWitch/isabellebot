const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('star')
        .setDescription('Leave your star for your streak in the library!'),
    async execute(interaction) {
        let res = await db.checkUser(interaction.user.id);
        if (res) {
            await db.addStar(interaction.user.id);
            await interaction.reply({ content: 'Thank you for your star today! <:star:1052274989216305243>', ephemeral: true});
        } else {

        }
    }
};
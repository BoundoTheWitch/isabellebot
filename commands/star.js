const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('star')
        .setDescription('Leave your star for your streak in the library!'),
    async execute(interaction) {
        let starToday = await db.checkStar(interaction.user.id);
        let currUser = await db.checkUser(interaction.user.id);
        if (currUser) {
            if (starToday) {
                await interaction.reply({ content: "Looks like you've already put a star down today. Good job!", ephemeral: true });
            } else {
                await db.addStar(interaction.user.id);
                await interaction.reply({ content: 'Thank you for your star today! <:star:1052274989216305243>', ephemeral: true});
            }
        }
    }
};
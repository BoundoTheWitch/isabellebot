// TODO Implement
/* 
    Concept: User leaves star. No matter what update database to either count their star or
    add them to the database. Other command ideas include bringing up the current list of
    stars with their current streak, and each user's highest streak.
*/
const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('star')
        .setDescription('Leave your star for your streak in the library!'),
    async execute(interaction) {
        db.addStar(interaction.user.id);
        await interaction.reply('Thank you for your star today! <:star:1052274989216305243>');
    }
};
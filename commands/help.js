const { SlashCommandBuilder } = require('discord.js');
const list = require('./list.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display list of Isabelle\'s commands'),
    async execute(interaction) {
        await interaction.reply(`This is a list of commands.`);
    }
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Man-made horrors.'),
    async execute(interaction) {
        await interaction.reply('No.')
    }
};
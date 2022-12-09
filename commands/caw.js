const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('caw')
        .setDescription('A corvid-based call.'),
    async execute(interaction) {
        await interaction.reply('Caw caw, baby! (crow emote)')
    }
};
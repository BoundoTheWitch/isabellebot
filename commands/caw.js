const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('caw')
        .setDescription('A corvid-based call.'),
    async execute(interaction) {
        const caw = interaction.guild.emojis.cache.find(e => e.name === "caw");
        await interaction.reply(`Caw caw, baby! ${caw}`);
    }
};
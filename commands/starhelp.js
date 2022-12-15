const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starhelp')
        .setDescription('Rules and info about the Stars Streak in the library'),
    async execute(interaction) {
        await interaction.reply({ content: `The purpose of the Star Streak challenge is to encourage reading for up to 30 minutes each day. For each day you do your reading you add to your streak. Miss a day then you will start back at 1 star. Don't get too competitve though, it's all in the name of fun afterall!\n\nReading material can include books, textbooks, manga, comic books; anything that's "meaningful." Things like reading a lot of fortunes from fortune cookies do not count, however I'd be very concerned if you managed to eat that many.\n\nIf you're curious about you and others streaks feel free to use \`/starstreaks\`!`, ephemeral: true })
    }
};
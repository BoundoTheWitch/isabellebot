const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');
const { currentTime } = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('star')
        .setDescription('Leave your star for your streak in the library!'),
    async execute(interaction) {
        let currUser = await db.checkUser(interaction.user.id);
        if (currUser) {
            let starToday = await db.checkStar(interaction.user.id);
            if (starToday) {
                await interaction.reply({ content: `Looks like you've already left a star today. Good job!\n(Start of a new day starts at \`6am\`. It's currently \`${currentTime()}\`)`, ephemeral: true });
            } else {
                await db.addStar(interaction.user.id, interaction.member.displayName);
                await interaction.reply({ content: `<:star:1052274989216305243> Thank you for your star today! <:star:1052274989216305243>`, ephemeral: true});
            }
        } else {
            await db.newUser(interaction.user.id, interaction.member.displayName);
            await interaction.reply({ content: `Hey there ${interaction.user}! Looks like it's your first time. Welcome! I have recorded your first star. If you need some clarity of the rules, feel free to use the \`/starhelp\` command for more info. Happy reading! <:books:1052807705544372244>` })
        }
    }
};
const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');
const { currentTime } = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('star')
        .setDescription('Leave your star for your streak in the library!'),
    async execute(interaction) {
        const currUser = await db.checkUser(interaction.user.id);
        const currChannel = interaction.channel.name;
        if (currChannel === 'the-library' || currChannel === 'diet-slash-exercise') {
            if (currUser) {
                let type = currChannel === "the-library" ? "READING" : "WORKOUT";
                let status = await db.checkStar(interaction.user.id, type);
                if (status === "SAMEDAY")
                    await interaction.reply({ content: `Looks like you've already left a star today. Good job!\n(Start of a new day starts at \`6am\`. It's currently \`${currentTime()}\`)`, ephemeral: true });
                else {
                    if (currChannel === 'the-library') {
                        await db.addStar(interaction.user.id, interaction.member.displayName, 'READING', status);
                        await interaction.reply({ content: `⭐ Thank you for leaving your star today! ⭐` });
                    } else if (currChannel === 'diet-slash-exercise') {
                        await db.addStar(interaction.user.id, interaction.member.displayName, 'WORKOUT', status);
                        await interaction.reply({ content: `💪 Thank you for leaving your star today! 💪\n*(Don't forget to drink some water 🥤)*` });
                    }
                }
            } else {
                await db.newUser(interaction.user.id, interaction.member.displayName);
                await interaction.reply({ content: `Hey there ${interaction.user}! Looks like it's your first time. Welcome! I have recorded your first star. If you need some clarity of the rules, feel free to use the \`/starboard\` command for more info. This applies for reading and workout stars!` })
            }
        } else {
            await interaction.reply({ content: 'Oops, you need to use that in `#the-library` or `#diet-slash-exercise`', ephemeral: true })
        }
    }
};
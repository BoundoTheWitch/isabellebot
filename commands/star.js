const { SlashCommandBuilder } = require('discord.js');
const db = require('../stars-db');
const { currentTime } = require('../misc /utility');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('star')
        .setDescription('Leave your star for your streak in #the-library, or in #diet-slash-exercise'),
    async execute(interaction) {
        const currUser = await db.checkUser(interaction.user.id);
        const currChannel = interaction.channel.name;

        if (currChannel === 'the-library' || currChannel === 'diet-slash-exercise') {
            const type = currChannel === "the-library" ? "READING" : "WORKOUT";
        
            if (currUser) {
                let status = await db.checkStar(interaction.user.id, type);
        
                if (status === "SAMEDAY")
                    await interaction.reply({ content: `Looks like you've already left a star today. Good job!\n(Start of a new day starts at \`6am\`. It's currently \`${currentTime()}\`)`, ephemeral: true });
                else {
                    if (currChannel === 'the-library') {
                        await db.addStar(interaction.user.id, interaction.member.displayName, 'READING', status);
                        await interaction.reply({ content: `⭐ Thank you for leaving your star today! ⭐` });
                    } else if (currChannel === 'diet-slash-exercise') {
                        let outcome;

                        await db.addStar(interaction.user.id, interaction.member.displayName, 'WORKOUT', status);

                        if (await db.checkSuperStar(interaction.user.id))
                            outcome = '💪 ✨ You got a super star! ✨ 💪\n';
                        else
                            outcome = `💪 Thank you for leaving your star today! 💪\n`;
                        
                        await interaction.reply({ content: `${outcome}` });
                    }
                }
            } else {
                await db.newUser(interaction.user.id, interaction.member.displayName);
                await db.addStar(interaction.user.id, interaction.member.displayName, type, 'GOOD');
                await interaction.reply({ content: `Hey there ${interaction.user}! Looks like it's your first time. Welcome! I have recorded your first star. If you need some clarity of the rules, feel free to use the \`/starhelp\` command for more info and \`/starboard\` to see the leaderboard. This applies for reading and workout stars!` })
            }
        } else {
            await interaction.reply({ content: 'Oops, you need to use that in `#the-library` or `#diet-slash-exercise`', ephemeral: true })
        }
    }
};
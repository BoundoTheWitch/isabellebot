// Registers commands
const fs = require('node:fs');
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

console.log(commands);

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Refreshing ${commands.length} commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT, process.env.SERVER),
            { body: commands },
        );
    } catch (err) {
        console.error(err);
    }
})();
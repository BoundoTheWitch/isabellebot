const urlFilter = require('./urlFilter');

const dotenv = require('dotenv');
dotenv.config();

const fs = require('node:fs');
const path = require('path');

// Discord.js
const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, MessageType } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();

// Populating commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
let list = []; // Empty list of commands to add to file later

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        list.push({name: command.data.name, desc: command.data.description});
    } else {
        console.log(`Command "/${filePath}" is missing 'data' or 'execute'. Skipping.`);
    }
}

// Write list to file
fs.writeFile('./commands/list.json', JSON.stringify(list), (err) => {
    if (err) return console.error(err);
});

// On startup
client.on('ready', () => {
    client.user.setActivity('the mayor', { type: ActivityType.Listening });
    console.log(`${client.user.tag} online.`);
});

// Message posted
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Invalid command ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'Hmmm...there was an error trying to do that command.', ephemeral: true });
    }
});

// TODO Move events to seperate files to clean up


// Edited messages
client.on('messageUpdate', async (msg, newMsg) => {
    try {
        const logchannel = client.channels.cache.find(ch => ch.name === "event-logs");
        if (msg.author.id === client.user.id) {
            return;
        } else {
            if (msg.content === msg.newMsg) {
                return;
            } else {
                const embed = new EmbedBuilder()
                    .setColor(0x4781f0)
                    .setTitle("Message was edited")
                    .addFields({ name: "Old message", value: urlFilter(msg.content) })
                    .addFields({ name: "New message", value: urlFilter(newMsg.content) })
                    .setFooter({ text: "From #" + msg.channel.name + "\nBy " + msg.author.username });
                logchannel.send({ embeds: [embed] });
            }
        }
    } catch (err) {
        console.log(err);
    }
});

// On message delete
client.on("messageDelete", msg => {
    try {
        if (msg.author.id === client.user.id) {
            return;
        } else {
            const logchannel = client.channels.cache.find(ch => ch.name === "event-logs");
            const embed = new EmbedBuilder()
                .setColor(0xf16363)
                .setTitle("Message was deleted")
                .addFields({ name: "Message", value: urlFilter(msg.content) })
                .setFooter({ text: "From #" + msg.channel.name + "\nBy " + msg.author.username })
        
            logchannel.send({ embeds: [embed] });
        }
    } catch (err) {
        console.log(err);
    }
})

client.login(process.env.TOKEN);
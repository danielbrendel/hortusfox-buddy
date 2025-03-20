import { SlashCommandBuilder } from '@discordjs/builders';
import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = [
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get some infos'),
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get some stats'),
    new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Perform admin operation')
        .addSubcommand(subcmd => 
            subcmd.setName('set')
                .setDescription('Stores guild specific data')
                .addStringOption(option => 
                    option.setName('item')
                    .setDescription('The item to update')
                    .setRequired(true)
                )
                .addStringOption(option => 
                    option.setName('value')
                    .setDescription('The value to be stored')
                    .setRequired(true)
                )
        )
]
.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
})();

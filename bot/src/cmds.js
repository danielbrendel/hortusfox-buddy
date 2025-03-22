import { SlashCommandBuilder } from '@discordjs/builders';
import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = [
    new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get some infos'),
    new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess the current appeared plant')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('The assumed name of the plant')
            .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('plantscore')
        .setDescription('Get your current game score'),
    new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Perform admin operations')
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
        .addSubcommand(subcmd => 
            subcmd.setName('game')
                .setDescription('Game specific operations')
                .addStringOption(option => 
                    option.setName('operation')
                    .setDescription('Either start or stop as game status, or leaderboard to show the current top scores')
                    .setRequired(true)
                )
        )
        .addSubcommand(subcmd => 
            subcmd.setName('stats')
                .setDescription('Shows usage statistics for your server')
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

import { Client, GatewayIntentBits, REST, PermissionsBitField } from 'discord.js';
import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import mysql from 'mysql2';
import Game from './game.js';

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

var game = null;
var interval = null;

function abort(msg)
{
    console.error(`\x1b[31m${msg}\x1b[0m`);
    process.exit(1);
}

function success(msg)
{
    console.log(`\x1b[32m${msg}\x1b[0m`);
}

function log(gid, mid, content)
{
    if (parseInt(process.env.LOG_ENABLE)) {
        db.query('INSERT INTO history (guild_id, member_id, content) VALUES (?, ?, ?)', [gid, mid, content], (err, results) => {
            if (err) {
                console.log('Error inserting history entry: ' + err.message);
            }
        });
    }
}

function cmd_info(interaction)
{
    interaction.reply({
        content: "🤖 HortusBuddy\nA Discord Bot for Plant Enthusiasts\n⚡Powered by HortusFox: https://www.hortusfox.com\n🌱 HortusFox is a selfhosted, collaborative management app for indoor and outdoor plants!",
        ephemeral: true
    });
}

async function cmd_guess(interaction)
{
    await interaction.deferReply();

    game.guess(interaction);
}

async function cmd_plantscore(interaction)
{
    await interaction.deferReply();

    game.memberPoints(interaction);
}

async function cmd_admin(interaction)
{
    await interaction.deferReply();
    
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await interaction.editReply({ content: '🔒 You need to have **admin** permissions to use this command!', ephemeral: true });
        return;
    }

    initGuild(interaction.guild.id);

    const subcmd = interaction.options.getSubcommand();

    try {
        if (subcmd === 'set') {
            const item = interaction.options.getString('item');
            const value = interaction.options.getString('value');

            if (item === 'apikey') {
                db.query('UPDATE guilds SET api_key = ? WHERE guild_id = ?', [value, interaction.guild.id], (err, results) => {
                    if (err) {
                        interaction.editReply({ content: `❌ Failed to update API key: ` + err.message, ephemeral: false });
                    } else {
                        interaction.editReply({ content: `✅ Successfully updated API key`, ephemeral: false });
                    }
                });
            } else if (item === 'recchan') {
                const channel = interaction.guild.channels.cache.find(c => c.name === value);

                db.query('UPDATE guilds SET chan_recognition = ? WHERE guild_id = ?', [channel.id, interaction.guild.id], (err, results) => {
                    if (err) {
                        interaction.editReply({ content: `❌ Failed to update recognition channel ID: ` + err.message, ephemeral: false });
                    } else {
                        interaction.editReply({ content: `✅ Successfully updated recognition channel ID`, ephemeral: false });
                    }
                });
            } else if (item === 'gamechan') {
                const channel = interaction.guild.channels.cache.find(c => c.name === value);

                db.query('UPDATE guilds SET chan_guessgame = ? WHERE guild_id = ?', [channel.id, interaction.guild.id], (err, results) => {
                    if (err) {
                        interaction.editReply({ content: `❌ Failed to update game channel ID: ` + err.message, ephemeral: false });
                    } else {
                        interaction.editReply({ content: `✅ Successfully updated game channel ID`, ephemeral: false });
                    }
                });
            } else {
                throw new Error('❌ Unknown data item: ' + item);
            }
        } else if (subcmd === 'game') {
            const operation = interaction.options.getString('operation');

            if (operation === 'start') {
                if (!interval) {
                    db.query('SELECT * FROM `guilds` WHERE guild_id = ?', [interaction.guild.id], (err, results) => {
                        if (!err) {
                            const gameChannel = results[0].chan_guessgame;
                            if ((!gameChannel) || (gameChannel.length == 0)) {
                                interaction.editReply({ content: `❌ No game channel was set. Please set one before starting the game.`, ephemeral: false });
                                return;
                            }

                            game.setGameChan(gameChannel);
                            game.setGameStatus(true);

                            interval = setInterval(() => {
                                gameLoop();
                            }, process.env.TIMER_INTERVAL);

                            interaction.editReply({ content: `✅ Game has been started`, ephemeral: false });
                        } else {
                            interaction.editReply({ content: `❌ Error fetching data: ` + err.message, ephemeral: false });
                        }
                    });
                } else {
                    interaction.editReply({ content: `Game is already started`, ephemeral: false });
                }
            } else if (operation === 'stop') {
                game.setGameStatus(false);
                clearInterval(interval);
                interaction.editReply({ content: `✅ Game has been stopped`, ephemeral: false });
            } else if (operation === 'leaderboard') {
                game.leaderboard(interaction.guild.id);
                interaction.editReply({ content: `✅ Leaderboard has been published`, ephemeral: false });
            } else {
                throw new Error('❌ Unknown operation: ' + operation);
            }
        } else if (subcmd === 'stats') {
            db.query('SELECT COUNT(*) AS count_total, COUNT(DISTINCT member_id) AS count_users FROM history WHERE guild_id = ?', [interaction.guild.id], (err, results) => {
                if (err) {
                    interaction.editReply({ content: `❌ Failed to query history data: ` + err.message, ephemeral: false });
                } else {
                    const opcount = results[0].count_total;
                    const usercount = results[0].count_users;

                    interaction.editReply({ content: `📊 There have been ${opcount} operations by ${usercount} users performed`, ephemeral: false });
                }
            });
        } else {
            throw new Error('❌ Unknown admin command: ' + subcmd);
        }
    } catch (err) {
        interaction.editReply({ content: err.message, ephemeral: false });
        return;
    }
}

const commands = [
    {
        name: 'hortusbuddy',
        description: 'Get information about the HortusBuddy Bot',
        handler: cmd_info
    },
    {
        name: 'guess',
        description: 'Guess the current appeared plant',
        handler: cmd_guess
    },
    {
        name: 'plantscore',
        description: 'Get your current game score',
        handler: cmd_plantscore
    },
    {
        name: 'hfbud',
        description: 'Perform HortusBuddy specific admin operations',
        handler: cmd_admin
    }
];

function handleCommand(interaction)
{
    for (let i = 0; i < commands.length; i++) {
        if (interaction.commandName === commands[i].name) {
            commands[i].handler(interaction);
            log(interaction.guild.id, interaction.member.id, `${interaction.user.username} has issued the command /${interaction.commandName}`);
        }
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect(err => {
    if (err) {
        abort('Could not connect to MariaDB:' + err);
    }

    success('Connected to database!');
});

function gameLoop()
{
    if (game) {
        game.acquirePlant();
    }
}

function initGuild(guildId)
{
    db.query('SELECT * FROM guilds WHERE guild_id = ?', [guildId], async (err, results) => {
        if (err) {
            console.log('Error inserting guild ID into database:' + err.message);
            return;
        }

        if (results.length == 0) {
            db.query('INSERT INTO guilds (guild_id) VALUES (?)', [guildId], (err, results) => {
                if (err) {
                    console.log('Error inserting guild ID into database:' + err.message);
                    return;
                }
        
                console.log(`Guild ID ${guildId} inserted into database.`);
            });
        }
    });
}

client.once('ready', async () => {
    game = new Game(client, db);
    
    success(`Logged in: ${client.user.tag}. Bot is now ready.`);
});

client.on('guildCreate', (guild) => {
    initGuild(guild.id);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    handleCommand(interaction);
});

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return;

        const guildId = message.guild.id;
        var reply = null;

        db.query('SELECT * FROM guilds WHERE guild_id = ?', [guildId], async (err, results) => {
            if (results.length > 0) {
                const apikey = results[0].api_key;
                const recchan = results[0].chan_recognition;

                if ((recchan.length > 0) && (message.channel.id === recchan)) {
                    if (message.attachments.size > 0) {
                        reply = await message.reply('🔄 Processing your image...');

                        const imageAttachment = message.attachments.first();
        
                        if (imageAttachment) {
                            const fileUrl = imageAttachment.url.replace("media.discordapp.net", "cdn.discordapp.com");
                            
                            const fileType = imageAttachment.contentType;
    
                            const response = await fetch(fileUrl);
                            const arrayBuffer = await response.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
    
                            let finalImagePath = `downloaded-image.${fileType.includes('jpeg') ? 'jpg' : 'png'}`;;
    
                            fs.writeFileSync(finalImagePath, buffer);
                        
                            const formData = new FormData();
                            formData.append('organs', 'auto');
                            formData.append('images', fs.createReadStream(finalImagePath));
    
                            const apiQuery = await axios.post('https://my-api.plantnet.org/v2/identify/all?api-key=' + apikey, formData, {
                                headers: formData.getHeaders()
                            });
                            
                            if (typeof apiQuery.data.statusCode !== 'undefined') {
                                throw new Error('Error: server returned with status ' + apiQuery.data.statusCode);
                            }
    
                            if ((typeof apiQuery.data.results === 'undefined') || (apiQuery.data.results.length == 0)) {
                                throw new Error('Plant could not be identified.');
                            }
    
                            let resultStr = '';
                            
                            for (let i = 0; i < apiQuery.data.results.length; i++) {
                                resultStr += apiQuery.data.results[i].species.scientificNameWithoutAuthor + ' (' + (apiQuery.data.results[i].score * 100).toFixed(2) + '%)\n';
                            }
    
                            await reply.edit('✅ Processing complete! Results:\n\n' + resultStr);
    
                            if (fs.existsSync(finalImagePath)) {
                                fs.unlinkSync(finalImagePath);
                            }

                            log(guildId, message.author.id, `${message.author.username} has issued a plant recognition operation`);
                        }
                    }
                }
            }
        });
    } catch (err) {
        if (reply) {
            await reply.edit('❌ Error: ' + err.message);
        } else {
            console.log(err);
        }
    }
});

client.login(process.env.BOT_TOKEN);

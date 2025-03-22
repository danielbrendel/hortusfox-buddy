import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AttachmentBuilder } from 'discord.js';
import { randomUUID } from 'crypto';

export default class Game {
    client = null;
    sql = null;
    gameChan = null;
    currentPlant = null;
    currentSession = null;
    gameStatus = false;

    constructor(client, db, channel = null)
    {
        this.client = client;
        this.sql = db;
        this.gameChan = channel;
        this.currentPlant = null;
        this.currentSession = null;
        this.gameStatus = false;
    }

    setClient(client)
    {
        this.client = client;
    }

    setDbInstance(db)
    {
        this.sql = db;
    }

    setGameChan(chan)
    {
        this.gameChan = chan;
    }

    setGameStatus(status)
    {
        this.gameStatus = status;
    }

    acquirePlant()
    {
        if (!this.gameStatus) {
            return;
        }

        this.sql.query('SELECT * FROM `plants` ORDER BY RAND() LIMIT 1', [], (err, results) => {
            if (results.length == 1) {
                this.currentPlant = results[0];
                this.currentSession = randomUUID();

                const channel = this.client.channels.cache.get(this.gameChan);
                if (channel) {
                    const chanMsg = `A wild plant has appeared! Guess the name to earn ${results[0].points} points!\n`;
                    const attachment = new AttachmentBuilder(`${dirname(dirname(fileURLToPath(import.meta.url)))}\\img\\${results[0].photo}`);

                    channel.send({ content: chanMsg, files: [attachment] });
                }
            }
        });
    }

    guess(interaction)
    {
        if ((!this.gameStatus) || (!this.currentPlant)) {
            interaction.editReply({ content: `Game is currently not running!`, ephemeral: true });
            return;
        }

        const plantName = interaction.options.getString('name');

        if (plantName.toLowerCase().trim() == this.currentPlant.name.toLowerCase().trim()) {
            this.sql.query('SELECT * FROM `guesses` WHERE member_id = ? AND guild_id = ? AND session_id = ?', [interaction.member.id, interaction.guild.id, this.currentSession], (err, results) => {
                if (results.length == 0) {
                    this.sql.query('SELECT * FROM `scores` WHERE member_id = ? AND guild_id = ?', [interaction.member.id, interaction.guild.id], (err, results) => {
                        if (results.length == 0) {
                            this.sql.query('INSERT INTO `scores` (guild_id, member_id, points) VALUES(?, ?, 0)', [interaction.guild.id, interaction.member.id], (err, results) => {});
                            this.updatePoints(interaction);
                            return;
                        }
                    });
        
                    this.updatePoints(interaction);
                } else {
                    interaction.editReply(`😏 Hey, you've already scored for this plant!`);
                }
            });
        } else {
            interaction.editReply(`🥲 Oops! You guessed wrong!`);
        }
    }

    updatePoints(interaction)
    {
        this.sql.query('UPDATE `scores` SET points = points + ? WHERE member_id = ? AND guild_id = ?', [this.currentPlant.points, interaction.member.id, interaction.guild.id], (err, results) => {
            interaction.editReply(`🎯 Correct! You earned +${this.currentPlant.points} points!`);
        });

        this.sql.query('INSERT INTO `guesses` (guild_id, member_id, session_id) VALUES(?, ?, ?)', [interaction.guild.id, interaction.member.id, this.currentSession], (err, results) => {});
    }

    memberPoints(interaction)
    {
        this.sql.query('SELECT * FROM `scores` WHERE member_id = ? AND guild_id = ?', [interaction.member.id, interaction.guild.id], (err, results) => {
            if (results.length > 0) {
                interaction.editReply(`You have currently earned ${results[0].points} points`);
            } else {
                interaction.editReply(`Looks like you haven't played yet!`);
            }
        });
    }

    leaderboard(guildId)
    {
        this.sql.query('SELECT * FROM `scores` WHERE guild_id = ? ORDER BY points DESC LIMIT 10', [guildId], async (err, results) => {
            const channel = this.client.channels.cache.get(this.gameChan);
            if (channel) {
                const guild = this.client.guilds.cache.get(guildId);
                var chanMsg = `🌟 Here are the current top plant gamers!\n\n`;

                for (var i = 0; i < results.length; i++) {
                    const member = await guild.members.fetch(results[i].member_id);

                    chanMsg += `#${i+1} ${member.user.username} (${results[i].points} points)\n`;
                }

                chanMsg += `\n➡️ The scores have been reset. New round is active!\n`;

                this.sql.query('UPDATE `scores` SET points = 0 WHERE guild_id = ?', [guildId], (err, results) => {});

                channel.send(chanMsg);
            }
        });
    }
}

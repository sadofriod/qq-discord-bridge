'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const logger = require('./logger');
const config = require('./config');

async function createDiscordBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  return new Promise((resolve, reject) => {
    client.once('ready', () => {
      logger.info(`✅ Discord Bot 上线: ${client.user.tag}`);
      resolve(client);
    });

    client.on('error', (err) => {
      logger.error('❌ Discord Bot 错误:', err.message);
    });

    client.login(config.DISCORD_TOKEN).catch(reject);
  });
}

module.exports = { createDiscordBot };

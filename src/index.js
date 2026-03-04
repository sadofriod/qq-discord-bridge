'use strict';
const { createQQBot } = require('./qqBot');
const { createQQOfficialBot } = require('./qqOfficialBot');
const { createDiscordBot } = require('./discordBot');
const { createBridge, createOfficialBridge } = require('./bridge');
const logger = require('./logger');
const config = require('./config');

async function main() {
  logger.info('QQ-Discord Bridge starting...');
  try {
    const discordBot = await createDiscordBot();
    logger.info('Discord Bot initialized');

    if (config.QQ_BOT_TYPE === 'official') {
      const qqBot = await createQQOfficialBot();
      logger.info('QQ 官方Bot initialized');
      createOfficialBridge(qqBot, discordBot);
    } else {
      const qqBot = await createQQBot();
      logger.info('QQ Bot initialized');
      createBridge(qqBot, discordBot);
    }

    logger.info('Bridge established, forwarding messages...');
  } catch (err) {
    logger.error('Startup failed:', err);
    process.exit(1);
  }
}
process.on('uncaughtException', (err) => { logger.error('Uncaught exception:', err); });
process.on('unhandledRejection', (reason) => { logger.error('Unhandled rejection:', reason); });
main();
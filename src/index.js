'use strict';
const { createQQBot } = require('./qqBot');
const { createDiscordBot } = require('./discordBot');
const { createBridge } = require('./bridge');
const logger = require('./logger');
async function main() {
  logger.info('QQ-Discord Bridge starting...');
  try {
    const discordBot = await createDiscordBot();
    logger.info('Discord Bot initialized');
    const qqBot = await createQQBot();
    logger.info('QQ Bot initialized');
    createBridge(qqBot, discordBot);
    logger.info('Bridge established, forwarding messages...');
  } catch (err) {
    logger.error('Startup failed:', err);
    process.exit(1);
  }
}
process.on('uncaughtException', (err) => { logger.error('Uncaught exception:', err); });
process.on('unhandledRejection', (reason) => { logger.error('Unhandled rejection:', reason); });
main();
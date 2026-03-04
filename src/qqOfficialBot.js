'use strict';

const { createWebsocket, AvailableIntentsEventsEnum } = require('qq-guild-bot');
const logger = require('./logger');
const config = require('./config');

async function createQQOfficialBot() {
  if (!config.QQ_APP_ID || !config.QQ_APP_TOKEN) {
    throw new Error('QQ_APP_ID 和 QQ_APP_TOKEN 为官方Bot模式必填项。');
  }

  const botConfig = {
    appID: config.QQ_APP_ID,
    token: config.QQ_APP_TOKEN,
    sandbox: config.QQ_BOT_SANDBOX === 'true',
    intents: [
      AvailableIntentsEventsEnum.GUILD_MESSAGES,
      AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES,
    ],
  };

  const ws = createWebsocket(botConfig);

  return new Promise((resolve, reject) => {
    ws.on('READY', () => {
      logger.info('✅ QQ 官方Bot 已连接');
      resolve(ws);
    });

    ws.on('ERROR', (data) => {
      logger.error('❌ QQ 官方Bot 错误:', data);
      reject(new Error('QQ官方Bot连接失败'));
    });

    ws.connect(botConfig);
  });
}

module.exports = { createQQOfficialBot };

'use strict';
const config = {
  QQ_BOT_TYPE: process.env.QQ_BOT_TYPE || 'oicq',
  // oicq (unofficial) settings
  QQ_ACCOUNT: process.env.QQ_ACCOUNT,
  QQ_PASSWORD: process.env.QQ_PASSWORD,
  QQ_PLATFORM: process.env.QQ_PLATFORM || '1',
  QQ_DATA_DIR: process.env.QQ_DATA_DIR || '/app/data/qq',
  // QQ Official Bot settings
  QQ_APP_ID: process.env.QQ_APP_ID,
  QQ_APP_TOKEN: process.env.QQ_APP_TOKEN,
  QQ_BOT_SANDBOX: process.env.QQ_BOT_SANDBOX || 'false',
  // Discord settings
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  DEFAULT_AVATAR_URL: process.env.DEFAULT_AVATAR_URL || 'https://q1.qlogo.cn/g?b=qq&nk=10000&s=100',
  GROUP_MAPPINGS: process.env.GROUP_MAPPINGS,
  FILTER_KEYWORDS: process.env.FILTER_KEYWORDS || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_DIR: process.env.LOG_DIR || './logs',
};

const alwaysRequired = ['DISCORD_TOKEN', 'GROUP_MAPPINGS'];
const oicqRequired = ['QQ_ACCOUNT'];
const officialRequired = ['QQ_APP_ID', 'QQ_APP_TOKEN'];

const modeRequired = config.QQ_BOT_TYPE === 'official' ? officialRequired : oicqRequired;
const missing = [...alwaysRequired, ...modeRequired].filter(key => !config[key]);
if (missing.length > 0) {
  console.error('Missing required env vars: ' + missing.join(', '));
  process.exit(1);
}
module.exports = config;
'use strict';
const REQUIRED_KEYS = ['QQ_ACCOUNT','DISCORD_TOKEN','GROUP_MAPPINGS'];
const config = {
  QQ_ACCOUNT: process.env.QQ_ACCOUNT,
  QQ_PASSWORD: process.env.QQ_PASSWORD,
  QQ_PLATFORM: process.env.QQ_PLATFORM || '1',
  QQ_DATA_DIR: process.env.QQ_DATA_DIR || '/app/data/qq',
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  DEFAULT_AVATAR_URL: process.env.DEFAULT_AVATAR_URL || 'https://q1.qlogo.cn/g?b=qq&nk=10000&s=100',
  GROUP_MAPPINGS: process.env.GROUP_MAPPINGS,
  FILTER_KEYWORDS: process.env.FILTER_KEYWORDS || '',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
const missing = REQUIRED_KEYS.filter(key => !config[key]);
if (missing.length > 0) {
  console.error('Missing required env vars: ' + missing.join(', '));
  process.exit(1);
}
module.exports = config;
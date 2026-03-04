'use strict';

const axios = require('axios');
const logger = require('./logger');
const config = require('./config');

function parseGroupMappings(raw) {
  const mappings = {};
  if (!raw) return mappings;
  for (const pair of raw.split(',')) {
    const [qqGroup, discordChannel] = pair.trim().split(':');
    if (qqGroup && discordChannel) {
      mappings[qqGroup.trim()] = discordChannel.trim();
    }
  }
  return mappings;
}

function createBridge(qqBot, discordBot) {
  const groupMappings = parseGroupMappings(config.GROUP_MAPPINGS);
  const filterKeywords = config.FILTER_KEYWORDS
    ? config.FILTER_KEYWORDS.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  logger.info(`群组映射: ${JSON.stringify(groupMappings)}`);

  qqBot.on('message.group', async (event) => {
    const groupId = String(event.group_id);
    const channelId = groupMappings[groupId];
    if (!channelId) return;

    const text = event.toString();
    if (filterKeywords.some((kw) => text.includes(kw))) return;

    const senderName = event.sender.card || event.sender.nickname || String(event.sender.user_id);
    const content = `**[${senderName}]**: ${text}`;

    try {
      if (config.DISCORD_WEBHOOK_URL) {
        await axios.post(config.DISCORD_WEBHOOK_URL, {
          username: senderName,
          content: text,
          avatar_url: config.DEFAULT_AVATAR_URL,
        });
      } else {
        const channel = discordBot.channels.cache.get(channelId);
        if (channel) {
          await channel.send(content);
        } else {
          logger.warn(`Discord 频道未找到: ${channelId}`);
        }
      }
    } catch (err) {
      logger.error('消息转发失败:', err.message);
    }
  });

  return {
    stop() {
      qqBot.removeAllListeners('message.group');
    },
  };
}

module.exports = { createBridge };

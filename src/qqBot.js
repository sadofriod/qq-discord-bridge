'use strict';

const { createClient } = require('oicq');
const logger = require('./logger');
const config = require('./config');
const fs = require('fs');
const path = require('path');

async function createQQBot() {
  const qqNumber = Number(config.QQ_ACCOUNT);
  if (!Number.isInteger(qqNumber) || qqNumber <= 0) {
    logger.error('配置错误: QQ_ACCOUNT 必须是有效的数字账号');
    throw new Error('无效的 QQ_ACCOUNT 配置，必须是数字。');
  }

  const platform = Number(config.QQ_PLATFORM);
  if (!Number.isInteger(platform) || platform <= 0) {
    logger.error('配置错误: QQ_PLATFORM 必须是有效的数字平台标识');
    throw new Error('无效的 QQ_PLATFORM 配置，必须是数字。');
  }

  const dataDir = path.resolve(config.QQ_DATA_DIR || './data/qq');
  fs.mkdirSync(dataDir, { recursive: true });

  const client = createClient(qqNumber, {
    log_level: 'warn',
    data_dir: dataDir,
    platform: platform,
  });

  return new Promise((resolve, reject) => {
    client.on('system.login.qrcode', function () {
      logger.info('📱 请扫描二维码登录 QQ...');
      logger.info(`二维码路径: ${dataDir}/qrcode.png`);
      process.stdin.once('data', () => {
        this.login();
      });
    });

    client.on('system.login.slider', function (e) {
      logger.info('🔐 需要滑块验证，验证地址:', e.url);
      process.stdout.write('请完成滑块验证并粘贴ticket: ');
      process.stdin.once('data', (ticket) => {
        this.submitSlider(ticket.toString().trim());
      });
    });

    client.on('system.login.device', function (e) {
      logger.info('📱 设备锁验证:', e.url);
      logger.info('请完成验证后按回车继续...');
      process.stdin.once('data', () => {
        this.login();
      });
    });

    client.on('system.login.error', function (e) {
      logger.error('❌ QQ 登录错误:', e.message);
      reject(new Error(`QQ登录失败: ${e.message}`));
    });

    client.on('system.online', function () {
      logger.info(`✅ QQ Bot 上线: ${this.nickname} (${this.uin})`);
      resolve(client);
    });

    client.on('system.offline', function (e) {
      logger.warn('⚠️ QQ Bot 掉线:', e.message);
    });

    if (config.QQ_PASSWORD) {
      client.login(config.QQ_PASSWORD);
    } else {
      client.login();
    }
  });
}

module.exports = { createQQBot };
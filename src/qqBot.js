'use strict';

const { createClient } = require('oicq');
const logger = require('./logger');
const config = require('./config');
const fs = require('fs');
const path = require('path');

async function createQQBot() {
  const qqNumber = parseInt(config.QQ_ACCOUNT);

  const dataDir = path.resolve(config.QQ_DATA_DIR || './data/qq');
  fs.mkdirSync(dataDir, { recursive: true });

  const client = createClient(qqNumber, {
    log_level: 'warn',
    data_dir: dataDir,
    platform: parseInt(config.QQ_PLATFORM || '1'),
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
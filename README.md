# qq-discord-bridge
QQ群消息同步到Discord的Bot，支持Docker部署

## 配置

所有配置通过环境变量注入，无需 `.env` 文件。

| 环境变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQ_ACCOUNT` | ✅ | - | QQ账号 |
| `QQ_PASSWORD` | ❌ | - | QQ密码（扫码登录可留空） |
| `QQ_PLATFORM` | ❌ | `1` | 登录平台（1=安卓手机） |
| `QQ_DATA_DIR` | ❌ | `/app/data/qq` | QQ数据目录 |
| `DISCORD_TOKEN` | ✅ | - | Discord Bot Token |
| `DISCORD_CHANNEL_ID` | ❌ | - | Discord频道ID（可选） |
| `DISCORD_WEBHOOK_URL` | ✅ | - | Discord Webhook URL |
| `DEFAULT_AVATAR_URL` | ❌ | `https://q1.qlogo.cn/g?b=qq&nk=10000&s=100` | 默认头像地址 |
| `GROUP_MAPPINGS` | ✅ | - | QQ群号到Discord频道ID的映射，格式：`QQ群号:Discord频道ID`，多个用逗号分隔 |
| `FILTER_KEYWORDS` | | - | 过滤关键词，多个用逗号分隔 |
| `LOG_LEVEL` | | `info` | 日志级别 |
| `LOG_DIR` | | `/app/logs` | 日志目录 |

## Docker 部署

### 使用 docker-compose（推荐）

编辑 `docker-compose.yml` 中的 `environment` 字段，填写实际配置值，然后运行：

```bash
docker-compose up -d
```

### 使用 docker run

```bash
docker run -d \
  -e QQ_ACCOUNT=123456789 \
  -e QQ_PASSWORD=your_password \
  -e DISCORD_TOKEN=your_discord_token \
  -e DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/yyyyy \
  -e GROUP_MAPPINGS=123456789:987654321098765432 \
  -v $(pwd)/data/qq:/app/data/qq \
  -v $(pwd)/logs:/app/logs \
  --name qq-discord-bridge \
  qq-discord-bridge:latest
```

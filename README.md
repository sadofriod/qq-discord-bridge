# qq-discord-bridge
QQ群消息同步到Discord的Bot，支持Docker部署

## 配置

所有配置通过环境变量注入，无需 `.env` 文件。

### 通用配置

| 环境变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQ_BOT_TYPE` | ❌ | `oicq` | QQ Bot 模式：`oicq`（非官方）或 `official`（QQ官方Bot） |
| `DISCORD_TOKEN` | ✅ | - | Discord Bot Token |
| `DISCORD_CHANNEL_ID` | ❌ | - | Discord频道ID（可选） |
| `DISCORD_WEBHOOK_URL` | ❌ | - | Discord Webhook URL（推荐） |
| `DEFAULT_AVATAR_URL` | ❌ | `https://q1.qlogo.cn/g?b=qq&nk=10000&s=100` | 默认头像地址 |
| `GROUP_MAPPINGS` | ✅ | - | QQ群号（或子频道ID）到Discord频道ID的映射，格式：`ID:Discord频道ID`，多个用逗号分隔 |
| `FILTER_KEYWORDS` | ❌ | - | 过滤关键词，多个用逗号分隔 |
| `LOG_LEVEL` | ❌ | `info` | 日志级别 |
| `LOG_DIR` | ❌ | `/app/logs` | 日志目录 |

### oicq 模式（非官方，默认）

使用个人QQ账号登录，需设置 `QQ_BOT_TYPE=oicq`（默认值）。

| 环境变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQ_ACCOUNT` | ✅ | - | QQ账号 |
| `QQ_PASSWORD` | ❌ | - | QQ密码（扫码登录可留空） |
| `QQ_PLATFORM` | ❌ | `1` | 登录平台（1=安卓手机） |
| `QQ_DATA_DIR` | ❌ | `/app/data/qq` | QQ数据目录 |

`GROUP_MAPPINGS` 格式：`QQ群号:Discord频道ID`

### QQ 官方Bot 模式

使用 [QQ开放平台](https://q.qq.com/) 的官方Bot凭证，需设置 `QQ_BOT_TYPE=official`。

| 环境变量 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `QQ_APP_ID` | ✅ | - | QQ开放平台 AppID |
| `QQ_APP_TOKEN` | ✅ | - | QQ开放平台 Bot Token |
| `QQ_BOT_SANDBOX` | ❌ | `false` | 是否使用沙盒环境 |

`GROUP_MAPPINGS` 格式：`QQ子频道ID:Discord频道ID`

## Docker 部署

### 使用 docker-compose（推荐）

编辑 `docker-compose.yml` 中的 `environment` 字段，填写实际配置值，然后运行：

```bash
docker-compose up -d
```

### 使用 docker run（oicq 模式）

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

### 使用 docker run（QQ官方Bot 模式）

```bash
docker run -d \
  -e QQ_BOT_TYPE=official \
  -e QQ_APP_ID=your_app_id \
  -e QQ_APP_TOKEN=your_app_token \
  -e DISCORD_TOKEN=your_discord_token \
  -e DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxxxx/yyyyy \
  -e GROUP_MAPPINGS=子频道ID:987654321098765432 \
  -v $(pwd)/logs:/app/logs \
  --name qq-discord-bridge \
  qq-discord-bridge:latest
```

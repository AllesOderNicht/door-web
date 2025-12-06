# 公司邮箱询价功能配置说明

## 配置步骤

### 1. 获取SMTP配置信息

联系公司IT部门或邮件服务提供商，获取以下信息：

- **SMTP服务器地址**（host）：例如 `smtp.yymarines.com`、`smtp.exmail.qq.com` 等
- **SMTP端口**：通常为 25、465 或 587
- **加密方式**：SSL/TLS 或 STARTTLS
- **邮箱账号**：`yyservice@yymarines.com`
- **邮箱密码或授权码**：用于SMTP认证的密码

### 2. 常见企业邮箱SMTP配置

#### 腾讯企业邮箱
```
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### 阿里企业邮箱
```
SMTP_HOST=smtp.mxhichina.com
SMTP_PORT=465
SMTP_SECURE=true
```

#### 自建邮箱服务器
```
SMTP_HOST=smtp.yymarines.com
SMTP_PORT=587
SMTP_SECURE=false
```

### 3. 创建环境变量文件

在项目根目录（`door-web-v2/`）创建 `.env.local` 文件，添加以下配置：

```env
# SMTP服务器地址
SMTP_HOST=smtp.yymarines.com

# SMTP端口（通常为 25, 465 或 587）
# 465端口使用SSL加密，587端口使用STARTTLS
SMTP_PORT=587

# 是否使用SSL/TLS加密（true/false）
# 465端口通常设置为true，587端口设置为false（但会使用STARTTLS）
SMTP_SECURE=false

# 发件人邮箱账号
SMTP_USER=yyservice@yymarines.com

# 邮箱密码或授权码
# 如果是企业邮箱，可能需要使用授权码而不是登录密码
SMTP_PASSWORD=your-email-password-or-auth-code

# 接收询价邮件的邮箱地址（可选，默认使用SMTP_USER）
RECIPIENT_EMAIL=yyservice@yymarines.com
```

### 4. 配置示例

```env
SMTP_HOST=smtp.yymarines.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yyservice@yymarines.com
SMTP_PASSWORD=your-actual-password
RECIPIENT_EMAIL=yyservice@yymarines.com
```

### 5. 注意事项

- `.env.local` 文件不会被提交到Git仓库（已在.gitignore中）
- 如果使用企业邮箱，可能需要使用授权码而不是登录密码
- 确保SMTP服务已开启并允许外部应用访问
- 端口465使用SSL加密，端口587使用STARTTLS加密
- 如果遇到连接问题，可以尝试不同的端口和加密方式

### 6. 测试

配置完成后，重启开发服务器：

```bash
npm run dev
```

然后在网站上提交一个测试询价，检查邮箱是否收到邮件。

## 常见问题

### Q: 提示"服务器配置错误"
A: 检查 `.env.local` 文件是否存在，环境变量是否正确配置，特别是 `SMTP_USER` 和 `SMTP_PASSWORD`。

### Q: 提示"发送失败"
A: 
1. 检查SMTP服务器地址和端口是否正确
2. 确认邮箱账号和密码/授权码是否正确
3. 检查SMTP服务是否已开启
4. 尝试不同的端口和加密方式（587/STARTTLS 或 465/SSL）
5. 检查网络连接和防火墙设置
6. 查看服务器控制台的错误日志

### Q: 收不到邮件
A:
1. 检查垃圾邮件文件夹
2. 确认 `RECIPIENT_EMAIL` 配置正确
3. 检查邮箱的发送限制（每日发送数量）
4. 确认SMTP服务器允许从当前服务器IP发送邮件

### Q: 连接超时
A:
1. 检查SMTP服务器地址是否正确
2. 确认端口没有被防火墙阻止
3. 尝试使用不同的端口（587 或 465）
4. 检查是否需要VPN或特定网络环境

### Q: 认证失败
A:
1. 确认邮箱账号和密码正确
2. 如果使用企业邮箱，可能需要使用授权码而不是登录密码
3. 检查邮箱是否开启了SMTP服务
4. 确认账号没有被锁定或限制


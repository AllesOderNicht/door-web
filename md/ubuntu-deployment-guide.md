# Ubuntu 22 服务器部署指南

## 📋 部署概览

本指南将帮助您将Next.js门户网站部署到Ubuntu 22.04服务器上，包括：

- 服务器基础环境配置
- nvm和Node.js安装
- Nginx反向代理配置
- PM2进程管理
- 自动化部署脚本
- 安全配置和监控

## 🚀 第一步：服务器基础环境配置

### 1.1 更新系统包

```bash
# 更新包列表
sudo apt update && sudo apt upgrade -y

# 安装必要的工具
sudo apt install -y curl wget git vim ufw fail2ban htop
```

### 1.2 创建部署用户


### 1.3 配置SSH密钥（推荐）

```bash
# 在本地生成SSH密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 将公钥复制到服务器
ssh-copy-id deploy@your_server_ip
```

## 🔧 第二步：安装nvm和Node.js

### 2.1 安装nvm (Node Version Manager)

```bash
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载bash配置
source ~/.bashrc

# 验证nvm安装
nvm --version
```

### 2.2 安装Node.js 20 LTS

```bash
# 安装Node.js 20 LTS
nvm install 20

# 设置Node.js 20为默认版本
nvm use 20
nvm alias default 20

# 验证安装
node --version
npm --version
```

### 2.3 安装pnpm

```bash
# 使用npm安装pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

## 🌐 第三步：安装和配置Nginx

### 3.1 安装Nginx

```bash
sudo apt install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

### 3.2 配置Nginx反向代理

```bash
# 创建网站配置文件
sudo vim /etc/nginx/sites-available/door-web
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name _;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # 静态文件缓存
    location /_next/static/ {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 图片缓存
    location /public/ {
        proxy_cache STATIC;
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }

    # 主应用代理
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### 3.3 启用网站配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/door-web /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## ⚙️ 第四步：安装和配置PM2

### 4.1 安装PM2

```bash
# 全局安装PM2
sudo npm install -g pm2

# 设置PM2开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### 4.2 创建PM2配置文件

```bash
# 在项目目录创建ecosystem.config.js
vim /home/deploy/door_web/ecosystem.config.js
```

添加以下配置：

```javascript
module.exports = {
  apps: [{
    name: 'door-web',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/door_web',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/deploy/logs/err.log',
    out_file: '/home/deploy/logs/out.log',
    log_file: '/home/deploy/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

## 🚀 第五步：部署应用

### 5.1 创建部署目录

```bash
# 创建项目目录
mkdir -p /home/deploy/door_web
mkdir -p /home/deploy/logs

# 设置权限
sudo chown -R deploy:deploy /home/deploy/door_web
sudo chown -R deploy:deploy /home/deploy/logs
```

### 5.2 克隆项目

```bash
cd /home/deploy
git clone https://github.com/your-username/door_web.git
cd door_web
```

### 5.3 安装依赖和构建

```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm build

# 启动应用
pm2 start ecosystem.config.js

# 保存PM2配置
pm2 save
```

## 🔥 第六步：配置防火墙

### 6.1 配置UFW防火墙

```bash
# 启用防火墙
sudo ufw enable

# 允许SSH
sudo ufw allow ssh

# 允许HTTP
sudo ufw allow 80

# 检查状态
sudo ufw status
```

### 6.2 配置Fail2ban

```bash
# 配置SSH保护
sudo vim /etc/fail2ban/jail.local
```

添加以下配置：

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
```

```bash
# 重启Fail2ban
sudo systemctl restart fail2ban
```

## 📊 第七步：监控和日志

### 7.1 设置日志轮转

```bash
sudo vim /etc/logrotate.d/door-web
```

添加以下配置：

```
/home/deploy/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 7.2 设置系统监控

```bash
# 安装htop用于监控
sudo apt install -y htop

# 创建监控脚本
vim /home/deploy/monitor.sh
```

添加以下监控脚本：

```bash
#!/bin/bash
# 系统监控脚本

echo "=== 系统状态 ==="
echo "时间: $(date)"
echo "负载: $(uptime)"
echo "内存使用: $(free -h)"
echo "磁盘使用: $(df -h /)"
echo ""

echo "=== PM2状态 ==="
pm2 status
echo ""

echo "=== Nginx状态 ==="
sudo systemctl status nginx --no-pager
echo ""

echo "=== 应用日志 (最近10行) ==="
tail -10 /home/deploy/logs/combined.log
```

```bash
# 设置执行权限
chmod +x /home/deploy/monitor.sh
```

## 🔄 第八步：自动化部署脚本

### 8.1 创建部署脚本

```bash
vim /home/deploy/deploy.sh
```

添加以下部署脚本：

```bash
#!/bin/bash

# 部署脚本
set -e

PROJECT_DIR="/home/deploy/door_web"
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 开始部署..."

# 创建备份
echo "📦 创建备份..."
mkdir -p $BACKUP_DIR
if [ -d "$PROJECT_DIR" ]; then
    tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C /home/deploy door_web
fi

# 进入项目目录
cd $PROJECT_DIR

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 重启应用
echo "🔄 重启应用..."
pm2 restart door-web

# 检查应用状态
echo "✅ 检查应用状态..."
sleep 5
pm2 status

echo "🎉 部署完成！"
```

```bash
# 设置执行权限
chmod +x /home/deploy/deploy.sh
```

### 8.2 设置Git钩子（可选）

```bash
# 在服务器上创建Git仓库（如果需要）
cd /home/deploy
git init --bare door_web.git

# 创建post-receive钩子
vim door_web.git/hooks/post-receive
```

添加以下内容：

```bash
#!/bin/bash
cd /home/deploy/door_web
git --git-dir=/home/deploy/door_web.git --work-tree=/home/deploy/door_web pull origin main
/home/deploy/deploy.sh
```

```bash
# 设置执行权限
chmod +x door_web.git/hooks/post-receive
```

## 🛠️ 第九步：性能优化

### 9.1 优化Nginx配置

```bash
sudo vim /etc/nginx/nginx.conf
```

在http块中添加：

```nginx
# 性能优化配置
worker_processes auto;
worker_connections 1024;

# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

# Gzip压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

### 9.2 优化Node.js应用

在`next.config.ts`中添加：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 性能优化
  compress: true,
  poweredByHeader: false,
  
  // 图片优化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
  
  // 输出配置
  output: 'standalone',
};

export default nextConfig;
```

## 🔍 故障排除

### 常见问题解决

1. **应用无法启动**
   ```bash
   # 检查日志
   pm2 logs door-web
   
   # 检查端口占用
   sudo netstat -tlnp | grep :3000
   ```

2. **Nginx 502错误**
   ```bash
   # 检查Nginx错误日志
   sudo tail -f /var/log/nginx/error.log
   
   # 检查应用是否运行
   pm2 status
   ```

3. **端口占用问题**
   ```bash
   # 检查端口占用
   sudo netstat -tlnp | grep :80
   
   # 检查Nginx状态
   sudo systemctl status nginx
   ```

## 📈 监控和维护

### 日常维护任务

1. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **监控应用状态**
   ```bash
   pm2 monit
   ```

3. **清理日志**
   ```bash
   pm2 flush
   ```

4. **备份数据**
   ```bash
   /home/deploy/deploy.sh
   ```

## 🎯 部署检查清单

- [ ] 服务器基础环境配置完成
- [ ] nvm和Node.js安装完成
- [ ] Nginx配置并启动
- [ ] PM2安装并配置
- [ ] 应用成功部署并运行
- [ ] 防火墙配置完成
- [ ] 监控和日志设置完成
- [ ] 自动化部署脚本创建
- [ ] 性能优化配置完成

## 📞 技术支持

如果在部署过程中遇到问题，请检查：

1. 服务器日志：`/var/log/nginx/error.log`
2. 应用日志：`/home/deploy/logs/`
3. PM2状态：`pm2 status`
4. 系统资源：`htop`

---

**部署完成后，您的Next.js门户网站将在 `http://47.84.129.58` 上运行！** 🎉

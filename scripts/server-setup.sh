#!/bin/bash

# Ubuntu 22.04 服务器环境配置脚本
# 用于易洋海洋服务门户网站部署
# 使用nvm作为Node.js版本管理工具
# 项目路径: /usr/local/myhome/code

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "此脚本需要root权限运行"
        log_info "请使用: sudo $0"
        exit 1
    fi
}

# 更新系统包
update_system() {
    log_info "更新系统包..."
    
    apt update && apt upgrade -y
    
    # 安装基础工具
    apt install -y curl wget git vim ufw fail2ban htop unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release build-essential
    
    log_success "系统更新完成"
}

# 创建部署用户
create_deploy_user() {
    log_info "创建部署用户..."
    
    # 检查用户是否已存在
    if id "deploy" &>/dev/null; then
        log_warning "用户 'deploy' 已存在"
    else
        # 创建用户
        useradd -m -s /bin/bash deploy
        usermod -aG sudo deploy
        
        # 设置密码（可选）
        log_info "请为deploy用户设置密码:"
        passwd deploy
        
        log_success "用户 'deploy' 创建成功"
    fi
}

# 为deploy用户安装nvm
install_nvm_for_deploy() {
    log_info "为deploy用户安装nvm..."
    
    # 切换到deploy用户并安装nvm
    sudo -u deploy bash << 'EOF'
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 添加到bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# 重新加载bashrc
source ~/.bashrc

# 验证nvm安装
nvm --version
EOF
    
    log_success "nvm安装完成"
}

# 安装Node.js
install_nodejs() {
    log_info "安装Node.js 20 LTS..."
    
    # 切换到deploy用户并安装Node.js
    sudo -u deploy bash << 'EOF'
# 重新加载nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 安装Node.js 20 LTS
nvm install 20

# 设置Node.js 20为默认版本
nvm use 20
nvm alias default 20

# 验证安装
node --version
npm --version
EOF
    
    log_success "Node.js安装完成"
}

# 配置npm镜像源
configure_npm_registry() {
    log_info "配置npm阿里云镜像源..."
    
    # 切换到deploy用户并配置npm镜像
    sudo -u deploy bash << 'EOF'
# 重新加载nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 配置npm使用阿里云镜像
npm config set registry https://registry.npmmirror.com
npm config set disturl https://npmmirror.com/dist
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass/
npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs/
npm config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver/
npm config set operadriver_cdnurl https://npmmirror.com/mirrors/operadriver/
npm config set fse_binary_host_mirror https://npmmirror.com/mirrors/fsevents/

# 验证配置
npm config get registry
EOF
    
    log_success "npm镜像源配置完成"
}

# 安装pnpm
install_pnpm() {
    log_info "安装pnpm..."
    
    # 切换到deploy用户并安装pnpm
    sudo -u deploy bash << 'EOF'
# 重新加载nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 使用npm安装pnpm
npm install -g pnpm

# 配置pnpm使用阿里云镜像
pnpm config set registry https://registry.npmmirror.com

# 验证安装
pnpm --version
EOF
    
    log_success "pnpm安装完成"
}

# 安装Nginx
install_nginx() {
    log_info "安装Nginx..."
    
    # 安装Nginx
    apt install -y nginx
    
    # 启动并设置开机自启
    systemctl start nginx
    systemctl enable nginx
    
    # 检查状态
    if systemctl is-active --quiet nginx; then
        log_success "Nginx安装并启动成功"
    else
        log_error "Nginx启动失败"
        exit 1
    fi
}

# 安装PM2
install_pm2() {
    log_info "安装PM2..."
    
    # 切换到deploy用户并安装PM2
    sudo -u deploy bash << 'EOF'
# 重新加载nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 全局安装PM2
npm install -g pm2

# 验证安装
pm2 --version
EOF
    
    log_success "PM2安装完成"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    # 启用UFW
    ufw --force enable
    
    # 允许SSH
    ufw allow ssh
    
    # 允许HTTP
    ufw allow 80
    
    # 检查状态
    ufw status
    
    log_success "防火墙配置完成"
}

# 配置Fail2ban
configure_fail2ban() {
    log_info "配置Fail2ban..."
    
    # 创建配置文件
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
EOF
    
    # 重启Fail2ban
    systemctl restart fail2ban
    systemctl enable fail2ban
    
    log_success "Fail2ban配置完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    # 创建网站配置文件
    cat > /etc/nginx/sites-available/door-web << 'EOF'
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
EOF

    # 启用网站配置
    ln -sf /etc/nginx/sites-available/door-web /etc/nginx/sites-enabled/
    
    # 删除默认配置
    rm -f /etc/nginx/sites-enabled/default
    
    # 测试配置
    nginx -t
    
    # 重启Nginx
    systemctl restart nginx
    
    log_success "Nginx配置完成"
}

# 创建项目目录
create_project_directories() {
    log_info "创建项目目录..."
    
    # 创建目录
    mkdir -p /usr/local/myhome/code
    mkdir -p /usr/local/myhome/logs
    mkdir -p /usr/local/myhome/backups
    mkdir -p /usr/local/myhome/scripts
    
    # 设置权限
    chown -R deploy:deploy /usr/local/myhome
    
    log_success "项目目录创建完成"
}

# 配置日志轮转
configure_logrotate() {
    log_info "配置日志轮转..."
    
    # 创建日志轮转配置
    cat > /etc/logrotate.d/door-web << 'EOF'
/usr/local/myhome/logs/*.log {
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
EOF
    
    log_success "日志轮转配置完成"
}

# 创建监控脚本
create_monitoring_script() {
    log_info "创建监控脚本..."
    
    cat > /usr/local/myhome/monitor.sh << 'EOF'
#!/bin/bash
# 系统监控脚本

echo "=== 系统状态 ==="
echo "时间: $(date)"
echo "负载: $(uptime)"
echo "内存使用: $(free -h)"
echo "磁盘使用: $(df -h /)"
echo ""

echo "=== Node.js版本 ==="
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "pnpm: $(pnpm --version)"
echo ""

echo "=== PM2状态 ==="
pm2 status
echo ""

echo "=== Nginx状态 ==="
sudo systemctl status nginx --no-pager
echo ""

echo "=== 应用日志 (最近10行) ==="
tail -10 /usr/local/myhome/logs/combined.log
EOF
    
    chmod +x /usr/local/myhome/monitor.sh
    chown deploy:deploy /usr/local/myhome/monitor.sh
    
    log_success "监控脚本创建完成"
}

# 优化系统配置
optimize_system() {
    log_info "优化系统配置..."
    
    # 优化Nginx配置
    cat >> /etc/nginx/nginx.conf << 'EOF'

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
EOF
    
    # 重启Nginx
    systemctl restart nginx
    
    log_success "系统优化完成"
}

# 创建nvm环境配置
create_nvm_profile() {
    log_info "创建nvm环境配置..."
    
    # 为deploy用户创建nvm环境配置
    sudo -u deploy bash << 'EOF'
# 创建.nvmrc文件
echo "20" > /usr/local/myhome/code/.nvmrc

# 创建环境加载脚本
cat > /usr/local/myhome/load-nvm.sh << 'NVM_EOF'
#!/bin/bash
# 加载nvm环境

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# 自动使用项目指定的Node.js版本
if [ -f .nvmrc ]; then
    nvm use
fi
NVM_EOF

chmod +x /usr/local/myhome/load-nvm.sh
EOF
    
    log_success "nvm环境配置完成"
}

# 显示完成信息
show_completion_info() {
    log_success "🎉 服务器环境配置完成！"
    echo ""
    echo "📊 安装的软件:"
    
    # 显示Node.js相关版本
    sudo -u deploy bash << 'EOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
echo "  - nvm: $(nvm --version)"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - pnpm: $(pnpm --version)"
echo "  - PM2: $(pm2 --version)"
EOF
    
    echo "  - Nginx: $(nginx -v 2>&1)"
    echo ""
    echo "🔧 下一步操作:"
    echo "  1. 切换到deploy用户: su - deploy"
    echo "  2. 将项目代码复制到 /usr/local/myhome/code"
    echo "  3. 运行部署脚本: ./scripts/deploy.sh"
    echo ""
    echo "📁 重要目录:"
    echo "  - 项目目录: /usr/local/myhome/code"
    echo "  - 日志目录: /usr/local/myhome/logs"
    echo "  - 备份目录: /usr/local/myhome/backups"
    echo "  - 脚本目录: /usr/local/myhome/scripts"
    echo ""
    echo "🛡️ 安全配置:"
    echo "  - 防火墙已启用"
    echo "  - Fail2ban已配置"
    echo "  - SSH保护已启用"
    echo ""
    echo "🔧 nvm使用说明:"
    echo "  - 查看已安装版本: nvm list"
    echo "  - 安装新版本: nvm install <version>"
    echo "  - 切换版本: nvm use <version>"
    echo "  - 设置默认版本: nvm alias default <version>"
    echo ""
    echo "🌐 访问地址:"
    echo "  - 外部访问: http://47.84.129.58"
    echo "  - 本地访问: http://localhost:3000"
}

# 主函数
main() {
    echo "🚀 Ubuntu 22.04 服务器环境配置 (使用nvm)"
    echo "============================================="
    echo "项目路径: /usr/local/myhome/code"
    echo "公网IP: 47.84.129.58"
    echo ""
    
    # 执行配置步骤
    check_root
    update_system
    create_deploy_user
    install_nvm_for_deploy
    install_nodejs
    configure_npm_registry
    install_pnpm
    install_nginx
    install_pm2
    configure_firewall
    configure_fail2ban
    configure_nginx
    create_project_directories
    configure_logrotate
    create_monitoring_script
    create_nvm_profile
    optimize_system
    
    show_completion_info
}

# 错误处理
trap 'log_error "配置过程中发生错误，请检查日志"; exit 1' ERR

# 执行主函数
main "$@"

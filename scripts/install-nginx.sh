#!/bin/bash

# Nginx 安装和配置脚本
# 适用于 Ubuntu 22.04
# 功能：安装 nginx 并配置为反向代理，默认访问 3000 端口

# 错误处理
set -eo pipefail

# 配置变量
NGINX_SITE_NAME="door-web"
UPSTREAM_PORT="3000"
UPSTREAM_HOST="localhost"
SERVER_NAME="www.yymarines.com yymarines.com"

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
        log_error "此脚本需要 root 权限运行"
        log_info "请使用: sudo $0"
        exit 1
    fi
}

# 更新系统包
update_system() {
    log_info "更新系统包列表..."
    
    set +e
    apt update 2>&1
    local update_result=$?
    set -e
    
    if [ $update_result -ne 0 ]; then
        log_error "系统包更新失败"
        exit 1
    fi
    
    log_success "系统包更新完成"
}

# 安装Nginx
install_nginx() {
    log_info "检查 Nginx 安装状态..."
    
    # 检查Nginx是否已安装
    if command -v nginx &> /dev/null; then
        set +e
        local nginx_version=$(nginx -v 2>&1 | grep -oP 'nginx/\K[0-9.]+')
        set -e
        log_success "Nginx 已安装: ${nginx_version}"
        return 0
    fi
    
    log_info "Nginx 未安装，开始安装 Nginx..."
    
    # 安装Nginx
    set +e
    apt install -y nginx 2>&1
    local install_result=$?
    set -e
    
    if [ $install_result -ne 0 ]; then
        log_error "Nginx 安装失败"
        exit 1
    fi
    
    log_success "Nginx 安装成功"
}

# 启动并启用Nginx
start_nginx() {
    log_info "启动 Nginx 服务..."
    
    # 启动Nginx
    set +e
    systemctl start nginx 2>&1
    local start_result=$?
    set -e
    
    if [ $start_result -ne 0 ]; then
        log_error "Nginx 启动失败"
        exit 1
    fi
    
    # 设置开机自启
    set +e
    systemctl enable nginx 2>&1
    set -e
    
    # 检查状态
    if systemctl is-active --quiet nginx; then
        log_success "Nginx 启动成功并已设置开机自启"
    else
        log_error "Nginx 启动后状态异常"
        exit 1
    fi
}

# 配置Nginx反向代理
configure_nginx() {
    log_info "配置 Nginx 反向代理..."
    
    # 备份默认配置（如果存在）
    if [ -f /etc/nginx/sites-enabled/default ]; then
        log_info "备份默认配置..."
        cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # 创建网站配置文件
    log_info "创建 Nginx 配置文件..."
    cat > /etc/nginx/sites-available/${NGINX_SITE_NAME} << EOF
# 重定向不带 www 的域名到带 www 的域名
server {
    listen 80;
    server_name yymarines.com;
    return 301 http://www.yymarines.com\$request_uri;
}

# 主服务器配置
server {
    listen 80;
    server_name www.yymarines.com;

    # 客户端最大请求体大小
    client_max_body_size 10M;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # 静态文件缓存（Next.js）
    location /_next/static/ {
        proxy_pass http://${UPSTREAM_HOST}:${UPSTREAM_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 图片和静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://${UPSTREAM_HOST}:${UPSTREAM_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        add_header Cache-Control "public, max-age=86400";
    }

    # 主应用代理
    location / {
        proxy_pass http://${UPSTREAM_HOST}:${UPSTREAM_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 300s;
    }
}
EOF
    
    # 启用网站配置
    log_info "启用 Nginx 配置..."
    ln -sf /etc/nginx/sites-available/${NGINX_SITE_NAME} /etc/nginx/sites-enabled/
    
    # 删除默认配置（如果存在）
    if [ -f /etc/nginx/sites-enabled/default ]; then
        log_info "删除默认配置..."
        rm -f /etc/nginx/sites-enabled/default
    fi
    
    # 测试配置
    log_info "测试 Nginx 配置..."
    set +e
    nginx -t 2>&1
    local test_result=$?
    set -e
    
    if [ $test_result -ne 0 ]; then
        log_error "Nginx 配置测试失败，请检查配置文件"
        exit 1
    fi
    
    log_success "Nginx 配置测试通过"
    
    # 重新加载Nginx
    log_info "重新加载 Nginx..."
    set +e
    systemctl reload nginx 2>&1
    local reload_result=$?
    set -e
    
    if [ $reload_result -ne 0 ]; then
        log_warning "Nginx 重新加载失败，尝试重启..."
        set +e
        systemctl restart nginx 2>&1
        local restart_result=$?
        set -e
        
        if [ $restart_result -ne 0 ]; then
            log_error "Nginx 重启失败"
            exit 1
        fi
    fi
    
    log_success "Nginx 配置完成并已重新加载"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    # 检查UFW是否安装
    if ! command -v ufw &> /dev/null; then
        log_warning "UFW 未安装，跳过防火墙配置"
        return 0
    fi
    
    # 允许HTTP端口
    set +e
    ufw allow 80/tcp 2>&1
    set -e
    
    log_success "防火墙配置完成（已允许 HTTP 80 端口）"
}

# 显示完成信息
show_completion_info() {
    log_success "🎉 Nginx 安装和配置完成！"
    echo ""
    echo "📊 配置信息:"
    echo "  Nginx 版本: $(nginx -v 2>&1 | grep -oP 'nginx/\K[0-9.]+')"
    echo "  监听端口: 80"
    echo "  域名: ${SERVER_NAME}"
    echo "  反向代理: http://${UPSTREAM_HOST}:${UPSTREAM_PORT}"
    echo "  配置文件: /etc/nginx/sites-available/${NGINX_SITE_NAME}"
    echo ""
    echo "🔧 管理命令:"
    echo "  查看状态: systemctl status nginx"
    echo "  启动服务: systemctl start nginx"
    echo "  停止服务: systemctl stop nginx"
    echo "  重启服务: systemctl restart nginx"
    echo "  重新加载: systemctl reload nginx"
    echo "  测试配置: nginx -t"
    echo ""
    echo "📝 查看日志:"
    echo "  访问日志: tail -f /var/log/nginx/access.log"
    echo "  错误日志: tail -f /var/log/nginx/error.log"
    echo ""
    echo "🌐 访问地址:"
    echo "  域名访问: http://www.yymarines.com"
    echo "  本地访问: http://localhost"
    echo "  外部访问: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "⚠️  注意事项:"
    echo "  1. 确保应用已在 ${UPSTREAM_HOST}:${UPSTREAM_PORT} 运行"
    echo "  2. 如果应用未运行，Nginx 会返回 502 Bad Gateway"
    echo "  3. 可以通过 'systemctl status nginx' 检查服务状态"
}

# 错误处理函数
handle_error() {
    local exit_code=${1:-$?}
    local line_number=${2:-$LINENO}
    local command=${3:-"未知命令"}
    
    if [ $exit_code -eq 0 ]; then
        return 0
    fi
    
    log_error "=========================================="
    log_error "脚本执行失败！"
    log_error "=========================================="
    log_error "退出码: $exit_code"
    log_error "错误行号: $line_number"
    log_error "失败命令: $command"
    log_error "=========================================="
    log_error "请检查上述错误信息并解决问题后重试"
    return $exit_code
}

# 主函数
main() {
    echo "🚀 Nginx 安装和配置脚本"
    echo "=============================="
    echo "域名: ${SERVER_NAME}"
    echo "反向代理端口: ${UPSTREAM_PORT}"
    echo ""
    
    check_root
    update_system
    install_nginx
    start_nginx
    configure_nginx
    configure_firewall
    
    show_completion_info
}

# 设置错误处理 trap
trap 'handle_error $? $LINENO "$BASH_COMMAND"' ERR

# 设置退出处理
trap 'exit_code=$?; if [ $exit_code -ne 0 ]; then handle_error $exit_code $LINENO "$BASH_COMMAND"; fi' EXIT

# 执行主函数
main "$@"

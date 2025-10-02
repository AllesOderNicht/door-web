#!/bin/bash

# 易洋海洋服务门户网站 - 自动化部署脚本
# 适用于 Ubuntu 22.04 服务器 (HTTP部署)

set -e

# 配置变量
PROJECT_NAME="door-web"
PROJECT_DIR="/usr/local/myhome/code"
BACKUP_DIR="/usr/local/myhome/backups"
LOG_DIR="/usr/local/myhome/logs"
DATE=$(date +%Y%m%d_%H%M%S)
BRANCH=${1:-main}

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
check_user() {
    if [ "$EUID" -eq 0 ]; then
        log_error "请不要使用root用户运行此脚本"
        exit 1
    fi
}

# 检查必要命令
check_dependencies() {
    log_info "检查系统依赖..."
    
    local missing_deps=()
    
    # 检查nvm
    if ! command -v nvm &> /dev/null; then
        # 尝试加载nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        if ! command -v nvm &> /dev/null; then
            missing_deps+=("nvm")
        fi
    fi
    
    # 检查node
    if ! command -v node &> /dev/null; then
        # 尝试加载nvm环境
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        if ! command -v node &> /dev/null; then
            missing_deps+=("node")
        fi
    fi
    
    if ! command -v pnpm &> /dev/null; then
        missing_deps+=("pnpm")
    fi
    
    if ! command -v pm2 &> /dev/null; then
        missing_deps+=("pm2")
    fi
    
    if ! command -v nginx &> /dev/null; then
        missing_deps+=("nginx")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "缺少以下依赖: ${missing_deps[*]}"
        log_info "请先运行服务器环境配置脚本"
        exit 1
    fi
    
    log_success "系统依赖检查完成"
}

# 加载nvm环境
load_nvm() {
    log_info "加载nvm环境..."
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    # 使用项目指定的Node.js版本
    if [ -f "$PROJECT_DIR/.nvmrc" ]; then
        nvm use
    else
        nvm use default
    fi
    
    # 确保使用阿里云镜像
    npm config set registry https://registry.npmmirror.com
    pnpm config set registry https://registry.npmmirror.com
    
    log_success "nvm环境加载完成"
}

# 创建必要目录
create_directories() {
    log_info "创建必要目录..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "$PROJECT_DIR"
    
    log_success "目录创建完成"
}

# 备份当前版本
backup_current() {
    if [ -d "$PROJECT_DIR" ] && [ "$(ls -A $PROJECT_DIR)" ]; then
        log_info "创建当前版本备份..."
        
        local backup_file="$BACKUP_DIR/backup_$DATE.tar.gz"
        tar -czf "$backup_file" -C /usr/local/myhome code
        
        if [ $? -eq 0 ]; then
            log_success "备份创建成功: $backup_file"
        else
            log_warning "备份创建失败，继续部署..."
        fi
    else
        log_info "首次部署，跳过备份"
    fi
}

# 拉取最新代码
pull_code() {
    log_info "拉取最新代码 (分支: $BRANCH)..."
    
    cd "$PROJECT_DIR"
    
    # 检查是否为git仓库
    if [ ! -d ".git" ]; then
        log_error "项目目录不是git仓库"
        exit 1
    fi
    
    # 拉取代码
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    
    if [ $? -eq 0 ]; then
        log_success "代码拉取成功"
    else
        log_error "代码拉取失败"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    cd "$PROJECT_DIR"
    
    # 清理缓存
    pnpm store prune
    
    # 安装依赖
    pnpm install --frozen-lockfile
    
    if [ $? -eq 0 ]; then
        log_success "依赖安装成功"
    else
        log_error "依赖安装失败"
        exit 1
    fi
}

# 构建项目
build_project() {
    log_info "构建生产版本..."
    
    cd "$PROJECT_DIR"
    
    # 清理之前的构建
    rm -rf .next
    
    # 构建项目
    pnpm build
    
    if [ $? -eq 0 ]; then
        log_success "项目构建成功"
    else
        log_error "项目构建失败"
        exit 1
    fi
}

# 重启应用
restart_application() {
    log_info "重启应用程序..."
    
    # 检查PM2是否已安装
    if ! command -v pm2 &> /dev/null; then
        log_error "PM2未安装，请先安装PM2"
        exit 1
    fi
    
    # 重启应用
    pm2 restart "$PROJECT_NAME" || pm2 start ecosystem.config.js
    
    # 等待应用启动
    sleep 5
    
    # 检查应用状态
    if pm2 list | grep -q "$PROJECT_NAME.*online"; then
        log_success "应用程序重启成功"
    else
        log_error "应用程序启动失败"
        pm2 logs "$PROJECT_NAME" --lines 20
        exit 1
    fi
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:3000 > /dev/null; then
            log_success "健康检查通过"
            return 0
        fi
        
        log_info "健康检查尝试 $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    log_error "健康检查失败"
    return 1
}

# 清理旧备份
cleanup_old_backups() {
    log_info "清理旧备份文件..."
    
    # 保留最近7天的备份
    find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete
    
    log_success "旧备份清理完成"
}

# 显示部署信息
show_deployment_info() {
    log_success "🎉 部署完成！"
    echo ""
    echo "📊 部署信息:"
    echo "  项目名称: $PROJECT_NAME"
    echo "  部署时间: $(date)"
    echo "  部署分支: $BRANCH"
    echo "  项目目录: $PROJECT_DIR"
    echo ""
    echo "🔧 管理命令:"
    echo "  查看状态: pm2 status"
    echo "  查看日志: pm2 logs $PROJECT_NAME"
    echo "  重启应用: pm2 restart $PROJECT_NAME"
    echo "  停止应用: pm2 stop $PROJECT_NAME"
    echo ""
    echo "📁 重要目录:"
    echo "  项目目录: $PROJECT_DIR"
    echo "  日志目录: $LOG_DIR"
    echo "  备份目录: $BACKUP_DIR"
    echo ""
    echo "🌐 访问地址:"
    echo "  本地访问: http://localhost:3000"
    echo "  外部访问: http://47.84.129.58"
    echo ""
    echo "🔧 nvm命令:"
    echo "  查看版本: nvm list"
    echo "  切换版本: nvm use <version>"
    echo "  安装版本: nvm install <version>"
}

# 主函数
main() {
    echo "🚀 易洋海洋服务门户网站 - 自动化部署 (HTTP)"
    echo "=============================================="
    echo ""
    
    # 执行部署步骤
    check_user
    check_dependencies
    load_nvm
    create_directories
    backup_current
    pull_code
    install_dependencies
    build_project
    restart_application
    
    if health_check; then
        cleanup_old_backups
        show_deployment_info
    else
        log_error "部署失败，请检查日志"
        exit 1
    fi
}

# 错误处理
trap 'log_error "部署过程中发生错误，请检查日志"; exit 1' ERR

# 执行主函数
main "$@"

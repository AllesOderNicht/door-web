#!/bin/bash

# Next.js 生产环境启动脚本
# 适用于 Ubuntu 22.04
# 功能：安装 nvm、Node.js 22、PM2，并启动应用

# 错误处理：遇到错误时退出，但先执行错误处理函数
# 注意：不使用 -u 选项，因为某些变量可能未定义
set -eo pipefail

# 配置变量
NODE_VERSION="22"
PROJECT_NAME="door-web"
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
NVM_VERSION="v0.39.0"

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

# 检查并显示当前用户
check_user() {
    if [ "$EUID" -eq 0 ]; then
        log_info "当前用户: root"
    else
        log_info "当前用户: $(whoami)"
    fi
}

# 加载nvm环境
load_nvm() {
    set +e  # 临时禁用错误退出
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        \. "$NVM_DIR/nvm.sh" 2>/dev/null
        local load_result=$?
        if [ $load_result -ne 0 ]; then
            set -e
            return 1
        fi
    else
        set -e
        return 1
    fi
    if [ -s "$NVM_DIR/bash_completion" ]; then
        \. "$NVM_DIR/bash_completion" 2>/dev/null
    fi
    set -e  # 重新启用错误退出
    return 0
}

# 安装nvm
install_nvm() {
    log_info "检查 nvm 安装状态..."
    
    # 检查nvm目录是否存在
    export NVM_DIR="$HOME/.nvm"
    log_info "NVM 目录: $NVM_DIR"
    
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        log_info "发现 nvm 安装目录: $NVM_DIR"
        # nvm已安装，加载它
        set +e  # 临时禁用错误退出
        if load_nvm; then
            set -e
            # 尝试获取nvm版本
            set +e
            local nvm_version=$(nvm --version 2>/dev/null)
            set -e
            if [ -n "$nvm_version" ]; then
                log_success "nvm 已安装: ${nvm_version}"
            else
                log_success "nvm 已安装"
            fi
            return 0
        else
            set -e
            log_warning "nvm 目录存在但加载失败，将重新安装"
        fi
    else
        log_info "nvm 安装目录不存在: $NVM_DIR"
    fi
    
    log_info "nvm 未安装，开始安装 nvm..."
    
    # 检查curl是否可用
    if ! command -v curl &> /dev/null; then
        log_error "curl 未安装，请先安装: apt-get update && apt-get install -y curl"
        exit 1
    fi
    
    # 安装nvm
    log_info "正在下载并安装 nvm..."
    set +e  # 临时禁用错误退出
    local install_output=$(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh 2>&1)
    local curl_result=$?
    set -e
    
    if [ $curl_result -ne 0 ]; then
        log_error "下载 nvm 安装脚本失败"
        log_error "错误信息: $install_output"
        log_error "请检查网络连接或手动安装 nvm"
        exit 1
    fi
    
    set +e
    echo "$install_output" | bash
    local install_result=$?
    set -e
    
    if [ $install_result -ne 0 ]; then
        log_error "nvm 安装失败，退出码: $install_result"
        log_error "请检查网络连接或手动安装 nvm"
        exit 1
    fi
    
    # 重新加载nvm
    if ! load_nvm; then
        log_error "nvm 安装后加载失败"
        log_error "请检查 $NVM_DIR 目录权限"
        exit 1
    fi
    
    # 验证安装
    set +e
    local nvm_version=$(nvm --version 2>/dev/null)
    set -e
    
    if [ -n "$nvm_version" ]; then
        log_success "nvm 安装成功: ${nvm_version}"
        
        # 将nvm配置添加到bashrc（如果还没有）
        if ! grep -q 'NVM_DIR' ~/.bashrc 2>/dev/null; then
            {
                echo ''
                echo 'export NVM_DIR="$HOME/.nvm"'
                echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"'
                echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"'
            } >> ~/.bashrc
            log_info "已将 nvm 配置添加到 ~/.bashrc"
        fi
    else
        log_error "nvm 安装验证失败，无法获取版本号"
        exit 1
    fi
}

# 安装Node.js 22
install_nodejs() {
    log_info "检查 Node.js ${NODE_VERSION} 安装状态..."
    
    # 确保nvm已加载
    if ! load_nvm; then
        log_error "无法加载 nvm 环境"
        exit 1
    fi
    
    # 检查Node.js 22是否已安装
    set +e
    local node_list=$(nvm list 2>&1)
    local list_result=$?
    set -e
    
    if [ $list_result -ne 0 ]; then
        log_error "无法执行 nvm list 命令"
        log_error "错误信息: $node_list"
        exit 1
    fi
    
    if echo "$node_list" | grep -q "v${NODE_VERSION}"; then
        log_success "Node.js ${NODE_VERSION} 已安装"
        set +e
        nvm use ${NODE_VERSION} 2>&1
        local use_result=$?
        set -e
        
        if [ $use_result -ne 0 ]; then
            log_error "无法切换到 Node.js ${NODE_VERSION}"
            exit 1
        fi
        
        set +e
        local node_version=$(node --version 2>&1)
        set -e
        log_info "当前 Node.js 版本: ${node_version}"
        return 0
    fi
    
    log_info "Node.js ${NODE_VERSION} 未安装，开始安装..."
    
    # 安装Node.js 22
    set +e
    log_info "正在安装 Node.js ${NODE_VERSION}，这可能需要几分钟..."
    nvm install ${NODE_VERSION} 2>&1
    local install_result=$?
    set -e
    
    if [ $install_result -ne 0 ]; then
        log_error "Node.js ${NODE_VERSION} 安装失败，退出码: $install_result"
        exit 1
    fi
    
    set +e
    nvm use ${NODE_VERSION} 2>&1
    local use_result=$?
    set -e
    
    if [ $use_result -ne 0 ]; then
        log_error "无法切换到 Node.js ${NODE_VERSION}"
        exit 1
    fi
    
    set +e
    nvm alias default ${NODE_VERSION} 2>&1
    set -e
    
    # 验证安装
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log_success "Node.js 安装成功: ${node_version}"
        set +e
        local npm_version=$(npm --version 2>&1)
        set -e
        log_info "npm 版本: ${npm_version}"
    else
        log_error "Node.js 安装验证失败，node 命令不可用"
        exit 1
    fi
}

# 配置npm镜像源
configure_npm_registry() {
    log_info "配置 npm 镜像源..."
    
    if ! load_nvm; then
        log_error "无法加载 nvm 环境"
        exit 1
    fi
    
    # 配置npm使用阿里云镜像
    set +e
    npm config set registry https://registry.npmmirror.com 2>&1
    local reg_result=$?
    set -e
    
    if [ $reg_result -ne 0 ]; then
        log_error "配置 npm registry 失败"
        exit 1
    fi
    
    set +e
    npm config set disturl https://npmmirror.com/dist 2>&1
    set -e
    
    log_success "npm 镜像源配置完成"
}

# 安装pnpm
install_pnpm() {
    log_info "检查 pnpm 安装状态..."
    
    if ! load_nvm; then
        log_error "无法加载 nvm 环境"
        exit 1
    fi
    
    # 检查pnpm是否已安装
    if command -v pnpm &> /dev/null; then
        set +e
        local pnpm_version=$(pnpm --version 2>&1)
        set -e
        log_success "pnpm 已安装: ${pnpm_version}"
        return 0
    fi
    
    log_info "pnpm 未安装，开始安装 pnpm..."
    
    # 使用npm全局安装pnpm
    set +e
    log_info "正在安装 pnpm，这可能需要几分钟..."
    npm install -g pnpm 2>&1
    local install_result=$?
    set -e
    
    if [ $install_result -ne 0 ]; then
        log_error "pnpm 安装失败，退出码: $install_result"
        log_error "请检查网络连接或 npm 配置"
        exit 1
    fi
    
    # 配置pnpm使用阿里云镜像
    set +e
    pnpm config set registry https://registry.npmmirror.com 2>&1
    set -e
    
    # 验证安装
    if command -v pnpm &> /dev/null; then
        set +e
        local pnpm_version=$(pnpm --version 2>&1)
        set -e
        log_success "pnpm 安装成功: ${pnpm_version}"
    else
        log_error "pnpm 安装验证失败，pnpm 命令不可用"
        exit 1
    fi
}

# 安装PM2
install_pm2() {
    log_info "检查 PM2 安装状态..."
    
    if ! load_nvm; then
        log_error "无法加载 nvm 环境"
        exit 1
    fi
    
    # 检查PM2是否已安装
    if command -v pm2 &> /dev/null; then
        set +e
        local pm2_version=$(pm2 --version 2>&1)
        set -e
        log_success "PM2 已安装: ${pm2_version}"
        return 0
    fi
    
    log_info "PM2 未安装，开始安装 PM2..."
    
    # 全局安装PM2
    set +e
    log_info "正在安装 PM2，这可能需要几分钟..."
    npm install -g pm2 2>&1
    local install_result=$?
    set -e
    
    if [ $install_result -ne 0 ]; then
        log_error "PM2 安装失败，退出码: $install_result"
        log_error "请检查网络连接或 npm 配置"
        exit 1
    fi
    
    # 验证安装
    if command -v pm2 &> /dev/null; then
        set +e
        local pm2_version=$(pm2 --version 2>&1)
        set -e
        log_success "PM2 安装成功: ${pm2_version}"
    else
        log_error "PM2 安装验证失败，pm2 命令不可用"
        exit 1
    fi
}

# 检查并安装项目依赖
check_project_dependencies() {
    log_info "检查项目依赖..."
    
    cd "$PROJECT_DIR"
    
    # 检查package.json是否存在
    if [ ! -f "package.json" ]; then
        log_error "未找到 package.json 文件"
        log_info "请确保在项目根目录运行此脚本"
        exit 1
    fi
    
    # 确保nvm已加载
    if ! load_nvm; then
        log_error "无法加载 nvm 环境"
        exit 1
    fi
    
    # 检查node_modules是否存在
    if [ ! -d "node_modules" ]; then
        log_warning "未找到 node_modules 目录"
        log_info "开始自动安装项目依赖..."
        
        # 检查是否有pnpm
        if command -v pnpm &> /dev/null; then
            log_info "使用 pnpm 安装依赖..."
            set +e
            pnpm install --frozen-lockfile 2>&1
            local install_result=$?
            set -e
            
            if [ $install_result -ne 0 ]; then
                log_warning "pnpm install 失败，尝试使用 npm..."
                set +e
                npm install 2>&1
                local npm_result=$?
                set -e
                
                if [ $npm_result -ne 0 ]; then
                    log_error "依赖安装失败"
                    exit 1
                fi
            else
                log_success "依赖安装成功（使用 pnpm）"
            fi
        else
            log_info "pnpm 未安装，使用 npm 安装依赖..."
            set +e
            npm install 2>&1
            local install_result=$?
            set -e
            
            if [ $install_result -ne 0 ]; then
                log_error "依赖安装失败"
                exit 1
            else
                log_success "依赖安装成功（使用 npm）"
            fi
        fi
    else
        log_success "node_modules 目录已存在"
    fi
    
    # 检查.next构建目录是否存在
    if [ ! -d ".next" ]; then
        log_warning "未找到 .next 构建目录"
        log_info "开始自动构建项目..."
        
        # 检查是否有pnpm
        if command -v pnpm &> /dev/null; then
            log_info "使用 pnpm 构建项目..."
            set +e
            pnpm build 2>&1
            local build_result=$?
            set -e
            
            if [ $build_result -ne 0 ]; then
                log_warning "pnpm build 失败，尝试使用 npm..."
                set +e
                npm run build 2>&1
                local npm_result=$?
                set -e
                
                if [ $npm_result -ne 0 ]; then
                    log_error "项目构建失败"
                    exit 1
                fi
            else
                log_success "项目构建成功（使用 pnpm）"
            fi
        else
            log_info "pnpm 未安装，使用 npm 构建项目..."
            set +e
            npm run build 2>&1
            local build_result=$?
            set -e
            
            if [ $build_result -ne 0 ]; then
                log_error "项目构建失败"
                exit 1
            else
                log_success "项目构建成功（使用 npm）"
            fi
        fi
    else
        log_success ".next 构建目录已存在"
    fi
    
    log_success "项目依赖检查完成"
}

# 启动应用
start_application() {
    log_info "启动 Next.js 应用..."
    
    cd "$PROJECT_DIR"
    
    load_nvm
    
    # 检查ecosystem.config.js是否存在
    if [ -f "ecosystem.config.js" ]; then
        log_info "使用 ecosystem.config.js 启动应用..."
        pm2 start ecosystem.config.js --env production
    else
        log_info "使用 PM2 直接启动应用..."
        pm2 start npm --name "$PROJECT_NAME" -- start
    fi
    
    # 等待应用启动
    sleep 3
    
    # 检查应用状态
    if pm2 list | grep -q "$PROJECT_NAME.*online"; then
        log_success "应用启动成功"
    else
        log_error "应用启动失败"
        log_info "查看日志: pm2 logs $PROJECT_NAME"
        pm2 logs "$PROJECT_NAME" --lines 20
        exit 1
    fi
}

# 保存PM2配置
save_pm2_config() {
    log_info "保存 PM2 配置..."
    
    load_nvm
    
    set +e
    pm2 save 2>&1
    set -e
    
    # 设置PM2开机自启
    log_info "设置 PM2 开机自启..."
    
    # 检查是否已经配置了开机自启
    if systemctl is-enabled pm2-root.service &>/dev/null || systemctl is-enabled pm2-$(whoami).service &>/dev/null; then
        log_success "PM2 开机自启已配置"
        return 0
    fi
    
    if [ "$EUID" -eq 0 ]; then
        # root用户直接设置
        set +e
        local startup_output=$(pm2 startup systemd -u root --hp /root 2>&1)
        local startup_result=$?
        set -e
        
        if [ $startup_result -eq 0 ]; then
            # 提取需要执行的命令（通常是 sudo systemctl enable ...）
            local startup_cmd=$(echo "$startup_output" | grep -E "^(sudo )?systemctl" | head -1)
            if [ -n "$startup_cmd" ]; then
                # 移除 sudo（因为已经是 root）
                startup_cmd=$(echo "$startup_cmd" | sed 's/^sudo //')
                set +e
                eval "$startup_cmd" 2>&1
                local enable_result=$?
                set -e
                
                if [ $enable_result -eq 0 ]; then
                    log_success "PM2 开机自启配置完成"
                else
                    log_warning "PM2 开机自启配置可能已存在"
                fi
            else
                log_warning "无法从 pm2 startup 输出中提取命令"
            fi
        else
            log_warning "pm2 startup 命令执行失败，可能已配置"
        fi
    else
        # 普通用户需要sudo
        set +e
        local startup_output=$(pm2 startup systemd -u $(whoami) --hp $HOME 2>&1)
        local startup_result=$?
        set -e
        
        if [ $startup_result -eq 0 ]; then
            # 提取需要执行的命令
            local startup_cmd=$(echo "$startup_output" | grep -E "^sudo systemctl" | head -1)
            if [ -n "$startup_cmd" ]; then
                log_warning "需要执行以下命令设置开机自启:"
                echo "$startup_cmd"
            else
                log_warning "无法从 pm2 startup 输出中提取命令"
            fi
        else
            log_warning "pm2 startup 命令执行失败"
        fi
    fi
}

# 显示启动信息
show_startup_info() {
    log_success "🎉 Next.js 应用启动完成！"
    echo ""
    echo "📊 环境信息:"
    load_nvm
    echo "  Node.js 版本: $(node --version)"
    echo "  npm 版本: $(npm --version)"
    echo "  PM2 版本: $(pm2 --version)"
    echo ""
    echo "📊 应用状态:"
    pm2 list
    echo ""
    echo "🔧 管理命令:"
    echo "  查看状态: pm2 status"
    echo "  查看日志: pm2 logs $PROJECT_NAME"
    echo "  重启应用: pm2 restart $PROJECT_NAME"
    echo "  停止应用: pm2 stop $PROJECT_NAME"
    echo "  删除应用: pm2 delete $PROJECT_NAME"
    echo ""
    echo "🌐 访问地址:"
    echo "  本地访问: http://localhost:3000"
    echo ""
    echo "📝 查看实时日志:"
    echo "  pm2 logs $PROJECT_NAME --lines 50"
}

# 主函数
main() {
    echo "🚀 Next.js 生产环境启动脚本"
    echo "=============================="
    echo "项目目录: $PROJECT_DIR"
    echo "Node.js 版本: ${NODE_VERSION}"
    echo ""
    
    # 执行启动步骤
    log_info "步骤 1/8: 检查用户..."
    check_user
    
    log_info "步骤 2/8: 安装/检查 nvm..."
    install_nvm
    
    log_info "步骤 3/8: 安装/检查 Node.js ${NODE_VERSION}..."
    install_nodejs
    
    log_info "步骤 4/8: 配置 npm 镜像源..."
    configure_npm_registry
    
    log_info "步骤 5/8: 安装/检查 pnpm..."
    install_pnpm
    
    log_info "步骤 6/8: 安装/检查 PM2..."
    install_pm2
    
    log_info "步骤 7/8: 检查项目依赖..."
    check_project_dependencies
    
    log_info "步骤 8/8: 启动应用..."
    start_application
    
    log_info "保存 PM2 配置..."
    save_pm2_config
    
    show_startup_info
}

# 错误处理函数
handle_error() {
    local exit_code=${1:-$?}  # 使用传入的退出码，如果没有则使用 $?
    local line_number=${2:-$LINENO}
    local command=${3:-"未知命令"}
    
    # 如果退出码是 0，说明可能是正常退出，不显示错误
    if [ $exit_code -eq 0 ]; then
        return 0
    fi
    
    log_error "=========================================="
    log_error "脚本执行失败！"
    log_error "=========================================="
    log_error "退出码: $exit_code"
    log_error "错误行号: $line_number"
    log_error "失败命令: $command"
    log_error "当前目录: $(pwd)"
    log_error "当前用户: $(whoami)"
    log_error "=========================================="
    
    # 显示环境信息
    log_info "环境信息:"
    log_info "  NVM_DIR: ${NVM_DIR:-未设置}"
    log_info "  PROJECT_DIR: ${PROJECT_DIR:-未设置}"
    
    # 如果nvm已加载，显示版本信息
    if [ -n "${NVM_DIR:-}" ] && [ -s "$NVM_DIR/nvm.sh" ]; then
        set +e
        . "$NVM_DIR/nvm.sh" 2>/dev/null
        if command -v node &> /dev/null; then
            log_info "  Node.js: $(node --version 2>/dev/null || echo '未安装')"
        fi
        set -e
    fi
    
    log_error "请检查上述错误信息并解决问题后重试"
    return $exit_code
}

# 设置错误处理 trap
trap 'handle_error $? $LINENO "$BASH_COMMAND"' ERR

# 设置退出处理（只在非正常退出时显示错误）
trap 'exit_code=$?; if [ $exit_code -ne 0 ]; then handle_error $exit_code $LINENO "$BASH_COMMAND"; fi' EXIT

# 执行主函数
main "$@"

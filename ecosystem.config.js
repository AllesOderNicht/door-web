module.exports = {
  apps: [{
    name: 'door-web',
    script: 'npm',
    args: 'start',
    cwd: '/usr/local/myhome/code',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/usr/local/myhome/logs/err.log',
    out_file: '/usr/local/myhome/logs/out.log',
    log_file: '/usr/local/myhome/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.git'],
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};

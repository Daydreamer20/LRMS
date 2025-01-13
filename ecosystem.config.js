module.exports = {
  apps: [{
    name: 'evaluation-events',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env_development: {
      NODE_ENV: 'development',
      PORT: 8080
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: 'logs/error.log',
    out_file: 'logs/output.log',
    log_file: 'logs/combined.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    log_type: 'json',
    max_size: '10M',
    max_files: '14d',
    min_uptime: '5000',
    max_restarts: 10,
    restart_delay: 4000,
    wait_ready: true,
    kill_timeout: 3000,
    listen_timeout: 30000,
    source_map_support: false,
    instance_var: 'INSTANCE_ID',
    autorestart: true,
    exp_backoff_restart_delay: 100,
    cron_restart: '0 3 * * *', // Restart at 3 AM every day
    vizion: false
  }]
}; 
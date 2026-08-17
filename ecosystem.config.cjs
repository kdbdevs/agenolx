module.exports = {
  apps: [
    {
      name: "pemulabet",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      cwd: "/www/wwwroot/pemulabet.com",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    },
    {
      name: "pemulabet-admin",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3001",
      cwd: "/www/wwwroot/pemulabet.com",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3001"
      }
    }
  ]
};

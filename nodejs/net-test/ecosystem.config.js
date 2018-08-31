module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : "express-test",
      script    : "./express-test.js",
      env: {
        "NODE_ENV": "production",
      },
      env_development: {
        "NODE_ENV": "development",
      },
      env_beta : {
        NODE_ENV: "beta"
      },
      log_type: "json",
      max_memory_restart: "512M",
      // instances : '2',
      // exec_mode : 'cluster',
    }
  ]
}

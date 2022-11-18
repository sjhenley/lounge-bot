import BotConfiguration from '../models/bot-configuration.model';

export default {
  config(forceReload: boolean = false): BotConfiguration {
    const nodeEnv = process.env.NODE_ENV || 'dev';
    if (forceReload) {
      delete require.cache[require.resolve(`./config.${nodeEnv}`)];
    }
    const config = require(`./config.${nodeEnv}`).default;
    return config;
  }
};

import globalConfig from './config.global';

const config = globalConfig;

config.dynamoDb.tableName = 'lounge-dev';
config.guild.topBalanceRole.roleId = '1043616305942634558';

export default config;

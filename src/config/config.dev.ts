import globalConfig from './config.global';

const config = globalConfig;

config.dynamoDb.tableName = 'lounge-dev';
config.guild.topBalanceRole.roleId = '1043616305942634558';

config.activityScore.balanceReward.scoreAuditInterval = 5000;
config.activityScore.balanceReward.scoreThreshold = 1;
config.activityScore.balanceReward.rewardAmount = 1;

export default config;

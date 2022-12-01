import BotConfiguration from '../models/bot-configuration.model';

const config: BotConfiguration = {
  dynamoDb: {
    tableName: 'REPLACE_WITH_TABLE_NAME'
  },
  guild: {
    topBalanceRole: {
      roleId: 'REPLACE_WITH_ROLE_ID',
    }
  },
  activityScore: {
    activityScoreReward: {
      message: 1,
      voice: 1,
    },
    balanceReward: {
      // 1 day = 1000 * 60 * 60 * 24 = 86400000
      scoreAuditInterval: 86400000,
      scoreThreshold: 100,
      rewardAmount: 10,
    }
  }
};

export default config;

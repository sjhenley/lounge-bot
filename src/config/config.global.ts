const config = {
  dynamoDb: {
    tableName: 'REPLACE_WITH_TABLE_NAME'
  },
  guild: {
    topBalanceRole: {
      roleId: 'REPLACE_WITH_ROLE_ID',
    }
  },
  activityScore: {
    reward: {
      // Score to reward for each sent message
      message: 1,

      // Score to reward for each minute of voice activity
      voice: 1,
    }
  }
};

export default config;

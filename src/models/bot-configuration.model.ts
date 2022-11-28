interface BotConfiguration {
  dynamoDb: {
    tableName: string
  },
  guild: {
    topBalanceRole: {
      roleId: string
    }
  },
  activityScore: {
    reward: {
      message: number,
      voice: number
    }
  }
}

export default BotConfiguration;

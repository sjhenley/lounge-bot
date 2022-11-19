interface BotConfiguration {
  dynamoDb: {
    tableName: string
  },
  guild: {
    topBalanceRole: {
      roleId: string
    }
  }
}

export default BotConfiguration;

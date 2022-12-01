interface BotConfiguration {
  dynamoDb: {
    tableName: string
  },
  guild: {
    topBalanceRole: {
      /**
       * ID of role to assign to users with the highest balance
       */
      roleId: string
    }
  },
  activityScore: {
    activityScoreReward: {
      /**
       * Score to reward for each sent message
       */
      message: number,

      /**
       * Score to reward for each minute of voice activity
       */
      voice: number
    },
    balanceReward: {
      /**
       * Interval in milliseconds to check if members are eligible for balance rewards
       */
      scoreAuditInterval: number,

      /**
       * Activity score required to be eligible for balance rewards
       */
      scoreThreshold: number,

      /**
       * Balance to reward to members who are eligible for balance rewards
       */
      rewardAmount: number,
    }
  }
}

export default BotConfiguration;

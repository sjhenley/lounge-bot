const COMMAND = {
  BALANCE: {
    NAME: 'balance',
    DESCRIPTION: 'Retrieve your balance, or the balance of another user',
    OPTIONS: {
      TARGET_USER: {
        NAME: 'user',
        DESCRIPTION: 'Target user',
      },
    }
  },
  GIVE_FUNDS: {
    NAME: 'give',
    DESCRIPTION: 'Give another user some of your money',
    OPTIONS: {
      TARGET_USER: {
        NAME: 'user',
        DESCRIPTION: 'Target user',
      },
      AMOUNT: {
        NAME: 'amount',
        DESCRIPTION: 'Amount to give',
      },
    }
  },
  ADD_FUNDS: {
    NAME: 'add-funds',
    DESCRIPTION: 'Add funds to a user\'s account (Admin only)',
    OPTIONS: {
      TARGET_USER: {
        NAME: 'user',
        DESCRIPTION: 'Target user',
      },
      AMOUNT: {
        NAME: 'amount',
        DESCRIPTION: 'Amount to add',
      }
    }
  },
  TOP_BALANCE: {
    NAME: 'top',
    DESCRIPTION: 'Retrieve users with the highest balance',
  }
};

export default COMMAND;

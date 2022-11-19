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
  }
};

export default COMMAND;

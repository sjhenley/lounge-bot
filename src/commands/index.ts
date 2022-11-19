import InfoCommand from './info.command';
import balanceCommand from './economy/get-balance.command';
import giveFundsCommand from './economy/give-funds.command';
import addFundsCommand from './economy/add-funds.command';
import topBalanceCommand from './economy/top-balance.command';

export default [
  InfoCommand,

  // Economy
  balanceCommand,
  topBalanceCommand,
  giveFundsCommand,
  addFundsCommand,
];

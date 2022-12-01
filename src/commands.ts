import InfoCommand from './modules/misc/commands/info.command';
import AddFundsCommand from './modules/economy/commands/add-funds.command';
import BalanceCommand from './modules/economy/commands/get-balance.command';
import GiveFundsCommand from './modules/economy/commands/give-funds.command';
import TopBalanceCommand from './modules/economy/commands/top-balance.command';

export default [
  InfoCommand,

  // Economy
  BalanceCommand,
  TopBalanceCommand,
  GiveFundsCommand,
  AddFundsCommand,
];

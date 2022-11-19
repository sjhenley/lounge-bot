import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import COMMAND from '../../const/command.constants';
import EconomyController from '../../controllers/economy.controller';
import logger from '../../logger/logger-init';
import { Command } from '../../models/command.model';
import BalanceResult from '../../models/interaction-result-data/balance-result.model';


const balanceCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName(COMMAND.BALANCE.NAME)
    .setDescription(COMMAND.BALANCE.DESCRIPTION)
    .addUserOption((option) => 
      option
        .setName(COMMAND.BALANCE.OPTIONS.TARGET_USER.NAME)
        .setDescription(COMMAND.BALANCE.OPTIONS.TARGET_USER.DESCRIPTION)),
  execute: async (interaction: CommandInteraction) => {
    return EconomyController.getInstance().getBalanceForUser(interaction)
      .then((result: BalanceResult) => {
        interaction.editReply(`Balance for user ${result.username} is ${result.balance}`);
      })
      .catch(() => {
        interaction.editReply('There was an error retrieving the balance for the user');
      });
  }
};

export default balanceCommand;

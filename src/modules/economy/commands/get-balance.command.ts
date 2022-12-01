import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { Command } from '../../misc/models/command.model';
import COMMAND from '../const/economy-command.constants';
import EconomyController from '../controllers/economy.controller';
import BalanceResult from '../models/balance-result.model';

const BalanceCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName(COMMAND.BALANCE.NAME)
    .setDescription(COMMAND.BALANCE.DESCRIPTION)
    .addUserOption((option) => option
      .setName(COMMAND.BALANCE.OPTIONS.TARGET_USER.NAME)
      .setDescription(COMMAND.BALANCE.OPTIONS.TARGET_USER.DESCRIPTION)),
  execute: async (interaction: CommandInteraction) => EconomyController.getInstance().getBalanceForUser(interaction)
    .then((result: BalanceResult) => {
      interaction.editReply(`Balance for user ${result.username} is ${result.balance}`);
    })
    .catch(() => {
      interaction.editReply('There was an error retrieving the balance for the user');
    })
};

export default BalanceCommand;

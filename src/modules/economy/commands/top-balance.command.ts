import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../misc/models/command.model';
import COMMAND from '../const/economy-command.constants';
import EconomyController from '../controllers/economy.controller';

const TopBalanceCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName(COMMAND.TOP_BALANCE.NAME)
    .setDescription(COMMAND.TOP_BALANCE.DESCRIPTION),
  execute: async (interaction: CommandInteraction) => EconomyController.getInstance().getTopBalanceUsers()
    .then((topBalanceUsers) => {
      const topBalanceUsersString = topBalanceUsers.map((user, index) => `${index + 1}. ${user.username} - ${user.balance}`).join('\n');
      interaction.editReply(`Top users by balance:\n${topBalanceUsersString}`);
    })
    .catch(() => {
      interaction.editReply('There was an error getting the top balance users.');
    })
};

export default TopBalanceCommand;

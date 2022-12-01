import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import COMMAND from '../const/economy-command.constants';
import EconomyController from '../controllers/economy.controller';
import { Command } from '../../misc/models/command.model';
import DiscordService from '../../misc/services/discord.service';

const AddFundsCommand: Command = {
  priviledgedCommand: true,
  data: new SlashCommandBuilder()
    .setName(COMMAND.ADD_FUNDS.NAME)
    .setDescription(COMMAND.ADD_FUNDS.DESCRIPTION)
    .addUserOption((option) => option
      .setName(COMMAND.ADD_FUNDS.OPTIONS.TARGET_USER.NAME)
      .setDescription(COMMAND.ADD_FUNDS.OPTIONS.TARGET_USER.DESCRIPTION)
      .setRequired(true))
    .addIntegerOption((option) => option
      .setName(COMMAND.ADD_FUNDS.OPTIONS.AMOUNT.NAME)
      .setDescription(COMMAND.ADD_FUNDS.OPTIONS.AMOUNT.DESCRIPTION)
      .setRequired(true)),
  execute: async (interaction: CommandInteraction) => EconomyController.getInstance().addFundsToUser(interaction)
    .then(async (result) => {
      interaction.editReply(`Added ${result.amount} to ${result.targetUser.username}`);
      await EconomyController.getInstance().updateTopBalanceRole(interaction);
      await DiscordService.getInstance().sendDirectMessageToUser(result.targetUser.id, `You have received ${result.amount}!`);
    })
    .catch(() => {
      interaction.editReply('There was an error transferring funds to the user');
    })
};

export default AddFundsCommand;

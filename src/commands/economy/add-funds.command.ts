import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import COMMAND from '../../const/command.constants';
import EconomyController from '../../controllers/economy.controller';
import { Command } from '../../models/command.model';
import DiscordService from '../../services/discord.service';

const addFundsCommand: Command = {
  priviledgedCommand: true,
  data: new SlashCommandBuilder()
    .setName(COMMAND.ADD_FUNDS.NAME)
    .setDescription(COMMAND.ADD_FUNDS.DESCRIPTION)
    .addUserOption((option) =>
      option
        .setName(COMMAND.ADD_FUNDS.OPTIONS.TARGET_USER.NAME)
        .setDescription(COMMAND.ADD_FUNDS.OPTIONS.TARGET_USER.DESCRIPTION)
        .setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName(COMMAND.ADD_FUNDS.OPTIONS.AMOUNT.NAME)
        .setDescription(COMMAND.ADD_FUNDS.OPTIONS.AMOUNT.DESCRIPTION)
        .setRequired(true)),
  execute: async (interaction: CommandInteraction) => {
    return EconomyController.getInstance().addFundsToUser(interaction)
    .then((result) => {
      interaction.editReply(`Added ${result.amount} to ${result.targetUser.username}`);
      DiscordService.getInstance().sendDirectMessageToUser(result.targetUser.id, `You have received ${result.amount}!`);
    })
    .catch(() => {
      interaction.editReply('There was an error transferring funds to the user');
    });
  }
};

export default addFundsCommand;

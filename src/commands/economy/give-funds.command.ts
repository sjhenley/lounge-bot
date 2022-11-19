import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import COMMAND from '../../const/command.constants';
import EconomyController from '../../controllers/economy.controller';
import logger from '../../logger/logger-init';
import { Command } from '../../models/command.model';
import DiscordService from '../../services/discord.service';

const giveFundsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName(COMMAND.GIVE_FUNDS.NAME)
    .setDescription(COMMAND.GIVE_FUNDS.DESCRIPTION)
    .addUserOption((option) =>
      option
        .setName(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.NAME)
        .setDescription(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.DESCRIPTION)
        .setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.NAME)
        .setDescription(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.DESCRIPTION)
        .setRequired(true)),
  execute: async (interaction: CommandInteraction) => {
    logger.info('User invoked give-funds command');
    await interaction.deferReply({ ephemeral: true });

    EconomyController.getInstance().transferFunds(interaction)
      .then((result) => {
        interaction.editReply(`Trasferred ${result.amount} to ${result.targetUser.username}`);
        DiscordService.getInstance().sendDirectMessageToUser(result.targetUser.id, `You have received ${result.amount} from ${result.sourceUser.username}!`);
      })
      .catch(() => {
        interaction.editReply('There was an error transferring funds to the user');
      })
      .finally(() => {
        logger.info('Finished processing give-funds command');
      });
  }
};

export default giveFundsCommand;

import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../misc/models/command.model';
import DiscordService from '../../misc/services/discord.service';
import COMMAND from '../const/economy-command.constants';
import EconomyController from '../controllers/economy.controller';

const GiveFundsCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName(COMMAND.GIVE_FUNDS.NAME)
    .setDescription(COMMAND.GIVE_FUNDS.DESCRIPTION)
    .addUserOption((option) => option
      .setName(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.NAME)
      .setDescription(COMMAND.GIVE_FUNDS.OPTIONS.TARGET_USER.DESCRIPTION)
      .setRequired(true))
    .addIntegerOption((option) => option
      .setName(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.NAME)
      .setDescription(COMMAND.GIVE_FUNDS.OPTIONS.AMOUNT.DESCRIPTION)
      .setRequired(true)),
  execute: async (interaction: CommandInteraction) => EconomyController.getInstance().transferFunds(interaction)
    .then(async (result) => {
      interaction.editReply(`Trasferred ${result.amount} to ${result.targetUser.username}`);
      await EconomyController.getInstance().updateTopBalanceRole(interaction);
      await DiscordService.getInstance().sendDirectMessageToUser(result.targetUser.id, `You have received ${result.amount} from ${result.sourceUser.username}!`);
    })
    .catch(() => {
      interaction.editReply('There was an error transferring funds to the user');
    })
};

export default GiveFundsCommand;

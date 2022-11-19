import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import COMMAND from '../../const/command.constants';
import { Command } from '../../models/command.model';

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
    await interaction.reply({ content: 'Command not implemented', ephemeral: true});
  }
};

export default addFundsCommand;

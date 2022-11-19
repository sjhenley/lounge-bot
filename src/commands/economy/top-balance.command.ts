import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import COMMAND from '../../const/command.constants';
import { Command } from '../../models/command.model';

const topBalanceCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName(COMMAND.TOP_BALANCE.NAME)
    .setDescription(COMMAND.TOP_BALANCE.DESCRIPTION),
  execute: async (interaction: CommandInteraction) => {
    await interaction.editReply('Command not implemented');
  }
};

export default topBalanceCommand;

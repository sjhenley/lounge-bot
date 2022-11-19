import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import COMMAND from '../../const/command.constants';
import { Command } from '../../models/command.model';

const topBalanceCommand: Command = {
  data: new SlashCommandBuilder()
    .setName(COMMAND.TOP_BALANCE.NAME)
    .setDescription(COMMAND.TOP_BALANCE.DESCRIPTION),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply({ content: 'Command not implemented', ephemeral: true});
  }
};

export default topBalanceCommand;

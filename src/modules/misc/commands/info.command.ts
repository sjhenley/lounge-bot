import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { Command } from '../models/command.model';
import packageJson from '../../../../package.json';

const infoCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gives some information about the bot'),
  execute: async (interaction: CommandInteraction) => {
    const { version } = packageJson;
    const replyMessage = `LoungeBot version ${version}`;
    await interaction.editReply(replyMessage);
  }
};

export default infoCommand;

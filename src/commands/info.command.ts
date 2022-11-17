import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { CommandModel } from '../models/command.model';
import packageJson from '../../package.json';

const infoCommand: CommandModel = {
  data: new SlashCommandBuilder().setName('info').setDescription('Gives some information about the bot'),
  execute: async (interaction: CommandInteraction) => {
    const { version } = packageJson;
    const replyMessage = `LoungeBot version ${version}`;
    await interaction.reply(replyMessage);
  }
};

export default infoCommand;

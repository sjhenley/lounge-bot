import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { Command } from '../models/command.model';
import packageJson from '../../../../package.json';
import { COMMAND } from '../const/info-command.constants';

const infoCommand: Command = {
  priviledgedCommand: false,
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gives some information about the bot'),
  execute: async (interaction: CommandInteraction) => {
    const { version } = packageJson;
    const replyBody = [
      `LoungeBot v${version}`,
      `View the latest changes: <${COMMAND.INFO.RESPONSE.CHANGELOG_URL}>`,
      `Report an issue or request a feature: <${COMMAND.INFO.RESPONSE.ISSUES_URL}>`
    ];

    const message = replyBody.join('\n');
    await interaction.editReply(message);
  }
};

export default infoCommand;

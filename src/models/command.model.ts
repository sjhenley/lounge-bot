import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface CommandModel {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

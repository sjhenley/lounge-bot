import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  priviledgedCommand: boolean;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

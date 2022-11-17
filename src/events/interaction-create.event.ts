import { Events } from 'discord.js';
import BotInteraction from '../models/bot-interaction.model';
import { InteractionEvent } from '../models/interaction-event.model';

const interactionCreateEvent: InteractionEvent = {
  name: Events.InteractionCreate,
  once: false,
  execute: async (interaction: BotInteraction) => {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
};

export default interactionCreateEvent;

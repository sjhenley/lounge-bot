import { Events } from 'discord.js';
import DynamoDbDao from '../dao/dynamodb.dao';
import logger from '../logger/logger-init';
import BotInteraction from '../models/bot-interaction.model';
import { InteractionEvent } from '../models/interaction-event.model';
import LoungeUserService from '../services/lounge-user.service';

const interactionCreateEvent: InteractionEvent = {
  name: Events.InteractionCreate,
  once: false,
  execute: async (interaction: BotInteraction) => {
    if (!interaction.isCommand()) return;
    
    await interaction.deferReply({ ephemeral: true });

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const commandName = command.data.name;
    logger.info(`User invoked command: ${commandName}`);

    if (command.priviledgedCommand) {
      logger.debug('Command is priviledged, checking if user is in the lounge');
      const canActivate = await new LoungeUserService(new DynamoDbDao()).isPriviledgedUser(interaction.user.id);
      if (!canActivate) {
        logger.warn('User does not have admin priviledges, rejecting command');
        await interaction.editReply('You do not have permission to use this command');
        logger.info(`Finished processing command: ${commandName}`);
        return;
      }
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.editReply('There was an error while executing this command!');
    } finally {
      logger.info(`Finished processing command: ${commandName}`);
    }
  }
};

export default interactionCreateEvent;

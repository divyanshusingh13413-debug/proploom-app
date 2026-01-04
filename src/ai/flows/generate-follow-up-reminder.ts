'use server';
/**
 * @fileOverview Generates a personalized follow-up reminder for agents.
 *
 * - generateFollowUpReminder - A function that generates the follow-up reminder.
 * - GenerateFollowUpReminderInput - The input type for the generateFollowUpReminder function.
 * - GenerateFollowUpReminderOutput - The return type for the generateFollowUpReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpReminderInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  propertyViewed: z.string().describe('The name of the property the client viewed.'),
  interactionDate: z.string().describe('The date the client viewed the property (e.g., 2 days ago).'),
  agentName: z.string().describe('The name of the agent.'),
  clientPreferences: z.string().describe('Any known client preferences.'),
});
export type GenerateFollowUpReminderInput = z.infer<typeof GenerateFollowUpReminderInputSchema>;

const GenerateFollowUpReminderOutputSchema = z.object({
  reminderMessage: z.string().describe('The personalized follow-up reminder message.'),
});
export type GenerateFollowUpReminderOutput = z.infer<typeof GenerateFollowUpReminderOutputSchema>;

export async function generateFollowUpReminder(input: GenerateFollowUpReminderInput): Promise<GenerateFollowUpReminderOutput> {
  return generateFollowUpReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFollowUpReminderPrompt',
  input: {schema: GenerateFollowUpReminderInputSchema},
  output: {schema: GenerateFollowUpReminderOutputSchema},
  prompt: `You are an AI assistant designed to help real estate agents by generating personalized follow-up reminders.

  Based on the information provided about the client's previous interactions and preferences, create a follow-up reminder message for the agent.

  Client Name: {{{clientName}}}
  Property Viewed: {{{propertyViewed}}}
  Interaction Date: {{{interactionDate}}}
  Agent Name: {{{agentName}}}
  Client Preferences: {{{clientPreferences}}}

  Generate a concise and friendly reminder message that encourages the agent to follow up with the client. The message should be no more than 50 words.
  Example: "Reminder: Follow up with {{{clientName}}} regarding {{{propertyViewed}}}. They viewed it {{{interactionDate}}} and expressed interest in features like {{{clientPreferences}}}."

  Reminder Message:`,
});

const generateFollowUpReminderFlow = ai.defineFlow(
  {
    name: 'generateFollowUpReminderFlow',
    inputSchema: GenerateFollowUpReminderInputSchema,
    outputSchema: GenerateFollowUpReminderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

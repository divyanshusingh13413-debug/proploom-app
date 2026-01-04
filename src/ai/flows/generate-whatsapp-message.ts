'use server';

/**
 * @fileOverview Automatically sends property brochures and welcome messages to new leads via WhatsApp.
 *
 * - generateWhatsappMessage - A function that generates a personalized WhatsApp message for new leads.
 * - GenerateWhatsappMessageInput - The input type for the generateWhatsappMessage function.
 * - GenerateWhatsappMessageOutput - The return type for the generateWhatsappMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWhatsappMessageInputSchema = z.object({
  leadSource: z.string().describe('The source of the lead (e.g., website, referral).'),
  propertyName: z.string().describe('The name of the property the lead is interested in.'),
  leadName: z.string().describe('The name of the lead.'),
  propertyBrochureUrl: z.string().describe('URL of the property brochure.'),
});

export type GenerateWhatsappMessageInput = z.infer<
  typeof GenerateWhatsappMessageInputSchema
>;

const GenerateWhatsappMessageOutputSchema = z.object({
  message: z.string().describe('The personalized WhatsApp message to send to the lead.'),
});

export type GenerateWhatsappMessageOutput = z.infer<
  typeof GenerateWhatsappMessageOutputSchema
>;

export async function generateWhatsappMessage(
  input: GenerateWhatsappMessageInput
): Promise<GenerateWhatsappMessageOutput> {
  return generateWhatsappMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWhatsappMessagePrompt',
  input: {schema: GenerateWhatsappMessageInputSchema},
  output: {schema: GenerateWhatsappMessageOutputSchema},
  prompt: `You are an expert marketing assistant specializing in creating personalized WhatsApp messages for new real estate leads.

  Based on the lead's source, their name, and the property they are interested in, create a welcoming and engaging message that includes a link to the property brochure. The goal is to make a personalized message that entices the user to find out more.

  Lead Source: {{{leadSource}}}
  Property Name: {{{propertyName}}}
  Lead Name: {{{leadName}}}
  Property Brochure URL: {{{propertyBrochureUrl}}}

  Create a personalized WhatsApp message:
`,
});

const generateWhatsappMessageFlow = ai.defineFlow(
  {
    name: 'generateWhatsappMessageFlow',
    inputSchema: GenerateWhatsappMessageInputSchema,
    outputSchema: GenerateWhatsappMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

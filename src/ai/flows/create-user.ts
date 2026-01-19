
'use server';
/**
 * @fileOverview Creates a user in Firebase Authentication and a corresponding document in Firestore.
 * This flow should only be callable by an authenticated admin user.
 *
 * - createUser - A function that handles the user creation process.
 * - CreateUserInput - The input type for the createUser function.
 * - CreateUserOutput - The return type for the createUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {initializeApp, getApps, App} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

const adminApp =
  getApps().find(app => app.name === 'admin') ||
  initializeApp(
    {
      credential:
        serviceAccount &&
        require('firebase-admin/app').cert(serviceAccount),
    },
    'admin'
  );

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

const CreateUserInputSchema = z.object({
  email: z.string().email().describe('The email for the new user.'),
  password: z.string().min(6).describe('The password for the new user.'),
  displayName: z.string().describe('The display name for the new user.'),
  roles: z.array(z.enum(['agent', 'admin'])).describe('The roles of the new user.'),
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

const CreateUserOutputSchema = z.object({
  uid: z.string().describe('The UID of the newly created user.'),
  email: z.string().email().describe('The email of the newly created user.'),
  message: z.string().describe('A success message.'),
});
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;

export async function createUser(
  input: CreateUserInput
): Promise<CreateUserOutput> {
  return createUserFlow(input);
}

const createUserFlow = ai.defineFlow(
  {
    name: 'createUserFlow',
    inputSchema: CreateUserInputSchema,
    outputSchema: CreateUserOutputSchema,
  },
  async input => {
    try {
      const userRecord = await adminAuth.createUser({
        email: input.email,
        password: input.password,
        displayName: input.displayName,
      });

      const userDoc = {
        displayName: input.displayName,
        email: input.email,
        roles: input.roles,
        isFirstLogin: true, // New users should set their password
        createdAt: new Date(),
      };

      await adminDb.collection('users').doc(userRecord.uid).set(userDoc);

      return {
        uid: userRecord.uid,
        email: userRecord.email!,
        message: `Successfully created user ${userRecord.displayName}.`,
      };
    } catch (error: any) {
      console.error('Error creating user:', error);
      // Throw an error that the client can handle
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
);

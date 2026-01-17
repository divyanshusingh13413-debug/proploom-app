'use server';
/**
 * @fileOverview Deletes a user from Firebase Authentication and their corresponding document in Firestore.
 * This flow should only be callable by an authenticated admin user.
 *
 * - deleteUser - A function that handles the user deletion process.
 * - DeleteUserInput - The input type for the deleteUser function.
 * - DeleteUserOutput - The return type for the deleteUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {initializeApp, getApps} from 'firebase-admin/app';
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

const DeleteUserInputSchema = z.object({
  uid: z.string().describe('The UID of the user to delete.'),
});
export type DeleteUserInput = z.infer<typeof DeleteUserInputSchema>;

const DeleteUserOutputSchema = z.object({
  message: z.string().describe('A success message.'),
});
export type DeleteUserOutput = z.infer<typeof DeleteUserOutputSchema>;

export async function deleteUser(
  input: DeleteUserInput
): Promise<DeleteUserOutput> {
  return deleteUserFlow(input);
}

const deleteUserFlow = ai.defineFlow(
  {
    name: 'deleteUserFlow',
    inputSchema: DeleteUserInputSchema,
    outputSchema: DeleteUserOutputSchema,
  },
  async input => {
    try {
      // Delete from Firestore first
      await adminDb.collection('users').doc(input.uid).delete();

      // Then delete from Firebase Auth
      await adminAuth.deleteUser(input.uid);

      return {
        message: `Successfully deleted user ${input.uid}.`,
      };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      // Re-create user doc if auth deletion fails to maintain consistency
      if (error.code === 'auth/user-not-found') {
        // If user is not in Auth, we just log it and proceed
         console.log(`User with uid ${input.uid} not found in Firebase Auth, but was deleted from Firestore.`);
      } else {
         throw new Error(`Failed to delete user: ${error.message}`);
      }
       return {
        message: `Successfully deleted user ${input.uid} from Firestore. User was not found in Auth.`,
      };
    }
  }
);

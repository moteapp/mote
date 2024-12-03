'use server';

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

/**
 * Logs the user out by deleting the credential cookie and redirecting to the home page.
 */
export async function logoutAction() {
    console.log('Logging out');
    (await cookies()).delete('credential');
    console.log('redirecting to home page');
    redirect('/');
}
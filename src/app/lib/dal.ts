import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { prisma } from 'mote/base/parts/storage/common/prisma';
import { verifyJWT } from 'mote/server/common/jwt';

// This is a Data Access Layer (DAL).
// It used to centralize your data requests and authorization logic.

/**
 * Verify the token from the Authorization header.
 */
export const verifyToken = cache(async () => {

    let token: string | undefined;

    token = (await cookies()).get('credential')?.value;

    if (!token) {
        const authorization = (await headers()).get('Authorization');
        if (!authorization) {
            redirect('/');
        }

        const parts = authorization.split(' ');
        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            } else {
                redirect('/');
            }
        } else {
            redirect('/');
        }
    }

    try {
        const { id } = verifyJWT(token);
        return { isAuth: true, userId: id };
    } catch (error)
    {
        redirect('/');
    }
});

/**
 * Fetch the user from the database.
 */
export const getUser = cache(async () => {
    console.log('[DAL] Fetching user from database');
    const { userId } = await verifyToken();

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return user;
    } catch (error) {
        console.log('Failed to fetch user')
        return null;
    }
});
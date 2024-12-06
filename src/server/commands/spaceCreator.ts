import { prisma } from "mote/base/parts/storage/common/prisma";

type SpaceCreatorOptions = {
    /** The displayed name of the team */
    name: string;
    /** The domain name from the email of the user logging in */
    domain?: string;
    /** The preferred subdomain to provision for the team if not yet created */
    subdomain: string;
    /** The public url of an image representing the team */
    avatarUrl?: string | null;
    /** The IP address of the incoming request */
    ip: string;
    userId: string;
};

export async function spaceCreator({
    name,
    domain,
    subdomain,
    avatarUrl,
    ip,
    userId,
}: SpaceCreatorOptions) {
    const space = await prisma.space.create({
        data: {
            name,
            domain,
            subdomain,
            users: {
                create: {
                    userId,
                    role: 'OWNER',
                },
            },
        },
    });

    return space;
}

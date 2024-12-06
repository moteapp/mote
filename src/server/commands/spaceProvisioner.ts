import { prisma } from "mote/base/parts/storage/common/prisma";
import { IUser } from "mote/base/parts/storage/common/schema";
import { spaceCreator } from "./spaceCreator";

export type SpaceProvisionerOptions = {
    /**
     * The internal ID of the space that is being logged into based on the
     * subdomain that the request came from, if any.
     */
    spaceId?: string;
    /** The displayed name of the space */
    name: string;
    /** The domain name from the email of the user logging in */
    domain?: string;
    /** The preferred subdomain to provision for the space if not yet created */
    subdomain: string;
    /** The public url of an image representing the space */
    avatarUrl?: string | null;
    user: IUser;
};

export async function spaceProvisioner({
    ip,
    spaceId,
    name,
    domain,
    subdomain,
    avatarUrl,
    user,
}: SpaceProvisionerOptions & { ip: string }) {
    // Check if the space already exists by userId
    const existingSpace = await prisma.space.findFirst({
        where: {
            users: {
                some: {
                    userId: user.id,
                },
            },
        },
    });

    if (existingSpace) {
        return {
            space: existingSpace,
            isNewSpace: false,
        };
    }

    // We cannot find an existing space, so we create a new one
    const space = await spaceCreator({
        name,
        domain,
        subdomain,
        avatarUrl,
        ip,
        userId: user.id,
    });

    return {
        space,
        isNewSpace: true,
    };
}
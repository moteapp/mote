import { IUserModel } from "@mote/client/model/model.js";
import { instantiationService } from "../service/service.all.js";
import { ISpaceService } from "../service/space/space.js";
import { IUserService } from "../service/user/user.js";

const email = process.argv[2];

export default async function main(exit = false) {
    await instantiationService.invokeFunction(async (accessor) => {
        const spaceService = accessor.get(ISpaceService);
        const userService = accessor.get(IUserService);

        const userCount = await userService.count({ email });

        if (userCount === 0) {
            const userId = await userService.create({
                email,
                username: email.split("@")[0],
            });
            
            const spaceId = await spaceService.create({
                name: 'Wiki'
            });

            await spaceService.addMember(
                spaceId,
                userId,
            );
        }

        const users = await userService.find({ email });
        console.log("users", users[0]);
        const token = userService.getEmailSigninToken(users[0]);

        console.log("email", `✅ Seed done – sign-in link: /auth/email.callback?token=${token}`);
    });
    
    if (exit) {
        process.exit(0);
    }
}
void main(true);

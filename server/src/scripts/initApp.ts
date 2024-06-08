import { instantiationService } from "../service/service.all.js";
import { ITeamService } from "../service/team/team.js";
import { IUserService } from "../service/user/user.js";

const email = process.argv[2];

export default async function main(exit = false) {
    await instantiationService.invokeFunction(async (accessor) => {
        const teamService = accessor.get(ITeamService);
        const userService = accessor.get(IUserService);

        const teamCount = await teamService.count({ 1: 1 });

        if (teamCount === 0) {
            const team = await teamService.create({
                name: 'Wiki'
            });
            
            await userService.create({
                email,
                username: email.split("@")[0],
            });
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

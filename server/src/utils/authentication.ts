import { addMonths } from "date-fns";
import { Context } from "koa";
import { AccountProvisionerResult } from "mote/commands/accountProvisioner.js";
import { getCookieDomain } from "./domain.js";
import { environment } from "mote/common/enviroment.js";
import { getJwtToken } from "./jwt.js";

export async function signIn(
    ctx: Context,
    service: string,
    { user, team, isNewTeam }: AccountProvisionerResult
) {
    if (isNewTeam) {
        // see: scenes/Login/index.js for where this cookie is written when
        // viewing the /login or /create pages. It is a URI encoded JSON string.
        const cookie = ctx.cookies.get("signupQueryParams");

        if (cookie) {

        }
    }

    const expires = addMonths(new Date(), 3);
    const domain = getCookieDomain(ctx.request.hostname, environment.isCloudHosted);

    // set a cookie for which service we last signed in with. This is
    // only used to display a UI hint for the user for next time
    ctx.cookies.set("lastSignedIn", service, {
        httpOnly: false,
        sameSite: true,
        expires: new Date("2100"),
        domain,
    });

    // set a transfer cookie for the access token itself and redirect
    // to the teams subdomain if subdomains are enabled
    if (environment.isCloudHosted && team.subdomain) {

    } else {
        ctx.cookies.set("accessToken", getJwtToken(user, expires), {
            sameSite: "lax",
            expires,
        });

        ctx.redirect("/home");
    }
}
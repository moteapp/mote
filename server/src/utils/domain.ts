// strips protocol and whitespace from input

import { trim } from "@mote/base/common/strings";
import { environment } from "mote/common/enviroment.js";

type Domain = {
    teamSubdomain: string;
    host: string;
    custom: boolean;
};
  

export const RESERVED_SUBDOMAINS = [
    "about",
    "account",
    "admin",
    "advertising",
    "api",
    "app",
    "assets",
    "archive",
    "beta",
    "billing",
    "blog",
    "cache",
    "cdn",
    "code",
    "community",
    "dashboard",
    "developer",
    "developers",
    "forum",
    "help",
    "home",
    "http",
    "https",
    "imap",
    "localhost",
    "mail",
    "marketing",
    "mobile",
    "multiplayer",
    "new",
    "news",
    "newsletter",
    "ns1",
    "ns2",
    "ns3",
    "ns4",
    "password",
    "profile",
    "realtime",
    "sandbox",
    "script",
    "scripts",
    "setup",
    "signin",
    "signup",
    "site",
    "smtp",
    "support",
    "status",
    "static",
    "stats",
    "test",
    "update",
    "updates",
    "ws",
    "wss",
    "web",
    "websockets",
    "www",
    "www1",
    "www2",
    "www3",
    "www4",
];

// then strips the path and query string
function normalizeUrl(url: string) {
    return trim(url.replace(/(https?:)?\/\//, "")).split(/[/:?]/)[0];
}

// The base domain is where root cookies are set in hosted mode
// It's also appended to a team's hosted subdomain to form their app URL
export function getBaseDomain() {
    const normalEnvUrl = normalizeUrl(environment.URL);
    const tokens = normalEnvUrl.split(".");
  
    // remove reserved subdomains like "app"
    // from the env URL to form the base domain
    return tokens.length > 1 && RESERVED_SUBDOMAINS.includes(tokens[0])
        ? tokens.slice(1).join(".")
        : normalEnvUrl;
}

// we originally used the parse-domain npm module however this includes
// a large list of possible TLD's which increase the size of the bundle
// unnecessarily for our usecase of trusted input.
export function parseDomain(url: string): Domain {
    if (!url) {
      throw new TypeError("a non-empty url is required");
    }
  
    const host = normalizeUrl(url);
    const baseDomain = getBaseDomain();
  
    // if the url doesn't include the base url, then it must be a custom domain
    const baseUrlStart = host === baseDomain ? 0 : host.indexOf(`.${baseDomain}`);
  
    if (baseUrlStart === -1) {
        return { teamSubdomain: "", host, custom: true };
    }
  
    // we consider anything in front of the baseUrl to be the subdomain
    const subdomain = host.substring(0, baseUrlStart);
    const isReservedSubdomain = RESERVED_SUBDOMAINS.includes(subdomain);
  
    return {
        teamSubdomain: isReservedSubdomain ? "" : subdomain,
        host,
        custom: false,
    };
}

export function getCookieDomain(domain: string, isCloudHosted: boolean) {
    // always use the base URL for cookies when in hosted mode
    // and the domain is not custom
    if (isCloudHosted) {
        const parsed = parseDomain(domain);
    
        if (!parsed.custom) {
            return getBaseDomain();
        }
    }
  
    return domain;
}
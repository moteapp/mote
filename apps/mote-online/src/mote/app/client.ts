interface FetchOptions {
    download?: boolean;
    credentials?: "omit" | "same-origin" | "include";
    headers?: Record<string, string>;
}

class ExtendableError extends Error {};

export class AuthorizationError extends ExtendableError {}

export class BadRequestError extends ExtendableError {}

export class NetworkError extends ExtendableError {}

export class NotFoundError extends ExtendableError {}

export class PaymentRequiredError extends ExtendableError {}

export class OfflineError extends ExtendableError {}

export class ServiceUnavailableError extends ExtendableError {}

export class BadGatewayError extends ExtendableError {}

export class RateLimitExceededError extends ExtendableError {}

export class RequestError extends ExtendableError {}

export class UpdateRequiredError extends ExtendableError {}

class Client {

    private baseUrl: string = "/api";

    async fetch<T = any>(
        path: string,
        method: string,
        data: any | FormData | undefined,
        options: FetchOptions = {}
    ): Promise<T>
    {
        let body: string | FormData | undefined;

        if (method === "GET") {

        } else if (method === "POST" || method === "PUT") {
            if ( data instanceof FormData || typeof data === "string" ) {
                body = data;
            } else {
                body = JSON.stringify(data);
            }
        }

        let urlToFetch = path;
        if (path.match(/^http/)) {
            urlToFetch = urlToFetch || path;
        } else {
            urlToFetch = this.baseUrl + (urlToFetch || path);
        }
        const headerOptions: Record<string, string> = {
            Accept: "application/json",
            "cache-control": "no-cache",
            pragma: "no-cache",
            ...options?.headers,
        };
    
        const headers = new Headers(headerOptions);
        const timeStart = window.performance.now();
        let response;
    
        try {
          response = await fetch(urlToFetch, {
            method,
            body,
            headers,
            redirect: "follow",
            credentials: "same-origin",
            cache: "no-cache",
          });
        } catch (err) {
            if (window.navigator.onLine) {
                throw new NetworkError("A network error occurred, try again?");
            } else {
                throw new OfflineError("No internet connection available");
            }
        }
    
        const timeEnd = window.performance.now();
        const success = response.status >= 200 && response.status < 300;
    
        if (options.download && success) {
            const blob = await response.blob();
            const fileName = (
                response.headers.get("content-disposition") || ""
            ).split("filename=")[1];
            //download(blob, trim(fileName, '"'));
            return undefined as T;
        } else if (success && response.status === 204) {
            return undefined as T;
        } else if (success) {
            return response.json();
        }
    
        // Handle 401, log out user
        if (response.status === 401) {
            //await stores.auth.logout(true, false);
            throw new AuthorizationError();
        }
    
        // Handle failed responses
        const error: {
            message?: string;
            error?: string;
            data?: Record<string, any>;
        } = {};
    
        try {
            const parsed = await response.json();
            error.message = parsed.message || "";
            error.error = parsed.error;
            error.data = parsed.data;
        } catch (_err) {
          // we're trying to parse an error so JSON may not be valid
        }
    
        if (response.status === 400 && error.error === "editor_update_required") {
            window.location.reload();
            throw new UpdateRequiredError(error.message);
        }
    
        if (response.status === 400) {
            throw new BadRequestError(error.message);
        }
    
        if (response.status === 402) {
            throw new PaymentRequiredError(error.message);
        }
    
        if (response.status === 403) {
            if (error.error === "user_suspended") {
                //await stores.auth.logout(false, false);
            }
    
            throw new AuthorizationError(error.message);
        }
    
        if (response.status === 404) {
            throw new NotFoundError(error.message);
        }
    
        if (response.status === 503) {
            throw new ServiceUnavailableError(error.message);
        }
    
        if (response.status === 429) {
            throw new RateLimitExceededError(
                `Too many requests, try again in a minute.`
            );
        }
    
        if (response.status === 502) {
            throw new BadGatewayError(
                `Request to ${urlToFetch} failed in ${timeEnd - timeStart}ms.`
            );
        }
    
            const err = new RequestError(`Error ${response.status}`);
        
            // Still need to throw to trigger retry
            throw err;
        };
    
        get = <T = any>(
            path: string,
            data: any | undefined,
            options?: FetchOptions
        ) => this.fetch<T>(path, "GET", data, options);
        
        post = <T = any>(
            path: string,
            data?: any | FormData | undefined,
            options?: FetchOptions
        ) => {
            options = options || {};
            options.headers = options.headers || {};
            options.headers["Content-Type"] = "application/json";
            return this.fetch<T>(path, "POST", data, options)
    };
}

export const clientAPI = new Client();

export class MoteResponse<T extends any> {

    constructor(
        public readonly data: T, 
        public status: number, 
        public statusText: string) {
       
    }
}
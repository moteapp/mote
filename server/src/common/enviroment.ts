import { IsBoolean, IsByteLength, IsIn } from 'class-validator';
import dotenv from 'dotenv';

dotenv.config();

class Environment {
    /**
     * The current environment name.
     */
    @IsIn(["development", "production", "staging", "test"])
    public ENVIRONMENT = process.env.NODE_ENV ?? "production";

    /**
     * Enable unsafe-inline in script-src CSP directive
     */
    @IsBoolean()
    public DEVELOPMENT_UNSAFE_INLINE_CSP = this.toBoolean(
        process.env.DEVELOPMENT_UNSAFE_INLINE_CSP ?? "false"
    );

    /**
     * Optional extra debugging. Comma separated
     */
    public DEBUG = process.env.DEBUG || "";

    /**
     * Returns true if the current installation is running in a test environment.
     */
    public get isTest() {
        return this.ENVIRONMENT === "test";
    }

    /**
     * Returns true if the current installation is running in production.
     */
    public get isProduction() {
        return this.ENVIRONMENT === "production";
    }

    /**
     * The secret key is used for encrypting data. Do not change this value once
     * set or your users will be unable to login.
     */
    @IsByteLength(32, 64)
    public SECRET_KEY = process.env.SECRET_KEY ?? "secret";

    public MYSQL_HOST = process.env.MYSQL_HOST || '';

    public MYSQL_USER = process.env.MYSQL_USER || '';

    public MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || '';

    public MYSQL_DATABASE = process.env.MYSQL_DATABASE || '';

    /**
     * Convert a string to a boolean. Supports the following:
     *
     * 0 = false
     * 1 = true
     * "true" = true
     * "false" = false
     * "" = false
     *
     * @param value The string to convert
     * @returns A boolean
     */
    private toBoolean(value: string) {
        try {
        return value ? !!JSON.parse(value) : false;
        } catch (err) {
        throw new Error(
            `"${value}" could not be parsed as a boolean, must be "true" or "false"`
        );
        }
    }
}

export const environment = new Environment();
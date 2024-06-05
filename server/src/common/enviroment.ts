import { IsBoolean, IsIn } from 'class-validator';
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
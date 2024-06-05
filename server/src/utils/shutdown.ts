import { RunOnceScheduler } from '@mote/base/common/async';
import { groupBy } from '@mote/base/common/arrays';
import { compare } from '@mote/base/common/strings';
import { ConsoleLogger } from '@mote/platform/log/common/log';

export enum ShutdownOrder {
    first = 0,
    normal = 1,
    last = 2,
}

interface Handler {
    name: string;
    order: ShutdownOrder;
    callback: () => Promise<unknown>;
};

const logger = new ConsoleLogger();

export class Shutdown {
    /**
     * The amount of time to wait for connections to close before forcefully
     * closing them. This allows for regular HTTP requests to complete but
     * prevents long running requests from blocking shutdown.
     */
    public static readonly connectionGraceTimeout = 5 * 1000;

    /**
     * The maximum amount of time to wait for ongoing work to finish before
     * force quitting the process. In the event of a force quit, the process
     * will exit with a non-zero exit code.
     */
    public static readonly forceQuitTimeout = 60 * 1000;

    /** List of shutdown handlers to execute */
    private static handlers: Handler[] = [];

    /** Whether the server is currently shutting down */
    private static isShuttingDown = false;

    /**
     * Add a shutdown handler to be executed when the process is exiting
     *
     * @param name The name of the handler
     * @param callback The callback to execute
     */
    public static add(
        name: string,
        order: ShutdownOrder,
        callback: () => Promise<unknown>
    ) {
        this.handlers.push({ name, order, callback });
    }

    /**
     * Exit the process after all shutdown handlers have completed
     */
    public static async execute() {
        if (this.isShuttingDown) {
            return;
        }
        this.isShuttingDown = true;

        // Start the shutdown timer
        const timeout = new RunOnceScheduler(() => {
            logger.info("lifecycle", "Force quitting");
            process.exit(1);
        }, this.forceQuitTimeout);
        timeout.schedule();

        await Promise.allSettled(
            this.handlers.map(async (handler) => {
                logger.debug("lifecycle", `Running shutdown handler ${handler.name}`);
    
                await handler.callback().catch((error) => {
                    logger.error(
                    `Error inside shutdown handler ${handler.name}`,
                    error,
                    {
                    name: handler.name,
                    }
                );
                });
            })
        );
        
        logger.info("lifecycle", "Gracefully quitting");
        process.exit(0);
    }
  
}
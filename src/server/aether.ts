import { logger } from "@/lib/logger";
import { createAetheris } from "@aetheris/server";

export const createContext = () => ({
    logger,
});

const aether = createAetheris<typeof createContext>();

export const action = aether.use(({ logger, path, input }) => {
    logger.info(input, `Received request to ${path}`);
});

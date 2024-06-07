import { ConsoleLogger } from '@mote/platform/log/common/log';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const logger = new ConsoleLogger();

export type Chunk = {
    file: string;
    src: string;
    isEntry?: boolean;
};
export type ManifestStructure = Record<string, Chunk>;

export const readManifestFile = (file = path.resolve(__dirname, "../../mote-online/.vite/manifest.json")) => {
    const absoluteFilePath = path.resolve(file);
  
    let manifest = "{}";
  
    try {
      manifest = fs.readFileSync(absoluteFilePath, "utf8") as string;
    } catch (err) {
        logger.warn(
            `Can not find ${absoluteFilePath}. Try executing "yarn vite:build" before running in production mode.`
        );
    }
  
    return JSON.parse(manifest) as ManifestStructure;
  };
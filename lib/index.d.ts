import "dotenv/config";
import { ExternalOptions, Options } from './types/types';
export declare class Parse {
    tableName: string;
    moduleName: string;
    targetDir: string;
    targetPath: string;
    type: Options;
    externalOptions: ExternalOptions;
    constructor(tableName: string, dir: string);
    exit(): void;
    prompt(): Promise<void>;
    parseOption(): Promise<void>;
    generateEntity(): Promise<void>;
    generateTier(): void;
    generateCURD(): void;
    generateAll(): void;
}

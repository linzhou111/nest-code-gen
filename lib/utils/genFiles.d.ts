import { GENFILE_TYPES } from '../types/types';
declare type TableOption = {
    table_name: string;
    table_uppercase_name?: string;
    table_info: object;
};
declare type Options = {
    table: TableOption | null;
    module_name: string;
    is_full?: boolean;
};
declare function genFiles(type: GENFILE_TYPES, options: Options): void;
export { genFiles };

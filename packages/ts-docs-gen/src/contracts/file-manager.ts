import { PluginResult } from "./plugin";
import { FileResult } from "./file-result";

export interface FileManager {
    AddItem(itemResult: PluginResult, filePath: string): void;
    ToFilesOutput(): FileResult[];
}

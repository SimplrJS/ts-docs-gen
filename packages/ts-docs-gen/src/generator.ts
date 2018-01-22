import { Contracts } from "ts-extractor";
import * as path from "path";
import * as fs from "fs-extra";

import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { FileManager } from "./file-manager";
import { ApiDefaultPlugin } from "./plugins/api-default-plugin";

import { ApiItemReference } from "./contracts/api-item-reference";
import { PluginResult, PluginOptions, GetItemPluginResultHandler } from "./contracts/plugin";
import { FileResult } from "./contracts/file-result";
import { ApiItemReferenceRegistry } from "./registries/api-item-reference-registry";

export class Generator {
    constructor(private configuration: GeneratorConfiguration) {
        this.fileManager = new FileManager(configuration.ExtractedData);
        this.pluginResultRegistry = new ApiItemReferenceRegistry<PluginResult>();
        const { ExtractedData } = this.configuration;

        for (const entryFile of ExtractedData.EntryFiles) {
            const sourceFile = ExtractedData.Registry[entryFile];
            const pluginResult
                = this.renderApiItem({ Alias: sourceFile.Name, Id: entryFile }, sourceFile) as PluginResult<Contracts.ApiSourceFileDto>;

            this.fileManager.AddEntryFile(pluginResult);
        }

        this.outputData = this.fileManager.ToFilesOutput();
    }

    private pluginResultRegistry: ApiItemReferenceRegistry<PluginResult>;
    private fileManager: FileManager;
    private outputData: FileResult[];

    public get OutputData(): ReadonlyArray<FileResult> {
        return this.outputData;
    }

    public async WriteToFiles(): Promise<void> {
        for (const item of this.outputData) {
            const fullLocation = path.join(this.configuration.OutputDirectory, "api", item.FileLocation);

            try {
                // Ensure output directory
                await fs.ensureDir(path.dirname(fullLocation));
                // Output file
                await fs.writeFile(fullLocation, item.Result.join("\n"));
            } catch (error) {
                console.error(error);
            }
        }
    }

    private getItemPluginResult: GetItemPluginResultHandler = (apiItemReference: ApiItemReference): PluginResult => {
        const renderedItem = this.pluginResultRegistry.GetItem(apiItemReference);

        if (renderedItem == null) {
            const { Registry } = this.configuration.ExtractedData;

            const pluginResult = this.renderApiItem(apiItemReference, Registry[apiItemReference.Id]);
            this.pluginResultRegistry.AddItem(apiItemReference, pluginResult);

            return pluginResult;
        }

        return renderedItem;
    }

    private renderApiItem(
        apiItemReference: ApiItemReference,
        apiItem: Contracts.ApiItemDto
    ): PluginResult {
        const plugins = this.configuration.PluginManager.GetPluginsByKind(apiItem.ApiKind);

        const pluginOptions: PluginOptions = {
            ExtractedData: this.configuration.ExtractedData,
            Reference: apiItemReference,
            GetItemPluginResult: this.getItemPluginResult,
            IsPluginResultExists: reference => this.pluginResultRegistry.Exists(reference)
        };

        for (const plugin of plugins) {
            if (plugin.CheckApiItem(apiItem)) {
                return plugin.Render(pluginOptions, apiItem);
            }
        }

        const defaultPlugin = new ApiDefaultPlugin();
        return defaultPlugin.Render(pluginOptions, apiItem);
    }
}

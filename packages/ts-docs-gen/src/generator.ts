import { Contracts } from "ts-extractor";
import * as path from "path";
import * as fs from "fs-extra";

import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { FileManager } from "./file-manager";
import { ApiDefaultPlugin } from "./plugins/api-default-plugin";

import { ExtractorHelpers } from "./extractor-helpers";
import { ApiItemReference } from "./contracts/api-item-reference";
import { PluginResult, PluginOptions, GetItemPluginResultHandler } from "./contracts/plugin";
import { FileResult } from "./contracts/file-result";

export class Generator {
    constructor(private configuration: GeneratorConfiguration) {
        this.fileManager = new FileManager();
        const { ExtractedData } = this.configuration;

        for (const entryFile of this.configuration.ExtractedData.EntryFiles) {
            const apiItemsReferences = ExtractorHelpers.GetApiItemReferences(ExtractedData, entryFile.Members);

            for (const reference of apiItemsReferences) {
                const renderedItem = this.getItemPluginResult(reference);
                this.fileManager.AddItem(renderedItem, this.getFilePathFromEntryFile(entryFile));
            }
        }

        this.outputData = this.fileManager.ToFilesOutput();
    }

    /**
     * Reference check.... how Map Works here.
     */
    private renderedItems: Map<ApiItemReference, PluginResult> = new Map();
    private fileManager: FileManager;
    private outputData: FileResult[];

    private getFilePathFromEntryFile(entryFile: Contracts.ApiSourceFileDto): string {
        return path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
    }

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
        const renderedItem = this.renderedItems.get(apiItemReference);

        if (renderedItem == null) {
            const { Registry } = this.configuration.ExtractedData;
            const renderedData = this.renderApiItem(apiItemReference, Registry[apiItemReference.Id]);
            this.renderedItems.set(apiItemReference, renderedData);

            return renderedData;
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
            ApiItem: apiItem,
            GetItemPluginResult: this.getItemPluginResult
        };

        for (const plugin of plugins) {
            if (plugin.CheckApiItem(apiItem)) {
                return plugin.Render(pluginOptions);
            }
        }

        const defaultPlugin = new ApiDefaultPlugin();
        return defaultPlugin.Render(pluginOptions);
    }
}

import { Contracts } from "ts-extractor";
import * as path from "path";
import * as fs from "fs-extra";

import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { FileManager } from "./file-manager";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { ReferenceTuple } from "./contracts/reference-tuple";
import { ApiDefaultPlugin } from "./plugins/api-default-plugin";

import { ExtractorHelpers } from "./extractor-helpers";
import { FileOutputDto } from "./contracts/file-output-dto";
import { PluginData } from "./contracts/plugin-data";

export class Generator {
    constructor(private configuration: GeneratorConfiguration) {
        this.fileManager = new FileManager();
        const { ExtractedData } = this.configuration;

        for (const entryFile of this.configuration.ExtractedData.EntryFiles) {
            const referenceTuples = ExtractorHelpers.GetReferenceTuples(ExtractedData, entryFile.Members);

            for (const reference of referenceTuples) {
                const [referenceId] = reference;

                const renderedItem = this.getRenderedItemByReference(reference);
                this.fileManager.AddItem(renderedItem, referenceId, this.getFilePathFromEntryFile(entryFile));
            }
        }

        this.outputData = this.fileManager.ToFilesOutput();
    }

    private renderedItems: Map<ReferenceTuple, RenderItemOutputDto> = new Map();
    private fileManager: FileManager;
    private outputData: FileOutputDto[];

    private getFilePathFromEntryFile(entryFile: Contracts.ApiSourceFileDto): string {
        return path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
    }

    public get OutputData(): ReadonlyArray<FileOutputDto> {
        return this.outputData;
    }

    public async WriteToFiles(): Promise<void> {
        for (const item of this.outputData) {
            const fullLocation = path.join(this.configuration.OutputDirectory, "api", item.FileLocation);

            try {
                // Ensure output directory
                await fs.ensureDir(path.dirname(fullLocation));
                // Output file
                await fs.writeFile(fullLocation, item.Output.join("\n"));
            } catch (error) {
                console.error(error);
            }
        }
    }

    private getRenderedItemByReference = (reference: ReferenceTuple): RenderItemOutputDto => {
        const [referenceId] = reference;
        const renderedItem = this.renderedItems.get(reference);

        if (renderedItem == null) {
            const { Registry } = this.configuration.ExtractedData;
            const renderedData = this.renderApiItem(reference, Registry[referenceId]);
            this.renderedItems.set(reference, renderedData);

            return renderedData;
        }

        return renderedItem;
    }

    private renderApiItem(
        reference: ReferenceTuple,
        apiItem: Contracts.ApiItemDto,
        parentId?: string
    ): RenderItemOutputDto {
        const plugins = this.configuration.PluginManager.GetPluginsByKind(apiItem.ApiKind);

        const pluginData: PluginData = {
            ExtractedData: this.configuration.ExtractedData,
            Reference: reference,
            ApiItem: apiItem,
            GetItem: this.getRenderedItemByReference,
            ParentId: parentId
        };

        for (const plugin of plugins) {
            if (plugin.CheckApiItem(apiItem)) {
                return plugin.Render(pluginData);
            }
        }

        const defaultPlugin = new ApiDefaultPlugin();
        return defaultPlugin.Render(pluginData);
    }
}

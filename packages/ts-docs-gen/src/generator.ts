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

export class Generator {
    constructor(private configuration: GeneratorConfiguration) {
        this.fileManager = new FileManager();
        const { ExtractedData } = this.configuration;

        for (const entryFile of this.configuration.ExtractedData.EntryFiles) {
            const referenceTuples = ExtractorHelpers.GetReferenceTuples(ExtractedData, entryFile, entryFile.Members);

            for (const reference of referenceTuples) {
                const renderedItem = this.getRenderedItemByReference(entryFile, reference);
                this.fileManager.AddItem(entryFile, renderedItem);
            }
        }

        this.outputData = this.fileManager.ToFilesOutput();
    }

    private renderedItems: Map<ReferenceTuple, RenderItemOutputDto> = new Map();
    private fileManager: FileManager;
    private outputData: FileOutputDto[];

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

    private getRenderedItemByReference = (entryFile: Contracts.ApiSourceFileDto, reference: ReferenceTuple): RenderItemOutputDto => {
        const [referenceId] = reference;
        if (!this.renderedItems.has(reference)) {
            const { Registry } = this.configuration.ExtractedData;
            const renderedData = this.renderApiItem(reference, entryFile, Registry[referenceId]);
            this.renderedItems.set(reference, renderedData);

            return renderedData;
        }

        return this.renderedItems.get(reference)!;
    }

    private renderApiItem(
        reference: ReferenceTuple,
        entryFile: Contracts.ApiSourceFileDto,
        apiItem: Contracts.ApiItemDto
    ): RenderItemOutputDto {
        const plugins = this.configuration.PluginManager.GetPluginsByKind(apiItem.ApiKind);

        for (const plugin of plugins) {
            if (plugin.CheckApiItem(apiItem)) {
                return plugin.Render({
                    Reference: reference,
                    ApiItem: apiItem,
                    GetItem: this.getRenderedItemByReference
                });
            }
        }

        const defaultPlugin = new ApiDefaultPlugin();
        return defaultPlugin.Render({
            Reference: reference,
            ApiItem: apiItem,
            GetItem: this.getRenderedItemByReference
        });
    }
}

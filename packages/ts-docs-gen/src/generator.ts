import { Contracts } from "ts-extractor";

import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { DefaultPrinter } from "./printers/default-printer";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { ReferenceTuple } from "./contracts/reference-tuple";
import { ApiDefaultPlugin } from "./plugins/api-default-plugin";

import { ExtractorHelpers } from "./extractor-helpers";
import { FileOutputDto } from "./contracts/file-output-dto";

export class Generator {
    constructor(private configuration: GeneratorConfiguration) {
        this.printer = new DefaultPrinter();
        const { ExtractedData } = this.configuration;

        for (const entryFile of this.configuration.ExtractedData.EntryFiles) {
            const referenceTuples = ExtractorHelpers.GetReferenceTuples(ExtractedData, entryFile, entryFile.Members);

            for (const reference of referenceTuples) {
                const renderedItem = this.getRenderedItemByReference(entryFile, reference);
                this.printer.AddItem(entryFile, renderedItem);
            }
        }

        this.outputData = this.printer.ToFilesOutput();
    }

    private renderedItems: Map<ReferenceTuple, RenderItemOutputDto> = new Map();
    private printer: DefaultPrinter;
    private outputData: FileOutputDto[];

    public get OutputData(): ReadonlyArray<FileOutputDto> {
        return this.outputData;
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

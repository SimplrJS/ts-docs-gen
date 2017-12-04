import { Contracts } from "ts-extractor";

import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { DefaultPrinter } from "./printers/default-printer";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { ReferenceTuple } from "./contracts/reference-tuple";
import { ApiDefaultPlugin } from "./plugins/api-default-plugin";
import { FileOutputDto } from "./contracts/file-output-dto";

export class Generator {
    constructor(private configuration: GeneratorConfiguration) { }

    private renderedItems: Map<ReferenceTuple, RenderItemOutputDto> = new Map();

    public GetFilesOutput(): FileOutputDto[] {
        const printer = new DefaultPrinter(this.configuration);

        for (const entryFile of this.configuration.ExtractedData.EntryFiles) {
            const referenceTuples = this.getReferenceTuples(entryFile, entryFile.Members);

            for (const reference of referenceTuples) {
                const renderedItem = this.getRenderedItemByReference(entryFile, reference);
                printer.AddItem(entryFile, renderedItem);
            }
        }

        return printer.ToFilesOutput();
    }

    private renderApiItem(
        reference: ReferenceTuple,
        entryFile: Contracts.ApiSourceFileDto,
        apiItem: Contracts.ApiItemDto
    ): RenderItemOutputDto {
        const plugins = this.configuration.PluginManager.GetPluginsByKind(apiItem.ApiKind);

        for (const plugin of plugins) {
            if (plugin.CheckApiItem(apiItem)) {
                return plugin.Render(reference, apiItem, {
                    EntryFile: entryFile,
                    GetItem: this.getRenderedItemByReference
                });
            }
        }

        const defaultPlugin = new ApiDefaultPlugin();
        return defaultPlugin.Render(reference, apiItem, {
            EntryFile: entryFile,
            GetItem: this.getRenderedItemByReference
        });
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

    private getReferenceTuples(
        entryFile: Contracts.ApiSourceFileDto,
        itemsReference: Contracts.ApiItemReferenceTuple
    ): ReferenceTuple[] {
        const list: ReferenceTuple[] = [];

        for (const [alias, references] of itemsReference) {
            for (const referenceId of references) {
                // Check if item is ExportSpecifier or ExportDeclaration.
                const apiItem = this.configuration.ExtractedData.Registry[referenceId];

                switch (apiItem.ApiKind) {
                    case Contracts.ApiItemKinds.Export: {
                        const referenceTuples = this.getReferenceTuples(entryFile, apiItem.Members);
                        list.concat(referenceTuples);
                        break;
                    }
                    case Contracts.ApiItemKinds.ExportSpecifier: {
                        if (apiItem.ApiItems == null) {
                            console.warn(`ApiItems are missing in "${apiItem.Name}"?`);
                            break;
                        }
                        const referenceTuples = this.getReferenceTuples(entryFile, [[apiItem.Name, apiItem.ApiItems]]);
                        list.concat(referenceTuples);
                        break;
                    }
                    default: {
                        list.push([referenceId, alias]);
                    }
                }
            }
        }

        return list;
    }
}

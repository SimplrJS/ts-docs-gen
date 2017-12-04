import { Contracts } from "ts-extractor";
import * as path from "path";
import * as fs from "fs-extra";

import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { RenderedDto } from "./contracts/rendered-dto";

import { ApiDefaultPlugin } from "./plugins/api-default-plugin";

/**
 * TODO: Aliasias like
 * ```ts
 * import { Contracts as ExtractorContracts } from "ts-extractor";
 * ```
 */
export class Generator {
    constructor(private configuration: GeneratorConfiguration) { }

    private renderedItems: Map<string, RenderItemOutputDto> = new Map();
    private renderedData: RenderedDto | undefined;

    private renderApiItem(apiItem: Contracts.ApiItemDto): RenderItemOutputDto {
        const plugins = this.configuration.PluginManager.GetPluginsByKind(apiItem.ApiKind);

        for (const plugin of plugins) {
            if (plugin.CheckApiItem(apiItem)) {
                return plugin.Render(apiItem, this.getRenderedItemById);
            }
        }

        const defaultPlugin = new ApiDefaultPlugin();
        return defaultPlugin.Render(apiItem, this.getRenderedItemById);
    }

    // TODO: Check for infinity loop.
    private getRenderedItemById = (itemId: string): RenderItemOutputDto => {
        if (!this.renderedItems.has(itemId)) {
            const { Registry } = this.configuration.ExtractedData;
            const renderedData = this.renderApiItem(Registry[itemId]);
            this.renderedItems.set(itemId, renderedData);

            return renderedData;
        }

        return this.renderedItems.get(itemId)!;
    }

    private onRenderData(): RenderedDto {
        const { Registry, EntryFiles } = this.configuration.ExtractedData;

        for (const [itemKey] of Object.entries(Registry)) {
            if (!this.renderedItems.has(itemKey)) {
                this.getRenderedItemById(itemKey);
            }
        }

        return {
            EntryFiles: EntryFiles,
            RenderedItems: this.renderedItems
        };
    }

    public GetRenderedData(): RenderedDto {
        let data: RenderedDto | undefined = this.renderedData;
        if (data == null) {
            data = this.onRenderData();
        }

        return data;
    }

    public async PrintToFiles(): Promise<void> {
        // =====================================
        //
        // Preparing files we want to write / output / fill.
        // P.S. move this into separate file.
        //
        // =====================================
        interface PrinterFileData {
            /**
             * Relative file location to `OutDir` path.
             */
            Location: string;
            Items: RenderItemOutputDto[];
        }

        const data = this.GetRenderedData();
        const list: PrinterFileData[] = [];

        for (const entryFile of data.EntryFiles) {
            const printerFile: PrinterFileData = {
                Location: path.basename(entryFile.Name) + ".md",
                Items: this.getItems(data, entryFile, entryFile.Members)
            };

            list.push(printerFile);
        }

        // TODO: Collect references too :C

        // =====================================
        //
        // Third step: Write to actually files.
        //
        // =====================================

        for (const item of list) {
            const fullLocation = path.join(this.configuration.OutputDirectory, "api", item.Location);

            try {
                // Ensure output directory
                await fs.ensureDir(path.dirname(fullLocation));
                // Output file
                await fs.writeFile(fullLocation, item.Items.map(x => x.RenderOutput.join("\n")).join("\n"));
            } catch (error) {
                console.error(error);
            }
        }
    }

    private getItems(
        data: RenderedDto,
        entryFile: Contracts.ApiSourceFileDto,
        itemsReference: Contracts.ApiItemReferenceTuple
    ): RenderItemOutputDto[] {
        let items: RenderItemOutputDto[] = [];

        for (const [, references] of itemsReference) {
            for (const reference of references) {
                // Check if item is ExportSpecifier or ExportDeclaration.
                const apiItem = this.configuration.ExtractedData.Registry[reference];

                switch (apiItem.ApiKind) {
                    case Contracts.ApiItemKinds.Export: {
                        const exporterItems = this.getItems(data, entryFile, apiItem.Members);
                        items = [...items, ...exporterItems];
                        break;
                    }
                    case Contracts.ApiItemKinds.ExportSpecifier: {
                        if (apiItem.ApiItems == null) {
                            console.warn(`ApiItems are missing in "${apiItem.Name}"?`);
                            break;
                        }
                        const exporterItems = this.getItems(data, entryFile, [[apiItem.Name, apiItem.ApiItems]]);
                        items = [...items, ...exporterItems];
                        break;
                    }
                    default: {
                        const renderedItem = data.RenderedItems.get(reference);
                        if (renderedItem != null) {
                            items.push(renderedItem);
                        } else {
                            console.warn(`Reference "${reference}" is missing in ${entryFile.Name}?`);
                        }
                    }
                }
            }
        }

        return items;
    }
}

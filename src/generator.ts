import { GeneratorConfiguration } from "./contracts/generator-configuration";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { Contracts } from "ts-extractor";

// TODO: Move to contracts.
export type RenderedItems = Map<string, RenderItemOutputDto>;

export interface RenderedDto {
    RenderedItems: RenderedItems;
    EntryFiles: Contracts.ApiSourceFileDto[];
}

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

        // FIXME: Implement default plugin.
        return undefined as any;
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

    public PrintToFiles(): void {
        throw new Error("Not yet implemented!");
    }
}

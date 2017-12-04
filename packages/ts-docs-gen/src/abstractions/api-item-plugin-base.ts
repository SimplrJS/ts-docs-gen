import { Contracts } from "ts-extractor";

import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { SupportedApiItemKindType, ApiItemKindsAdditional } from "../contracts/supported-api-item-kind-type";
import { PluginOptions } from "../contracts/plugin-options";
import { ReferenceTuple } from "../contracts/reference-tuple";

export abstract class ApiItemPluginBase {
    // TODO: Clarify naming.
    protected get SupportKind(): typeof Contracts.ApiItemKinds & typeof ApiItemKindsAdditional {
        return Object.assign(Contracts.ApiItemKinds, ApiItemKindsAdditional);
    }

    public abstract SupportedApiItemsKinds(): SupportedApiItemKindType[];

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    public abstract Render(reference: ReferenceTuple, item: Contracts.ApiItemDto, options: PluginOptions): RenderItemOutputDto;
}

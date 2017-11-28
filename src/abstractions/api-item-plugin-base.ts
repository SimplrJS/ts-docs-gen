import { Contracts } from "ts-extractor";

import { RenderOutputDto } from "../contracts/render-output-dto";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";

export abstract class ApiItemPluginBase {
    public abstract SupportedApiItemsKinds(): SupportedApiItemKindType[];

    public abstract CheckApiItem(item: Contracts.ApiItemDto): boolean;

    public abstract Render(item: Contracts.ApiItemDto): RenderOutputDto;
}

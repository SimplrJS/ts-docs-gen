import { Contracts } from "ts-extractor";

import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";

export abstract class ApiItemPluginBase {
    public abstract SupportedApiItemsKinds(): SupportedApiItemKindType[];

    public abstract CheckApiItem(item: Contracts.ApiItemDto): boolean;

    public abstract Render(item: Contracts.ApiItemDto, getItem: (itemId: string) => RenderItemOutputDto): RenderItemOutputDto;
}

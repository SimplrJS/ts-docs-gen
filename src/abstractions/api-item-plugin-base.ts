import { Contracts } from "ts-extractor";

import { RenderOutputDto } from "../contracts/render-output-dto";

export abstract class ApiItemPluginBase {
    public abstract SupportedApiItems(): Contracts.ApiItemDto[];

    public abstract CheckApiItem(item: Contracts.ApiItemDto): boolean;

    public abstract Render(item: Contracts.ApiItemDto): RenderOutputDto;
}

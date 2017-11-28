import { Contracts } from "ts-extractor";

export interface RenderOutputDto {
    References: string[];
    RenderOutput: string[];
    ApiItem: Contracts.ApiItemDto;
}

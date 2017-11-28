import { Contracts } from "ts-extractor";

export interface RenderItemOutputDto {
    References: string[];
    RenderOutput: string[];
    ApiItem: Contracts.ApiItemDto;
}

import { Contracts } from "ts-extractor";

export interface RenderItemOutputDto {
    References: string[];
    /**
     * Heading is used for navigation in documentation. It should be the same in the render output.
     */
    Heading: string;
    RenderOutput: string[];
    ApiItem: Contracts.ApiItemDto;
}

import { Contracts, ExtractDto } from "ts-extractor";

import { ApiItemReference } from "./api-item-reference";

export enum ApiItemKindsAdditional {
    Any = "any"
}

export type SupportedApiItemKindType = Contracts.ApiItemKinds | ApiItemKindsAdditional;

export interface PluginHeading {
    Heading: string;
    ApiItemId: string;
}

export interface PluginMember {
    Reference: ApiItemReference;
    PluginResult: PluginResult;
}

export type GetItemPluginResultHandler = (reference: ApiItemReference) => PluginResult;
export type IsPluginResultExistsHandler = (reference: ApiItemReference) => boolean;

export interface PluginOptions<TKind = Contracts.ApiItemDto> {
    Reference: ApiItemReference;
    ApiItem: TKind;
    ExtractedData: ExtractDto;
    GetItemPluginResult: GetItemPluginResultHandler;
    IsPluginResultExists: IsPluginResultExistsHandler;
}

export interface PluginResult<TKind = Contracts.ApiItemDto> {
    Reference: ApiItemReference;
    ApiItem: TKind;
    /**
     * All headings used in `Result` with ApiItemIds.
     */
    Headings: PluginHeading[];
    /**
     * References that were used in rendering `Result`.
     */
    UsedReferences: string[];
    /**
     * Plugin rendered result.
     */
    Result: string[];
    Members?: PluginMember[];
}

export interface Plugin<TKind = Contracts.ApiItemDto> {
    SupportedApiItemKinds(): SupportedApiItemKindType[];
    CheckApiItem(item: TKind): boolean;
    Render(options: PluginOptions<TKind>): PluginResult;
}

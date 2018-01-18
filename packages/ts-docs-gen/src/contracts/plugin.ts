import { Contracts, ExtractDto } from "ts-extractor";

import { ApiItemReference } from "./api-item-reference";
import { SerializedApiDefinition } from "./serialized-api-item";

export enum ApiItemKindsAdditional {
    Any = "any"
}

export type SupportedApiItemKindType = Contracts.ApiItemKinds | ApiItemKindsAdditional;

export interface PluginHeading {
    Heading: string;
    ApiItemId: string;
    Members?: PluginHeading[];
}

export interface PluginMember<TKind> {
    Reference: ApiItemReference;
    PluginResult: PluginResult<TKind>;
}

export type GetItemPluginResultHandler = (reference: ApiItemReference) => PluginResult;
export type IsPluginResultExistsHandler = (reference: ApiItemReference) => boolean;

export interface PluginOptions {
    Reference: ApiItemReference;
    ExtractedData: ExtractDto;
    GetItemPluginResult: GetItemPluginResultHandler;
    IsPluginResultExists: IsPluginResultExistsHandler;
}

export interface PluginResultData<TKind = Contracts.ApiItemDto> {
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
    Members: Array<PluginMember<TKind>>;
}

export interface PluginResult<TKind = Contracts.ApiItemDto> extends PluginResultData<TKind> {
    Reference: ApiItemReference;
    ApiItem: TKind;
}

export interface Plugin<TKind extends Contracts.ApiBaseItemDto> {
    SupportedApiItemKinds(): SupportedApiItemKindType[];
    CheckApiItem(item: SerializedApiDefinition<TKind>): boolean;
    Render(options: PluginOptions, apiItem: TKind): PluginResult;
}

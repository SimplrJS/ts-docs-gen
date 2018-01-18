import { Contracts, ExtractDto } from "ts-extractor";

export interface ApiItemReference {
    Id: string;
    Alias: string;
}

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

export interface PluginResultData {
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
    Members: PluginMember[];
}

export interface PluginResult<TKind = Contracts.ApiItemDto> extends PluginResultData {
    Reference: ApiItemReference;
    ApiItem: TKind;
}

export interface Plugin<TKind = Contracts.ApiItemDto> {
    SupportedApiItemKinds(): SupportedApiItemKindType[];
    CheckApiItem(item: TKind): boolean;
    Render(options: PluginOptions<TKind>): PluginResult;
}

export type MappedType = {
    [K in "a-b-c"]: number
};

export type FooTuple = [string, number];

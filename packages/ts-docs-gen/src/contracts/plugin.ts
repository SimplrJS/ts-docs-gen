import { Contracts, ExtractDto } from "ts-extractor";

import { ApiItemReference } from "./api-item-reference";

export enum ApiDefinitionKindAdditional {
    Any = "any"
}

export type SupportedApiItemKindType = Contracts.ApiDefinitionKind | ApiDefinitionKindAdditional;

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

export interface PluginResultData<TKind = Contracts.ApiDefinition> {
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

export interface PluginResult<TKind = Contracts.ApiDefinition> extends PluginResultData<TKind> {
    Reference: ApiItemReference;
    ApiItem: TKind;
}

export interface Plugin<TKind extends Contracts.ApiBaseDefinition = Contracts.ApiDefinition> {
    SupportedApiDefinitionKind(): SupportedApiItemKindType[];
    CheckApiItem(item: TKind): boolean;
    Render(options: PluginOptions, apiItem: TKind): PluginResult;
}

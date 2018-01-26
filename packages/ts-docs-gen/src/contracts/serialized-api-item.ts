import { Contracts, ExtractDto } from "ts-extractor";
import { ApiItemReference } from "./api-item-reference";

// ApiItemsLists
import { ApiDefinitions } from "../api-items/api-definition-list";
import { ApiTypes } from "../api-items/api-type-list";

export type ReferenceRenderHandler = (name: string, referenceId?: string) => string;

export interface SerializedApiItem<TKind> {
    ApiItem: TKind;
    ToText(render?: ReferenceRenderHandler): string[];
    ToInlineText(render?: ReferenceRenderHandler): string;
}

export interface SerializedApiDefinitionConstructor<TKind extends Contracts.ApiBaseDefinition = Contracts.ApiBaseDefinition> {
    new(extractedData: ExtractDto, apiItem: TKind, reference: ApiItemReference): ApiDefinitions;
}

export interface SerializedApiDefinition<TKind extends Contracts.ApiBaseDefinition>
    extends SerializedApiItem<TKind> {
    ParentItem?: SerializedApiItem<Contracts.ApiBaseDefinition>;
    Name: string;
    Reference: ApiItemReference;
    ToHeadingText(): string;
}

export interface SerializedApiTypeConstructor<TKind extends Contracts.ApiBaseType = Contracts.ApiBaseType> {
    new(extractedData: ExtractDto, apiItem: TKind): ApiTypes;
}

export interface SerializedApiType<TKind extends Contracts.ApiBaseType = Contracts.ApiBaseType>
    extends SerializedApiItem<TKind> {
}

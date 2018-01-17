import { Contracts, ExtractDto } from "ts-extractor";

export interface SerializedApiItem<TKind> {
    Data: TKind;
    ToText(): string[];
}

export interface SerializedApiDefinitionConstructor<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> {
    new(extractedData: ExtractDto, apiItem: TKind): SerializedApiDefinition<TKind>;
}

export interface SerializedApiDefinition<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto>
    extends SerializedApiItem<TKind> {
    ToText(alias?: string): string[];
    ToHeadingText(alias?: string): string;
}

export interface SerializedApiTypeConstructor<TKind extends Contracts.ApiBaseType = Contracts.ApiBaseType> {
    new(extractedData: ExtractDto, apiItem: TKind): SerializedApiType<TKind>;
}

export interface SerializedApiType<TKind extends Contracts.ApiBaseType = Contracts.ApiBaseType>
    extends SerializedApiItem<TKind> {
}

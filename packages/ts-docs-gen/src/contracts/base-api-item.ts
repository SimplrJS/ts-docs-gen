import { Contracts, ExtractDto } from "ts-extractor";

export interface BaseApiItemConstructor<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> {
    new(extractedData: ExtractDto, apiItem: TKind): BaseApiItem<TKind>;
}

export interface BaseApiItem<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> {
    Data: TKind;
    ToText(alias?: string): string[];
    ToHeadingText(alias?: string): string;
}

import { ExtractDto } from "ts-extractor";

export interface SerializedApiItemConstructor<TKind> {
    new(extractedData: ExtractDto, apiItem: TKind): SerializedApiItem<TKind>;
}

export interface SerializedApiItem<TKind> {
    Data: TKind;
    ToText(alias?: string): string[];
    ToHeadingText(alias?: string): string;
}

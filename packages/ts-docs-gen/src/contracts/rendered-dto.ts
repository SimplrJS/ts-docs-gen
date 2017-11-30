import { RenderedItems } from "./rendered-item";
import { Contracts } from "ts-extractor";

export interface RenderedDto {
    RenderedItems: RenderedItems;
    EntryFiles: Contracts.ApiSourceFileDto[];
}

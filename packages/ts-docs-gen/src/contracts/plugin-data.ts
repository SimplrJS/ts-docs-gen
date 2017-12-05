import { Contracts, ExtractDto } from "ts-extractor";

import { ReferenceTuple } from "./reference-tuple";
import { RenderItemOutputDto } from "./render-item-output-dto";

export interface PluginData<TKind = Contracts.ApiItemDto> {
    Reference: ReferenceTuple;
    ApiItem: TKind;
    ExtractedData: ExtractDto;
    GetItem(entryFile: Contracts.ApiSourceFileDto, reference: ReferenceTuple): RenderItemOutputDto;
}

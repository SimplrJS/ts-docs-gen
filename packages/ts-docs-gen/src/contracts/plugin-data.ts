import { Contracts, ExtractDto } from "ts-extractor";

import { ReferenceTuple } from "./reference-tuple";
import { RenderItemOutputDto } from "./render-item-output-dto";

export interface PluginData<TKind = Contracts.ApiItemDto> {
    Reference: ReferenceTuple;
    ApiItem: TKind;
    ExtractedData: ExtractDto;
    ParentId?: string;
    GetItem(reference: ReferenceTuple): RenderItemOutputDto;
    AddItem(reference: ReferenceTuple, apiItem: Contracts.ApiItemDto, parentId: string): void;
}

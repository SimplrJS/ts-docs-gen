import { ReferenceTuple } from "./reference-tuple";
import { RenderItemOutputDto } from "./render-item-output-dto";
import { Contracts } from "ts-extractor";

export interface PluginData<TKind = Contracts.ApiItemDto> {
    Reference: ReferenceTuple;
    ApiItem: TKind;
    GetItem(entryFile: Contracts.ApiSourceFileDto, reference: ReferenceTuple): RenderItemOutputDto;
}

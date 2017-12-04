import { ReferenceTuple } from "./reference-tuple";
import { RenderItemOutputDto } from "./render-item-output-dto";
import { Contracts } from "ts-extractor";

export interface PluginData {
    Reference: ReferenceTuple;
    ApiItem: Contracts.ApiItemDto;
    GetItem(entryFile: Contracts.ApiSourceFileDto, reference: ReferenceTuple): RenderItemOutputDto;
}

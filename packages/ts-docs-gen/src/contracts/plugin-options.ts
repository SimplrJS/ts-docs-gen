import { ReferenceTuple } from "./reference-tuple";
import { RenderItemOutputDto } from "./render-item-output-dto";
import { Contracts } from "ts-extractor";

export interface PluginOptions {
    EntryFile: Contracts.ApiSourceFileDto;
    GetItem(entryFile: Contracts.ApiSourceFileDto, reference: ReferenceTuple): RenderItemOutputDto;
}

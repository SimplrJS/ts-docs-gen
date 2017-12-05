import { Contracts } from "ts-extractor";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { FileOutputDto } from "../contracts/file-output-dto";

export abstract class FileManagerBaseBase {
    public abstract AddItem(entryFile: Contracts.ApiSourceFileDto, item: RenderItemOutputDto, referenceId: string): void;

    public abstract ToFilesOutput(): FileOutputDto[];
}

import { Contracts } from "ts-extractor";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { FileOutputDto } from "../contracts/file-output-dto";

export abstract class FileManagerBaseBase {
    public abstract AddItem(item: RenderItemOutputDto, referenceId: string, entryFile?: Contracts.ApiSourceFileDto): void;

    public abstract ToFilesOutput(): FileOutputDto[];
}

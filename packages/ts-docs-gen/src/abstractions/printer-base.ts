import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { FileOutputDto } from "../contracts/file-output-dto";

export abstract class PrinterBase {
    public abstract AddItem(item: RenderItemOutputDto): void;

    public abstract ToFilesOutput(): FileOutputDto[];
}

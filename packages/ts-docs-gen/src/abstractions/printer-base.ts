import { RenderedDto } from "../contracts/rendered-dto";

export abstract class PrinterBase {
    public abstract EntryFileCrawler(data: RenderedDto): any;
}

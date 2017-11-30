import { PrinterBase } from "../abstractions/printer-base";
import { RenderedDto } from "../contracts/rendered-dto";

export class DefaultPrinter extends PrinterBase {
    public EntryFileCrawler(data: RenderedDto): void {
        throw new Error("Method not implemented.");
    }

}

import * as path from "path";

import { PrinterBase } from "../abstractions/printer-base";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { FileOutputDto } from "../contracts/file-output-dto";
import { GeneratorConfiguration } from "../contracts/generator-configuration";
import { Contracts } from "ts-extractor";

export class DefaultPrinter extends PrinterBase {
    constructor(protected Configuration: GeneratorConfiguration) {
        super();
    }

    private filesList: Map<string, RenderItemOutputDto[]> = new Map();

    public AddItem(entryFile: Contracts.ApiSourceFileDto, item: RenderItemOutputDto): void {
        const fileName = path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
        const items = this.filesList.get(fileName) || [];
        items.push(item);

        this.filesList.set(fileName, items);
    }

    public ToFilesOutput(): FileOutputDto[] {
        const output: FileOutputDto[] = [];
        for (const [fileLocation, items] of this.filesList) {
            output.push({
                FileLocation: fileLocation,
                // There should be a cleaner way to flatten array.
                Output: [].concat.apply([], items.map(x => x.RenderOutput))
            });
        }

        return output;
    }
}

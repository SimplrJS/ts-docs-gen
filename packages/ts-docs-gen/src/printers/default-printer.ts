import * as path from "path";

import { PrinterBase } from "../abstractions/printer-base";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { FileOutputDto } from "../contracts/file-output-dto";
import { GeneratorConfiguration } from "../contracts/generator-configuration";

export class DefaultPrinter extends PrinterBase {
    constructor(private configuration: GeneratorConfiguration) {
        super();
    }

    private filesList: Map<string, RenderItemOutputDto[]> = new Map();

    public AddItem(item: RenderItemOutputDto): void {
        const fileName = path.basename(item.ApiItem.Name) + ".md";
        const fileLocation = path.join(this.configuration.OutputDirectory, "api", fileName);
        const items = this.filesList.get(fileLocation) || [];

        this.filesList.set(fileLocation, [item, ...items]);
    }

    public ToFilesOutput(): FileOutputDto[] {
        const output: FileOutputDto[] = [];
        for (const [fileLocation, items] of this.filesList) {
            output.push({
                FileLocation: fileLocation,
                // There should be a cleaner way to flatten array.
                Output: [].concat.apply([], ...items.map(x => x.RenderOutput))
            });
        }

        return output;
    }
}

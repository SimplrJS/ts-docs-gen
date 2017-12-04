import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";
import * as path from "path";

import { FileManagerBaseBase } from "./abstractions/file-manager-base";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { FileOutputDto } from "./contracts/file-output-dto";

interface OutputData {
    RenderOutput: string[];
}

export class FileManager extends FileManagerBaseBase {
    private filesList: Map<string, Array<RenderItemOutputDto | OutputData>> = new Map();

    private fileHeader(entryFile: Contracts.ApiSourceFileDto): OutputData {
        const heading = path.basename(entryFile.Name, path.extname(entryFile.Name));

        const output: string[] = [
            MarkdownGenerator.header(`${heading}`, 1)
        ];

        return {
            RenderOutput: output
        };
    }

    public AddItem(entryFile: Contracts.ApiSourceFileDto, item: RenderItemOutputDto): void {
        const fileName = path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
        const items = this.filesList.get(fileName) || [this.fileHeader(entryFile)];
        items.push(item);

        this.filesList.set(fileName, items);
    }

    public ToFilesOutput(): FileOutputDto[] {
        const output: FileOutputDto[] = [];
        for (const [fileLocation, items] of this.filesList) {
            output.push({
                FileLocation: fileLocation,
                // There should be a cleaner way to flatten array.
                Output: [].concat.apply([], items.map(x => [x.RenderOutput, ""]))
            });
        }

        return output;
    }
}

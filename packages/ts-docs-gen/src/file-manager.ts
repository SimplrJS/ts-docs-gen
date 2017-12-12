import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";
import * as path from "path";

import { FileManagerBaseBase } from "./abstractions/file-manager-base";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { FileOutputDto } from "./contracts/file-output-dto";
import { Helpers } from "./utils/helpers";

interface OutputData {
    RenderOutput: string[];
}

type RenderedItemList = Array<RenderItemOutputDto | OutputData>;

export class FileManager extends FileManagerBaseBase {
    /**
     * <FileLocation, RenderedItems>
     */
    private filesList: Map<string, RenderedItemList> = new Map();
    /**
     * <ReferenceId, FileLocation>
     */
    private referenceToFile: Map<string, string> = new Map();

    private fileHeader(entryFile: Contracts.ApiSourceFileDto): OutputData {
        const heading = path.basename(entryFile.Name, path.extname(entryFile.Name));

        const output: string[] = [
            MarkdownGenerator.Header(`${heading}`, 1)
        ];

        return {
            RenderOutput: output
        };
    }

    private getDefaultEntryFileHeader(entryFile: Contracts.ApiSourceFileDto): RenderedItemList {
        return [
            this.fileHeader(entryFile)
        ];
    }

    private renderItemIsItemOutputDto(item: RenderItemOutputDto | OutputData): item is RenderItemOutputDto {
        return (item as RenderItemOutputDto).ApiItem != null;
    }

    public AddItem(item: RenderItemOutputDto, referenceId: string, entryFile?: Contracts.ApiSourceFileDto): void {
        let fileName: string | undefined;
        let items: RenderedItemList = [];
        if (entryFile != null && item.ParentId == null) {
            fileName = path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
            items = this.filesList.get(fileName) || this.getDefaultEntryFileHeader(entryFile);
        } else if (item.ParentId != null) {
            const parentFileName = this.referenceToFile.get(item.ParentId);

            if (parentFileName != null) {
                const baseName = path.basename(parentFileName, path.extname(parentFileName));
                fileName = path.join(path.dirname(parentFileName), baseName, item.ApiItem.Name + ".md");
            }
        }

        if (fileName != null) {
            items.push(item);

            // Add reference link.
            this.referenceToFile.set(referenceId, `${fileName}#${Helpers.HeadingToAnchor(item.Heading)}`);

            this.filesList.set(fileName, items);
        }
    }

    public ToFilesOutput(): FileOutputDto[] {
        const output: FileOutputDto[] = [];

        for (const [fileLocation, items] of this.filesList) {
            // Link definitions to file location.
            const linkDefinitions: string[] = [];
            for (const item of items) {
                if (this.renderItemIsItemOutputDto(item)) {
                    item.References
                        .forEach(referenceId =>
                            linkDefinitions.push(
                                MarkdownGenerator.LinkDefinition(referenceId, this.referenceToFile.get(referenceId) || "#__error")
                            )
                        );
                }
            }

            output.push({
                FileLocation: fileLocation,
                Output: [
                    ...linkDefinitions,
                    ...Helpers.Flatten(items.map(x => [x.RenderOutput, ""]))
                ]
            });
        }

        return output;
    }
}

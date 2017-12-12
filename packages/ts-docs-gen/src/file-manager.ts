import { Contracts } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { FileManagerBaseBase } from "./abstractions/file-manager-base";
import { RenderItemOutputDto } from "./contracts/render-item-output-dto";
import { FileOutputDto } from "./contracts/file-output-dto";
import { Helpers } from "./utils/helpers";

interface OutputData {
    RenderOutput: string[];
    References: string[];
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
            RenderOutput: output,
            References: []
        };
    }

    private getDefaultEntryFileHeader(entryFile: Contracts.ApiSourceFileDto): RenderedItemList {
        return [
            this.fileHeader(entryFile)
        ];
    }

    private addItemToEntryFile(item: RenderItemOutputDto, referenceId: string, entryFile: Contracts.ApiSourceFileDto): void {
        const itemKind = item.ApiItem.ApiKind;
        const fileName = path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
        const items = this.filesList.get(fileName) || this.getDefaultEntryFileHeader(entryFile);

        if (itemKind === Contracts.ApiItemKinds.Namespace || itemKind === Contracts.ApiItemKinds.Class) {
            this.addItemToNewFile(item, referenceId, fileName);

            // Add link to the item
            const builder = new MarkdownBuilder()
                .Text(md => `${md.Header(md.Link(item.ApiItem.Name, referenceId, true), 2)}`)
                .EmptyLine();

            items.push({
                RenderOutput: builder.GetOutput(),
                References: [referenceId]
            });

            return;
        }

        items.push(item);

        this.filesList.set(fileName, items);
        this.referenceToFile.set(referenceId, fileName);
    }

    private addItemToNewFile(item: RenderItemOutputDto, referenceId: string, parentFileName: string): void {
        const baseName = path.basename(parentFileName, path.extname(parentFileName));
        const fileName = path.join(path.dirname(parentFileName), baseName, item.ApiItem.Name + ".md").toLowerCase();

        const items = this.filesList.get(fileName) || [];
        items.push(item);
        this.filesList.set(fileName, items);
        this.referenceToFile.set(referenceId, fileName);
    }

    public AddItem(item: RenderItemOutputDto, referenceId: string, entryFile?: Contracts.ApiSourceFileDto): void {
        if (entryFile != null) {
            this.addItemToEntryFile(item, referenceId, entryFile);
        } else if (item.ParentId != null) {
            const fileName = this.referenceToFile.get(item.ParentId);

            if (fileName != null) {
                this.addItemToNewFile(item, referenceId, fileName);
            }
        }

        // let fileName: string | undefined;
        // let items: RenderedItemList = [];

        // if (entryFile != null && item.ParentId == null) {
        //     fileName = path.basename(entryFile.Name, path.extname(entryFile.Name)) + ".md";
        //     items = this.filesList.get(fileName) || this.getDefaultEntryFileHeader(entryFile);
        // } else if (item.ParentId != null) {
        //     const parentFileName = this.referenceToFile.get(item.ParentId);

        //     if (parentFileName != null) {
        //         const baseName = path.basename(parentFileName, path.extname(parentFileName));
        //         fileName = path.join(path.dirname(parentFileName), baseName, item.ApiItem.Name + ".md");
        //     }
        // }

        // if (fileName != null) {
        //     items.push(item);

        //     // Add reference link.
        //     this.referenceToFile.set(referenceId, `${fileName}#${Helpers.HeadingToAnchor(item.Heading)}`);

        //     this.filesList.set(fileName, items);
        // }
    }

    public ToFilesOutput(): FileOutputDto[] {
        const output: FileOutputDto[] = [];

        for (const [fileLocation, items] of this.filesList) {
            // Link definitions to file location.
            const linkDefinitions: string[] = [];
            for (const item of items) {
                item.References
                    .forEach(referenceId =>
                        linkDefinitions.push(
                            MarkdownGenerator.LinkDefinition(referenceId, this.referenceToFile.get(referenceId) || "#__error")
                        )
                    );
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

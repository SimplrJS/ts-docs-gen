import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";
import * as path from "path";

import { Helpers } from "./utils/helpers";
import { PluginResult } from "./contracts/plugin";
import { FileResult } from "./contracts/file-result";
import { GeneratorHelpers } from "./generator-helpers";

interface OutputData {
    Result: string[];
    UsedReferences: string[];
}

type RenderedItemList = Array<PluginResult | OutputData>;

export class FileManager {
    /**
     * <FileLocation, RenderedItems>
     */
    private filesList: Map<string, RenderedItemList> = new Map();
    /**
     * <ReferenceId, FileLocation>
     */
    private referenceToFile: Map<string, string> = new Map();

    public AddEntryFile(itemResult: PluginResult<Contracts.ApiSourceFileDto>): void {
        const filePath = path.basename(
            itemResult.ApiItem.Location.FileName,
            path.extname(itemResult.ApiItem.Location.FileName
            )
        ) + GeneratorHelpers.MARKDOWN_EXT;

        this.AddItem(itemResult, filePath);
    }

    public AddItem(itemResult: PluginResult, filePath: string): void {
        const items = this.filesList.get(filePath) || [];
        items.push(itemResult);
        this.filesList.set(filePath, items);
        // Adding headings.
        for (const heading of itemResult.Headings) {
            this.referenceToFile.set(heading.ApiItemId, `${filePath}#${Helpers.HeadingToAnchor(heading.Heading)}`);
        }

        // HeadingsMap
        if (itemResult.Members != null) {
            for (const member of itemResult.Members) {
                const baseName = path.basename(filePath, path.extname(filePath));
                const targetFilePath = path.join(
                    path.dirname(filePath),
                    baseName,
                    member.PluginResult.ApiItem.Name + GeneratorHelpers.MARKDOWN_EXT
                ).toLowerCase();

                this.AddItem(member.PluginResult, targetFilePath);
            }
        }
    }

    public ToFilesOutput(): FileResult[] {
        const files: FileResult[] = [];

        for (const [fileLocation, items] of this.filesList) {
            // Link definitions to file location.
            const linkDefinitions: string[] = [];
            for (const item of items.reverse()) {
                item.UsedReferences
                    .forEach(referenceId => {
                        const filePath = path.dirname(fileLocation);

                        const referenceString = this.referenceToFile.get(referenceId);
                        const resolvePath = GeneratorHelpers.StandardisePath(path.relative(filePath, referenceString || "#__error"));

                        linkDefinitions.push(
                            MarkdownGenerator.LinkDefinition(referenceId, resolvePath)
                        );

                        if (!referenceString) {
                            console.warn(`Reference "${referenceId}" not found. Check ${fileLocation}.`);
                        }
                    });
            }

            const itemsResult = Helpers.Flatten(items.map(x => [x.Result, ""]));

            files.push({
                FileLocation: GeneratorHelpers.StandardisePath(fileLocation),
                Result: [
                    ...linkDefinitions,
                    ...itemsResult
                ]
            });
        }

        return files;
    }
}

import { MarkdownGenerator } from "@simplrjs/markdown";
import * as path from "path";

import { FileManager as FileManagerInterface } from "./contracts/file-manager";
import { Helpers } from "./utils/helpers";
import { PluginResult } from "./contracts/plugin";
import { FileResult } from "./contracts/file-result";
import { GeneratorHelpers } from "./generator-helpers";

interface OutputData {
    Result: string[];
    UsedReferences: string[];
}

type RenderedItemList = Array<PluginResult | OutputData>;

export class FileManager implements FileManagerInterface {
    /**
     * <FileLocation, RenderedItems>
     */
    private filesList: Map<string, RenderedItemList> = new Map();
    /**
     * <ReferenceId, FileLocation>
     */
    private referenceToFile: Map<string, string> = new Map();

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
                const targetFileNPath = path.join(
                    path.dirname(filePath),
                    baseName,
                    member.PluginResult.ApiItem.Name + GeneratorHelpers.MARKDOWN_EXT
                ).toLowerCase();

                this.AddItem(member.PluginResult, targetFileNPath);
            }
        }
    }

    public ToFilesOutput(): FileResult[] {
        const files: FileResult[] = [];

        for (const [fileLocation, items] of this.filesList) {
            // Link definitions to file location.
            const linkDefinitions: string[] = [];
            for (const item of items) {

                item.UsedReferences
                    .forEach(referenceId => {
                        const filePath = path.dirname(fileLocation);

                        const referenceString = this.referenceToFile.get(referenceId);

                        if (referenceString) {
                            const resolvePath = path.relative(filePath, referenceString);
                            linkDefinitions.push(
                                MarkdownGenerator.LinkDefinition(referenceId, resolvePath)
                            );
                        } else {
                            linkDefinitions.push(
                                MarkdownGenerator.LinkDefinition(referenceId, "Error")
                            );
                        }
                    });
            }

            const itemsResult = Helpers.Flatten(items.map(x => [x.Result, ""]));

            files.push({
                FileLocation: fileLocation,
                Result: [
                    ...linkDefinitions,
                    ...itemsResult
                ]
            });
        }

        return files;
    }
}

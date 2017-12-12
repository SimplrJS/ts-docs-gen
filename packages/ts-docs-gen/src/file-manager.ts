import { MarkdownGenerator } from "@simplrjs/markdown";
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

    public AddItem(item: RenderItemOutputDto, referenceId: string, filePath: string): void {
        const items = this.filesList.get(filePath) || [];
        items.push(item);
        this.filesList.set(filePath, items);
        this.referenceToFile.set(referenceId, filePath);

        // HeadingsMap

        if (item.Members != null) {
            for (const member of item.Members) {
                const baseName = path.basename(filePath, path.extname(filePath));
                const targetFileNPath = path.join(path.dirname(filePath), baseName, member.Rendered.ApiItem.Name + ".md").toLowerCase();

                this.AddItem(member.Rendered, member.ReferenceId, targetFileNPath);
            }
        }
    }

    public ToFilesOutput(): FileOutputDto[] {
        const output: FileOutputDto[] = [];

        for (const [fileLocation, items] of this.filesList) {
            // Link definitions to file location.
            const linkDefinitions: string[] = [];
            for (const item of items) {
                item.References
                    .forEach(referenceId => {
                        const filePath = path.dirname(fileLocation);
                        const resolvePath = path.relative(filePath, this.referenceToFile.get(referenceId) || "#__error");
                        linkDefinitions.push(
                            MarkdownGenerator.LinkDefinition(referenceId, resolvePath)
                        );
                    });
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

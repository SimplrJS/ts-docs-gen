import { Contracts, ExtractedApiRegistry } from "ts-extractor";
import { MarkdownGenerator, MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { Helpers } from "./utils/helpers";
import { PluginResult, PluginHeading } from "./contracts/plugin";
import { FileResult } from "./contracts/file-result";
import { GeneratorHelpers } from "./generator-helpers";
import { ApiContainer, ContainerMembersKindsGroup } from "./abstractions/container-plugin";
import { ApiClassPlugin } from "./plugins/api-class-plugin";
import { ApiSourceFilePlugin } from "./plugins/api-source-file-plugin";
import { ApiNamespacePlugin } from "./plugins/api-namespace-plugin";

// TODO: Do we need OutputData?
// interface OutputData {
//     Result: string[];
//     UsedReferences: string[];
// }

// type RenderedItemList = Array<PluginResult | OutputData>;
type RenderedItemList = Array<PluginResult<ApiContainer>>;

// TODO: remove unused files before generating docs.
export class FileManager {
    constructor(private registry: ExtractedApiRegistry) { }

    /**
     * <FileLocation, RenderedItems>
     */
    private filesList: Map<string, RenderedItemList> = new Map();
    /**
     * <ReferenceId, FileLocation>
     */
    private referenceToFile: Map<string, string> = new Map();

    private resolveMemberKindsList(apiItemKind: Contracts.ApiItemKinds): ContainerMembersKindsGroup[] | undefined {
        switch (apiItemKind) {
            case Contracts.ApiItemKinds.Class: {
                return ApiClassPlugin.MemberKindsList;
            }
            case Contracts.ApiItemKinds.Namespace: {
                return ApiNamespacePlugin.MemberKindsList;
            }
            case Contracts.ApiItemKinds.SourceFile: {
                return ApiSourceFilePlugin.MemberKindsList;
            }
        }
    }

    private renderTableOfContents(containerResult: PluginResult<ApiContainer>): string[] {
        console.log(`------- ${containerResult.Reference.Id} -------`);
        // console.log(containerResult.Headings.map(x => `${x.ApiItemId} ${x.Heading}`).join("\n"));
        // console.log("---");

        // console.log(containerResult.Headings[0].Members);

        const memberKindsList = this.resolveMemberKindsList(containerResult.ApiItem.ApiKind);

        if (memberKindsList == null) {
            return [];
        }

        const builder = new MarkdownBuilder();

        containerResult.Headings.forEach(heading => {
            const headingMembers = heading.Members;
            if (headingMembers == null || headingMembers.length === 0) {
                return;
            }

            const headingLink = MarkdownGenerator.Link(heading.Heading, heading.ApiItemId, true);
            builder.UnorderedList([headingLink]);

            memberKindsList.forEach(memberKindGroup => {
                const membersOfKind = headingMembers.filter(x => memberKindGroup.Kinds.indexOf(this.registry[x.ApiItemId].ApiKind) !== -1);

                if (membersOfKind.length === 0) {
                    return;
                }

                const kindItem = GeneratorHelpers.Tab(1) + MarkdownGenerator.UnorderedList([memberKindGroup.Heading]);
                builder.Text(kindItem);

                const membersReferences = membersOfKind.map(memberHeading => {
                    const memberLink = MarkdownGenerator.Link(memberHeading.Heading, memberHeading.ApiItemId, true);
                    return GeneratorHelpers.Tab(2) + MarkdownGenerator.UnorderedList([memberLink]);
                });

                builder.Text(membersReferences);
            });
        });

        const contentsList = builder.GetOutput();

        if (contentsList.length === 0) {
            return [];
        }

        return new MarkdownBuilder()
            .Header("Table of contents", 1)
            .EmptyLine()
            .Text(contentsList)
            .EmptyLine()
            .GetOutput();
    }

    public AddEntryFile(itemResult: PluginResult<ApiContainer>): void {
        const filePath = path.basename(
            itemResult.ApiItem.Location.FileName,
            path.extname(itemResult.ApiItem.Location.FileName
            )
        ) + GeneratorHelpers.MARKDOWN_EXT;

        this.AddItem(itemResult, filePath);
    }

    private addItemHeadings(headings: PluginHeading[], filePath: string): void {
        for (const heading of headings) {
            this.referenceToFile.set(heading.ApiItemId, `${filePath}#${Helpers.HeadingToAnchor(heading.Heading)}`);

            if (heading.Members != null) {
                this.addItemHeadings(heading.Members, filePath);
            }
        }
    }

    public AddItem(itemResult: PluginResult<ApiContainer>, filePath: string): void {
        const items = this.filesList.get(filePath) || [];
        items.push(itemResult);
        this.filesList.set(filePath, items);
        // Adding headings.
        this.addItemHeadings(itemResult.Headings, filePath);

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

        // TODO: @MartynasZilinskas, can `items` have more than one item?
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
                    // TODO: check if items[0] is a correct declaration.
                    ...this.renderTableOfContents(items[0]),
                    ...itemsResult
                ]
            });
        }

        return files;
    }
}

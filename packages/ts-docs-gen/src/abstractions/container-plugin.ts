import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { BasePlugin } from "./base-plugin";
import { PluginOptions, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiItemReference } from "../contracts/api-item-reference";

export interface ApiContainer extends Contracts.ApiBaseItemDto {
    Members: Contracts.ApiItemReference[];
}

export interface ContainerMembersKindsGroup {
    Heading: string;
    Kinds: Contracts.ApiItemKinds[];
}

interface ContainerMembersReferencesGroup {
    Heading: string;
    References: ApiItemReference[];
}

export abstract class ContainerPlugin<TKind extends ApiContainer> extends BasePlugin<TKind> {
    private getItemsReferenceByKind(
        list: ContainerMembersKindsGroup[],
        members: Contracts.ApiItemReference[],
        extractedData: ExtractDto
    ): ContainerMembersReferencesGroup[] {
        const result: ContainerMembersReferencesGroup[] = [];
        let membersReferences = GeneratorHelpers.GetApiItemReferences(extractedData, members);

        for (const item of list) {
            // Filter item references by kind
            const apiItemsReferenceByKind = membersReferences.filter(x => item.Kinds.indexOf(extractedData.Registry[x.Id].ApiKind) !== -1);
            // Remove references that was used
            membersReferences = membersReferences.filter(x => apiItemsReferenceByKind.indexOf(x) === -1);

            result.push({
                Heading: item.Heading,
                References: apiItemsReferenceByKind
            });
        }

        // TODO: Using ApiKind.Any to add everything to other if some kind is not supported.
        if (membersReferences.length !== 0) {
            result.push({
                Heading: "Other",
                References: membersReferences
            });
        }

        return result;
    }

    protected RenderMembersGroups(list: ContainerMembersKindsGroup[], options: PluginOptions<TKind>): PluginResultData {
        const membersReferences = this.getItemsReferenceByKind(list, options.ApiItem.Members, options.ExtractedData);
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        for (const { Heading, References } of membersReferences) {
            if (References.length > 0) {
                builder
                    .Header(Heading, 2)
                    .EmptyLine();

                for (const reference of References) {
                    const apiItem = options.ExtractedData.Registry[reference.Id];

                    if (options.IsPluginResultExists(reference)) {
                        builder
                            .Text(md => md.Header(md.Link(apiItem.Name, reference.Id, true), 3))
                            .EmptyLine();
                        pluginResultData.UsedReferences.push(reference.Id);
                    } else {
                        switch (apiItem.ApiKind) {
                            case Contracts.ApiItemKinds.Namespace:
                            case Contracts.ApiItemKinds.Class: {
                                const renderedItem = options.GetItemPluginResult(reference);
                                pluginResultData.Members.push({
                                    Reference: reference,
                                    PluginResult: renderedItem
                                });

                                builder
                                    .Text(md => md.Header(md.Link(renderedItem.ApiItem.Name, reference.Id, true), 3))
                                    .EmptyLine()
                                    .Text(GeneratorHelpers.RenderApiItemMetadata(renderedItem.ApiItem))
                                    .EmptyLine();
                                pluginResultData.UsedReferences.push(reference.Id);
                                break;
                            }
                            default: {
                                const renderedItem = options.GetItemPluginResult(reference);
                                builder
                                    .Text(renderedItem.Result)
                                    .EmptyLine();

                                GeneratorHelpers.MergePluginResultData(pluginResultData, {
                                    Headings: renderedItem.Headings,
                                    UsedReferences: renderedItem.UsedReferences
                                });
                            }
                        }
                    }

                    if ((References.indexOf(reference) + 1) !== References.length) {
                        builder
                            .HorizontalRule(undefined, 10)
                            .EmptyLine();
                    }
                }
            }
        }

        pluginResultData.Result = builder.GetOutput();
        return pluginResultData;
    }
}

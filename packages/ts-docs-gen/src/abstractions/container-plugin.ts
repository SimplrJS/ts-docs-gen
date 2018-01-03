import { Contracts, ExtractDto } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { BasePlugin } from "./base-plugin";
import { PluginOptions, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiItemReference } from "../contracts/api-item-reference";

export interface ApiContainer extends Contracts.ApiBaseItemDto {
    Members: Contracts.ApiItemReference[];
}

export interface ContainerRenderMembers {
    Heading: string;
    Kinds: Contracts.ApiItemKinds[];
}

interface ContainersMembersReferences {
    Heading: string;
    References: ApiItemReference[];
}

export abstract class ContainerPlugin<TKind extends ApiContainer> extends BasePlugin<TKind> {
    private getItemReferenceByKind(
        list: ContainerRenderMembers[],
        members: Contracts.ApiItemReference[],
        data: ExtractDto
    ): ContainersMembersReferences[] {
        const result: ContainersMembersReferences[] = [];
        let membersReferences = GeneratorHelpers.GetApiItemReferences(data, members);

        for (const item of list) {
            // Filter item ids by kind
            const apiItemsIdsByKind = membersReferences.filter(x => item.Kinds.indexOf(data.Registry[x.Id].ApiKind) !== -1);
            // Remove ids that was used
            membersReferences = membersReferences.filter(x => apiItemsIdsByKind.indexOf(x) === -1);

            result.push({
                Heading: item.Heading,
                References: apiItemsIdsByKind
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

    protected RenderMembers(list: ContainerRenderMembers[], data: PluginOptions<TKind>): PluginResultData {
        const membersReferences = this.getItemReferenceByKind(list, data.ApiItem.Members, data.ExtractedData);
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        if (pluginResultData.Members == null) {
            pluginResultData.Members = [];
        }

        for (const { Heading, References } of membersReferences) {
            if (References.length > 0) {
                builder
                    .Header(Heading, 2)
                    .EmptyLine();

                for (const reference of References) {
                    const apiItem = data.ExtractedData.Registry[reference.Id];

                    if (data.IsPluginResultExists(reference)) {
                        builder
                            .Text(md => md.Header(md.Link(apiItem.Name, reference.Id, true), 2))
                            .EmptyLine();
                        pluginResultData.UsedReferences.push(reference.Id);
                    } else {
                        switch (apiItem.ApiKind) {
                            case Contracts.ApiItemKinds.Namespace:
                            case Contracts.ApiItemKinds.Class: {
                                const renderedItem = data.GetItemPluginResult(reference);
                                pluginResultData.Members.push({
                                    Reference: reference,
                                    PluginResult: renderedItem
                                });

                                builder
                                    .Text(md => md.Header(md.Link(renderedItem.ApiItem.Name, reference.Id, true), 2))
                                    .EmptyLine();
                                pluginResultData.UsedReferences.push(reference.Id);
                                break;
                            }
                            default: {
                                const renderedItem = data.GetItemPluginResult(reference);
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
                }
            }
        }

        pluginResultData.Result = builder.GetOutput();
        return pluginResultData;
    }
}

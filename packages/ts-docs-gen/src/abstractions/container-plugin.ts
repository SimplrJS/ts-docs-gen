import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData, PluginOptions } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiDefinitions } from "../api-items/api-definition-list";

export interface ApiContainer extends Contracts.ApiBaseItemDto {
    Members: Contracts.ApiItemReference[];
}

export interface ContainerMembersKindsGroup {
    Heading: string;
    Kinds: Contracts.ApiItemKinds[];
}

interface ContainerMembersGroup {
    Heading: string;
    MembersList: ApiDefinitions[];
}

export abstract class ContainerPlugin<TKind extends ApiContainer> extends BasePlugin<TKind> {
    private getItemsReferenceByKind(list: ContainerMembersKindsGroup[], members: ApiDefinitions[]): ContainerMembersGroup[] {
        const result: ContainerMembersGroup[] = [];
        let membersList = [...members];

        for (const item of list) {
            // Filter item references by kind
            const serializedApiItems = membersList.filter(x => item.Kinds.indexOf(x.Data.ApiKind) !== -1);
            // Remove references that was used
            membersList = membersList.filter(x => serializedApiItems.indexOf(x) === -1);

            result.push({
                Heading: item.Heading,
                MembersList: serializedApiItems
            });
        }

        // TODO: Using ApiKind.Any to add everything to other if some kind is not supported.
        if (membersList.length !== 0) {
            result.push({
                Heading: "Other",
                MembersList: membersList
            });
        }

        return result;
    }

    protected RenderMembersGroups(
        options: PluginOptions,
        list: ContainerMembersKindsGroup[],
        members: ApiDefinitions[]
    ): PluginResultData {
        const memberGroups = this.getItemsReferenceByKind(list, members);
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        for (const { Heading, MembersList } of memberGroups) {
            if (MembersList.length > 0) {
                builder
                    .Header(Heading, 2)
                    .EmptyLine();

                for (const member of MembersList) {
                    if (options.IsPluginResultExists(member.Reference)) {
                        builder
                            .Text(md => md.Header(md.Link(member.ToHeadingText(), member.Reference.Id, true), 3))
                            .EmptyLine();
                    } else {
                        switch (member.Data.ApiKind) {
                            case Contracts.ApiItemKinds.Namespace:
                            case Contracts.ApiItemKinds.Class: {
                                const renderedItem = options.GetItemPluginResult(member.Reference);
                                pluginResultData.Members.push({
                                    Reference: member.Reference,
                                    PluginResult: renderedItem
                                });

                                builder
                                    .Text(md => md.Header(md.Link(member.ToHeadingText(), member.Reference.Id, true), 3))
                                    .EmptyLine()
                                    .Text(GeneratorHelpers.RenderApiItemMetadata(renderedItem.ApiItem))
                                    .EmptyLine();
                                pluginResultData.UsedReferences.push(member.Reference.Id);
                                break;
                            }
                            default: {
                                const renderedItem = options.GetItemPluginResult(member.Reference);
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

                    if ((MembersList.indexOf(member) + 1) !== MembersList.length) {
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

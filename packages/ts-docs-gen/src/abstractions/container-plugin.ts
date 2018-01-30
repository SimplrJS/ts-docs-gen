import { Contracts } from "ts-extractor";
import { MarkdownBuilder, MarkdownGenerator } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData, PluginOptions, SupportedApiItemKindType } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiDefinitions } from "../api-items/api-definition-list";

export interface ApiContainer extends Contracts.ApiBaseDefinition {
    Members: Contracts.ApiItemReference[];
}

export interface ContainerMembersKindsGroup {
    Heading: string;
    Kinds: SupportedApiItemKindType[];
}

export interface RenderMemberGroupsOptions {
    IncludeHr: boolean;
    StartingHeadingLevel: number;
}

interface ContainerMembersGroup {
    Heading: string;
    MembersList: ApiDefinitions[];
}

export abstract class ContainerPlugin<TKind extends ApiContainer> extends BasePlugin<TKind> {
    private getItemsReferenceByKind(
        list: ContainerMembersKindsGroup[],
        members: ApiDefinitions[]
    ): ContainerMembersGroup[] {
        const result: ContainerMembersGroup[] = [];
        let membersList = [...members];

        for (const item of list) {
            // Filter item references by kind
            const serializedApiItems = membersList
                .filter(x => item.Kinds.indexOf(x.ApiItem.ApiKind) !== -1 ||
                    item.Kinds.indexOf(GeneratorHelpers.ApiDefinitionKind.Any) !== -1);
            // Remove references that was used
            membersList = membersList.filter(x => serializedApiItems.indexOf(x) === -1);

            result.push({
                Heading: item.Heading,
                MembersList: serializedApiItems
            });
        }

        return result;
    }

    protected RenderMemberGroups(
        pluginOptions: PluginOptions,
        list: ContainerMembersKindsGroup[],
        members: ApiDefinitions[],
        options?: Partial<RenderMemberGroupsOptions>
    ): PluginResultData {
        const resolvedOptions: RenderMemberGroupsOptions = {
            IncludeHr: true,
            StartingHeadingLevel: 2,
            ...options
        };

        const memberGroups = this.getItemsReferenceByKind(list, members);
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        for (const { Heading, MembersList } of memberGroups) {
            if (MembersList.length > 0) {
                builder
                    .Header(Heading, resolvedOptions.StartingHeadingLevel)
                    .EmptyLine();

                for (const member of MembersList) {
                    if (pluginOptions.IsPluginResultExists(member.Reference)) {
                        const headingLink = MarkdownGenerator.Link(member.ToHeadingText(), member.Reference.Id, true);

                        builder
                            .Text(md => md.Header(headingLink, resolvedOptions.StartingHeadingLevel + 1))
                            .EmptyLine();
                    } else {
                        switch (member.ApiItem.ApiKind) {
                            case Contracts.ApiDefinitionKind.Namespace:
                            case Contracts.ApiDefinitionKind.ImportNamespace:
                            case Contracts.ApiDefinitionKind.Class: {
                                const renderedItem = pluginOptions.GetItemPluginResult(member.Reference);
                                pluginResultData.Members.push({
                                    Reference: member.Reference,
                                    PluginResult: renderedItem
                                });

                                const headingLink = MarkdownGenerator.Link(member.ToHeadingText(), member.Reference.Id, true);
                                builder
                                    .Text(md => md.Header(headingLink, resolvedOptions.StartingHeadingLevel + 1))
                                    .EmptyLine()
                                    .Text(this.RenderApiItemMetadata(renderedItem.ApiItem))
                                    .EmptyLine();
                                pluginResultData.UsedReferences.push(member.Reference.Id);
                                break;
                            }
                            default: {
                                const renderedItem = pluginOptions.GetItemPluginResult(member.Reference);
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

                    if ((MembersList.indexOf(member) + 1) !== MembersList.length && resolvedOptions.IncludeHr) {
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

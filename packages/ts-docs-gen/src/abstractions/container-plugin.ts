import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { BasePlugin } from "./base-plugin";
import { PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiDefinition } from "../contracts/serialized-api-item";
import { ApiDefinitions } from "../api-items/api-definition-list";

export interface ApiContainer extends Contracts.ApiBaseItemDto {
    Members: Contracts.ApiItemReference[];
}

export interface ContainerMembersKindsGroup {
    Heading: string;
    Kinds: Contracts.ApiItemKinds[];
}

interface ContainerMembersReferencesGroup {
    Heading: string;
    MembersList: Array<SerializedApiDefinition<Contracts.ApiItemDto>>;
}

export abstract class ContainerPlugin<TKind extends ApiContainer> extends BasePlugin<TKind> {
    private getItemsReferenceByKind(
        list: ContainerMembersKindsGroup[],
        members: Array<SerializedApiDefinition<Contracts.ApiItemDto>>
    ): ContainerMembersReferencesGroup[] {
        const result: ContainerMembersReferencesGroup[] = [];
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
        list: ContainerMembersKindsGroup[],
        members: ApiDefinitions[]
    ): PluginResultData {
        // const membersReferences = this.getItemsReferenceByKind(list, members);
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        // FIXME: Fix this monstrosity.
        // for (const { Heading, MembersList } of membersReferences) {
        //     if (MembersList.length > 0) {
        //         builder
        //             .Header(Heading, 2)
        //             .EmptyLine();

        //         for (const reference of MembersList) {
        //             const apiItem = options.ExtractedData.Registry[reference.Id];

        //             if (options.IsPluginResultExists(reference)) {
        //                 builder
        //                     .Text(md => md.Header(md.Link(apiItem.Name, reference.Id, true), 3))
        //                     .EmptyLine();
        //                 pluginResultData.UsedReferences.push(reference.Id);
        //             } else {
        //                 switch (apiItem.ApiKind) {
        //                     case Contracts.ApiItemKinds.Namespace:
        //                     case Contracts.ApiItemKinds.Class: {
        //                         const renderedItem = options.GetItemPluginResult(reference);
        //                         pluginResultData.Members.push({
        //                             Reference: reference,
        //                             PluginResult: renderedItem
        //                         });

        //                         builder
        //                             .Text(md => md.Header(md.Link(renderedItem.ApiItem.Name, reference.Id, true), 3))
        //                             .EmptyLine()
        //                             .Text(GeneratorHelpers.RenderApiItemMetadata(renderedItem.ApiItem))
        //                             .EmptyLine();
        //                         pluginResultData.UsedReferences.push(reference.Id);
        //                         break;
        //                     }
        //                     default: {
        //                         const renderedItem = options.GetItemPluginResult(reference);
        //                         builder
        //                             .Text(renderedItem.Result)
        //                             .EmptyLine();

        //                         GeneratorHelpers.MergePluginResultData(pluginResultData, {
        //                             Headings: renderedItem.Headings,
        //                             UsedReferences: renderedItem.UsedReferences
        //                         });
        //                     }
        //                 }
        //             }

        //             if ((MembersList.indexOf(reference) + 1) !== MembersList.length) {
        //                 builder
        //                     .HorizontalRule(undefined, 10)
        //                     .EmptyLine();
        //             }
        //         }
        //     }
        // }

        pluginResultData.Result = builder.GetOutput();

        return pluginResultData;
    }
}

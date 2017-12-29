import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { GeneratorHelpers } from "../generator-helpers";
import { PluginMember, Plugin, SupportedApiItemKindType, PluginOptions, PluginResult, PluginHeading } from "../contracts/plugin";

interface RenderItems {
    References: string[];
    Headings: PluginHeading[];
    Output: string[];
    Members: PluginMember[];
}

export class ApiSourceFilePlugin implements Plugin<Contracts.ApiSourceFileDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.SourceFile];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    // TODO: Move this to helpers.
    private renderItems(data: PluginOptions<Contracts.ApiSourceFileDto>): RenderItems {
        const references = GeneratorHelpers.GetApiItemReferences(data.ExtractedData, data.ApiItem.Members);
        let referencesList: string[] = [];
        let headingsList: PluginHeading[] = [];
        const members: PluginMember[] = [];
        const builder = new MarkdownBuilder();

        for (const reference of references) {
            const apiItem = data.ExtractedData.Registry[reference.Id];

            if (data.IsPluginResultExists(reference)) {
                builder
                    .Text(md => md.Header(md.Link(apiItem.Name, reference.Id, true), 2))
                    .EmptyLine();
                referencesList.push(reference.Id);
            } else {
                switch (apiItem.ApiKind) {
                    case Contracts.ApiItemKinds.Namespace:
                    case Contracts.ApiItemKinds.Class: {

                        const renderedItem = data.GetItemPluginResult(reference);
                        members.push({
                            Reference: reference,
                            PluginResult: renderedItem
                        });

                        builder
                            .Text(md => md.Header(md.Link(renderedItem.ApiItem.Name, reference.Id, true), 2))
                            .EmptyLine();
                        referencesList.push(reference.Id);
                        break;
                    }
                    default: {
                        const renderedItem = data.GetItemPluginResult(reference);
                        builder
                            .Text(renderedItem.Result)
                            .EmptyLine();

                        headingsList = headingsList.concat(renderedItem.Headings);
                        referencesList = referencesList.concat(renderedItem.UsedReferences);
                    }
                }
            }
        }

        return {
            References: referencesList,
            Headings: headingsList,
            Output: builder.GetOutput(),
            Members: members
        };
    }

    public Render(data: PluginOptions<Contracts.ApiSourceFileDto>): PluginResult {
        const heading = path.basename(data.ApiItem.Name, path.extname(data.ApiItem.Name));
        let headings: PluginHeading[] = [
            {
                Heading: heading,
                ApiItemId: data.Reference.Id
            }
        ];

        const renderedItems = this.renderItems(data);
        const references: string[] = renderedItems.References;
        headings = headings.concat(renderedItems.Headings);

        // Header
        const builder = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Text(renderedItems.Output);

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: references,
            Result: builder.GetOutput(),
            Members: renderedItems.Members
        };
    }
}

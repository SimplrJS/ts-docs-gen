import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";
import { GeneratorHelpers } from "../generator-helpers";
import { ExtractorHelpers } from "../extractor-helpers";

interface RenderItems {
    References: string[];
    Output: string[];
}

export class ApiNamespacePlugin extends ApiItemPluginBase<Contracts.ApiNamespaceDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [this.ApiItemKinds.Namespace];
    }

    // TODO: FIX any.
    private renderItems(data: PluginData<Contracts.ApiNamespaceDto>): RenderItems {
        const referenceTuples = ExtractorHelpers.GetReferenceTuples(data.ExtractedData, data.ApiItem.Members);
        let references: string[] = [];
        const builder = new MarkdownBuilder();
        const [parentReferenceId] = data.Reference;

        for (const reference of referenceTuples) {
            const [itemId] = reference;
            const apiItem = data.ExtractedData.Registry[itemId];

            switch (apiItem.ApiKind) {
                case Contracts.ApiItemKinds.Namespace:
                case Contracts.ApiItemKinds.Class: {
                    data.AddItem(reference, apiItem, parentReferenceId);
                    break;
                }
                default: {
                    const renderedItem = data.GetItem(reference);
                    // Something to do with heading. Maybe heading reference registry?
                    references = reference.concat(renderedItem.References);
                    builder
                        .Text(renderedItem.RenderOutput)
                        .EmptyLine();

                }
            }
        }

        return {
            References: references,
            Output: builder.GetOutput()
        };
    }

    public Render(data: PluginData<Contracts.ApiNamespaceDto>): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const heading = alias;
        const renderedItems = this.renderItems(data);
        const references: string[] = renderedItems.References;

        // Header
        const builder = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Text(renderedItems.Output);

        return {
            Heading: heading,
            ApiItem: data.ApiItem,
            ParentId: data.ParentId,
            References: references,
            RenderOutput: builder.GetOutput()
        };
    }
}

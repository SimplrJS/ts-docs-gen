import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import * as path from "path";

import { GeneratorHelpers } from "../generator-helpers";
import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { ContainerPlugin, ContainerRenderMembers } from "../abstractions/container-plugin";

export class ApiClassPlugin extends ContainerPlugin<Contracts.ApiClassDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Class];
    }

    public Render(data: PluginOptions<Contracts.ApiClassDto>): PluginResult {
        const heading = path.basename(data.ApiItem.Name, path.extname(data.ApiItem.Name));
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: [
                {
                    Heading: heading,
                    ApiItemId: data.Reference.Id
                }
            ]
        };

        // Resolve ApiItems from references.
        const typeParameters = GeneratorHelpers
            .GetApiItemsFromReference<Contracts.ApiTypeParameterDto>(data.ApiItem.TypeParameters, data.ExtractedData);

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 1)
            .EmptyLine()
            .Text(GeneratorHelpers.RenderApiItemMetadata(data.ApiItem))
            .Code(GeneratorHelpers.ClassToString(
                data.ApiItem,
                typeParameters,
                data.Reference.Alias
            ), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        // ApiMembers
        const memberKindsList: ContainerRenderMembers[] = [
            {
                Heading: "Index",
                Kinds: [Contracts.ApiItemKinds.Index]
            },
            {
                Heading: "Constructor",
                Kinds: [Contracts.ApiItemKinds.ClassConstructor]
            },
            {
                Heading: "Methods",
                Kinds: [Contracts.ApiItemKinds.ClassMethod]
            },
            {
                Heading: "Properties",
                Kinds: [
                    Contracts.ApiItemKinds.ClassProperty,
                    Contracts.ApiItemKinds.GetAccessor,
                    Contracts.ApiItemKinds.SetAccessor,
                ]
            }
        ];
        const members = this.RenderMembers(memberKindsList, data);
        GeneratorHelpers.MergePluginResultData(pluginResult, members);

        return pluginResult;
    }
}

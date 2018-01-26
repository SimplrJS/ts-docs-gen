import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";

import { SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { BasePlugin } from "../abstractions/base-plugin";
import { ApiClassProperty } from "../api-items/definitions/api-class-property";

export class ApiClassPropertyPlugin extends BasePlugin<Contracts.ApiClassPropertyDto> {
    public SupportedApiDefinitionKind(): SupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiDefinitionKind.ClassProperty];
    }

    public Render(options: PluginOptions, apiItem: Contracts.ApiClassPropertyDto): PluginResult {
        const serializedApiItem = new ApiClassProperty(options.ExtractedData, apiItem, options.Reference);

        const heading = serializedApiItem.ToHeadingText();
        const pluginResult: PluginResult = {
            ...GeneratorHelpers.GetDefaultPluginResultData(),
            ApiItem: apiItem,
            Reference: options.Reference,
            Headings: [
                {
                    ApiItemId: options.Reference.Id,
                    Heading: heading
                }
            ],
            UsedReferences: [options.Reference.Id]
        };

        // Header
        pluginResult.Result = new MarkdownBuilder()
            .Header(heading, 3)
            .EmptyLine()
            .Text(this.RenderApiItemMetadata(apiItem))
            .Code(serializedApiItem.ToText(), GeneratorHelpers.DEFAULT_CODE_OPTIONS)
            .GetOutput();

        const typeResult = this.RenderType(options.ExtractedData, serializedApiItem.Type);
        GeneratorHelpers.MergePluginResultData(pluginResult, typeResult);

        return pluginResult;
    }
}

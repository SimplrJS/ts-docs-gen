import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";
import { Plugin, PluginOptions, PluginResult, PluginSupportedApiItemKindType, PluginHeading } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiDefaultPlugin implements Plugin<Contracts.ApiItemDto> {
    public SupportedApiItemKinds(): PluginSupportedApiItemKindType[] {
        return [GeneratorHelpers.ApiItemKinds.Any];
    }

    public CheckApiItem(item: Contracts.ApiItemDto): boolean {
        return true;
    }

    public Render(data: PluginOptions<Contracts.ApiItemDto>): PluginResult {
        const heading = `${data.ApiItem.ApiKind}: ${data.Reference.Alias}`;
        const headings: PluginHeading[] = [
            {
                ApiItemId: data.Reference.Id,
                Heading: heading
            }
        ];

        const result: string[] = [
            MarkdownGenerator.Header(heading, 2)
        ];

        return {
            Headings: headings,
            Reference: data.Reference,
            ApiItem: data.ApiItem,
            UsedReferences: [],
            Result: result,
        };
    }
}

import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";
import { Plugin, PluginOptions, PluginResult, SupportedApiItemKindType, PluginHeading } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiDefaultPlugin implements Plugin<Contracts.ApiItemDto> {
    public SupportedApiItemKinds(): SupportedApiItemKindType[] {
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
            MarkdownGenerator.Header(heading, 3)
        ];

        return {
            ApiItem: data.ApiItem,
            Reference: data.Reference,
            Headings: headings,
            UsedReferences: [],
            Result: result,
        };
    }
}

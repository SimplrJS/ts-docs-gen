import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";

export class ApiDefaultPlugin extends ApiItemPluginBase {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Any];
    }

    public Render(data: PluginData): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const output: string[] = [
            MarkdownGenerator.header(`${data.ApiItem.ApiKind}: ${alias}`, 2)
        ];

        return {
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: output
        };
    }
}

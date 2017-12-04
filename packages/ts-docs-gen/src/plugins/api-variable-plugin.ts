import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginData } from "../contracts/plugin-data";

export class ApiVariablePlugin extends ApiItemPluginBase {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Variable];
    }

    public Render(data: PluginData): RenderItemOutputDto {
        const [, alias] = data.Reference;
        const apiItem = data.ApiItem as Contracts.ApiVariableDto;
        const output: string[] = [
            MarkdownGenerator.header(alias, 2),
            "",
            MarkdownGenerator.header("Type", 3),
            "",
            apiItem.Type.Text
        ];

        return {
            ApiItem: data.ApiItem,
            References: [],
            RenderOutput: output
        };
    }
}

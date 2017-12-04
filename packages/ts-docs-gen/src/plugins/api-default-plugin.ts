import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";

export class ApiDefaultPlugin extends ApiItemPluginBase {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Any];
    }

    public Render(item: Contracts.ApiItemDto, getItem: (itemId: string, alias: string) => RenderItemOutputDto): RenderItemOutputDto {
        const output: string[] = [
            MarkdownGenerator.header(`${item.Name}: ${item.ApiKind.toUpperCase()}`, 2)
        ];

        return {
            ApiItem: item,
            References: [],
            RenderOutput: output
        };
    }
}

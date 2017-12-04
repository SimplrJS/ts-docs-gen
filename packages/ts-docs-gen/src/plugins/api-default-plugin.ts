import { Contracts } from "ts-extractor";
import { MarkdownGenerator } from "@simplrjs/markdown";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType } from "../contracts/supported-api-item-kind-type";
import { RenderItemOutputDto } from "../contracts/render-item-output-dto";
import { PluginOptions } from "../contracts/plugin-options";
import { ReferenceTuple } from "../contracts/reference-tuple";

export class ApiDefaultPlugin extends ApiItemPluginBase {
    public SupportedApiItemsKinds(): SupportedApiItemKindType[] {
        return [this.SupportKind.Any];
    }

    public Render(reference: ReferenceTuple, item: Contracts.ApiItemDto, options: PluginOptions): RenderItemOutputDto {
        const [, alias] = reference;
        const output: string[] = [
            MarkdownGenerator.header(`${item.ApiKind}: ${alias}`, 2)
        ];

        return {
            ApiItem: item,
            References: [],
            RenderOutput: output
        };
    }
}

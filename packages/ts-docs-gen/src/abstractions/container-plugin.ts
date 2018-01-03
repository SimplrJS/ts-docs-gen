import { Contracts } from "ts-extractor";
import { MarkdownBuilder } from "@simplrjs/markdown";
import { BasePlugin } from "./base-plugin";
import { PluginOptions, PluginResultData } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";

export interface ApiContainer extends Contracts.ApiBaseItemDto {
    Members: Contracts.ApiItemReference[];
}

export interface ContainerRenderMembers {
    Heading: string;
    Kinds: Contracts.ApiItemKinds[];
}

export abstract class ContainerPlugin<TKind extends ApiContainer> extends BasePlugin<TKind> {
    protected RenderMembers(list: ContainerRenderMembers[], data: PluginOptions<TKind>): PluginResultData {
        const references = GeneratorHelpers.GetApiItemReferences(data.ExtractedData, data.ApiItem.Members);
        const renderedItems = references.map(x => data.GetItemPluginResult(x));
        const pluginResultData = GeneratorHelpers.GetDefaultPluginResultData();
        const builder = new MarkdownBuilder();

        for (const memberKind of list) {
            const pluginResultsByKind = renderedItems.filter(x => memberKind.Kinds.indexOf(x.ApiItem.ApiKind) !== -1);

            if (pluginResultsByKind.length > 0) {
                builder
                    .Header(memberKind.Heading, 2)
                    .EmptyLine();

                for (const member of pluginResultsByKind) {
                    GeneratorHelpers.MergePluginResultData(pluginResultData, member);

                    builder
                        .Text(member.Result)
                        .EmptyLine();
                }
            }
        }

        pluginResultData.Result = builder.GetOutput();
        return pluginResultData;
    }
}

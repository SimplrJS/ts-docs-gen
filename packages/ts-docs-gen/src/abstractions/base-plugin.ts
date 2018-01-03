import { Contracts } from "ts-extractor";
import { Plugin, SupportedApiItemKindType, PluginOptions, PluginResult } from "../contracts/plugin";

export abstract class BasePlugin<TKind = Contracts.ApiItemDto> implements Plugin<TKind> {
    public abstract SupportedApiItemKinds(): SupportedApiItemKindType[];

    public CheckApiItem(item: TKind): boolean {
        return true;
    }

    public abstract Render(data: PluginOptions<TKind>): PluginResult;
}

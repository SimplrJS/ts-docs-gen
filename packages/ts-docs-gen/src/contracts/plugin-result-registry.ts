import { PluginResult } from "./plugin";
import { ApiItemReference } from "./api-item-reference";

export interface ReadonlyPluginResultRegistry {
    GetItem(itemReference: ApiItemReference): PluginResult | undefined;
    Exists(itemReference: ApiItemReference): boolean;
}

export interface PluginResultRegistry extends ReadonlyPluginResultRegistry {
    AddItem(itemReference: ApiItemReference, pluginResult: PluginResult): void;
}

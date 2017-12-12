import { Contracts } from "ts-extractor";

import { ApiItemPluginBase } from "../abstractions/api-item-plugin-base";
import { SupportedApiItemKindType, ApiItemKindsAdditional } from "../contracts/supported-api-item-kind-type";

// TODO: Rename to PluginRegistry.
export class PluginRegistry {
    constructor() {

        // Initialize Plugins map.
        for (const [, kindValue] of Object.entries(Contracts.ApiItemKinds)) {
            this.registeredPlugins.set(kindValue as Contracts.ApiItemKinds, []);
        }
    }

    private registeredPlugins: Map<Contracts.ApiItemKinds, ApiItemPluginBase[]> = new Map();

    private isSupportedKindsHasAny(kinds: SupportedApiItemKindType[]): kinds is ApiItemKindsAdditional[] {
        return Boolean(kinds.find(x => x === ApiItemKindsAdditional.Any));
    }

    public Register(plugin: ApiItemPluginBase): void {
        const supportedKinds = plugin.SupportedApiItemKinds();

        if (this.isSupportedKindsHasAny(supportedKinds)) {
            for (const [key, value] of this.registeredPlugins) {
                this.registeredPlugins.set(key, [plugin, ...value]);
            }
            return;
        }

        // FIXME: Remove `as`. Somehow it doesn't work.
        for (const kind of supportedKinds as Contracts.ApiItemKinds[]) {
            const registeredPluginsOfKind = this.registeredPlugins.get(kind) || [];
            this.registeredPlugins.set(kind, [plugin, ...registeredPluginsOfKind]);
        }
    }

    public GetPluginsByKind(kind: Contracts.ApiItemKinds): ApiItemPluginBase[] {
        return this.registeredPlugins.get(kind) || [];
    }
}

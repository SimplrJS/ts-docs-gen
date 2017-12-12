import { Contracts } from "ts-extractor";
import { Plugin, PluginSupportedApiItemKindType, ApiItemKindsAdditional } from "../contracts/plugin";

export class PluginRegistry {
    constructor() {

        // Initialize Plugins map.
        for (const [, kindValue] of Object.entries(Contracts.ApiItemKinds)) {
            this.registeredPlugins.set(kindValue as Contracts.ApiItemKinds, []);
        }
    }

    private registeredPlugins: Map<Contracts.ApiItemKinds, Plugin[]> = new Map();

    private isSupportedKindsHasAny(kinds: PluginSupportedApiItemKindType[]): kinds is ApiItemKindsAdditional[] {
        return Boolean(kinds.find(x => x === ApiItemKindsAdditional.Any));
    }

    public Register(plugin: Plugin): void {
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

    public GetPluginsByKind(kind: Contracts.ApiItemKinds): Plugin[] {
        return this.registeredPlugins.get(kind) || [];
    }
}

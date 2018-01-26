import { Contracts } from "ts-extractor";
import { Plugin, SupportedApiItemKindType, ApiDefinitionKindAdditional } from "../contracts/plugin";

export class PluginRegistry {
    constructor() {

        // Initialize Plugins map.
        for (const [, kindValue] of Object.entries(Contracts.ApiDefinitionKind)) {
            this.registeredPlugins.set(kindValue as Contracts.ApiDefinitionKind, []);
        }
    }

    private registeredPlugins: Map<Contracts.ApiDefinitionKind, Plugin[]> = new Map();

    private isSupportedKindsHasAny(kinds: SupportedApiItemKindType[]): kinds is ApiDefinitionKindAdditional[] {
        return Boolean(kinds.find(x => x === ApiDefinitionKindAdditional.Any));
    }

    public Register(plugin: Plugin): void {
        const supportedKinds: SupportedApiItemKindType[] = plugin.SupportedApiDefinitionKind();

        if (this.isSupportedKindsHasAny(supportedKinds)) {
            for (const [key, value] of this.registeredPlugins) {
                this.registeredPlugins.set(key, [plugin, ...value]);
            }
            return;
        } else {
            for (const kind of supportedKinds as Contracts.ApiDefinitionKind[]) {
                const registeredPluginsOfKind = this.registeredPlugins.get(kind) || [];
                this.registeredPlugins.set(kind, [plugin, ...registeredPluginsOfKind]);
            }
        }
    }

    public GetPluginsByKind(kind: Contracts.ApiDefinitionKind): Plugin[] {
        return this.registeredPlugins.get(kind) || [];
    }
}

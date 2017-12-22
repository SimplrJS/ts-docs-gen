import { ApiItemReference } from "../contracts/api-item-reference";
import { PluginResult } from "../contracts/plugin";
import { PluginResultRegistry as PluginResultRegistryInterface } from "../contracts/plugin-result-registry";

export class PluginResultRegistry implements PluginResultRegistryInterface {
    private results: Map<ApiItemReference, PluginResult> = new Map();

    private getKey(itemReference: ApiItemReference): ApiItemReference | undefined {
        for (const [reference] of this.results) {
            if (itemReference.Alias === reference.Alias &&
                itemReference.Id === reference.Id) {
                return reference;
            }
        }

        return undefined;
    }

    public AddItem(itemReference: ApiItemReference, pluginResult: PluginResult): void {
        const key = this.getKey(itemReference) || itemReference;
        this.results.set(key, pluginResult);
    }

    public GetItem(itemReference: ApiItemReference): PluginResult | undefined {
        const realKey = this.getKey(itemReference);
        if (realKey != null) {
            return this.results.get(realKey);
        } else {
            return undefined;
        }
    }

    public Exists(itemReference: ApiItemReference): boolean {
        return this.getKey(itemReference) != null;
    }
}

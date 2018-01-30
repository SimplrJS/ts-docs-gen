import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemReferenceRegistry as ApiItemReferenceRegistryInterface } from "../contracts/api-item-reference-registry";

export class ApiItemReferenceRegistry<TValue> implements ApiItemReferenceRegistryInterface<TValue> {
    private map: Map<ApiItemReference, TValue> = new Map();

    private getKey(itemReference: ApiItemReference): ApiItemReference | undefined {
        for (const [reference] of this.map) {
            if (itemReference.Alias === reference.Alias &&
                itemReference.Id === reference.Id) {
                return reference;
            }
        }

        return undefined;
    }

    public AddItem(itemReference: ApiItemReference, value: TValue): void {
        const key = this.getKey(itemReference) || itemReference;
        this.map.set(key, value);
    }

    public GetItem(itemReference: ApiItemReference): TValue | undefined {
        const realKey = this.getKey(itemReference);
        if (realKey != null) {
            return this.map.get(realKey);
        } else {
            return undefined;
        }
    }

    public Exists(itemReference: ApiItemReference): boolean {
        return this.getKey(itemReference) != null;
    }
}

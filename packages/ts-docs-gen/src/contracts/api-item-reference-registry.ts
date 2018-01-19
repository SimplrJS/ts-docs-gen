import { ApiItemReference } from "./api-item-reference";

export interface ReadonlyApiItemReferenceRegistry<TValue> {
    GetItem(itemReference: ApiItemReference): TValue | undefined;
    Exists(itemReference: ApiItemReference): boolean;
}

export interface ApiItemReferenceRegistry<TValue> extends ReadonlyApiItemReferenceRegistry<TValue> {
    AddItem(itemReference: ApiItemReference, value: TValue): void;
}

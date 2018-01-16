import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";

export class ApiNamespace extends BaseApiItem<Contracts.ApiNamespaceDto> {
    public ToStringArray(alias?: string): string[] {
        const name = alias || this.Data.Name;

        return [`namespace ${name}`];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}
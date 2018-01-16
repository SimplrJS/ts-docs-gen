import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiVariable extends BaseApiItem<Contracts.ApiVariableDto> {
    public ToStringArray(alias?: string): string[] {
        const name = alias || this.Data.Name;
        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [
            `${this.Data.VariableDeclarationType} ${name}: ${type};`
        ];
    }

    public ToSimpleString(alias?: string): string {
        return alias || this.Data.Name;
    }
}

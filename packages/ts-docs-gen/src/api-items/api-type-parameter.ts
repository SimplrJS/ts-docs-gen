import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiTypeParameter extends BaseApiItem<Contracts.ApiTypeParameterDto> {
    public ToStringArray(alias?: string, mapped?: boolean): string[] {
        const name = alias || this.Data.Name;

        const constraintKeyword = mapped ? "in" : "extends";

        let constraintString: string;
        if (this.Data.ConstraintType != null) {
            const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.ConstraintType);
            constraintString = ` ${constraintKeyword} ${type}`;
        } else {
            constraintString = "";
        }

        let defaultTypeString: string;
        if (this.Data.DefaultType != null) {
            const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.DefaultType);
            defaultTypeString = ` = ${type}`;
        } else {
            defaultTypeString = "";
        }

        return [`${name}${constraintString}${defaultTypeString}`];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}

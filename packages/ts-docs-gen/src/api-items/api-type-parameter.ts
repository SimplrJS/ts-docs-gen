import { Contracts } from "ts-extractor";

import { BaseApiItem } from "../abstractions/base-api-item";

export class ApiTypeParameter extends BaseApiItem<Contracts.ApiTypeParameterDto> {
    public ToStringArray(alias?: string, mapped?: boolean): string[] {
        const name = alias || this.Data.Name;

        const constraintKeyword = mapped ? "in" : "extends";

        let constraintString: string;
        if (this.Data.ConstraintType != null) {
            constraintString = ` ${constraintKeyword} ${this.Data.ConstraintType.Text}`;
        } else {
            constraintString = "";
        }

        const defaultType = this.Data.DefaultType != null ? ` = ${this.Data.DefaultType.Text}` : "";

        return [`${name}${constraintString}${defaultType}`];
    }

    public ToSimpleString(): string {
        return this.Data.Name;
    }
}

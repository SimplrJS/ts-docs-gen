import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";

export class ApiTypeParameter extends ApiDefinitionBase<Contracts.ApiTypeParameterDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiTypeParameterDto) {
        super(extractedData, apiItem);

        this.constraintType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.ConstraintType);
        this.defaultType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.DefaultType);
    }

    private constraintType: SerializedApiType | undefined;

    public get ConstraintType(): SerializedApiType | undefined {
        return this.constraintType;
    }

    private defaultType: SerializedApiType | undefined;

    public get DefaultType(): SerializedApiType | undefined {
        return this.defaultType;
    }

    public ToText(alias?: string, mapped?: boolean): string[] {
        const name = alias || this.Data.Name;

        const constraintKeyword = mapped ? "in" : "extends";

        let constraintString: string;
        if (this.Data.ConstraintType != null) {
            const type = this.SerializedTypeToString(this.ConstraintType);
            constraintString = ` ${constraintKeyword} ${type}`;
        } else {
            constraintString = "";
        }

        let defaultTypeString: string;
        if (this.Data.DefaultType != null) {
            const type = this.SerializedTypeToString(this.DefaultType);
            defaultTypeString = ` = ${type}`;
        } else {
            defaultTypeString = "";
        }

        return [`${name}${constraintString}${defaultTypeString}`];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}

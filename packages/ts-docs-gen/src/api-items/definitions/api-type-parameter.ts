import { Contracts, ExtractDto } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { SerializedApiType } from "../../contracts/serialized-api-item";
import { ApiDefinitionBase } from "../api-definition-base";
import { ApiItemReference } from "../../contracts/api-item-reference";
import { ApiTypes } from "../api-type-list";

export class ApiTypeParameter extends ApiDefinitionBase<Contracts.ApiTypeParameterDto> {
    constructor(extractedData: ExtractDto, apiItem: Contracts.ApiTypeParameterDto, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        if (this.Data.ConstraintType != null) {
            this.constraintType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.ConstraintType);
        }
        if (this.Data.DefaultType != null) {
            this.defaultType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.DefaultType);
        }
    }

    private constraintType: ApiTypes | undefined;

    public get ConstraintType(): ApiTypes | undefined {
        return this.constraintType;
    }

    private defaultType: ApiTypes | undefined;

    public get DefaultType(): ApiTypes | undefined {
        return this.defaultType;
    }

    public ToText(mapped?: boolean): string[] {
        const name = this.Reference.Alias || this.Data.Name;

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
